import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    let userEmail: string | null = null;
    let userId: string | null = null;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-url')) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userEmail = user.email || null;
        userId = user.id;
      }
    }

    // Fallback profile if Supabase user not logged in
    let profile = null;
    if (userId) {
      profile = await prisma.profile.findUnique({
        where: { id: userId },
        include: {
          student: true,
          faculty: true,
        },
      });
    } else if (userEmail) {
      profile = await prisma.profile.findUnique({
        where: { email: userEmail },
        include: {
          student: true,
          faculty: true,
        },
      });
    }

    // Default to first profile if demo dev session
    if (!profile) {
      profile = await prisma.profile.findFirst({
        include: {
          student: true,
          faculty: true,
        },
      });
    }

    if (!profile) {
      return NextResponse.json({
        profile: null,
        classesToday: [],
        attendance: { held: 0, attended: 0, missed: 0, percentage: null, history: [] },
        assignments: { pending: 0, dueSoon: 0, total: 0, completed: 0, overdue: 0, items: [] },
        notices: { count: 0, items: [] },
        nextExam: null,
        calendarEvents: [],
        recentActivity: [],
        upcomingEvents: [],
        subjectPerformance: [],
      });
    }

    const studentId = profile.student?.id;

    // 1. Classes Today (based on current DayOfWeek)
    const days: ('sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday')[] = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    const currentDay = days[new Date().getDay()];

    let classesToday: any[] = [];
    if (studentId && currentDay !== 'sunday') {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);

      const schedules = await prisma.schedule.findMany({
        where: {
          courseId: { in: courseIds },
          dayOfWeek: currentDay as any,
        },
        include: {
          course: {
            include: {
              faculty: {
                include: { profile: true },
              },
            },
          },
        },
      });

      classesToday = schedules.map((s) => ({
        id: s.id,
        subject: s.course.name,
        code: s.course.code,
        time: `${s.startTime} - ${s.endTime}`,
        room: s.room,
        professor: s.course.faculty?.profile?.name || 'Faculty Instructor',
      }));
    }

    // 2. Attendance Real Metrics & History
    let attendanceData = {
      held: 0,
      attended: 0,
      missed: 0,
      percentage: null as number | null,
      history: [] as any[],
    };

    if (studentId) {
      const records = await prisma.attendance.findMany({
        where: { studentId },
        orderBy: { date: 'asc' },
        include: { course: true },
      });

      const held = records.length;
      const attended = records.filter((r) => r.status === 'present' || r.status === 'late').length;
      const missed = records.filter((r) => r.status === 'absent').length;
      const percentage = held > 0 ? Math.round((attended / held) * 100) : null;

      attendanceData = {
        held,
        attended,
        missed,
        percentage,
        history: records.map((r) => ({
          date: r.date.toISOString().split('T')[0],
          status: r.status,
          course: r.course.name,
        })),
      };
    }

    // 3. Assignments & Submission Breakdown
    let assignmentsData = {
      pending: 0,
      dueSoon: 0,
      total: 0,
      completed: 0,
      overdue: 0,
      items: [] as any[],
    };

    if (studentId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);

      const allAssignments = await prisma.assignment.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          course: true,
          submissions: {
            where: { studentId },
          },
        },
        orderBy: { dueDate: 'asc' },
      });

      const now = new Date();
      let completedCount = 0;
      let pendingCount = 0;
      let overdueCount = 0;
      let dueSoonCount = 0;

      const items = allAssignments.map((a) => {
        const isSubmitted = a.submissions.length > 0 && a.submissions[0].status !== 'pending';
        const isPastDue = new Date(a.dueDate) < now;

        if (isSubmitted) {
          completedCount++;
        } else if (isPastDue) {
          overdueCount++;
        } else {
          pendingCount++;
          const diffDays = (new Date(a.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
          if (diffDays <= 3) dueSoonCount++;
        }

        return {
          id: a.id,
          title: a.title,
          subject: a.course.name,
          dueDate: a.dueDate.toISOString(),
          status: isSubmitted ? 'completed' : isPastDue ? 'overdue' : 'pending',
          maxMarks: a.maxMarks,
        };
      });

      assignmentsData = {
        pending: pendingCount,
        dueSoon: dueSoonCount,
        total: allAssignments.length,
        completed: completedCount,
        overdue: overdueCount,
        items,
      };
    }

    // 4. Notices
    const notices = await prisma.notice.findMany({
      where: {
        OR: [
          { targetRole: null },
          { targetRole: profile.role },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const noticesData = {
      count: notices.length,
      items: notices.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        category: n.category,
        date: n.createdAt.toISOString(),
      })),
    };

    // 5. Next Real Exam Countdown
    const nextExamRecord = await prisma.event.findFirst({
      where: {
        category: { equals: 'exam', mode: 'insensitive' },
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: 'asc' },
    });

    const nextExam = nextExamRecord
      ? {
          id: nextExamRecord.id,
          title: nextExamRecord.title,
          date: nextExamRecord.startDate.toISOString(),
          location: nextExamRecord.location || 'Examination Hall',
          description: nextExamRecord.description,
        }
      : null;

    // 6. Calendar Events (Current Month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const dbEvents = await prisma.event.findMany({
      where: {
        startDate: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      orderBy: { startDate: 'asc' },
    });

    const calendarEvents = dbEvents.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.startDate.toISOString().split('T')[0],
      time: e.startDate.toISOString().split('T')[1]?.substring(0, 5) || 'All Day',
      location: e.location || 'Campus Grounds',
      category: e.category || 'Event',
    }));

    // 7. Recent Activity Stream
    const auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const leaveReqs = await prisma.leaveRequest.findMany({
      where: { profileId: profile.id },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    const recentActivity = [
      ...auditLogs.map((l) => ({
        id: l.id,
        title: l.action,
        subject: l.resource,
        date: l.createdAt.toISOString(),
        type: 'audit',
      })),
      ...leaveReqs.map((lr) => ({
        id: lr.id,
        title: `Leave Application (${lr.leaveType})`,
        subject: lr.reason,
        date: lr.createdAt.toISOString(),
        type: 'leave',
        status: lr.status,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 8. Upcoming Events
    const upcomingEventsList = await prisma.event.findMany({
      where: { startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 5,
    });

    const upcomingEvents = upcomingEventsList.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.startDate.toISOString(),
      location: e.location || 'Campus Grounds',
      category: e.category || 'General',
    }));

    // 9. Subject-Wise Performance
    let subjectPerformance: any[] = [];
    if (studentId) {
      const grades = await prisma.grade.findMany({
        where: { studentId },
        include: { course: true },
      });

      subjectPerformance = grades.map((g) => {
        const total = (g.internalMarks || 0) + (g.assignmentMarks || 0) + (g.externalMarks || 0);
        return {
          id: g.id,
          subject: g.course.name,
          code: g.course.code,
          score: Math.min(100, Math.round(total)),
          grade: g.grade || 'N/A',
        };
      });
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        department: profile.department,
        rollNumber: profile.student?.rollNumber || null,
        employeeId: profile.faculty?.employeeId || null,
        semester: profile.student?.semester || null,
      },
      classesToday,
      attendance: attendanceData,
      assignments: assignmentsData,
      notices: noticesData,
      nextExam,
      calendarEvents,
      recentActivity,
      upcomingEvents,
      subjectPerformance,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard API data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real dashboard data', details: error.message },
      { status: 500 }
    );
  }
}
