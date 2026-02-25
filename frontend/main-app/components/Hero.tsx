
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  const { t } = useTranslation();

  return (
    <section className="hero text-center px-4 pt-8 pb-12 md:pt-8 md:pb-24 animate-fade-in-up flex flex-col items-center max-w-4xl mx-auto">
      <h1 className="font-serif text-[clamp(2.25rem,9vw,5rem)] font-normal text-wellness-slate dark:text-slate-50 leading-[1.1] mb-6 md:mb-8 animate-breathe drop-shadow-sm text-balance transition-colors">
        {t('hero_title_1')} <span className="font-medium text-[#0A4E89] dark:text-slate-50 relative inline-block transition-colors">
          {t('hero_title_2')}
          <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-sky-200/60 dark:text-sky-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
          </svg>
        </span>
        {t('hero_title_3')} <span className="font-medium text-[#0A4E89] dark:text-slate-50 transition-colors">{t('hero_title_4')}</span>.
      </h1>

      <p className="text-[1.1rem] md:text-[1.5rem] text-[#1A1A1A] dark:text-slate-300 max-w-[680px] mx-auto mb-10 md:mb-14 font-sans leading-[1.6] md:leading-[1.7] tracking-wide text-balance opacity-95 transition-colors px-2">
        {t('hero_subtitle')}
        <br className="hidden md:block"/>
        <span className="text-[#1FA2DE] dark:text-sky-300 font-bold text-[1.1rem] md:text-[1.25rem] mt-3 block drop-shadow-sm transition-colors">
          {t('hero_time')}
        </span>
      </p>

      <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-up [animation-duration:1.5s] w-full px-2">
        <button
          onClick={onStartClick}
          className="
            group
            font-sans text-[1rem] md:text-[1.1rem] font-bold 
            py-4 px-10 md:py-5 md:px-16
            w-full md:w-auto
            rounded-full 
            cursor-pointer 
            bg-white dark:bg-slate-700
            text-[#0A4E89] dark:text-slate-50
            border-2 border-transparent dark:border-slate-600
            shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
            hover:shadow-[0_15px_40px_rgba(14,165,233,0.25)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]
            hover:scale-[1.02] dark:hover:bg-slate-600
            active:scale-[0.98]
            transition-all duration-300 ease-out
            uppercase tracking-widest
            flex items-center justify-center gap-3
          "
        >
          {t('start_checkin')}
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.85rem] md:text-[0.95rem] text-[#1A1A1A]/80 dark:text-slate-400 font-medium tracking-wide transition-colors">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500"></span> {t('confidential')}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500"></span> {t('no_judgment')}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></span> {t('immediate')}
          </span>
        </div>
      </div>
    </section>
  );
};
