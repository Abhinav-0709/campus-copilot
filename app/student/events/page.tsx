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
        <h1 className="text-2xl font-bold text-gray-900">Campus Events & Calendar</h1>
        <p className="text-sm text-gray-500">Upcoming events, workshops, fests, and hackathons</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg bg-white p-6 shadow border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {event.category}
              </span>
              <span className="flex items-center text-xs font-medium text-gray-500">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {format(new Date(event.date), 'MMM d, yyyy')}
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900">{event.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>

            <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                {event.time}
              </span>
              <span className="flex items-center">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                {event.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
