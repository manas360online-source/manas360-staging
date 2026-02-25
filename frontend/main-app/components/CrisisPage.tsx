
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CrisisPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showCounselor, setShowCounselor] = useState(false);

  const handleBack = () => {
    if (window.location.hash.includes('source=free-tools')) {
      window.location.hash = `#/${i18n.language}/free-tools`;
    } else {
      window.location.hash = '#/assessment';
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF2F2] dark:bg-[#1a0505] flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors duration-500 relative">
      
      {/* Back Button */}
      <button 
        onClick={handleBack} 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 transition-colors font-bold text-sm"
      >
        ← {t('back')}
      </button>

      <div className="max-w-2xl bg-white dark:bg-[#2c0b0e] p-8 md:p-12 rounded-[40px] shadow-xl border border-red-100 dark:border-red-900/30 transition-colors duration-500">
        
        {/* Warning Icon */}
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner transition-colors">
          🚨
        </div>

        <h1 className="font-serif text-[2.5rem] font-bold text-red-700 dark:text-red-200 leading-tight mb-4 transition-colors">
          {t('critical_title')}
        </h1>
        
        <p className="text-xl font-medium text-slate-700 dark:text-red-100/80 mb-2 transition-colors">
          {t('immediate_action')}
        </p>
        
        <p className="text-lg text-slate-500 dark:text-slate-300 mb-10 transition-colors">
          {t('not_alone_msg')} <span className="font-bold text-red-600 dark:text-red-400">{t('right_now')}</span>.
        </p>

        <div className="space-y-4 w-full max-w-md mx-auto mb-12">
          <a href="tel:18005990019" className="block w-full py-4 bg-red-600 dark:bg-red-700 text-white rounded-full font-bold text-lg hover:bg-red-700 dark:hover:bg-red-600 transition shadow-lg shadow-red-200 dark:shadow-none">
            {t('call_tele_btn')}
          </a>
          
          <a href="sms:988?body=HELP" className="block w-full py-4 bg-white dark:bg-transparent text-red-600 dark:text-red-300 border-2 border-red-100 dark:border-red-800 rounded-full font-bold text-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            {t('text_help_btn')}
          </a>
          
          <a href="tel:112" className="block w-full py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-full font-bold text-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition">
             {t('emergency_btn')}
          </a>
        </div>

        <div className="pt-8 border-t border-red-50 dark:border-red-900/30 transition-colors">
          <p className="font-serif text-2xl text-slate-800 dark:text-slate-200 mb-6 transition-colors">{t('safe_question')}</p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowCounselor(true)}
              className="px-8 py-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-bold rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
            >
              {t('safe_yes_btn')}
            </button>
            <a 
              href="tel:112"
              className="px-8 py-3 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 font-bold rounded-full hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
            >
              {t('safe_no_btn')}
            </a>
          </div>

          {showCounselor && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-800 dark:text-emerald-100 text-sm animate-fade-in-up border border-emerald-100 dark:border-emerald-800/50">
              {t('safe_response')}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
