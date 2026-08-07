'use client';

import React from 'react';
import { Compass, MapPin, Clock, Phone } from 'lucide-react';

export default function CampusNavigatorPage() {
  const facilities = [
    {
      name: 'Central University Library',
      location: 'Block A, Floor 1-3',
      hours: 'Mon-Fri: 8:00 AM - 9:00 PM',
      phone: '+1 (555) 019-2834',
      description: 'Quiet study zones, computer access, digital archives, and book lending.',
    },
    {
      name: 'Student Cafeteria & Food Court',
      location: 'Block C, Ground Floor',
      hours: 'Mon-Sat: 7:30 AM - 8:00 PM',
      phone: '+1 (555) 019-2835',
      description: 'Healthy meals, quick snacks, coffee corner, and outdoor seating.',
    },
    {
      name: 'Student Health & Wellness Center',
      location: 'Block D, Room 102',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      phone: '+1 (555) 019-9110',
      description: 'First aid, nurse consultation, mental health counseling, and health checkups.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campus Navigator & Facilities</h1>
        <p className="text-sm text-gray-500">Explore campus locations, opening hours, and contact details</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {facilities.map((f, i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow border border-gray-200 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="rounded-md bg-blue-50 p-2 text-blue-600">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">{f.name}</h2>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{f.description}</p>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="mr-2 h-3.5 w-3.5 text-gray-400" />
                <span>{f.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-3.5 w-3.5 text-gray-400" />
                <span>{f.hours}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-3.5 w-3.5 text-gray-400" />
                <span>{f.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
