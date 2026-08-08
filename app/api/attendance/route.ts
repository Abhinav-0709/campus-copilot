import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { AttendanceSchema } from '@/lib/validators';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'attendance_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const requestedStudentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');

    let whereClause: any = {};

    if (session?.role === 'student') {
      // Find exact student ID for authenticated profile
      const student = await prisma.student.findUnique({
        where: { profileId: session.userId },
      });
      if (!student) {
        return NextResponse.json({ attendance: [] });
      }
      // Strictly enforce ownership: student can ONLY read their own attendance
      whereClause.studentId = student.id;
      if (courseId) whereClause.courseId = courseId;
    } else {
      // Faculty/Admin
      if (requestedStudentId) whereClause.studentId = requestedStudentId;
      if (courseId) whereClause.courseId = courseId;
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        course: { select: { code: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ attendance });
  } catch (error: any) {
    console.error('Attendance GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'attendance_post', { limit: 30 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['faculty', 'admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const body = await req.json();
    const validation = AttendanceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid attendance payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { studentId, courseId, date, status, markedBy } = validation.data;

    const record = await prisma.attendance.upsert({
      where: {
        studentId_courseId_date: {
          studentId,
          courseId,
          date: new Date(date),
        },
      },
      update: { status, markedBy: markedBy || session?.name || 'Faculty' },
      create: {
        studentId,
        courseId,
        date: new Date(date),
        status,
        markedBy: markedBy || session?.name || 'Faculty',
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error('Attendance POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to record attendance' : error.message },
      { status: 500 }
    );
  }
}
