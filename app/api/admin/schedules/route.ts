import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';
import { logAuditEvent } from '@/lib/audit-logger';
import { DayOfWeek } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_schedules_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const [schedules, courses] = await Promise.all([
      prisma.schedule.findMany({
        include: {
          course: {
            include: {
              faculty: {
                include: {
                  profile: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      }),
      prisma.course.findMany({
        select: { id: true, code: true, name: true, section: true },
        orderBy: { code: 'asc' },
      }),
    ]);

    const formattedSchedules = schedules.map((s) => ({
      id: s.id,
      courseId: s.courseId,
      courseCode: s.course.code,
      courseName: s.course.name,
      courseSection: s.course.section,
      facultyName: s.course.faculty?.profile?.name || 'Unassigned',
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
    }));

    return NextResponse.json({ schedules: formattedSchedules, courses });
  } catch (error: any) {
    console.error('Admin Schedules GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules', schedules: [], courses: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_schedules_post', { limit: 30 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const body = await req.json();
    const { courseId, dayOfWeek, startTime, endTime, room } = body;

    if (!courseId || !dayOfWeek || !startTime || !endTime || !room) {
      return NextResponse.json({ error: 'All fields (course, day, times, room) are required.' }, { status: 400 });
    }

    const schedule = await prisma.schedule.create({
      data: {
        courseId,
        dayOfWeek: dayOfWeek.toLowerCase() as DayOfWeek,
        startTime,
        endTime,
        room: room.trim(),
      },
      include: {
        course: { select: { code: true, name: true } },
      },
    });

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'CREATE_SCHEDULE',
      resource: 'Schedule',
      resourceId: schedule.id,
      metadata: { courseId, dayOfWeek, room },
    });

    return NextResponse.json({ success: true, schedule });
  } catch (error: any) {
    console.error('Admin Schedules POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create schedule' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_schedules_delete', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Schedule ID is required' }, { status: 400 });
    }

    await prisma.schedule.delete({ where: { id } });

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'DELETE_SCHEDULE',
      resource: 'Schedule',
      resourceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Schedules DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete schedule' }, { status: 500 });
  }
}
