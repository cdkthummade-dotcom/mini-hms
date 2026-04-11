import React, { Suspense, lazy, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MasterDataProvider } from './context/MasterDataContext';
import ServerWakeUp from './components/shared/ServerWakeUp';
import LoadingSpinner from './components/shared/LoadingSpinner';
import LoginPage from './pages/LoginPage';
import './index.css';

// Lazy-loaded pages (not in initial bundle)
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Starting..." />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'receptionist' ? '/register' : '/admin'} /> : <LoginPage />} />
      <Route path="/register" element={
        <ProtectedRoute roles={['receptionist', 'admin', 'superadmin']}>
          <Suspense fallback={<LoadingSpinner message="Loading registration form..." />}>
            <RegistrationPage />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <Suspense fallback={<LoadingSpinner message="Loading admin panel..." />}>
            <AdminPage />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const [serverReady, setServerReady] = useState(false);
  const handleReady = useCallback(() => setServerReady(true), []);

  return (
    <>
      {!serverReady && <ServerWakeUp onReady={handleReady} />}
      <AuthProvider>
        <MasterDataProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppRoutes />
          </BrowserRouter>
        </MasterDataProvider>
      </AuthProvider>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
