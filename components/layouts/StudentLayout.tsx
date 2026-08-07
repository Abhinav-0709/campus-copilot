'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  Bell,
  Calendar,
  Compass,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'Attendance', href: '/student/attendance', icon: Users },
    { name: 'Assignments', href: '/student/assignments', icon: ClipboardList },
    { name: 'Academics', href: '/student/academics', icon: BookOpen },
    { name: 'Leave Request', href: '/student/leave', icon: FileText },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Community', href: '/student/community', icon: MessageSquare },
    { name: 'Events', href: '/student/events', icon: Calendar },
    { name: 'Campus Map', href: '/student/campus', icon: Compass },
    { name: 'AI Copilot', href: '/student/copilot', icon: Sparkles, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              C
            </div>
            <span className="text-lg font-bold tracking-wider text-white">Campus Copilot</span>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Student Portal
        </div>

        <nav className="mt-2 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : item.highlight
                    ? 'bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800/60 hover:text-white border border-indigo-700/50'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
              AK
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Ayush Kumar</p>
              <p className="text-xs text-gray-400">CS • 4th Semester</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <button
            className="text-gray-500 hover:text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="text-sm font-medium text-gray-600">
            Techville University Campus
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/student/copilot"
              className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Ask Copilot
            </Link>
          </div>
        </header>

        {/* Page content scroll container */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
