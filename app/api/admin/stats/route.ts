import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getAuthSession, authorizeRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'admin_stats', { limit: 30 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const session = await getAuthSession(req);
    const authCheck = authorizeRole(session, ['admin']);
    if (!authCheck.isAuthorized) return authCheck.response!;

    const p = prisma as any;

    const [
      totalProfiles,
      totalStudents,
      totalFaculty,
      totalCourses,
      totalSubmissions,
      totalKnowledgeDocs,
      pendingFeeCount,
    ] = await Promise.all([
      p.profile?.count().catch(() => 0) ?? 0,
      p.student?.count().catch(() => 0) ?? 0,
      p.faculty?.count().catch(() => 0) ?? 0,
      p.course?.count().catch(() => 0) ?? 0,
      p.submission?.count().catch(() => 0) ?? 0,
      p.knowledgeDocument?.count().catch(() => 0) ?? 0,
      p.feeRecord?.count({ where: { status: 'pending' } }).catch(() => 0) ?? 0,
    ]);

    return NextResponse.json({
      metrics: {
        totalProfiles,
        totalStudents,
        totalFaculty,
        totalCourses,
        totalSubmissions,
        totalKnowledgeDocs,
        pendingFeeCount,
      },
    });
  } catch (error: any) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json({
      metrics: {
        totalProfiles: 0,
        totalStudents: 0,
        totalFaculty: 0,
        totalCourses: 0,
        totalSubmissions: 0,
        totalKnowledgeDocs: 0,
        pendingFeeCount: 0,
      },
    });
  }
}
