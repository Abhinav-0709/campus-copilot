import React from 'react';
import { Users, Calendar, BookOpen, Clipboard, BookText, Clock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../contexts/AuthContext';

// Sample data
const recentAssignments = [
  {
    id: 1,
    title: 'Database Normalization',
    subject: 'Database Systems',
    dueDate: '2025-05-15',
    submissions: 18,
    totalStudents: 25
  },
  {
    id: 2,
    title: 'Binary Search Trees',
    subject: 'Data Structures',
    dueDate: '2025-05-20',
    submissions: 12,
    totalStudents: 28
  },
  {
    id: 3,
    title: 'REST API Design',
    subject: 'Web Development',
    dueDate: '2025-05-25',
    submissions: 5,
    totalStudents: 23
  }
];

const upcomingClasses = [
  {
    id: 1,
    subject: 'Database Systems',
    time: '10:00 AM - 11:30 AM',
    room: 'CS-101',
    students: 25
  },
  {
    id: 2,
    subject: 'Data Structures',
    time: '01:00 PM - 02:30 PM',
    room: 'CS-203',
    students: 28
  },
  {
    id: 3,
    subject: 'Web Development',
    time: '03:00 PM - 04:30 PM',
    room: 'CS-105',
    students: 23
  }
];

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Faculty Dashboard</h1>
        <span className="text-sm text-neutral-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div>
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Welcome back, {user?.name}</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value="76" 
          icon={<Users size={24} />}
          change={{ value: "5%", positive: true }}
          bgColor="bg-primary-100"
          iconColor="text-primary-700"
        />
        <StatCard 
          title="Average Attendance" 
          value="87%" 
          icon={<Calendar size={24} />}
          change={{ value: "2%", positive: true }}
          bgColor="bg-success-100"
          iconColor="text-success-700"
        />
        <StatCard 
          title="Pending Assignments" 
          value="12" 
          icon={<BookOpen size={24} />}
          bgColor="bg-warning-100"
          iconColor="text-warning-700"
        />
        <StatCard 
          title="Leave Requests" 
          value="5" 
          icon={<Clipboard size={24} />}
          change={{ value: "1", positive: false }}
          bgColor="bg-error-100"
          iconColor="text-error-700"
        />
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-neutral-800">Recent Assignments</h2>
          <a href="/faculty/assignments" className="text-sm text-primary-600 hover:text-primary-800">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{assignment.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{assignment.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">
                      {assignment.submissions}/{assignment.totalStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assignment.submissions === assignment.totalStudents
                        ? 'bg-success-100 text-success-800'
                        : assignment.submissions > assignment.totalStudents / 2
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {assignment.submissions === assignment.totalStudents
                        ? 'Completed'
                        : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
            <Clock size={20} className="mr-2 text-primary-600" />
            Upcoming Classes Today
          </h2>
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-start p-4 border rounded-lg border-neutral-200 hover:border-primary-300 transition-colors">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-700 mr-4">
                  <BookText size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{classItem.subject}</h3>
                  <div className="text-sm text-neutral-500 mt-1 space-y-1">
                    <p className="flex items-center">
                      <span className="w-20">Time:</span> 
                      <span className="font-medium">{classItem.time}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-20">Room:</span> 
                      <span className="font-medium">{classItem.room}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-20">Students:</span> 
                      <span className="font-medium">{classItem.students}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-800 flex items-center">
              <Clipboard size={20} className="mr-2 text-primary-600" />
              Pending Leave Requests
            </h2>
            <a href="/faculty/leave-management" className="text-sm text-primary-600 hover:text-primary-800">
              View all
            </a>
          </div>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-neutral-200">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">Michael Johnson</h3>
                  <p className="text-sm text-neutral-600 mt-1">Medical Leave</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-neutral-500">2 days</span>
                  <p className="text-xs text-neutral-500 mt-1">May 12 - May 13</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="btn-success text-xs px-3 py-1">Approve</button>
                <button className="btn-error text-xs px-3 py-1">Reject</button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg border-neutral-200">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">Emily Williams</h3>
                  <p className="text-sm text-neutral-600 mt-1">Personal Leave</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-neutral-500">1 day</span>
                  <p className="text-xs text-neutral-500 mt-1">May 15</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="btn-success text-xs px-3 py-1">Approve</button>
                <button className="btn-error text-xs px-3 py-1">Reject</button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg border-neutral-200">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">Ryan Garcia</h3>
                  <p className="text-sm text-neutral-600 mt-1">Family Emergency</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-neutral-500">3 days</span>
                  <p className="text-xs text-neutral-500 mt-1">May 16 - May 18</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="btn-success text-xs px-3 py-1">Approve</button>
                <button className="btn-error text-xs px-3 py-1">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;