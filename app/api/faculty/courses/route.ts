import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'faculty_courses_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['faculty', 'admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    // Find faculty record
    const faculty = await prisma.faculty.findUnique({
      where: { profileId: session?.userId },
    });

    // If admin or missing faculty record fallback to all or empty
    const whereClause = faculty ? { facultyId: faculty.id } : session?.role === 'admin' ? {} : { id: 'none' };

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            enrollments: true,
            assignments: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    const formatted = courses.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      credits: c.credits,
      semester: c.semester,
      section: c.section,
      enrollmentsCount: c._count.enrollments,
      assignmentsCount: c._count.assignments,
    }));

    return NextResponse.json({ courses: formatted });
  } catch (error: any) {
    console.error('Faculty Courses GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty courses', courses: [] }, { status: 500 });
  }
}
