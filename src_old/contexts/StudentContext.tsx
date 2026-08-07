import React, { createContext, useContext, ReactNode } from 'react';
import { StudentData } from '../types/college';

interface StudentContextType {
  studentData: StudentData;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // This could be replaced with an API call to fetch real student data
  const studentData = {
    attendance: {
      overall_percentage: 85.5,
      by_subject: [
        {
          name: "Engineering Chemistry",
          percentage: 85.0,
          attended: 34,
          total: 40
        },
        {
          name: "Mathematics",
          percentage: 86.0,
          attended: 43,
          total: 50
        },
        {
          name: "Computer Science",
          percentage: 90.0,
          attended: 36,
          total: 40
        }
      ]
    }
  };

  return (
    <StudentContext.Provider value={{ studentData }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
