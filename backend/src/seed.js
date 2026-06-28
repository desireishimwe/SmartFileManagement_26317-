require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Classes ──
  const classes = [
    { id: 'CLS-10A', name: 'Grade 10A', classTeacher: 'Dr. Nora Ellis',  room: 'B-201', students: 34, subjects: JSON.stringify(['Mathematics','Physics','English']) },
    { id: 'CLS-11B', name: 'Grade 11B', classTeacher: 'Marcus Lee',       room: 'B-214', students: 31, subjects: JSON.stringify(['Physics','Chemistry','History']) },
    { id: 'CLS-9C',  name: 'Grade 9C',  classTeacher: 'Priya Shah',       room: 'A-109', students: 29, subjects: JSON.stringify(['English','Biology','Geography']) },
    { id: 'CLS-12A', name: 'Grade 12A', classTeacher: 'Owen Brooks',      room: 'C-301', students: 27, subjects: JSON.stringify(['Calculus','Economics','Literature']) },
  ];
  for (const c of classes) await prisma.schoolClass.upsert({ where: { id: c.id }, update: c, create: c });

  // ── Teachers ──
  const teachers = [
    { id: 'TCH-201', fullName: 'Dr. Nora Ellis', subject: 'Mathematics', qualification: 'PhD Mathematics', phone: '+1 555 1101', email: 'nora.ellis@nuvision.edu',   address: '45 Faculty Row' },
    { id: 'TCH-202', fullName: 'Marcus Lee',      subject: 'Physics',     qualification: 'MSc Physics',     phone: '+1 555 1102', email: 'marcus.lee@nuvision.edu',   address: '46 Faculty Row' },
    { id: 'TCH-203', fullName: 'Priya Shah',      subject: 'English',     qualification: 'MA English',      phone: '+1 555 1103', email: 'priya.shah@nuvision.edu',   address: '47 Faculty Row' },
    { id: 'TCH-204', fullName: 'Owen Brooks',     subject: 'History',     qualification: 'MA History',      phone: '+1 555 1104', email: 'owen.brooks@nuvision.edu',  address: '48 Faculty Row' },
  ];
  for (const t of teachers) await prisma.teacher.upsert({ where: { id: t.id }, update: t, create: t });

  // ── Students ──
  const students = [
    { id: 'STU-1001', firstName: 'Ava',      lastName: 'Johnson',  gender: 'Female', dateOfBirth: '2009-03-14', enrollmentDate: '2023-09-04', level: 'O Level', combination: null, className: 'Grade 10A', parentName: 'Mia Johnson',    parentPhone: '+1 555 0142', address: '219 Maple Street', email: 'ava.johnson@nuvision.edu',      profilePhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80' },
    { id: 'STU-1002', firstName: 'Liam',     lastName: 'Carter',   gender: 'Male',   dateOfBirth: '2008-11-02', enrollmentDate: '2022-09-05', level: 'A Level', combination: 'PCB', className: 'Grade 11B', parentName: 'Noah Carter',    parentPhone: '+1 555 0188', address: '84 Cedar Avenue',  email: 'liam.carter@nuvision.edu',      profilePhoto: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80' },
    { id: 'STU-1003', firstName: 'Sophia',   lastName: 'Martinez', gender: 'Female', dateOfBirth: '2010-06-22', enrollmentDate: '2024-09-02', level: 'O Level', combination: null, className: 'Grade 9C',  parentName: 'Elena Martinez', parentPhone: '+1 555 0190', address: '542 Lake Road',    email: 'sophia.martinez@nuvision.edu',  profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
    { id: 'STU-1004', firstName: 'Ethan',    lastName: 'Nguyen',   gender: 'Male',   dateOfBirth: '2009-08-09', enrollmentDate: '2023-09-04', level: 'O Level', combination: null, className: 'Grade 10A', parentName: 'Linh Nguyen',    parentPhone: '+1 555 0155', address: '17 Summit Lane',   email: 'ethan.nguyen@nuvision.edu',     profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80' },
    { id: 'STU-1005', firstName: 'Isabella', lastName: 'Brown',    gender: 'Female', dateOfBirth: '2008-01-30', enrollmentDate: '2021-09-06', level: 'A Level', combination: 'MCB', className: 'Grade 12A', parentName: 'Henry Brown',    parentPhone: '+1 555 0120', address: '301 Oak Circle',   email: 'isabella.brown@nuvision.edu',   profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
  ];
  for (const s of students) await prisma.student.upsert({ where: { id: s.id }, update: s, create: s });

  // ── Users (hashed passwords) ──
  const hash = (p) => bcrypt.hash(p, 10);
  const users = [
    { email: 'admin@nuvision.edu',          name: 'Admin Office',       role: 'admin',    password: await hash('admin123')    },
    { email: 'grace.kimani@nuvision.edu',   name: 'Dr. Grace Kimani',   role: 'academic', password: await hash('academic123') },
    { email: 'samuel.osei@nuvision.edu',    name: 'Mr. Samuel Osei',    role: 'finance',  password: await hash('finance123')  },
    { email: 'nora.ellis@nuvision.edu',     name: 'Dr. Nora Ellis',     role: 'teacher',  password: await hash('teacher123'), subject: 'Mathematics', className: 'Grade 10A' },
    { email: 'marcus.lee@nuvision.edu',     name: 'Marcus Lee',         role: 'teacher',  password: await hash('teacher123'), subject: 'Physics',     className: 'Grade 11B' },
    { email: 'priya.shah@nuvision.edu',     name: 'Priya Shah',         role: 'teacher',  password: await hash('teacher123'), subject: 'English',     className: 'Grade 9C'  },
    { email: 'owen.brooks@nuvision.edu',    name: 'Owen Brooks',        role: 'teacher',  password: await hash('teacher123'), subject: 'History',     className: 'Grade 12A' },
    { email: 'ava.johnson@nuvision.edu',    name: 'Ava Johnson',        role: 'student',  password: await hash('student123'), studentId: 'STU-1001',  className: 'Grade 10A' },
    { email: 'liam.carter@nuvision.edu',    name: 'Liam Carter',        role: 'student',  password: await hash('student123'), studentId: 'STU-1002',  className: 'Grade 11B' },
    { email: 'sophia.martinez@nuvision.edu',name: 'Sophia Martinez',    role: 'student',  password: await hash('student123'), studentId: 'STU-1003',  className: 'Grade 9C'  },
    { email: 'ethan.nguyen@nuvision.edu',   name: 'Ethan Nguyen',       role: 'student',  password: await hash('student123'), studentId: 'STU-1004',  className: 'Grade 10A' },
    { email: 'isabella.brown@nuvision.edu', name: 'Isabella Brown',     role: 'student',  password: await hash('student123'), studentId: 'STU-1005',  className: 'Grade 12A' },
    { email: 'mia.johnson@nuvision.edu',    name: 'Mia Johnson',        role: 'parent',   password: await hash('parent123'),  studentId: 'STU-1001',  className: 'Grade 10A' },
    { email: 'noah.carter@nuvision.edu',    name: 'Noah Carter',        role: 'parent',   password: await hash('parent123'),  studentId: 'STU-1002',  className: 'Grade 11B' },
    { email: 'elena.martinez@nuvision.edu', name: 'Elena Martinez',     role: 'parent',   password: await hash('parent123'),  studentId: 'STU-1003',  className: 'Grade 9C'  },
    { email: 'linh.nguyen@nuvision.edu',    name: 'Linh Nguyen',        role: 'parent',   password: await hash('parent123'),  studentId: 'STU-1004',  className: 'Grade 10A' },
    { email: 'henry.brown@nuvision.edu',    name: 'Henry Brown',        role: 'parent',   password: await hash('parent123'),  studentId: 'STU-1005',  className: 'Grade 12A' },
  ];
  for (const u of users) await prisma.user.upsert({ where: { email: u.email }, update: u, create: u });

  // ── Attendance ──
  const attendance = [
    { id: 'ATT-1', date: '2026-06-25', studentId: 'STU-1001', studentName: 'Ava Johnson',      className: 'Grade 10A', status: 'Present' },
    { id: 'ATT-2', date: '2026-06-25', studentId: 'STU-1002', studentName: 'Liam Carter',      className: 'Grade 11B', status: 'Absent'  },
    { id: 'ATT-3', date: '2026-06-25', studentId: 'STU-1003', studentName: 'Sophia Martinez',  className: 'Grade 9C',  status: 'Present' },
    { id: 'ATT-4', date: '2026-06-25', studentId: 'STU-1004', studentName: 'Ethan Nguyen',     className: 'Grade 10A', status: 'Present' },
  ];
  for (const a of attendance) await prisma.attendance.upsert({ where: { id: a.id }, update: a, create: a });

  // ── Results ──
  const results = [
    { id: 'RES-1-1', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'Mathematics', marks: 92, gpa: 3.8 },
    { id: 'RES-1-2', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'Physics',     marks: 88, gpa: 3.5 },
    { id: 'RES-1-3', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', subject: 'English',     marks: 95, gpa: 4.0 },
    { id: 'RES-2-1', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'Physics',     marks: 84, gpa: 3.3 },
    { id: 'RES-2-2', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', subject: 'Chemistry',   marks: 76, gpa: 2.9 },
    { id: 'RES-3-1', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'English',     marks: 96, gpa: 4.0 },
    { id: 'RES-3-2', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  subject: 'Biology',     marks: 89, gpa: 3.6 },
    { id: 'RES-4-1', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', subject: 'Mathematics', marks: 77, gpa: 3.0 },
    { id: 'RES-5-1', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Calculus',    marks: 94, gpa: 3.9 },
    { id: 'RES-5-2', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', subject: 'Economics',   marks: 88, gpa: 3.5 },
  ];
  for (const r of results) await prisma.result.upsert({ where: { id: r.id }, update: r, create: r });

  // ── Fees ──
  const fees = [
    { id: 'FEE-1', studentId: 'STU-1001', studentName: 'Ava Johnson',     className: 'Grade 10A', parentName: 'Mia Johnson',    parentPhone: '+1 555 0142', amount: 2400, paid: 1800, dueDate: '2026-07-15' },
    { id: 'FEE-2', studentId: 'STU-1002', studentName: 'Liam Carter',     className: 'Grade 11B', parentName: 'Noah Carter',    parentPhone: '+1 555 0188', amount: 2600, paid: 2600, dueDate: '2026-07-15' },
    { id: 'FEE-3', studentId: 'STU-1003', studentName: 'Sophia Martinez', className: 'Grade 9C',  parentName: 'Elena Martinez', parentPhone: '+1 555 0190', amount: 2200, paid: 1200, dueDate: '2026-07-20' },
    { id: 'FEE-4', studentId: 'STU-1004', studentName: 'Ethan Nguyen',    className: 'Grade 10A', parentName: 'Linh Nguyen',    parentPhone: '+1 555 0155', amount: 2400, paid:  800, dueDate: '2026-07-15' },
    { id: 'FEE-5', studentId: 'STU-1005', studentName: 'Isabella Brown',  className: 'Grade 12A', parentName: 'Henry Brown',    parentPhone: '+1 555 0120', amount: 2800, paid:    0, dueDate: '2026-07-20' },
  ];
  for (const f of fees) await prisma.fee.upsert({ where: { id: f.id }, update: f, create: f });

  console.log('✅ Database seeded successfully!\n');
  console.log('Credentials:');
  console.log('  Admin:    admin@nuvision.edu / admin123');
  console.log('  Academic: grace.kimani@nuvision.edu / academic123');
  console.log('  Finance:  samuel.osei@nuvision.edu / finance123');
  console.log('  Teacher:  nora.ellis@nuvision.edu / teacher123');
  console.log('  Student:  ava.johnson@nuvision.edu / student123');
  console.log('  Parent:   mia.johnson@nuvision.edu / parent123\n');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
