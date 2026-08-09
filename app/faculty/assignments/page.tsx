'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  maxMarks: number;
  submittedCount: number;
  totalStudents: number;
}

interface CourseItem {
  id: string;
  code: string;
  name: string;
}

export default function FacultyAssignmentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);

  const [form, setForm] = useState({
    title: '',
    courseId: '',
    dueDate: '',
    maxMarks: 50,
  });

  const fetchFacultyCourses = async () => {
    try {
      const res = await fetch('/api/faculty/courses');
      const data = await res.json();
      if (data.courses && data.courses.length > 0) {
        setCourses(data.courses);
        setForm((prev) => ({ ...prev, courseId: data.courses[0].id }));
      }
    } catch (e) {
      console.warn('Error fetching faculty courses:', e);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.assignments) {
        const mapped: AssignmentItem[] = data.assignments.map((a: any) => ({
          id: a.id,
          title: a.title,
          course: `${a.course?.name || 'Course'} (${a.course?.code || ''})`,
          dueDate: new Date(a.dueDate).toISOString().split('T')[0],
          maxMarks: a.maxMarks,
          submittedCount: a.submissions?.length || 0,
          totalStudents: a.totalEnrolled || 0,
        }));
        setAssignments(mapped);
      }
    } catch (e) {
      console.warn('Assignments fetch note:', e);
    }
  };

  useEffect(() => {
    fetchFacultyCourses();
    fetchAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !form.courseId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          courseId: form.courseId,
          dueDate: form.dueDate,
          maxMarks: Number(form.maxMarks),
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchAssignments();
        setShowModal(false);
        setForm((prev) => ({ ...prev, title: '', dueDate: '', maxMarks: 50 }));
      } else {
        alert(data.error || 'Failed to create assignment');
      }
    } catch (err) {
      console.error('Save assignment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Assignment Management</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Create coursework and evaluate student submissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={courses.length === 0}
          className="aurora-btn-primary px-4 py-2 text-xs flex items-center cursor-pointer disabled:opacity-50"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create Assignment
        </button>
      </div>

      {courses.length === 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-[#D97706]/30 bg-amber-50 dark:bg-[#D97706]/10 p-4 text-xs font-bold text-amber-800 dark:text-[#FBBF24]">
          Notice: You currently have no assigned courses. Ask the Administrator to assign you to a course in Academic Setup before publishing assignments.
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">Create New Assignment</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit-1 Vectors & Matrices"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Course *</label>
                <select
                  required
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Max Marks</label>
                  <input
                    type="number"
                    value={form.maxMarks}
                    onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#E5EAF2] dark:border-[#27313B] px-4 py-2 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="aurora-btn-primary px-4 py-2 text-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {assignments.length === 0 ? (
          <EmptyState
            title="No Assignments Published"
            description="You haven't published any coursework assignments for your assigned subjects yet. Click 'Create Assignment' above to publish one."
            icon={ClipboardList}
          />
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                  {a.course}
                </span>
                <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">{a.title}</h2>
                <p className="mt-1 text-xs font-medium text-[#475569] dark:text-[#A3ADB8]">
                  Due Date: {format(new Date(a.dueDate), 'MMM d, yyyy')} • Max Marks: {a.maxMarks}
                </p>
              </div>

              <div className="mt-4 sm:mt-0 text-left sm:text-right">
                <p className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">
                  {a.submittedCount} / {a.totalStudents} Submissions Received
                </p>
                <button className="mt-2 rounded-xl bg-[#DBEAFE] dark:bg-[#1A2129] px-3.5 py-1.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                  {a.submittedCount > 0 ? 'Review Submissions' : 'Awaiting Submissions'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
