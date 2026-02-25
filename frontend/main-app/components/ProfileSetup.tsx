
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ProfileSetup: React.FC = () => {
  const { i18n } = useTranslation();

  // Form State
  const [formData, setFormData] = useState({
    nickName: '',
    phoneNumber: '',
    age: '35 - 45', // Default selected range
    gender: '',
    city: '',
    language: 'en', // Default English
    consent: false
  });

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mans360_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default state to ensure all fields exist
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Failed to load profile data", e);
    }
  }, []);

  const handleBack = () => {
    window.location.hash = `#/${i18n.language}/landing`;
  };

  const handleSubmit = () => {
    if (!formData.nickName || !formData.phoneNumber || !formData.age || !formData.gender || !formData.language || !formData.consent) {
      alert("Please fill in all required fields and accept the terms.");
      return;
    }

    // Save to localStorage
    localStorage.setItem('mans360_user_profile', JSON.stringify(formData));

    // Navigate to Wellness Subscription with the SELECTED language code
    // This triggers the app router to switch the language globally
    window.location.hash = `#/${formData.language}/wellness-subscription`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Shared Input Styles
  const inputClass = "w-full px-5 py-4 rounded-2xl border outline-none transition-all duration-300 font-medium text-[0.95rem] " +
    "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1FA2DE] focus:ring-4 focus:ring-[#1FA2DE]/10 " +
    "dark:bg-[#0F172A] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500/20";

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#020617] flex flex-col items-center justify-center px-4 py-8 transition-colors duration-500 relative">

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#0A3A78] dark:text-sky-400 font-bold text-lg hover:opacity-75 transition-opacity z-10"
      >
        <span className="text-2xl">←</span> Back
      </button>

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white dark:bg-[#1E293B] rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 transition-colors mt-12 md:mt-0">

        <h1 className="text-[2rem] font-serif font-bold text-[#0A3A78] dark:text-white mb-2">Profile Setup</h1>

        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Step 1 of 3 — Basic Info</p>

        <div className="space-y-5">

          {/* Nick Name */}
          <div>
            <input
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              placeholder="Nick Name"
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className={inputClass}
            />
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <select
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="18 - 25">18 - 25</option>
                <option value="25 - 35">25 - 35</option>
                <option value="35 - 45">35 - 45</option>
                <option value="45 - 55">45 - 55</option>
                <option value="55 +">55 +</option>
              </select>
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</div>
            </div>

            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer ${!formData.gender ? 'text-slate-400 dark:text-slate-500' : ''}`}
              >
                <option value="" disabled>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</div>
            </div>
          </div>

          {/* City / Pincode */}
          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City / Pincode"
              className={inputClass}
            />
          </div>

          {/* Preferred Language */}
          <div className="relative">
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
            </select>
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</div>
          </div>

          {/* Consent Box */}
          <div className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1FA2DE] focus:ring-[#1FA2DE] cursor-pointer"
            />
            <label htmlFor="consent" className="text-sm text-slate-600 dark:text-slate-300 leading-tight cursor-pointer">
              I consent to MANS360 Terms & DPDPA Privacy Policy
            </label>
          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold text-lg hover:shadow-lg hover:brightness-105 active:scale-95 transition-all shadow-md"
          >
            Next → Wellness Check
          </button>
        </div>

      </div>
    </div>
  );
};