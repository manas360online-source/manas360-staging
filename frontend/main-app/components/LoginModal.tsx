
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// --- ICONS ---
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
);

const WhatsAppLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" fill="#25D366" />
  </svg>
);

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleLogo = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const FacebookLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
  </svg>
);

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, role }) => {
  const { t, i18n } = useTranslation();
  const [loginView, setLoginView] = useState<'main' | 'phone' | 'otp'>('main');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneLanguage, setPhoneLanguage] = useState('en');
  const [countdown, setCountdown] = useState(0);
  const [loginError, setLoginError] = useState('');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setLoginView('main');
        setPhoneNumber('');
        setOtp('');
        setLoginError('');
        setLoginStatus('idle');
        setCountdown(0);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSuccessRedirect = () => {
    onClose();
    if (role === 'therapist') {
      window.location.hash = `#/${i18n.language}/therapist-onboarding`;
    } else if (role === 'admin') {
      window.location.hash = `#/${i18n.language}/admin/login`;
    } else {
      // Default to profile setup (User flow)
      window.location.hash = `#/${i18n.language}/profile-setup`;
    }
  };

  const handleLogin = (provider: string) => {
    setLoginStatus('loading');
    setTimeout(() => {
      setLoginStatus('success');
      setTimeout(() => {
        handleSuccessRedirect();
      }, 1500);
    }, 1500);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setLoginError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoginStatus('loading');

    setTimeout(() => {
      setLoginStatus('idle');
      setLoginView('otp');
      setCountdown(60);
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setLoginError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoginStatus('loading');

    setTimeout(() => {
      setLoginStatus('success');
      setTimeout(() => {
        handleSuccessRedirect();
      }, 1500);
    }, 1500);
  };

  const handleResendOtp = () => {
    setOtp('');
    setLoginError('');
    setLoginStatus('loading');
    setTimeout(() => {
      setLoginStatus('idle');
      setCountdown(60);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>

      {/* Main Login Card */}
      <div className="relative bg-white dark:bg-[#0F172A] rounded-[32px] max-w-[420px] w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in-up border border-white/20 dark:border-slate-800 overflow-hidden transform transition-all">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all z-20"
        >
          <CloseIcon />
        </button>

        {/* IDLE STATE: SHOW LOGIN OPTIONS */}
        {loginStatus === 'idle' && (
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="font-serif text-[1.8rem] font-bold text-[#0A3A78] dark:text-white tracking-tight mb-2">
                {t('logo_text')}<span className="text-[#1FA2DE]">360</span>
              </div>

              {loginView === 'main' && (
                <>
                  <div className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Welcome back</div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Login to continue your journey.</p>
                </>
              )}
              {loginView === 'phone' && (
                <>
                  <div className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Login with WhatsApp</div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Enter your number to receive OTP.</p>
                </>
              )}
              {loginView === 'otp' && (
                <>
                  <div className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Verify OTP</div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Code sent to +91 {phoneNumber}</p>
                </>
              )}
            </div>

            {/* VIEW: MAIN (Login Methods) */}
            {loginView === 'main' && (
              <div className="space-y-3.5">
                <button
                  onClick={() => setLoginView('phone')}
                  className="group w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-[0.95rem] transition-all hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  <WhatsAppLogo />
                  Login with WhatsApp
                </button>

                <button onClick={() => handleLogin('apple')} className="group w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black font-bold text-[0.95rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
                  <AppleLogo className="w-5 h-5 mb-0.5" />
                  Sign in with Apple
                </button>

                <button onClick={() => handleLogin('google')} className="group w-full py-3.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold text-[0.95rem] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md">
                  <GoogleLogo />
                  Sign in with Google
                </button>

                <button onClick={() => handleLogin('facebook')} className="group w-full py-3.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold text-[0.95rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md hover:bg-[#166fe5]">
                  <span className="bg-white rounded-full p-0.5"><FacebookLogo /></span>
                  Sign in with Facebook
                </button>

                <div className="relative py-5">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100 dark:border-slate-800"></span></div>
                  <div className="relative flex justify-center text-[0.7rem] font-bold uppercase tracking-widest text-slate-400"><span className="bg-white dark:bg-[#0F172A] px-3">OR</span></div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin('email'); }} className="space-y-4">
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1FA2DE] dark:focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium placeholder:text-slate-400 group-hover:border-slate-300"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-full bg-[#0A3A78] hover:bg-[#082a5c] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                    Log In
                  </button>
                </form>

                <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account? <button onClick={() => { onClose(); window.location.hash = '#/subscribe'; }} className="text-[#0A3A78] dark:text-sky-400 font-bold hover:underline transition-colors">Sign up</button>
                </div>
              </div>
            )}

            {/* VIEW: PHONE INPUT */}
            {loginView === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Select Language</label>
                  <select
                    value={phoneLanguage}
                    onChange={(e) => setPhoneLanguage(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all font-medium appearance-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">WhatsApp Number</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-5 text-slate-500 font-bold">+91</span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#25D366] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium placeholder:text-slate-400 text-lg tracking-wide"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {loginError && <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>}

                <button type="submit" className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Send WhatsApp OTP
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginView('main'); setLoginError(''); }}
                  className="w-full py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Back to Login Options
                </button>
              </form>
            )}

            {/* VIEW: OTP INPUT */}
            {loginView === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in-up">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl flex items-center gap-3 border border-green-100 dark:border-green-800/30">
                  <WhatsAppLogo />
                  <p className="text-sm text-green-800 dark:text-green-300 font-medium">Please check your WhatsApp for the OTP code.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2 text-center">Enter OTP Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#25D366] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-center text-2xl tracking-[0.5em] placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-300"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500">Resend OTP in <span className="font-bold text-slate-600 dark:text-slate-300">{countdown}s</span></p>
                  ) : (
                    <button type="button" onClick={handleResendOtp} className="text-sm font-bold text-[#0A3A78] dark:text-sky-400 hover:underline">
                      Resend WhatsApp OTP
                    </button>
                  )}
                </div>

                {loginError && <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>}

                <button type="submit" className="w-full py-4 rounded-full bg-[#0A3A78] hover:bg-[#082a5c] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                  Verify & Login
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginView('phone'); setOtp(''); setLoginError(''); }}
                  className="w-full py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Change Number
                </button>
              </form>
            )}
          </div>
        )}

        {/* LOADING STATE */}
        {loginStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 px-8 min-h-[400px]">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
              <div className={`absolute inset-0 border-4 rounded-full animate-spin ${loginView !== 'main' ? 'border-t-[#25D366]' : 'border-t-[#0052CC] dark:border-t-sky-400'}`}></div>
            </div>
            <h3 className="text-xl font-bold text-[#0A3A78] dark:text-white mb-2">
              {loginView === 'main' ? 'Logging in...' : loginView === 'phone' ? 'Sending OTP...' : 'Verifying OTP...'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm">Please wait a moment.</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {loginStatus === 'success' && (
          <div className="text-center py-16 px-8 min-h-[400px] flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce shadow-sm">
              ✓
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#0A3A78] dark:text-white mb-2">{t('login_welcome', 'Welcome back!')}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">You have successfully logged in.</p>
          </div>
        )}
      </div>
    </div>
  );
};