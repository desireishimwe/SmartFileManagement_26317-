import { createContext, ReactNode, useContext, useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { teachersSeed, classesSeed, studentsSeed } from '../services/mockData';

const ADMIN: AuthUser = {
  id: 'ADM-001',
  name: 'Admin Office',
  email: 'admin@nuvision.edu',
  role: 'admin',
};

const ACADEMIC_HEAD: AuthUser = {
  id: 'ACD-001',
  name: 'Dr. Grace Kimani',
  email: 'grace.kimani@nuvision.edu',
  role: 'academic',
};

const FINANCE_OFFICER: AuthUser = {
  id: 'FIN-001',
  name: 'Mr. Samuel Osei',
  email: 'samuel.osei@nuvision.edu',
  role: 'finance',
};

const ADMIN_PASSWORD    = 'admin123';
const ACADEMIC_PASSWORD = 'academic123';
const FINANCE_PASSWORD  = 'finance123';
const PARENT_PASSWORD   = 'parent123';

const PARENTS: { id: string; name: string; email: string; studentId: string }[] = [
  { id: 'PAR-001', name: 'Mia Johnson',   email: 'mia.johnson@nuvision.edu',   studentId: 'STU-1001' },
  { id: 'PAR-002', name: 'Noah Carter',   email: 'noah.carter@nuvision.edu',   studentId: 'STU-1002' },
  { id: 'PAR-003', name: 'Elena Martinez',email: 'elena.martinez@nuvision.edu',studentId: 'STU-1003' },
  { id: 'PAR-004', name: 'Linh Nguyen',   email: 'linh.nguyen@nuvision.edu',   studentId: 'STU-1004' },
  { id: 'PAR-005', name: 'Henry Brown',   email: 'henry.brown@nuvision.edu',   studentId: 'STU-1005' },
];
const TEACHER_PASSWORD  = 'teacher123';
const STUDENT_PASSWORD  = 'student123';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; role?: UserRole; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  function login(email: string, password: string): { ok: boolean; role?: UserRole; error?: string } {
    const normalised = email.trim().toLowerCase();

    if (normalised === ADMIN.email && password === ADMIN_PASSWORD) {
      setUser(ADMIN);
      return { ok: true, role: 'admin' };
    }

    if (normalised === ACADEMIC_HEAD.email && password === ACADEMIC_PASSWORD) {
      setUser(ACADEMIC_HEAD);
      return { ok: true, role: 'academic' };
    }

    if (normalised === FINANCE_OFFICER.email && password === FINANCE_PASSWORD) {
      setUser(FINANCE_OFFICER);
      return { ok: true, role: 'finance' };
    }

    const teacher = teachersSeed.find((t) => t.email.toLowerCase() === normalised);
    if (teacher) {
      if (password !== TEACHER_PASSWORD) {
        return { ok: false, error: 'Incorrect password.' };
      }
      const assignedClass = classesSeed.find((c) => c.classTeacher === teacher.fullName);
      setUser({
        id: teacher.id,
        name: teacher.fullName,
        email: teacher.email,
        role: 'teacher',
        subject: teacher.subject,
        className: assignedClass?.name,
      });
      return { ok: true, role: 'teacher' };
    }

    const parent = PARENTS.find((p) => p.email.toLowerCase() === normalised);
    if (parent) {
      if (password !== PARENT_PASSWORD) {
        return { ok: false, error: 'Incorrect password.' };
      }
      const child = studentsSeed.find((s) => s.id === parent.studentId);
      setUser({
        id: parent.id,
        name: parent.name,
        email: parent.email,
        role: 'parent',
        studentId: parent.studentId,
        className: child?.className,
      });
      return { ok: true, role: 'parent' };
    }

    const student = studentsSeed.find((s) => s.email.toLowerCase() === normalised);
    if (student) {
      if (password !== STUDENT_PASSWORD) {
        return { ok: false, error: 'Incorrect password.' };
      }
      setUser({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        role: 'student',
        className: student.className,
      });
      return { ok: true, role: 'student' };
    }

    return { ok: false, error: 'No account found for that email.' };
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
