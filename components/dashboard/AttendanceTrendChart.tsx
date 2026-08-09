'use client';

import React from 'react';
import { PieChart, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface AttendanceTrendProps {
  attendance: {
    held: number;
    attended: number;
    missed: number;
    percentage: number | null;
    history: Array<{ date: string; status: string; course: string }>;
  };
  onRetry?: () => void;
}

export default function AttendanceTrendChart({ attendance, onRetry }: AttendanceTrendProps) {
  const { held, attended, missed, percentage, history } = attendance;

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4">
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
          <PieChart className="h-5 w-5" />
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Academic Overview & Attendance Trend</h2>
        </div>
        {percentage !== null && (
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold border ${
            percentage >= 75
              ? 'bg-emerald-50 dark:bg-[#3DD68C]/15 text-emerald-700 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
              : 'bg-rose-50 dark:bg-[#FF5C5C]/15 text-rose-700 dark:text-[#FF5C5C] border-rose-200 dark:border-[#FF5C5C]/30'
          }`}>
            {percentage}% Overall
          </span>
        )}
      </div>

      {/* Real Academic Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] p-3 border border-[#E5EAF2] dark:border-[#27313B]">
          <p className="text-[11px] font-bold text-[#475569] dark:text-[#A3ADB8]">Classes Held</p>
          <p className="text-lg font-extrabold text-[#111827] dark:text-[#F5F7FA] mt-1">{held}</p>
        </div>
        <div className="rounded-xl bg-emerald-50/50 dark:bg-[#3DD68C]/10 p-3 border border-emerald-100 dark:border-[#3DD68C]/20">
          <p className="text-[11px] font-bold text-emerald-800 dark:text-[#3DD68C]">Classes Attended</p>
          <p className="text-lg font-extrabold text-emerald-900 dark:text-[#3DD68C] mt-1">{attended}</p>
        </div>
        <div className="rounded-xl bg-rose-50/50 dark:bg-[#FF5C5C]/10 p-3 border border-rose-100 dark:border-[#FF5C5C]/20">
          <p className="text-[11px] font-bold text-rose-800 dark:text-[#FF5C5C]">Classes Missed</p>
          <p className="text-lg font-extrabold text-rose-900 dark:text-[#FF5C5C] mt-1">{missed}</p>
        </div>
        <div className="rounded-xl bg-[#DBEAFE]/40 dark:bg-[#3B82F6]/10 p-3 border border-[#2563EB]/20 dark:border-[#3B82F6]/20">
          <p className="text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA]">Attendance %</p>
          <p className="text-lg font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-1">
            {percentage !== null ? `${percentage}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Attendance History Trend Area */}
      {history.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 border border-dashed border-[#E5EAF2] dark:border-[#27313B] rounded-xl bg-[#F5F8FC]/50 dark:bg-[#1A2129]/50">
          <AlertCircle className="h-8 w-8 text-[#94A3B8] dark:text-[#6B7682]" />
          <div>
            <h3 className="text-xs font-bold text-[#111827] dark:text-[#F5F7FA]">Not enough attendance data yet</h3>
            <p className="text-[11px] font-semibold text-[#475569] dark:text-[#A3ADB8]">
              At least 2 marked class sessions are required to compute attendance trend history.
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center rounded-lg bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] px-3 py-1.5 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#F5F8FC] transition-all"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8] uppercase tracking-wider">
            Attendance Log Stream
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B] text-xs"
              >
                <div>
                  <span className="font-bold text-[#111827] dark:text-[#F5F7FA]">{h.course}</span>
                  <span className="ml-2 text-[#94A3B8] dark:text-[#6B7682] font-medium">{h.date}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase border ${
                  h.status === 'present'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-[#3DD68C]/20 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
                    : 'bg-rose-50 text-rose-700 dark:bg-[#FF5C5C]/20 dark:text-[#FF5C5C] border-rose-200 dark:border-[#FF5C5C]/30'
                }`}>
                  {h.status === 'present' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
