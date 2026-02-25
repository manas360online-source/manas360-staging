// ================================================
// MANAS360 Session Analytics - Analytics Dashboard
// Story 3.6: Session Analytics
// Main dashboard page with all analytics components
// ================================================

import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { MetricCard } from '../components/MetricCard';
import { SessionTrendsChart, CompletionRateTrendChart } from '../components/SessionTrendsChart';
import { OutcomeBarChart, ImprovementRateChart } from '../components/OutcomeChart';
import { TherapistPerformanceTable, TherapistComparisonChart } from '../components/TherapistPerformance';
import { ExportButtons, DateRangePicker } from '../components/ExportButtons';
import Sidebar from '../components/Sidebar';

import '../styles/admin-theme.css';

import { TherapistOnboardingModal } from '../components/TherapistOnboardingModal';
import { ClinicalSessionJournal } from '../components/ClinicalSessionJournal';
import { useAdmin } from '../hooks/useAdmin';
import { PlatformMetricsView } from '../components/PlatformMetricsView';
import { UserManagement } from '../components/UserManagement';
import { SubscriptionManagement } from '../components/SubscriptionManagement';
import { UserBehaviorView } from '../components/UserBehaviorView';
import { useEffect } from 'react';
import { eventTracker, AnalyticsEvents } from '../services/eventTracker';
import analyticsApi from '../services/analyticsApi';

// Icons
const SessionIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UsersIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const TrendUpIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const StarIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const HeartIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

export const AnalyticsDashboard: React.FC = () => {
    const {
        overview,
        sessions,
        outcomes,
        therapists,
        trends,
        loading,
        error,
        dateRange,
        setDateRange,
        refresh,
        exportExcel,
        exportPdf
    } = useAnalytics();

    const {
        users,
        subscriptions,
        metrics: platformMetrics,
        loading: adminLoading,
        fetchUsers,
        fetchSubscriptions,
        fetchPlatformMetrics,
        verifyTherapist
    } = useAdmin();

    const [activeSection, setActiveSection] = React.useState('dashboard');
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = React.useState(false);
    const adminUser = React.useMemo(() => analyticsApi.getCurrentAdmin(), []);

    // Track initial dashboard view
    useEffect(() => {
        eventTracker.track(AnalyticsEvents.DASHBOARD_VIEWED, {
            initialSection: 'dashboard'
        });
    }, []);

    // Track section changes
    useEffect(() => {
        eventTracker.track(AnalyticsEvents.FEATURE_USED, {
            feature: 'Navigation',
            section: activeSection
        });

        if (activeSection === 'dashboard') fetchPlatformMetrics();
        if (activeSection === 'admin_users') fetchUsers();
        if (activeSection === 'admin_subs') fetchSubscriptions();
    }, [activeSection, fetchPlatformMetrics, fetchUsers, fetchSubscriptions]);

    const handleOnboardingSubmit = (data: any) => {
        console.log('New Therapist Registered:', data);
        alert(`Therapist ${data.fullName} registered successfully!`);
        refresh();
    };

    const handleSignOut = () => {
        analyticsApi.clearToken();
        const language = window.location.hash.split('/')[1] || 'en';
        window.location.hash = `#/${language}/landing`;
    };

    const handleGoToAdminLogin = () => {
        analyticsApi.clearToken();
        const language = window.location.hash.split('/')[1] || 'en';
        window.location.hash = `#/${language}/admin/login`;
    };

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-calm-bg">
                <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 text-center shadow-xl border border-calm-lightBlue/20">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                        <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-calm-text">Unable to Load Analytics</h2>
                    <p className="mb-6 text-calm-text/70 max-w-sm mx-auto">{error}</p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={refresh}
                            className="rounded-xl bg-calm-blue px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md"
                        >
                            Try Again
                        </button>
                        {error.toLowerCase().includes('authentication') && (
                            <button
                                onClick={handleGoToAdminLogin}
                                className="rounded-xl border border-calm-blue/30 bg-white px-6 py-2.5 text-sm font-medium text-calm-blue shadow-sm hover:bg-calm-lavender/20 transition-all"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans admin-theme-wrapper" style={{ backgroundColor: 'var(--calm-bg)' }}>
            <Sidebar
                activeSection={activeSection}
                onNavigate={setActiveSection}
                adminUser={{ name: adminUser?.name, email: adminUser?.email }}
                onSignOut={handleSignOut}
            />
            <div className="sm:ml-64 transition-all min-h-screen flex flex-col">
                {/* Header */}
                <header className="border-b border-calm-lightBlue/20 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="mb-3 flex items-center gap-2 text-sm font-medium text-calm-text/60 hover:text-calm-blue transition-colors group"
                                >
                                    <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Home
                                </button>
                                <h1 className="text-3xl font-bold text-calm-blue tracking-tight">Session Analytics</h1>
                                <p className="mt-1 text-base text-calm-text/80">
                                    {activeSection === 'dashboard' && 'Dashboard Overview'}
                                    {activeSection === 'outcomes' && 'Treatment Outcomes'}
                                    {activeSection === 'therapists' && 'Therapist Performance'}
                                    {activeSection === 'sessions' && 'Session Analysis'}
                                    {activeSection === 'journal' && 'Clinical Session Journals'}
                                    {activeSection === 'admin_users' && 'User Management'}
                                    {activeSection === 'admin_subs' && 'Subscription Plans'}
                                    {activeSection === 'user_behavior' && 'User Behavior Analytics'}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <DateRangePicker
                                    startDate={dateRange.startDate}
                                    endDate={dateRange.endDate}
                                    onChange={setDateRange}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={refresh}
                                        disabled={loading}
                                        className="flex items-center gap-2 rounded-xl border border-calm-lightBlue/30 bg-white px-4 py-2 text-sm font-medium text-calm-blue shadow-sm hover:bg-calm-lavender/30 transition-colors disabled:opacity-50"
                                    >
                                        <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </button>
                                    <ExportButtons
                                        onExportExcel={exportExcel}
                                        onExportPdf={exportPdf}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
                    {loading ? (
                        <div className="flex h-96 items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-calm-lightBlue/30 border-t-calm-blue"></div>
                                <p className="text-calm-text/60 font-medium">Loading insights...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Dashboard Overview - Shows summary of everything */}
                            {activeSection === 'dashboard' && (
                                <section>
                                    <h2 className="mb-4 text-lg font-semibold text-calm-blue">Overview</h2>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
                                        <MetricCard title="Total Sessions" value={overview?.totalSessions || 0} icon={<SessionIcon />} color="blue" />
                                        <MetricCard title="Completion Rate" value={`${overview?.completionRate || 0}%`} icon={<CheckIcon />} color="green" />
                                        <MetricCard title="Unique Patients" value={overview?.uniquePatients || 0} icon={<UsersIcon />} color="purple" />
                                        <MetricCard title="Avg PHQ-9 Imp." value={overview?.avgPhq9Improvement || '0'} subtitle="points" icon={<TrendUpIcon />} color="green" />
                                        <MetricCard title="Avg Rating" value={`${overview?.avgRating || 0}/5`} icon={<StarIcon />} color="yellow" />
                                        <MetricCard title="Avg Duration" value={`${overview?.avgDuration || 0}m`} icon={<HeartIcon />} color="red" />
                                    </div>

                                    {platformMetrics && (
                                        <div className="mb-8 pt-8 border-t border-calm-lightBlue/10">
                                            <PlatformMetricsView metrics={platformMetrics} />
                                        </div>
                                    )}

                                    <div className="grid gap-6 lg:grid-cols-2">
                                        <SessionTrendsChart data={trends} />
                                        <OutcomeBarChart data={outcomes?.byAssessmentType || []} />
                                    </div>
                                </section>
                            )}

                            {/* Session Analysis */}
                            {activeSection === 'sessions' && (
                                <>
                                    <section>
                                        <h2 className="mb-4 text-lg font-semibold text-calm-blue">Session Trends</h2>
                                        <div className="grid gap-6 lg:grid-cols-2">
                                            <SessionTrendsChart data={trends} />
                                            <CompletionRateTrendChart data={trends} />
                                        </div>
                                    </section>
                                    {sessions && (
                                        <section>
                                            <h2 className="mb-4 text-lg font-semibold text-calm-blue">Sessions Breakdown</h2>
                                            <div className="grid gap-6 lg:grid-cols-2">
                                                <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                                                    <h3 className="mb-4 font-semibold text-calm-blue">By Therapy Type</h3>
                                                    <div className="space-y-3">
                                                        {sessions.byType.map(s => (
                                                            <div key={s.category} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-3 w-3 rounded-full bg-calm-blue" />
                                                                    <span className="text-sm font-medium text-calm-text/80">{s.category}</span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-sm text-gray-500">{s.total} sessions</span>
                                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{s.completionRate}%</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                                                    <h3 className="mb-4 font-semibold text-calm-blue">By Session Mode</h3>
                                                    <div className="space-y-3">
                                                        {sessions.byMode.map(s => (
                                                            <div key={s.category} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-3 w-3 rounded-full bg-calm-lavender" />
                                                                    <span className="text-sm font-medium text-calm-text/80 capitalize">{s.category}</span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-sm text-gray-500">{s.total} sessions</span>
                                                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">★ {s.avgRating}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </>
                            )}

                            {/* Outcomes */}
                            {activeSection === 'outcomes' && (
                                <section>
                                    <h2 className="mb-4 text-lg font-semibold text-calm-blue">Treatment Outcomes</h2>
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        <OutcomeBarChart data={outcomes?.byAssessmentType || []} />
                                        <ImprovementRateChart data={outcomes?.byAssessmentType || []} />
                                    </div>
                                </section>
                            )}

                            {/* Therapist Performance */}
                            {activeSection === 'therapists' && (
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-calm-blue">Therapist Performance</h2>
                                        <button
                                            onClick={() => setIsOnboardingModalOpen(true)}
                                            className="flex items-center gap-2 rounded-xl bg-calm-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Onboard Provider
                                        </button>
                                    </div>
                                    <div className="grid gap-6 lg:grid-cols-3">
                                        <div className="lg:col-span-2">
                                            <TherapistPerformanceTable data={therapists} />
                                        </div>
                                        <TherapistComparisonChart data={therapists} />
                                    </div>
                                </section>
                            )}

                            {/* Clinical Journal */}
                            {activeSection === 'journal' && (
                                <section>
                                    <ClinicalSessionJournal />
                                </section>
                            )}

                            {/* User Management */}
                            {activeSection === 'admin_users' && (
                                <section>
                                    <UserManagement
                                        users={users}
                                        onVerify={verifyTherapist}
                                        loading={adminLoading}
                                    />
                                </section>
                            )}

                            {/* Subscription Management */}
                            {activeSection === 'admin_subs' && (
                                <section>
                                    <SubscriptionManagement
                                        subscriptions={subscriptions}
                                        loading={adminLoading}
                                    />
                                </section>
                            )}

                            {/* User Behavior Analytics */}
                            {activeSection === 'user_behavior' && (
                                <section>
                                    <UserBehaviorView />
                                </section>
                            )}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-calm-lightBlue/10 bg-white/50 backdrop-blur-sm py-6 text-center text-sm text-calm-text/60">
                    MANAS360 Session Analytics • Last updated: {new Date().toLocaleString()}
                </footer>
            </div>
            <TherapistOnboardingModal
                isOpen={isOnboardingModalOpen}
                onClose={() => setIsOnboardingModalOpen(false)}
                onSubmit={handleOnboardingSubmit}
            />
        </div>
    );
};

export default AnalyticsDashboard;
