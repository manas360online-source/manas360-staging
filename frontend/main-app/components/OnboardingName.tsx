
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingNameProps {
  onNext: (data: { firstName: string; lastName: string; pronouns: string }) => void;
}

export const OnboardingName: React.FC<OnboardingNameProps> = ({ onNext }) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E9F5FF] to-white dark:from-slate-900 dark:to-slate-950 p-6 animate-fade-in transition-colors duration-500 relative">
      
      {/* Absolute Top Right Icon */}
      <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="w-full max-w-md">
        <h1 className="font-serif text-[2.5rem] font-bold text-[#0A3A78] dark:text-white text-center mb-4 transition-colors">
          {t('onboarding_title_name')}
        </h1>
        <p className="text-center text-[#2E3A48] dark:text-slate-300 mb-10 text-lg transition-colors">
          {t('onboarding_desc_name')}
        </p>

        <div className="bg-white dark:bg-[#1E293B] rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#E0F2FE] dark:border-slate-800 transition-colors">
          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">{t('onboarding_first_name')}</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('placeholder_first_name')}
                className="w-full px-5 py-4 bg-[#F0F9FF] dark:bg-slate-900 border border-[#A8C8FF] dark:border-slate-700 rounded-2xl text-lg text-[#0A3A78] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E59FF] dark:focus:ring-sky-500 transition-all placeholder:text-[#0A3A78]/30 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">{t('onboarding_last_name')}</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('placeholder_last_name')}
                className="w-full px-5 py-4 bg-[#F0F9FF] dark:bg-slate-900 border border-[#A8C8FF] dark:border-slate-700 rounded-2xl text-lg text-[#0A3A78] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E59FF] dark:focus:ring-sky-500 transition-all placeholder:text-[#0A3A78]/30 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">{t('onboarding_pronouns')}</label>
            <input 
              type="text" 
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder={t('placeholder_pronouns')}
              className="w-full px-5 py-4 bg-[#F0F9FF] dark:bg-slate-900 border border-[#A8C8FF] dark:border-slate-700 rounded-2xl text-lg text-[#0A3A78] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E59FF] dark:focus:ring-sky-500 transition-all placeholder:text-[#0A3A78]/30 dark:placeholder:text-slate-600"
            />
          </div>

          <button 
            onClick={() => {
              if (firstName && lastName) onNext({ firstName, lastName, pronouns });
            }}
            disabled={!firstName || !lastName}
            className={`
              w-full py-4 rounded-full text-lg font-bold text-white transition-all
              ${(firstName && lastName) 
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
