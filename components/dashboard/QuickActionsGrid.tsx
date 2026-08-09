'use client';

import React from 'react';
import { Users, FileText, DollarSign, Calendar, MessageSquare, Bell } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
  role?: 'student' | 'faculty' | 'admin';
}

export default function QuickActionsGrid({ role = 'student' }: QuickActionsProps) {
  const actions = role === 'faculty' ? [
    { title: 'Mark Attendance', href: '/faculty/attendance', icon: <Users className="h-5 w-5" />, color: 'bg-blue-600' },
    { title: 'Student Leaves', href: '/faculty/leave-management', icon: <FileText className="h-5 w-5" />, color: 'bg-emerald-600' },
    { title: 'Post Notice', href: '/faculty/notices', icon: <Bell className="h-5 w-5" />, color: 'bg-amber-600' },
    { title: 'Campus Feed', href: '/faculty/community', icon: <MessageSquare className="h-5 w-5" />, color: 'bg-indigo-600' },
  ] : role === 'admin' ? [
    { title: 'User Directory', href: '/admin/users', icon: <Users className="h-5 w-5" />, color: 'bg-blue-600' },
    { title: 'Fee Control', href: '/admin/fees', icon: <DollarSign className="h-5 w-5" />, color: 'bg-cyan-600' },
    { title: 'Audit Logs', href: '/admin/logs', icon: <FileText className="h-5 w-5" />, color: 'bg-purple-600' },
  ] : [
    { title: 'Mark Attendance', href: '/student/attendance', icon: <Users className="h-5 w-5" />, color: 'bg-blue-600' },
    { title: 'Apply Leave', href: '/student/leave', icon: <FileText className="h-5 w-5" />, color: 'bg-emerald-600' },
    { title: 'View Fees', href: '/student/fees', icon: <DollarSign className="h-5 w-5" />, color: 'bg-teal-600' },
    { title: 'Campus Feed', href: '/student/community', icon: <MessageSquare className="h-5 w-5" />, color: 'bg-indigo-600' },
    { title: 'Campus Circulars', href: '/student/notifications', icon: <Bell className="h-5 w-5" />, color: 'bg-amber-600' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-5 space-y-3">
      <div className="border-b border-[#E5EAF2] dark:border-[#27313B] pb-2.5">
        <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F5F7FA]">Quick Actions</h2>
        <p className="text-[11px] font-semibold text-[#475569] dark:text-[#A3ADB8]">Fast access to campus tools</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B] hover:border-[#2563EB]/40 dark:hover:border-[#3B82F6]/40 hover:bg-white dark:hover:bg-[#14191F] transition-all group text-center space-y-1.5 cursor-pointer shadow-xs"
          >
            <div className={`h-8 w-8 rounded-lg ${act.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
              {React.cloneElement(act.icon, { className: 'h-4 w-4' })}
            </div>
            <span className="text-[11px] font-extrabold text-[#111827] dark:text-[#F5F7FA] leading-tight">{act.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
