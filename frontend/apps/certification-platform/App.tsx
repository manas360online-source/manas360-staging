import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CardSkeleton } from './components/Skeleton';

// Lazy load pages for performance
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const CertificationDetailsPage = React.lazy(() => import('./pages/CertificationDetailsPage').then(module => ({ default: module.CertificationDetailsPage })));
const LeadBoostDashboard = React.lazy(() => import('./pages/LeadBoostDashboard').then(module => ({ default: module.LeadBoostDashboard })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const PaymentSuccessPage = React.lazy(() => import('./pages/PaymentSuccessPage').then(module => ({ default: module.PaymentSuccessPage })));
const PaymentFailedPage = React.lazy(() => import('./pages/PaymentFailedPage').then(module => ({ default: module.PaymentFailedPage })));
const MyCertificationsPage = React.lazy(() => import('./pages/MyCertificationsPage').then(module => ({ default: module.MyCertificationsPage })));

const LoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-3 gap-8">
     <CardSkeleton />
     <CardSkeleton />
     <CardSkeleton />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
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