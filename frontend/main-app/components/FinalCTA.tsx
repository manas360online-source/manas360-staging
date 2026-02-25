
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FinalCTAProps {
  onStartClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartClick }) => {
  const { t } = useTranslation();

  return (
    <section className="text-center px-5 py-20 reveal max-w-4xl mx-auto">
      <h2 className="font-serif text-[3rem] font-medium text-wellness-slate dark:text-slate-50 leading-[1.2] mb-10 animate-breathe transition-colors">
        {t('final_cta_title')} <span className="text-[#0A4E89] dark:text-sky-300 italic transition-colors">{t('final_cta_better')}</span>{t('final_cta_title_end')}
      </h2>
      
      <div className="flex flex-col items-center gap-5">
        <button
          onClick={onStartClick}
          className="
            font-sans text-[1.2rem] font-bold 
            py-6 px-16
            rounded-full 
            cursor-pointer 
            bg-[#0A3157] dark:bg-slate-700 text-white
            border-2 border-transparent dark:border-slate-600
            shadow-[0_15px_30px_rgba(30,41,59,0.2)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.2)]
            transition-all duration-300 ease-out
            uppercase tracking-[2px]
            hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(30,41,59,0.3)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
            hover:bg-[#124A85] dark:hover:bg-slate-600
            active:bg-[#06223F]
          "
        >
          {t('begin_journey')}
        </button>
        <p className="mt-6 text-wellness-text dark:text-slate-400 text-sm tracking-wide opacity-80 transition-colors">
          {t('final_cta_sub')}
        </p>
      </div>
    </section>
  );
};
