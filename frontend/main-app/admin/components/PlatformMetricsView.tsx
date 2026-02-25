import React from 'react';
import { PlatformMetrics } from '../services/analyticsApi';
import { MetricCard } from './MetricCard';

interface PlatformMetricsViewProps {
    metrics: PlatformMetrics;
}

const DEFAULT_METRICS: PlatformMetrics = {
    users: { total: 1250, patients: 1180, therapists: 70, verifiedTherapists: 45 },
    sessions: { total: 4850, completed: 4200, completionRate: '86.6' },
    subscriptions: { active: 320, revenue: 12500.50 }
};

export const PlatformMetricsView: React.FC<PlatformMetricsViewProps> = ({ metrics }) => {
    const data = metrics || DEFAULT_METRICS;
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-calm-blue">Platform Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Users"
                    value={data.users.total}
                    icon={<UsersIcon />}
                    color="blue"
                />
                <MetricCard
                    title="Verified Therapists"
                    value={`${data.users.verifiedTherapists}/${data.users.therapists}`}
                    icon={<VerifyIcon />}
                    color="green"
                />
                <MetricCard
                    title="Total Sessions"
                    value={data.sessions.total}
                    icon={<SessionIcon />}
                    color="purple"
                />
                <MetricCard
                    title="Active Subscriptions"
                    value={data.subscriptions.active}
                    icon={<SubscriptionIcon />}
                    color="yellow"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold text-calm-text">${data.subscriptions.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-2 font-medium">↑ 12% from last month</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Session Completion Rate</h3>
                    <p className="text-2xl font-bold text-calm-text">{data.sessions.completionRate}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div className="bg-calm-blue h-2 rounded-full" style={{ width: `${data.sessions.completionRate}%` }}></div>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Patient Growth</h3>
                    <p className="text-2xl font-bold text-calm-text">{data.users.patients}</p>
                    <p className="text-xs text-calm-blue mt-2 font-medium">Active patients on platform</p>
                </div>
            </div>
        </div>
    );
};

// Icons (reusing or defining new ones)
const UsersIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const VerifyIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-7.016m19.236 0a11.955 11.955 0 01-9.618 7.016" />
    </svg>
);

const SessionIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const SubscriptionIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
