// ================================================
// MANAS360 Session Analytics - API Service
// Story 3.6: Session Analytics
// ================================================

import axios, { AxiosInstance, AxiosResponse } from 'axios';

const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) || {};
const API_BASE_URL =
    viteEnv.VITE_API_BASE_URL ||
    viteEnv.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    'http://localhost:5001/api';

// =========================================
// General Types
// =========================================
export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
    error?: string;
}

// =========================================
// Analytics Types
// =========================================
export interface OverviewMetrics {
    totalSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    noShowSessions: number;
    completionRate: string;
    avgDuration: string;
    avgRating: string;
    avgImprovement: string;
    avgPhq9Improvement: string;
    avgGad7Improvement: string;
    uniquePatients: number;
    activeTherapists: number;
    dateRange: DateRange;
}

export interface SessionMetric {
    category: string;
    total: number;
    completed: number;
    completionRate: string;
    avgDuration: string;
    avgRating: string;
}

export interface OutcomeMetric {
    type: string;
    count: number;
    avgPreScore: string;
    avgPostScore: string;
    avgImprovement: string;
    improvementRate: string;
}

export interface TherapistMetric {
    therapistId: string;
    name: string;
    email: string;
    specialization: string;
    totalSessions: number;
    completedSessions: number;
    completionRate: string;
    uniquePatients: number;
    avgDuration: string;
    avgRating: string;
    avgOutcomeImprovement: string;
}

export interface TrendData {
    period: string;
    totalSessions: number;
    completed: number;
    cancelled: number;
    noShow: number;
    completionRate: string;
    avgDuration: number;
    avgRating: number;
    uniquePatients: number;
}

// =========================================
// Admin Types
// =========================================
export interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    role: 'admin' | 'therapist' | 'patient';
    specialization?: string;
    isActive: boolean;
    isVerified: boolean;
    created_at: string;
    Subscriptions?: SubscriptionDetails[];
}

export interface SubscriptionDetails {
    id: string;
    userId: string;
    planName: string;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    startDate: string;
    endDate: string;
    amount: string;
    currency: string;
    created_at: string;
    User?: {
        fullName: string;
        email: string;
    };
}

export interface PlatformMetrics {
    users: {
        total: number;
        patients: number;
        therapists: number;
        verifiedTherapists: number;
    };
    sessions: {
        total: number;
        completed: number;
        completionRate: string;
    };
    subscriptions: {
        active: number;
        revenue: number;
    };
}

class AnalyticsApi {
    private client: AxiosInstance;
    private token: string | null = null;
    private adminPrefix = '/v1/admin';

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add auth interceptor
        this.client.interceptors.request.use((config) => {
            if (!this.token) {
                this.loadToken();
            }
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });

        // Error handling interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.error('Unauthorized access');
                }
                return Promise.reject(error);
            }
        );
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('analytics_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('analytics_token');
    }

    loadToken() {
        this.token = localStorage.getItem('analytics_token');
    }

    getCurrentAdmin(): { id?: string; email?: string; name?: string; role?: string } | null {
        const token = localStorage.getItem('analytics_token');
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            if (!payload) return null;
            const decoded = JSON.parse(atob(payload));

            return {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role
            };
        } catch (error) {
            return null;
        }
    }

    // =========================================
    // Analytics Methods
    // =========================================

    async getOverview(dateRange: DateRange): Promise<OverviewMetrics> {
        const response: AxiosResponse<ApiResponse<OverviewMetrics>> = await this.client.get('/analytics/overview', {
            params: dateRange
        });
        return response.data.data;
    }

    async getSessions(dateRange: DateRange): Promise<{ byType: SessionMetric[]; byMode: SessionMetric[] }> {
        const response: AxiosResponse<ApiResponse<{ byType: SessionMetric[]; byMode: SessionMetric[] }>> =
            await this.client.get('/analytics/sessions', { params: dateRange });
        return response.data.data;
    }

    async getOutcomes(dateRange: DateRange): Promise<{ byAssessmentType: OutcomeMetric[] }> {
        const response: AxiosResponse<ApiResponse<{ byAssessmentType: OutcomeMetric[] }>> =
            await this.client.get('/analytics/outcomes', { params: dateRange });
        return response.data.data;
    }

    async getTherapists(dateRange: DateRange, limit: number = 10): Promise<TherapistMetric[]> {
        const response: AxiosResponse<ApiResponse<TherapistMetric[]>> =
            await this.client.get('/analytics/therapists', { params: { ...dateRange, limit } });
        return response.data.data;
    }

    async getTrends(dateRange: DateRange, interval: 'day' | 'week' | 'month' = 'day'): Promise<{ sessions: TrendData[] }> {
        const response: AxiosResponse<ApiResponse<{ sessions: TrendData[] }>> =
            await this.client.get('/analytics/trends', { params: { ...dateRange, interval } });
        return response.data.data;
    }

    async getDropoff(dateRange: DateRange): Promise<any> {
        const response: AxiosResponse<ApiResponse<any>> =
            await this.client.get('/analytics/dropoff', { params: dateRange });
        return response.data.data;
    }

    getExportExcelUrl(dateRange: DateRange): string {
        return `${API_BASE_URL}/analytics/export/excel?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
    }

    getExportPdfUrl(dateRange: DateRange): string {
        return `${API_BASE_URL}/analytics/export/pdf?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
    }

    // =========================================
    // Admin Methods
    // =========================================

    async getAdminUsers(filters: any = {}): Promise<AdminUser[]> {
        const response: AxiosResponse<ApiResponse<AdminUser[]>> =
            await this.client.get(`${this.adminPrefix}/users`, { params: filters });
        return response.data.data;
    }

    async getAdminUserById(id: string): Promise<AdminUser> {
        const response: AxiosResponse<ApiResponse<AdminUser>> =
            await this.client.get(`${this.adminPrefix}/users/${id}`);
        return response.data.data;
    }

    async verifyTherapist(id: string): Promise<AdminUser> {
        const response: AxiosResponse<ApiResponse<AdminUser>> =
            await this.client.patch(`${this.adminPrefix}/therapists/${id}/verify`);
        return response.data.data;
    }

    async getPlatformMetrics(): Promise<PlatformMetrics> {
        const response: AxiosResponse<ApiResponse<PlatformMetrics>> =
            await this.client.get(`${this.adminPrefix}/metrics`);
        return response.data.data;
    }

    async getAdminSubscriptions(filters: any = {}): Promise<SubscriptionDetails[]> {
        const response: AxiosResponse<ApiResponse<SubscriptionDetails[]>> =
            await this.client.get(`${this.adminPrefix}/subscriptions`, { params: filters });
        return response.data.data;
    }

    // For testing - get a demo token
    async getTestToken(): Promise<string> {
        const response = await this.client.get('/test-token');
        const token = response.data.token;
        this.setToken(token);
        return token;
    }

    // Email-only admin login
    async loginAdmin(email: string): Promise<{ token: string; user: AdminUser }> {
        const response = await this.client.post('/admin/login', { email });
        if (response.data.success) {
            this.setToken(response.data.token);
            return {
                token: response.data.token,
                user: response.data.user
            };
        }
        throw new Error(response.data.error || 'Login failed');
    }
}

export const analyticsApi = new AnalyticsApi();
export default analyticsApi;
