'use client';

import React from 'react';
import { BookOpen, Award, GraduationCap } from 'lucide-react';

export default function StudentAcademicsPage() {
  const currentGrades = [
    { subject: 'Maths-II', code: 'AHT-005', internal: 42, internalMax: 50, assignment: 28, assignmentMax: 30 },
    { subject: 'Engg. Chemistry', code: 'AHT-002', internal: 45, internalMax: 50, assignment: 29, assignmentMax: 30 },
    { subject: 'Basic Mechanical Engg.', code: 'MET-001', internal: 38, internalMax: 50, assignment: 25, assignmentMax: 30 },
  ];

  const pastSemesters = [
    { sem: 1, sgpa: 8.75 },
    { sem: 2, sgpa: 8.90 },
    { sem: 3, sgpa: 9.10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Academic Progress</h1>
        <p className="text-sm text-gray-500">Track semester performance, SGPA, and grade breakdowns</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow border border-gray-200 flex items-center">
          <div className="rounded-md bg-indigo-600 p-3 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold">Cumulative CGPA</p>
            <p className="text-2xl font-bold text-gray-900">8.92</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow border border-gray-200 flex items-center">
          <div className="rounded-md bg-blue-600 p-3 text-white">
            <Award className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold">Completed Credits</p>
            <p className="text-2xl font-bold text-gray-900">74 / 160</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow border border-gray-200 flex items-center">
          <div className="rounded-md bg-emerald-600 p-3 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold">Current Semester</p>
            <p className="text-2xl font-bold text-gray-900">Semester 4</p>
          </div>
        </div>
      </div>

      {/* Internal Marks Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Current Semester Internal Marks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mid-Term Marks</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Assignments</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Internal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentGrades.map((g) => (
                <tr key={g.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {g.subject} <span className="text-xs text-gray-400">({g.code})</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.internal} / {g.internalMax}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.assignment} / {g.assignmentMax}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    {g.internal + g.assignment} / {g.internalMax + g.assignmentMax}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
