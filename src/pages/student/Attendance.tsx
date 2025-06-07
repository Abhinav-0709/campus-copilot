import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, PieChart } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

// Mock attendance data
const ATTENDANCE_DATA = {
  overall: 86.5, // percentage
  subjects: [
    {
      id: 1,
      name: 'Engg.Chemistry',
      code: 'AHT-002',
      present: 20,
      total: 20,
      percentage: 100,
    },
    {
      id: 2,
      name: 'Maths-II',
      code: 'AHT-005',
      present: 20,
      total: 20,
      percentage: 100,
    },
    {
      id: 3,
      name: 'Basic Mechanical Engg.',
      code: 'MET-001',
      present: 18,
      total: 20,
      percentage: 96,
    },
    {
      id: 4,
      name: 'Basic Electronics Engg.',
      code: 'ECT-001',
      present: 14,
      total: 20,
      percentage: 80,
    },
  ],
  recent: [
    {
      date: '2025-05-08',
      day: 'Monday',
      status: {
        'AHT-002': true,
        'AHT-005': true,
        'MET-001': true,
        'ECT-001': false
      }
    },
    {
      date: '2025-05-07',
      day: 'Friday',
      status: {
        'AHT-002': true,
        'AHT-005': true,
        'MET-001': true,
        'ECT-001': true
      }
    },
    {
      date: '2025-05-06',
      day: 'Thursday',
      status: {
        'AHT-002': true,
        'AHT-005': false,
        'MET-001': true,
        'ECT-001': true
      }
    },
  ]
};


const AttendanceCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days before the 1st of the month
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Function to determine attendance status for a day
  const getAttendanceStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const attendanceRecord = ATTENDANCE_DATA.recent.find(record => record.date === dateStr);
    
    if (!attendanceRecord) return 'unknown';
    
    const allPresent = Object.values(attendanceRecord.status).every(status => status);
    const allAbsent = Object.values(attendanceRecord.status).every(status => !status);
    
    if (allPresent) return 'present';
    if (allAbsent) return 'absent';
    return 'partial';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-neutral-900">Attendance Calendar</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-neutral-500 py-2">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10 bg-neutral-50 rounded-md"></div>;
          }
          
          const status = getAttendanceStatus(day);
          let statusClass = '';
          
          switch (status) {
            case 'present':
              statusClass = 'bg-success-100 text-success-800 border border-success-300';
              break;
            case 'absent':
              statusClass = 'bg-error-100 text-error-800 border border-error-300';
              break;
            case 'partial':
              statusClass = 'bg-warning-100 text-warning-800 border border-warning-300';
              break;
            default:
              statusClass = 'bg-neutral-50 text-neutral-800';
          }
          
          const isToday = new Date().getDate() === day && 
                         new Date().getMonth() === month && 
                         new Date().getFullYear() === year;
          
          if (isToday) {
            statusClass += ' font-bold ring-2 ring-primary-500';
          }
          
          return (
            <div 
              key={`day-${day}`} 
              className={`h-10 flex items-center justify-center rounded-md text-sm ${statusClass}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center space-x-4 mt-4 justify-center text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-success-100 border border-success-300 rounded-sm mr-1"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-warning-100 border border-warning-300 rounded-sm mr-1"></div>
          <span>Partial</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-error-100 border border-error-300 rounded-sm mr-1"></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
};

const StudentAttendance: React.FC = () => {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">My Attendance</h1>
        <span className="text-sm text-neutral-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Overall Attendance" 
          value={`${ATTENDANCE_DATA.overall}%`}
          icon={<PieChart size={24} />}
          bgColor="bg-primary-100"
          iconColor="text-primary-700"
        />
        <StatCard 
          title="Required Attendance" 
          value="75%"
          icon={<AlertCircle size={24} />}
          bgColor="bg-warning-100"
          iconColor="text-warning-700"
        />
        <StatCard 
          title="Total Days Present" 
          value="76"
          icon={<Check size={24} />}
          bgColor="bg-success-100"
          iconColor="text-success-700"
        />
        <StatCard 
          title="Total Days Absent" 
          value="6"
          icon={<X size={24} />}
          bgColor="bg-error-100"
          iconColor="text-error-700"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="text-lg font-medium text-neutral-900">Subject-wise Attendance</h2>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Present/Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {ATTENDANCE_DATA.subjects.map(subject => (
                    <tr key={subject.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">{subject.name}</div>
                        <div className="text-xs text-neutral-500">{subject.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        {subject.present}/{subject.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <div className="w-full bg-neutral-200 rounded-full h-2.5 max-w-[150px]">
                            <div 
                              className={`h-2.5 rounded-full ${
                                subject.percentage >= 90 ? 'bg-success-500' :
                                subject.percentage >= 75 ? 'bg-warning-500' :
                                'bg-error-500'
                              }`}
                              style={{ width: `${subject.percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm">{subject.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subject.percentage >= 90 
                            ? 'bg-success-100 text-success-800' 
                            : subject.percentage >= 75
                            ? 'bg-warning-100 text-warning-800' 
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {subject.percentage >= 90 
                            ? 'Excellent' 
                            : subject.percentage >= 75
                            ? 'Good' 
                            : 'Warning'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <AttendanceCalendar />
          
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mt-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Recent Attendance</h2>
            <div className="space-y-3">
              {ATTENDANCE_DATA.recent.map((record, index) => (
                <div key={index} className="p-3 border rounded-lg border-neutral-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-neutral-500">{record.day}</p>
                    </div>
                    <div className="flex space-x-2">
                      {Object.entries(record.status).map(([code, status], i) => (
                        <div key={i} className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                          status 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {code.split('-')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;