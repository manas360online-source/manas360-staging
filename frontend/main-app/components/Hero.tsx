
import React from 'react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="hero text-center px-4 pt-10 pb-16 md:pt-10 md:pb-24 animate-fade-in-up flex flex-col items-center max-w-4xl mx-auto">
      <h1 className="font-serif text-[clamp(2.1rem,8.5vw,4.6rem)] font-semibold text-wellness-slate dark:text-slate-50 leading-[1.15] mb-5 md:mb-7 text-balance transition-colors">
        Feel better, starting in the next 2 minutes.
      </h1>

      <p className="text-[1rem] md:text-[1.3rem] text-[#1A1A1A] dark:text-slate-300 max-w-[760px] mx-auto mb-8 md:mb-10 font-sans leading-[1.65] text-balance opacity-95 transition-colors px-2">
        MANAS360 gives you a guided mental wellness check-in and a personalized next step—private, supportive, and backed by professionals.
      </p>

      <div className="flex flex-col items-center gap-5 md:gap-6 animate-fade-in-up [animation-duration:1.5s] w-full px-2">
        <button
          onClick={onStartClick}
          className="
            group
            font-sans text-[1rem] md:text-[1.1rem] font-bold
            py-4 px-10 md:py-5 md:px-14
            w-full md:w-auto
            rounded-full 
            cursor-pointer 
            bg-[#0A4E89] dark:bg-sky-600
            text-white
            border border-transparent
            shadow-[0_10px_26px_rgba(10,78,137,0.28)]
            hover:shadow-[0_14px_32px_rgba(10,78,137,0.34)]
            hover:scale-[1.01]
            active:scale-[0.98]
            transition-all duration-300 ease-out
            tracking-wide
            flex items-center justify-center gap-3
          "
        >
          Start My Check-In
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>

        <p className="text-[0.84rem] md:text-[0.92rem] text-[#334155] dark:text-slate-400 font-medium tracking-wide">
          Free to begin • No credit card • Takes ~2 minutes
        </p>

        <a href="#how-it-works" className="text-sm md:text-base text-[#0A4E89] dark:text-sky-300 font-semibold hover:underline underline-offset-4">
          How it works
        </a>
      </div>
    </section>
  );
};
