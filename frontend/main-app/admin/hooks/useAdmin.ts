// ================================================
// MANAS360 Session Analytics - Admin Hook
// Story 3.6: Session Analytics
// ================================================

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/apiClient-unified';

// Import types from analyticsApi for compatibility (will migrate types later)
import type { AdminUser, SubscriptionDetails, PlatformMetrics } from '../services/analyticsApi';

export const useAdmin = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionDetails[]>([]);
    const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            const response = await api.admin.getUsers(filters);
            setUsers(response.data.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSubscriptions = useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            const response = await api.admin.getSubscriptions(filters);
            setSubscriptions(response.data.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch subscriptions');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPlatformMetrics = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.admin.getMetrics();
            setMetrics(response.data.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch platform metrics');
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyTherapist = async (id: string) => {
        try {
            await api.admin.verifyTherapist(id);
            // Refresh users list after verification
            fetchUsers();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to verify therapist');
            return false;
        }
    };

    const refreshAll = useCallback(() => {
        fetchUsers();
        fetchSubscriptions();
        fetchPlatformMetrics();
    }, [fetchUsers, fetchSubscriptions, fetchPlatformMetrics]);

    return {
        users,
        subscriptions,
        metrics,
        loading,
        error,
        fetchUsers,
        fetchSubscriptions,
        fetchPlatformMetrics,
        verifyTherapist,
        refreshAll
    };
};

export default useAdmin;
