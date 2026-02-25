
import React from 'react';
import { useTranslation } from 'react-i18next';

export const TrustBar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-[1100px] mx-auto px-4">
      <div className="
        flex flex-wrap md:flex-nowrap justify-around items-center 
        gap-y-10 gap-x-6
        py-12 px-8 md:px-12
        bg-white/80 dark:bg-slate-800/60
        backdrop-blur-xl
        rounded-[40px] 
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
        border border-white/50 dark:border-slate-700/50
        transition-all duration-500
      ">
        
        {/* Item 1 */}
        <TrustItem 
          emoji="🔒" 
          title={t('trust_1_title')} 
          sub={t('trust_1_sub')} 
        />

        <Divider />

        {/* Item 2 */}
        <TrustItem 
          emoji="🌿" 
          title={t('trust_2_title')} 
          sub={t('trust_2_sub')} 
        />

        <Divider />

        {/* Item 3 */}
        <TrustItem 
          emoji="💙" 
          title={t('trust_3_title')} 
          sub={t('trust_3_sub')} 
        />

        <Divider />

        {/* Item 4 */}
        <TrustItem 
          emoji="⚡" 
          title={t('trust_4_title')} 
          sub={t('trust_4_sub')} 
        />

      </div>
    </div>
  );
};

const TrustItem: React.FC<{ emoji: string; title: string; sub: string }> = ({ emoji, title, sub }) => (
  <div className="flex flex-col items-center gap-3 group flex-1 min-w-[140px] text-center">
    <div className="text-[2.5rem] mb-1 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-sm filter grayscale-[0.2] dark:grayscale-0 group-hover:grayscale-0">
      {emoji}
    </div>
    <div>
      <div className="text-wellness-slate dark:text-slate-100 font-bold text-[1.1rem] leading-tight mb-1 transition-colors">
        {title}
      </div>
      <div className="text-wellness-text/80 dark:text-slate-400 font-medium text-[0.9rem] transition-colors">
        {sub}
      </div>
    </div>
  </div>
);

const Divider: React.FC = () => (
  <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-slate-700/80 transition-colors"></div>
);
