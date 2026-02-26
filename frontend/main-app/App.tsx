import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UniversalAuthPage } from './pages/UniversalAuthPage';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AnalyticsDashboard } from './admin/pages/AnalyticsDashboard';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './components/HomePage';
import { SubscribePage } from './components/SubscribePage';
import { PatientPlansPage } from './components/PatientPlansPage';
import { TherapistPlansPage } from './components/TherapistPlansPage';
import { CorporatePlansPage } from './components/CorporatePlansPage';
import { GuruPlansPage } from './components/GuruPlansPage';
import { CrisisPage } from './components/CrisisPage';
import { SoundTherapyLanding } from './components/SoundTherapyLanding';
import { ARThemedRoomLanding } from './components/ARThemedRoomLanding';
import { SoundPricingPage } from './components/SoundPricingPage';
import { SoundCategoryPage } from './components/SoundCategoryPage';
import { ARPlansPage } from './components/ARPlansPage';
import { ARThemePlayer } from './components/ARThemePlayer';
import { ARRealRoomPlayer } from './components/ARRealRoomplayer';
import { FreeToolsPage } from './components/FreeToolsPage';
import { BillingHistoryPage } from './components/BillingHistoryPage';
import { CancellationRefundPolicy } from './components/CancellationRefundPolicy';
import { ProfileSetup } from './components/ProfileSetup';

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

const LegacyHashBridge: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const supportedLanguages = new Set(['en', 'hi', 'ta', 'te', 'kn']);

    const syncHashToRoute = () => {
      const hash = window.location.hash || '';
      if (!hash.startsWith('#/')) return;

      const raw = hash.slice(2);
      const [pathPartRaw, queryRaw = ''] = raw.split('?');
      const parts = pathPartRaw.split('/').filter(Boolean);

      if (parts.length > 0 && supportedLanguages.has(parts[0])) {
        parts.shift();
      }

      const pathname = `/${parts.join('/')}`.replace(/\/+/g, '/');
      const safePathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
      const search = queryRaw ? `?${queryRaw}` : '';
      const target = `${safePathname}${search}`;
      const current = `${location.pathname}${location.search}`;

      if (target !== current) {
        navigate(target, { replace: true });
      }
    };

    syncHashToRoute();
    window.addEventListener('hashchange', syncHashToRoute);
    return () => {
      window.removeEventListener('hashchange', syncHashToRoute);
    };
  }, [navigate, location.pathname, location.search]);

  return null;
};

const SoundCategoryRoute: React.FC = () => {
  const { category = 'beach' } = useParams<{ category: string }>();
  return <SoundCategoryPage category={category} />;
};

const ARThemePlayerRoute: React.FC = () => {
  const { themeId = 'boat-ocean' } = useParams<{ themeId: string }>();
  return <ARThemePlayer themeId={themeId} />;
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
      <LegacyHashBridge />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/free-tools" element={<FreeToolsPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/subscribe/patients" element={<PatientPlansPage />} />
        <Route path="/subscribe/therapists" element={<TherapistPlansPage />} />
        <Route path="/subscribe/corporate" element={<CorporatePlansPage />} />
        <Route path="/subscribe/guru" element={<GuruPlansPage />} />
        <Route path="/billing" element={<BillingHistoryPage context="general" />} />
        <Route path="/sound-therapy/plans" element={<SoundPricingPage />} />
        <Route path="/sound-therapy/billing" element={<BillingHistoryPage context="sound" />} />
        <Route path="/sound-therapy/:category" element={<SoundCategoryRoute />} />
        <Route path="/crisis" element={<CrisisPage />} />
        <Route path="/sound-therapy" element={<SoundTherapyLanding />} />
        <Route path="/ar-themed-room" element={<ARThemedRoomLanding />} />
        <Route path="/ar-themed-room/plans" element={<ARPlansPage />} />
        <Route path="/ar-themed-room/billing" element={<BillingHistoryPage context="ar" />} />
        <Route path="/ar-themed-room/real-ar" element={<ARRealRoomPlayer />} />
        <Route path="/ar-themed-room/player/:themeId" element={<ARThemePlayerRoute />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/onboarding/name" element={<ProfileSetup />} />
        <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
        <Route path="/wellness-subscription" element={<Navigate to="/subscribe" replace />} />

        <Route path="/assessment" element={<Navigate to="/home" replace />} />
        <Route path="/group-sessions" element={<Navigate to="/home" replace />} />
        <Route path="/meera-chat" element={<Navigate to="/home" replace />} />
        <Route path="/streaks" element={<Navigate to="/home" replace />} />
        <Route path="/digital-pet" element={<Navigate to="/home" replace />} />
        <Route path="/corporate-wellness" element={<Navigate to="/subscribe/corporate" replace />} />
        <Route path="/school-wellness" element={<Navigate to="/subscribe/corporate" replace />} />
        <Route path="/certification-platform" element={<Navigate to="/home" replace />} />

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
