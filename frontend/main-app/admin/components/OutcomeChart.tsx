// ================================================
// MANAS360 Session Analytics - Outcome Charts
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
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { OutcomeMetric } from '../services/analyticsApi';

interface OutcomeChartProps {
    data: OutcomeMetric[];
    title?: string;
}

const COLORS = ['#7CA5B8', '#76C7C0', '#F3D250', '#E8A2A2', '#BEB9DB'];

export const OutcomeBarChart: React.FC<OutcomeChartProps> = ({
    data,
    title = "Assessment Outcomes"
}) => {
    const chartData = (data || []).map(d => ({
        name: d.type,
        'Pre Score': parseFloat(d.avgPreScore),
        'Post Score': parseFloat(d.avgPostScore),
        'Improvement': parseFloat(d.avgImprovement)
    }));

    return (
        <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-4 text-lg font-semibold text-calm-blue">{title}</h3>

            {data.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-calm-text/50">
                    No outcome data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="Pre Score" fill="#E8A2A2" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Post Score" fill="#76C7C0" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export const ImprovementRateChart: React.FC<OutcomeChartProps> = ({
    data,
    title = "Improvement Rate by Assessment"
}) => {

    const chartData = (data || []).map((d, index) => ({
        name: d.type,
        value: parseFloat(d.improvementRate),
        count: d.count,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <div className="rounded-2xl border border-calm-lightBlue/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-4 text-lg font-semibold text-calm-blue">{title}</h3>

            {data.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-calm-text/50">
                    No improvement data available
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number, name: string, props: any) => [
                                    `${value}% (${props.payload.count} assessments)`,
                                    'Improvement Rate'
                                ]}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Stats Cards */}
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {(data || []).map((d, idx) => (
                    <div
                        key={d.type}
                        className="rounded-xl p-3 text-center transition-all hover:scale-105"
                        style={{ backgroundColor: `${COLORS[idx % COLORS.length]}20` }}
                    >
                        <p className="text-xs font-medium text-calm-text/70">{d.type}</p>
                        <p className="text-lg font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                            {d.avgImprovement}
                        </p>
                        <p className="text-xs text-calm-text/50">avg improvement</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OutcomeBarChart;
