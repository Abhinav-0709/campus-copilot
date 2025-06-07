import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, FileText, Upload, Download, Plus, Edit2, Trash2, User, CheckCircle } from 'lucide-react';

// Sample assignments data
const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Database Normalization',
    subject: 'Database Systems',
    description: 'Create a detailed report on database normalization forms (1NF to BCNF) with practical examples.',
    dueDate: '2025-05-15',
    points: 100,
    attachments: ['Assignment_Guidelines.pdf'],
    submissions: 18,
    totalStudents: 25
  },
  {
    id: 2,
    title: 'Binary Search Trees',
    subject: 'Data Structures',
    description: 'Implement a binary search tree with insertion, deletion, and traversal operations in any programming language.',
    dueDate: '2025-05-20',
    points: 150,
    attachments: ['BST_Requirements.pdf'],
    submissions: 12,
    totalStudents: 28
  },
  {
    id: 3,
    title: 'REST API Design',
    subject: 'Web Development',
    description: 'Design and document a RESTful API for a social media platform. Include endpoints, request/response formats, and authentication.',
    dueDate: '2025-05-25',
    points: 200,
    attachments: ['API_Specifications.pdf'],
    submissions: 5,
    totalStudents: 23
  }
];

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<typeof INITIAL_ASSIGNMENTS[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    points: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAssignment) {
      // Update existing assignment
      setAssignments(assignments.map(assignment =>
        assignment.id === selectedAssignment.id
          ? {
              ...assignment,
              ...formData,
              points: parseInt(formData.points)
            }
          : assignment
      ));
    } else {
      // Add new assignment
      const newAssignment = {
        id: Date.now(),
        ...formData,
        points: parseInt(formData.points),
        attachments: [],
        submissions: 0,
        totalStudents: 25
      };
      setAssignments([newAssignment, ...assignments]);
    }
    setShowForm(false);
    setSelectedAssignment(null);
    setFormData({ title: '', subject: '', description: '', dueDate: '', points: '' });
  };

  const handleEdit = (assignment: typeof INITIAL_ASSIGNMENTS[0]) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points.toString()
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Assignments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus size={20} className="mr-2" />
          New Assignment
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1 input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="mt-1 input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Attachments</label>
                <div className="mt-1 border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <Upload size={24} className="mx-auto text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-600">
                    Drag and drop your files here, or{' '}
                    <button type="button" className="text-primary-600 hover:text-primary-800">
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedAssignment(null);
                    setFormData({ title: '', subject: '', description: '', dueDate: '', points: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedAssignment ? 'Update' : 'Create'} Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-neutral-900">{assignment.title}</h2>
                </div>
                <p className="mt-1 text-neutral-600">{assignment.subject}</p>
                <div className="mt-2 flex items-center text-sm text-neutral-500 space-x-4">
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    Points: {assignment.points}
                  </span>
                  <span className="flex items-center">
                    <User size={16} className="mr-1" />
                    Submissions: {assignment.submissions}/{assignment.totalStudents}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(assignment)}
                  className="p-2 text-neutral-600 hover:text-primary-600 rounded-full hover:bg-neutral-100"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(assignment.id)}
                  className="p-2 text-neutral-600 hover:text-error-600 rounded-full hover:bg-neutral-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="mt-4 text-neutral-600">{assignment.description}</p>
            
            {assignment.attachments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-neutral-900">Attachments</h3>
                <div className="mt-2 space-y-2">
                  {assignment.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText size={16} className="text-neutral-500 mr-2" />
                        <span className="text-sm text-neutral-700">{attachment}</span>
                      </div>
                      <button className="text-primary-600 hover:text-primary-800 flex items-center text-sm">
                        <Download size={16} className="mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button className="btn-primary text-sm">
                  View Submissions
                </button>
                <button className="btn-secondary text-sm">
                  Send Reminder
                </button>
              </div>
              <div className="flex items-center text-sm">
                <span className={`flex items-center px-2 py-1 rounded-full ${
                  assignment.submissions === assignment.totalStudents
                    ? 'bg-success-100 text-success-800'
                    : assignment.submissions > assignment.totalStudents / 2
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-error-100 text-error-800'
                }`}>
                  <CheckCircle size={16} className="mr-1" />
                  {assignment.submissions === assignment.totalStudents
                    ? 'All Submitted'
                    : 'Submissions Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsPage;