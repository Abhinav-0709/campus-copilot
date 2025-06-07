import React, { useState } from 'react';
import { Calendar, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample classes data
const CLASSES = [
  {
    id: 1,
    name: 'Database Systems',
    code: 'CS-301',
    time: '10:00 AM - 11:30 AM',
    room: 'CS-101'
  },
  {
    id: 2,
    name: 'Data Structures',
    code: 'CS-202',
    time: '01:00 PM - 02:30 PM',
    room: 'CS-203'
  },
  {
    id: 3,
    name: 'Web Development',
    code: 'CS-401',
    time: '03:00 PM - 04:30 PM',
    room: 'CS-105'
  }
];

// Sample students data
const STUDENTS = [
  {
    id: 1,
    name: 'Jane Doe',
    rollNumber: 'CS-2021-001',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 2,
    name: 'Alex Johnson',
    rollNumber: 'CS-2021-002',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 3,
    name: 'Emily Williams',
    rollNumber: 'CS-2021-003',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 4,
    name: 'Michael Brown',
    rollNumber: 'CS-2021-004',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 5,
    name: 'Sarah Miller',
    rollNumber: 'CS-2021-005',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 9,
    name: 'Sarah Miller',
    rollNumber: 'CS-2021-005',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const AttendancePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handleClassSelect = (classId: number) => {
    setSelectedClass(classId);
    
    // Initialize attendance for all students as present
    const initialAttendance: Record<number, boolean> = {};
    STUDENTS.forEach(student => {
      initialAttendance[student.id] = true;
    });
    setAttendance(initialAttendance);
  };
  
  const toggleAttendance = (studentId: number) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };
  
  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };
  
  const submitAttendance = () => {
    // In a real application, this would send data to the server
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  
  const getClass = (classId: number) => {
    return CLASSES.find(c => c.id === classId);
  };
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Attendance Management</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrevDay}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
          <button 
            onClick={handleNextDay}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {showSuccessMessage && (
        <div className="bg-success-100 text-success-800 p-4 rounded-md">
          Attendance has been recorded successfully!
        </div>
      )}
      
      {selectedClass ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-4 bg-primary-50 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-neutral-900">
                  {getClass(selectedClass)?.name}
                </h2>
                <p className="text-sm text-neutral-500">
                  {getClass(selectedClass)?.code} • {getClass(selectedClass)?.time} • Room {getClass(selectedClass)?.room}
                </p>
              </div>
              <button 
                onClick={() => setSelectedClass(null)}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Change Class
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {STUDENTS.map(student => (
                    <tr key={student.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={student.image} 
                            alt={student.name}
                          />
                        </div>
                        <div className="text-sm font-medium text-neutral-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <button 
                            onClick={() => toggleAttendance(student.id)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              attendance[student.id] 
                                ? 'bg-success-100 text-success-700 border-2 border-success-500'
                                : 'bg-neutral-100 text-neutral-500 hover:bg-success-50 hover:text-success-600'
                            }`}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => toggleAttendance(student.id)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              !attendance[student.id] 
                                ? 'bg-error-100 text-error-700 border-2 border-error-500' 
                                : 'bg-neutral-100 text-neutral-500 hover:bg-error-50 hover:text-error-600'
                            }`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={submitAttendance}
                className="btn-primary"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLASSES.map(classItem => (
            <div 
              key={classItem.id}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all"
              onClick={() => handleClassSelect(classItem.id)}
            >
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-700 mr-4">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">{classItem.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{classItem.code}</p>
                  <p className="text-sm text-neutral-600 mt-2">{classItem.time}</p>
                  <p className="text-sm text-neutral-600">Room {classItem.room}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;