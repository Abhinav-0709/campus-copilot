'use client';

import React, { useState } from 'react';
import { ClipboardList, Clock, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  description: string;
}

export default function StudentAssignmentsPage() {
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Unit-5 Partial Differential Equations',
      subject: 'Maths-II',
      dueDate: '2026-08-15',
      maxMarks: 50,
      status: 'pending',
      description: 'Solve all problems from exercise 5.2 (1-15) and submit step-by-step solutions in PDF format.',
    },
    {
      id: '2',
      title: 'Laws of Thermodynamics Report',
      subject: 'Basic Mechanical Engg.',
      dueDate: '2026-08-18',
      maxMarks: 100,
      status: 'pending',
      description: 'Write a comprehensive report on first and second laws of thermodynamics with practical industrial examples.',
    },
    {
      id: '3',
      title: 'Chemical Reactions & Thermodynamics',
      subject: 'Engg. Chemistry',
      dueDate: '2026-08-01',
      maxMarks: 30,
      status: 'submitted',
      description: 'Lab experiment report on enthalpy of reaction.',
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-500">View upcoming coursework and submit your assignments</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assignments.map((item) => (
          <div key={item.id} className="rounded-lg bg-white p-6 shadow border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {item.subject}
                  </span>
                  <span className="text-xs text-gray-400">Max Marks: {item.maxMarks}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">{item.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>

              <div className="mt-4 sm:mt-0 sm:text-right">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {item.status === 'pending' ? (
                    <>
                      <Clock className="mr-1 h-3.5 w-3.5" /> Due {format(new Date(item.dueDate), 'MMM d, yyyy')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Submitted
                    </>
                  )}
                </span>

                {item.status === 'pending' && (
                  <button className="mt-3 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors w-full sm:w-auto">
                    <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Submission
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
