
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storageService';

export const ARPlansPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premier' | 'plus'>('plus');
  const [activePlan, setActivePlan] = useState<'free' | 'premier' | 'plus'>('free');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successPlanName, setSuccessPlanName] = useState('');

  useEffect(() => {
    setActivePlan(storageService.getARPlan());
  }, []);

  const handleBack = () => {
    window.location.hash = `#/${i18n.language}/ar-themed-room`;
  };

  const handleBilling = () => {
    window.location.hash = `#/${i18n.language}/ar-themed-room/billing`;
  };

  const handleStartFree = () => {
    window.location.hash = `#/${i18n.language}/ar-themed-room`;
    setTimeout(() => {
      const element = document.getElementById('themes-wall');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  const handleSubscribe = (plan: 'premier' | 'plus') => {
    const planName = plan === 'premier' ? 'AR Premier' : 'AR Premier Plus';
    const price = plan === 'premier' ? '₹99/month' : '₹199/month';
    const returnUrl = `ar-themed-room?plan=${plan}`;

    // Redirect to Payment Gateway Landing
    window.location.hash = `#/payment-landing?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}&returnUrl=${encodeURIComponent('#/' + i18n.language + '/' + returnUrl)}`;
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    window.location.hash = `#/${i18n.language}/ar-themed-room`;
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A1A1A] p-4 md:p-8 flex flex-col items-center relative">

      <div className="absolute top-6 right-6 z-[2000] select-none pointer-events-none drop-shadow-sm">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="w-full max-w-[1200px] flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 pr-12 sm:pr-0">
        <button onClick={handleBack} className="text-[#0A3A78] font-bold flex items-center gap-2 hover:opacity-75 transition-opacity text-lg self-start sm:self-center">
          <span className="text-2xl">←</span> Back to AR Room
        </button>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <button onClick={handleBilling} className="px-5 py-2 rounded-xl border border-[#0A3A78]/10 bg-white/50 text-[#0A3A78] font-bold text-xs flex items-center gap-2 hover:bg-white transition-all whitespace-nowrap shadow-sm">
            <span className="text-base">📋</span> Billing History
          </button>
          <div className="font-serif text-[#0A3A78] font-bold text-xl tracking-widest hidden md:block">MANAS360</div>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] text-[#0A3A78] font-bold mb-4 leading-tight">Unlock Your Sanctuary</h1>
        <p className="text-slate-500 text-lg">Choose the immersion level that fits your life.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1200px] w-full items-stretch justify-center">

        <PricingCard
          title="Start Free"
          price="₹0"
          period="forever"
          features={[
            "Access to Boat Near Ocean",
            "Access to Green Tea Plantation",
            "Basic video quality",
            "Standard audio tracks"
          ]}
          isSelected={selectedPlan === 'free'}
          isActivePlan={false}
          onSelect={() => setSelectedPlan('free')}
          buttonLabel="Start Free"
          onButtonClick={handleStartFree}
        />

        <PricingCard
          title="Premier"
          price="₹99"
          period="/month"
          subtext="= ₹3.30/day"
          features={[
            "Everything in Free",
            "Unlock YOUR REAL ROOM (AR)",
            "Unlock Ocean Waves",
            "Higher quality audio",
            "Live Camera Experience"
          ]}
          isSelected={selectedPlan === 'premier'}
          isActivePlan={activePlan === 'premier'}
          onSelect={() => setSelectedPlan('premier')}
          buttonLabel="Subscribe ₹99"
          onButtonClick={() => handleSubscribe('premier')}
        />

        <PricingCard
          title="Premier Plus"
          price="₹199"
          period="/month"
          subtext="= ₹6.60/day"
          features={[
            "Everything in Premier",
            "Unlock Enchanted Forest",
            "Unlock Himalayan Sunrise",
            "ALL Future Themes",
            "4K Video Quality",
            "Spatial Audio Support"
          ]}
          isSelected={selectedPlan === 'plus'}
          isActivePlan={activePlan === 'plus'}
          onSelect={() => setSelectedPlan('plus')}
          buttonLabel="Subscribe ₹199"
          onButtonClick={() => handleSubscribe('plus')}
          isPopular={true}
        />

      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in-up border border-slate-100">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="font-serif text-2xl font-bold text-[#0A3A78] mb-4">Subscription Successful</h3>
            <p className="text-slate-600 mb-8 font-medium">
              You have successfully subscribed to <br /><span className="text-[#1FA2DE] font-bold text-lg">{successPlanName}</span>
            </p>
            <button
              onClick={handleModalOk}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  subtext?: string;
  features: string[];
  isSelected: boolean;
  isActivePlan?: boolean;
  onSelect: () => void;
  buttonLabel: string;
  onButtonClick: () => void;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title, price, period, subtext, features,
  isSelected, isActivePlan, onSelect, buttonLabel, onButtonClick, isPopular
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative flex flex-col p-8 rounded-[32px] cursor-pointer transition-all duration-300 border-2 w-full lg:w-1/3
        ${isSelected
          ? 'border-[#1FA2DE] bg-[#F0F9FF] shadow-[0_20px_50px_-10px_rgba(31,162,222,0.15)] scale-[1.02] z-10'
          : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl'
        }
        ${isPopular && !isSelected ? 'border-slate-200' : ''}
      `}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1FA2DE] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
          ⭐ MOST POPULAR
        </div>
      )}

      {isActivePlan && (
        <div className="absolute -top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          CURRENT PLAN
        </div>
      )}

      <h3 className={`font-serif text-xl font-bold mb-4 text-center ${isSelected ? 'text-[#0A3A78]' : 'text-slate-600'}`}>
        {title}
      </h3>

      <div className="text-center mb-8 border-b border-slate-100 pb-6">
        <div className="flex items-end justify-center leading-none">
          <span className={`text-4xl md:text-5xl font-bold ${isSelected ? 'text-[#1FA2DE]' : 'text-slate-700'}`}>{price}</span>
          <span className="text-slate-400 text-sm ml-1 font-medium mb-1">{period}</span>
        </div>
        {subtext && <p className="text-sm text-slate-400 mt-2 font-medium">{subtext}</p>}
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex gap-3 text-sm md:text-[0.95rem] text-slate-600 leading-snug">
            <span className="text-[#1FA2DE] text-lg leading-none shrink-0">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
          if (!isActivePlan) onButtonClick();
        }}
        disabled={isActivePlan}
        className={`
          w-full py-4 rounded-full font-bold text-base transition-all
          ${isActivePlan
            ? 'bg-emerald-500 text-white cursor-default shadow-none'
            : isSelected
              ? 'bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
              : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-[#1FA2DE] hover:text-[#1FA2DE]'
          }
        `}
      >
        {isActivePlan ? '✅ Subscribed' : buttonLabel}
      </button>
    </div>
  );
};
