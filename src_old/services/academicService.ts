interface Notice {
  id: string;
  title: string;
  content: string;
  date: Date | string;
  author: string;
  targetAudience?: 'all' | 'faculty' | 'students' | string[];
  priority?: 'high' | 'medium' | 'low';
  courseId?: string; // Optional course ID to associate notice with a specific course
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  courseId: string;
  courseName: string;
  maxMarks: number;
  submissionType: 'online' | 'offline';
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

class AcademicService {
  private notices: Notice[] = [];
  private assignments: Assignment[] = [];
  private static instance: AcademicService;

  private constructor() {}

  public static getInstance(): AcademicService {
    if (!AcademicService.instance) {
      AcademicService.instance = new AcademicService();
    }
    return AcademicService.instance;
  }

  // Notice Methods
  public createNotice(notice: Omit<Notice, 'id'> & { date?: Date | string }): Notice {
    const newNotice: Notice = {
      ...notice,
      id: `notice-${Date.now()}`,
      date: notice.date || new Date(),
    };
    this.notices.push(newNotice);
    return newNotice;
  }

  public getNotices(filter?: Partial<Notice>): Notice[] {
    if (!filter) return this.notices;
    return this.notices.filter(notice => 
      Object.entries(filter).every(([key, value]) => 
        notice[key as keyof Notice] === value
      )
    );
  }

  // Assignment Methods
  public createAssignment(assignment: Omit<Assignment, 'id'>): Assignment {
    const newAssignment: Assignment = {
      ...assignment,
      id: `assign-${Date.now()}`,
    };
    this.assignments.push(newAssignment);
    return newAssignment;
  }

  public getAssignments(filter?: Partial<Assignment>): Assignment[] {
    if (!filter) return this.assignments;
    return this.assignments.filter(assignment =>
      Object.entries(filter).every(([key, value]) =>
        assignment[key as keyof Assignment] === value
      )
    );
  }

  // Get assignments for a specific course
  public getCourseAssignments(courseId: string): Assignment[] {
    return this.getAssignments({ courseId });
  }

  // Get assignments due soon (within next 7 days)
  public getUpcomingAssignments(): Assignment[] {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return this.assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate > today && dueDate <= nextWeek;
    });
  }
}

export const academicService = AcademicService.getInstance();
export type { Notice, Assignment };
