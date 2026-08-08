'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Notifications</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Stay updated on your coursework, leave requests, and announcements</p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No Unread Notifications"
          description="You're all caught up! There are no new notifications or course alerts at this time."
          icon={Bell}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start space-x-4 transition-colors ${
                n.read
                  ? 'bg-white dark:bg-[#14191F]'
                  : 'bg-[#DBEAFE]/40 dark:bg-[#1A2129]'
              }`}
            >
              <div
                className={`rounded-full p-2 text-white shrink-0 ${
                  n.type === 'leave_update'
                    ? 'bg-[#16A34A] dark:bg-[#3DD68C]'
                    : n.type === 'assignment_due'
                    ? 'bg-[#D97706] dark:bg-[#E8D44D]'
                    : 'bg-[#2563EB] dark:bg-[#3B82F6]'
                }`}
              >
                <Bell className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{n.title}</h2>
                  <span className="text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">
                    {format(new Date(n.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-[#475569] dark:text-[#A3ADB8] leading-relaxed">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

