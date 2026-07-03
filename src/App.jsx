import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { CandidateLayout } from './layouts/CandidateLayout';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCandidates } from './pages/AdminCandidates';
import { AdminTests } from './pages/AdminTests';
import { AdminQuestions } from './pages/AdminQuestions';
import { AdminResults } from './pages/AdminResults';
import { AdminSettings } from './pages/AdminSettings';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { CandidateTests } from './pages/CandidateTests';
import { CandidateResults } from './pages/CandidateResults';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/candidate" replace />;
  }

  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/candidate'} replace /> : <LoginPage />
      } />

      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="candidates" element={<AdminCandidates />} />
        <Route path="tests" element={<AdminTests />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/candidate" element={
        <ProtectedRoute>
          <CandidateLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CandidateDashboard />} />
        <Route path="tests" element={<CandidateTests />} />
        <Route path="results" element={<CandidateResults />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-900 dark:text-white dark:border-gray-700',
              duration: 3000,
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
