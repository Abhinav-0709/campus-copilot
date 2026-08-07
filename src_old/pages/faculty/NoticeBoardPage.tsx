import React, { useState } from 'react';
import { Bell, Plus, Edit2, Trash2, Calendar, User } from 'lucide-react';

// Sample notices data
const INITIAL_NOTICES = [
  {
    id: 1,
    title: 'Midterm Examination Schedule',
    content: 'The midterm examinations for all courses will be conducted from May 20th to May 25th, 2025. The detailed schedule will be posted on the department notice board.',
    category: 'Academic',
    date: '2025-05-10',
    author: 'Dr. John Smith',
    department: 'Computer Science'
  },
  {
    id: 2,
    title: 'Workshop on Artificial Intelligence',
    content: 'A workshop on "Introduction to Artificial Intelligence and Machine Learning" will be conducted on May 15th, 2025. All interested students are encouraged to attend.',
    category: 'Event',
    date: '2025-05-08',
    author: 'Prof. Sarah Johnson',
    department: 'Computer Science'
  },
  {
    id: 3,
    title: 'Project Submission Deadline',
    content: 'The final project submission deadline for the Database Management Systems course has been extended to May 30th, 2025.',
    category: 'Academic',
    date: '2025-05-07',
    author: 'Dr. Michael Brown',
    department: 'Computer Science'
  }
];

const NoticeBoardPage: React.FC = () => {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [showForm, setShowForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<typeof INITIAL_NOTICES[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Academic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNotice) {
      // Update existing notice
      setNotices(notices.map(notice =>
        notice.id === selectedNotice.id
          ? {
              ...notice,
              ...formData,
              date: new Date().toISOString().split('T')[0]
            }
          : notice
      ));
    } else {
      // Add new notice
      const newNotice = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        author: 'Dr. John Smith',
        department: 'Computer Science'
      };
      setNotices([newNotice, ...notices]);
    }
    setShowForm(false);
    setSelectedNotice(null);
    setFormData({ title: '', content: '', category: 'Academic' });
  };

  const handleEdit = (notice: typeof INITIAL_NOTICES[0]) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Notice Board</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus size={20} className="mr-2" />
          New Notice
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedNotice ? 'Edit Notice' : 'Create New Notice'}
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
                <label className="block text-sm font-medium text-neutral-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 input"
                >
                  <option>Academic</option>
                  <option>Event</option>
                  <option>Administrative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="mt-1 input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedNotice(null);
                    setFormData({ title: '', content: '', category: 'Academic' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedNotice ? 'Update' : 'Post'} Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Bell size={20} className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-neutral-900">{notice.title}</h2>
                </div>
                <div className="mt-2 flex items-center text-sm text-neutral-500 space-x-4">
                  <span className="flex items-center">
                    <User size={16} className="mr-1" />
                    {notice.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(notice.date).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    notice.category === 'Academic'
                      ? 'bg-primary-100 text-primary-800'
                      : notice.category === 'Event'
                      ? 'bg-accent-100 text-accent-800'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {notice.category}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(notice)}
                  className="p-2 text-neutral-600 hover:text-primary-600 rounded-full hover:bg-neutral-100"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 text-neutral-600 hover:text-error-600 rounded-full hover:bg-neutral-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-neutral-600 whitespace-pre-wrap">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoardPage;