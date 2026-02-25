
import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storageService';
import { SubscriptionSuccessModal } from './SubscriptionSuccessModal';

export const GuruPlansPage: React.FC = () => {
  const [successData, setSuccessData] = useState<{ category: string; planName: string; price: string } | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    if (params.get('success') === 'true') {
      const planName = params.get('planName');
      const price = params.get('price');
      if (planName && price) {
        setSuccessData({ category: 'AnyTime Guru', planName, price });
      }
    }
  }, []);

  const handleBack = () => {
    window.location.hash = '#/subscribe';
  };

  const handleBilling = () => {
    window.location.hash = '#/billing';
  };

  const handleSubscribe = (planName: string, price: string) => {
    const currentPath = window.location.hash.split('?')[0];
    const returnUrl = `${currentPath}?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}`;
    window.location.hash = `#/payment-landing?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}&returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const onConfirmOk = () => {
    if (successData) {
      storageService.saveSubscription({
        category: successData.category,
        planName: successData.planName,
        price: successData.price
      });
      setSuccessData(null);
    }
  };

  const subscribeBtnClass = "w-full py-3 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all text-base";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden dark:bg-[#030712]">
      {/* Success Modal */}
      {successData && (
        <SubscriptionSuccessModal
          category={successData.category}
          planName={successData.planName}
          onOk={onConfirmOk}
        />
      )}

      {/* Background Image logic */}
      <div
        className="absolute inset-0 z-0 bg-[#EBF5FF] dark:bg-[#030712]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2560&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: document.documentElement.classList.contains('dark') ? 'blur(4px) brightness(0.2)' : 'blur(2px) brightness(1.05)',
        }}
      ></div>

      {/* Glass Container */}
      <div className="relative z-10 w-full max-w-[1180px] bg-white/80 dark:bg-[#0A0F1D]/90 backdrop-blur-3xl rounded-[32px] sm:rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white/60 dark:border-slate-800/80 flex flex-col transition-all duration-500 my-8 lg:my-0">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 py-4 md:py-4 border-b border-slate-200/50 dark:border-slate-800/50 gap-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-[#1E59FF] dark:text-white font-bold text-[0.9rem] sm:text-[1rem] hover:opacity-75 transition-all self-start sm:self-center">
            <span className="text-xl">←</span> Back
          </button>

          <div className="text-center">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#0A3A78] dark:text-white tracking-widest uppercase">
              AnyTime Guru
            </h1>
            <p className="text-[0.6rem] sm:text-[0.7rem] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">
              Coaches–Therapists: Junior available 24x7
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            <button onClick={handleBilling} className="px-5 py-2 rounded-xl border border-[#0A3A78]/10 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[#0A3A78] dark:text-sky-300 font-bold text-[0.65rem] sm:text-[0.7rem] flex items-center gap-2 hover:bg-white dark:hover:bg-slate-700 transition-all whitespace-nowrap">
              <span className="text-base">📋</span> Billing History
            </button>

            {/* Nazar Bottu / Evil Eye Icon */}
            <div className="select-none pointer-events-none drop-shadow-sm">
              <span className="text-[28px] leading-none">🧿</span>
            </div>
          </div>
        </div>

        {/* Content - Removed justify-center on mobile to prevent clipping and added pt-10 for extra header clearance */}
        <div className="pt-10 pb-6 px-4 sm:pt-10 sm:px-6 lg:p-8 flex flex-col lg:flex-row gap-4 md:gap-5 lg:justify-center items-stretch overflow-y-auto max-h-[80vh] lg:max-h-none lg:overflow-visible">

          <PlanOptionCard
            title="AnyTime Guru"
            intro="Expand your Income Streams with quick prep work!"
            items={[
              "Create insights in archived cases",
              "Therapy Summary automation",
              "Automate Session scheduling",
              "Automate prescriptions",
              "Automate Performance Review"
            ]}
            pricing="Rs 99/month – Locked for 4 months"
            btnClass={subscribeBtnClass}
            onSubscribe={() => handleSubscribe('AnyTime Guru', '₹99/month')}
          />

          <PlanOptionCard
            title="AnyTime Guru+"
            intro="AnyTimeGuru Features – Pre or Post Sessions"
            items={[
              "Case prep with symptoms study",
              "Progress tracking & prescribed practices",
              "Current Case insights & Summary",
              "Predictive Model application",
              "Strategy direction (Manas360Cases)"
            ]}
            pricing="Rs 599/month – Locked for 4 months"
            btnClass={subscribeBtnClass}
            onSubscribe={() => handleSubscribe('AnyTime Guru+', '₹599/month')}
          />

          <PlanOptionCard
            title="AnyTime Guru++"
            intro="Pre, Post & In-Progress Sessions"
            items={[
              "All AnyTime Guru+ Features",
              "Predictive Model application",
              "GURU Prompts – Real-Time In-Session",
              "Manas360 inflight session support",
              "Badge: AI Enabled Master Therapist"
            ]}
            pricing="Rs 899/month – Locked for 4 months"
            btnClass={subscribeBtnClass}
            onSubscribe={() => handleSubscribe('AnyTime Guru++', '₹899/month')}
          />

        </div>
      </div>
    </div>
  );
};

interface PlanOptionCardProps {
  title: string;
  intro?: string;
  items: string[];
  pricing?: string;
  btnClass: string;
  onSubscribe: () => void;
}

const PlanOptionCard: React.FC<PlanOptionCardProps> = ({ title, intro, items, pricing, btnClass, onSubscribe }) => (
  <div className="flex-1 bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-lg transition-all">
    <h3 className="font-serif text-[1.4rem] sm:text-[1.8rem] md:text-[2rem] font-bold text-[#0A3A78] dark:text-white mb-2 text-center leading-tight">{title}</h3>

    {intro && (
      <p className="text-slate-600 dark:text-slate-400 text-[0.75rem] sm:text-[0.85rem] md:text-sm mb-4 font-medium text-center leading-relaxed italic">
        {intro}
      </p>
    )}

    <div className="flex-grow">
      <ul className="space-y-1.5 sm:space-y-2 mb-6">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[0.8rem] sm:text-[0.85rem] md:text-[0.9rem] text-slate-700 dark:text-slate-300 leading-tight">
            <span className="text-[#1E59FF] dark:text-sky-400 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>

    <div className="mt-auto">
      {pricing && (
        <p className="text-center text-slate-800 dark:text-slate-200 text-sm md:text-base mb-4 font-bold">
          {pricing}
        </p>
      )}
      <button className={`${btnClass} py-2.5 sm:py-3 text-[0.9rem] sm:text-[1rem]`} onClick={onSubscribe}>
        Subscribe Now
      </button>
    </div>
  </div>
);
