// ================================================
// MANAS360 Session Analytics - Export Buttons
// Story 3.6: Session Analytics
// ================================================

import React from 'react';

interface ExportButtonsProps {
    onExportExcel: () => void;
    onExportPdf: () => void;
    disabled?: boolean;
}

// ... imports

export const ExportButtons: React.FC<ExportButtonsProps> = ({
    onExportExcel,
    onExportPdf,
    disabled = false
}) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={onExportExcel}
                disabled={disabled}
                className="flex items-center gap-2 rounded-xl bg-teal-600/90 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
            </button>
            <button
                onClick={onExportPdf}
                disabled={disabled}
                className="flex items-center gap-2 rounded-xl bg-calm-blue/90 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-calm-blue hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
            </button>
        </div>
    );
};

// Date Range Picker Component
interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onChange: (range: { startDate: string; endDate: string }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onChange
}) => {
    const presets = [
        { label: 'Last 7 days', days: 7 },
        { label: 'Last 30 days', days: 30 },
        { label: 'Last 90 days', days: 90 },
    ];

    const applyPreset = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onChange({
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Preset Buttons */}
            <div className="flex gap-1 rounded-lg bg-gray-100/50 p-1">
                {presets.map(preset => (
                    <button
                        key={preset.days}
                        onClick={() => applyPreset(preset.days)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-calm-text/70 transition-all hover:bg-white hover:text-calm-blue hover:shadow-sm"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 px-3 border border-calm-lightBlue/20 shadow-sm">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onChange({ startDate: e.target.value, endDate })}
                    className="bg-transparent text-sm text-calm-text font-medium focus:outline-none"
                />
                <span className="text-calm-lightBlue">→</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onChange({ startDate, endDate: e.target.value })}
                    className="bg-transparent text-sm text-calm-text font-medium focus:outline-none"
                />
            </div>
        </div>
    );
};

export default ExportButtons;
