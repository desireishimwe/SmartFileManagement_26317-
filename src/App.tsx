import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { FilesPage } from './pages/FilesPage';
import { FileDetailPage } from './pages/FileDetailPage';
import { FoldersPage } from './pages/FoldersPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { LocationsPage } from './pages/LocationsPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PublicDownloadPage } from './pages/PublicDownloadPage';
import { ROUTES } from './utils/constants';
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path="/share/:token" element={<PublicDownloadPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                      <Route path={ROUTES.FILES} element={<FilesPage />} />
                      <Route path={ROUTES.FILE_DETAIL} element={<FileDetailPage />} />
                      <Route path={ROUTES.FOLDERS} element={<FoldersPage />} />
                      <Route path="/folders/:id" element={<FoldersPage />} />
                      <Route
                        path={ROUTES.USERS}
                        element={
                          <ProtectedRoute requiredRole="ADMIN">
                            <UsersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.LOCATIONS}
                        element={
                          <ProtectedRoute requiredRole="ADMIN">
                            <LocationsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.REPORTS}
                        element={
                          <ProtectedRoute requiredRole="ADMIN">
                            <ReportsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path={ROUTES.MY_PROFILE} element={<MyProfilePage />} />
                      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

