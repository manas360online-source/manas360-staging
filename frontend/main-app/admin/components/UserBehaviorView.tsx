import React from 'react';
import { FunnelChart } from './FunnelChart';
import { CohortAnalysis } from './CohortAnalysis';
import { MetricCard } from './MetricCard';

export const UserBehaviorView: React.FC = () => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* behavior Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Avg. Session Depth"
                    value="4.2"
                    subtitle="steps per visit"
                    icon={<DepthIcon />}
                    color="blue"
                />
                <MetricCard
                    title="W1 Retention"
                    value="42.5%"
                    subtitle="+2.1% improvement"
                    icon={<ArrowPathIcon />}
                    color="green"
                />
                <MetricCard
                    title="Churn Rate"
                    value="3.8%"
                    subtitle="Monthly average"
                    icon={<UserMinusIcon />}
                    color="red"
                />
                <MetricCard
                    title="Power User Ratio"
                    value="12.4%"
                    subtitle="&gt;5 sessions/week"
                    icon={<BoltIcon />}
                    color="yellow"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <FunnelChart />
                <div className="space-y-6">
                    <CohortAnalysis />

                    {/* A/B Testing Status */}
                    <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-calm-blue mb-4">Active A/B Tests</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-calm-lavender/20 rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-calm-blue">Onboarding Flow v2</p>
                                    <p className="text-xs text-gray-500">Target: Completion Rate</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-600">+12.4% Δ</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">98% Sig.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-calm-lavender/20 rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-calm-blue">Chat Bot Personality</p>
                                    <p className="text-xs text-gray-500">Target: Message Depth</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-yellow-600">-2.1% Δ</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">45% Sig.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Usage Intensity */}
            <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-calm-blue mb-6">Feature Adoption Intensity</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { name: 'Symptom Tracker', usage: 88, trend: '+5%', color: 'bg-blue-500' },
                        { name: 'Anytime Buddy', usage: 72, trend: '+12%', color: 'bg-indigo-500' },
                        { name: 'Sound Therapy', usage: 45, trend: '-2%', color: 'bg-purple-500' },
                        { name: 'Export Journal', usage: 28, trend: '+8%', color: 'bg-lavender-500' },
                    ].map((feature, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">{feature.name}</span>
                                <span className="text-calm-blue font-bold">{feature.usage}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-full ${feature.color} rounded-full transition-all duration-1000`} style={{ width: `${feature.usage}%` }} />
                            </div>
                            <p className={`text-[10px] font-bold ${feature.trend.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>
                                {feature.trend} this week
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Icons 
const DepthIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
);

const ArrowPathIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const UserMinusIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12H15" />
    </svg>
);

const BoltIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
