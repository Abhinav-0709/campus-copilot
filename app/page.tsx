import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Users,
  ClipboardList,
  FileText,
  MessageSquare,
  Compass,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0E12] text-[#111827] dark:text-[#F5F7FA] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white transition-colors duration-200 relative overflow-hidden">
      {/* Aurora Atmospheric Decorative Background Light Ribbons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#60A5FA]/25 via-[#6366F1]/20 to-[#06B6D4]/15 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#2563EB]/20 via-[#6366F1]/25 to-[#06B6D4]/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-r from-[#60A5FA]/20 via-[#06B6D4]/20 to-[#6366F1]/15 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-[#E5EAF2] dark:border-[#27313B] bg-white/80 dark:bg-[#14191F]/80 backdrop-blur-md sticky top-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/images/dark_logo.png" alt="Campus Copilot Logo" className="h-10 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform" />
            <img src="/images/light_logo.png" alt="Campus Copilot Logo" className="h-10 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform" />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              Campus Copilot
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">
            <a href="#features" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              Features
            </a>
            <a href="#portals" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              Portals
            </a>
            <a href="#ai" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-[#6366F1]" /> AI Assistant
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-[#475569] dark:text-[#A3ADB8] hover:text-[#2563EB] dark:hover:text-[#F5F7FA] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="aurora-btn-gradient px-4 py-2 text-sm inline-flex items-center"
            >
              Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="px-6 pt-20 pb-20 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#2563EB]/20 bg-[#DBEAFE]/60 dark:bg-[#1A2129] px-4 py-1.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] mb-8 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#6366F1] animate-pulse" />
            <span>Next-Gen RAG AI Powered Campus Operating System</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] dark:text-[#F5F7FA] max-w-5xl mx-auto leading-[1.1]">
            The Intelligent Campus OS Illuminated by{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              Flowing AI Intelligence
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#475569] dark:text-[#A3ADB8] max-w-2xl mx-auto leading-relaxed font-medium">
            Campus Copilot unifies student attendance tracking, coursework evaluation, leave workflows, community feeds, and RAG document queries in one luminous, airy SaaS interface.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/student"
              className="w-full sm:w-auto aurora-btn-gradient px-8 py-3.5 text-base inline-flex items-center justify-center"
            >
              Explore Student Portal <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/faculty"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] px-8 py-3.5 text-base font-bold text-[#111827] dark:text-[#F5F7FA] shadow-sm hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-all"
            >
              Faculty Portal <Users className="ml-2 h-5 w-5 text-[#6366F1]" />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            <div className="aurora-card p-6 text-center">
              <p className="text-3xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">99.8%</p>
              <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] mt-1">Attendance Precision</p>
            </div>
            <div className="aurora-card p-6 text-center">
              <p className="text-3xl font-extrabold text-[#2563EB] dark:text-[#60A5FA]">24/7</p>
              <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] mt-1">RAG Copilot Support</p>
            </div>
            <div className="aurora-card p-6 text-center">
              <p className="text-3xl font-extrabold text-[#6366F1] dark:text-[#818CF8]">Instant</p>
              <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] mt-1">Leave Approvals</p>
            </div>
            <div className="aurora-card p-6 text-center">
              <p className="text-3xl font-extrabold text-[#06B6D4] dark:text-[#22D3EE]">pgvector</p>
              <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] mt-1">Document Ingestion</p>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="px-6 py-24 bg-[#F8FAFC] dark:bg-[#0F1318] border-t border-[#E5EAF2] dark:border-[#27313B]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Everything You Need for Campus Success</h2>
              <p className="mt-3 text-[#475569] dark:text-[#A3ADB8] text-sm font-medium">
                Built with Next.js 15 App Router and high-contrast, luminous Aurora Blue styling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="aurora-card p-8 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA] mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F7FA]">RAG AI Campus Copilot</h3>
                <p className="mt-2 text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed">
                  Query campus guidelines, library hours, pending assignments, or attendance shortages using Gemini, Groq, or local Ollama models.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="aurora-card p-8 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE] dark:bg-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F7FA]">Smart Attendance Alerts</h3>
                <p className="mt-2 text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed">
                  Real-time subject-by-subject attendance percentages with automatic warnings whenever eligibility falls below 75%.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="aurora-card p-8 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE] dark:bg-[#06B6D4]/20 text-[#06B6D4] dark:text-[#22D3EE] mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-[#F5F7FA]">Leave Application Workflow</h3>
                <p className="mt-2 text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed">
                  Apply for medical or academic leave with date selectors and receive real-time approval status updates from faculty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Portals CTA Section */}
        <section id="portals" className="px-6 py-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="aurora-card p-8 bg-gradient-to-br from-white via-[#F5F8FC] to-[#DBEAFE]/40 dark:from-[#14191F] dark:to-[#1A2129] flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-full bg-[#DBEAFE] dark:bg-[#3B82F6]/20 px-3.5 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] mb-4 border border-[#2563EB]/20">
                  STUDENT PORTAL
                </span>
                <h3 className="text-2xl font-bold text-[#111827] dark:text-[#F5F7FA]">For Students</h3>
                <p className="mt-3 text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed">
                  Track your attendance, manage pending assignments, request leave, stay updated on community events, and chat with AI Copilot.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/student"
                  className="inline-flex items-center text-sm font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                >
                  Enter Student Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Faculty Card */}
            <div className="aurora-card p-8 bg-gradient-to-br from-white via-[#F5F8FC] to-[#DBEAFE]/40 dark:from-[#14191F] dark:to-[#1A2129] flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-full bg-[#DBEAFE] dark:bg-[#3B82F6]/20 px-3.5 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] mb-4 border border-[#2563EB]/20">
                  FACULTY PORTAL
                </span>
                <h3 className="text-2xl font-bold text-[#111827] dark:text-[#F5F7FA]">For Faculty</h3>
                <p className="mt-3 text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed">
                  Mark class attendance, publish coursework assignments, post official notices, review student leave applications, and upload documents for AI ingestion.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/faculty"
                  className="inline-flex items-center text-sm font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                >
                  Enter Faculty Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] px-6 py-8 text-center text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
        <p>© 2026 Campus Copilot. Built with Next.js 15, Tailwind CSS & Supabase PostgreSQL.</p>
      </footer>
    </div>
  );
}

