import { AttendanceRecord, FeeRecord, ResultRecord, SchoolClass, SchoolEvent, Student, Teacher } from '../types';

export const studentsSeed: Student[] = [
  {
    id: 'STU-1001',
    firstName: 'Ava',
    lastName: 'Johnson',
    gender: 'Female',
    dateOfBirth: '2009-03-14',
    enrollmentDate: '2023-09-04',
    level: 'O Level',
    className: 'Grade 10A',
    parentName: 'Mia Johnson',
    parentPhone: '+1 555 0142',
    address: '219 Maple Street',
    email: 'ava.johnson@nuvision.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1002',
    firstName: 'Liam',
    lastName: 'Carter',
    gender: 'Male',
    dateOfBirth: '2008-11-02',
    enrollmentDate: '2022-09-05',
    level: 'A Level',
    combination: 'PCB',
    className: 'Grade 11B',
    parentName: 'Noah Carter',
    parentPhone: '+1 555 0188',
    address: '84 Cedar Avenue',
    email: 'liam.carter@nuvision.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1003',
    firstName: 'Sophia',
    lastName: 'Martinez',
    gender: 'Female',
    dateOfBirth: '2010-06-22',
    enrollmentDate: '2024-09-02',
    level: 'O Level',
    className: 'Grade 9C',
    parentName: 'Elena Martinez',
    parentPhone: '+1 555 0190',
    address: '542 Lake Road',
    email: 'sophia.martinez@nuvision.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1004',
    firstName: 'Ethan',
    lastName: 'Nguyen',
    gender: 'Male',
    dateOfBirth: '2009-08-09',
    enrollmentDate: '2023-09-04',
    level: 'O Level',
    className: 'Grade 10A',
    parentName: 'Linh Nguyen',
    parentPhone: '+1 555 0155',
    address: '17 Summit Lane',
    email: 'ethan.nguyen@nuvision.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1005',
    firstName: 'Isabella',
    lastName: 'Brown',
    gender: 'Female',
    dateOfBirth: '2008-01-30',
    enrollmentDate: '2021-09-06',
    level: 'A Level',
    combination: 'MCB',
    className: 'Grade 12A',
    parentName: 'Henry Brown',
    parentPhone: '+1 555 0120',
    address: '301 Oak Circle',
    email: 'isabella.brown@nuvision.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  },
];

export const teachersSeed: Teacher[] = [
  { id: 'TCH-201', fullName: 'Dr. Nora Ellis', subject: 'Mathematics', qualification: 'PhD Mathematics', phone: '+1 555 1101', email: 'nora.ellis@nuvision.edu', address: '45 Faculty Row' },
  { id: 'TCH-202', fullName: 'Marcus Lee', subject: 'Physics', qualification: 'MSc Physics', phone: '+1 555 1102', email: 'marcus.lee@nuvision.edu', address: '46 Faculty Row' },
  { id: 'TCH-203', fullName: 'Priya Shah', subject: 'English', qualification: 'MA English', phone: '+1 555 1103', email: 'priya.shah@nuvision.edu', address: '47 Faculty Row' },
  { id: 'TCH-204', fullName: 'Owen Brooks', subject: 'History', qualification: 'MA History', phone: '+1 555 1104', email: 'owen.brooks@nuvision.edu', address: '48 Faculty Row' },
];

export const classesSeed: SchoolClass[] = [
  { id: 'CLS-10A', name: 'Grade 10A', classTeacher: 'Dr. Nora Ellis', room: 'B-201', students: 34, subjects: ['Mathematics', 'Physics', 'English'] },
  { id: 'CLS-11B', name: 'Grade 11B', classTeacher: 'Marcus Lee', room: 'B-214', students: 31, subjects: ['Physics', 'Chemistry', 'History'] },
  { id: 'CLS-9C', name: 'Grade 9C', classTeacher: 'Priya Shah', room: 'A-109', students: 29, subjects: ['English', 'Biology', 'Geography'] },
  { id: 'CLS-12A', name: 'Grade 12A', classTeacher: 'Owen Brooks', room: 'C-301', students: 27, subjects: ['Calculus', 'Economics', 'Literature'] },
];

export const attendanceSeed: AttendanceRecord[] = [
  { id: 'ATT-1', date: '2026-06-25', studentId: 'STU-1001', studentName: 'Ava Johnson', className: 'Grade 10A', status: 'Present' },
  { id: 'ATT-2', date: '2026-06-25', studentId: 'STU-1002', studentName: 'Liam Carter', className: 'Grade 11B', status: 'Absent' },
  { id: 'ATT-3', date: '2026-06-25', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C', status: 'Present' },
  { id: 'ATT-4', date: '2026-06-25', studentId: 'STU-1004', studentName: 'Ethan Nguyen', className: 'Grade 10A', status: 'Present' },
];

export const resultsSeed: ResultRecord[] = [
  // Ava Johnson – STU-1001 – Grade 10A
  { id: 'RES-1-1', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'Mathematics', marks: 92, gpa: 3.8 },
  { id: 'RES-1-2', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'Physics',     marks: 88, gpa: 3.5 },
  { id: 'RES-1-3', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'English',     marks: 95, gpa: 4.0 },
  { id: 'RES-1-4', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'History',     marks: 79, gpa: 3.0 },
  { id: 'RES-1-5', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'Biology',     marks: 84, gpa: 3.3 },
  { id: 'RES-1-6', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'Geography',   marks: 90, gpa: 3.7 },

  // Liam Carter – STU-1002 – Grade 11B
  { id: 'RES-2-1', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'Physics',     marks: 84, gpa: 3.3 },
  { id: 'RES-2-2', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'Chemistry',   marks: 76, gpa: 2.9 },
  { id: 'RES-2-3', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'Mathematics', marks: 81, gpa: 3.2 },
  { id: 'RES-2-4', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'History',     marks: 90, gpa: 3.7 },
  { id: 'RES-2-5', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'English',     marks: 88, gpa: 3.5 },
  { id: 'RES-2-6', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'Economics',   marks: 72, gpa: 2.7 },

  // Sophia Martinez – STU-1003 – Grade 9C
  { id: 'RES-3-1', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'English',     marks: 96, gpa: 4.0 },
  { id: 'RES-3-2', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'Biology',     marks: 89, gpa: 3.6 },
  { id: 'RES-3-3', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'Geography',   marks: 91, gpa: 3.7 },
  { id: 'RES-3-4', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'Mathematics', marks: 73, gpa: 2.8 },
  { id: 'RES-3-5', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'Science',     marks: 85, gpa: 3.4 },
  { id: 'RES-3-6', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'History',     marks: 78, gpa: 3.0 },

  // Ethan Nguyen – STU-1004 – Grade 10A
  { id: 'RES-4-1', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'Mathematics', marks: 77, gpa: 3.0 },
  { id: 'RES-4-2', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'Physics',     marks: 82, gpa: 3.2 },
  { id: 'RES-4-3', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'English',     marks: 68, gpa: 2.5 },
  { id: 'RES-4-4', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'History',     marks: 74, gpa: 2.8 },
  { id: 'RES-4-5', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'Biology',     marks: 80, gpa: 3.1 },
  { id: 'RES-4-6', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'Geography',   marks: 71, gpa: 2.7 },

  // Isabella Brown – STU-1005 – Grade 12A
  { id: 'RES-5-1', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Calculus',    marks: 94, gpa: 3.9 },
  { id: 'RES-5-2', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Economics',   marks: 88, gpa: 3.5 },
  { id: 'RES-5-3', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Literature',  marks: 91, gpa: 3.7 },
  { id: 'RES-5-4', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Physics',     marks: 86, gpa: 3.4 },
  { id: 'RES-5-5', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Chemistry',   marks: 89, gpa: 3.6 },
  { id: 'RES-5-6', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Mathematics', marks: 92, gpa: 3.8 },
];

export const feesSeed: FeeRecord[] = [
  { id: 'FEE-1', studentId: 'STU-1001', studentName: 'Ava Johnson',      className: 'Grade 10A', parentName: 'Mia Johnson',   parentPhone: '+1 555 0142', amount: 2400, paid: 1800, dueDate: '2026-07-15' },
  { id: 'FEE-2', studentId: 'STU-1002', studentName: 'Liam Carter',      className: 'Grade 11B', parentName: 'Noah Carter',   parentPhone: '+1 555 0188', amount: 2600, paid: 2600, dueDate: '2026-07-15' },
  { id: 'FEE-3', studentId: 'STU-1003', studentName: 'Sophia Martinez',  className: 'Grade 9C',  parentName: 'Elena Martinez',parentPhone: '+1 555 0190', amount: 2200, paid: 1200, dueDate: '2026-07-20' },
  { id: 'FEE-4', studentId: 'STU-1004', studentName: 'Ethan Nguyen',     className: 'Grade 10A', parentName: 'Linh Nguyen',   parentPhone: '+1 555 0155', amount: 2400, paid:  800, dueDate: '2026-07-15' },
  { id: 'FEE-5', studentId: 'STU-1005', studentName: 'Isabella Brown',   className: 'Grade 12A', parentName: 'Henry Brown',   parentPhone: '+1 555 0120', amount: 2800, paid:    0, dueDate: '2026-07-20' },
];

export const eventsSeed: SchoolEvent[] = [
  // ── This week (Jun 23 – Jun 29, 2026) ──
  {
    id: 'EVT-1', title: 'Morning Assembly & Announcements',
    date: '2026-06-23', startTime: '07:30', endTime: '08:00',
    category: 'general', location: 'Main Hall',
    description: 'Weekly opening assembly. Uniform inspection and notices from the principal.',
    audience: ['all'],
  },
  {
    id: 'EVT-2', title: 'Mathematics Mid-Term Test — Grade 10A',
    date: '2026-06-23', startTime: '09:00', endTime: '11:00',
    category: 'academic', location: 'Room B-201',
    description: 'Chapters 1–6 of the prescribed textbook. No calculator. Bring pencil and ruler.',
    audience: ['student', 'teacher'],
  },
  {
    id: 'EVT-3', title: 'Science Fair Exhibition',
    date: '2026-06-24', startTime: '10:00', endTime: '14:00',
    category: 'academic', location: 'Sports Court',
    description: 'Students from Grades 9–12 present their science projects. Judges from the university will attend.',
    audience: ['all'],
  },
  {
    id: 'EVT-4', title: 'Library Closed (Staff Training)',
    date: '2026-06-24',
    category: 'general', location: 'Library',
    description: 'The school library will be closed for staff digital-catalogue training.',
    audience: ['student'],
  },
  {
    id: 'EVT-5', title: 'Mid-Term Examinations Begin',
    date: '2026-06-25', startTime: '08:00',
    category: 'academic', location: 'Examination Halls',
    description: 'Mid-term exams for all grades begin today and run through Friday. Check your personal timetable for your specific slots.',
    audience: ['student', 'teacher'],
  },
  {
    id: 'EVT-6', title: 'Parent-Teacher Meeting',
    date: '2026-06-25', startTime: '14:00', endTime: '17:00',
    category: 'meeting', location: 'Classrooms',
    description: 'Scheduled consultations for parents of Grade 9 and 10 students. Appointments must be booked in advance.',
    audience: ['parent', 'teacher'],
  },
  {
    id: 'EVT-7', title: 'Drama Club End-of-Term Performance',
    date: '2026-06-26', startTime: '16:00', endTime: '18:00',
    category: 'cultural', location: 'School Auditorium',
    description: '"A Midsummer Night\'s Dream" — performed by the Nu Vision Drama Club. Open to all students, parents, and staff. Free entry.',
    audience: ['all'],
  },
  {
    id: 'EVT-8', title: 'Staff Professional Development Day',
    date: '2026-06-26', startTime: '08:00', endTime: '13:00',
    category: 'meeting', location: 'Conference Room',
    description: 'No lessons during this period. Students report to study hall.',
    audience: ['teacher', 'admin'],
  },
  {
    id: 'EVT-9', title: 'Inter-School Sports Day',
    date: '2026-06-27', startTime: '09:00', endTime: '17:00',
    category: 'sports', location: 'Athletics Track & Field',
    description: 'Annual inter-school athletics and team sports competition. Representing Nu Vision: Track, Football, Volleyball teams.',
    audience: ['all'],
  },
  {
    id: 'EVT-10', title: 'End-of-Term Notice Distribution',
    date: '2026-06-27', startTime: '15:00',
    category: 'general', location: 'All Classrooms',
    description: 'Official end-of-term letters and fee statements distributed to all students.',
    audience: ['student'],
  },

  // ── Next week (Jun 30 – Jul 6, 2026) ──
  {
    id: 'EVT-11', title: 'Public Holiday — Independence Day',
    date: '2026-06-30',
    category: 'holiday',
    description: 'School closed. No classes or activities.',
    audience: ['all'],
  },
  {
    id: 'EVT-12', title: 'Fee Payment Deadline Reminder',
    date: '2026-07-01', startTime: '08:00',
    category: 'general', location: 'Finance Office',
    description: 'All outstanding fee balances must be paid by July 15. Visit the finance office or use the parent online portal.',
    audience: ['student', 'parent'],
  },
  {
    id: 'EVT-13', title: 'Academic Awards Ceremony',
    date: '2026-07-02', startTime: '10:00', endTime: '12:00',
    category: 'academic', location: 'Main Hall',
    description: 'Top performers of the term will be recognised. Certificates and merit awards presented by the principal.',
    audience: ['all'],
  },
  {
    id: 'EVT-14', title: 'Football Team Practice',
    date: '2026-07-03', startTime: '14:30', endTime: '16:30',
    category: 'sports', location: 'Football Field',
    description: 'Mandatory practice session for all squad members ahead of the regional championship.',
    audience: ['student'],
  },
  {
    id: 'EVT-15', title: 'Cultural Week Kickoff — Art Exhibition',
    date: '2026-07-04', startTime: '09:00', endTime: '14:00',
    category: 'cultural', location: 'Art Room & Corridor',
    description: 'Opening of Nu Vision Cultural Week. Art exhibits, poetry readings, and music performances throughout the school.',
    audience: ['all'],
  },
];

export const activities = [
  'New student profile created for Isabella Brown',
  'Grade 10A attendance submitted by Dr. Nora Ellis',
  'Payment recorded for Liam Carter',
  'Mathematics marks updated for Grade 10A',
  'Weekly timetable published for senior classes',
];
