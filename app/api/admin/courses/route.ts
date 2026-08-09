import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_courses_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    // Ensure all faculty profiles have linked Faculty table records
    const facultyProfiles = await prisma.profile.findMany({
      where: { role: 'faculty' },
      include: { faculty: true },
    });

    for (const fp of facultyProfiles) {
      if (!fp.faculty) {
        await prisma.faculty.create({
          data: {
            profileId: fp.id,
            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }
    }

    const [courses, facultyList] = await Promise.all([
      prisma.course.findMany({
        include: {
          faculty: {
            include: {
              profile: { select: { name: true, email: true } },
            },
          },
          _count: {
            select: {
              enrollments: true,
              schedules: true,
              assignments: true,
            },
          },
        },
        orderBy: { code: 'asc' },
      }),
      prisma.faculty.findMany({
        include: {
          profile: { select: { name: true, email: true, department: true } },
        },
        orderBy: { profile: { name: 'asc' } },
      }),
    ]);

    const formattedCourses = courses.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      credits: c.credits,
      semester: c.semester,
      department: c.department,
      section: c.section,
      facultyId: c.facultyId,
      facultyName: c.faculty?.profile?.name || 'Unassigned',
      facultyEmail: c.faculty?.profile?.email || '',
      enrollmentsCount: c._count.enrollments,
      schedulesCount: c._count.schedules,
      assignmentsCount: c._count.assignments,
    }));

    const formattedFaculty = facultyList.map((f) => ({
      id: f.id,
      name: f.profile.name,
      email: f.profile.email,
      department: f.profile.department,
      employeeId: f.employeeId,
    }));

    return NextResponse.json({ courses: formattedCourses, facultyList: formattedFaculty });
  } catch (error: any) {
    console.error('Admin Courses GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses', courses: [], facultyList: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_courses_post', { limit: 30 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const body = await req.json();
    const { code, name, credits, semester, department, section, facultyId } = body;

    if (!code || !name || !facultyId) {
      return NextResponse.json({ error: 'Course code, name, and faculty selection are required.' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        credits: Number(credits) || 3,
        semester: Number(semester) || 1,
        department: department?.trim() || 'Computer Science',
        section: section?.trim()?.toUpperCase() || null,
        facultyId,
      },
      include: {
        faculty: { include: { profile: { select: { name: true } } } },
      },
    });

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'CREATE_COURSE',
      resource: 'Course',
      resourceId: course.id,
      metadata: { code: course.code, name: course.name },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error('Admin Courses POST Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A course with this course code already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_courses_delete', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('id');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.submission.deleteMany({ where: { assignment: { courseId } } });
        await tx.assignment.deleteMany({ where: { courseId } });
        await tx.attendance.deleteMany({ where: { courseId } });
        await tx.grade.deleteMany({ where: { courseId } });
        await tx.schedule.deleteMany({ where: { courseId } });
        await tx.enrollment.deleteMany({ where: { courseId } });
        await tx.course.delete({ where: { id: courseId } });
      },
      { timeout: 30000 }
    );

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'DELETE_COURSE',
      resource: 'Course',
      resourceId: courseId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Courses DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete course' }, { status: 500 });
  }
}
