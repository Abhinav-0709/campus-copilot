'use client';

import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface SubjectPerfProps {
  performance: Array<{
    id: string;
    subject: string;
    code: string;
    score: number;
    grade: string;
  }>;
}

export default function SubjectPerformanceList({ performance }: SubjectPerfProps) {
  if (performance.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4 mb-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" /> Subject-Wise Performance
          </h2>
        </div>
        <EmptyState
          title="No performance data available yet"
          description="Academic grades and internal scores have not been published for your enrolled subjects."
          icon={Award}
          className="border-0 shadow-none py-6"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4">
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Subject Performance</h2>
        </div>
        <span className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">{performance.length} Enrolled Courses</span>
      </div>

      <div className="space-y-4">
        {performance.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#111827] dark:text-[#F5F7FA]">
                {item.subject} <span className="text-[#94A3B8] font-normal">({item.code})</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="rounded-md bg-[#DBEAFE] dark:bg-[#1A2129] px-2 py-0.5 text-[11px] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                  Grade: {item.grade}
                </span>
                <span className="text-[#2563EB] dark:text-[#60A5FA] font-extrabold">{item.score}%</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-[#F5F8FC] dark:bg-[#1A2129] overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] dark:from-[#3B82F6] dark:to-[#60A5FA]"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
