import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { AssignmentSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'assignments_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const assignments = await prisma.assignment.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        course: { select: { code: true, name: true } },
        submissions: { select: { id: true, studentId: true, status: true, fileUrl: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json({ assignments });
  } catch (error: any) {
    console.error('Assignments GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'assignments_post', { limit: 20 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

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
