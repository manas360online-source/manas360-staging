import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storageService';

export const SoundPricingPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'daily' | 'complete'>('complete');
  const [activePlan, setActivePlan] = useState<'free' | 'daily' | 'complete'>('free');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successPlanName, setSuccessPlanName] = useState('');

  useEffect(() => {
    setActivePlan(storageService.getSoundTherapyPlan());

    // Check for success callback from payment gateway
    const hash = window.location.hash;
    const queryString = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    if (params.get('success') === 'true') {
      const planParam = params.get('plan'); // Recover plan from return URL
      if (planParam) {
        setSuccessPlanName(planParam === 'daily' ? 'Daily Sanctuary' : 'Complete Sanctuary');
      }
      setShowSuccessModal(true);
    }
  }, [i18n.language]);

  const handleBack = () => {
    window.location.hash = `#/${i18n.language}/sound-therapy`;
  };

  // Navigate to Sound Therapy Specific Billing History
  const handleBilling = () => {
    window.location.hash = `#/${i18n.language}/sound-therapy/billing`;
  };

  const handleStartFree = () => {
    // Redirect to free player section
    window.location.hash = `#/${i18n.language}/sound-therapy`;
    // Wait for page transition (approx 300-400ms in App.tsx) then scroll
    setTimeout(() => {
      const element = document.getElementById('free-player');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  const handleSubscribe = (plan: 'daily' | 'complete') => {
    const planName = plan === 'daily' ? 'Daily Sanctuary' : 'Complete Sanctuary';
    const price = plan === 'daily' ? '₹99/month' : '₹199/month';
    const planId = plan === 'daily' ? 'daily' : 'complete';

    // We append the plan ID to the return URL so we know what we bought when we come back
    const returnUrl = `sound-therapy/plans?plan=${planId}`;

    setSuccessPlanName(planName);

    // Redirect to Payment Gateway Landing
    window.location.hash = `#/payment-landing?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}&returnUrl=${encodeURIComponent('#/' + i18n.language + '/' + returnUrl)}`;
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);

    // actually save the subscription now that it's confirmed (Simulated)
    // In a real app, the backend would have done this via webhook
    // But for this frontend-only demo flow:
    const pendingPlanName = successPlanName || 'Complete Sanctuary'; // Default fallback
    const isDaily = pendingPlanName.includes('Daily');
    const planKey = isDaily ? 'daily' : 'complete';

    storageService.saveSoundTherapyPlan(planKey);
    storageService.saveSubscription({
      category: 'Sound Therapy',
      planName: pendingPlanName,
      price: isDaily ? '₹99/month' : '₹199/month'
    });

    setActivePlan(planKey);

    // Go back to Sound Therapy main page
    window.location.hash = `#/${i18n.language}/sound-therapy`;
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A1A1A] p-4 md:p-8 flex flex-col items-center relative">

      {/* ABSOLUTE NAZAR BOTTU - TOP RIGHT CORNER OF PAGE */}
      <div className="absolute top-6 right-6 z-[2000] select-none pointer-events-none drop-shadow-sm">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      {/* Header - Added pr-12 to prevent overlap on smaller screens with absolute icon */}
      <div className="w-full max-w-[1200px] flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 pr-12 sm:pr-0">
        <button onClick={handleBack} className="text-[#0A3A78] font-bold flex items-center gap-2 hover:opacity-75 transition-opacity text-lg self-start sm:self-center">
          <span className="text-2xl">←</span> Back to Sanctuary
        </button>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <button onClick={handleBilling} className="px-5 py-2 rounded-xl border border-[#0A3A78]/10 bg-white/50 text-[#0A3A78] font-bold text-xs flex items-center gap-2 hover:bg-white transition-all whitespace-nowrap shadow-sm">
            <span className="text-base">📋</span> Billing History
          </button>
          <div className="font-serif text-[#0A3A78] font-bold text-xl tracking-widest hidden md:block">MANAS360</div>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] text-[#0A3A78] font-bold mb-4 leading-tight">Invest in Your Peace</h1>
        <p className="text-slate-500 text-lg">Choose the sanctuary that fits your life.</p>
      </div>

      {/* Pricing Cards Container */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1200px] w-full items-stretch justify-center">

        {/* CARD 1: FREE TIER – "First Breath" */}
        <PricingCard
          title="First Breath"
          price="₹0"
          period="forever"
          features={[
            "3 intro tracks (5 min each)",
            "1 new free track per month",
            "Ads every 3rd track"
          ]}
          isSelected={selectedPlan === 'free'}
          isActivePlan={false} // Always show as available to start free, never "Subscribed" green state
          onSelect={() => setSelectedPlan('free')}
          buttonLabel="Start Free"
          onButtonClick={handleStartFree}
        />

        {/* CARD 2: TIER 1 – "Daily Sanctuary" */}
        <PricingCard
          title="Daily Sanctuary"
          price="₹99"
          period="/month"
          subtext="= ₹3.30/day"
          features={[
            "UNLIMITED Flute Collection (50+ tracks)",
            "432Hz Frequency Collection (10 tracks)",
            "Basic Nature Sounds (15 tracks)",
            "Ad-free",
            "Download for offline",
            "Sleep timer"
          ]}
          isSelected={selectedPlan === 'daily'}
          isActivePlan={activePlan === 'daily'}
          onSelect={() => setSelectedPlan('daily')}
          buttonLabel="Subscribe ₹99"
          onButtonClick={() => handleSubscribe('daily')}
        />

        {/* CARD 3: TIER 2 – "Complete Sanctuary" */}
        <PricingCard
          title="Complete Sanctuary"
          price="₹199"
          period="/month"
          subtext="= ₹6.60/day"
          features={[
            "Everything in Daily Sanctuary PLUS:",
            "Chakra & Om Chants (15 tracks)",
            "Immersive Environments (30+ tracks)",
            "Binaural Beats Collection",
            "Solfeggio Frequencies (174–963 Hz)",
            "3D Spatial Audio",
            "Mix your own environment",
            "Zero ads, ever",
            "Studio-quality audio (FLAC)"
          ]}
          isSelected={selectedPlan === 'complete'}
          isActivePlan={activePlan === 'complete'}
          onSelect={() => setSelectedPlan('complete')}
          buttonLabel="Subscribe ₹199"
          onButtonClick={() => handleSubscribe('complete')}
          isPopular={true}
        />

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in-up border border-slate-100">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="font-serif text-2xl font-bold text-[#0A3A78] mb-4">Demo Subscription Successful</h3>
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