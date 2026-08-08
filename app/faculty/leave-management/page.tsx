'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Clock, RefreshCw, FileText } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface LeaveItem {
  id: string;
  student: string;
  roll: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function FacultyLeaveManagementPage() {
  const [requests, setRequests] = useState<LeaveItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leave');
      const data = await res.json();
      if (data.leaveRequests) {
        const mapped: LeaveItem[] = data.leaveRequests.map((l: any) => ({
          id: l.id,
          student: l.profile?.name || 'Student Applicant',
          roll: l.profile?.student?.rollNumber || 'CS2026',
          leaveType: l.leaveType,
          fromDate: l.fromDate.split('T')[0],
          toDate: l.toDate.split('T')[0],
          reason: l.reason,
          status: l.status,
        }));
        setRequests(mapped);
      }
    } catch (e) {
      console.warn('Faculty leave fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leave');
      const data = await res.json();
      if (data.leaves && data.leaves.length > 0) {
        const mapped: LeaveItem[] = data.leaves.map((l: any) => ({
          id: l.id,
          student: l.profile?.name || 'Student',
          roll: l.profile?.student?.rollNumber || 'CS2026000',
          leaveType: l.leaveType,
          fromDate: new Date(l.fromDate).toISOString().split('T')[0],
          toDate: new Date(l.toDate).toISOString().split('T')[0],
          reason: l.reason,
          status: l.status,
        }));
        setRequests(mapped);
      }
    } catch (e) {
      console.warn('Using default demo leaves:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    try {
      await fetch('/api/leave', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          reviewedBy: 'Dr. Vidit Vats',
        }),
      });
    } catch (e) {
      console.warn('API status update failed locally:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Student Leave Approvals</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Review and approve student leave applications in real time</p>
        </div>
        <button
          onClick={fetchLeaves}
          disabled={loading}
          className="inline-flex items-center rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#1A2129] px-3.5 py-2 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] hover:bg-[#F5F8FC] dark:hover:bg-[#27313B] transition-all cursor-pointer"
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <EmptyState
            title="No Leave Applications"
            description="There are currently no student leave applications submitted for your review."
            icon={FileText}
          />
        ) : (
          requests.map((req) => (
          <div key={req.id} className="rounded-2xl bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase border border-[#2563EB]/20 dark:border-[#27313B]">
                  {req.leaveType}
                </span>
                <span className="text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">
                  {req.fromDate} to {req.toDate}
                </span>
              </div>
              <h2 className="mt-2 text-base font-bold text-[#111827] dark:text-[#F5F7FA]">
                {req.student} <span className="text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">({req.roll})</span>
              </h2>
              <p className="mt-1 text-sm font-medium text-[#475569] dark:text-[#A3ADB8] leading-relaxed">{req.reason}</p>
            </div>

            <div className="flex items-center space-x-3">
              {req.status === 'pending' ? (
                <>
                  <button
                    onClick={() => updateStatus(req.id, 'approved')}
                    className="inline-flex items-center rounded-xl bg-[#16A34A] dark:bg-[#3DD68C] px-4 py-2 text-xs font-bold text-white dark:text-[#0B0E12] hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'rejected')}
                    className="inline-flex items-center rounded-xl bg-rose-600 dark:bg-[#FF5C5C] px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-all cursor-pointer"
                  >
                    <X className="mr-1 h-3.5 w-3.5" /> Reject
                  </button>
                </>
              ) : (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                    req.status === 'approved'
                      ? 'bg-emerald-50 dark:bg-[#3DD68C]/15 text-emerald-700 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
                      : 'bg-rose-50 dark:bg-[#FF5C5C]/15 text-rose-700 dark:text-[#FF5C5C] border-rose-200 dark:border-[#FF5C5C]/30'
                  }`}
                >
                  {req.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              )}
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

