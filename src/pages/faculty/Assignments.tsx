import React, { useState } from 'react';
import { 
  Book, 
  Plus, 
  Calendar,
  FileText,
  Users,
  Clock,
  ChevronDown,
  Download,
  Upload,
  Search
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  course: string;
  totalPoints: number;
  submissionCount: number;
  status: 'active' | 'draft' | 'closed';
}

const FacultyAssignments: React.FC = () => {
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const assignments: Assignment[] = [
    {
      id: 'A1',
      title: 'Assignment 1',
      description: 'unit 1',
      dueDate: '2025-03-24',
      course: 'Exact differential equation ',
      totalPoints: 100,
      submissionCount: 15,
      status: 'active'
    },
    {
      id: 'A2',
      title: 'Assignement 2',
      description: 'unit 2.',
      dueDate: '2025-03-30',
      course: 'partial differential equation',
      totalPoints: 100,
      submissionCount: 12,
      status: 'active'
    },
    {
      id: 'A3',
      title: 'Assignment 3',
      description: 'unit-sequence serise.',
      dueDate: '2024-03-20',
      course: 'Slove problems by First Comparison test and Limit form test ',
      totalPoints: 50,
      submissionCount: 18,
      status: 'closed'
    },
    {
    id: 'A4',
    title: 'Assignment 4',
    description: 'unit 4 .',
    dueDate: '2025-03-20',
    course: 'Comlex integration, couchy integral formula cauchy integral theorem',
    totalPoints: 50,
    submissionCount: 18,
    status: 'active'
    }
  
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
        <p className="text-gray-600">Create and manage course assignments</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-3 text-primary-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Assignments</p>
              <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-success-100 p-3 text-success-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assignments.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-warning-100 p-3 text-warning-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-error-100 p-3 text-error-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Past Due</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-4 shadow">
              <button
                onClick={() => setShowNewAssignmentModal(true)}
                className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Assignment
              </button>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 font-medium text-gray-900">Filter by Status</h2>
              <div className="space-y-2">
                {['all', 'active', 'draft', 'closed'].map((status) => (
                  <button
                    key={status}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium capitalize ${
                      statusFilter === status
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'All Assignments' : status}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 font-medium text-gray-900">Quick Actions</h2>
              <div className="space-y-2">
                <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Download className="mr-2 h-4 w-4" />
                  Export Assignments
                </button>
                <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Assignments
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Assignments ({filteredAssignments.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {assignment.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {assignment.course}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        {assignment.description}
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1.5 h-4 w-4" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1.5 h-4 w-4" />
                          {assignment.submissionCount} submissions
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <FileText className="mr-1.5 h-4 w-4" />
                          {assignment.totalPoints} points
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          assignment.status === 'active'
                            ? 'bg-success-100 text-success-800'
                            : assignment.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-error-100 text-error-800'
                        }`}
                      >
                        {assignment.status}
                      </span>
                      <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAssignments.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <Book className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No assignments found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new assignment.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowNewAssignmentModal(true)}
                      className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      New Assignment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAssignments;