
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Testimonial: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-12 px-5 text-center my-10 relative z-10">
      <div className="max-w-[900px] mx-auto relative">
        
        {/* Decorative Elements */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-[6rem] text-sky-100 dark:text-slate-700/40 font-serif leading-none select-none transition-colors duration-500">
          “
        </div>

        <div className="
          relative bg-white dark:bg-slate-800/80
          rounded-[40px] p-12 md:p-20 
          shadow-[0_20px_60px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)]
          border border-slate-50 dark:border-slate-700
          animate-fade-in
          transition-colors duration-500
        ">
          
          <p className="font-serif text-[1.6rem] md:text-[2rem] font-light text-wellness-slate dark:text-slate-100 leading-[1.5] mb-10 relative z-10 text-balance transition-colors duration-300">
            {t('testimonial_text')}
          </p>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-indigo-50 dark:from-slate-700 dark:to-slate-600 mb-4 flex items-center justify-center text-2xl shadow-inner transition-colors">
               🌸
            </div>
            <p className="text-[1.1rem] text-wellness-slate dark:text-slate-50 font-bold tracking-wide transition-colors duration-300">
              {t('testimonial_author')}
            </p>
            <p className="text-[0.95rem] text-wellness-text dark:text-slate-400 transition-colors duration-300">
              {t('testimonial_loc')}
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};
