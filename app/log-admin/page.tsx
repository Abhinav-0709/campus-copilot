'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LogAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Admin authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] dark:bg-[#080B0E] text-[#111827] dark:text-[#F5F7FA] flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Glow Effects */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#2563EB]/15 dark:bg-[#3B82F6]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#06B6D4]/15 dark:bg-[#06B6D4]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <img src="/images/dark_logo.png" alt="Campus Copilot Logo" className="h-11 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform" />
            <img src="/images/light_logo.png" alt="Campus Copilot Logo" className="h-11 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#2563EB] to-[#06B6D4] dark:from-[#3B82F6] dark:to-[#22D3EE] bg-clip-text text-transparent tracking-tight">
              Campus Copilot
            </span>
          </Link>
          <p className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8] uppercase tracking-wider">
            System Administration Gateway
          </p>
        </div>

        {/* Main Admin Card */}
        <div className="rounded-3xl border border-[#E5EAF2] dark:border-[#27313B] bg-white/95 dark:bg-[#14191F]/95 p-8 shadow-[0_20px_60px_rgba(37,99,235,0.08)] dark:shadow-none backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4">
            <div className="flex items-center space-x-2.5 text-[#2563EB] dark:text-[#60A5FA]">
              <div className="h-8 w-8 rounded-xl bg-[#DBEAFE] dark:bg-[#3B82F6]/20 flex items-center justify-center border border-[#2563EB]/20 dark:border-[#3B82F6]/30">
                <ShieldCheck className="h-4 w-4 text-[#2563EB] dark:text-[#60A5FA]" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F5F7FA]">Administrator Login</h2>
                <p className="text-[11px] font-semibold text-[#475569] dark:text-[#A3ADB8]">Authorized Control Panel Access</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 p-3.5 text-xs text-rose-700 dark:text-[#FF5C5C] font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Administrator Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8] dark:text-[#6B7682]" />
                <input
                  type="email"
                  required
                  placeholder="admin@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] py-2.5 pl-10 pr-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:bg-white dark:focus:bg-[#14191F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8] dark:text-[#6B7682]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] py-2.5 pl-10 pr-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:bg-white dark:focus:bg-[#14191F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full aurora-btn-gradient py-3 text-sm font-extrabold text-white disabled:opacity-50 transition-all cursor-pointer mt-2 inline-flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Control Panel'}</span>
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
