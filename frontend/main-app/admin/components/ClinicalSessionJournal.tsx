import React, { useState } from 'react';

// Mock Data for Clinical Sessions
const mockClinicalSessions = [
    {
        id: '1',
        date: '2025-05-15',
        patientName: 'Jane Doe',
        therapistName: 'Dr. Sarah Johnson',
        sessionType: 'CBT',
        duration: '50m',
        notes: 'Patient showed signs of improvement. Discussed coping mechanisms for anxiety.',
        mood: 'Improved',
        nextSession: '2025-05-22'
    },
    {
        id: '2',
        date: '2025-05-14',
        patientName: 'John Smith',
        therapistName: 'Dr. Michael Chen',
        sessionType: 'Mindfulness',
        duration: '45m',
        notes: 'Focused on breathing exercises. Patient reported high stress levels at work.',
        mood: 'Stressed',
        nextSession: '2025-05-21'
    },
    {
        id: '3',
        date: '2025-05-14',
        patientName: 'Emily Davis',
        therapistName: 'Dr. Sarah Johnson',
        sessionType: 'DBT',
        duration: '60m',
        notes: 'Worked on emotional regulation skills. Patient was receptive.',
        mood: 'Stable',
        nextSession: '2025-05-20'
    },
    {
        id: '4',
        date: '2025-05-12',
        patientName: 'Robert Wilson',
        therapistName: 'Dr. Emily White',
        sessionType: 'Psychodynamic',
        duration: '55m',
        notes: 'Explored childhood patterns. Some resistance noted.',
        mood: 'Reflective',
        nextSession: '2025-05-19'
    },
    {
        id: '5',
        date: '2025-05-10',
        patientName: 'Lisa Brown',
        therapistName: 'Dr. Michael Chen',
        sessionType: 'CBT',
        duration: '50m',
        notes: 'Reviewed homework assignments. Progress is steady.',
        mood: 'Good',
        nextSession: '2025-05-17'
    }
];

export const ClinicalSessionJournal: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const filteredSessions = mockClinicalSessions.filter(session => {
        const matchesSearch =
            session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.therapistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.notes.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = filterDate ? session.date === filterDate : true;

        return matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-calm-blue">All Clinical Session Journals</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search patient, therapist..."
                            className="pl-9 pr-4 py-2 border border-calm-lightBlue/30 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-calm-blue w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="date"
                        className="border border-calm-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-calm-blue text-gray-500"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <div key={session.id} className="bg-white/60 backdrop-blur-sm border border-calm-lightBlue/20 rounded-2xl p-6 hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-semibold text-calm-text">{session.patientName}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-calm-lavender/50 text-xs font-medium text-calm-blue border border-calm-lavender">
                                            {session.sessionType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Therapist: <span className="font-medium text-gray-700">{session.therapistName}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {session.duration}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-xl p-4 border border-gray-100 mb-4">
                                <p className="text-gray-600 text-sm leading-relaxed italic">
                                    "{session.notes}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Patient Mood:</span>
                                    <span className={`font-medium ${session.mood === 'Improved' || session.mood === 'Good' || session.mood === 'Stable'
                                            ? 'text-teal-600'
                                            : 'text-amber-600'
                                        }`}>
                                        {session.mood}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => alert(`View details for session with ${session.patientName}`)}
                                        className="px-3 py-1.5 text-xs font-medium text-calm-blue bg-calm-lightBlue/10 rounded-lg hover:bg-calm-lightBlue/20 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => alert(`Edit notes for session with ${session.patientName}`)}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Edit Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No session journals found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};
