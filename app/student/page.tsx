'use client';

import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, BookOpen, Bell, ChevronRight, Clock, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';

import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import NextExamCountdown from '@/components/dashboard/NextExamCountdown';
import InteractiveCalendar from '@/components/dashboard/InteractiveCalendar';
import AttendanceTrendChart from '@/components/dashboard/AttendanceTrendChart';
import AssignmentStatusDonut from '@/components/dashboard/AssignmentStatusDonut';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import SubjectPerformanceList from '@/components/dashboard/SubjectPerformanceList';
import UpcomingEventsFeed from '@/components/dashboard/UpcomingEventsFeed';
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid';

export default function StudentDashboard() {
  const { user } = useAuth();
  const today = new Date();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load dashboard data');
      }
      setDashboardData(data);
    } catch (err: any) {
      console.error('Student dashboard error:', err);
      setError(err?.message || 'Unable to load this information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-white dark:bg-[#14191F] p-6 text-center space-y-4 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-[#FF5C5C]/10 text-rose-600 dark:text-[#FF5C5C] flex items-center justify-center mx-auto">
          <RefreshCw className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA]">Unable to load dashboard</h2>
          <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] mt-1">{error}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="aurora-btn-primary px-4 py-2 text-xs inline-flex items-center cursor-pointer"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
        </button>
      </div>
    );
  }

  const profileName = dashboardData?.profile?.name || user?.name;
  const welcomeTitle = profileName ? `Welcome back, ${profileName}` : 'Welcome back!';
  const semester = dashboardData?.profile?.semester;

  const classesToday = dashboardData?.classesToday || [];
  const attendance = dashboardData?.attendance || { held: 0, attended: 0, missed: 0, percentage: null, history: [] };
  const assignments = dashboardData?.assignments || { pending: 0, dueSoon: 0, total: 0, completed: 0, overdue: 0, items: [] };
  const notices = dashboardData?.notices || { count: 0, items: [] };
  const nextExam = dashboardData?.nextExam || null;
  const calendarEvents = dashboardData?.calendarEvents || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingEvents = dashboardData?.upcomingEvents || [];
  const subjectPerformance = dashboardData?.subjectPerformance || [];

  // Primary Stats Cards Data
  const stats = [
    {
      name: 'Classes Today',
      value: classesToday.length > 0 ? `${classesToday.length} Scheduled` : 'No classes today',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-blue-600',
    },
    {
      name: 'Attendance',
      value: attendance.percentage !== null ? `${attendance.percentage}%` : 'Attendance data unavailable',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-teal-600',
    },
    {
      name: 'Assignments Pending',
      value: assignments.total > 0 ? `${assignments.pending} Pending` : 'No pending assignments',
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'bg-indigo-600',
    },
    {
      name: 'Notices',
      value: notices.count > 0 ? `${notices.count} Circulars` : 'No new notices',
      icon: <Bell className="h-5 w-5" />,
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="space-y-3 max-w-[1700px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-0.5">
        <div>
          <h1 className="text-lg font-extrabold text-[#111827] dark:text-[#F5F7FA]">{welcomeTitle}</h1>
          <p className="text-[11px] font-semibold text-[#475569] dark:text-[#A3ADB8]">
            Here&apos;s what&apos;s happening on your campus today • {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        {semester && (
          <div className="inline-flex items-center rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
            Semester {semester}
          </div>
        )}
      </div>

      {/* Main 2-Column Split Layout (70% Left / 30% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        
        {/* 👈 LEFT SECTION (70% Width — lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-3.5">
          
          {/* Row 1: Primary Stat Cards (4 Cards Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
            {stats.map((s) => (
              <StatCard key={s.name} title={s.name} value={s.value} icon={s.icon} color={s.color} />
            ))}
          </div>

          {/* Row 2: Next Exam Countdown (Left) + Today's Classes (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <NextExamCountdown exam={nextExam} />

            <div className="overflow-hidden rounded-xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-none p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-2">
                <h2 className="text-xs font-extrabold text-[#111827] dark:text-[#F5F7FA]">Today&apos;s Class Schedule</h2>
                <span className="text-[10px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] bg-[#DBEAFE] dark:bg-[#1A2129] px-1.5 py-0.5 rounded-full border border-[#2563EB]/20 dark:border-[#27313B]">
                  {classesToday.length} Sessions
                </span>
              </div>
              {classesToday.length === 0 ? (
                <EmptyState
                  title="No classes today"
                  description="Your timetable has no scheduled lectures for today."
                  icon={CalendarIcon}
                  className="border-0 shadow-none py-2 text-xs"
                />
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                  {classesToday.map((cls: any) => (
                    <div key={cls.id} className="p-2.5 rounded-lg bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B]">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-[#DBEAFE] dark:bg-[#14191F] px-1.5 py-0.5 text-[9px] font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
                          {cls.code}
                        </span>
                        <span className="text-[10px] font-semibold text-[#475569] dark:text-[#A3ADB8]">{cls.time}</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#111827] dark:text-[#F5F7FA] mt-0.5">{cls.subject}</h3>
                      <p className="text-[10px] font-medium text-[#94A3B8] dark:text-[#6B7682]">Room {cls.room} • {cls.professor}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Recent Activity Stream (Left) + Assignment Status Breakdown (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <RecentActivityFeed activities={recentActivity} />
            <AssignmentStatusDonut assignments={assignments} />
          </div>

          {/* Row 4: Subject-Wise Performance (Left) + Academic Overview & Attendance Trend (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <SubjectPerformanceList performance={subjectPerformance} />
            <AttendanceTrendChart attendance={attendance} onRetry={fetchDashboardData} />
          </div>

        </div>

        {/* 👉 RIGHT SECTION (30% Width — lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Row 1: Interactive Monthly Calendar */}
          <InteractiveCalendar events={calendarEvents} />

          {/* Row 2: Upcoming Events Feed */}
          <UpcomingEventsFeed events={upcomingEvents} />

          {/* Row 3: Quick Actions Grid */}
          <QuickActionsGrid role="student" />

        </div>

      </div>
    </div>
  );
}
