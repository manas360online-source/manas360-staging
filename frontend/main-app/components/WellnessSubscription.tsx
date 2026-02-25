
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PATIENT_PLANS } from '../config/PRICING_CONFIG';

/**
 * WellnessSubscription Component
 * Updated to use real pricing from PRICING_CONFIG (Premium Monthly ₹299)
 * Previously showed fake ₹99/month plan that didn't exist in backend
 */
export const WellnessSubscription: React.FC = () => {
    const { i18n } = useTranslation();

    // Use real Premium Monthly plan (₹299/month)
    const premiumPlan = PATIENT_PLANS.BUDDY; // Maps to premium_monthly

    const handleSubscribe = () => {
        const returnUrl = `#/${i18n.language}/wellness-subscription`;
        window.location.hash = `#/payment-landing?planName=${encodeURIComponent(premiumPlan.displayName)}&price=${encodeURIComponent(`${premiumPlan.displayPrice}/${premiumPlan.period}`)}&returnUrl=${encodeURIComponent(returnUrl)}`;
    };

    const handleBack = () => {
        window.location.hash = `#/${i18n.language}/profile-setup`;
    };

    return (
        <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#020617] flex flex-col items-center justify-center px-4 py-8 transition-colors duration-500 relative overflow-hidden">

            {/* Back Button */}
            <button
                onClick={handleBack}
                className="absolute top-4 left-6 flex items-center gap-2 text-[#0A3A78] dark:text-sky-400 font-bold text-base hover:opacity-75 transition-opacity z-10"
            >
                <span className="text-xl">←</span> Back
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[400px] bg-white dark:bg-[#1E293B] rounded-[32px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-white dark:border-slate-800 relative z-20 overflow-hidden flex flex-col">

                {/* Top Header - UPDATED WITH REAL PRICING */}
                <div className="pt-6 pb-4 text-center">
                    <h2 className="text-[0.65rem] font-bold text-[#4F46E5] uppercase tracking-[0.2em] mb-2">Platform Access</h2>
                    <div className="flex flex-col items-center">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[1.8rem] font-serif font-bold text-[#4F46E5] italic">{premiumPlan.displayPrice}</span>
                            <span className="text-slate-400 font-medium text-base">/{premiumPlan.period}</span>
                        </div>
                        <p className="text-slate-400 text-[0.6rem] mt-1 font-medium">Premium Monthly Plan</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="px-10">
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-700 w-full"></div>
                </div>

                {/* Included Section - Updated with real features */}
                <div className="px-6 pt-5 pb-6 space-y-3">
                    <h3 className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Included:</h3>

                    <FeatureItem
                        icon="/icons/assessment.png"
                        title="AI Assessments"
                        desc="PHQ-9, GAD-7, wellness screenings — unlimited"
                        bgColor="bg-sky-500"
                        iconText="AI"
                    />

                    <FeatureItem
                        icon="/icons/chatbot.png"
                        title="AnytimeBUDDY - 24/7"
                        desc="AI assistant available anytime in your language"
                        bgColor="bg-violet-100 dark:bg-violet-900/40"
                        customIcon={<span className="text-lg">🤖</span>}
                    />

                    <FeatureItem
                        icon="/icons/monitoring.png"
                        title="Talk2Buddy Access"
                        desc="Digital human support & mood chatbot (Dr. Manu)"
                        bgColor="bg-emerald-100 dark:bg-emerald-900/40"
                        customIcon={<span className="text-lg">💬</span>}
                    />

                    <FeatureItem
                        icon="/icons/library.png"
                        title="AR/VR Practices"
                        desc="Dr. Maya AR daily practices on smartphone"
                        bgColor="bg-orange-100 dark:bg-orange-900/40"
                        customIcon={<span className="text-lg">🥽</span>}
                    />

                    <FeatureItem
                        icon="/icons/pet.png"
                        title="Performance Tracker"
                        desc="Track your wellness journey & progress"
                        bgColor="bg-amber-100 dark:bg-amber-900/40"
                        customIcon={<span className="text-lg">📊</span>}
                    />
                </div>

                {/* Subscribe Button - UPDATED */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleSubscribe}
                        className="w-full py-4 rounded-[16px] bg-[#4F46E5] text-white font-bold text-base hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <>
                            Subscribe {premiumPlan.displayPrice}/{premiumPlan.period} <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </>
                    </button>
                </div>

            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 dark:bg-indigo-900/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50 dark:bg-sky-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>
        </div>
    );
};

interface FeatureItemProps {
    icon: string;
    title: string;
    desc: string;
    bgColor: string;
    iconText?: string;
    customIcon?: React.ReactNode;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, desc, bgColor, iconText, customIcon }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900/30 shadow-sm transition-all hover:border-slate-200 hover:shadow-md cursor-default group">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
            {customIcon ? customIcon : (
                <span className="text-white font-black text-[0.6rem] tracking-tighter italic">{iconText}</span>
            )}
        </div>
        <div className="flex flex-col">
            <h4 className="font-bold text-[#0A3A78] dark:text-slate-200 text-[0.8rem] leading-none mb-0.5">{title}</h4>
            <p className="text-slate-400 dark:text-slate-500 text-[0.6rem] font-medium leading-tight">{desc}</p>
        </div>
    </div>
);
