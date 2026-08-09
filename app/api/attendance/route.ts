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

    // Support both bulk records array and single item
    let itemsToProcess: Array<{ studentId: string; courseId: string; date: string; status: 'present' | 'absent' | 'late'; markedBy?: string }> = [];

    if (body.records && Array.isArray(body.records)) {
      itemsToProcess = body.records.map((r: any) => ({
        studentId: r.studentId,
        courseId: r.courseId || body.courseId,
        date: r.date || body.date,
        status: r.status,
        markedBy: body.markedBy || session?.name || 'Faculty',
      }));
    } else {
      const validation = AttendanceSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid attendance payload', details: validation.error.format() },
          { status: 400 }
        );
      }
      itemsToProcess.push(validation.data);
    }

    const results = [];
    for (const item of itemsToProcess) {
      const record = await prisma.attendance.upsert({
        where: {
          studentId_courseId_date: {
            studentId: item.studentId,
            courseId: item.courseId,
            date: new Date(item.date),
          },
        },
        update: { status: item.status, markedBy: item.markedBy || session?.name || 'Faculty' },
        create: {
          studentId: item.studentId,
          courseId: item.courseId,
          date: new Date(item.date),
          status: item.status,
          markedBy: item.markedBy || session?.name || 'Faculty',
        },
      });
      results.push(record);
    }

    return NextResponse.json({ success: true, count: results.length, records: results });
  } catch (error: any) {
    console.error('Attendance POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to record attendance' : error.message },
      { status: 500 }
    );
  }
}
