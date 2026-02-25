
import React from 'react';
import { useTranslation } from 'react-i18next';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-10 px-4 text-center relative z-10">
      <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] font-medium text-black dark:text-slate-50 mb-6 tracking-tight animate-fade-in-down transition-colors duration-300">
        {t('hiw_title')}
      </h2>
      <p className="text-[#1A1A1A] dark:text-slate-300 text-lg max-w-2xl mx-auto mb-20 leading-relaxed transition-colors duration-300">
        {t('hiw_desc')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        
        {/* Card 1 */}
        <StepCard 
          title={t('step_1_title')}
          description={t('step_1_desc')}
          footer={t('step_1_footer')}
          delay="0s"
        />

        {/* Card 2 */}
        <StepCard 
          title={t('step_2_title')}
          description={t('step_2_desc')}
          footer={t('step_2_footer')}
          delay="0.1s"
        />

        {/* Card 3 */}
        <StepCard 
          title={t('step_3_title')}
          description={t('step_3_desc')}
          footer={t('step_3_footer')}
          delay="0.2s"
        />

      </div>
    </section>
  );
};

interface StepCardProps {
  title: string;
  description: string;
  footer: string;
  delay: string;
}

const StepCard: React.FC<StepCardProps> = ({ title, description, footer, delay }) => {
  return (
    <div 
      className="reveal group relative flex flex-col justify-between p-8 md:p-10 rounded-[32px] text-left transition-all duration-500 bg-[#F0F7FF] dark:bg-slate-900 border border-blue-50/50 dark:border-slate-800 shadow-[0_15px_45px_-12px_rgba(14,165,233,0.12)] dark:shadow-none hover:-translate-y-2 hover:shadow-[0_20px_55px_-12px_rgba(14,165,233,0.2)] dark:hover:bg-slate-800"
      style={{ transitionDelay: delay }}
    >
      <div className="relative z-10 pt-2">
        <h3 className="text-[1.5rem] font-serif font-bold text-black dark:text-slate-100 mb-4 tracking-wide leading-tight transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[1.05rem] text-black dark:text-slate-300 leading-[1.7] mb-6 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      <div className="relative z-10 mt-6 pt-6 border-t border-blue-100 dark:border-slate-800 transition-colors">
        <p className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-[#0A4E89] dark:text-sky-400">
          {footer}
        </p>
      </div>
    </div>
  );
};
