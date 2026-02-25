import React, { useState, useCallback } from 'react';
import { api } from '../../../utils/apiClient-unified';

export interface AdminLoginProps {
  onLoginSuccess?: (token: string, user: any) => void;
  onNavigate?: (view: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePrimarySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your admin email');
      return;
    }

    if (!password.trim() && !otp.trim()) {
      setError('Provide password or OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.adminLoginInitiate({
        email: email.trim(),
        password: password.trim() || undefined,
        otp: otp.trim() || undefined
      });

      // If MFA is not required, login is successful
      if (!response?.data?.mfaRequired) {
        setSuccess(true);
        if (onLoginSuccess) {
          onLoginSuccess('cookie-auth', response?.data?.user);
        } else if (onNavigate) {
          onNavigate('admin-dashboard');
        }
        return;
      }

      // If MFA is required, proceed to MFA form
      if (response?.data?.mfaToken) {
        setMfaToken(response.data.mfaToken);
        setMfaRequired(true);
        setError('');
      } else {
        setError('Unexpected response from admin login initiation');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, otp, onLoginSuccess, onNavigate]);

  const handleMfaSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mfaCode.trim()) {
      setError('Please enter MFA code');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.adminLoginVerifyMfa({
        mfaToken,
        mfaCode: mfaCode.trim()
      });

      const user = response?.data?.user;
      setSuccess(true);

      if (onLoginSuccess) {
        onLoginSuccess('cookie-auth', user);
      } else if (onNavigate) {
        onNavigate('admin-dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'MFA verification failed');
    } finally {
      setLoading(false);
    }
  }, [mfaCode, mfaToken, onLoginSuccess, onNavigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-blue-100">Multi-factor protected</p>
            </div>
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">✓ Login successful. Redirecting...</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {!mfaRequired ? (
              <form onSubmit={handlePrimarySubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@manas360.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP (optional alternative to password)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  {loading ? 'Verifying...' : 'Continue to MFA'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMfaSubmit} className="space-y-4">
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Enter 6-digit MFA code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  {loading ? 'Finalizing...' : 'Verify MFA & Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
