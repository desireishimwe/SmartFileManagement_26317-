import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/Login/LoginPage';
import { ForgotPasswordPage } from './pages/Login/ForgotPasswordPage';
import { SignupPage } from './pages/Login/SignupPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { StudentsPage } from './pages/Students/StudentsPage';
import { TeachersPage } from './pages/Teachers/TeachersPage';
import { ClassesPage } from './pages/Classes/ClassesPage';
import { AttendancePage } from './pages/Attendance/AttendancePage';
import { ResultsPage } from './pages/Results/ResultsPage';
import { FeesPage } from './pages/Fees/FeesPage';
import { TimetablePage } from './pages/Timetable/TimetablePage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { TeacherDashboardPage } from './pages/Teacher/TeacherDashboardPage';
import { StudentDashboardPage } from './pages/Student/StudentDashboardPage';
import { AcademicDashboardPage } from './pages/Academic/AcademicDashboardPage';
import { FinanceDashboardPage } from './pages/Finance/FinanceDashboardPage';
import { ParentDashboardPage } from './pages/Parent/ParentDashboardPage';
import { ParentFeesPage } from './pages/Parent/ParentFeesPage';
import { ParentReportPage } from './pages/Parent/ParentReportPage';
import { StudentEventsPage } from './pages/Student/StudentEventsPage';
import { StudentReportCardPage } from './pages/Student/StudentReportCardPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

const roleDashboard: Record<string, string> = {
  admin:    '/dashboard',
  academic: '/academic/dashboard',
  finance:  '/finance/dashboard',
  teacher:  '/teacher/dashboard',
  student:  '/student/dashboard',
  parent:   '/parent/dashboard',
};

function RequireRole({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={roleDashboard[user.role] ?? '/'} replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin routes */}
            <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route path="dashboard"  element={<RequireRole roles={['admin']}><DashboardPage /></RequireRole>} />
              <Route path="students"   element={<RequireRole roles={['admin', 'academic']}><StudentsPage /></RequireRole>} />
              <Route path="teachers"   element={<RequireRole roles={['admin']}><TeachersPage /></RequireRole>} />
              <Route path="classes"    element={<RequireRole roles={['admin']}><ClassesPage /></RequireRole>} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="results"    element={<ResultsPage />} />
              <Route path="fees"       element={<RequireRole roles={['admin']}><FeesPage /></RequireRole>} />
              <Route path="timetable"  element={<TimetablePage />} />
              <Route path="reports"    element={<RequireRole roles={['admin']}><ReportsPage /></RequireRole>} />
              <Route path="teacher/dashboard"  element={<TeacherDashboardPage />} />
              <Route path="student/dashboard"   element={<StudentDashboardPage />} />
              <Route path="academic/dashboard"  element={<AcademicDashboardPage />} />
              <Route path="finance/dashboard"   element={<FinanceDashboardPage />} />
              <Route path="parent/dashboard"   element={<ParentDashboardPage />} />
              <Route path="parent/fees"        element={<ParentFeesPage />} />
              <Route path="parent/report"      element={<ParentReportPage />} />
              <Route path="student/events"       element={<StudentEventsPage />} />
              <Route path="student/report-card" element={<StudentReportCardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
