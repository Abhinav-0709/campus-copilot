import React from 'react';
import { BookOpen, Award, TrendingUp, FileText, Download } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

// Sample academic data
const ACADEMIC_DATA = {
  currentSemester: '2024-25 Spring',
  gpa: 3.85,
  totalCredits: 85,
  standing: 'Standing',
  courses: [
    {
      code: 'CS301',
      name: 'Database Systems',
      credits: 4,
      grade: 'A',
      professor: 'Dr. John Smith'
    },
    {
      code: 'CS302',
      name: 'Data Structures',
      credits: 4,
      grade: 'A-',
      professor: 'Dr. Sarah Johnson'
    },
    {
      code: 'CS303',
      name: 'Web Development',
      credits: 3,
      grade: 'B+',
      professor: 'Prof. Michael Brown'
    },
    {
      code: 'CS304',
      name: 'Computer Networks',
      credits: 4,
      grade: 'A',
      professor: 'Dr. Emily Davis'
    }
  ],
  previousSemesters: [
    {
      name: '2024-25 Fall',
      gpa: 3.75,
      credits: 16
    },
    {
      name: '2023-24 Spring',
      gpa: 3.80,
      credits: 15
    },
    {
      name: '2023-24 Fall',
      gpa: 3.90,
      credits: 17
    }
  ]
};

const StudentAcademicRecordsPage: React.FC = () => {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Academic Records</h1>
        <button className="btn-primary flex items-center">
          <Download size={18} className="mr-2" />
          Download Transcript
        </button>
      </div>

      

      {/* Academic Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Current GPA" 
          value={ACADEMIC_DATA.gpa.toFixed(2)} 
          icon={<Award size={24} />}
          bgColor="bg-primary-100"
          iconColor="text-primary-700"
        />
        <StatCard 
          title="Total Credits" 
          value={ACADEMIC_DATA.totalCredits} 
          icon={<BookOpen size={24} />}
          bgColor="bg-success-100"
          iconColor="text-success-700"
        />
        <StatCard 
          title="Current Semester" 
          value={ACADEMIC_DATA.currentSemester} 
          icon={<FileText size={24} />}
          bgColor="bg-warning-100"
          iconColor="text-warning-700"
        />
        <StatCard 
          title="Academic Standing" 
          value={ACADEMIC_DATA.standing} 
          icon={<TrendingUp size={24} />}
          bgColor="bg-accent-100"
          iconColor="text-accent-700"
        />
      </div>

      {/* Current Semester Courses */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-medium text-neutral-900">Current Semester Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Professor
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Credits
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {ACADEMIC_DATA.courses.map((course) => (
                <tr key={course.code} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{course.name}</div>
                    <div className="text-sm text-neutral-500">{course.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {course.professor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 text-center">
                    {course.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      course.grade.startsWith('A') 
                        ? 'bg-success-100 text-success-800'
                        : course.grade.startsWith('B')
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Previous Semesters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-medium text-neutral-900">Previous Semesters</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMIC_DATA.previousSemesters.map((semester, index) => (
            <div
              key={index}
              className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <h3 className="font-medium text-neutral-900">{semester.name}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">GPA</span>
                  <span className="font-medium text-neutral-900">{semester.gpa.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Credits</span>
                  <span className="font-medium text-neutral-900">{semester.credits}</span>
                </div>
                <button className="mt-2 w-full text-sm text-primary-600 hover:text-primary-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Academic Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">Degree Progress</span>
              <span className="text-sm text-neutral-500">85/120 Credits</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">Major Requirements</span>
              <span className="text-sm text-neutral-500">45/60 Credits</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
              <div
                className="bg-success-600 h-2.5 rounded-full"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">Electives</span>
              <span className="text-sm text-neutral-500">20/30 Credits</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
              <div
                className="bg-accent-600 h-2.5 rounded-full"
                style={{ width: '66%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicRecordsPage;