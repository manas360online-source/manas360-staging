import React from 'react';

interface CohortData {
    week: string;
    size: number;
    retention: number[]; // Store as percentages 0-100
}

const DUMMY_COHORT_DATA: CohortData[] = [
    { week: 'Jan 01', size: 1200, retention: [100, 45, 38, 32, 28, 25] },
    { week: 'Jan 08', size: 1150, retention: [100, 48, 40, 35, 30] },
    { week: 'Jan 15', size: 1300, retention: [100, 42, 36, 31] },
    { week: 'Jan 22', size: 1250, retention: [100, 46, 39] },
    { week: 'Jan 29', size: 1400, retention: [100, 50] },
    { week: 'Feb 05', size: 1100, retention: [100] },
];

const getCellColor = (value: number) => {
    if (value === 100) return 'bg-calm-blue text-white';
    if (value >= 45) return 'bg-blue-500 text-white';
    if (value >= 35) return 'bg-blue-400 text-white';
    if (value >= 30) return 'bg-blue-300 text-calm-text';
    if (value >= 25) return 'bg-blue-200 text-calm-text';
    return 'bg-blue-50 text-calm-text';
};

export const CohortAnalysis: React.FC = () => {
    return (
        <div className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-calm-blue">Cohort Retention Analysis</h3>
                <p className="text-sm text-gray-500">Weekly user retention rates (Session Starts)</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 text-left text-gray-400 font-bold uppercase text-[10px]">Cohort</th>
                            <th className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px]">Size</th>
                            {[0, 1, 2, 3, 4, 5].map(w => (
                                <th key={w} className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px]">
                                    W{w}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DUMMY_COHORT_DATA.map((cohort, idx) => (
                            <tr key={idx}>
                                <td className="px-4 py-3 border-b border-gray-100 font-medium text-calm-text text-left bg-white/40">
                                    {cohort.week}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-100 text-gray-500 bg-white/40">
                                    {cohort.size.toLocaleString()}
                                </td>
                                {[0, 1, 2, 3, 4, 5].map(w => {
                                    const value = cohort.retention[w];
                                    return (
                                        <td
                                            key={w}
                                            className={`px-4 py-3 border border-white/50 transition-all hover:scale-105 hover:z-10 cursor-pointer ${value !== undefined ? getCellColor(value) : 'bg-gray-50/20'}`}
                                        >
                                            {value !== undefined ? `${value}%` : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-xs text-gray-500">High (&gt;45%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-300" />
                    <span className="text-xs text-gray-500">Medium (30-45%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-50" />
                    <span className="text-xs text-gray-500">Dropoff (&lt;30%)</span>
                </div>
            </div>
        </div>
    );
};
