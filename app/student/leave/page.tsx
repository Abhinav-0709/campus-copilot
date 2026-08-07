'use client';

import React, { useState } from 'react';
import { FileText, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

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
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      leaveType: 'medical',
      fromDate: '2026-08-10',
      toDate: '2026-08-12',
      reason: 'Fever and doctor recommended rest.',
      status: 'approved',
      createdAt: '2026-08-08',
    },
  ]);

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
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500">Apply for student leave and track approval status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Apply Leave
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">New Leave Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="medical">Medical Leave</option>
                  <option value="personal">Personal / Family</option>
                  <option value="academic">Academic Event</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">From Date</label>
                  <input
                    type="date"
                    required
                    value={form.fromDate}
                    onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">To Date</label>
                  <input
                    type="date"
                    required
                    value={form.toDate}
                    onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="State the reason for your leave request..."
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Requests List */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Application History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {leaveRequests.map((req) => (
            <div key={req.id} className="p-6 transition-colors hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase text-blue-700">
                    {req.leaveType}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">{req.reason}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Duration: {format(new Date(req.fromDate), 'MMM d, yyyy')} to {format(new Date(req.toDate), 'MMM d, yyyy')}
                  </p>
                </div>

                <div>
                  {req.status === 'approved' && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approved
                    </span>
                  )}
                  {req.status === 'pending' && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      <Clock className="mr-1 h-3.5 w-3.5" /> Pending Review
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
