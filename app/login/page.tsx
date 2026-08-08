'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register({
          name: name || email.split('@')[0],
          email,
          password,
          role,
          department,
        });
      }

      const redirectPath = role === 'faculty' || email.includes('faculty') ? '/faculty' : '/student';
      router.push(redirectPath);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    }
  };

  const selectRole = (selectedRole: 'student' | 'faculty') => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] dark:bg-[#080B0E] text-[#111827] dark:text-[#F5F7FA] flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Flowing Blue & Violet Glow Effects */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#60A5FA]/20 dark:bg-[#3B82F6]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#6366F1]/20 dark:bg-[#6366F1]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#06B6D4]/10 dark:bg-[#06B6D4]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <img src="/images/dark_logo.png" alt="Campus Copilot Logo" className="h-11 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform" />
            <img src="/images/light_logo.png" alt="Campus Copilot Logo" className="h-11 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#2563EB] to-[#6366F1] dark:from-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent tracking-tight">
              Campus Copilot
            </span>
          </Link>
          <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
            {mode === 'signin' ? 'Welcome back! Sign in to access your portal' : 'Create an account to get started'}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-[#E5EAF2] dark:border-[#27313B] bg-white/90 dark:bg-[#14191F]/90 p-8 shadow-[0_20px_60px_rgba(37,99,235,0.08)] dark:shadow-none backdrop-blur-xl space-y-6">
          {/* Mode Switcher Tabs (Sign In / Register) */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] p-1 text-center border border-[#E5EAF2] dark:border-[#27313B]">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                  : 'text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827] dark:hover:text-[#F5F7FA]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                  : 'text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827] dark:hover:text-[#F5F7FA]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role Selector Tabs (Student / Faculty) */}
          <div className="flex items-center justify-between text-xs font-bold text-[#475569] dark:text-[#A3ADB8] border-b border-[#E5EAF2] dark:border-[#27313B] pb-3">
            <span>Portal Role:</span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => selectRole('student')}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-[#DBEAFE] text-[#2563EB] dark:bg-[#3B82F6]/20 dark:text-[#60A5FA] border border-[#2563EB]/30 dark:border-[#3B82F6]/30 font-extrabold shadow-xs'
                    : 'bg-[#F5F8FC] dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827]'
                }`}
              >
                <GraduationCap className="mr-1.5 h-3.5 w-3.5" /> Student
              </button>
              <button
                type="button"
                onClick={() => selectRole('faculty')}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  role === 'faculty'
                    ? 'bg-[#DBEAFE] text-[#2563EB] dark:bg-[#3B82F6]/20 dark:text-[#60A5FA] border border-[#2563EB]/30 dark:border-[#3B82F6]/30 font-extrabold shadow-xs'
                    : 'bg-[#F5F8FC] dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827]'
                }`}
              >
                <Users className="mr-1.5 h-3.5 w-3.5" /> Faculty
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="rounded-xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 p-3.5 text-xs text-rose-700 dark:text-[#FF5C5C] font-semibold">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Full Name</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8] dark:text-[#6B7682]" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] py-2.5 pl-10 pr-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:bg-white dark:focus:bg-[#14191F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8] dark:text-[#6B7682]" />
                <input
                  type="email"
                  required
                  placeholder={role === 'faculty' ? 'faculty@example.com' : 'student@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] py-2.5 pl-10 pr-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:bg-white dark:focus:bg-[#14191F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] py-2.5 px-3 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:bg-white dark:focus:bg-[#14191F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering Mathematics">Engineering Mathematics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                </select>
              </div>
            )}

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
              className="w-full aurora-btn-gradient py-3 text-sm font-bold text-white disabled:opacity-50 transition-all cursor-pointer mt-2"
            >
              {isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

