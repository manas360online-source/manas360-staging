
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storageService';

export const FreeToolsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [groupVibesCount, setGroupVibesCount] = useState(12);

  // Simulate live count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGroupVibesCount(prev => Math.max(8, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    window.location.hash = `#/${i18n.language}/home`;
  };

  const launchFeature = (route: string) => {
    if (route.startsWith('http')) {
      window.location.href = route;
    } else if (route.startsWith('#')) {
      // Append source param to allow back navigation to return here
      const lang = i18n.language;
      const base = route.replace('#', `#/${lang}`);
      const separator = base.includes('?') ? '&' : '?';
      window.location.hash = `${base}${separator}source=free-tools`;
    } else {
      alert(`Launching ${route}... (Demo Feature)`);
    }
  };

  const features = [
    {
      id: 'anytime_buddy',
      icon: '🤝',
      name: 'Anytime Buddy',
      nameHi: 'कभी भी दोस्त',
      tagline: 'Talk to AI companion 24/7',
      color: '#667eea', // Indigo
      route: 'AnytimeBuddy',
      isFeature: true
    },
    {
      id: 'vent_buddy',
      icon: '🗣️',
      name: 'VentBuddy',
      nameHi: 'वेंट बडी',
      tagline: 'Let it out safely, no judgment',
      color: '#f59e0b', // Amber
      route: 'VentBuddy',
      isFeature: true
    },
    {
      id: 'group_vibes',
      icon: '👥',
      name: 'Group Vibes',
      nameHi: 'ग्रुप वाइब्स',
      tagline: 'Join others like you',
      color: '#10b981', // Emerald
      route: 'GroupVibes',
      badge: '🔥 HOT',
      badgeColor: 'bg-red-500',
      live: true,
      isFeature: true
    },
    {
      id: 'sound_therapy',
      icon: '🎵',
      name: 'Sound Therapy',
      nameHi: 'साउंड थेरेपी',
      tagline: 'Calm your mind with 432Hz',
      color: '#8b5cf6', // Violet
      route: '#/sound-therapy',
      isFeature: false // Navigation
    },
    {
      id: 'free_assessment',
      icon: '📋',
      name: 'Free Check',
      nameHi: 'फ्री चेक',
      tagline: '3-min mental health check',
      color: '#06b6d4', // Cyan
      route: '#/assessment',
      isFeature: false
    },
    {
      id: 'ivr_assessment',
      icon: '📞',
      name: 'Call & Check',
      nameHi: 'कॉल करें',
      tagline: 'Voice assessment Hindi/Eng',
      color: '#ec4899', // Pink
      route: '#/crisis',
      isFeature: false
    },
    {
      id: 'dr_meera',
      icon: '👩‍⚕️',
      name: 'Dr. Meera',
      nameHi: 'डॉ. मीरा',
      tagline: 'AI therapist in your language',
      color: '#14b8a6', // Teal
      route: '#/meera-chat',
      isFeature: true
    },
    {
      id: 'digital_pet',
      icon: '🐾',
      name: 'Pet Buddy',
      nameHi: 'पेट बडी',
      tagline: 'Adopt a companion who cares',
      color: '#f472b6', // Pink-400
      route: 'DigitalPet',
      isFeature: true
    },
    {
      id: 'ar_wall',
      icon: '🌈',
      name: 'AR Wall',
      nameHi: 'AR वॉल',
      tagline: 'Transform your space to peace',
      color: '#a855f7', // Purple
      route: '#/ar-themed-room',
      badge: '✨ NEW',
      badgeColor: 'bg-emerald-500',
      isFeature: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F5FF] to-[#FDFCF8] dark:from-[#0f172a] dark:to-[#0f172a] text-[#1A1A1A] dark:text-white font-sans transition-colors duration-500 overflow-y-auto">

      {/* Full Width Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex flex-col">

        {/* Header Bar - Removed Login & Languages */}
        <div className="flex justify-between items-center mb-8">
          <div
            onClick={handleBack}
            className="font-serif text-2xl md:text-3xl font-bold text-[#667eea] cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span>←</span> 🌙 MANAS360
          </div>
          {/* Right side is intentionally empty now per request */}
        </div>

        {/* Mood Check - Expanded Width */}
        <div className="w-full mb-10">
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#1e293b] dark:to-[#334155] rounded-3xl p-8 text-center shadow-lg border border-slate-100 dark:border-slate-700">
            <p className="text-xl md:text-2xl font-medium mb-2 text-slate-700 dark:text-white">How are you feeling today?</p>
            <p className="text-base text-slate-400 dark:text-slate-400 mb-8">आज कैसा महसूस कर रहे हो?</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {['😊', '😐', '😔', '😢', '🆘'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => alert(`Selected: ${emoji} - We would route you to the best tool.`)}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-slate-100 dark:border-[#334155] bg-slate-50 dark:bg-[#1e293b] text-3xl md:text-5xl flex items-center justify-center hover:scale-110 hover:border-[#667eea] transition-all shadow-md"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-[#f59e0b] text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
            <span className="text-3xl">⚡</span> TRY NOW - NO SIGNUP
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mt-2 ml-1">Free forever. No credit card needed.</p>
        </div>

        {/* Feature Grid - Bigger Cards, More Spacing */}
        <div className="flex-1 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => launchFeature(feature.route)}
                className="
                            group relative bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 
                            border-l-[6px] cursor-pointer transition-all duration-300 
                            hover:-translate-y-2 hover:shadow-2xl shadow-md
                            dark:shadow-black/30 flex flex-col h-full justify-between min-h-[220px]
                        "
                style={{ borderLeftColor: feature.color }}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className={`
                                absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md z-10
                                ${feature.badgeColor} animate-pulse
                            `}>
                    {feature.badge}
                  </div>
                )}

                <div>
                  <div className="text-4xl md:text-5xl mb-4 filter drop-shadow-sm">{feature.icon}</div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-3 font-medium">
                    {feature.nameHi}
                  </p>

                  <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.tagline}
                  </p>

                  {/* Live Counter for Group Vibes */}
                  {feature.live && (
                    <div className="mb-4 inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                      {groupVibesCount} online
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div
                  className="mt-4 py-3 rounded-xl text-sm md:text-base font-bold text-white text-center uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.id.includes('sound') ? '▶ PLAY NOW' : 'START NOW'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Banner - Expanded */}
        <div className="pb-12">
          <div className="p-8 md:p-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl flex flex-col md:flex-row justify-between items-center shadow-xl gap-6">
            <div className="text-white text-center md:text-left">
              <p className="text-sm font-bold opacity-90 tracking-widest mb-1">🌟 PREMIUM ACCESS</p>
              <p className="text-2xl md:text-3xl font-bold mb-1">Talk to Real Therapists</p>
              <p className="text-base md:text-lg opacity-90">Professional help starts from ₹299/session</p>
            </div>
            <button
              onClick={() => window.location.hash = `#/${i18n.language}/subscribe`}
              className="px-8 py-4 bg-white/20 backdrop-blur-md rounded-full text-white text-base font-bold border border-white/30 hover:bg-white/30 hover:scale-105 transition-all shadow-lg whitespace-nowrap"
            >
              EXPLORE PREMIUM →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
