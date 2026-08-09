'use client';

import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, PieChart, Users, RefreshCw } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';

interface SubjectAttendance {
  name: string;
  code: string;
  present: number;
  total: number;
  percentage: number;
}

export default function StudentAttendancePage() {
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();

      const records = data.attendance || [];

      if (records.length > 0) {
        const grouped: Record<string, { name: string; code: string; present: number; total: number }> = {};

        records.forEach((r: any) => {
          const cCode = r.course?.code || 'COURSE';
          const cName = r.course?.name || 'Academic Course';

          if (!grouped[cCode]) {
            grouped[cCode] = { name: cName, code: cCode, present: 0, total: 0 };
          }

          grouped[cCode].total += 1;
          if (r.status === 'present' || r.status === 'late') {
            grouped[cCode].present += 1;
          }
        });

        const list: SubjectAttendance[] = Object.values(grouped).map((g) => ({
          name: g.name,
          code: g.code,
          present: g.present,
          total: g.total,
          percentage: g.total > 0 ? Math.round((g.present / g.total) * 100) : 0,
        }));

        setSubjects(list);
      } else {
        setSubjects([]);
      }
    } catch (e) {
      console.warn('Attendance load note:', e);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const overall = subjects.length > 0
    ? Math.round(subjects.reduce((acc, curr) => acc + curr.percentage, 0) / subjects.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Attendance Overview</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Track your class attendance and eligibility thresholds</p>
        </div>
        <button
          onClick={fetchAttendance}
          className="aurora-btn-primary px-3.5 py-2 text-xs flex items-center cursor-pointer"
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Overall Attendance"
          value={subjects.length > 0 ? `${overall}%` : 'N/A'}
          icon={<PieChart className="h-6 w-6" />}
          color={overall >= 75 ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}
        />
        <StatCard
          title="Total Enrolled Subjects"
          value={subjects.length}
          icon={<Check className="h-6 w-6" />}
          color="bg-[#2563EB]"
        />
        <StatCard
          title="Threshold Warning"
          value={subjects.filter((s) => s.percentage < 75).length === 0 ? 'None' : `${subjects.filter((s) => s.percentage < 75).length} Subject`}
          icon={<AlertCircle className="h-6 w-6" />}
          color={subjects.filter((s) => s.percentage < 75).length === 0 ? 'bg-[#06B6D4]' : 'bg-[#D97706]'}
        />
      </div>

      {/* Subject Breakdown Table */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
          Loading attendance history...
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          title="No Attendance Records Found"
          description="Attendance records for your registered subjects have not been uploaded by faculty yet."
          icon={Users}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
          <div className="border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Subject Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
              <thead className="bg-[#F5F8FC] dark:bg-[#1A2129]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Attended</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF2] dark:divide-[#27313B] bg-white dark:bg-[#14191F]">
                {subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{sub.name}</td>
                    <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#A3ADB8]">{sub.code}</td>
                    <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#A3ADB8]">{sub.present} / {sub.total} classes</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">
                      <div className="flex items-center space-x-2">
                        <span>{sub.percentage}%</span>
                        <div className="h-2 w-24 rounded-full bg-[#F5F8FC] dark:bg-[#1A2129] overflow-hidden">
                          <div
                            className={`h-full ${sub.percentage >= 75 ? 'bg-[#16A34A] dark:bg-[#3DD68C]' : 'bg-[#DC2626] dark:bg-[#FF5C5C]'}`}
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {sub.percentage >= 75 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-[#3DD68C]/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-[#3DD68C] border border-emerald-200 dark:border-[#3DD68C]/30">
                          <Check className="mr-1 h-3 w-3" /> Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-[#FF5C5C]/15 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-[#FF5C5C] border border-rose-200 dark:border-[#FF5C5C]/30">
                          <AlertCircle className="mr-1 h-3 w-3" /> Shortage
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
