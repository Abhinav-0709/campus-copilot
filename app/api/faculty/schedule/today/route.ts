import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';
import { DayOfWeek } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'faculty_schedule_today', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['faculty', 'admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = days[new Date().getDay()] as DayOfWeek;

    const faculty = await prisma.faculty.findUnique({
      where: { profileId: session?.userId },
    });

    const courseWhere = faculty ? { facultyId: faculty.id } : {};

    const schedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek: todayName,
        course: courseWhere,
      },
      include: {
        course: { select: { id: true, code: true, name: true, section: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    const lectures = schedules.map((s) => ({
      id: s.id,
      courseId: s.courseId,
      course: `${s.course.name} (${s.course.code})`,
      section: s.course.section ? `Section ${s.course.section}` : 'All Enrolled',
      time: `${s.startTime} - ${s.endTime}`,
      room: s.room,
    }));

    return NextResponse.json({ lectures });
  } catch (error: any) {
    console.error('Faculty Today Schedule Error:', error);
    return NextResponse.json({ error: 'Failed to fetch today schedule', lectures: [] }, { status: 500 });
  }
}
