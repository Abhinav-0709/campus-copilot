'use client';

import React from 'react';
import { Activity, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface ActivityItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  type: string;
  status?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivityFeed({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4 mb-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <Activity className="mr-2 h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" /> Recent Application Activity
          </h2>
        </div>
        <EmptyState
          title="No recent activity"
          description="There are no recent audit logs, submissions, or leave requests logged."
          icon={Activity}
          className="border-0 shadow-none py-6"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4">
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
          <Activity className="h-5 w-5" />
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Recent Activity Stream</h2>
        </div>
        <span className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">{activities.length} Recent Logs</span>
      </div>

      <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B] max-h-64 overflow-y-auto custom-scrollbar pr-1">
        {activities.map((item) => (
          <div key={item.id} className="py-3 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-[#DBEAFE] dark:bg-[#1A2129] flex items-center justify-center border border-[#2563EB]/20 dark:border-[#27313B]">
                <FileText className="h-4 w-4 text-[#2563EB] dark:text-[#60A5FA]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F5F7FA]">{item.title}</h4>
                <p className="text-[11px] font-medium text-[#475569] dark:text-[#A3ADB8]">{item.subject}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#94A3B8] dark:text-[#6B7682] flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {format(new Date(item.date), 'MMM d, yyyy • hh:mm a')}
                </p>
              </div>
            </div>

            {item.status && (
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                item.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-[#3DD68C]/20 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
                  : 'bg-amber-50 text-[#D97706] dark:bg-[#E8D44D]/20 dark:text-[#E8D44D] border-amber-200 dark:border-[#E8D44D]/30'
              }`}>
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
