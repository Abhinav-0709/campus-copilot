'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface NextExamProps {
  exam: {
    id: string;
    title: string;
    date: string;
    location: string;
    description?: string;
  } | null;
}

export default function NextExamCountdown({ exam }: NextExamProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!exam || !exam.date) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const targetTime = new Date(exam.date).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [exam]);

  if (!exam) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4 mb-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <Clock className="mr-2 h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" /> Next Exam Countdown
          </h2>
        </div>
        <EmptyState
          title="No upcoming exams"
          description="There are currently no upcoming university examinations scheduled in the database."
          icon={Calendar}
          className="border-0 shadow-none py-4"
        />
      </div>
    );
  }

  const examDate = new Date(exam.date);

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-3">
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
          <Clock className="h-5 w-5" />
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Next Exam Countdown</h2>
        </div>
        <span className="rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
          Scheduled Exam
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#111827] dark:text-[#F5F7FA]">{exam.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-[#475569] dark:text-[#A3ADB8]">
            <span className="flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              {format(examDate, 'EEEE, MMM d, yyyy')}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              {format(examDate, 'hh:mm a')}
            </span>
            <span className="flex items-center">
              <MapPin className="mr-1 h-3.5 w-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              {exam.location}
            </span>
          </div>
        </div>

        {/* Real-time Ticking Countdown Cards */}
        {timeLeft && (
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B]">
              <span className="text-base font-extrabold text-[#2563EB] dark:text-[#60A5FA]">{timeLeft.days}</span>
              <span className="text-[10px] font-bold text-[#475569] dark:text-[#A3ADB8] uppercase">Days</span>
            </div>
            <span className="text-base font-bold text-[#94A3B8] dark:text-[#6B7682]">:</span>
            <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B]">
              <span className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">{timeLeft.hours}</span>
              <span className="text-[10px] font-bold text-[#475569] dark:text-[#A3ADB8] uppercase">Hrs</span>
            </div>
            <span className="text-base font-bold text-[#94A3B8] dark:text-[#6B7682]">:</span>
            <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B]">
              <span className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">{timeLeft.minutes}</span>
              <span className="text-[10px] font-bold text-[#475569] dark:text-[#A3ADB8] uppercase">Min</span>
            </div>
            <span className="text-base font-bold text-[#94A3B8] dark:text-[#6B7682]">:</span>
            <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#2563EB]/40 dark:border-[#3B82F6]/40">
              <span className="text-base font-extrabold text-[#2563EB] dark:text-[#60A5FA]">{timeLeft.seconds}</span>
              <span className="text-[10px] font-bold text-[#475569] dark:text-[#A3ADB8] uppercase">Sec</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
