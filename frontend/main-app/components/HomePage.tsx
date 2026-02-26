
import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storageService';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';

// --- ICONS ---
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
);

// --- SOCIAL LOGOS (Inline for Reliability) ---
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

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Login Flow State
  const [loginView, setLoginView] = useState<'main' | 'phone' | 'otp'>('main');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneLanguage, setPhoneLanguage] = useState('en');
  const [countdown, setCountdown] = useState(0);
  const [loginError, setLoginError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'therapist' | null>(null);

  // Modal flow state
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInState, setCheckInState] = useState<'form' | 'success' | 'already'>('form');
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [checkInNote, setCheckInNote] = useState('');
  const [hasCheckedToday, setHasCheckedToday] = useState(false);

  useEffect(() => {
    setHasCheckedToday(storageService.hasCheckedInToday());

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-12', 'transition-all', 'duration-1000', 'ease-out');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Countdown timer for OTP
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
    setIsLoginOpen(false);

    // Reset login state for next time
    setTimeout(() => {
      setLoginStatus('idle');
      setLoginView('main');
      setPhoneNumber('');
      setOtp('');
      setLoginError('');
      setCountdown(0);
    }, 300);

    // Redirect based on role
    if (selectedRole === 'therapist') {
      window.location.hash = `#/${i18n.language}/landing`;
    } else {
      // Default to profile setup (User flow)
      window.location.hash = `#/${i18n.language}/profile-setup`;
    }
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    // Reset login state after transition
    setTimeout(() => {
      setLoginStatus('idle');
      setLoginView('main');
      setPhoneNumber('');
      setOtp('');
      setLoginError('');
      setCountdown(0);
    }, 300);
  };

  const handleLogin = (provider: string) => {
    setLoginStatus('loading');
    setTimeout(() => {
      setLoginStatus('success');
      // Auto-close logic: Wait 1.5s then redirect
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

    // Simulate API Call
    setTimeout(() => {
      setLoginStatus('idle');
      setLoginView('otp');
      setCountdown(60);
      // For development feedback
      console.log(`Sending OTP to +91${phoneNumber} in language ${phoneLanguage}`);
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

    // Simulate Verification
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
      console.log('OTP Resent');
    }, 1000);
  };

  const handleCompleteCheckIn = () => {
    storageService.saveCheckIn({ feeling: selectedEmoji?.toString(), note: checkInNote });
    setHasCheckedToday(true);
    setCheckInState('success');
  };

  const closeCheckIn = () => {
    setIsCheckInOpen(false);
    // Reset form after exit
    setTimeout(() => {
      setSelectedEmoji(null);
      setCheckInNote('');
    }, 300);
  };

  const emojis = ['🤩', '😐', '😟', '😌', '😩'];

  return (
    <div className="font-sans text-[#1A1A1A] bg-[#FDFCF8] selection:bg-blue-100 selection:text-[#0A3A78] overflow-x-hidden transition-colors duration-500 dark:bg-[#030712] dark:text-slate-100">

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={handleCloseLogin}></div>

          {/* Main Login Card */}
          <div className="relative bg-white dark:bg-[#0F172A] rounded-[32px] max-w-[420px] w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in-up border border-white/20 dark:border-slate-800 overflow-hidden transform transition-all">

            {/* Close Button - Clean & Minimal */}
            <button
              onClick={handleCloseLogin}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all z-20"
            >
              <CloseIcon />
            </button>

            {/* IDLE STATE: SHOW LOGIN OPTIONS */}
            {loginStatus === 'idle' && (
              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  {/* Brand Icon/Logo */}
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
                    {/* WhatsApp Login - Highlighted */}
                    <button
                      onClick={() => setLoginView('phone')}
                      className="group w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-[0.95rem] transition-all hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-lg"
                    >
                      <WhatsAppLogo />
                      Login with WhatsApp
                    </button>

                    {/* Apple Login */}
                    <button onClick={() => handleLogin('apple')} className="group w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black font-bold text-[0.95rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
                      <AppleLogo className="w-5 h-5 mb-0.5" />
                      Sign in with Apple
                    </button>

                    {/* Google Login */}
                    <button onClick={() => handleLogin('google')} className="group w-full py-3.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold text-[0.95rem] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md">
                      <GoogleLogo />
                      Sign in with Google
                    </button>

                    {/* Facebook Login */}
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
                      Don't have an account? <button onClick={() => { handleCloseLogin(); window.location.hash = `#/${i18n.language}/subscribe`; }} className="text-[#0A3A78] dark:text-sky-400 font-bold hover:underline transition-colors">Sign up</button>
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
      )}

      {/* CHECK-IN MODAL */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCheckIn}></div>
          <div className="relative bg-white dark:bg-[#1E293B] rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-fade-in-up border border-slate-100 dark:border-slate-700">
            <button onClick={closeCheckIn} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
              <CloseIcon />
            </button>

            {checkInState === 'form' && (
              <>
                <h3 className="text-xl font-bold text-[#0A3A78] dark:text-white mb-6 text-center">{t('modal_daily_checkin')}</h3>
                <p className="text-slate-500 dark:text-slate-300 mb-4 text-center">{t('modal_how_feeling')}</p>

                <div className="flex justify-between mb-6">
                  {emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedEmoji(idx + 1)}
                      className={`text-3xl p-2 rounded-full transition-transform hover:scale-125 ${selectedEmoji === idx + 1 ? 'bg-blue-100 dark:bg-slate-700 scale-125' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <textarea
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                  placeholder={t('modal_note_placeholder')}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FA2DE] text-[#1A1A1A] dark:text-white resize-none"
                  rows={3}
                />

                <button
                  onClick={handleCompleteCheckIn}
                  disabled={selectedEmoji === null}
                  className={`w-full py-3 rounded-full font-bold text-white transition-all shadow-md ${selectedEmoji ? 'bg-[#1FA2DE] hover:bg-[#1590C9]' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                >
                  {t('modal_complete_btn')}
                </button>
              </>
            )}

            {checkInState === 'success' && (
              <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-xl font-bold text-[#0A3A78] dark:text-white mb-2">{t('modal_completed_title')}</h3>
                <p className="text-slate-500 dark:text-slate-300 mb-6">{t('modal_showed_up')}</p>
                <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-4 py-1 rounded-full mb-6 text-sm">
                  {t('modal_streak_continued')} 🔥
                </div>
                <button
                  onClick={closeCheckIn}
                  className="w-full py-3 rounded-full bg-[#1FA2DE] text-white font-bold hover:bg-[#1590C9] shadow-lg"
                >
                  {t('modal_done')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <div
        className="relative w-full min-h-[100vh] md:min-h-[92vh] flex flex-col transition-all duration-700 z-[100]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=2560&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#031428]/35 dark:bg-[#020617]/65 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#DBEEF9]/55 via-[#DBEEF9]/20 to-[#FDFCF8] dark:from-[#030712]/85 dark:via-[#030712]/65 dark:to-[#030712] pointer-events-none z-0"></div>
        <div className="landing-water-waves z-[6]" aria-hidden="true">
          <svg className="wave-svg back" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path className="wave-path" d="M0,72 C180,36 320,96 510,72 C700,48 860,12 1040,38 C1210,62 1320,94 1440,72 L1440,120 L0,120 Z" />
          </svg>
          <svg className="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path className="wave-path" d="M0,58 C150,84 290,22 470,50 C650,78 790,106 980,78 C1160,52 1290,24 1440,56 L1440,120 L0,120 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/90 to-transparent dark:from-[#030712] dark:via-[#030712]/90 pointer-events-none z-0"></div>

        {/* USE SHARED HEADER COMPONENT EXACTLY AS IN LANDING PAGE */}
        <div className="relative z-[1500] w-full">
          <Header onLoginClick={(role) => {
            setSelectedRole(role as 'patient' | 'therapist' | null);
            setIsLoginOpen(true);
          }} />
        </div>

        <div className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-20 md:mt-28 pb-28 md:pb-40">

          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-700 px-4 py-2 text-xs md:text-sm font-semibold text-[#0A3A78] dark:text-sky-300 mb-6">
            <span>🆘</span>
            <span>If you’re in immediate danger, call local emergency services now.</span>
          </div>

          <div className="hero-box relative z-10 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem]">
            <h1 className="font-serif text-[clamp(2.1rem,5.6vw,4.3rem)] font-semibold text-[#0A3A78] dark:text-white leading-[1.15] mb-6 tracking-tight">
              Feel better, starting in the next 2 minutes.
            </h1>
            <p className="text-[1rem] md:text-[1.25rem] text-[#1F3348] dark:text-slate-300 leading-[1.65] max-w-3xl mx-auto mb-9 font-medium opacity-95">
              MANAS360 gives you a guided mental wellness check-in and a personalized next step—private, supportive, and backed by professionals.
            </p>

            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => window.location.hash = `#/${i18n.language}/onboarding/name`}
                className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 text-[1rem] md:text-[1.08rem] rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold shadow-[0_10px_30px_rgba(30,89,255,0.36)] hover:shadow-xl hover:-translate-y-0.5 hover:brightness-105 transition-all tracking-wide"
              >
                Start My Check-In
              </button>
              <p className="text-[0.82rem] md:text-[0.92rem] font-medium text-[#3A4B5E] dark:text-slate-400">Free to begin • No credit card • Takes ~2 minutes</p>
              <a href="#how-it-works" className="text-sm md:text-base font-semibold text-[#0A3A78] dark:text-sky-300 hover:underline underline-offset-4">
                How it works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <section className="px-6 -mt-12 md:-mt-14 relative z-[120]">
        <div className="max-w-[1120px] mx-auto rounded-[24px] bg-white/95 dark:bg-[#0F172A]/95 border border-slate-200/70 dark:border-slate-700 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] px-4 md:px-8 py-5 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 text-center">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#0A3A78] dark:text-sky-300">Backed by professionals</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">120+ therapist network</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#0A3A78] dark:text-sky-300">Trusted by users</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">4.8/5 average rating</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#0A3A78] dark:text-sky-300">Security</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">256-bit encryption</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#0A3A78] dark:text-sky-300">Privacy</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">Data privacy first</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">“I felt supported from day one—simple and private.”</p>
        </div>
      </section>

      {/* FLOW CLARITY */}
      <section id="how-it-works" className="py-20 px-6 bg-[#FDFCF8] dark:bg-[#030712] scroll-mt-20">
        <div className="max-w-[1180px] mx-auto">
          <h2 className="text-center font-serif text-[2rem] md:text-[2.8rem] text-[#0A3A78] dark:text-white mb-4">Your first session in 3 steps</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 md:mb-12">No pressure. Clear expectations. One guided path from check-in to personalized support.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E59FF]">Step 1</p>
              <h3 className="mt-2 text-xl font-bold text-[#0A3A78] dark:text-white">Quick Check-In</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Answer a few guided questions in about 2 minutes.</p>
              <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">No right or wrong answers.</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E59FF]">Step 2</p>
              <h3 className="mt-2 text-xl font-bold text-[#0A3A78] dark:text-white">Personalized Path</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Get the best next step for your current needs.</p>
              <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Role choice happens inside onboarding, not on landing.</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E59FF]">Step 3</p>
              <h3 className="mt-2 text-xl font-bold text-[#0A3A78] dark:text-white">Save & Continue</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Create your account only when ready to save progress.</p>
              <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Private by design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE PRIORITY */}
      <section className="py-20 px-6 bg-[#F0F9FF] dark:bg-[#0f172a]">
        <div className="max-w-[1180px] mx-auto">
          <h2 className="text-center font-serif text-[2rem] md:text-[2.6rem] text-[#0A3A78] dark:text-white mb-10">What supports you after check-in</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[28px] p-7 md:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E59FF]">Primary support</p>
              <h3 className="mt-2 font-serif text-[1.9rem] text-[#0A3A78] dark:text-white">Virtual Therapist</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Guided, structured conversations based on your check-in results.</p>
              <a href={`#/${i18n.language}/meera-chat`} className="inline-block mt-5 text-sm font-semibold text-[#1E59FF] dark:text-sky-300 hover:underline">Learn more</a>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[28px] p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E59FF]">Support tool</p>
              <h3 className="mt-2 text-2xl font-bold text-[#0A3A78] dark:text-white">Sound Therapy</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Calming audio routines for stress, sleep, and focus.</p>
              <a href={`#/${i18n.language}/sound-therapy`} className="inline-block mt-5 text-sm font-semibold text-[#1E59FF] dark:text-sky-300 hover:underline">Learn more</a>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[28px] p-7 md:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E59FF]">Optional delight</p>
              <h3 className="mt-2 text-2xl font-bold text-[#0A3A78] dark:text-white">Digital Pet</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">A gentle habit companion to encourage consistency over time.</p>
              <a href={`#/${i18n.language}/digital-pet`} className="inline-block mt-5 text-sm font-semibold text-[#1E59FF] dark:text-sky-300 hover:underline">Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[500] md:hidden bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-700 p-3">
        <button
          type="button"
          onClick={() => window.location.hash = `#/${i18n.language}/onboarding/name`}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold tracking-wide shadow-lg"
        >
          Start My Check-In
        </button>
      </div>

      <footer className="bg-[#F8FAFC] dark:bg-[#0f172a] pt-24 pb-12 px-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-left mb-20">
            <div>
              <h4 className="font-bold text-[#0A3A78] dark:text-white mb-8 text-lg">Manas360</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">{t('about_us')}</li>
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0A3A78] dark:text-white mb-8 text-lg">{t('solutions')}</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">For Individuals</li>
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">For Business</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0A3A78] dark:text-white mb-8 text-lg">{t('support')}</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0A3A78] dark:text-white mb-8 text-lg">{t('legal')}</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">{t('footer_terms')}</li>
                <li className="hover:text-[#1E59FF] cursor-pointer transition-colors">{t('footer_privacy')}</li>
                <li
                  onClick={() => window.location.hash = `#/${i18n.language}/cancellation-refund-policy`}
                  className="hover:text-[#1E59FF] cursor-pointer transition-colors"
                >
                  Cancellation & Refund Policy
                </li>
              </ul>
            </div>
          </div>
          <div className="py-10 border-t border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed"> If you're experiencing a life-threatening emergency or crisis, please call 911 or the National Suicide Prevention Lifeline at 988. </p>
          </div>
          <div className="text-slate-400 dark:text-slate-600 text-xs font-bold tracking-widest"> © 2024 Manas360 Wellness. All rights reserved. </div>
        </div>
      </footer>
    </div>
  );
};