import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-[#1A2129]" />
        <div className="h-4 w-96 rounded-lg bg-slate-200 dark:bg-[#1A2129]" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-[#1A2129]" />
              <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-[#1A2129]" />
            </div>
            <div className="h-6 w-16 rounded bg-slate-200 dark:bg-[#1A2129]" />
          </div>
        ))}
      </div>

      {/* Countdown & Calendar Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-44 rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-[#1A2129]" />
          <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-[#1A2129]" />
        </div>
        <div className="h-44 rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-[#1A2129]" />
          <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-[#1A2129]" />
        </div>
      </div>

      {/* Academic Overview & Chart Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 space-y-4">
          <div className="h-5 w-48 rounded bg-slate-200 dark:bg-[#1A2129]" />
          <div className="h-40 w-full rounded-xl bg-slate-200 dark:bg-[#1A2129]" />
        </div>
        <div className="h-64 rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 space-y-4">
          <div className="h-5 w-48 rounded bg-slate-200 dark:bg-[#1A2129]" />
          <div className="h-40 w-full rounded-xl bg-slate-200 dark:bg-[#1A2129]" />
        </div>
      </div>
    </div>
  );
}
