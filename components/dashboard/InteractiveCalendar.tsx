'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
} from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  category?: string;
}

interface InteractiveCalendarProps {
  events: CalendarEvent[];
}

export default function InteractiveCalendar({ events }: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Build calendar grid matrix
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const dayEvents = events.filter((e) => e.date === formattedDate);
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());

      const cloneDay = day;

      days.push(
        <button
          key={formattedDate}
          onClick={() => setSelectedDate(cloneDay)}
          type="button"
          className={`h-7 sm:h-8 w-full rounded-lg flex flex-col items-center justify-center relative transition-all cursor-pointer text-[11px] font-bold ${
            !isCurrentMonth
              ? 'text-[#94A3B8]/40 dark:text-[#6B7682]/30'
              : isSelected
              ? 'bg-[#2563EB] text-white shadow-xs'
              : isToday
              ? 'border border-[#2563EB] text-[#2563EB] dark:text-[#60A5FA] bg-[#DBEAFE]/30 dark:bg-[#1A2129]'
              : 'text-[#111827] dark:text-[#F5F7FA] hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]'
          }`}
        >
          <span>{format(day, 'd')}</span>
          {dayEvents.length > 0 && (
            <span
              className={`h-1 w-1 rounded-full absolute bottom-0.5 ${
                isSelected ? 'bg-white' : 'bg-[#2563EB] dark:bg-[#60A5FA]'
              }`}
            />
          )}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-0.5">
        {days}
      </div>
    );
    days = [];
  }

  const selectedFormatted = format(selectedDate, 'yyyy-MM-dd');
  const selectedEvents = events.filter((e) => e.date === selectedFormatted);

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-none p-3.5 sm:p-4 space-y-3">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-2">
        <div className="flex items-center space-x-1.5 text-[#2563EB] dark:text-[#60A5FA]">
          <CalendarIcon className="h-3.5 w-3.5" />
          <h2 className="text-xs font-extrabold text-[#111827] dark:text-[#F5F7FA]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={prevMonth}
            type="button"
            className="p-1 rounded-md border border-[#E5EAF2] dark:border-[#27313B] text-[#475569] dark:text-[#A3ADB8] hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-all cursor-pointer"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="p-1 rounded-md border border-[#E5EAF2] dark:border-[#27313B] text-[#475569] dark:text-[#A3ADB8] hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-all cursor-pointer"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Calendar Day Grid */}
        <div className="space-y-1">
          <div className="grid grid-cols-7 text-center text-[9px] font-extrabold text-[#475569] dark:text-[#A3ADB8] uppercase tracking-wider pb-0.5">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>
          <div className="space-y-0.5">{rows}</div>
        </div>

        {/* Selected Date Event Details */}
        <div className="border-t border-[#E5EAF2] dark:border-[#27313B] pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold text-[#475569] dark:text-[#A3ADB8] uppercase tracking-wider">
              {format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA]">
              {selectedEvents.length} Events
            </span>
          </div>

          {selectedEvents.length === 0 ? (
            <EmptyState
              title="No events scheduled"
              description="There are no academic events or classes logged for this selected date."
              icon={CalendarIcon}
              className="border-0 shadow-none py-3 text-xs"
            />
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {selectedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] p-3 border border-[#E5EAF2] dark:border-[#27313B] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#DBEAFE] dark:bg-[#14191F] px-1.5 py-0.5 text-[9px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                      {evt.category || 'Event'}
                    </span>
                    {evt.time && (
                      <span className="text-[10px] font-semibold text-[#475569] dark:text-[#A3ADB8] flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> {evt.time}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-[#F5F7FA]">{evt.title}</h4>
                  {evt.location && (
                    <p className="text-[10px] font-medium text-[#475569] dark:text-[#A3ADB8] flex items-center">
                      <MapPin className="mr-1 h-3 w-3 text-[#2563EB] dark:text-[#60A5FA]" /> {evt.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
