'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

interface UpcomingEventsProps {
  events: EventItem[];
}

export default function UpcomingEventsFeed({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4 mb-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA] flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-[#2563EB] dark:text-[#60A5FA]" /> Upcoming Campus Events
          </h2>
        </div>
        <EmptyState
          title="No upcoming events"
          description="There are currently no university events or workshops listed in the calendar."
          icon={Calendar}
          className="border-0 shadow-none py-6"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-4">
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
          <Calendar className="h-5 w-5" />
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Upcoming Events</h2>
        </div>
        <span className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">{events.length} Scheduled</span>
      </div>

      <div className="space-y-3">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-xl bg-[#F5F8FC] dark:bg-[#1A2129] border border-[#E5EAF2] dark:border-[#27313B] space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-[#DBEAFE] dark:bg-[#14191F] px-2 py-0.5 text-[10px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                {evt.category}
              </span>
              <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {format(new Date(evt.date), 'MMM d, hh:mm a')}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{evt.title}</h4>
            {evt.location && (
              <p className="text-xs font-medium text-[#475569] dark:text-[#A3ADB8] flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                {evt.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
