import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/CertificationLayout';
import { CardSkeleton } from './components/CertificationSkeleton';

// Lazy load pages for performance
const LandingPage = React.lazy(() => import('./pages/CertificationLandingPage').then(module => ({ default: module.LandingPage })));
const CertificationDetailsPage = React.lazy(() => import('./pages/CertificationDetailsPage').then(module => ({ default: module.CertificationDetailsPage })));
const LeadBoostDashboard = React.lazy(() => import('./pages/CertificationLeadBoostDashboard').then(module => ({ default: module.LeadBoostDashboard })));
const AdminDashboard = React.lazy(() => import('./pages/CertificationAdminDashboard').then(module => ({ default: module.AdminDashboard })));
const CheckoutPage = React.lazy(() => import('./pages/CertificationCheckoutPage').then(module => ({ default: module.CheckoutPage })));
const PaymentSuccessPage = React.lazy(() => import('./pages/CertificationPaymentSuccessPage').then(module => ({ default: module.PaymentSuccessPage })));
const PaymentFailedPage = React.lazy(() => import('./pages/CertificationPaymentFailedPage').then(module => ({ default: module.PaymentFailedPage })));
const MyCertificationsPage = React.lazy(() => import('./pages/CertificationMyCertificationsPage').then(module => ({ default: module.MyCertificationsPage })));

const LoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-3 gap-8">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

interface AppProps {
  basePath?: string;
}

const App: React.FC<AppProps> = ({ basePath = '/' }) => {
  return (
    <Router basename={basePath}>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cert/:slug" element={<CertificationDetailsPage />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/my-certifications" element={<MyCertificationsPage />} />
            <Route path="/dashboard" element={<LeadBoostDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;