import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { ProfileSyncSchema } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'auth_profile', { limit: 15, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const body = await req.json();
    const validation = ProfileSyncSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { id, email, name, role, department } = validation.data;
    const userRole = role === 'admin' ? 'admin' : role === 'faculty' ? 'faculty' : 'student';

    // Upsert Profile in Prisma
    const profile = await prisma.profile.upsert({
      where: { id },
      update: {
        email,
        name: name || email.split('@')[0],
        role: userRole,
        department: department || 'General',
      },
      create: {
        id,
        email,
        name: name || email.split('@')[0],
        role: userRole,
        department: department || 'General',
      },
    });

    // Create role-specific record if missing
    if (userRole === 'student') {
      const existingStudent = await prisma.student.findUnique({
        where: { profileId: id },
      });

      if (!existingStudent) {
        await prisma.student.create({
          data: {
            profileId: id,
            rollNumber: `CS2026${Math.floor(100 + Math.random() * 900)}`,
            semester: 4,
            section: 'A',
            batch: '2023-2027',
          },
        });
      }
    } else if (userRole === 'faculty') {
      const existingFaculty = await prisma.faculty.findUnique({
        where: { profileId: id },
      });

      if (!existingFaculty) {
        await prisma.faculty.create({
          data: {
            profileId: id,
            employeeId: `EMP2026${Math.floor(100 + Math.random() * 900)}`,
          },
        });
      }
    }

    // Audit log
    await logAuditEvent({
      actorId: id,
      action: 'PROFILE_SYNC',
      resource: 'Profile',
      resourceId: id,
      metadata: { role: userRole, email },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('[Profile Sync Error]:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Profile sync failed' : error.message },
      { status: 500 }
    );
  }
}
