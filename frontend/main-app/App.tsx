import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { UniversalAuthPage } from './pages/UniversalAuthPage';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AnalyticsDashboard } from './admin/pages/AnalyticsDashboard';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

const RouteLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
    <div className="animate-pulse text-sm font-medium tracking-wide">Loading secure session...</div>
  </div>
);

const AuthRoute: React.FC = () => {
  const navigate = useNavigate();

  return (
    <UniversalAuthPage
      onSuccess={() => navigate('/dashboard', { replace: true })}
      onAdminLoginClick={() => navigate('/admin', { replace: true })}
    />
  );
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC = () => {
  const { isLoading, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <RouteLoader />;
  }

  if (isAuthenticated && role === 'admin') {
    return <AnalyticsDashboard />;
  }

  if (isAuthenticated && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLogin
      onLoginSuccess={() => navigate('/admin', { replace: true })}
    />
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthRoute />} />
        <Route
          path="/dashboard"
          element={(
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          )}
        />
        <Route
          path="/admin"
          element={<AdminRoute />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
