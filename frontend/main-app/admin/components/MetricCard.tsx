// ================================================
// MANAS360 Session Analytics - MetricCard Component
// Story 3.6: Session Analytics
// ================================================

import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorClasses = {
    blue: 'bg-white/60 border-calm-lightBlue/30 text-calm-blue',
    green: 'bg-white/60 border-teal-200/50 text-teal-700',
    yellow: 'bg-white/60 border-amber-200/50 text-amber-700',
    red: 'bg-white/60 border-rose-200/50 text-rose-700',
    purple: 'bg-white/60 border-calm-lavender/50 text-purple-700'
};

const iconBgClasses = {
    blue: 'bg-calm-lightBlue/20 text-calm-blue',
    green: 'bg-teal-100 text-teal-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700',
    purple: 'bg-calm-lavender text-purple-700'
};

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = 'blue'
}) => {
    return (
        <div className={`metric-card p-6 ${colorClasses[color]} relative overflow-hidden group`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl transition-all group-hover:opacity-10"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold opacity-60" style={{ color: 'var(--calm-text)' }}>{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight" style={{ color: 'var(--calm-text)' }}>{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm opacity-50" style={{ color: 'var(--calm-text)' }}>{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`mt-2 flex items-center text-sm font-medium ${trend.isPositive ? 'text-teal-600' : 'text-rose-500'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span className="ml-1">{Math.abs(trend.value)}% from last period</span>
                        </div>
                    )}
                </div>
                <div className={`rounded-2xl p-3 shadow-sm ${iconBgClasses[color]} transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default MetricCard;
