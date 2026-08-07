import React, { useState } from 'react';
import { 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Filter,
  Download,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

interface LeaveRequest {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  submittedAt: string;
}

const FacultyLeaveManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Mock data
  const leaveRequests: LeaveRequest[] = [
    {
      id: 'LR001',
      studentName: 'Abhinav Gupta',
      studentId: 'ST2023001',
      type: 'Medical',
      startDate: '2025-05-15',
      endDate: '2025-05-17',
      reason: 'Doctor-recommended bed rest due to high fever and flu symptoms.',
      status: 'approved',
      documents: ['medical_certificate.pdf'],
      submittedAt: '2025-05-14T09:30:00'
    },
    {
      id: 'LR002',
      studentName: 'Ashutosh',
      studentId: 'ST2023015',
      type: 'Personal',
      startDate: '2025-05-18',
      endDate: '2025-05-19',
      reason: 'Family wedding ceremony.',
      status: 'approved',
      submittedAt: '2025-05-13T14:20:00'
    },
    {
      id: 'LR003',
      studentName: 'Karan',
      studentId: 'ST2023008',
      type: 'Academic',
      startDate: '2025-05-22',
      endDate: '2025-05-22',
      reason: 'Participating in inter-college debate competition.',
      status: 'rejected',
      documents: ['invitation_letter.pdf', 'schedule.pdf'],
      submittedAt: '2025-05-12T11:45:00'
    },
    {
      id: 'LR004',
      studentName: 'Abhay',
      studentId: 'ST2023001',
      type: 'Medical',
      startDate: '2025-06-09',
      endDate: '2025-06-19',
      reason: 'Doctor-recommended bed rest due to high fever and flu symptoms.',
      status: 'approved',
      documents: ['medical_certificate.pdf'],
      submittedAt: '2025-05-14T09:30:00'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-50 text-success-700';
      case 'pending':
        return 'bg-warning-50 text-warning-700';
      case 'rejected':
        return 'bg-error-50 text-error-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = 
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (requestId: string, newStatus: 'approved' | 'rejected') => {
    // In a real application, this would make an API call to update the status
    console.log(`Updating request ${requestId} to ${newStatus}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600">Review and manage student leave requests</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Filters and Search */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search by name, ID, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 font-medium text-gray-900">Filter by Status</h2>
              <div className="space-y-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium capitalize ${
                      filterStatus === status
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'all' ? 'All Requests' : status}
                    {status !== 'all' && (
                      <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
                        {leaveRequests.filter(r => r.status === status).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 font-medium text-gray-900">Quick Actions</h2>
              <div className="space-y-2">
                <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Download className="mr-2 h-4 w-4" />
                  Export Leave Records
                </button>
                <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Requests List */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Leave Requests ({filteredRequests.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 transition-colors hover:bg-gray-50"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`rounded-full p-2 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {request.studentName}
                          <span className="ml-2 text-xs text-gray-500">
                            ({request.studentId})
                          </span>
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          {format(new Date(request.startDate), 'MMM d, yyyy')}
                          {request.startDate !== request.endDate && (
                            <>
                              <span className="mx-1">-</span>
                              {format(new Date(request.endDate), 'MMM d, yyyy')}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(request.id, 'approved')}
                            className="rounded-md bg-success-50 px-3 py-1 text-sm font-medium text-success-700 hover:bg-success-100"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            className="rounded-md bg-error-50 px-3 py-1 text-sm font-medium text-error-700 hover:bg-error-100"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {selectedRequest?.id === request.id && (
                    <div className="mt-4 rounded-md bg-gray-50 p-4">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Reason</h4>
                        <p className="mt-1 text-sm text-gray-600">{request.reason}</p>
                      </div>
                      {request.documents && request.documents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Supporting Documents
                          </h4>
                          <div className="mt-1 space-y-1">
                            {request.documents.map((doc) => (
                              <a
                                key={doc}
                                href="#"
                                className="block text-sm text-primary-600 hover:text-primary-500"
                              >
                                {doc}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-3 text-xs text-gray-500">
                        Submitted on {format(new Date(request.submittedAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No leave requests match your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLeaveManagement;