// ================================================
// MANAS360 Session Analytics - Therapist Performance
// Story 3.6: Session Analytics
// ================================================

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TherapistMetric } from '../services/analyticsApi';

interface TherapistPerformanceProps {
    data: TherapistMetric[];
    title?: string;
}

export const TherapistPerformanceTable: React.FC<TherapistPerformanceProps> = ({
    data,
    title = "Therapist Performance"
}) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'text-teal-700 bg-teal-100/50 border border-teal-200';
        if (rating >= 4.0) return 'text-calm-blue bg-calm-lightBlue/10 border border-calm-lightBlue/30';
        if (rating >= 3.5) return 'text-amber-700 bg-amber-100/50 border border-amber-200';
        return 'text-rose-700 bg-rose-100/50 border border-rose-200';
    };

    return (
        <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-4 text-lg font-semibold text-calm-blue">{title}</h3>

            {(!data || data.length === 0) ? (
                <div className="flex h-40 items-center justify-center text-calm-text/50">
                    No therapist data available
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-calm-lightBlue/10 text-left text-sm font-medium text-calm-text/60">
                                <th className="pb-3 pr-4">Therapist</th>
                                <th className="pb-3 pr-4 text-center">Sessions</th>
                                <th className="pb-3 pr-4 text-center">Completion</th>
                                <th className="pb-3 pr-4 text-center">Patients</th>
                                <th className="pb-3 pr-4 text-center">Rating</th>
                                <th className="pb-3 text-center">Improvement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((therapist, idx) => (
                                <tr
                                    key={therapist.therapistId}
                                    className="border-b border-calm-lightBlue/5 last:border-0 hover:bg-calm-lightBlue/5 transition-colors"
                                >
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-calm-lightBlue to-calm-blue text-sm font-medium text-white shadow-sm">
                                                {getInitials(therapist.name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{therapist.name}</p>
                                                <p className="text-xs text-gray-500">{therapist.specialization || 'General'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-center">
                                        <span className="font-semibold text-gray-800">{therapist.totalSessions}</span>
                                        <span className="text-xs text-gray-500"> / {therapist.completedSessions}</span>
                                    </td>
                                    <td className="py-4 pr-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-teal-400 transition-all"
                                                    style={{ width: `${therapist.completionRate}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{therapist.completionRate}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-center font-medium text-calm-text/80">
                                        {therapist.uniquePatients}
                                    </td>
                                    <td className="py-4 pr-4 text-center">
                                        <span className={`rounded-full px-2 py-1 text-sm font-medium ${getRatingColor(parseFloat(therapist.avgRating))}`}>
                                            ★ {therapist.avgRating}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`font-medium ${parseFloat(therapist.avgOutcomeImprovement) > 0 ? 'text-teal-600' : 'text-gray-500'}`}>
                                            {parseFloat(therapist.avgOutcomeImprovement) > 0 ? '+' : ''}{therapist.avgOutcomeImprovement}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export const TherapistComparisonChart: React.FC<TherapistPerformanceProps> = ({
    data,
    title = "Sessions by Therapist"
}) => {
    const chartData = (data || []).slice(0, 8).map(d => ({
        name: d.name.split(' ')[0], // First name only
        sessions: d.totalSessions,
        completed: d.completedSessions,
        rating: parseFloat(d.avgRating) * 20 // Scale to percentage
    }));

    return (
        <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-4 text-lg font-semibold text-calm-blue">{title}</h3>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#9CA3AF"
                        fontSize={12}
                        width={60}
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
                    />
                    <Bar dataKey="sessions" name="Total" fill="#7CA5B8" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#76C7C0" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TherapistPerformanceTable;
