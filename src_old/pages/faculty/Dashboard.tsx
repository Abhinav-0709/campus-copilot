import React from 'react';
import { 
  Users, 
  ClipboardList, 
  Bell, 
  Calendar,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const today = new Date();

  // Mock data
  const stats = [
    { name: 'Students', value: '124', icon: <Users className="h-6 w-6" />, color: 'bg-primary-500' },
    { name: 'Assignments', value: '5', icon: <ClipboardList className="h-6 w-6" />, color: 'bg-secondary-500' },
    { name: 'Notices', value: '4', icon: <Bell className="h-6 w-6" />, color: 'bg-accent-500' },
    { name: 'Leave Requests', value: '6', icon: <Calendar className="h-6 w-6" />, color: 'bg-success-500' },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Analytical Mathematics,section A', time: '9:00 AM - 9:50 AM', room: 'Room 101', students: 45 },
    { id: 2, subject: 'Analytical Mathematics,section B ', time: '9:50 AM - 10:40 AM', room: 'Room 203', students: 38 },
    { id: 3, subject: 'Analytical Mathematics,section D', time: '11:00 AM - 11:50 AM', room: 'room203', students: 41 },
    { id: 1, subject: 'Analytical Mathematics,section C', time: '12:00 PM - 12:50 PM', room: 'Room 101', students: 48 },
  ];

  const pendingAssignments = [
    { id: 1, title: 'Exact differential equation', dueDate: '2025-03-24', submissions: 28, totalStudents: 45 },
    { id: 2, title: 'Comlex integration, couchy integral formula cauchy integral theorem', dueDate: '2025-03-30', submissions: 19, totalStudents: 38 },
  ];

  const recentLeaveRequests = [
    { id: 1, student: 'Abhinav Gupta', reason: 'Medical', from: '2025-05-15', to: '2025-05-17', status: 'approved' },
    { id: 2, student: 'Ashutosh ', reason: 'Family Event', from: '2025-05-18', to: '2025-05-19', status: 'approved' },
    { id: 3, student: 'karan', reason: 'Personal', from: '2025-05-22', to: '2025-05-22', status: 'rejected' },
    { id: 4, student: 'Abhay ', reason: 'Medical', from: '2025-06-09', to: '2025-06-19', status: 'approved' },
    { id: 5, student: 'Himanshu ', reason: 'Family Event', from: '2025-06-18', to: '2025-05-20', status: 'pending' },
    { id: 6, student: 'Archita ', reason: 'personal', from: '2025-06-15', to: '2025-06-19', status: 'approved' },
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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">{format(today, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`rounded-md ${stat.color} p-3 text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Today's Classes</h2>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </a>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{cls.subject}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">{cls.time}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{cls.room}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{cls.students} students</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Pending Assignments</h2>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </a>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{assignment.title}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      Due: {format(new Date(assignment.dueDate), 'MMMM d, yyyy')}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {assignment.submissions}/{assignment.totalStudents}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">submissions</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-primary-600 h-1.5 rounded-full" 
                    style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="lg:col-span-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Leave Requests</h2>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    From
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentLeaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.student}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{request.reason}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{format(new Date(request.from), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{format(new Date(request.to), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span className="ml-1.5 text-sm text-gray-500 capitalize">{request.status}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;