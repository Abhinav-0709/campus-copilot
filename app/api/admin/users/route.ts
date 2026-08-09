import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_users_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const profiles = await prisma.profile.findMany({
      include: {
        student: { select: { rollNumber: true, semester: true } },
        faculty: { select: { employeeId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    for (const p of profiles) {
      if (p.role === 'student' && !p.student) {
        const createdStudent = await prisma.student.create({
          data: {
            profileId: p.id,
            rollNumber: `CS2026${Math.floor(100 + Math.random() * 900)}`,
            semester: 1,
            section: 'A',
            batch: '2024-2028',
          },
          select: { rollNumber: true, semester: true },
        });
        (p as any).student = createdStudent;
      } else if (p.role === 'faculty' && !p.faculty) {
        const createdFaculty = await prisma.faculty.create({
          data: {
            profileId: p.id,
            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          },
          select: { employeeId: true },
        });
        (p as any).faculty = createdFaculty;
      }
    }

    const users = profiles.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      department: p.department || 'General',
      rollOrEmp: p.student?.rollNumber || p.faculty?.employeeId || 'N/A',
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch system users', users: [] }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_users_delete', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    // Perform efficient bulk set-based cascade deletion inside a transaction with extended timeout
    const deletedProfile = await prisma.$transaction(
      async (tx) => {
        // 1. Find linked Faculty or Student record
        const faculty = await tx.faculty.findUnique({ where: { profileId } });
        const student = await tx.student.findUnique({ where: { profileId } });

        if (faculty) {
          // Delete notices posted by faculty
          await tx.notice.deleteMany({ where: { facultyId: faculty.id } });

          // Find all courses taught by faculty
          const courses = await tx.course.findMany({
            where: { facultyId: faculty.id },
            select: { id: true },
          });
          const courseIds = courses.map((c) => c.id);

          if (courseIds.length > 0) {
            await tx.submission.deleteMany({ where: { assignment: { courseId: { in: courseIds } } } });
            await tx.assignment.deleteMany({ where: { courseId: { in: courseIds } } });
            await tx.attendance.deleteMany({ where: { courseId: { in: courseIds } } });
            await tx.grade.deleteMany({ where: { courseId: { in: courseIds } } });
            await tx.schedule.deleteMany({ where: { courseId: { in: courseIds } } });
            await tx.enrollment.deleteMany({ where: { courseId: { in: courseIds } } });
            await tx.course.deleteMany({ where: { id: { in: courseIds } } });
          }

          await tx.faculty.delete({ where: { id: faculty.id } });
        }

        if (student) {
          await tx.submission.deleteMany({ where: { studentId: student.id } });
          await tx.attendance.deleteMany({ where: { studentId: student.id } });
          await tx.grade.deleteMany({ where: { studentId: student.id } });
          await tx.enrollment.deleteMany({ where: { studentId: student.id } });
          await tx.feeRecord.deleteMany({ where: { studentId: student.id } });
          await tx.student.delete({ where: { id: student.id } });
        }

        // Delete Profile level relations
        await tx.leaveRequest.deleteMany({ where: { profileId } });
        await tx.communityPost.deleteMany({ where: { profileId } });
        await tx.notification.deleteMany({ where: { profileId } });

        // Chat messages and sessions
        await tx.chatMessage.deleteMany({ where: { session: { profileId } } });
        await tx.chatSession.deleteMany({ where: { profileId } });

        // Finally delete the Profile
        return await tx.profile.delete({
          where: { id: profileId },
        });
      },
      {
        timeout: 30000,
        maxWait: 10000,
      }
    );

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'DELETE_USER',
      resource: 'Profile',
      resourceId: profileId,
      metadata: { email: deletedProfile.email, role: deletedProfile.role },
    });

    return NextResponse.json({ success: true, message: `User ${deletedProfile.email} deleted successfully` });
  } catch (error: any) {
    console.error('Admin Users DELETE Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to delete user' : error.message },
      { status: 500 }
    );
  }
}
