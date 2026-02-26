
import React from 'react';

export const TrustBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-[1120px] mx-auto px-4">
      <div className="
        flex flex-wrap md:flex-nowrap justify-between items-center
        gap-y-6 gap-x-5
        py-6 px-5 md:px-8
        bg-white/80 dark:bg-slate-800/60
        backdrop-blur-xl
        rounded-[24px]
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
        border border-white/50 dark:border-slate-700/50
        transition-all duration-500
      ">
        <TrustItem emoji="👩‍⚕️" title="120+ therapists" sub="Backed by licensed professionals" />
        <Divider />
        <TrustItem emoji="⭐" title="4.8/5 user rating" sub="“Simple, private, and supportive.”" />
        <Divider />
        <TrustItem emoji="🛡️" title="256-bit encrypted" sub="Privacy-first by design" />
      </div>
    </div>
  );
};

const TrustItem: React.FC<{ emoji: string; title: string; sub: string }> = ({ emoji, title, sub }) => (
  <div className="flex flex-col items-center gap-2 group flex-1 min-w-[180px] text-center">
    <div className="text-[1.8rem] transform transition-transform duration-500 group-hover:scale-105 drop-shadow-sm filter grayscale-[0.1] dark:grayscale-0">
      {emoji}
    </div>
    <div>
      <div className="text-wellness-slate dark:text-slate-100 font-bold text-[0.96rem] leading-tight mb-1 transition-colors">
        {title}
      </div>
      <div className="text-wellness-text/80 dark:text-slate-400 font-medium text-[0.82rem] transition-colors">
        {sub}
      </div>
    </div>
  </div>
);

const Divider: React.FC = () => (
  <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-slate-700/80 transition-colors"></div>
);
