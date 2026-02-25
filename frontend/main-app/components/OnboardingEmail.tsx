
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingEmailProps {
  userName: string;
}

export const OnboardingEmail: React.FC<OnboardingEmailProps> = ({ userName }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E9F5FF] to-white dark:from-slate-900 dark:to-slate-950 p-6 animate-fade-in transition-colors duration-500 relative">
      
      {/* Absolute Top Right Icon */}
      <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="w-full max-w-md">
        <h1 className="font-serif text-[2.5rem] font-bold text-[#0A3A78] dark:text-white text-center mb-4 transition-colors">
          {t('onboarding_title_email')}<span className="text-[#1E59FF] dark:text-sky-400">{userName || 'friend'}</span>.
        </h1>
        <p className="text-center text-[#2E3A48] dark:text-slate-300 mb-10 text-lg transition-colors">
          {t('onboarding_desc_email')}
        </p>

        <div className="bg-white dark:bg-[#1E293B] rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#E0F2FE] dark:border-slate-800 transition-colors">
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">{t('onboarding_email_label')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder_email')}
              className="w-full px-5 py-4 bg-[#F0F9FF] dark:bg-slate-900 border border-[#A8C8FF] dark:border-slate-700 rounded-2xl text-lg text-[#0A3A78] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E59FF] dark:focus:ring-sky-500 transition-all placeholder:text-[#0A3A78]/30 dark:placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-start gap-3 mb-10">
             <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-6 h-6 border-2 border-[#A8C8FF] dark:border-slate-600 rounded-md appearance-none checked:bg-[#1E59FF] dark:checked:bg-sky-500 checked:border-[#1E59FF] dark:checked:border-sky-500 transition-all cursor-pointer bg-white dark:bg-slate-900"
                />
                {agreed && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm pointer-events-none">✓</span>
                )}
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight pt-1">
               {t('onboarding_agree_1')}<a href="#" className="text-[#1E59FF] dark:text-sky-400 font-bold">{t('onboarding_terms')}</a>{t('onboarding_agree_2')}<a href="#" className="text-[#1E59FF] dark:text-sky-400 font-bold">{t('onboarding_privacy')}</a>.
             </p>
          </div>

          <button 
            onClick={() => alert("Welcome to Manas360! This is the end of the demo flow.")}
            disabled={!email || !agreed}
            className={`
              w-full py-4 rounded-full text-lg font-bold text-white transition-all
              ${(email && agreed) 
                ? 'bg-gradient-to-r from-[#1E59FF] to-[#004BCE] dark:from-sky-500 dark:to-sky-600 hover:shadow-xl hover:-translate-y-1' 
                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}
            `}
          >
            {t('onboarding_continue')}
          </button>
        </div>
      </div>
    </div>
  );
};
