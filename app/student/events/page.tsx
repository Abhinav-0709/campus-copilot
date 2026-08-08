'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function EventsPage() {
  const events = [
    {
      id: '1',
      title: 'Annual Cultural Fest: Anugoonj 2026',
      date: '2026-08-25',
      time: '10:00 AM - 08:00 PM',
      location: 'Main Auditorium',
      category: 'Cultural',
      description: 'Music, dance, street plays, and celebrity night live at Techville Campus.',
    },
    {
      id: '2',
      title: 'TechHack 2026 Hackathon',
      date: '2026-09-02',
      time: '09:00 AM (24 Hours)',
      location: 'Computer Science Lab 3',
      category: 'Technical',
      description: 'Build innovative AI, Web, and Mobile solutions in 24 hours. Cash prizes for top 3 teams.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Campus Events & Calendar</h1>
        <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Upcoming events, workshops, fests, and hackathons</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                {event.category}
              </span>
              <span className="flex items-center text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {format(new Date(event.date), 'MMM d, yyyy')}
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">{event.title}</h2>
            <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8] leading-relaxed">{event.description}</p>

            <div className="border-t border-[#E5EAF2] dark:border-[#27313B] pt-3 flex flex-wrap gap-4 text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
              <span className="flex items-center">
                <Clock className="mr-1.5 h-3.5 w-3.5 text-[#94A3B8] dark:text-[#6B7682]" />
                {event.time}
              </span>
              <span className="flex items-center">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-[#94A3B8] dark:text-[#6B7682]" />
                {event.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

