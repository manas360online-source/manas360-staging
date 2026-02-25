import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

interface FunnelStep {
    step: string;
    users: number;
    percentage: number;
    color: string;
}

const DUMMY_FUNNEL_DATA: FunnelStep[] = [
    { step: 'Sign Up', users: 1000, percentage: 100, color: '#6366f1' },
    { step: 'Profile Complete', users: 750, percentage: 75, color: '#818cf8' },
    { step: 'Book Session', users: 400, percentage: 40, color: '#a5b4fc' },
    { step: 'Session Started', users: 320, percentage: 32, color: '#c7d2fe' },
    { step: 'Session Complete', users: 280, percentage: 28, color: '#e0e7ff' },
];

export const FunnelChart: React.FC = () => {
    return (
        <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-calm-blue">Conversion Funnel</h3>
                    <p className="text-sm text-gray-500">User journey from signup to completion</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    28% Total Conversion
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={DUMMY_FUNNEL_DATA}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="step"
                            type="category"
                            tick={{ fill: '#475569', fontSize: 12 }}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-3 shadow-lg rounded-xl border border-gray-100">
                                            <p className="font-bold text-calm-blue">{data.step}</p>
                                            <p className="text-sm text-gray-600">{data.users} Users</p>
                                            <p className="text-xs text-calm-blue font-medium">{data.percentage}% of initial</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="users"
                            radius={[0, 8, 8, 0]}
                            barSize={30}
                        >
                            {DUMMY_FUNNEL_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList
                                dataKey="users"
                                position="right"
                                style={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
                {DUMMY_FUNNEL_DATA.slice(1).map((step, i) => {
                    const dropoff = DUMMY_FUNNEL_DATA[i].users - step.users;
                    const dropoffPercent = Math.round((dropoff / DUMMY_FUNNEL_DATA[i].users) * 100);
                    return (
                        <div key={i} className="text-center">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Dropoff</p>
                            <p className="text-sm font-bold text-rose-500">{dropoffPercent}%</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
