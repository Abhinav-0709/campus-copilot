import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { AssignmentSchema } from '@/lib/validators';
import { getAuthSession } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'assignments_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    let whereClause: any = {};

    if (courseId) {
      whereClause.courseId = courseId;
    } else if (session?.role === 'faculty') {
      const faculty = await prisma.faculty.findUnique({ where: { profileId: session.userId } });
      if (faculty) {
        whereClause.course = { facultyId: faculty.id };
      }
    } else if (session?.role === 'student') {
      const student = await prisma.student.findUnique({ where: { profileId: session.userId } });
      if (student) {
        const enrollments = await prisma.enrollment.findMany({
          where: { studentId: student.id },
          select: { courseId: true },
        });
        const enrolledCourseIds = enrollments.map((e) => e.courseId);
        whereClause.courseId = { in: enrolledCourseIds };
      }
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
            _count: { select: { enrollments: true } },
          },
        },
        submissions: {
          select: { id: true, studentId: true, status: true, fileUrl: true, submittedAt: true, marksObtained: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const formatted = assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate,
      maxMarks: a.maxMarks,
      createdAt: a.createdAt,
      courseId: a.courseId,
      course: a.course,
      totalEnrolled: a.course._count.enrollments,
      submissions: a.submissions,
    }));

    return NextResponse.json({ assignments: formatted });
  } catch (error: any) {
    console.error('Assignments GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments', assignments: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'assignments_post', { limit: 20 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    if (!session || (session.role !== 'faculty' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized to create assignments' }, { status: 403 });
    }

    const body = await req.json();
    const validation = AssignmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid assignment payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { courseId, title, description, dueDate, maxMarks } = validation.data;

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title,
        description: description || null,
        dueDate: new Date(dueDate),
        maxMarks: maxMarks || 100,
      },
      include: {
        course: { select: { code: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error: any) {
    console.error('Assignments POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to create assignment' : error.message },
      { status: 500 }
    );
  }
}
