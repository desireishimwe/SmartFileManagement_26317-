import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  attendanceSeed,
  classesSeed,
  eventsSeed,
  feesSeed,
  resultsSeed,
  studentsSeed,
  teachersSeed,
} from '../services/mockData';
import { AttendanceRecord, FeeRecord, PaymentMethod, PaymentRecord, ResultRecord, SchoolClass, SchoolEvent, Student, Teacher, ToastMessage } from '../types';

interface AppContextValue {
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  attendance: AttendanceRecord[];
  results: ResultRecord[];
  fees: FeeRecord[];
  payments: PaymentRecord[];
  events: SchoolEvent[];
  toasts: ToastMessage[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  saveAttendance: (records: AttendanceRecord[]) => void;
  addResult: (result: ResultRecord) => void;
  updateResult: (result: ResultRecord) => void;
  recordPayment: (feeId: string, amount: number, method: PaymentMethod, paidBy: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState(studentsSeed);
  const [teachers, setTeachers] = useState(teachersSeed);
  const [classes] = useState(classesSeed);
  const [attendance, setAttendance] = useState(attendanceSeed);
  const [results, setResults] = useState(resultsSeed);
  const [fees, setFees] = useState(feesSeed);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [events] = useState(eventsSeed);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const value = useMemo<AppContextValue>(
    () => ({
      students,
      teachers,
      classes,
      attendance,
      results,
      fees,
      payments,
      events,
      toasts,
      addStudent: (student) => setStudents((current) => [student, ...current]),
      updateStudent: (student) => setStudents((current) => current.map((item) => (item.id === student.id ? student : item))),
      deleteStudent: (id) => setStudents((current) => current.filter((student) => student.id !== id)),
      addTeacher: (teacher) => setTeachers((current) => [teacher, ...current]),
      updateTeacher: (teacher) => setTeachers((current) => current.map((item) => (item.id === teacher.id ? teacher : item))),
      deleteTeacher: (id) => setTeachers((current) => current.filter((teacher) => teacher.id !== id)),
      saveAttendance: (records) => setAttendance((current) => {
        const updated = [...current];
        records.forEach((record) => {
          const idx = updated.findIndex((a) => a.studentId === record.studentId && a.date === record.date);
          if (idx >= 0) updated[idx] = record;
          else updated.push(record);
        });
        return updated;
      }),
      addResult: (result) => setResults((current) => [result, ...current]),
      updateResult: (result) => setResults((current) => current.map((item) => (item.id === result.id ? result : item))),
      recordPayment: (feeId, amount, method, paidBy) => {
        setFees((current) =>
          current.map((f) => f.id === feeId ? { ...f, paid: Math.min(f.paid + amount, f.amount) } : f)
        );
        setPayments((current) => [
          {
            id: `PAY-${Date.now()}`,
            feeId,
            studentName: fees.find((f) => f.id === feeId)?.studentName ?? '',
            amount,
            method,
            paidBy,
            date: new Date().toISOString().slice(0, 10),
          },
          ...current,
        ]);
      },
      addToast: (toast) => setToasts((current) => [...current, { ...toast, id: Date.now() }]),
      dismissToast: (id) => setToasts((current) => current.filter((toast) => toast.id !== id)),
    }),
    [attendance, classes, events, fees, payments, results, students, teachers, toasts],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
