'use client';

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ShieldCheck, DollarSign, RefreshCw } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalProfiles: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalSubmissions: 0,
    totalKnowledgeDocs: 0,
    pendingFeeCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.warn('Using default admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const stats = [
    { name: 'Total System Users', value: String(metrics.totalProfiles), icon: <Users className="h-6 w-6" />, color: 'bg-[#2563EB]' },
    { name: 'Active Students', value: String(metrics.totalStudents), icon: <BookOpen className="h-6 w-6" />, color: 'bg-[#3B82F6]' },
    { name: 'Faculty Members', value: String(metrics.totalFaculty), icon: <ShieldCheck className="h-6 w-6" />, color: 'bg-[#60A5FA]' },
    { name: 'Pending Fee Dues', value: String(metrics.pendingFeeCount), icon: <DollarSign className="h-6 w-6" />, color: 'bg-[#D97706]' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Admin Control Panel</h1>
          <p className="text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">
            System analytics, user management, and ERP administration
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="inline-flex items-center rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#1A2129] px-3.5 py-2 text-xs font-bold text-[#475569] dark:text-[#F5F7FA] hover:bg-[#F5F8FC] dark:hover:bg-[#27313B] transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Metrics
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.name} title={s.name} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Admin Quick Action Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none space-y-4">
          <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <Users className="mr-2 h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" /> User Management & Roles
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed font-medium">
            Manage user accounts, assign faculty employee IDs, update student roll numbers, and grant administrative access.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/users"
              className="aurora-btn-primary px-4 py-2.5 text-xs inline-flex items-center"
            >
              Manage System Users
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none space-y-4">
          <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-[#06B6D4] dark:text-[#22D3EE]" /> Fee Control & Receipts
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed font-medium">
            Generate semester fee structures, track pending dues, review online Razorpay payments, and issue official receipts.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/fees"
              className="inline-flex items-center rounded-xl bg-[#06B6D4] dark:bg-[#06B6D4]/20 dark:text-[#22D3EE] dark:border dark:border-[#06B6D4]/30 px-4 py-2.5 text-xs font-extrabold text-white hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
            >
              Open Fee Control Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

