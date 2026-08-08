import { z } from 'zod';

export const ProfileSyncSchema = z.object({
  id: z.string().min(1, 'Profile ID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['student', 'faculty', 'admin']),
  department: z.string().optional(),
});

export const LeaveSubmissionSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  fromDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid fromDate'),
  toDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid toDate'),
  reason: z.string().min(3, 'Reason must be at least 3 characters long'),
  leaveType: z.enum(['medical', 'personal', 'academic', 'emergency']),
});

export const LeaveApprovalSchema = z.object({
  id: z.string().min(1, 'Leave ID is required'),
  status: z.enum(['pending', 'approved', 'rejected']),
  reviewNote: z.string().optional(),
  reviewedBy: z.string().optional(),
});

export const AttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  status: z.enum(['present', 'absent', 'late']),
  markedBy: z.string().optional(),
});

export const AssignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid dueDate'),
  maxMarks: z.number().int().positive().default(100),
});

export const NoticeSchema = z.object({
  facultyId: z.string().min(1, 'Faculty ID is required'),
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(5, 'Content must be at least 5 characters'),
  category: z.enum(['academic', 'event', 'administrative', 'general']),
  targetRole: z.enum(['student', 'faculty', 'admin']).optional(),
});

export const FeeRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().optional(),
  semester: z.number().int().min(1).max(8).optional(),
  tuitionFee: z.number().nonnegative().optional(),
  hostelFee: z.number().nonnegative().optional(),
  examFee: z.number().nonnegative().optional(),
  status: z.enum(['pending', 'paid', 'overdue']).optional(),
});

export const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, 'Message content cannot be empty'),
    })
  ).min(1, 'At least one message is required').max(50, 'Too many messages in conversation'),
  sessionId: z.string().optional(),
  studentId: z.string().optional(),
});

export const RAGIngestSchema = z.object({
  title: z.string().min(2, 'Document title is required'),
  content: z.string().min(10, 'Document content must be at least 10 characters'),
  category: z.string().optional(),
});

export const SubmissionCreateSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  fileUrl: z.string().url('Invalid file URL').optional(),
});

// File upload validator
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/csv',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: 'File size exceeds maximum limit of 10 MB' };
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, error: `File type '${file.type}' is not allowed for upload.` };
  }

  return { isValid: true };
}
