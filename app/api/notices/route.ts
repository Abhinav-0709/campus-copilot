import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { NoticeSchema } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'notices_get', { limit: 100 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const notices = await prisma.notice.findMany({
      include: {
        faculty: {
          include: {
            profile: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ notices });
  } catch (error: any) {
    console.error('Notices GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'notices_post', { limit: 15 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const body = await req.json();
    const validation = NoticeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid notice data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { facultyId, title, content, category, targetRole } = validation.data;

    let targetFacultyId = facultyId;

    const existingFaculty = await prisma.faculty.findFirst({
      where: { OR: [{ id: facultyId }, { profileId: facultyId }] },
    });

    if (existingFaculty) {
      targetFacultyId = existingFaculty.id;
    } else {
      const fallbackFaculty = await prisma.faculty.findFirst();
      if (fallbackFaculty) {
        targetFacultyId = fallbackFaculty.id;
      } else {
        return NextResponse.json({ error: 'No faculty record found to post notice' }, { status: 400 });
      }
    }

    const notice = await prisma.notice.create({
      data: {
        facultyId: targetFacultyId,
        title,
        content,
        category,
        targetRole: targetRole || null,
      },
    });

    await logAuditEvent({
      actorId: targetFacultyId,
      action: 'PUBLISH_NOTICE',
      resource: 'Notice',
      resourceId: notice.id,
      metadata: { title, category },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    console.error('Notices POST Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to publish notice' : error.message },
      { status: 500 }
    );
  }
}
