import React from 'react';
import { useTranslation } from 'react-i18next';

export const SubscribePage: React.FC = () => {
  const { i18n } = useTranslation();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = `#/${i18n.language}/home`;
  };

  const handleBilling = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = `#/${i18n.language}/billing`;
  };

  // Button style matching the primary blue style from the Home page as requested
  const seePlansBtnClass = "px-10 py-3 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold shadow-[0_10px_20px_-5px_rgba(0,82,204,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 ease-out tracking-wide text-[1rem] flex items-center justify-center active:scale-95";

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 lg:p-8 transition-colors duration-500 relative overflow-x-hidden dark:bg-[#030712]"
    >
      {/* Background Image - Sky feel from PNG, dimmed significantly in dark mode */}
      <div 
        className="absolute inset-0 z-0 bg-[#EBF5FF] dark:bg-[#030712]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2560&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: document.documentElement.classList.contains('dark') ? 'blur(4px) brightness(0.2)' : 'blur(2px) brightness(1.05)',
        }}
      ></div>

      {/* Background Soft Overlay */}
      <div className="absolute inset-0 z-1 bg-white/30 dark:bg-slate-950/60 pointer-events-none"></div>

      {/* Main Container - Adjusted for "medium" size and enhanced dark mode visibility */}
      <div className="relative z-10 w-full max-w-[1000px] bg-white/80 dark:bg-[#0A0F1D]/90 backdrop-blur-3xl rounded-[32px] sm:rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/60 dark:border-slate-800/80 flex flex-col transition-all duration-500 my-8 sm:my-0">
        
        {/* Header Navigation Area - matching PNG layout with high contrast dark mode buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-12 py-4 md:py-6 border-b border-slate-200/50 dark:border-slate-800/50 gap-4">
          <button 
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1E59FF] dark:text-white font-bold text-[1.1rem] hover:opacity-75 transition-all group self-start sm:self-center"
          >
            <span className="text-2xl transition-transform group-hover:-translate-x-1">←</span> Back
          </button>

          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Billing Button - Fixed hover behavior and contrast in dark mode */}
            <button 
              type="button"
              onClick={handleBilling}
              className="px-6 py-2.5 rounded-full border border-transparent dark:border-slate-700 bg-white/70 dark:bg-[#1f2937] text-[#0A3A78] dark:text-white font-bold text-[0.65rem] sm:text-xs flex items-center gap-2 hover:bg-white dark:hover:bg-[#374151] transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              <span className="text-lg">📋</span> Billing / Subscription History
            </button>

            {/* Nazar Bottu / Evil Eye Icon */}
            <div className="select-none pointer-events-none drop-shadow-sm">
              <span className="text-[28px] leading-none">🧿</span>
            </div>
          </div>
        </div>

        {/* 2x2 Layout Section - Main Content Area */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full">
            
            <PlanCard 
              title="Patients" 
              subtitle="Features and fees" 
              buttonClass={seePlansBtnClass}
              onClick={() => window.location.hash = `#/${i18n.language}/subscribe/patients`}
            />

            <PlanCard 
              title="Therapists" 
              subtitle="Features and fees" 
              buttonClass={seePlansBtnClass}
              onClick={() => window.location.hash = `#/${i18n.language}/subscribe/therapists`}
            />

            <PlanCard 
              title="Corporates / Hospitals / Education Institutes" 
              subtitle="Features and fees" 
              buttonClass={seePlansBtnClass}
              onClick={() => window.location.hash = `#/${i18n.language}/subscribe/corporate`}
              isSmallerHeader
            />

            <PlanCard 
              title="AnyTime Guru" 
              subtitle="Coaches-Therapists: available 24x7" 
              buttonClass={seePlansBtnClass}
              onClick={() => window.location.hash = `#/${i18n.language}/subscribe/guru`}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

interface PlanCardProps {
  title: string;
  subtitle: string;
  buttonClass: string;
  isSmallerHeader?: boolean;
  onClick?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, subtitle, buttonClass, isSmallerHeader, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-[#0F172A] p-6 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-50 dark:border-slate-800/60 flex flex-col items-center text-center justify-center transition-all hover:shadow-xl hover:-translate-y-1 h-full min-h-[180px] sm:min-h-[220px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center flex-1 justify-center w-full">
        <h3 className={`font-serif font-bold text-[#0A3A78] dark:text-white mb-2 leading-tight transition-colors 
          ${isSmallerHeader 
            ? 'text-[1.2rem] sm:text-[1.4rem] md:text-[1.8rem]' 
            : 'text-[1.8rem] sm:text-[2.2rem] md:text-[2.5rem]'}`}>
          {title}
        </h3>
        <p className="text-slate-400 dark:text-slate-400 font-medium text-[0.85rem] sm:text-[0.95rem] transition-colors">
          {subtitle}
        </p>
      </div>
      <div className="mt-4 sm:mt-6 w-full flex justify-center">
        <button 
          type="button" 
          className={`${buttonClass} w-full sm:w-auto !py-2.5 sm:!py-3 !text-[0.9rem] sm:!text-[1rem]`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent double firing if clicking button
            onClick && onClick();
          }}
        >
          See Plans
        </button>
      </div>
    </div>
  );
};