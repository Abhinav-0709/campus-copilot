'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Plus, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminAcademicSetupPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'enrollments' | 'schedules'>('courses');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for Courses tab
  const [courses, setCourses] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    credits: 3,
    semester: 1,
    department: 'Computer Science',
    section: 'A',
    facultyId: '',
  });

  // State for Enrollments tab
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    studentId: '',
    courseId: '',
  });

  // State for Schedules tab
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    courseId: '',
    dayOfWeek: 'monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    room: '101-A',
  });

  // Data fetching routines
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.courses) setCourses(data.courses);
      if (data.facultyList) setFacultyList(data.facultyList);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/admin/enrollments');
      const data = await res.json();
      if (data.enrollments) setEnrollments(data.enrollments);
      if (data.students) setStudents(data.students);
      if (data.courses) setCourses(data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/admin/schedules');
      const data = await res.json();
      if (data.schedules) setSchedules(data.schedules);
      if (data.courses) setCourses(data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchCourses(), fetchEnrollments(), fetchSchedules()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Course creation & deletion
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.code || !courseForm.name || !courseForm.facultyId) return;

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Course ${courseForm.code} created successfully!` });
        setShowCourseModal(false);
        setCourseForm({ code: '', name: '', credits: 3, semester: 1, department: 'Computer Science', section: 'A', facultyId: '' });
        fetchCourses();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create course' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error connecting to server' });
    }
  };

  const handleDeleteCourse = async (id: string, code: string) => {
    if (!window.confirm(`Delete course ${code}? All linked assignments, schedules, and attendance records will be removed.`)) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: `Course ${code} deleted.` });
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Enrollment creation & deletion
  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.studentId || !enrollForm.courseId) return;

    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Student enrolled successfully!' });
        setShowEnrollModal(false);
        setEnrollForm({ studentId: '', courseId: '' });
        fetchEnrollments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to enroll student' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error enrolling student' });
    }
  };

  const handleDeleteEnrollment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enrollments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Enrollment removed.' });
        fetchEnrollments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Schedule creation & deletion
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.courseId || !scheduleForm.room) return;

    try {
      const res = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Lecture schedule added successfully!' });
        setShowScheduleModal(false);
        setScheduleForm({ courseId: '', dayOfWeek: 'monday', startTime: '09:00 AM', endTime: '10:00 AM', room: '101-A' });
        fetchSchedules();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create schedule' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error adding schedule' });
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/schedules?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Schedule deleted.' });
        fetchSchedules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Academic Setup & Administration</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">
            Configure college courses, assign faculty, enroll students, and manage timetables
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="aurora-btn-primary px-4 py-2.5 text-xs inline-flex items-center cursor-pointer w-fit"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Setup
        </button>
      </div>

      {/* Alert banner */}
      {message && (
        <div
          className={`rounded-2xl border p-4 text-xs font-bold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-[#3DD68C]/10 border-emerald-200 dark:border-[#3DD68C]/30 text-emerald-800 dark:text-[#3DD68C]'
              : 'bg-rose-50 dark:bg-[#FF5C5C]/10 border-rose-200 dark:border-[#FF5C5C]/30 text-rose-800 dark:text-[#FF5C5C]'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-[#E5EAF2] dark:border-[#27313B] pb-3 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('courses')}
          className={`inline-flex items-center rounded-xl px-4 py-2.5 transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'bg-white dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] hover:bg-[#DBEAFE]/50 dark:hover:bg-[#27313B] border border-[#E5EAF2] dark:border-[#27313B]'
          }`}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Courses & Faculty ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('enrollments')}
          className={`inline-flex items-center rounded-xl px-4 py-2.5 transition-all cursor-pointer ${
            activeTab === 'enrollments'
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'bg-white dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] hover:bg-[#DBEAFE]/50 dark:hover:bg-[#27313B] border border-[#E5EAF2] dark:border-[#27313B]'
          }`}
        >
          <Users className="mr-2 h-4 w-4" /> Student Enrollments ({enrollments.length})
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`inline-flex items-center rounded-xl px-4 py-2.5 transition-all cursor-pointer ${
            activeTab === 'schedules'
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'bg-white dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] hover:bg-[#DBEAFE]/50 dark:hover:bg-[#27313B] border border-[#E5EAF2] dark:border-[#27313B]'
          }`}
        >
          <Calendar className="mr-2 h-4 w-4" /> Timetables & Schedules ({schedules.length})
        </button>
      </div>

      {/* TAB 1: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Active Academic Courses</h2>
            <button
              onClick={() => setShowCourseModal(true)}
              className="aurora-btn-primary px-3.5 py-2 text-xs flex items-center cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Create New Course
            </button>
          </div>

          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden">
            {courses.length === 0 ? (
              <EmptyState
                title="No Courses Configured"
                description="No academic courses exist in the system database yet. Click 'Create New Course' to establish your first subject."
                icon={BookOpen}
                className="border-0 shadow-none py-12"
              />
            ) : (
              <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
                {courses.map((c) => (
                  <div key={c.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-[#DBEAFE] dark:bg-[#1A2129] px-2 py-0.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                          {c.code}
                        </span>
                        {c.section && (
                          <span className="rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-extrabold text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            Sec {c.section}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
                          Sem {c.semester} • {c.credits} Credits • {c.department}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111827] dark:text-[#F5F7FA] mt-1">{c.name}</h3>
                      <p className="text-xs font-medium text-[#475569] dark:text-[#A3ADB8] mt-0.5">
                        Assigned Faculty: <span className="font-extrabold text-[#111827] dark:text-[#F5F7FA]">{c.facultyName}</span> ({c.facultyEmail || 'No email'})
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">
                        <div>{c.enrollmentsCount} Students Enrolled</div>
                        <div>{c.schedulesCount} Weekly Lectures</div>
                      </div>
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.code)}
                        className="rounded-xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 p-2 text-rose-600 dark:text-[#FF5C5C] hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Student Course Enrollments</h2>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="aurora-btn-primary px-3.5 py-2 text-xs flex items-center cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Enroll Student
            </button>
          </div>

          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden">
            {enrollments.length === 0 ? (
              <EmptyState
                title="No Enrollments Found"
                description="No students have been enrolled in courses yet. Use 'Enroll Student' to connect students to courses."
                icon={Users}
                className="border-0 shadow-none py-12"
              />
            ) : (
              <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
                {enrollments.map((e) => (
                  <div key={e.id} className="p-4 flex items-center justify-between hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                    <div>
                      <p className="text-sm font-extrabold text-[#111827] dark:text-[#F5F7FA]">{e.studentName}</p>
                      <p className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
                        Roll No: {e.studentRoll} • Section: {e.studentSection || 'N/A'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="rounded-md bg-[#DBEAFE] dark:bg-[#1A2129] px-2 py-0.5 text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                          {e.courseCode}
                        </span>
                        <p className="text-xs font-bold text-[#111827] dark:text-[#F5F7FA] mt-0.5">{e.courseName}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteEnrollment(e.id)}
                        className="rounded-xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 p-2 text-rose-600 dark:text-[#FF5C5C] hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title="Remove Enrollment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Weekly Class Timetables</h2>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="aurora-btn-primary px-3.5 py-2 text-xs flex items-center cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add Lecture Schedule
            </button>
          </div>

          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden">
            {schedules.length === 0 ? (
              <EmptyState
                title="No Timetables Configured"
                description="No lecture times or rooms have been scheduled yet. Use 'Add Lecture Schedule' to build the timetable."
                icon={Calendar}
                className="border-0 shadow-none py-12"
              />
            ) : (
              <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B]">
                {schedules.map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="capitalize text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] bg-[#DBEAFE] dark:bg-[#1A2129] px-2.5 py-0.5 rounded-full border border-[#2563EB]/20 dark:border-[#27313B]">
                          {s.dayOfWeek}
                        </span>
                        <span className="text-xs font-bold text-[#111827] dark:text-[#F5F7FA]">
                          {s.startTime} - {s.endTime}
                        </span>
                        <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
                          • Room {s.room}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA] mt-1">
                        {s.courseCode}: {s.courseName}
                      </p>
                      <p className="text-xs text-[#475569] dark:text-[#A3ADB8]">
                        Faculty: {s.facultyName}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteSchedule(s.id)}
                      className="rounded-xl border border-rose-200 dark:border-[#FF5C5C]/30 bg-rose-50 dark:bg-[#FF5C5C]/10 p-2 text-rose-600 dark:text-[#FF5C5C] hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                      title="Delete Schedule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS201"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Section</label>
                  <input
                    type="text"
                    placeholder="e.g. A"
                    value={courseForm.section}
                    onChange={(e) => setCourseForm({ ...courseForm, section: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Assign Faculty *</label>
                <select
                  required
                  value={courseForm.facultyId}
                  onChange={(e) => setCourseForm({ ...courseForm, facultyId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                >
                  <option value="">-- Select Faculty Member --</option>
                  {facultyList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Credits</label>
                  <input
                    type="number"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Semester</label>
                  <input
                    type="number"
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Department</label>
                  <input
                    type="text"
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="rounded-xl border border-[#E5EAF2] dark:border-[#27313B] px-4 py-2 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="aurora-btn-primary px-4 py-2 text-xs cursor-pointer">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">Enroll Student in Course</h2>
            <form onSubmit={handleCreateEnrollment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Select Student *</label>
                <select
                  required
                  value={enrollForm.studentId}
                  onChange={(e) => setEnrollForm({ ...enrollForm, studentId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll: {s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Select Course *</label>
                <select
                  required
                  value={enrollForm.courseId}
                  onChange={(e) => setEnrollForm({ ...enrollForm, courseId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} {c.section ? `(Sec ${c.section})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-xl border border-[#E5EAF2] dark:border-[#27313B] px-4 py-2 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="aurora-btn-primary px-4 py-2 text-xs cursor-pointer">
                  Save Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14191F] border border-[#E5EAF2] dark:border-[#27313B] p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F5F7FA]">Add Lecture Schedule</h2>
            <form onSubmit={handleCreateSchedule} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Select Course *</label>
                <select
                  required
                  value={scheduleForm.courseId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, courseId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Day of Week *</label>
                  <select
                    value={scheduleForm.dayOfWeek}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101-A"
                    value={scheduleForm.room}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">Start Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] dark:text-[#A3ADB8]">End Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-2.5 text-sm text-[#111827] dark:text-[#F5F7FA]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-xl border border-[#E5EAF2] dark:border-[#27313B] px-4 py-2 text-xs font-bold text-[#475569] dark:text-[#A3ADB8] cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="aurora-btn-primary px-4 py-2 text-xs cursor-pointer">
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
