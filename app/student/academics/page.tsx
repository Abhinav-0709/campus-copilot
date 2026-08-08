'use client';

import React from 'react';
import { BookOpen, Award, GraduationCap } from 'lucide-react';

export default function StudentAcademicsPage() {
  const currentGrades = [
    { subject: 'Maths-II', code: 'AHT-005', internal: 42, internalMax: 50, assignment: 28, assignmentMax: 30 },
    { subject: 'Engg. Chemistry', code: 'AHT-002', internal: 45, internalMax: 50, assignment: 29, assignmentMax: 30 },
    { subject: 'Basic Mechanical Engg.', code: 'MET-001', internal: 38, internalMax: 50, assignment: 25, assignmentMax: 30 },
  ];

  const pastSemesters = [
    { sem: 1, sgpa: 8.75 },
    { sem: 2, sgpa: 8.90 },
    { sem: 3, sgpa: 9.10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Academic Progress</h1>
        <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Track semester performance, SGPA, and grade breakdowns</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-[#14191F] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] flex items-center">
          <div className="rounded-xl bg-[#2563EB] p-3 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-xs text-[#475569] dark:text-[#A3ADB8] font-semibold">Cumulative CGPA</p>
            <p className="text-2xl font-bold text-[#111827] dark:text-[#F5F7FA]">8.92</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#14191F] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] flex items-center">
          <div className="rounded-xl bg-[#3B82F6] p-3 text-white">
            <Award className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-xs text-[#475569] dark:text-[#A3ADB8] font-semibold">Completed Credits</p>
            <p className="text-2xl font-bold text-[#111827] dark:text-[#F5F7FA]">74 / 160</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#14191F] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] flex items-center">
          <div className="rounded-xl bg-[#16A34A] p-3 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-xs text-[#475569] dark:text-[#A3ADB8] font-semibold">Current Semester</p>
            <p className="text-2xl font-bold text-[#111827] dark:text-[#F5F7FA]">Semester 4</p>
          </div>
        </div>
      </div>

      {/* Internal Marks Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
        <div className="border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Current Semester Internal Marks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
            <thead className="bg-[#F5F8FC] dark:bg-[#1A2129]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Mid-Term Marks</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Assignments</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#A3ADB8]">Total Internal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2] dark:divide-[#27313B] bg-white dark:bg-[#14191F]">
              {currentGrades.map((g) => (
                <tr key={g.code} className="hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">
                    {g.subject} <span className="text-xs text-[#94A3B8] dark:text-[#6B7682]">({g.code})</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#A3ADB8]">{g.internal} / {g.internalMax}</td>
                  <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#A3ADB8]">{g.assignment} / {g.assignmentMax}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2563EB] dark:text-[#60A5FA]">
                    {g.internal + g.assignment} / {g.internalMax + g.assignmentMax}
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

