import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { SubmissionCreateSchema } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';
import { getAuthSession } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'submissions_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const requestedStudentId = searchParams.get('studentId');
    const assignmentId = searchParams.get('assignmentId');

    let whereClause: any = {};

    if (session?.role === 'student') {
      const student = await prisma.student.findUnique({
        where: { profileId: session.userId },
      });
      if (!student) {
        return NextResponse.json({ submissions: [] });
      }
      whereClause.studentId = student.id;
      if (assignmentId) whereClause.assignmentId = assignmentId;
    } else {
      if (requestedStudentId) whereClause.studentId = requestedStudentId;
      if (assignmentId) whereClause.assignmentId = assignmentId;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        assignment: { select: { title: true, maxMarks: true } },
        student: {
          include: {
            profile: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error('Submissions GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'submissions_post', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const body = await req.json();
    const validation = SubmissionCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { assignmentId, studentId, fileUrl } = validation.data;

    let targetStudent: any = null;

    if (session?.role === 'student') {
      targetStudent = await prisma.student.findUnique({
        where: { profileId: session.userId },
      });
    } else {
      targetStudent = await prisma.student.findFirst({
        where: { OR: [{ id: studentId }, { profileId: studentId }] },
      });
    }

    if (!targetStudent) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 400 });
    }

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: targetStudent.id,
        },
      },
      update: {
        fileUrl: fileUrl || null,
        status: 'submitted',
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId: targetStudent.id,
        fileUrl: fileUrl || null,
        status: 'submitted',
      },
    });

    await logAuditEvent({
      actorId: session?.userId || targetStudent.id,
      action: 'SUBMIT_ASSIGNMENT',
      resource: 'Submission',
      resourceId: submission.id,
      metadata: { assignmentId },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error('Submissions POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to record submission' : error.message },
      { status: 500 }
    );
  }
}
