import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo profiles
  const studentProfile = await prisma.profile.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'student@example.com',
      name: 'Ayush Kumar Pandey',
      role: 'student',
      department: 'Computer Science',
      avatarUrl: '/images/ayush.jpg',
    },
  });

  const facultyProfile = await prisma.profile.upsert({
    where: { email: 'faculty@example.com' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'faculty@example.com',
      name: 'Dr. Vidit Vats',
      role: 'faculty',
      department: 'Engineering Mathematics',
      avatarUrl: '/images/sir.jpg',
    },
  });

  // Create Student and Faculty records
  const student = await prisma.student.upsert({
    where: { profileId: studentProfile.id },
    update: {},
    create: {
      profileId: studentProfile.id,
      rollNumber: 'CS2023001',
      semester: 4,
      section: 'A',
      batch: '2023-2027',
    },
  });

  const faculty = await prisma.faculty.upsert({
    where: { profileId: facultyProfile.id },
    update: {},
    create: {
      profileId: facultyProfile.id,
      employeeId: 'EMP-MATH-01',
    },
  });

  // Create Courses
  const courseMath = await prisma.course.upsert({
    where: { code: 'AHT-005' },
    update: {},
    create: {
      code: 'AHT-005',
      name: 'Maths-II',
      credits: 4,
      semester: 4,
      department: 'Engineering Mathematics',
      facultyId: faculty.id,
    },
  });

  const courseChem = await prisma.course.upsert({
    where: { code: 'AHT-002' },
    update: {},
    create: {
      code: 'AHT-002',
      name: 'Engg. Chemistry',
      credits: 4,
      semester: 4,
      department: 'Applied Sciences',
      facultyId: faculty.id,
    },
  });

  const courseMech = await prisma.course.upsert({
    where: { code: 'MET-001' },
    update: {},
    create: {
      code: 'MET-001',
      name: 'Basic Mechanical Engg.',
      credits: 3,
      semester: 4,
      department: 'Mechanical Engineering',
      facultyId: faculty.id,
    },
  });

  // Enroll student
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: courseMath.id } },
    update: {},
    create: { studentId: student.id, courseId: courseMath.id },
  });

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: courseChem.id } },
    update: {},
    create: { studentId: student.id, courseId: courseChem.id },
  });

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: courseMech.id } },
    update: {},
    create: { studentId: student.id, courseId: courseMech.id },
  });

  // Seed sample assignments
  await prisma.assignment.createMany({
    skipDuplicates: true,
    data: [
      {
        courseId: courseMath.id,
        title: 'Unit-5 Partial Differential Equations',
        description: 'Solve problems 1-15 from exercise 5.2',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxMarks: 50,
      },
      {
        courseId: courseMech.id,
        title: 'Thermodynamics Unit-1 Assignment',
        description: 'Submit report on Laws of Thermodynamics',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxMarks: 100,
      },
    ],
  });

  // Seed sample notices
  await prisma.notice.createMany({
    skipDuplicates: true,
    data: [
      {
        facultyId: faculty.id,
        title: 'Mid-Term Exam Schedule Announced',
        content: 'The mid-term examinations will commence from next Monday. Ensure all pending assignments are submitted.',
        category: 'academic',
      },
      {
        facultyId: faculty.id,
        title: 'Annual Tech Fest "Anugoonj 2026"',
        content: 'Registrations are now open for coding competitions and robotics workshops.',
        category: 'event',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
