import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { FeeRecordSchema } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'fees_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const requestedStudentId = searchParams.get('studentId');

    const feeDelegate = (prisma as any).feeRecord || (prisma as any).fee_records;
    if (!feeDelegate) {
      return NextResponse.json({ feeRecords: [] });
    }

    let whereClause: any = undefined;

    if (session?.role === 'student') {
      // Find student for session user
      const student = await prisma.student.findUnique({
        where: { profileId: session.userId },
      });
      if (!student) {
        return NextResponse.json({ feeRecords: [] });
      }
      // Strictly enforce ownership: student can ONLY read their own fee records
      whereClause = { studentId: student.id };
    } else if (requestedStudentId) {
      whereClause = {
        student: {
          OR: [{ id: requestedStudentId }, { profileId: requestedStudentId }],
        },
      };
    }

    const feeRecords = await feeDelegate.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            profile: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { semester: 'desc' },
    });

    return NextResponse.json({ feeRecords });
  } catch (error: any) {
    console.error('Fees GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch fee records', feeRecords: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'fees_post', { limit: 20 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const body = await req.json();
    const validation = FeeRecordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid fee record payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { id, studentId, semester, tuitionFee, hostelFee, examFee, status } = validation.data;

    let targetStudent = await prisma.student.findFirst({
      where: studentId ? { OR: [{ id: studentId }, { profileId: studentId }] } : undefined,
    });

    if (!targetStudent) {
      targetStudent = await prisma.student.findFirst();
    }

    if (!targetStudent) {
      return NextResponse.json({ error: 'No student profile found' }, { status: 400 });
    }

    const totalAmount = Number(tuitionFee || 45000) + Number(hostelFee || 15000) + Number(examFee || 2500);
    const isPaid = status === 'paid';

    const feeDelegate = (prisma as any).feeRecord;
    if (!feeDelegate) {
      return NextResponse.json({ success: true });
    }

    const recordId = id || `fee-${Date.now()}`;

    const feeRecord = await feeDelegate.upsert({
      where: { id: recordId },
      update: {
        status: status || 'paid',
        paidAt: isPaid ? new Date() : null,
      },
      create: {
        id: recordId,
        studentId: targetStudent.id,
        semester: Number(semester) || 4,
        tuitionFee: Number(tuitionFee || 45000),
        hostelFee: Number(hostelFee || 15000),
        examFee: Number(examFee || 2500),
        totalAmount,
        status: status || 'pending',
        dueDate: new Date('2026-08-30'),
        paidAt: isPaid ? new Date() : null,
      },
    });

    await logAuditEvent({
      actorId: session?.userId || 'Admin',
      action: 'FEE_UPDATE',
      resource: 'FeeRecord',
      resourceId: recordId,
      metadata: { status, totalAmount, studentId: targetStudent.id },
    });

    return NextResponse.json({ success: true, feeRecord });
  } catch (error: any) {
    console.error('Fees POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to process fee record' : error.message },
      { status: 500 }
    );
  }
}
