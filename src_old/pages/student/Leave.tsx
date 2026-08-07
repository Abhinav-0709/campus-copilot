import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Plus, 
  FileText, 
  X, 
  Upload,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  documents?: string[];
  rejectionReason?: string;
}

const LEAVE_TYPES = [
  'Sick Leave',
  'Vacation Leave',
  'Personal Leave',
  'Academic Leave',
  'Other'
];

// Helper function to get status color classes
const getStatusColor = (status: LeaveStatus): string => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get status icon
const getStatusIcon = (status: LeaveStatus) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'pending':
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};

const StudentLeave: React.FC = () => {
  useAuth();
  
  // State for leave requests and modal
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
    documents: [] as File[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load sample data on component mount
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data
        const sampleData: LeaveRequest[] = [
          {
            id: '1',
            type: 'Sick Leave',
            startDate: '2025-06-01',
            endDate: '2025-06-03',
            reason: 'High fever and doctor advised rest',
            status: 'approved',
            submittedAt: new Date('2025-05-30').toISOString(),
            documents: ['medical_certificate.pdf']
          },
          {
            id: '2',
            type: 'Personal Leave',
            startDate: '2025-06-15',
            endDate: '2025-06-16',
            reason: 'Family function',
            status: 'pending',
            submittedAt: new Date().toISOString()
          }
        ];
        
        setLeaveRequests(sampleData);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }));
    }
  };

  // Remove a file from the upload list
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) newErrors.type = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      documents: formData.documents.map(file => file.name)
    };
    
    setLeaveRequests(prev => [newRequest, ...prev]);
    setIsModalOpen(false);
    
    // Reset form
    setFormData({
      type: 'Sick Leave',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
      documents: []
    });
  };

  // Toggle request details
  const toggleExpandRequest = (id: string) => {
    setExpandedRequest(prev => prev === id ? null : id);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days between two dates
  const getDaysDifference = (startDate: string, endDate: string) => {
    return differenceInDays(new Date(endDate), new Date(startDate)) + 1; // +1 to include both dates
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600">Submit and track your leave requests</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {['pending', 'approved', 'rejected'].map((status) => (
          <div key={status} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className={`rounded-md p-3 ${
                status === 'approved' ? 'bg-green-100 text-green-600' :
                status === 'rejected' ? 'bg-red-100 text-red-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {status === 'approved' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : status === 'rejected' ? (
                  <XCircle className="h-6 w-6" />
                ) : (
                  <Clock className="h-6 w-6" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 capitalize">{status}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaveRequests.filter(r => r.status === status).length}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests List */}
      <div className="rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">My Leave Requests</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <div
                key={request.id}
                className="p-6 transition-colors hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpandRequest(request.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.type}
                      </h3>
                      <span
                        className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1.5 h-4 w-4" />
                        Submitted: {formatDate(request.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(request.status)}
                    {expandedRequest === request.id ? (
                      <ChevronUp className="ml-2 h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRequest === request.id && (
                  <div className="mt-4 rounded-md bg-gray-50 p-4">
                    <h4 className="text-sm font-medium text-gray-900">Reason:</h4>
                    <p className="mt-1 text-sm text-gray-600">{request.reason}</p>
                    
                    {request.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Rejection Reason</h3>
                            <p className="mt-1 text-sm text-red-700">{request.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {request.documents && request.documents.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900">Attached Documents:</h4>
                        <div className="mt-2 space-y-2">
                          {request.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center rounded-md bg-white px-3 py-2 text-sm text-gray-700"
                            >
                              <FileText className="mr-2 h-4 w-4 text-gray-400" />
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No leave requests
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first leave request to get started
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Leave Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">New Leave Request</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.type ? 'border-red-500' : ''
                      }`}
                    >
                      {LEAVE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.startDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate}
                        className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.endDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.endDate ? (
                        <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">
                          {getDaysDifference(formData.startDate, formData.endDate)} 
                          day{getDaysDifference(formData.startDate, formData.endDate) !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Please provide a reason for your leave request..."
                      className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.reason ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.reason && (
                      <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supporting Documents (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              multiple
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>
                    
                    {formData.documents.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {formData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700 truncate max-w-xs">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeave;