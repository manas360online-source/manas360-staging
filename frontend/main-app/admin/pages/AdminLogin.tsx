// ================================================
// MANAS360 Admin Login Page
// Story 3.6: Session Analytics
// Email-only authentication
// ================================================

import React, { useState, useCallback } from 'react';
import analyticsApi from '../services/analyticsApi';

export interface AdminLoginProps {
    onLoginSuccess?: (token: string, user: any) => void;
    onNavigate?: (view: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const { token, user } = await analyticsApi.loginAdmin(email);
            setSuccess(true);
            setEmail('');
            
            // Call callback if provided
            if (onLoginSuccess) {
                onLoginSuccess(token, user);
            } else if (onNavigate) {
                onNavigate('admin-dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }, [email, onLoginSuccess, onNavigate]);

    const handleDemoLogin = useCallback(async () => {
        setError('');
        setLoading(true);
        
        try {
            const token = await analyticsApi.getTestToken();
            const user = analyticsApi.getCurrentAdmin();
            setSuccess(true);
            
            if (onLoginSuccess && user) {
                onLoginSuccess(token, user);
            } else if (onNavigate) {
                onNavigate('admin-dashboard');
            }
        } catch (err: any) {
            setError('Demo login failed. Please try again.');
            console.error('Demo login error:', err);
        } finally {
            setLoading(false);
        }
    }, [onLoginSuccess, onNavigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🔐</div>
                            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
                            <p className="text-blue-100">MANAS360 Session Analytics</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700 text-sm font-medium">
                                    ✓ Login successful! Redirecting...
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@manas360.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    disabled={loading}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Authorized emails: admin@manas360.com, admin@example.com, support@manas360.com
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                {loading ? 'Logging in...' : 'Login with Email'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-3 text-gray-500 text-sm">or</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Demo Login */}
                        <button
                            onClick={handleDemoLogin}
                            disabled={loading}
                            className="w-full bg-slate-200 hover:bg-slate-300 disabled:bg-gray-400 text-slate-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            {loading ? 'Loading...' : 'Try Demo Account'}
                        </button>

                        {/* Footer */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 text-sm mb-2">Test Credentials:</h3>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• <strong>admin@manas360.com</strong></li>
                                <li>• admin@example.com</li>
                                <li>• support@manas360.com</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => onNavigate ? onNavigate('landing') : window.location.hash = '#/en'}
                        className="text-blue-300 hover:text-white transition text-sm font-medium"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
