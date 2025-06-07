import React, { useState } from 'react';
import { Assignment } from '../../services/academicService';

interface AssignmentFormProps {
  onSubmit: (assignment: Omit<Assignment, 'id'>) => void;
  initialData?: Partial<Omit<Assignment, 'id'>>;
  onCancel?: () => void;
  courses: Array<{ id: string; name: string }>;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel,
  courses,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    courseId: initialData.courseId || '',
    courseName: initialData.courseName || '',
    maxMarks: initialData.maxMarks?.toString() || '100',
    submissionType: initialData.submissionType || 'online',
    attachments: initialData.attachments || [],
  });

  const [newAttachment, setNewAttachment] = useState({ name: '', url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignment: Omit<Assignment, 'id'> = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      maxMarks: parseInt(formData.maxMarks, 10),
      submissionType: formData.submissionType as 'online' | 'offline',
      courseName: courses.find(c => c.id === formData.courseId)?.name || '',
    };
    
    onSubmit(assignment);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAttachment = () => {
    if (newAttachment.name && newAttachment.url) {
      setFormData(prev => ({
        ...prev,
        attachments: [
          ...(prev.attachments || []),
          {
            ...newAttachment,
            type: newAttachment.url.split('.').pop()?.toLowerCase() || 'file',
          },
        ],
      }));
      setNewAttachment({ name: '', url: '' });
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700">
            Maximum Marks
          </label>
          <input
            type="number"
            id="maxMarks"
            name="maxMarks"
            min="1"
            value={formData.maxMarks}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="submissionType" className="block text-sm font-medium text-gray-700">
            Submission Type
          </label>
          <select
            id="submissionType"
            name="submissionType"
            value={formData.submissionType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="online">Online Submission</option>
            <option value="offline">Offline Submission</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
        <div className="space-y-2">
          {(formData.attachments || []).map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="File name"
              value={newAttachment.name}
              onChange={(e) => setNewAttachment(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <input
              type="url"
              placeholder="File URL"
              value={newAttachment.url}
              onChange={(e) => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddAttachment}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {initialData?.title ? 'Update Assignment' : 'Create Assignment'}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
