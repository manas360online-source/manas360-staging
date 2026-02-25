
import React from 'react';
import { useTranslation } from 'react-i18next';

export const RoleSelection: React.FC = () => {
  const { i18n } = useTranslation();

  const handleBack = () => {
    window.location.hash = `#/${i18n.language}/landing`;
  };

  const handleUser = () => {
    window.location.hash = `#/${i18n.language}/profile-setup`;
  };


  const handleAdmin = () => {
    // Placeholder for admin route
    alert("Admin Panel functionality coming soon.");
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#0F172A] flex flex-col items-center justify-center px-6 transition-colors duration-500 relative">

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#0A3A78] dark:text-sky-400 font-bold text-lg hover:opacity-75 transition-opacity z-10"
      >
        <span className="text-2xl">←</span> Back
      </button>

      {/* Absolute Top Right Icon */}
      <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50 text-black dark:text-white">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-[40px] p-12 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 transition-colors">

        <h1 className="font-serif text-[2.5rem] text-[#0A3A78] dark:text-white font-bold text-center mb-6 leading-tight">
          How would you like to continue?
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-12 text-lg font-medium leading-relaxed">
          Please select your role to proceed with the registration.
        </p>

        <div className="flex flex-col gap-6">
          <button
            onClick={handleUser}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#0052CC] to-[#2684FF] hover:shadow-lg hover:-translate-y-1 transition-all text-white font-bold text-lg flex items-center justify-center gap-3 shadow-md active:scale-[0.98]"
          >
            <span>👤</span> Continue as User
          </button>


          <button
            onClick={handleAdmin}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#475569] to-[#94A3B8] hover:shadow-lg hover:-translate-y-1 transition-all text-white font-bold text-lg flex items-center justify-center gap-3 shadow-md active:scale-[0.98]"
          >
            <span>🛡️</span> Admin Panel
          </button>
        </div>

      </div>
    </div>
  );
};
