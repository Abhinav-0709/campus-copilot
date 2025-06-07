import React from 'react';
import { 
  Users, 
  ClipboardList, 
  BookOpen, 
  Bell,
  ChevronRight,
  Clock,
  Check,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const today = new Date();

  // Mock data
  const stats = [
    { name: 'Attendance', value: '86.5%', icon: <Users className="h-6 w-6" />, color: 'bg-primary-500' },
    { name: 'Assignments', value: '5', icon: <ClipboardList className="h-6 w-6" />, color: 'bg-secondary-500' },
    { name: 'Courses', value: '4', icon: <BookOpen className="h-6 w-6" />, color: 'bg-accent-500' },
    { name: 'Notifications', value: '2', icon: <Bell className="h-6 w-6" />, color: 'bg-success-500' },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Engg.Chemistry', time: '09:05 AM - 09:55 AM', room: 'C-101', professor: 'Dr.Bhavana Sethi' },
    { id: 2, subject: 'Basic Mechanical Engg.', time: '9:55 AM - 10:45 AM', room: 'C-101', professor: 'Dr.Amit Tanwar' },
    { id: 3, subject: 'Maths-II', time: '11:05 AM - 11:55 AM', room: 'C-101', professor: 'Dr. Vidit Vats' },
  ];

  const pendingAssignments = [
    { 
      id: 1, 
      title: 'Unit-1', 
      subject: 'Basic Mechanical Engg.',
      dueDate: '2025-03-20', 
      status: 'submitted',
      completion: 100
    },
    { 
      id: 2, 
      title: 'Unit-5', 
      subject: 'Maths-II',
      dueDate: '2025-05-12', 
      status: 'pending',
      completion: 80
    },
    { 
      id: 3, 
      title: 'Unit-4', 
      subject: 'Basic Mech.Engg.',
      dueDate: '2025-04-22', 
      status: 'submitted',
      completion: 100
    },
  ];

  const recentAnnouncements = [
    { 
      id: 1, 
      title: 'Final Exam Schedule Released', 
      date: '2025-05-21', 
      category: 'Academic', 
      content: 'The final examination schedule for this semester has been released. Please check your student portal for details.'
    },
    { 
      id: 2, 
      title: 'Anugooj', 
      date: '2025-04-25', 
      category: 'Event', 
      content: 'Don\'t miss the college annual fest on April 25th.'
    },
  ];


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
            <a href="#" className="text-sm font-medium text-accent-600 hover:text-accent-500">
              View schedule
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
                    <div className="mt-1 text-sm text-gray-500">
                      {cls.professor}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Assignments</h2>
            <a href="#" className="text-sm font-medium text-accent-600 hover:text-accent-500">
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
                      {assignment.subject}
                    </div>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">
                        Due: {format(new Date(assignment.dueDate), 'MMMM d, yyyy')}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="flex items-center text-sm">
                        {assignment.status === 'pending' ? (
                          <>
                            <Clock className="mr-1 h-4 w-4 text-warning-500" />
                            <span className="text-warning-500">Pending</span>
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 h-4 w-4 text-success-500" />
                            <span className="text-success-500">Completed</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`${assignment.completion === 100 ? 'bg-success-500' : 'bg-accent-600'} h-1.5 rounded-full`}
                    style={{ width: `${assignment.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="lg:col-span-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Announcements</h2>
            <a href="#" className="text-sm font-medium text-accent-600 hover:text-accent-500">
              View all
            </a>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-gray-900">{announcement.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800">
                        {announcement.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Posted on {format(new Date(announcement.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {announcement.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;