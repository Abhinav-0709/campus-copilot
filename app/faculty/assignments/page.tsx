'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  maxMarks: number;
  submittedCount: number;
  totalStudents: number;
}

export default function FacultyAssignmentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'demo-1',
      title: 'Unit-5 Partial Differential Equations',
      course: 'Maths-II',
      dueDate: '2026-08-15',
      maxMarks: 50,
      submittedCount: 38,
      totalStudents: 45,
    },
  ]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.assignments && data.assignments.length > 0) {
        const mapped: Assignment[] = data.assignments.map((a: any) => ({
          id: a.id,
          title: a.title,
          course: a.course?.name || 'Maths-II',
          dueDate: new Date(a.dueDate).toISOString().split('T')[0],
          maxMarks: a.maxMarks,
          submittedCount: a.submissions?.length || 0,
          totalStudents: 45,
        }));
        setAssignments(mapped);
      }
    } catch (e) {
      console.warn('Using default demo assignments:', e);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const [form, setForm] = useState({
    title: '',
    course: 'AHT-005',
    dueDate: '',
    maxMarks: 50,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;
    setIsSubmitting(true);

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: form.title,
      course: form.course === 'AHT-005' ? 'Maths-II' : 'Engineering Mathematics',
      dueDate: form.dueDate,
      maxMarks: Number(form.maxMarks),
      submittedCount: 0,
      totalStudents: 45,
    };

    setAssignments([newAssignment, ...assignments]);

    try {
      await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          courseCode: form.course,
          dueDate: form.dueDate,
          maxMarks: form.maxMarks,
        }),
      });
    } catch (err) {
      console.warn('Saved assignment locally:', err);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setForm({ title: '', course: 'AHT-005', dueDate: '', maxMarks: 50 });
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
          className="aurora-btn-primary px-4 py-2 text-xs flex items-center cursor-pointer"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create Assignment
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">Create New Assignment</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Assignment Title</label>
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
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Course</label>
                <select
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="AHT-005">Maths-II (AHT-005)</option>
                  <option value="AHT-001">Engineering Mathematics (AHT-001)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Due Date</label>
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
            title="No Assignments Created"
            description="You haven't published any coursework assignments yet. Click 'Create Assignment' above to publish one."
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
                  {a.submittedCount} / {a.totalStudents} Submissions
                </p>
                <button className="mt-2 rounded-xl bg-[#DBEAFE] dark:bg-[#1A2129] px-3.5 py-1.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-100 dark:hover:bg-[#27313B] border border-[#2563EB]/20 dark:border-[#27313B] transition-all cursor-pointer">
                  Evaluate Submissions
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

