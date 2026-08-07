import React, { useState, useEffect } from 'react';
import { academicService, Notice, Assignment } from '../../services/academicService';
import { Plus, Pencil, Trash2, FileText, Copy as DocumentDuplicateIcon, Trash } from 'lucide-react'; // Using Copy as DocumentDuplicateIcon
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import NoticeForm from '../../components/academic/NoticeForm';
import AssignmentForm from '../../components/academic/AssignmentForm';
import 'react-tabs/style/react-tabs.css';

// Mock courses - replace with actual data from your context/API
const MOCK_COURSES = [
  { id: 'cs101', name: 'Introduction to Computer Science' },
  { id: 'math201', name: 'Advanced Mathematics' },
  { id: 'eng101', name: 'English Composition' },
];

const ManageContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabSelect = (index: number) => {
    setActiveTab(index);
    setActiveForm(null); // Reset active form when changing tabs
  };
  const [notices, setNotices] = useState<Notice[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  
  // Track which form should be shown based on active tab
  const [activeForm, setActiveForm] = useState<'notice' | 'assignment' | null>(null);
  
  // Show form based on active tab and form state
  const showNoticeForm = activeTab === 0 && activeForm === 'notice';
  const showAssignmentForm = activeTab === 1 && activeForm === 'assignment';

  // Load data
  useEffect(() => {
    loadNotices();
    loadAssignments();
  }, []);

  const loadNotices = () => {
    const allNotices = academicService.getNotices();
    setNotices(allNotices);
  };

  const loadAssignments = () => {
    const allAssignments = academicService.getAssignments();
    setAssignments(allAssignments);
  };

  const handleCreateNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    academicService.createNotice({
      ...notice,
      date: new Date() // Add current date when creating a new notice
    });
    loadNotices();
    setActiveForm(null);
    setEditingNotice(null);
  };

  const handleCreateAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
    };
    academicService.createAssignment(newAssignment);
    loadAssignments();
    setActiveForm(null);
    setEditingAssignment(null);
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      // In a real app, you would call an API here
      const updatedNotices = notices.filter(notice => notice.id !== id);
      setNotices(updatedNotices);
    }
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      // In a real app, you would call an API here
      const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
      setAssignments(updatedAssignments);
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setActiveForm('notice');
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setActiveForm('assignment');
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Academic Content Management</h1>
        <div className="flex space-x-4">
          {activeTab === 0 && (
            <button
              onClick={() => {
                setEditingNotice(null);
                setActiveForm('notice');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              {editingNotice ? 'Edit Notice' : 'New Notice'}
            </button>
          )}
          {activeTab === 1 && (
            <button
              onClick={() => {
                setEditingAssignment(null);
                setActiveForm('assignment');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
            </button>
          )}
        </div>
      </div>

      <Tabs selectedIndex={activeTab} onSelect={handleTabSelect}>
        <TabList className="flex border-b border-gray-200">
          <Tab
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 0
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Notices
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {notices.length}
              </span>
            </div>
          </Tab>
          <Tab
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 1
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <DocumentDuplicateIcon className="mr-2 h-5 w-5" />
              Assignments
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {assignments.length}
              </span>
            </div>
          </Tab>
        </TabList>

        <TabPanel>
          {showNoticeForm ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </h3>
              <NoticeForm
                onSubmit={handleCreateNotice}
                initialData={editingNotice || undefined}
                onCancel={() => {
                  setActiveForm(null);
                  setEditingNotice(null);
                }}
              />
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {notices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notices</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new notice.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveForm('notice')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      New Notice
                    </button>
                  </div>
                </div>
              ) : (
              <ul className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <li key={notice.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notice.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {notice.content}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>{notice.author}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(notice.date)}</span>
                          <span className="mx-1">•</span>
                          <span>{Array.isArray(notice.targetAudience) ? notice.targetAudience.join(', ') : notice.targetAudience}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          {notice.courseId && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                              {MOCK_COURSES.find(c => c.id === notice.courseId)?.name || notice.courseId}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleEditNotice(notice)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              )}
            </div>
          )}
        </TabPanel>

        <TabPanel>
          {showAssignmentForm ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
              </h3>
              <AssignmentForm
                onSubmit={handleCreateAssignment}
                initialData={editingAssignment || undefined}
                onCancel={() => {
                  setActiveForm(null);
                  setEditingAssignment(null);
                }}
                courses={MOCK_COURSES}
              />
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {assignments.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new assignment.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveForm('assignment')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      New Assignment
                    </button>
                  </div>
                </div>
              ) : (
              <ul className="divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {assignment.title}
                          </p>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assignment.courseId ? MOCK_COURSES.find(c => c.id === assignment.courseId)?.name || assignment.courseId : 'General'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {assignment.description}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                          <span className="mx-1">•</span>
                          <span>Max Marks: {assignment.maxMarks}</span>
                          <span className="mx-1">•</span>
                          <span className="capitalize">{assignment.submissionType} submission</span>
                          {assignment.attachments && assignment.attachments.length > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{assignment.attachments.length} attachments</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              )}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ManageContentPage;
