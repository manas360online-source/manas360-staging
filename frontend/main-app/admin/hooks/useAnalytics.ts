// ================================================
// MANAS360 Session Analytics - useAnalytics Hook
// Story 3.6: Session Analytics
// ================================================

import { useState, useEffect, useCallback } from 'react';
import { api, API_BASE_URL } from '../../../utils/apiClient-unified';
import type {
    OverviewMetrics,
    SessionMetric,
    OutcomeMetric,
    TherapistMetric,
    TrendData,
    DateRange
} from '../services/analyticsApi';

interface UseAnalyticsReturn {
    // Data
    overview: OverviewMetrics | null;
    sessions: { byType: SessionMetric[]; byMode: SessionMetric[] } | null;
    outcomes: { byAssessmentType: OutcomeMetric[] } | null;
    therapists: TherapistMetric[];
    trends: TrendData[];
    dropoff: any;

    // State
    loading: boolean;
    error: string | null;
    dateRange: DateRange;

    // Actions
    setDateRange: (range: DateRange) => void;
    refresh: () => Promise<void>;
    exportExcel: () => void;
    exportPdf: () => void;
    addTherapist: (therapist: any) => void;
}

export function useAnalytics(): UseAnalyticsReturn {
    // Default to last 30 days
    const getDefaultDateRange = (): DateRange => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    };

    const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [overview, setOverview] = useState<OverviewMetrics | null>(null);
    const [sessions, setSessions] = useState<{ byType: SessionMetric[]; byMode: SessionMetric[] } | null>(null);
    const [outcomes, setOutcomes] = useState<{ byAssessmentType: OutcomeMetric[] } | null>(null);
    const [therapists, setTherapists] = useState<TherapistMetric[]>([]);
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [dropoff, setDropoff] = useState<any>(null);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                overviewRes,
                sessionsRes,
                outcomesRes
            ] = await Promise.all([
                api.analytics.getOverview(dateRange),
                api.analytics.getSessions(dateRange),
                api.analytics.getOutcomes(dateRange)
            ]);

            setOverview(overviewRes.data.data || null);
            setSessions(sessionsRes.data.data || null);
            setOutcomes(outcomesRes.data.data || null);
            setTherapists([]);  // Therapist metrics not yet implemented in backend
            setTrends([]);      // Trends not yet implemented in backend
            setDropoff(null);   // Dropoff not yet implemented in backend
        } catch (err: any) {
            console.error('Analytics fetch error:', err);
            setError(err.response?.data?.error || err.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const exportExcel = () => {
        const url = `${API_BASE_URL}/analytics/export/excel?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        window.open(url, '_blank');
    };

    const exportPdf = () => {
        const url = `${API_BASE_URL}/analytics/export/pdf?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        window.open(url, '_blank');
    };

    const addTherapist = (newTherapistData: any) => {
        const newTherapist: TherapistMetric = {
            therapistId: `new-${Date.now()}`,
            name: newTherapistData.fullName,
            email: newTherapistData.email,
            specialization: newTherapistData.specialization,
            totalSessions: 0,
            completedSessions: 0,
            completionRate: '0',
            uniquePatients: 0,
            avgDuration: '0',
            avgRating: '0', // New therapists start with 0 rating
            avgOutcomeImprovement: '0'
        };

        setTherapists(prev => [newTherapist, ...prev]);
    };

    return {
        overview,
        sessions,
        outcomes,
        therapists,
        trends,
        dropoff,
        loading,
        error,
        dateRange,
        setDateRange,
        refresh: fetchAllData,
        exportExcel,
        exportPdf,
        addTherapist
    };
}

export default useAnalytics;
