import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import {
  attendanceSeed,
  classesSeed,
  eventsSeed,
  feesSeed,
  resultsSeed,
  studentsSeed,
  teachersSeed,
} from '../services/mockData';
import { requiredItemsSeed, generateClearanceNumber, generateQrToken, mockAiVerify } from '../services/clearanceUtils';
import {
  AttendanceRecord,
  ClearanceItemRecord,
  FeeRecord,
  PaymentMethod,
  PaymentRecord,
  RequiredItemTemplate,
  ResultRecord,
  SchoolClass,
  SchoolEvent,
  Student,
  StudentClearanceRecord,
  Teacher,
  ToastMessage,
} from '../types';

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
  clearances: StudentClearanceRecord[];
  requiredItems: RequiredItemTemplate[];
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
  getOrCreateClearance: (studentId: string, parentId?: string) => StudentClearanceRecord;
  updateClearanceItemQty: (clearanceId: string, itemId: string, quantity: number) => void;
  uploadClearancePhoto: (clearanceId: string, itemId: string, photoDataUrl: string, verificationCode: string) => ReturnType<typeof mockAiVerify>;
  submitClearance: (clearanceId: string) => boolean;
  approveClearance: (clearanceId: string) => void;
  rejectClearance: (clearanceId: string, reason: string) => void;
  requestClearancePhoto: (clearanceId: string) => void;
  addRequiredItem: (item: Omit<RequiredItemTemplate, 'id'>) => void;
  removeRequiredItem: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function buildItemsFromTemplate(templates: RequiredItemTemplate[]): ClearanceItemRecord[] {
  return templates.map((t) => ({
    id: `CI-${t.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    itemName: t.name,
    requiredQuantity: t.quantity,
    completedQuantity: 0,
    photoVerified: false,
  }));
}

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
  const [clearances, setClearances] = useState<StudentClearanceRecord[]>([]);
  const [requiredItems, setRequiredItems] = useState<RequiredItemTemplate[]>(requiredItemsSeed);
  const [clearanceSeq, setClearanceSeq] = useState(1);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    setToasts((current) => [...current, { ...toast, id: Date.now() }]);
  }, []);

  const getOrCreateClearance = useCallback((studentId: string, parentId?: string): StudentClearanceRecord => {
    const existing = clearances.find((c) => c.studentId === studentId && c.term === 'Term 1 - 2026');
    if (existing) return existing;

    const student = students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const newClearance: StudentClearanceRecord = {
      id: `CLR-${Date.now()}`,
      clearanceNumber: generateClearanceNumber(clearanceSeq),
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      className: student.className,
      parentId,
      status: 'PENDING',
      term: 'Term 1 - 2026',
      admissionDate: '2026-09-01',
      items: buildItemsFromTemplate(requiredItems),
    };
    setClearanceSeq((n) => n + 1);
    setClearances((prev) => [...prev, newClearance]);
    return newClearance;
  }, [clearances, clearanceSeq, requiredItems, students]);

  const updateClearance = useCallback((id: string, updater: (c: StudentClearanceRecord) => StudentClearanceRecord) => {
    setClearances((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }, []);

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
      clearances,
      requiredItems,
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
      addToast,
      dismissToast: (id) => setToasts((current) => current.filter((toast) => toast.id !== id)),
      getOrCreateClearance,
      updateClearanceItemQty: (clearanceId, itemId, quantity) => {
        updateClearance(clearanceId, (c) => ({
          ...c,
          items: c.items.map((item) =>
            item.id === itemId ? { ...item, completedQuantity: Math.max(0, quantity) } : item,
          ),
        }));
      },
      uploadClearancePhoto: (clearanceId, itemId, photoDataUrl, verificationCode) => {
        const ai = mockAiVerify();
        updateClearance(clearanceId, (c) => ({
          ...c,
          items: c.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  photoDataUrl,
                  verificationCode,
                  photoVerified: ai.approved,
                  aiConfidence: ai.confidence,
                }
              : item,
          ),
        }));
        return ai;
      },
      submitClearance: (clearanceId) => {
        let success = false;
        setClearances((prev) => {
          const c = prev.find((x) => x.id === clearanceId);
          if (!c) return prev;
          const incomplete = c.items.some((i) => i.completedQuantity < i.requiredQuantity);
          if (incomplete) return prev;
          success = true;
          return prev.map((clr) =>
            clr.id === clearanceId
              ? { ...clr, status: 'SUBMITTED' as const, submittedAt: new Date().toISOString() }
              : clr,
          );
        });
        return success;
      },
      approveClearance: (clearanceId) => {
        const inspection = Math.random() < 0.05;
        updateClearance(clearanceId, (c) => ({
          ...c,
          status: 'APPROVED',
          randomInspection: inspection,
          qrToken: generateQrToken(),
        }));
      },
      rejectClearance: (clearanceId, reason) => {
        updateClearance(clearanceId, (c) => ({ ...c, status: 'REJECTED', rejectionReason: reason }));
      },
      requestClearancePhoto: (clearanceId) => {
        updateClearance(clearanceId, (c) => ({ ...c, status: 'PHOTO_REQUESTED' }));
      },
      addRequiredItem: (item) => {
        setRequiredItems((prev) => [...prev, { ...item, id: `RI-${Date.now()}` }]);
      },
      removeRequiredItem: (id) => setRequiredItems((prev) => prev.filter((i) => i.id !== id)),
    }),
    [attendance, classes, clearances, events, fees, getOrCreateClearance, payments, requiredItems, results, students, teachers, toasts, addToast, updateClearance],
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
