'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface AdminFeeRow {
  id: string;
  studentName: string;
  roll: string;
  semester: number;
  totalAmount: number;
  status: 'pending' | 'paid';
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<AdminFeeRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminFees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fees');
      const data = await res.json();
      if (data.feeRecords) {
        const mapped: AdminFeeRow[] = data.feeRecords.map((f: any) => ({
          id: f.id,
          studentName: f.student?.profile?.name || 'Enrolled Student',
          roll: f.student?.rollNumber || 'CS2026',
          semester: f.semester,
          totalAmount: f.totalAmount,
          status: f.status,
        }));
        setFees(mapped);
      }
    } catch (e) {
      console.warn('Admin fees fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminFees();
  }, []);

  const toggleFeeStatus = async (id: string, newStatus: 'paid' | 'pending') => {
    setFees(fees.map((f) => (f.id === id ? { ...f, status: newStatus } : f)));

    try {
      await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.warn('Status update warning:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Fee Administration & Control</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Track and manage student semester fee payments</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5EAF2] dark:border-[#27313B] flex items-center justify-between bg-[#F5F8FC] dark:bg-[#1A2129]">
          <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Semester Fee Records</h2>
          <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">{fees.length} Records</span>
        </div>

        {fees.length === 0 ? (
          <EmptyState
            title="No Fee Records Generated"
            description="There are currently no semester fee invoices generated in the database."
            icon={DollarSign}
            className="border-0 shadow-none py-12"
          />
        ) : (
          <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
            {fees.map((f) => (
              <div key={f.id} className="p-5 flex items-center justify-between hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                      Sem {f.semester}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#94A3B8] dark:text-[#6B7682]">({f.roll})</span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA] mt-1">{f.studentName}</h3>
                  <p className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">₹{f.totalAmount.toLocaleString()}</p>
                </div>

                <div>
                  <button
                    onClick={() => toggleFeeStatus(f.id, f.status === 'paid' ? 'pending' : 'paid')}
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                      f.status === 'paid'
                        ? 'bg-emerald-50 dark:bg-[#3DD68C]/15 text-emerald-700 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
                        : 'bg-amber-50 dark:bg-[#E8D44D]/15 text-[#D97706] dark:text-[#E8D44D] border-amber-200 dark:border-[#E8D44D]/30'
                    }`}
                  >
                    {f.status === 'paid' ? (
                      <>
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Paid
                      </>
                    ) : (
                      <>
                        <Clock className="mr-1.5 h-3.5 w-3.5" /> Mark Paid
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

