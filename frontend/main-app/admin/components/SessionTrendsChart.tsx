// ================================================
// MANAS360 Session Analytics - Session Trends Chart
// Story 3.6: Session Analytics
// ================================================

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { TrendData } from '../services/analyticsApi';

interface SessionTrendsChartProps {
    data: TrendData[];
    title?: string;
}

export const SessionTrendsChart: React.FC<SessionTrendsChartProps> = ({
    data,
    title = "Session Trends"
}) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-4 text-lg font-semibold text-calm-blue">{title}</h3>

            {(!data || data.length === 0) ? (
                <div className="flex h-64 items-center justify-center text-calm-text/50">
                    No trend data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7CA5B8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#7CA5B8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#76C7C0" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#76C7C0" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                            dataKey="period"
                            tickFormatter={formatDate}
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            labelFormatter={formatDate}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="totalSessions"
                            name="Total Sessions"
                            stroke="#7CA5B8"
                            fillOpacity={1}
                            fill="url(#colorSessions)"
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="completed"
                            name="Completed"
                            stroke="#76C7C0"
                            fillOpacity={1}
                            fill="url(#colorCompleted)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

// Completion Rate Trend Chart
export const CompletionRateTrendChart: React.FC<SessionTrendsChartProps> = ({
    data,
    title = "Completion Rate Trend"
}) => {
    const chartData = (data || []).map(d => ({
        ...d,
        completionRate: parseFloat(d.completionRate)
    }));

    return (
        <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-4 text-lg font-semibold text-calm-blue">{title}</h3>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="period"
                        tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completionRate"
                        stroke="#BEB9DB"
                        strokeWidth={4}
                        dot={{ fill: '#BEB9DB', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#8B5CF6' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SessionTrendsChart;
