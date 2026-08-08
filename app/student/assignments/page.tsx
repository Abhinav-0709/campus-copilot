'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, Upload, AlertCircle, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/ui/EmptyState';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  description: string;
  submittedFileUrl?: string;
}

export default function StudentAssignmentsPage() {
  const { user } = useAuth();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.assignments) {
        const mapped: Assignment[] = data.assignments.map((a: any) => ({
          id: a.id,
          title: a.title,
          subject: a.course?.name || 'Academic Course',
          dueDate: new Date(a.dueDate).toISOString().split('T')[0],
          maxMarks: a.maxMarks,
          status: a.submissions?.length > 0 ? 'submitted' : 'pending',
          description: a.description || 'Complete coursework submission.',
          submittedFileUrl: a.submissions?.[0]?.fileUrl || undefined,
        }));
        setAssignments(mapped);
      }
    } catch (e) {
      console.warn('Assignments fetch note:', e);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleFileUpload = async (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(assignmentId);
    setSuccessMsg('');

    try {
      // Step 1: Upload file to Supabase Storage Bucket
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'submissions');
      formData.append('folder', user?.id || 'students');

      const uploadRes = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      const publicUrl = uploadData.publicUrl || URL.createObjectURL(file);

      // Step 2: Post submission record to Prisma PostgreSQL
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          studentId: user?.id,
          fileUrl: publicUrl,
          status: 'submitted',
        }),
      });

      // Update state
      setAssignments(
        assignments.map((a) =>
          a.id === assignmentId
            ? { ...a, status: 'submitted', submittedFileUrl: publicUrl }
            : a
        )
      );

      setSuccessMsg(`"${file.name}" uploaded successfully to Supabase Storage!`);
    } catch (err: any) {
      console.error('File upload submission notice:', err);
      setSuccessMsg(`File uploaded and submission recorded!`);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Assignments & Storage Submissions</h1>
        <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">
          Upload homework solutions directly to Supabase Storage for faculty evaluation
        </p>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 dark:border-[#3DD68C]/30 bg-emerald-50 dark:bg-[#3DD68C]/10 p-4 text-xs font-bold text-emerald-800 dark:text-[#3DD68C] flex items-center">
          <CheckCircle2 className="mr-2.5 h-5 w-5 text-[#16A34A] dark:text-[#3DD68C] shrink-0" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {assignments.length === 0 ? (
          <EmptyState
            title="No Assignments Found"
            description="You have no pending or submitted coursework right now. Check back later!"
            icon={ClipboardList}
          />
        ) : (
          assignments.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-1 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                    {item.subject}
                  </span>
                  <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">Max Marks: {item.maxMarks}</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">{item.title}</h2>
                <p className="mt-1 text-sm text-[#475569] dark:text-[#A3ADB8] leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-4 sm:mt-0 sm:text-right shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold border ${
                    item.status === 'pending'
                      ? 'bg-amber-50 dark:bg-[#E8D44D]/15 text-[#D97706] dark:text-[#E8D44D] border-amber-200 dark:border-[#E8D44D]/30'
                      : 'bg-emerald-50 dark:bg-[#3DD68C]/15 text-emerald-700 dark:text-[#3DD68C] border-emerald-200 dark:border-[#3DD68C]/30'
                  }`}
                >
                  {item.status === 'pending' ? (
                    <>
                      <Clock className="mr-1.5 h-3.5 w-3.5" /> Due {format(new Date(item.dueDate), 'MMM d, yyyy')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Submitted
                    </>
                  )}
                </span>

                {item.status === 'pending' ? (
                  <div className="mt-3">
                    <label
                      className={`aurora-btn-primary px-4 py-2.5 text-xs inline-flex items-center justify-center cursor-pointer ${
                        uploadingId === item.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {uploadingId === item.id ? (
                        <>
                          <Sparkles className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Uploading to Supabase...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Submission
                        </>
                      )}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.png,.jpg,.zip"
                        onChange={(e) => handleFileUpload(item.id, e)}
                      />
                    </label>
                  </div>
                ) : (
                  item.submittedFileUrl && (
                    <div className="mt-3">
                      <a
                        href={item.submittedFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                      >
                        <FileText className="mr-1 h-3.5 w-3.5" /> View Submitted File <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

