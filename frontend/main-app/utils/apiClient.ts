import apiClient, {
  api,
  apiGet,
  apiPost,
  apiPatch,
  apiPut,
  apiDelete,
  API_BASE_URL,
  isAuthenticated,
  isTokenExpiringSoon,
  getCookie
} from '../../utils/apiClient-unified';

export type AuthUser = {
  userId: string;
  email?: string;
  role?: string;
  permissions?: string[];
  exp?: number;
};

export const tokenStorage = {
  getAccessToken: () => null,
  setAccessToken: () => undefined,
  getRefreshToken: () => null,
  setRefreshToken: () => undefined,
  clear: () => undefined
};

export const decodeJwt = () => null;

let onAuthFailureHandler: (() => void) | null = null;

export function setAuthFailureHandler(handler: (() => void) | null) {
  onAuthFailureHandler = handler;
}

export function normalizeApiError(error: any): Error {
  if (error?.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error?.response?.data?.error) {
    return new Error(error.response.data.error);
  }
  if (error?.message) {
    return new Error(error.message);
  }
  return new Error('Something went wrong. Please try again.');
}

export async function requestWithRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const status = error?.response?.status;
    const retryable = !status || status >= 500;

    if (status === 401 && onAuthFailureHandler) {
      onAuthFailureHandler();
    }

    if (retries > 0 && retryable) {
      return requestWithRetry(fn, retries - 1);
    }

    throw normalizeApiError(error);
  }
}

const wrappedGet = <T = any>(url: string, config?: any) => requestWithRetry(async () => (await apiGet(url, config)).data as T);
const wrappedPost = <T = any>(url: string, data?: any, config?: any) => requestWithRetry(async () => (await apiPost(url, data, config)).data as T);
const wrappedPatch = <T = any>(url: string, data?: any, config?: any) => requestWithRetry(async () => (await apiPatch(url, data, config)).data as T);
const wrappedPut = <T = any>(url: string, data?: any, config?: any) => requestWithRetry(async () => (await apiPut(url, data, config)).data as T);
const wrappedDelete = <T = any>(url: string, config?: any) => requestWithRetry(async () => (await apiDelete(url, config)).data as T);

export const authApi = {
  sendOtp: (email: string) => wrappedPost('/auth/send-otp', { email }),
  verifyOtp: (email: string, otp: string) => wrappedPost('/auth/verify-otp', { email, otp }),
  adminLoginInitiate: (payload: { email: string; password?: string; otp?: string }) => wrappedPost('/auth/admin-login', payload),
  adminLoginVerifyMfa: (payload: { mfaToken: string; mfaCode: string }) => wrappedPost('/auth/admin-login/verify-mfa', payload),
  refresh: () => wrappedPost('/auth/refresh', {}),
  logout: () => wrappedPost('/auth/logout', {})
};

export const subscriptionApi = {
  getCurrent: () => wrappedGet('/subscriptions/current')
};

export const themedRoomApi = {
  getThemes: () => wrappedGet('/themed-rooms/themes'),
  startSession: (themeId: string, sessionData: Record<string, any> = {}) =>
    wrappedPost('/themed-rooms/sessions', { themeId, sessionData }),
  endSession: (sessionId: string, sessionData: Record<string, any> = {}) =>
    wrappedPatch(`/themed-rooms/sessions/${sessionId}/end`, { sessionData })
};

export { apiClient as default, api, wrappedGet as apiGet, wrappedPost as apiPost, wrappedPatch as apiPatch, wrappedPut as apiPut, wrappedDelete as apiDelete, API_BASE_URL, isAuthenticated, isTokenExpiringSoon, getCookie };
