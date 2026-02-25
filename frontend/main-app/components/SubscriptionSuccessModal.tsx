
import React from 'react';

interface SubscriptionSuccessModalProps {
  category: string;
  planName: string;
  onOk: () => void;
}

export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({ category, planName, onOk }) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      {/* Dimmed Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onOk}></div>
      
      {/* Popup Card */}
      <div className="relative bg-white dark:bg-[#1E293B] rounded-[32px] p-8 md:p-10 shadow-2xl max-w-sm w-full text-center animate-fade-in-up border border-white/20 dark:border-slate-800">
        <div className="text-5xl mb-6">🎉</div>
        <h2 className="font-serif text-[1.5rem] font-bold text-[#1A1A1A] dark:text-white mb-4">Subscription Successful 🎉</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          You have successfully subscribed to <span className="font-bold text-[#0A3A78] dark:text-sky-400">{category} – {planName}</span>
        </p>
        <button 
          onClick={onOk}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold shadow-md hover:brightness-105 active:scale-95 transition-all text-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
};
