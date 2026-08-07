import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, FileText, Upload, Download, Eye, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Sample assignments data
const ASSIGNMENTS = [
  {
    id: 1,
    title: 'Unit-1',
    subject: 'Basic Mechanical Engineering',
    description: 'CO-PLANAR FORCES SYSTEM',
    dueDate: '2025-03-20',
    points: 10,
    status: 'submitted',
    attachments: ['Assignment_Guidelines.pdf'],
    submissionType: 'document'
  },
  {
    id: 2,
    title: 'Unit-4',
    subject: 'Basic Electronics Engineering',
    description: 'Diode Applications and Breakdown of Voltage',
    dueDate: '2025-05-02',
    points: 10,
    status: 'pending',
    attachments: ['Ece Unit2.pdf'],
    submissionType: 'code',
    submittedOn: '2025-03-18'
  },
  {
    id: 3,
    title: 'Unit-4',
    subject: 'Basic Mechancial Engineering',
    description: 'Thermodynamics',
    dueDate: '2025-04-22',
    points: 10,
    status: 'graded',
    grade: '8',
    attachments: ['Mech Assgin Unit4.pdf'],
    submissionType: 'document',
    submittedOn: '2025-04-21',
    feedback: 'explain with the help of diagram'
  },
  {
  id: 4,
    title: 'Unit-4',
    subject: 'Basic Electronics Engg.',
    description: 'Field Effect Transistors',
    dueDate: '2025-04-22',
    points: 10,
    status: 'graded',
    grade: '10',
    attachments: ['Ece Assgin Unit4.pdf'],
    submissionType: 'document',
    submittedOn: '2025-04-20',
  },
  {
    id: 5,
    title: 'Unit-5',
    subject: 'Maths-II',
    description: 'Functions Of complex Variables',
    dueDate: '2025-05-12',
    points: 10,
    status: 'pending',
    attachments: ['Assignment_Guidelines.pdf'],
    submissionType: 'document'
  }

];


const StudentAssignmentsPage: React.FC = () => {
  useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<typeof ASSIGNMENTS[0] | null>(null);
  const [filter, setFilter] = useState('all'); // all, pending, submitted, graded

  const filteredAssignments = ASSIGNMENTS.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'submitted':
        return 'bg-primary-100 text-primary-800';
      case 'graded':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">My Assignments</h1>
        <span className="text-sm text-neutral-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'pending', 'submitted', 'graded'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              filter === filterOption
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {selectedAssignment ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">{selectedAssignment.title}</h2>
                <p className="text-neutral-600 mt-1">{selectedAssignment.subject}</p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-neutral-600 hover:text-neutral-800"
              >
                Back to list
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center text-neutral-600">
                <Calendar size={18} className="mr-2" />
                Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-neutral-600">
                <FileText size={18} className="mr-2" />
                Points: {selectedAssignment.points}
              </div>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedAssignment.status)}`}>
                  {selectedAssignment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-neutral-900">Description</h3>
              <p className="mt-2 text-neutral-600">{selectedAssignment.description}</p>
            </div>

            {/* Attachments */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-neutral-900">Attachments</h3>
              <div className="mt-2 space-y-2">
                {selectedAssignment.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText size={18} className="text-neutral-500 mr-2" />
                      <span className="text-neutral-700">{attachment}</span>
                    </div>
                    <button className="text-primary-600 hover:text-primary-800 flex items-center">
                      <Download size={18} className="mr-1" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Section */}
            {selectedAssignment.status === 'pending' ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-neutral-900">Submit Assignment</h3>
                <div className="mt-4">
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <Upload size={24} className="mx-auto text-neutral-400" />
                    <p className="mt-2 text-neutral-600">
                      Drag and drop your files here, or{' '}
                      <button className="text-primary-600 hover:text-primary-800">browse</button>
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, ZIP (max 50MB)
                    </p>
                  </div>
                  <button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
                    Submit Assignment
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-neutral-900">Submission Details</h3>
                <div className="mt-2 bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600">
                        Submitted on: {selectedAssignment.submittedOn}
                      </p>
                      {selectedAssignment.grade && (
                        <p className="text-neutral-600 mt-1">
                          Grade: {selectedAssignment.grade}/{selectedAssignment.points}
                        </p>
                      )}
                    </div>
                    <button className="text-primary-600 hover:text-primary-800 flex items-center">
                      <Eye size={18} className="mr-1" />
                      View Submission
                    </button>
                  </div>
                  {selectedAssignment.feedback && (
                    <div className="mt-4 border-t border-neutral-200 pt-4">
                      <h4 className="font-medium text-neutral-900">Feedback</h4>
                      <p className="mt-2 text-neutral-600">{selectedAssignment.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => setSelectedAssignment(assignment)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900">{assignment.title}</h3>
                  <p className="text-neutral-600 mt-1">{assignment.subject}</p>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center text-neutral-600">
                      <Calendar size={18} className="mr-2" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Clock size={18} className="mr-2" />
                      {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <FileText size={18} className="mr-2" />
                      Points: {assignment.points}
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  {assignment.grade && (
                    <span className="mt-2 text-sm text-neutral-600">
                      Grade: {assignment.grade}/{assignment.points}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-neutral-600 line-clamp-2">{assignment.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-500">
                  <BookOpen size={16} className="mr-1" />
                  {assignment.attachments.length} attachment{assignment.attachments.length !== 1 ? 's' : ''}
                </div>
                {assignment.status === 'pending' ? (
                  <div className="flex items-center text-warning-600">
                    <Clock size={16} className="mr-1" />
                    Due soon
                  </div>
                ) : assignment.status === 'submitted' ? (
                  <div className="flex items-center text-primary-600">
                    <CheckCircle size={16} className="mr-1" />
                    Submitted
                  </div>
                ) : (
                  <div className="flex items-center text-success-600">
                    <CheckCircle size={16} className="mr-1" />
                    Graded
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;