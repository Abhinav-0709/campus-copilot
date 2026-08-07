import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  ChevronRight
} from 'lucide-react';

const StudentAcademics: React.FC = () => {
  const academicInfo = {
    gpa: '4.0',
    totalCredits: '75',
    major: 'Computer Science',
    minor: 'Data Science',
    academicStanding: 'Good Standing',
    expectedGraduation: 'May 2028'
  };

  const currentSemester = {
    name: 'Ayush Kumar Pandey',
    courses: [
      {
        code: 'AHT-002',
        name: 'Engineering Chemistry',
        credits: 4,
        grade: 'A',
        professor: 'Dr.Bhavana Sethi'
      },
      {
        code: 'AHT-005',
        name: 'Analytical Mathematics',
        credits: 4,
        grade: 'B+',
        professor: 'Dr. Vidit Vats'
      },
      {
        code: 'ECT-001',
        name: 'Basic Eletronics Engineering',
        credits: 4,
        grade: 'A',
        professor: 'Dr. M.J.Nigam'
      },
      {
        code: 'MET-001',
        name: 'Basic Mechanical Engineering',
        credits: 4,
        grade: 'A',
        professor: 'Dr. Amit Tanwar'
      }
    ]
  };

  const academicHistory = [
    {
      semester: '2024',
      gpa: '3.92',
      credits: 16,
      status: 'Completed'
    },
    {
      semester: '2023',
      gpa: '3.78',
      credits: 15,
      status: 'Completed'
    },
    {
      semester: '2022',
      gpa: '3.85',
      credits: 14,
      status: 'Completed'
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'Course Registration',
      date: '2025-04-15',
      description: 'Fall 2025 semester registration opens'
    },
    {
      title: 'Final Exams',
      date: '2025-05-10',
      description: 'Spring 2025 final examination period begins'
    },
    {
      title: 'Grade Submission',
      date: '2025-05-20',
      description: 'Final grades due for Spring 2025'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Academic Records</h1>
        <p className="text-gray-600">View your academic progress and course information</p>
      </div>

      {/* Academic Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-3 text-primary-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current GPA</p>
              <p className="text-2xl font-semibold text-gray-900">{academicInfo.gpa}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-secondary-100 p-3 text-secondary-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Credits</p>
              <p className="text-2xl font-semibold text-gray-900">{academicInfo.totalCredits}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-accent-100 p-3 text-accent-600">
              <Award className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Academic Standing</p>
              <p className="text-2xl font-semibold text-gray-900">{academicInfo.academicStanding}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Semester */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Current Semester</h2>
            <p className="text-sm text-gray-500">{currentSemester.name}</p>
          </div>
          <div className="divide-y divide-gray-200">
            {currentSemester.courses.map((course) => (
              <div key={course.code} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {course.code}: {course.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {course.professor} • {course.credits} credits
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-4 rounded-full px-2.5 py-0.5 text-sm font-medium ${
                      course.grade.startsWith('A') ? 'bg-success-100 text-success-800' :
                      course.grade.startsWith('B') ? 'bg-primary-100 text-primary-800' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {course.grade}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic History */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Academic History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {academicHistory.map((semester) => (
              <div key={semester.semester} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{semester.semester}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {semester.credits} credits • {semester.status}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 rounded-full bg-primary-100 px-2.5 py-0.5 text-sm font-medium text-primary-800">
                      GPA: {semester.gpa}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program Details */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Program Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Major</p>
                <p className="mt-1 text-base text-gray-900">{academicInfo.major}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Minor</p>
                <p className="mt-1 text-base text-gray-900">{academicInfo.minor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expected Graduation</p>
                <p className="mt-1 text-base text-gray-900">{academicInfo.expectedGraduation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Academic Status</p>
                <p className="mt-1 text-base text-success-600">{academicInfo.academicStanding}</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
                View full program requirements
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Important Deadlines */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Important Deadlines</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.title} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">{deadline.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{deadline.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      {new Date(deadline.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
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

export default StudentAcademics;
