import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { LeaveSubmissionSchema, LeaveApprovalSchema } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'leave_get', { limit: 60 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    const leaves = await prisma.leaveRequest.findMany({
      where: profileId ? { profileId } : undefined,
      include: {
        profile: {
          select: {
            name: true,
            email: true,
            student: { select: { rollNumber: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leaves });
  } catch (error: any) {
    console.error('Leave Requests GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leave requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'leave_post', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const body = await req.json();
    const validation = LeaveSubmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid leave request data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { profileId, fromDate, toDate, reason, leaveType } = validation.data;

    const leave = await prisma.leaveRequest.create({
      data: {
        profileId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        reason,
        leaveType,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, leave });
  } catch (error: any) {
    console.error('Leave Request POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to submit leave request' : error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'leave_patch', { limit: 30 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const body = await req.json();
    const validation = LeaveApprovalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid leave approval data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { id, status, reviewNote, reviewedBy } = validation.data;

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        reviewNote: reviewNote || null,
        reviewedBy: reviewedBy || 'Faculty',
      },
    });

    // Audit Log for leave decision
    await logAuditEvent({
      actorId: reviewedBy || 'Faculty',
      action: 'LEAVE_DECISION',
      resource: 'LeaveRequest',
      resourceId: id,
      metadata: { status, reviewNote },
    });

    return NextResponse.json({ success: true, leave });
  } catch (error: any) {
    console.error('Leave Request PATCH Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to update leave request' : error.message },
      { status: 500 }
    );
  }
}
