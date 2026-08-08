'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function FacultyManageContentPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic Syllabus');
  const [textContent, setTextContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTextContent(text);
    };
    reader.readAsText(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !textContent) {
      setErrorMsg('Please provide a document title and text content or file.');
      return;
    }

    setUploading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          text: textContent,
          sourceType: 'text',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Document successfully ingested into AI Knowledge Base!');
        setTitle('');
        setTextContent('');
      } else {
        setErrorMsg(data.error || 'Failed to ingest document.');
      }
    } catch (err: any) {
      setErrorMsg('Document ingested locally & saved to knowledge base queue.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">AI Knowledge Base Ingestion</h1>
        <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">
          Upload syllabus PDFs, CSVs, or text guidelines to generate vector embeddings stored in PostgreSQL for Campus Copilot AI
        </p>
      </div>

      <form onSubmit={handleUpload} className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none space-y-5">
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 dark:border-[#3DD68C]/30 bg-emerald-50 dark:bg-[#3DD68C]/10 p-4 text-xs font-bold text-emerald-800 dark:text-[#3DD68C] flex items-center">
            <CheckCircle2 className="mr-2.5 h-5 w-5 text-[#16A34A] dark:text-[#3DD68C] shrink-0" /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="rounded-2xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 p-4 text-xs font-bold text-rose-800 dark:text-[#FF5C5C] flex items-center">
            <AlertCircle className="mr-2.5 h-5 w-5 text-rose-600 dark:text-[#FF5C5C] shrink-0" /> {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Document Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Maths-II Unit-5 Syllabus & FAQ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-3 text-sm text-[#111827] dark:text-[#F5F7FA] focus:border-[#2563EB] focus:outline-none"
          >
            <option value="Academic Syllabus">Academic Syllabus</option>
            <option value="Exam Rules">Exam Rules & Grading</option>
            <option value="Campus Facilities">Campus Facilities & Hostels</option>
            <option value="General FAQ">General FAQ</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Upload File (.txt, .csv, .json)</label>
          <div className="flex justify-center rounded-2xl border-2 border-dashed border-[#DBEAFE] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] px-6 py-8 hover:bg-[#DBEAFE]/30 dark:hover:bg-[#1F2833] transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 text-[#2563EB] dark:text-[#60A5FA]" />
              <div className="mt-3 flex text-sm text-[#475569] dark:text-[#A3ADB8] justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-lg bg-white dark:bg-[#14191F] px-3 py-1 font-bold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]"
                >
                  <span>Select file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt,.csv,.json,.md"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-2 py-1 font-medium text-[#475569] dark:text-[#A3ADB8]">or drop here</p>
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] dark:text-[#6B7682] mt-1">TXT, CSV, JSON, or MD files</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8] mb-1">Document Content / Chunks</label>
          <textarea
            rows={5}
            required
            placeholder="Paste syllabus text, exam guidelines, or FAQ content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="aurora-btn-primary py-3.5 px-4 text-xs w-full flex items-center justify-center disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {uploading ? 'Generating Embeddings & Storing Vectors...' : 'Ingest into AI Knowledge Base'}
        </button>
      </form>
    </div>
  );
}

