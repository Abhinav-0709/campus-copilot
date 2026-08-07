import React from 'react';
import { Calendar, BookOpen, Clock, FileText, Bell, Clipboard } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../contexts/AuthContext';

// Sample data
const upcomingAssignments = [
  {
    id: 1,
    title: 'Database Normalization',
    subject: 'Database Systems',
    dueDate: '2025-05-15',
    status: 'Not Started'
  },
  {
    id: 2,
    title: 'Binary Search Trees',
    subject: 'Data Structures',
    dueDate: '2025-05-20',
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'REST API Design',
    subject: 'Web Development',
    dueDate: '2025-05-25',
    status: 'Not Started'
  }
];

const todayClasses = [
  {
    id: 1,
    subject: 'Database Systems',
    time: '10:00 AM - 11:30 AM',
    room: 'CS-101',
    professor: 'Dr. John Smith'
  },
  {
    id: 2,
    subject: 'Data Structures',
    time: '01:00 PM - 02:30 PM',
    room: 'CS-203',
    professor: 'Dr. Alan Turing'
  },
  {
    id: 3,
    subject: 'Web Development',
    time: '03:00 PM - 04:30 PM',
    room: 'CS-105',
    professor: 'Prof. Ada Lovelace'
  }
];

const announcements = [
  {
    id: 1,
    title: 'Midterm Exam Schedule',
    department: 'Computer Science',
    date: '2025-05-05',
    content: 'The midterm exams will be held from May 20 to May 25. Please check the detailed schedule on the notice board.'
  },
  {
    id: 2,
    title: 'Career Fair 2025',
    department: 'Student Affairs',
    date: '2025-05-06',
    content: 'Annual career fair will be held on May 15 in the main hall. All students are encouraged to attend.'
  },
  {
    id: 3,
    title: 'Library Hours Extended',
    department: 'Library',
    date: '2025-05-07',
    content: 'Library hours have been extended from 8 AM to 10 PM during the exam period.'
  }
];

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Student Dashboard</h1>
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
          title="Attendance Rate" 
          value="92%" 
          icon={<Calendar size={24} />}
          change={{ value: "2%", positive: true }}
          bgColor="bg-primary-100"
          iconColor="text-primary-700"
        />
        <StatCard 
          title="Pending Assignments" 
          value="5" 
          icon={<BookOpen size={24} />}
          change={{ value: "1", positive: false }}
          bgColor="bg-warning-100"
          iconColor="text-warning-700"
        />
        <StatCard 
          title="Upcoming Tests" 
          value="2" 
          icon={<FileText size={24} />}
          bgColor="bg-error-100"
          iconColor="text-error-700"
        />
        <StatCard 
          title="Leave Balance" 
          value="8 days" 
          icon={<Clipboard size={24} />}
          bgColor="bg-success-100"
          iconColor="text-success-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
            <Clock size={20} className="mr-2 text-primary-600" />
            Today's Classes
          </h2>
          <div className="space-y-4">
            {todayClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border rounded-lg border-neutral-200 hover:border-primary-300 transition-colors">
                <h3 className="font-medium text-neutral-900">{classItem.subject}</h3>
                <div className="text-sm text-neutral-500 mt-1 space-y-1">
                  <p>
                    <span className="inline-block w-20">Time:</span> 
                    <span className="font-medium">{classItem.time}</span>
                  </p>
                  <p>
                    <span className="inline-block w-20">Room:</span> 
                    <span className="font-medium">{classItem.room}</span>
                  </p>
                  <p>
                    <span className="inline-block w-20">Professor:</span> 
                    <span className="font-medium">{classItem.professor}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-800 flex items-center">
              <BookOpen size={20} className="mr-2 text-primary-600" />
              Upcoming Assignments
            </h2>
            <a href="/student/assignments" className="text-sm text-primary-600 hover:text-primary-800">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border rounded-lg border-neutral-200 hover:border-primary-300 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">{assignment.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assignment.status === 'Completed' 
                        ? 'bg-success-100 text-success-800' 
                        : assignment.status === 'In Progress' 
                        ? 'bg-warning-100 text-warning-800' 
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {assignment.status}
                    </span>
                    <p className="text-xs text-neutral-500 mt-1">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-neutral-800 flex items-center">
            <Bell size={20} className="mr-2 text-primary-600" />
            Recent Announcements
          </h2>
        </div>
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-neutral-900">{announcement.title}</h3>
                  <p className="text-sm text-primary-600 mt-1">{announcement.department}</p>
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(announcement.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-neutral-600 text-sm">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;