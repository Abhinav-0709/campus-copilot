'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, PieChart, RefreshCw } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

interface SubjectAttendance {
  name: string;
  code: string;
  present: number;
  total: number;
  percentage: number;
}

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([
    { name: 'Engg. Chemistry', code: 'AHT-002', present: 20, total: 20, percentage: 100 },
    { name: 'Maths-II', code: 'AHT-005', present: 19, total: 20, percentage: 95 },
    { name: 'Basic Mechanical Engg.', code: 'MET-001', present: 17, total: 20, percentage: 85 },
    { name: 'Basic Electronics Engg.', code: 'ECT-001', present: 15, total: 20, percentage: 75 },
  ]);

  const overall = Math.round(
    subjects.reduce((acc, curr) => acc + curr.percentage, 0) / subjects.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Overview</h1>
          <p className="text-sm text-gray-500">Track your class attendance and eligibility thresholds</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Overall Attendance"
          value={`${overall}%`}
          icon={<PieChart className="h-6 w-6" />}
          color={overall >= 75 ? 'bg-emerald-600' : 'bg-rose-600'}
        />
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          icon={<Check className="h-6 w-6" />}
          color="bg-blue-600"
        />
        <StatCard
          title="Threshold Warning"
          value={subjects.filter((s) => s.percentage < 75).length === 0 ? 'None' : `${subjects.filter((s) => s.percentage < 75).length} Subject`}
          icon={<AlertCircle className="h-6 w-6" />}
          color={subjects.filter((s) => s.percentage < 75).length === 0 ? 'bg-teal-600' : 'bg-amber-600'}
        />
      </div>

      {/* Subject Breakdown Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Subject Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Attended</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{sub.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sub.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sub.present} / {sub.total} classes</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>{sub.percentage}%</span>
                      <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sub.percentage >= 75 ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <Check className="mr-1 h-3 w-3" /> Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
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
    </div>
  );
}
