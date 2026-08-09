'use client';

import React from 'react';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface AssignmentStatusProps {
  assignments: {
    pending: number;
    dueSoon: number;
    total: number;
    completed: number;
    overdue: number;
    items: any[];
  };
}

export default function AssignmentStatusDonut({ assignments }: AssignmentStatusProps) {
  const { total, completed, pending, overdue } = assignments;

  if (total === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4 mb-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" /> Assignment Status Breakdown
          </h2>
        </div>
        <EmptyState
          title="No assignment data available"
          description="There are currently no active coursework assignments assigned in your courses."
          icon={ClipboardList}
          className="border-0 shadow-none py-6"
        />
      </div>
    );
  }

  const completedPct = Math.round((completed / total) * 100);
  const pendingPct = Math.round((pending / total) * 100);
  const overduePct = Math.round((overdue / total) * 100);

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4">
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
          <ClipboardList className="h-5 w-5" />
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Assignment Breakdown</h2>
        </div>
        <span className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">{total} Total Assignments</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Real Visual Progress Bar / Donut Segment */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded-full bg-[#F5F8FC] dark:bg-[#1A2129] overflow-hidden flex">
            <div style={{ width: `${completedPct}%` }} className="bg-[#16A34A] dark:bg-[#3DD68C] h-full" title="Completed" />
            <div style={{ width: `${pendingPct}%` }} className="bg-[#2563EB] dark:bg-[#60A5FA] h-full" title="Pending" />
            <div style={{ width: `${overduePct}%` }} className="bg-[#DC2626] dark:bg-[#FF5C5C] h-full" title="Overdue" />
          </div>
          <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] text-center">
            {completedPct}% Completed Submission Rate
          </p>
        </div>

        {/* Counts Breakdown List */}
        <div className="space-y-2 text-xs font-bold">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 dark:bg-[#3DD68C]/10 border border-emerald-100 dark:border-[#3DD68C]/20 text-emerald-900 dark:text-[#3DD68C]">
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Completed
            </span>
            <span>{completed}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 dark:bg-[#3B82F6]/10 border border-blue-100 dark:border-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA]">
            <span className="flex items-center">
              <Clock className="mr-1.5 h-4 w-4" /> Pending
            </span>
            <span>{pending}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 dark:bg-[#FF5C5C]/10 border border-rose-100 dark:border-[#FF5C5C]/20 text-rose-900 dark:text-[#FF5C5C]">
            <span className="flex items-center">
              <AlertTriangle className="mr-1.5 h-4 w-4" /> Overdue
            </span>
            <span>{overdue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
