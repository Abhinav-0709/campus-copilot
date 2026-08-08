'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

interface LeaveRequest {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function StudentLeavePage() {
  const [showModal, setShowModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    async function loadLeaveRequests() {
      try {
        const res = await fetch('/api/leave');
        const data = await res.json();
        if (data.leaveRequests) {
          const mapped: LeaveRequest[] = data.leaveRequests.map((l: any) => ({
            id: l.id,
            leaveType: l.leaveType,
            fromDate: l.fromDate.split('T')[0],
            toDate: l.toDate.split('T')[0],
            reason: l.reason,
            status: l.status,
            createdAt: l.createdAt.split('T')[0],
          }));
          setLeaveRequests(mapped);
        }
      } catch (e) {
        console.warn('Leave requests fetch note:', e);
      }
    }
    loadLeaveRequests();
  }, []);

  const [form, setForm] = useState({
    leaveType: 'medical',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fromDate || !form.toDate || !form.reason) return;

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowModal(false);
    setForm({ leaveType: 'medical', fromDate: '', toDate: '', reason: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Leave Management</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Apply for student leave and track approval status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="aurora-btn-primary px-4 py-2 text-xs flex items-center cursor-pointer"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Apply Leave
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">New Leave Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="medical">Medical Leave</option>
                  <option value="personal">Personal / Family</option>
                  <option value="academic">Academic Event</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">From Date</label>
                  <input
                    type="date"
                    required
                    value={form.fromDate}
                    onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">To Date</label>
                  <input
                    type="date"
                    required
                    value={form.toDate}
                    onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="State the reason for your leave request..."
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
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Requests List */}
      {leaveRequests.length === 0 ? (
        <EmptyState
          title="No Leave Applications"
          description="You haven't submitted any leave applications yet. Click 'Apply Leave' above to submit a new request."
          icon={FileText}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
          <div className="border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Application History</h2>
          </div>
          <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-6 transition-colors hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-1 text-xs font-extrabold uppercase text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                      {req.leaveType}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{req.reason}</h3>
                    <p className="mt-1 text-xs font-medium text-[#475569] dark:text-[#A3ADB8]">
                      Duration: {format(new Date(req.fromDate), 'MMM d, yyyy')} to {format(new Date(req.toDate), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div>
                    {req.status === 'approved' && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-[#3DD68C]/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-[#3DD68C] border border-emerald-200 dark:border-[#3DD68C]/30">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approved
                      </span>
                    )}
                    {req.status === 'pending' && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-[#E8D44D]/15 px-3 py-1 text-xs font-bold text-[#D97706] dark:text-[#E8D44D] border border-amber-200 dark:border-[#E8D44D]/30">
                        <Clock className="mr-1 h-3.5 w-3.5" /> Pending Review
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-[#FF5C5C]/15 px-3 py-1 text-xs font-bold text-rose-700 dark:text-[#FF5C5C] border border-rose-200 dark:border-[#FF5C5C]/30">
                        <XCircle className="mr-1 h-3.5 w-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

