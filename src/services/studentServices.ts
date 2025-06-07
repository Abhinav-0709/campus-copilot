import studentData from '../data/student_data.json';

interface AttendanceSubject {
  name: string;
  percentage: number;
  attended: number;
  total: number;
}

interface QueryResult {
  response: string;
  data?: any;
}

export class StudentService {
  private studentData = studentData;

  handleQuery(query: string): QueryResult {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('attendance') || lowerQuery.includes('present')) {
      return this.getAttendance();
    } else if (lowerQuery.includes('assignment') && 
              (lowerQuery.includes('pending') || 
               lowerQuery.includes('due') || 
               lowerQuery.includes('upcoming'))) {
      return this.getPendingAssignments();
    } else if (lowerQuery.includes('grade') || 
               lowerQuery.includes('result') || 
               lowerQuery.includes('marks')) {
      return this.getGrades();
    }

    return {
      response: "I couldn't understand your query about academic records. Could you please rephrase?"
    };
  }

  private getAttendance(): QueryResult {
    const attendance = this.studentData.attendance;
    const formattedAttendance = attendance.by_subject.map((sub: AttendanceSubject) => 
      `${sub.name}: ${sub.percentage}% (${sub.attended}/${sub.total} classes)`
    ).join('\n');

    return {
      response: `Your overall attendance is ${attendance.overall_percentage}%.\n\nBy subject:\n${formattedAttendance}`,
      data: attendance
    };
  }

  private getPendingAssignments(): QueryResult {
    const pending = this.studentData.assignments.pending;
    if (pending.length === 0) {
      return {
        response: "You don't have any pending assignments. Great job!",
        data: { pending: [] }
      };
    }

    const formattedAssignments = pending.map((a: any) => 
      `- ${a.subject}: ${a.title} (Due: ${a.due_date})`
    ).join('\n');

    return {
      response: `You have ${pending.length} pending assignment(s):\n${formattedAssignments}`,
      data: { pending }
    };
  }

  private getGrades(): QueryResult {
    const current = this.studentData.grades.current_semester;
    const previous = this.studentData.grades.previous_semesters[0]; // Most recent semester

    if (!current && !previous) {
      return {
        response: "No grade information is currently available."
      };
    }

    let response = "";

    if (current?.subjects?.length) {
      response += "Current Semester Grades:\n";
      response += current.subjects.map((s: any) => 
        `- ${s.name}: ${s.internal_marks}/${s.internal_max} (Internal), ${s.assignment_marks}/${s.assignment_max} (Assignments)`
      ).join('\n');
    }

    if (previous) {
      response += "\n\nPrevious Semester Results:\n";
      response += `SGPA: ${previous.sgpa}\n`;
      response += previous.subjects.map((s: any) => 
        `- ${s.name}: ${s.grade} (${s.credits} credits)`
      ).join('\n');
    }

    return {
      response,
      data: { current, previous }
    };
  }
}

export const studentService = new StudentService();