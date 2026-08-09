'use client';

import React, { useState, useEffect } from 'react';
import { Users, Check, X, Save, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/ui/EmptyState';

interface StudentItem {
  id: string;
  name: string;
  roll: string;
  status: 'present' | 'absent';
}

interface CourseItem {
  id: string;
  code: string;
  name: string;
  section?: string;
}

export default function FacultyAttendancePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [msg, setMsg] = useState('');
  const [students, setStudents] = useState<StudentItem[]>([]);

  // Load faculty's assigned courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/faculty/courses');
        const data = await res.json();
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
          setSelectedCourseId(data.courses[0].id);
        }
      } catch (e) {
        console.warn('Error loading faculty courses:', e);
      }
    }
    loadCourses();
  }, []);

  // Load enrolled students whenever selected course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    async function loadStudentsForCourse() {
      setLoadingStudents(true);
      try {
        const res = await fetch(`/api/faculty/courses/${selectedCourseId}/students`);
        const data = await res.json();
        if (data.students) {
          setStudents(
            data.students.map((s: any) => ({
              id: s.id,
              name: s.name,
              roll: s.rollNumber,
              status: 'present',
            }))
          );
        } else {
          setStudents([]);
        }
      } catch (e) {
        console.warn('Error loading course students:', e);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudentsForCourse();
  }, [selectedCourseId]);

  const toggleStatus = (id: string) => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
      )
    );
  };

  const handleSave = async () => {
    if (!selectedCourseId || students.length === 0) return;
    setIsSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseId,
          date,
          markedBy: user?.name || 'Faculty Member',
          records: students.map((s) => ({
            studentId: s.id,
            status: s.status,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(`Attendance saved successfully for ${students.length} students!`);
      } else {
        setMsg(data.error || 'Failed to save attendance.');
      }
    } catch (err: any) {
      setMsg('Error saving attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Mark Attendance</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Record daily class attendance for your assigned subjects</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || students.length === 0}
          className="mt-4 sm:mt-0 aurora-btn-primary px-4 py-2 text-xs inline-flex items-center disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Sparkles className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          {isSaving ? 'Saving to Database...' : 'Save Attendance'}
        </button>
      </div>

      {msg && (
        <div className="rounded-2xl border border-blue-200 dark:border-[#3B82F6]/30 bg-[#DBEAFE] dark:bg-[#3B82F6]/10 p-4 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">
          {msg}
        </div>
      )}

      {/* Selectors */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white dark:bg-[#14191F] p-4 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B]">
        <div>
          <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Select Subject / Course</label>
          {courses.length === 0 ? (
            <div className="mt-1 p-2 text-xs text-rose-500 font-semibold">
              No courses assigned to you yet. Contact Admin via Academic Setup.
            </div>
          ) : (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name} {c.section ? `(Sec ${c.section})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Attendance Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Enrolled Students List</h2>
          <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
            {students.filter((s) => s.status === 'present').length} / {students.length} Present
          </span>
        </div>

        {loadingStudents ? (
          <div className="p-8 text-center text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
            Loading enrolled students...
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No Students Enrolled"
            description="There are currently no students enrolled in this course section. Ask Admin to enroll students via Academic Setup."
            icon={Users}
            className="border-0 shadow-none py-8"
          />
        ) : (
          <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
            {students.map((student) => (
              <div key={student.id} className="p-4 flex items-center justify-between hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{student.name}</p>
                  <p className="text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">Roll No: {student.roll}</p>
                </div>

                <button
                  onClick={() => toggleStatus(student.id)}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    student.status === 'present'
                      ? 'bg-emerald-50 dark:bg-[#3DD68C]/15 text-emerald-700 dark:text-[#3DD68C] border border-emerald-200 dark:border-[#3DD68C]/30'
                      : 'bg-rose-50 dark:bg-[#FF5C5C]/15 text-rose-700 dark:text-[#FF5C5C] border border-rose-200 dark:border-[#FF5C5C]/30'
                  }`}
                >
                  {student.status === 'present' ? (
                    <>
                      <Check className="mr-1 h-3.5 w-3.5" /> Present
                    </>
                  ) : (
                    <>
                      <X className="mr-1 h-3.5 w-3.5" /> Absent
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
