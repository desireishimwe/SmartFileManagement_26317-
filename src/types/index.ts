export type Gender = 'Female' | 'Male';
export type AcademicLevel = 'O Level' | 'A Level';
export type ALevelCombination = 'MCB' | 'PCB' | 'PCM' | 'MCI' | 'HEG' | 'HGL' | 'MEG' | 'CEG';
export type AttendanceStatus = 'Present' | 'Absent';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  enrollmentDate: string;
  level: AcademicLevel;
  combination?: ALevelCombination;
  className: string;
  parentName: string;
  parentPhone: string;
  address: string;
  email: string;
  profilePhoto: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  subject: string;
  qualification: string;
  phone: string;
  email: string;
  address: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  classTeacher: string;
  room: string;
  students: number;
  subjects: string[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  className: string;
  status: AttendanceStatus;
}

export interface ResultRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  marks: number;
  gpa: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  parentName: string;
  parentPhone: string;
  amount: number;
  paid: number;
  dueDate: string;
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Mobile Money';

export interface PaymentRecord {
  id: string;
  feeId: string;
  studentName: string;
  amount: number;
  method: PaymentMethod;
  paidBy: string;
  date: string;
}

export type EventCategory = 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday' | 'general';

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;        // YYYY-MM-DD
  startTime?: string;  // HH:MM
  endTime?: string;    // HH:MM
  category: EventCategory;
  description: string;
  location?: string;
  audience: Array<'all' | 'student' | 'teacher' | 'parent' | 'admin'>;
}

export type UserRole = 'admin' | 'academic' | 'finance' | 'teacher' | 'student' | 'parent';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subject?: string;
  className?: string;
  studentId?: string; // for parent role — which child they belong to
}

export interface ToastMessage {
  id: number;
  title: string;
  message: string;
  variant: 'success' | 'danger' | 'info';
}
