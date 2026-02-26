/**
 * ════════════════════════════════════════════════════════════════════════════
 * UNIVERSAL AUTH PAGE - LOGIN/REGISTER FOR ALL NON-ADMIN USERS
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Provides unified authentication for:
 * - Patient (Individual)
 * - Therapist (Provider)
 * - Corporate (SSO)
 * - Education (School/College)
 * - Healthcare (Clinic/Hospital)
 * - Insurance (Partner)
 * - Government (Tele-MANAS/ASHA)
 * 
 * Flow:
 * 1. User selects role/user type
 * 2. Enters email/phone
 * 3. OTP verification
 * 4. Role-specific onboarding
 * 
 * Admin is NOT included here - admin login is separate with MFA.
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════

type UserRole = 'patient' | 'therapist' | 'corporate' | 'education' | 'healthcare' | 'insurance' | 'government';
type AuthMode = 'role-select' | 'login' | 'register' | 'otp' | 'loading' | 'success';

interface RoleOption {
  id: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// ════════════════════════════════════════════════════════════════════════════
// Role Definitions
// ════════════════════════════════════════════════════════════════════════════

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'patient',
    label: 'Patient Login',
    description: 'Individual account',
    icon: '👨‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'therapist',
    label: 'Therapist Login',
    description: 'Provider portal',
    icon: '👨‍⚕️',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'corporate',
    label: 'Corporate Login',
    description: 'SSO / admin portal',
    icon: '🏢',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'education',
    label: 'Education Login',
    description: 'School / college admin',
    icon: '🏫',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'healthcare',
    label: 'Healthcare Login',
    description: 'Clinic / hospital',
    icon: '🏥',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'insurance',
    label: 'Insurance Login',
    description: 'Partner portal',
    icon: '🛡️',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'government',
    label: 'Government Login',
    description: 'Tele-MANAS / ASHA',
    icon: '🏛️',
    color: 'from-gray-600 to-gray-700'
  }
];

// ════════════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════════════

interface UniversalAuthPageProps {
  onSuccess?: (role: UserRole, user: any) => void;
  onAdminLoginClick?: () => void;
}

export const UniversalAuthPage: React.FC<UniversalAuthPageProps> = ({
  onSuccess,
  onAdminLoginClick
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('role-select');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // ─────────────────────────────────────────────────────────────────────────
  // Step 1: Send OTP
  // ─────────────────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email && !phone) {
      setError('Please enter email or phone number');
      return;
    }

    setMode('loading');

    try {
      await login(email || phone);
      setMode('otp');
      setOtpCountdown(60);
    } catch (err: any) {
      setMode('login');
      setError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Step 2: Verify OTP & Login/Register
  // ─────────────────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }

    setMode('loading');

    try {
      const response = await login(email || phone, otp);
      const userData = response?.user || null;

      setMode('success');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(selectedRole!, userData);
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1500);
    } catch (err: any) {
      setMode('otp');
      setError(err?.response?.data?.message || 'OTP verification failed. Please try again.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Reset flow
  // ─────────────────────────────────────────────────────────────────────────
  const handleBackToRoleSelect = () => {
    setMode('role-select');
    setSelectedRole(null);
    setIsRegister(false);
    setEmail('');
    setPhone('');
    setOtp('');
    setFullName('');
    setError('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Role Selection
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === 'role-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to Manas<span className="text-blue-600">360</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Select your role to get started
            </p>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setMode('login');
                }}
                className={`group p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg active:scale-95 bg-white dark:bg-slate-800`}
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  {role.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {role.description}
                </p>
              </button>
            ))}
          </div>

          {/* Admin Login Link */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Are you a system administrator?
            </p>
            <button
              onClick={onAdminLoginClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold rounded-full transition-all active:scale-95"
            >
              <span>🔐</span>
              Secure Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.id === selectedRole);

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Login/Register Form
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          {/* Back Button */}
          <button
            onClick={handleBackToRoleSelect}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="text-3xl mb-3">{selectedRoleOption?.icon}</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {selectedRoleOption?.label}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {mode === 'login'
                ? 'Enter your credentials to continue'
                : mode === 'otp'
                ? 'Verify your OTP'
                : isRegister
                ? 'Create your account'
                : ''}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Mode: OTP */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-center text-2xl font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all active:scale-95"
              >
                Verify & Continue
              </button>

              {otpCountdown > 0 && (
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Resend OTP in {otpCountdown}s
                </div>
              )}

              {otpCountdown === 0 && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </form>
          )}

          {/* Mode: Login or Register Form */}
          {(mode === 'login' || mode === 'register') && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {isRegister && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email or Phone
                </label>
                <input
                  type="text"
                  value={email || phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.includes('@')) {
                      setEmail(val);
                      setPhone('');
                    } else {
                      setPhone(val);
                      setEmail('');
                    }
                  }}
                  placeholder="email@example.com or +91XXXXXXXXXX"
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all active:scale-95"
              >
                Send OTP
              </button>

              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="w-full py-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                >
                  New here? Create account
                </button>
              )}

              {isRegister && (
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="w-full py-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                >
                  Already have account? Log in
                </button>
              )}
            </form>
          )}

          {/* Mode: Loading */}
          {mode === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Processing...</p>
            </div>
          )}

          {/* Mode: Success */}
          {mode === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-5xl mb-4">✓</div>
              <p className="text-center text-slate-600 dark:text-slate-400">
                Welcome! Redirecting you now...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          By continuing, you agree to our <a href="#" className="hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default UniversalAuthPage;
