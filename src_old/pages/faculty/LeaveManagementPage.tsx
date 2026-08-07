import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Filter } from 'lucide-react';

// Sample leave requests data
const LEAVE_REQUESTS = [
  {
    id: 1,
    student: {
      name: 'Michael Johnson',
      id: 'CS2021001',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    type: 'Medical Leave',
    startDate: '2025-05-12',
    endDate: '2025-05-13',
    reason: 'Doctor appointment and follow-up',
    status: 'pending',
    submittedOn: '2025-05-10'
  },
  {
    id: 2,
    student: {
      name: 'Emily Williams',
      id: 'CS2021002',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    type: 'Personal Leave',
    startDate: '2025-05-15',
    endDate: '2025-05-15',
    reason: 'Family function',
    status: 'pending',
    submittedOn: '2025-05-11'
  },
  {
    id: 3,
    student: {
      name: 'Sarah Miller',
      id: 'CS2021003',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    type: 'Academic Leave',
    startDate: '2025-05-16',
    endDate: '2025-05-18',
    reason: 'Participating in coding competition',
    status: 'approved',
    submittedOn: '2025-05-09',
    actionDate: '2025-05-10'
  }
];

const LeaveManagementPage: React.FC = () => {
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState<typeof LEAVE_REQUESTS[0] | null>(null);

  const filteredRequests = LEAVE_REQUESTS.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const handleAction = (requestId: number, action: 'approve' | 'reject') => {
    // In a real application, this would make an API call
    console.log(`${action} request ${requestId}`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Leave Management</h1>
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
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === 'pending'
              ? 'bg-warning-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === 'approved'
              ? 'bg-success-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === 'rejected'
              ? 'bg-error-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Rejected
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={request.student.image}
                  alt={request.student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-neutral-900">{request.student.name}</h3>
                  <p className="text-sm text-neutral-500">ID: {request.student.id}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-neutral-600">
                      <span className="font-medium">Type:</span> {request.type}
                    </p>
                    <p className="text-sm text-neutral-600">
                      <span className="font-medium">Duration:</span>{' '}
                      {new Date(request.startDate).toLocaleDateString()} -{' '}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  request.status === 'approved'
                    ? 'bg-success-100 text-success-800'
                    : request.status === 'rejected'
                    ? 'bg-error-100 text-error-800'
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {request.status}
                </span>
                <p className="text-xs text-neutral-500 mt-1">
                  Submitted: {new Date(request.submittedOn).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-neutral-900">Reason:</h4>
              <p className="mt-1 text-sm text-neutral-600">{request.reason}</p>
            </div>

            {request.status === 'pending' && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleAction(request.id, 'approve')}
                  className="btn-success text-sm"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(request.id, 'reject')}
                  className="btn-error text-sm"
                >
                  <XCircle size={16} className="mr-1" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveManagementPage;