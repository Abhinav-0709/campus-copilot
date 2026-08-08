'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface Notice {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
}

export default function FacultyNoticesPage() {
  const [showModal, setShowModal] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function loadNotices() {
      try {
        const res = await fetch('/api/notices');
        const data = await res.json();
        if (data.notices) {
          const mapped: Notice[] = data.notices.map((n: any) => ({
            id: n.id,
            title: n.title,
            category: n.category || 'General',
            content: n.content,
            date: n.createdAt.split('T')[0],
          }));
          setNotices(mapped);
        }
      } catch (e) {
        console.warn('Notices fetch note:', e);
      }
    }
    loadNotices();
  }, []);

  const [form, setForm] = useState({ title: '', category: 'Academic', content: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    const newNotice: Notice = {
      id: Date.now().toString(),
      title: form.title,
      category: form.category,
      content: form.content,
      date: new Date().toISOString().split('T')[0],
    };

    setNotices([newNotice, ...notices]);
    setShowModal(false);
    setForm({ title: '', category: 'Academic', content: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Campus Notice Board</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Publish official announcements to students and department members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="aurora-btn-primary px-4 py-2 text-xs flex items-center cursor-pointer"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Post Notice
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">Post Official Announcement</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Notice Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Tutorial Class Rescheduled"
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Event">Event</option>
                  <option value="Administrative">Administrative</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Content</label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the complete announcement text..."
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                />
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
                  className="aurora-btn-primary px-4 py-2 text-xs cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notices.length === 0 ? (
          <EmptyState
            title="No Notices Published"
            description="You haven't published any circulars or notice announcements yet. Click 'Publish New Notice' above to post one."
            icon={FileText}
          />
        ) : (
          notices.map((n) => (
            <div key={n.id} className="rounded-2xl bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B]">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                  {n.category}
                </span>
                <span className="text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">
                  {format(new Date(n.date), 'MMM d, yyyy')}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">{n.title}</h2>
              <p className="mt-1.5 text-sm font-medium text-[#475569] dark:text-[#A3ADB8] leading-relaxed">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
