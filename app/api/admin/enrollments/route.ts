import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_enrollments_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    // Ensure all student profiles have linked Student table records
    const studentProfiles = await prisma.profile.findMany({
      where: { role: 'student' },
      include: { student: true },
    });

    for (const sp of studentProfiles) {
      if (!sp.student) {
        await prisma.student.create({
          data: {
            profileId: sp.id,
            rollNumber: `CS2026${Math.floor(100 + Math.random() * 900)}`,
            semester: 1,
            section: 'A',
            batch: '2024-2028',
          },
        });
      }
    }

    const [enrollments, students, courses] = await Promise.all([
      prisma.enrollment.findMany({
        include: {
          student: {
            include: {
              profile: { select: { name: true, email: true } },
            },
          },
          course: {
            select: { id: true, code: true, name: true, section: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.findMany({
        include: {
          profile: { select: { name: true, email: true, department: true } },
        },
        orderBy: { profile: { name: 'asc' } },
      }),
      prisma.course.findMany({
        select: { id: true, code: true, name: true, section: true },
        orderBy: { code: 'asc' },
      }),
    ]);

    const formattedEnrollments = enrollments.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      studentName: e.student.profile.name,
      studentRoll: e.student.rollNumber,
      studentSection: e.student.section,
      courseId: e.courseId,
      courseCode: e.course.code,
      courseName: e.course.name,
      courseSection: e.course.section,
      createdAt: e.createdAt,
    }));

    const formattedStudents = students.map((s) => ({
      id: s.id,
      name: s.profile.name,
      email: s.profile.email,
      rollNumber: s.rollNumber,
      section: s.section,
      semester: s.semester,
    }));

    return NextResponse.json({
      enrollments: formattedEnrollments,
      students: formattedStudents,
      courses,
    });
  } catch (error: any) {
    console.error('Admin Enrollments GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments', enrollments: [], students: [], courses: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_enrollments_post', { limit: 30 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const body = await req.json();
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'Student and Course are both required.' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId },
      include: {
        student: { include: { profile: { select: { name: true } } } },
        course: { select: { code: true, name: true } },
      },
    });

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'ENROLL_STUDENT',
      resource: 'Enrollment',
      resourceId: enrollment.id,
      metadata: { studentId, courseId, courseCode: enrollment.course.code },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error: any) {
    console.error('Admin Enrollments POST Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Student is already enrolled in this course.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to enroll student' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_enrollments_delete', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
    }

    await prisma.enrollment.delete({ where: { id } });

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'UNENROLL_STUDENT',
      resource: 'Enrollment',
      resourceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Enrollments DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete enrollment' }, { status: 500 });
  }
}
