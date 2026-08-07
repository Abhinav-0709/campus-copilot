import React from 'react';
import { Users, ClipboardList, BookOpen, Bell, ChevronRight, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';

export default function StudentDashboard() {
  const today = new Date();

  const stats = [
    { name: 'Attendance', value: '86.5%', icon: <Users className="h-6 w-6" />, color: 'bg-blue-600' },
    { name: 'Assignments', value: '3 Pending', icon: <ClipboardList className="h-6 w-6" />, color: 'bg-teal-600' },
    { name: 'Enrolled Courses', value: '4', icon: <BookOpen className="h-6 w-6" />, color: 'bg-indigo-600' },
    { name: 'Notifications', value: '2 New', icon: <Bell className="h-6 w-6" />, color: 'bg-amber-600' },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Engg. Chemistry', time: '09:05 AM - 09:55 AM', room: 'C-101', professor: 'Dr. Bhavana Sethi' },
    { id: 2, subject: 'Basic Mechanical Engg.', time: '09:55 AM - 10:45 AM', room: 'C-101', professor: 'Dr. Amit Tanwar' },
    { id: 3, subject: 'Maths-II', time: '11:05 AM - 11:55 AM', room: 'C-101', professor: 'Dr. Vidit Vats' },
  ];

  const pendingAssignments = [
    {
      id: 1,
      title: 'Unit-5 Partial Differential Equations',
      subject: 'Maths-II',
      dueDate: '2026-08-15',
      status: 'pending',
      completion: 40,
    },
    {
      id: 2,
      title: 'Laws of Thermodynamics Report',
      subject: 'Basic Mechanical Engg.',
      dueDate: '2026-08-18',
      status: 'pending',
      completion: 10,
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: 'Mid-Term Exam Schedule Announced',
      date: '2026-08-05',
      category: 'Academic',
      content: 'The mid-term examination schedule for this semester has been published. Please review your exam dates.',
    },
    {
      id: 2,
      title: 'Annual Tech Fest Anugoonj 2026',
      date: '2026-08-03',
      category: 'Event',
      content: 'Registrations are now live for hackathons, paper presentations, and robotics events.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Ayush</h1>
        <p className="text-sm text-gray-500">{format(today, 'EEEE, MMMM d, yyyy')}</p>
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
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Today&apos;s Schedule</h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              4th Sem CS
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{cls.subject}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{cls.time}</span>
                      <span className="mx-2">•</span>
                      <span>Room {cls.room}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">{cls.professor}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Pending Assignments</h2>
            <Link href="/student/assignments" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{assignment.title}</h3>
                    <div className="mt-1 text-sm text-gray-500">{assignment.subject}</div>
                    <div className="mt-1 flex items-center text-xs text-gray-400">
                      <span>Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center text-amber-600 font-medium">
                        <Clock className="mr-1 h-3.5 w-3.5" /> Pending
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-1.5 rounded-full bg-blue-600"
                    style={{ width: `${assignment.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="overflow-hidden rounded-lg bg-white shadow lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Campus Notices</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">{announcement.title}</h3>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {announcement.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Posted on {format(new Date(announcement.date), 'MMMM d, yyyy')}
                </p>
                <p className="mt-2 text-sm text-gray-600">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
