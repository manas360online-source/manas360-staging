
import React from 'react';
import { useTranslation } from 'react-i18next';

export const CrisisBanner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-3 px-4 text-center z-[1000] text-[0.9rem] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.2)] transition-colors duration-500">
      <span className="font-bold mr-2 text-[#0A4E89] dark:text-sky-300 transition-colors">{t('crisis_banner')}</span>
      <a 
        href="tel:18005990019" 
        className="text-[#1FA2DE] dark:text-sky-400 hover:text-[#0A4E89] dark:hover:text-sky-200 underline font-bold transition-colors tracking-wide"
      >
        {t('call_tele_manas')}
      </a>
    </div>
  );
};
