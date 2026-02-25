
import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storageService';
import { SubscriptionSuccessModal } from './SubscriptionSuccessModal';

export const CorporatePlansPage: React.FC = () => {
  const [successData, setSuccessData] = useState<{ category: string; planName: string; price: string } | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    if (params.get('success') === 'true') {
      const planName = params.get('planName');
      const price = params.get('price');
      if (planName && price) {
        setSuccessData({ category: 'Corporates', planName, price });
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

  const subscribeBtnClass = "w-full py-2.5 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all text-[0.85rem]";

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

      {/* Background Image */}
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
      <div className="relative z-10 w-full max-w-[1250px] bg-white/80 dark:bg-[#0A0F1D]/90 backdrop-blur-3xl rounded-[32px] sm:rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white/60 dark:border-slate-800/80 flex flex-col transition-all duration-500 my-8 lg:my-0">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 py-4 md:py-4 border-b border-slate-200/50 dark:border-slate-800/50 gap-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-[#1E59FF] dark:text-white font-bold text-[0.9rem] sm:text-[1rem] hover:opacity-75 transition-all self-start sm:self-center">
            <span className="text-xl">←</span> Back
          </button>

          <h1 className="font-serif text-sm sm:text-base md:text-xl font-bold text-[#0A3A78] dark:text-white tracking-widest uppercase text-center px-4 leading-tight">
            CORPORATES / HOSPITALS / EDUCATION INSTITUTES
          </h1>

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

        {/* Content - 2 Column Layout */}
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch overflow-y-auto max-h-[80vh] lg:max-h-[85vh] lg:overflow-y-visible">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            <PlanOptionCard
              title="Corporates – Mid Size"
              items={[
                "Rs 399/employee/year",
                "2 Group Sessions/Quarter",
                "Free Assessment – AI",
                "Free Access to Therapists",
                "Therapist Sessions – 10% off",
                "Performance Tracker",
                "Free Access to Daily Practices"
              ]}
              btnClass={subscribeBtnClass}
              onSubscribe={() => handleSubscribe('Corporates – Mid Size', '₹399/emp/yr')}
            />

            <PlanOptionCard
              title="Education Institutes"
              items={[
                "Rs 99/student/year",
                "2 Group Sessions/Quarter",
                "Free Assessment – AI",
                "Mood Chatbot & 10% session off",
                "Performance Tracker",
                "Daily Practices – Audio",
                "AnytimeBUDDY – Rs 99/session"
              ]}
              btnClass={subscribeBtnClass}
              onSubscribe={() => handleSubscribe('Education Institutes', '₹99/std/yr')}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            <PlanOptionCard
              title="Corporates / Speciality – Large"
              items={[
                "Rs 499/employee/year",
                "3 Group Sessions/Quarter",
                "Assessment, Therapists, Bot",
                "Daily Practices – AR/VR",
                "Crisis Predictor – AI Avatar",
                "AnytimeBUDDY – Rs 99/session",
                "NLP & Aatman Engineering Library",
                "1-on-1 Session – 10% discount"
              ]}
              btnClass={subscribeBtnClass}
              onSubscribe={() => handleSubscribe('Corporates – Large', '₹499/emp/yr')}
            />

            <PlanOptionCard
              title="Corporates – Executive"
              items={[
                "Rs 999/employee/year",
                "2 Exec Behavioral Sessions / Qtr",
                "AR/VR Daily Practices",
                "Crisis Predictor – AI Avatar",
                "Couple Therapy – 10% Discount",
                "AnytimeBUDDY – Rs 99/session",
                "Certified Leadership Master Coach",
                "1-on-1 – Rs 1499 – 10% discount"
              ]}
              btnClass={subscribeBtnClass}
              onSubscribe={() => handleSubscribe('Corporates – Executive', '₹999/emp/yr')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

interface PlanOptionCardProps {
  title: string;
  items: string[];
  pricing?: string;
  btnClass: string;
  onSubscribe: () => void;
}

const PlanOptionCard: React.FC<PlanOptionCardProps> = ({ title, items, pricing, btnClass, onSubscribe }) => (
  <div className="flex-1 bg-white dark:bg-[#0F172A] p-5 rounded-[20px] sm:rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-lg transition-all">
    <h3 className="font-serif text-[1.1rem] sm:text-[1.3rem] md:text-[1.4rem] font-bold text-[#0A3A78] dark:text-white mb-3 text-center leading-tight">
      {title}
    </h3>

    <div className="flex-grow">
      <ul className="space-y-1 mb-5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[0.75rem] sm:text-[0.8rem] text-slate-700 dark:text-slate-300 leading-tight">
            <span className="text-[#1E59FF] dark:text-sky-400 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>

    <div className="mt-auto">
      {pricing && (
        <p className="text-center text-slate-700 dark:text-slate-400 text-[0.7rem] sm:text-[0.75rem] mb-3 font-medium italic">
          {pricing}
        </p>
      )}
      <button className={`${btnClass} py-2 sm:py-2.5 text-[0.8rem] sm:text-[0.85rem]`} onClick={onSubscribe}>
        Subscribe Now
      </button>
    </div>
  </div>
);
