import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId param is required' }, { status: 400 });
    }

    const attendances = await prisma.attendance.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { date: 'desc' },
    });

    // Group attendance metrics by course
    const courseStatsMap: Record<string, { name: string; code: string; present: number; total: number }> = {};

    attendances.forEach((record) => {
      const courseId = record.courseId;
      if (!courseStatsMap[courseId]) {
        courseStatsMap[courseId] = {
          name: record.course.name,
          code: record.course.code,
          present: 0,
          total: 0,
        };
      }
      courseStatsMap[courseId].total += 1;
      if (record.status === 'present') {
        courseStatsMap[courseId].present += 1;
      }
    });

    const subjects = Object.values(courseStatsMap).map((item) => ({
      name: item.name,
      code: item.code,
      present: item.present,
      total: item.total,
      percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 100,
    }));

    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 100;

    return NextResponse.json({
      overall: overallPercentage,
      subjects,
      recent: attendances.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Attendance API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
