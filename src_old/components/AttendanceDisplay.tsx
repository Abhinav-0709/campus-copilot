import React from 'react';
import { useStudent } from '../contexts/StudentContext';

const AttendanceDisplay: React.FC = () => {
  const { studentData } = useStudent();
  const { attendance } = studentData;

  if (!attendance) {
    return <div>Loading attendance data...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Your Attendance</h2>
      <div className="mb-4">
        <p className="text-lg">
          <span className="font-medium">Overall:</span> {attendance.overall_percentage}%
        </p>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">By Subject:</h3>
        <ul className="space-y-2">
          {attendance.by_subject.map((subject, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{subject.name}:</span>
              <span>
                {subject.percentage}% ({subject.attended}/{subject.total} classes)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceDisplay;
