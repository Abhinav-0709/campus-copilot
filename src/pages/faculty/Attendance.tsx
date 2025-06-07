import React, { useState } from 'react';
import { 
  Calendar,
  Download,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  ChevronDown,
  Filter
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  attendance: Record<string, 'present' | 'absent' | undefined>;
}

const FacultyAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('CS401');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real app, this would come from your backend
  const classes = [
    { id: 'C-002', name: 'CSE,1st year section D' },
    
  ];

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Abhishek kumar',
      rollNumber: 'CS2023001',
      attendance: { [selectedDate]: 'present' }
    },
    {
      id: '2',
      name: 'Ayush kumar panday',
      rollNumber: 'CS2023002',
      attendance: { [selectedDate]: 'absent' }
    },
    {
      id: '3',
      name: 'Abhinav Gupta',
      rollNumber: 'CS2023003',
      attendance: { [selectedDate]: 'present' }
    },
    {
      id: '4',
      name: 'priya sharma',
      rollNumber: 'CS2023004',
      attendance: { [selectedDate]: 'present' }
    },
    {
      id: '5',
      name: 'Archita Sinha',
      rollNumber: 'CS2023005',
      attendance: { [selectedDate]: 'absent' }
    },
    {
      id: '6',
      name: 'Ravi kumar',
      rollNumber: 'CS2023006',
      attendance: { [selectedDate]: 'present' }
    },
    // Add more students as needed
  ]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [selectedDate]: status
          }
        };
      }
      return student;
    }));
  };

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Name', 'Date', 'Status'];
    const rows = students.map(student => [
      student.rollNumber,
      student.name,
      selectedDate,
      student.attendance[selectedDate] || 'not marked'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedClass}_${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const attendanceStats = {
    total: students.length,
    present: students.filter(s => s.attendance[selectedDate] === 'present').length,
    absent: students.filter(s => s.attendance[selectedDate] === 'absent').length,
    notMarked: students.filter(s => !s.attendance[selectedDate]).length
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600">Mark and manage student attendance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Statistics */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{attendanceStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Present</p>
                <p className="text-2xl font-bold text-success-600">{attendanceStats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Absent</p>
                <p className="text-2xl font-bold text-error-600">{attendanceStats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-error-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Not Marked</p>
                <p className="text-2xl font-bold text-warning-600">{attendanceStats.notMarked}</p>
              </div>
              <Filter className="h-8 w-8 text-warning-500" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.id} - {cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Search</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number"
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.attendance[selectedDate] === 'present'
                          ? 'bg-success-100 text-success-800'
                          : student.attendance[selectedDate] === 'absent'
                          ? 'bg-error-100 text-error-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.attendance[selectedDate]?.charAt(0).toUpperCase() + 
                         (student.attendance[selectedDate]?.slice(1) || 'Not Marked')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                            student.attendance[selectedDate] === 'present'
                              ? 'bg-success-100 text-success-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-success-50'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                            student.attendance[selectedDate] === 'absent'
                              ? 'bg-error-100 text-error-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-error-50'
                          }`}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </button>
                      </div>
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

export default FacultyAttendance;