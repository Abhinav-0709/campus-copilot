'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Leave Request Approved',
      body: 'Your medical leave application for Aug 10 - Aug 12 has been approved by Faculty.',
      type: 'leave_update',
      date: '2026-08-08',
      read: false,
    },
    {
      id: '2',
      title: 'Assignment Due Reminder',
      body: 'Unit-5 Partial Differential Equations is due in 7 days.',
      type: 'assignment_due',
      date: '2026-08-07',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Stay updated on your coursework, leave requests, and announcements</p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-blue-600 hover:text-blue-500"
        >
          Mark all as read
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow border border-gray-200 divide-y divide-gray-200">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 flex items-start space-x-4 transition-colors ${
              n.read ? 'bg-white' : 'bg-blue-50/40'
            }`}
          >
            <div
              className={`rounded-full p-2 text-white ${
                n.type === 'leave_update'
                  ? 'bg-emerald-500'
                  : n.type === 'assignment_due'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            >
              <Bell className="h-4 w-4" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">{n.title}</h2>
                <span className="text-xs text-gray-400">
                  {format(new Date(n.date), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600 leading-relaxed">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
