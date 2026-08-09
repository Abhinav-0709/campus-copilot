import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const rateCheck = checkRateLimit(req, 'faculty_course_students', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['faculty', 'admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const { courseId } = await context.params;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          include: {
            profile: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { student: { rollNumber: 'asc' } },
    });

    const students = enrollments.map((e) => ({
      id: e.student.id,
      name: e.student.profile.name,
      email: e.student.profile.email,
      rollNumber: e.student.rollNumber,
      section: e.student.section,
    }));

    return NextResponse.json({ students });
  } catch (error: any) {
    console.error('Faculty Course Students GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch course students', students: [] }, { status: 500 });
  }
}
