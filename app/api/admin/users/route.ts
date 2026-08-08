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

    // Cascade deletion of all dependent entities inside a transaction
    const deletedProfile = await prisma.$transaction(async (tx) => {
      // 1. Find linked Faculty or Student record
      const faculty = await tx.faculty.findUnique({ where: { profileId } });
      const student = await tx.student.findUnique({ where: { profileId } });

      if (faculty) {
        // Delete notices posted by faculty
        await tx.notice.deleteMany({ where: { facultyId: faculty.id } });

        // Handle courses taught by faculty
        const courses = await tx.course.findMany({ where: { facultyId: faculty.id } });
        for (const course of courses) {
          await tx.submission.deleteMany({ where: { assignment: { courseId: course.id } } });
          await tx.assignment.deleteMany({ where: { courseId: course.id } });
          await tx.attendance.deleteMany({ where: { courseId: course.id } });
          await tx.grade.deleteMany({ where: { courseId: course.id } });
          await tx.schedule.deleteMany({ where: { courseId: course.id } });
          await tx.enrollment.deleteMany({ where: { courseId: course.id } });
          await tx.course.delete({ where: { id: course.id } });
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

      const chatSessions = await tx.chatSession.findMany({ where: { profileId } });
      for (const cs of chatSessions) {
        await tx.chatMessage.deleteMany({ where: { sessionId: cs.id } });
        await tx.chatSession.delete({ where: { id: cs.id } });
      }

      // Finally delete the Profile
      return await tx.profile.delete({
        where: { id: profileId },
      });
    });

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
