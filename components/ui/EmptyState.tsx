'use client';

import React from 'react';
import { FolderOpen, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = 'No Data Available',
  description = 'There are currently no items or records to display here.',
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none transition-all ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBEAFE] dark:bg-[#1A2129] text-[#2563EB] dark:text-[#60A5FA] mb-4 border border-[#2563EB]/20 dark:border-[#27313B]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] mb-1">
        {title}
      </h3>
      <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="aurora-btn-primary px-4 py-2 text-xs font-bold transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
