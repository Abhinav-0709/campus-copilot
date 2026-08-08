'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  LogOut,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Fee Control', href: '/admin/fees', icon: DollarSign },
    { name: 'Audit & Security Logs', href: '/admin/logs', icon: Activity },
  ];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#EEF2F6] dark:bg-[#080B0E] flex text-[#111827] dark:text-[#F5F7FA] font-sans selection:bg-[#2563EB] selection:text-white transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-[#080B0E]/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#EEF2F6] dark:bg-[#080B0E] flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 bg-[#EEF2F6] dark:bg-[#080B0E]">
          <Link href="/" className="flex items-center space-x-2.5">
            <img src="/images/dark_logo.png" alt="Campus Copilot Logo" className="h-8 w-auto object-contain dark:hidden" />
            <img src="/images/light_logo.png" alt="Campus Copilot Logo" className="h-8 w-auto object-contain hidden dark:block" />
            <span className="text-base font-extrabold bg-gradient-to-r from-[#2563EB] to-[#6366F1] dark:from-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent">
              Admin Portal
            </span>
          </Link>
          <button
            className="md:hidden text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827] dark:hover:text-[#F5F7FA] p-1 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-4 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
          System Administration
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2563EB] dark:bg-[#3B82F6] text-white dark:text-white shadow-md shadow-blue-600/20'
                    : 'text-[#475569] dark:text-[#A3ADB8] hover:bg-[#DBEAFE]/60 dark:hover:bg-[#14191F] hover:text-[#2563EB] dark:hover:text-[#F5F7FA]'
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#94A3B8] dark:text-[#6B7682] group-hover:text-[#2563EB] dark:group-hover:text-[#F5F7FA]'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Footer */}
        <div className="shrink-0 bg-[#EEF2F6] dark:bg-[#080B0E] p-3.5">
          <div className="flex items-center justify-between rounded-2xl bg-white/60 dark:bg-[#14191F]/60 p-2.5 border border-[#E5EAF2]/50 dark:border-[#27313B]/50">
            <div className="flex items-center min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] flex items-center justify-center font-extrabold text-white text-xs shadow-sm">
                AD
              </div>
              <div className="ml-2.5 truncate">
                <p className="text-xs font-extrabold text-[#111827] dark:text-[#F5F7FA] truncate">
                  {user?.name || 'System Administrator'}
                </p>
                <p className="text-[10px] font-semibold text-[#475569] dark:text-[#A3ADB8] truncate">
                  Super Admin • ERP
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Logout"
              className="ml-2 p-1.5 rounded-lg text-[#475569] dark:text-[#A3ADB8] hover:text-rose-600 dark:hover:text-[#FF5C5C] hover:bg-rose-50 dark:hover:bg-[#FF5C5C]/10 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden min-w-0">
        <header className="flex h-16 shrink-0 items-center justify-between bg-[#EEF2F6] dark:bg-[#080B0E] px-6">
          <div className="flex items-center space-x-3">
            <button
              className="text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827] dark:hover:text-[#F5F7FA] md:hidden p-1 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8] hidden sm:inline-block">
              Techville University • Admin ERP Control Panel
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <span className="inline-flex items-center rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
              System Admin Mode
            </span>

            <button
              onClick={() => logout()}
              className="inline-flex items-center rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] px-3.5 py-1.5 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] hover:bg-rose-50 dark:hover:bg-[#FF5C5C]/10 hover:text-rose-600 dark:hover:text-[#FF5C5C] transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#EEF2F6] dark:bg-[#080B0E] text-[#111827] dark:text-[#F5F7FA] transition-colors duration-200">{children}</main>
      </div>
    </div>
  );
}

