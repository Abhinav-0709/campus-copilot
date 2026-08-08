'use client';

import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, BookOpen, Bell, ChevronRight, Clock, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const today = new Date();
  const studentName = user?.name || 'Student';

  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [assignRes, noticeRes] = await Promise.all([
          fetch('/api/assignments').then((r) => r.json()).catch(() => ({ assignments: [] })),
          fetch('/api/notices').then((r) => r.json()).catch(() => ({ notices: [] })),
        ]);

        if (assignRes.assignments) {
          setPendingAssignments(
            assignRes.assignments.map((a: any) => ({
              id: a.id,
              title: a.title,
              subject: a.course?.name || 'Academic Course',
              dueDate: a.dueDate,
              completion: 0,
            }))
          );
        }

        if (noticeRes.notices) {
          setRecentAnnouncements(
            noticeRes.notices.map((n: any) => ({
              id: n.id,
              title: n.title,
              date: n.createdAt,
              category: n.category || 'General',
              content: n.content,
            }))
          );
        }
      } catch (e) {
        console.warn('Dashboard live load note:', e);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    { name: 'Attendance', value: '100%', icon: <Users className="h-6 w-6" />, color: 'bg-blue-600' },
    { name: 'Assignments', value: `${pendingAssignments.length} Pending`, icon: <ClipboardList className="h-6 w-6" />, color: 'bg-teal-600' },
    { name: 'Enrolled Courses', value: 'Active', icon: <BookOpen className="h-6 w-6" />, color: 'bg-indigo-600' },
    { name: 'Notifications', value: `${recentAnnouncements.length} Notices`, icon: <Bell className="h-6 w-6" />, color: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Welcome back, {studentName}</h1>
        <p className="text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">{format(today, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Today&apos;s Schedule</h2>
            <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-1 rounded-full border border-[#2563EB]/20 dark:border-[#27313B]">
              Class Timetable
            </span>
          </div>
          {upcomingClasses.length === 0 ? (
            <EmptyState
              title="No Classes Scheduled Today"
              description="Your timetable has no scheduled lectures for today."
              icon={Calendar}
              className="border-0 shadow-none py-8"
            />
          ) : (
            <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="p-6 transition-colors hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA]">{cls.subject}</h3>
                      <div className="mt-1 flex items-center text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">
                        <span>{cls.time}</span>
                        <span className="mx-2">•</span>
                        <span>Room {cls.room}</span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">{cls.professor}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#94A3B8] dark:text-[#6B7682]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Pending Assignments</h2>
            <Link href="/student/assignments" className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline">
              View all
            </Link>
          </div>
          {pendingAssignments.length === 0 ? (
            <EmptyState
              title="No Pending Assignments"
              description="You have completed all pending coursework submissions!"
              icon={ClipboardList}
              className="border-0 shadow-none py-8"
            />
          ) : (
            <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
              {pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-6 transition-colors hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA]">{assignment.title}</h3>
                      <div className="mt-1 text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">{assignment.subject}</div>
                      <div className="mt-1 flex items-center text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">
                        <span>Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center text-[#D97706] dark:text-[#E8D44D] font-bold">
                          <Clock className="mr-1 h-3.5 w-3.5" /> Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Campus Notices</h2>
          </div>
          {recentAnnouncements.length === 0 ? (
            <EmptyState
              title="No Campus Notices"
              description="No active announcements or campus circulars published."
              icon={FileText}
              className="border-0 shadow-none py-8"
            />
          ) : (
            <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-6 transition-colors hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA]">{announcement.title}</h3>
                    <span className="rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                      {announcement.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#94A3B8] dark:text-[#6B7682]">
                    Posted on {format(new Date(announcement.date), 'MMMM d, yyyy')}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">{announcement.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

