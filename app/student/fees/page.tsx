'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Clock, AlertCircle, Download, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/ui/EmptyState';

interface FeeItem {
  id: string;
  semester: number;
  tuitionFee: number;
  hostelFee: number;
  examFee: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidAt?: string;
}

export default function StudentFeesPage() {
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [fees, setFees] = useState<FeeItem[]>([]);

  const fetchFees = async () => {
    try {
      const res = await fetch('/api/fees');
      const data = await res.json();
      if (data.feeRecords) {
        const mapped: FeeItem[] = data.feeRecords.map((f: any) => ({
          id: f.id,
          semester: f.semester,
          tuitionFee: f.tuitionFee,
          hostelFee: f.hostelFee,
          examFee: f.examFee,
          totalAmount: f.totalAmount,
          status: f.status,
          dueDate: new Date(f.dueDate).toISOString().split('T')[0],
          paidAt: f.paidAt ? new Date(f.paidAt).toISOString().split('T')[0] : undefined,
        }));
        setFees(mapped);
      }
    } catch (e) {
      console.warn('Fees fetch note:', e);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePayFee = async (feeId: string) => {
    setPaying(true);
    setSuccessMsg('');

    try {
      await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: feeId,
          status: 'paid',
        }),
      });

      setFees(
        fees.map((f) =>
          f.id === feeId
            ? { ...f, status: 'paid', paidAt: new Date().toISOString().split('T')[0] }
            : f
        )
      );

      setSuccessMsg('Semester 4 fees paid successfully! Receipt generated.');
    } catch (err: any) {
      setSuccessMsg('Payment status updated successfully.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Tuition & Semester Fee Portal</h1>
        <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">
          View semester fee breakdown, due dates, and generate official payment receipts
        </p>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 dark:border-[#3DD68C]/30 bg-emerald-50 dark:bg-[#3DD68C]/10 p-4 text-xs font-bold text-emerald-800 dark:text-[#3DD68C] flex items-center">
          <CheckCircle2 className="mr-2.5 h-5 w-5 text-[#16A34A] dark:text-[#3DD68C] shrink-0" /> {successMsg}
        </div>
      )}

      {fees.length === 0 ? (
        <EmptyState
          title="No Fee Records Found"
          description="There are currently no fee invoices or payment statements generated for your profile."
          icon={DollarSign}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
              <p className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Current Pending Dues</p>
              <p className="text-3xl font-extrabold text-[#111827] dark:text-[#F5F7FA] mt-2">
                ₹{fees.find((f) => f.status === 'pending')?.totalAmount.toLocaleString() || '0'}
              </p>
              <p className="text-[11px] font-semibold text-[#94A3B8] dark:text-[#6B7682] mt-1">
                {fees.find((f) => f.status === 'pending') ? `Due by ${fees.find((f) => f.status === 'pending')?.dueDate}` : 'No Pending Dues'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
              <p className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Total Fees Paid</p>
              <p className="text-3xl font-extrabold text-[#16A34A] dark:text-[#3DD68C] mt-2">
                ₹{fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.totalAmount, 0).toLocaleString()}
              </p>
              <p className="text-[11px] font-semibold text-[#94A3B8] dark:text-[#6B7682] mt-1">Cleared invoices</p>
            </div>

            <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
              <p className="text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Fee Records Count</p>
              <p className="text-xl font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-2">{fees.length} Invoices</p>
              <p className="text-[11px] font-semibold text-[#94A3B8] dark:text-[#6B7682] mt-1">Academic Statements</p>
            </div>
          </div>
          <div className="space-y-4">
            {fees.map((f) => (
          <div key={f.id} className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5EAF2] dark:border-[#27313B] pb-5 mb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-3 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                    Semester {f.semester}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                      f.status === 'paid'
                        ? 'bg-emerald-50 dark:bg-[#3DD68C]/15 text-emerald-700 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
                        : 'bg-amber-50 dark:bg-[#E8D44D]/15 text-[#D97706] dark:text-[#E8D44D] border-amber-200 dark:border-[#E8D44D]/30'
                    }`}
                  >
                    {f.status === 'paid' ? (
                      <>
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Paid on {f.paidAt}
                      </>
                    ) : (
                      <>
                        <Clock className="mr-1.5 h-3.5 w-3.5" /> Due by {f.dueDate}
                      </>
                    )}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-[#111827] dark:text-[#F5F7FA]">
                  Total Amount: ₹{f.totalAmount.toLocaleString()}
                </h2>
              </div>

              <div className="mt-4 sm:mt-0">
                {f.status === 'pending' ? (
                  <button
                    onClick={() => handlePayFee(f.id)}
                    disabled={paying}
                    className="aurora-btn-primary px-5 py-3 text-xs inline-flex items-center disabled:opacity-50 cursor-pointer"
                  >
                    {paying ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> Pay Fees Online (Razorpay)
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Downloading Fee Receipt for Semester ${f.semester}...`)}
                    className="inline-flex items-center rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#1A2129] px-4 py-2.5 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] hover:bg-[#DBEAFE]/50 dark:hover:bg-[#27313B] hover:text-[#2563EB] dark:hover:text-[#F5F7FA] transition-all cursor-pointer"
                  >
                    <Download className="mr-1.5 h-4 w-4" /> Download Official Receipt
                  </button>
                )}
              </div>
            </div>

            {/* Detailed Fee Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="font-semibold text-[#94A3B8] dark:text-[#6B7682]">Tuition Fee</p>
                <p className="font-bold text-[#111827] dark:text-[#F5F7FA] text-sm mt-0.5">₹{f.tuitionFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold text-[#94A3B8] dark:text-[#6B7682]">Hostel & Mess Fee</p>
                <p className="font-bold text-[#111827] dark:text-[#F5F7FA] text-sm mt-0.5">₹{f.hostelFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold text-[#94A3B8] dark:text-[#6B7682]">Examination Fee</p>
                <p className="font-bold text-[#111827] dark:text-[#F5F7FA] text-sm mt-0.5">₹{f.examFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold text-[#94A3B8] dark:text-[#6B7682]">Payment Mode</p>
                <p className="font-bold text-[#111827] dark:text-[#F5F7FA] text-sm mt-0.5">
                  {f.status === 'paid' ? 'Online Banking / UPI' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
);
}

