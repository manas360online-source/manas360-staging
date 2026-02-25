import axios from 'axios';

const viteEnv =
  (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) as Record<string, string | undefined>;

const API_BASE_URL =
  viteEnv.VITE_API_BASE_URL ||
  viteEnv.VITE_API_URL ||
  'http://localhost:5001/api/v1';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`));

  if (!cookie) return null;
  return decodeURIComponent(cookie.split('=').slice(1).join('='));
}

function appendCsrfHeader(headers: any) {
  const csrfToken = getCookie('csrf_token');
  if (!csrfToken) return headers;

  if (headers && typeof headers.set === 'function') {
    headers.set('X-CSRF-Token', csrfToken);
    return headers;
  }

  return {
    ...(headers || {}),
    'X-CSRF-Token': csrfToken
  };
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((pending) => {
    if (error) pending.reject(error);
    else pending.resolve();
  });
  failedQueue = [];
}

apiClient.interceptors.request.use(
  (config) => {
    config.headers = appendCsrfHeader(config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const hasCsrfCookie = typeof document !== 'undefined' && document.cookie.includes('csrf_token=');
    const requestUrl = String(originalRequest.url || '');
    const isRefreshRequest = requestUrl.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && hasCsrfCookie) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(originalRequest)),
            reject
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.hash = '#/en/auth';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const storage = {
  getAccessToken: () => null,
  setAccessToken: () => undefined,
  getRefreshToken: () => null,
  setRefreshToken: () => undefined,
  clear: () => undefined
};

export const decodeToken = () => null;
export const getCurrentUser = () => null;
export const userHasRole = () => false;
export const userHasPermission = () => false;
export const setAuthToken = () => undefined;
export const clearAuthToken = () => undefined;

export const isAuthenticated = () => Boolean(getCookie('csrf_token'));
export const isTokenExpiringSoon = () => false;

export const apiGet = (url: string, config = {}) => apiClient.get(url, config);
export const apiPost = (url: string, data = {}, config = {}) => apiClient.post(url, data, config);
export const apiPatch = (url: string, data = {}, config = {}) => apiClient.patch(url, data, config);
export const apiDelete = (url: string, config = {}) => apiClient.delete(url, config);
export const apiPut = (url: string, data = {}, config = {}) => apiClient.put(url, data, config);

export const api = {
  auth: {
    sendOtp: (email: string) => apiPost('/auth/send-otp', { email }),
    verifyOtp: (email: string, otp: string) => apiPost('/auth/verify-otp', { email, otp }),
    adminLoginInitiate: (payload: { email: string; password?: string; otp?: string }) =>
      apiPost('/auth/admin-login', payload),
    adminLoginVerifyMfa: (payload: { mfaToken: string; mfaCode: string }) =>
      apiPost('/auth/admin-login/verify-mfa', payload),
    refresh: () => apiPost('/auth/refresh', {}),
    logout: () => apiPost('/auth/logout', {})
  },

  users: {
    getMe: () => apiGet('/users/me'),
    getProfile: (userId: string) => apiGet(`/users/${userId}`),
    updateProfile: (data: Record<string, unknown>) => apiPatch('/users/me', data)
  },

  subscriptions: {
    getCurrent: () => apiGet('/subscriptions/current'),
    getPlans: () => apiGet('/subscriptions/plans')
  },

  payments: {
    create: (planId: string) => apiPost('/payments/create', { planId })
  },

  themedRooms: {
    getThemes: () => apiGet('/themed-rooms/themes'),
    createSession: (themeId: string) => apiPost('/themed-rooms/sessions', { themeId }),
    endSession: (sessionId: string, durationSeconds: number, notes = '') =>
      apiPatch(`/themed-rooms/sessions/${sessionId}/end`, { durationSeconds, notes })
  },

  admin: {
    getUsers: (filters = {}) => apiGet('/admin/users', { params: filters }),
    getUserById: (userId: string) => apiGet(`/admin/users/${userId}`),
    suspendUser: (userId: string) => apiPut(`/admin/users/${userId}/suspend`),
    unsuspendUser: (userId: string) => apiDelete(`/admin/users/${userId}/suspend`),
    getMfaStatus: () => apiGet('/admin/mfa/status'),
    generateMfaSecret: () => apiPost('/admin/mfa/generate-secret', {}),
    enableMfa: (payload: { secret: string; mfaCode: string }) =>
      apiPost('/admin/mfa/enable', payload),
    disableMfa: (payload: Record<string, unknown>) =>
      apiPost('/admin/mfa/disable', payload)
  },

  analytics: {
    getOverview: (dateRange = {}) => apiGet('/analytics/overview', { params: dateRange }),
    getSessions: (dateRange = {}) => apiGet('/analytics/sessions', { params: dateRange }),
    getOutcomes: (dateRange = {}) => apiGet('/analytics/outcomes', { params: dateRange })
  }
};

export default apiClient;
export { API_BASE_URL, getCookie };
