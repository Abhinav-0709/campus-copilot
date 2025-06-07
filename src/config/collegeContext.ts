// Comprehensive college context for Campus Copilot
const collegeContext = {
  name: "Roorkee Institute Of Technology",
  departments: [
    {
      id: "cs",
      name: "Computer Science",
      head: "Dr. Lokesh",
      email: "lokesh.cse@ritroorkee.com",
      phone: "+91 9374528487",
      location: "C-Block",
      about: "The Computer Science department offers cutting-edge programs in software engineering, artificial intelligence, and data science."
    },
    {
      id: "arts",
      name: "Humanities and Science",
      head: "Dr. Neeraj Malik",
      email: "neeraj.cse@ritroorkee.com",
      phone: "+91 7248050822",
      location: "C-Block, Room :- C007",
      about: "Our programs foster creativity and critical thinking through the study of arts, literature, and culture."
    },
    {
      id: "management",
      name: "Management",
      head: "Dr. Amit Rawat",
      email: "amit.mba@ritroorkee.com",
      phone: "+91 9837492734",
      location: "A-Block",
      about: "The Management prepares future leaders with practical skills and knowledge for the global business environment."
    },
    {
      id: "mec",
      name: "Mechanical Engineering",
      head: "Dr.",
      email: "pankaj.mec@ritroorkee.com",
      phone: "+1 (555) 111-5555",
      location: "C-Block",
      about: "The Mechanical Engineering department provides a strong foundation in thermodynamics, fluid mechanics, and machine design, while embracing modern advancements in robotics, automation, and sustainable energy systems."
    },
    {
      id: "civil",
      name: "Civil Engineering",
      head: "Prop. Ajay Singh",
      email: "ajay.civil@ritroorkee.com",
      phone: "+91 ",
      location: "C-Block, Room ",
      about: "The Civil Engineering department focuses on structural design, transportation systems, and environmental engineering, preparing students to build resilient infrastructure and sustainable urban developments."
    },
    {
      id: "ect",
      name: " Electronics and Communication Engineering",
      head: "Dr. Ashok Kumar",
      email: "ashok.ect@ritroorkee.com",
      phone: "+91 ",
      location: "C-Block, Room ",
      about: "The Electronics & Communication Engineering department equips students with expertise in embedded systems, signal processing, and wireless communication, fostering innovation in next-generation electronic technologies."
    },
  ],
  facilities: [
    {
      id: "library",
      name: "College Library",
      description: "Main campus library with study spaces, and research assistance.",
      location: "At the Ground Floor of the C-block",
      hours: "Mon-Thu: 9am-6:30pm, Fri: 9am-6:30pm, Sat: 10am-6pm, Sun: 10am-6pm",
      contact: "library@ritrookee.com, +91 (555) 222-1111"
    },
    {
      id: "gym",
      name: "Hostel GYM",
      description: "Fully equipped gym, fitness classes.",
      location: "East Campus",
      hours: "Mon-Sat: 5pm-8pm and 5am-7am, Closed at Sundays",
      contact: "gym@ritrookee.com +91 (555) 222-2222"
    },
    {
      id: "cafeteria",
      name: "Sunflower Cafeteria",
      description: "Dining hall serving a variety of meals throughout the day.",
      location: "Near the Center-Campus",
      hours: "Mon-Fri: 7am-9pm, Sat-Sun: 10am-9pm",
      contact: "cafeteria@ritroorkee.com, +91 (555) 222-3333"
    },
    {
      id: "health",
      name: "Student Health Center",
      description: "Medical services for students including general health, counseling, and wellness programs.",
      location: "West Campus, C-Block Ground Floor",
      hours: "Mon-Sun: 9am-5pm",
      contact: "health@ritroorkee.com, +91 (555) 222-4444"
    }
  ],
  contactInfo: {
    general: {
      email: "info@ritroorkee.com",
      phone: "+91 (555) 123-4567",
      address: "8th Km. Roorkee Dehradun Road, Puhana, Roorkee - 247667, Uttarakhand"
    },
    admissions: {
      email: "admissions@ritrookee.com",
      phone: "+91 (555) 123-4000",
      location: "Admissions Office, 1st Floor A Block"
    },
    emergency: {
      phone: "+91 (555) 911-9111",
      campusPolice: "+91 (555) 123-4567"
    }
  },
  academicCalendar: {
    fallSemester: {
      start: new Date('2025-02-01'),
      end: new Date('2025-05-15'),
      registration: new Date('2025-01-25'),
      addDropDeadline: new Date('2025-02-04')
    },
    springSemester: {
      start: new Date('2024-08-27'),
      end: new Date('2024-12-28'),
      registration: new Date('2024-07-07'),
      addDropDeadline: new Date('2024-08-27')
    },
    summerSessions: {
      session1: {
        start: new Date('2025-04-01'),
        end: new Date('2025-04-30')
      },
      session2: {
        start: new Date('2025-05-01'),
        end: new Date('2025-06-15')
      }
    },
    holidays: [
      { name: 'Mahashivratri', date: new Date('2025-02.26') },
      { name: 'Chrishmas', date: new Date('2024-12-25')},
      { name: 'Diwali', date: new Date('2025-03-14')},
      { name: 'Holi Festival', date: new Date('2025-03-13'), end: new Date('2025-03-15') },
      { name: 'Memorial Day', date: new Date('2025-05-27') }
    ]
  },
  upcomingEvents: [
    {
      id: 'Inductions-2025',
      title: 'Freshman Induction Program',
      date: new Date('2024-08-25'), // 3 days from now
      endDate: new Date('2024-05-27'),
      location: 'Sunflower Center',
      description: 'Welcome event for new students. Campus tour and information sessions about academic programs, student life, and campus resources.',
      organizer: 'Office of Student Affairs',
      audience: 'Incoming Students',
      registrationRequired: true,
      registrationLink: 'https://ritrookee.com/inductions/register'
    },
    {
      id: 'Anugoonj',
      title: 'Annual Cultural Fest',
      date: new Date('2025-04-15'), // 7 days from now
      endDate: new Date('2025-04-19'), // +6 hours
      location: 'PMC Ground',
      description: 'Connect with top employers from various industries. Bring multiple copies of your resume and dress professionally.',
      organizer: 'Crew',
      audience: 'All Students & Faculties',
      registrationRequired: false
    },
    {
      id: 'Technomax',
      title: 'Tech-Hardware Event',
      date: new Date('2025-06-03'),
      location: 'B-Block',
      description: 'Showcase of undergraduate research projects across all disciplines. Open to the university community and public.',
      organizer: 'Office of Undergraduate Research',
      audience: 'Students, Faculty, Public',
      registrationRequired: false
    },
    {
      id: 'graduates',
      title: 'Ashirvad - Graduation Ceremany',
      date: new Date('2025-06-02'), 
      location: 'Center Campus',
      description: 'Annual celebration for graduates featuring class reunions,and parade for all the studnets.',
      organizer: 'College Mangement',
      audience: 'Graduates, Students, Faculty, Staff',
      registrationRequired: true,
      registrationLink: 'https://ritroorkee.com/ashirvad'
    },
    {
      id: 'final-exams',
      title: 'Final Examination Period',
      date: new Date('2025-06-09'), // 28 days from now
      endDate: new Date('2025-06-20'),
      location: 'Various',
      description: 'Summer semester final examination period. Check the exam schedule for specific times and locations.',
      organizer: 'Registrar\'s Office',
      audience: 'All Students',
      registrationRequired: false
    }
  ],
  importantDates: {
    addDropDeadline: new Date('2025-09-08'),
    withdrawalDeadline: new Date('2025-10-27'),
    registrationBegins: new Date('2025-11-01'),
    commencement: new Date('2025-05-10')
  },
  academicPolicies: {
    gpa: {
      minimumForGoodStanding: 2.0,
      minimumForGraduation: 2.0,
      academicProbation: 1.99,
      academicDismissal: 1.5
    },
    credits: {
      fullTime: 12,
      maximumPerSemester: 18,
      graduationRequirement: 120
    },
    gradingScale: [
      { grade: 'A', points: 4.0, description: 'Excellent' },
      { grade: 'A-', points: 3.7, description: 'Excellent' },
      { grade: 'B+', points: 3.3, description: 'Good' },
      { grade: 'B', points: 3.0, description: 'Good' },
      { grade: 'B-', points: 2.7, description: 'Good' },
      { grade: 'C+', points: 2.3, description: 'Satisfactory' },
      { grade: 'C', points: 2.0, description: 'Satisfactory' },
      { grade: 'C-', points: 1.7, description: 'Passing' },
      { grade: 'D+', points: 1.3, description: 'Passing' },
      { grade: 'D', points: 1.0, description: 'Passing' },
      { grade: 'F', points: 0.0, description: 'Failing' }
    ]
  },
  studentServices: {
    tutoring: {
      available: true,
      subjects: ['Math', 'Writing', 'Sciences', 'Languages'],
      location: 'B-Block, Library Ground Floor',
      hours: 'Mon-Thu: 10am-8pm, Fri: 10am-4pm, Sun: 2pm-8pm'
    },
    counseling: {
      available: true,
      services: ['Individual Counseling', 'Group Therapy', 'Crisis Intervention'],
      contact: 'counseling@ritroorkee.com, +91 (555) 333-1111',
      emergency: 'After hours crisis line: +91 (555) 333-9999'
    },
    disabilityServices: {
      available: true,
      contact: 'disability@ritroorkee.com, +91 (555) 333-2222',
      location: 'Student Services Building, Room 100'
    }
  },
  campusMap: {
    mainCampus: {
      buildings: [
        { id: 'ENG', name: 'Engineering Building', abbreviation: 'ENG' },
        { id: 'SCI', name: 'Science Complex', abbreviation: 'SCI' },
        { id: 'LIB', name: 'National Library', abbreviation: 'LIB' },
        { id: 'SC', name: 'Student Center', abbreviation: 'SC' },
        { id: 'HUM', name: 'Humanities Building', abbreviation: 'HUM' },
        { id: 'MBA', name: 'Management Bulding', abbreviation: 'BUS' },
        { id: 'GYM', name: 'Recreation Center', abbreviation: 'GYM' },
        { id: 'ADM', name: 'Administration Building', abbreviation: 'ADM' }
      ],
      parkingLots: [
        { id: 'P1', name: 'Main Parking', type: 'General', hours: '24/7' },
        { id: 'P2', name: 'Visitor Parking', type: 'Visitor', hours: '6am-10pm' },
        { id: 'P3', name: 'Faculty/Staff Parking', type: 'Permit Required', hours: '7am-7pm' }
      ],
      diningOptions: [
        { id: 'D1', name: 'Main Cafeteria', type: 'All-you-care-to-eat', hours: '7am-8pm' },
        { id: 'D2', name: 'Starbucks', type: 'Coffee & Snacks', hours: '7am-9pm' },
        { id: 'D3', name: 'Subway', type: 'Sandwiches', hours: '10am-8pm' },
        { id: 'D4', name: 'Panda Express', type: 'Asian Cuisine', hours: '11am-8pm' }
      ]
    },
    eastCampus: {
      buildings: [
        { id: 'ART', name: 'Fine Arts Center', abbreviation: 'ART' },
        { id: 'MUS', name: 'Music Building', abbreviation: 'MUS' },
        { id: 'THE', name: 'Theater', abbreviation: 'THE' }
      ]
    },
    westCampus: {
      buildings: [
        { id: 'ATH', name: 'Athletics Complex', abbreviation: 'ATH' },
        { id: 'POOL', name: 'Aquatic Center', abbreviation: 'POOL' },
        { id: 'STAD', name: 'Stadium', abbreviation: 'STAD' }
      ]
    }
  },
  transportation: {
    shuttleService: {
      available: true,
      routes: ['Red Line', 'Blue Line', 'Green Line'],
      hours: '6:30am-11:30pm Mon-Fri, 9am-10pm Sat-Sun',
      realTimeTracking: 'Available on campus app'
    },
    parking: {
      permitsRequired: true,
      visitorParking: 'Available in designated areas',
      parkingMap: 'https://ritroorkee.com/maps/parking'
    },
    publicTransportation: {
      bus: {
        routes: [1, 5, 12],
        nearestStop: 'Institute Station',
        schedule: 'https://citytransit.org/routes'
      },
      bikeShare: {
        available: true,
        locations: ['Student Center', 'Library', 'Recreation Center'],
        app: 'CityBike App'
      }
    }
  },
  housing: {
    residenceHalls: [
      {
        name: 'Bhagirath Bhawn',
        type: 'First-Year Experience',
        roomTypes: ['Double', 'Triple'],
        amenities: ['Laundry', 'Study Lounges','Mess'],
        contact: 'housing@ritrookee.com., +91 (555) 444-1001'
      },
      {
        name: 'Bhagirath Bhawn',
        type: 'Senoir-Year Experience',
        roomTypes: ['Double', 'Triple'],
        amenities: ['Laundry', 'Study Lounges','Mess'],
        contact: 'housing@ritrookee.com., +91 (555) 444-1001'
      },
      {
        name: 'Nandadevi Bhawan',
        type: 'Girls-Hostel',
        roomTypes: ['Triple', 'Double'],
        amenities: ['Air Conditioning', 'Study Lounges', 'Mess'],
        contact: 'housing@ritroorkee.com, +91 (555) 444-1003'
      }
    ],
    housingPortal: 'https://housing.ritroorkee.com',
    applicationDeadline: 'May 1st',
    moveInDates: {
      fall: 'August 15-18, 2025',
      spring: 'January 7-8, 2025'
    }
  },
  leavePolicy: `Leave Application Process:

1. Regular Leave:
   - Apply at least 3 working days in advance
   - Maximum 5 days per semester without medical certificate
   - Submit through student portal under 'Leave Application'

2. Medical Leave:
   - Submit medical certificate within 3 days of joining back
   - No maximum limit with valid documentation

3. Emergency Leave:
   - Contact your department office immediately
   - Submit required documents within 3 working days

4. Exam Leave:
   - Not permitted during examination periods
   - Exceptions only with prior approval from the Dean

For more details, visit the student portal or contact your department office.`,

  studentData: {
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
  },

  tuitionAndFees: {
    undergraduate: {
      inState: {
        fullTime: 12500,
        perCredit: 0,
        fees: 150000
      },
      outOfState: {
        fullTime: 28000,
        perCredit: 2334,
        fees: 150000
      }
    },
    graduate: {
      inState: {
        perCredit: 1200,
        fees: 1200
      },
      outOfState: {
        perCredit: 2400,
        fees: 1200
      }
    },
    housing: {
      standardDouble: 6500,
      standardSingle: 8000,
      apartment: 95000
    },
    mealPlans: {
      unlimited: 5800,
      fifteenMeals: 5200,
      tenMeals: 3800,
      fiveMeals: 2100
    },
    paymentOptions: {
      paymentPlan: 'Available in 4 installments',
      dueDates: ['August 1', 'October 1', 'January 1', 'March 1'],
      contact: 'bursar@ritroorkee.com, +91 (555) 555-1212'
    },
    financialAid: {
      fafsaCode: '002345',
      priorityDeadline: 'March 1',
      contact: 'finaid@ritroorkee.com, +1 (555) 555-1313'
    }
  }
};

export default collegeContext;
