export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  email: string;
  phone: string;
  location: string;
  about: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  location: string;
  hours: string;
  contact: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date | string;
  description?: string;
  location?: string;
}

export interface ContactInfo {
  general: {
    email: string;
    phone: string;
    address: string;
  };
  admissions: {
    email: string;
    phone: string;
    location: string;
  };
  emergency: {
    phone: string;
    campusPolice: string;
  };
}

export interface StudentData {
  attendance?: {
    overall_percentage: number;
    by_subject: Array<{
      name: string;
      percentage: number;
      attended: number;
      total: number;
    }>;
  };
}

export interface CollegeContext {
  name: string;
  departments: Department[];
  facilities: Facility[];
  upcomingEvents: Event[];
  contactInfo: ContactInfo;
  studentData?: StudentData;
}
