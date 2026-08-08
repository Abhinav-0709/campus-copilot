'use client';

import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, BookOpen, Bell, Clock, Calendar, FileText } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const facultyName = user?.name || 'Faculty Member';
  const departmentName = user?.department || 'Faculty Department';

  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);

  useEffect(() => {
    async function loadFacultyData() {
      try {
        const res = await fetch('/api/leave');
        const data = await res.json();
        if (data.leaveRequests) {
          setPendingLeaves(
            data.leaveRequests.map((l: any) => ({
              id: l.id,
              student: l.profile?.name || 'Student Applicant',
              roll: l.profile?.student?.rollNumber || 'CS2026',
              dates: `${l.fromDate.split('T')[0]} - ${l.toDate.split('T')[0]}`,
              reason: l.reason,
            }))
          );
        }
      } catch (e) {
        console.warn('Faculty dashboard live load note:', e);
      }
    }

    loadFacultyData();
  }, []);

  const stats = [
    { name: 'Total Students', value: 'Enrolled', icon: <Users className="h-6 w-6" />, color: 'bg-[#2563EB]' },
    { name: 'Active Courses', value: 'Assigned', icon: <BookOpen className="h-6 w-6" />, color: 'bg-[#3B82F6]' },
    { name: 'Assignments Created', value: 'Active', icon: <ClipboardList className="h-6 w-6" />, color: 'bg-[#60A5FA]' },
    { name: 'Pending Leave Approvals', value: `${pendingLeaves.length}`, icon: <Bell className="h-6 w-6" />, color: 'bg-[#D97706]' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Welcome back, {facultyName}</h1>
          <p className="text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">{departmentName}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/faculty/attendance"
            className="aurora-btn-primary px-4 py-2 text-xs flex items-center"
          >
            <Users className="mr-1.5 h-4 w-4" /> Mark Attendance
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.name} title={s.name} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Teaching Schedule */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Today&apos;s Lectures</h2>
            <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-1 rounded-full border border-[#2563EB]/20 dark:border-[#27313B]">
              Teaching Schedule
            </span>
          </div>
          {todayClasses.length === 0 ? (
            <EmptyState
              title="No Lectures Today"
              description="You have no scheduled teaching sessions or lectures for today."
              icon={Calendar}
              className="border-0 shadow-none py-8"
            />
          ) : (
            <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
              {todayClasses.map((cls) => (
                <div key={cls.id} className="p-6 transition-colors hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA]">{cls.course}</h3>
                      <p className="mt-1 text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">{cls.section}</p>
                      <div className="mt-1 flex items-center text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">
                        <Clock className="mr-1 h-3.5 w-3.5" /> {cls.time} • Room {cls.room}
                      </div>
                    </div>
                    <Link
                      href={`/faculty/attendance`}
                      className="rounded-xl bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-100 dark:hover:bg-[#27313B] border border-[#2563EB]/20 dark:border-[#27313B] transition-all"
                    >
                      Mark
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Leave Requests */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Pending Leave Applications</h2>
            <Link href="/faculty/leave-management" className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline">
              View all
            </Link>
          </div>
          {pendingLeaves.length === 0 ? (
            <EmptyState
              title="No Pending Leave Requests"
              description="There are currently no student leave applications awaiting your review."
              icon={FileText}
              className="border-0 shadow-none py-8"
            />
          ) : (
            <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
              {pendingLeaves.map((leave) => (
                <div key={leave.id} className="p-6 transition-colors hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{leave.student}</h3>
                      <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">Roll: {leave.roll} • {leave.dates}</p>
                      <p className="mt-1 text-xs font-medium text-[#475569] dark:text-[#A3ADB8]">{leave.reason}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href="/faculty/leave-management"
                        className="rounded-xl bg-[#16A34A] dark:bg-[#3DD68C]/20 dark:text-[#3DD68C] dark:border dark:border-[#3DD68C]/30 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-600 transition-all"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

