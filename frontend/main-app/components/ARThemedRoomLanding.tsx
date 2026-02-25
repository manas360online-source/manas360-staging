
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storageService';

const AR_THEMES = [
  {
    id: 'boat-ocean',
    title: 'Boat Near Ocean',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/boats-near-ocean-beach-with-huts-among-palm-trees.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop',
    icon: '⛵',
    tier: 'free'
  },
  {
    id: 'green-tea',
    title: 'Green Tea Plantation',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/green-tea-plantations-in-munnar-kerala-india.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/04/27/audio_65b3693f93.mp3',
    thumbnail: 'public/images/Tea-estate.jpg', // Local image for better optimization
    icon: '🍃',
    tier: 'free'
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/ocean_waves_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/02/07/audio_65893b04b9.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop',
    icon: '🌊',
    tier: 'premier'
  },
  {
    id: 'forest',
    title: 'Enchanted Forest',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/enchanted_forest_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/07/04/audio_323281d897.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop',
    icon: '🌲',
    tier: 'premier'
  },
  {
    id: 'himalaya',
    title: 'Himalayan Sunrise',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/himalayan_sunrise_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/09/02/audio_72502a492a.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000&auto=format&fit=crop',
    icon: '🏔️',
    tier: 'premier'
  },
  {
    id: 'calm-lake',
    title: 'Calm Lake View',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/wonderful-dusk-over-calm-lake.mp4',
    audioUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/Sound%20Therapy%20Track/TunePocket-Relaxing-Piano-Music-With-Ocean-Sounds-1-Hour-Preview.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    icon: '🌅',
    tier: 'plus'
  },
  {
    id: 'real-room-ar',
    title: 'YOUR REAL ROOM',
    videoUrl: '', // Camera based
    audioUrl: '',
    thumbnail: '/images/AR-room.jpg', // Local image for better optimization
    icon: '🦋',
    tier: 'plus',
    isRealAR: true
  }
];

export const ARThemedRoomLanding: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentPlan, setCurrentPlan] = useState<'free' | 'premier' | 'plus'>('free');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successPlanName, setSuccessPlanName] = useState('');

  useEffect(() => {
    setCurrentPlan(storageService.getARPlan());
    window.scrollTo(0, 0);

    // Check for success callback
    const hash = window.location.hash;
    const queryString = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    if (params.get('success') === 'true') {
      const planParam = params.get('plan');
      if (planParam) {
        setSuccessPlanName(planParam === 'premier' ? 'AR Premier' : 'AR Premier Plus');
        // Save immediately to ensure logic consistency if user refreshes
        storageService.saveARPlan(planParam as 'premier' | 'plus');
        storageService.saveSubscription({
          category: 'AR Themed Room',
          planName: planParam === 'premier' ? 'Premier' : 'Premier Plus',
          price: planParam === 'premier' ? '₹99/month' : '₹199/month'
        });
        setCurrentPlan(planParam as 'premier' | 'plus');
      }
      setShowSuccessModal(true);
      // Clean URL
      window.history.replaceState(null, '', `#/en/ar-themed-room`);
    }
  }, []);

  const handleBack = () => {
    // Check if user came from Free Tools
    if (window.location.hash.includes('source=free-tools')) {
      window.location.hash = `#/${i18n.language}/free-tools`;
    } else {
      window.location.hash = `#/${i18n.language}/home`;
    }
  };

  const handleSeePlans = () => {
    window.location.hash = `#/${i18n.language}/ar-themed-room/plans`;
  };

  const startTrial = () => {
    const wall = document.getElementById('themes-wall');
    if (wall) {
      wall.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
  };

  const handleThemeClick = (theme: typeof AR_THEMES[0]) => {
    const isLocked = isThemeLocked(theme.tier);
    if (isLocked) {
      window.location.hash = `#/${i18n.language}/ar-themed-room/plans`;
    } else {
      if (theme.isRealAR) {
        window.location.hash = `#/${i18n.language}/ar-themed-room/real-ar`;
      } else {
        // Navigate to video player
        window.location.hash = `#/${i18n.language}/ar-themed-room/player/${theme.id}`;
      }
    }
  };

  const isThemeLocked = (tier: string) => {
    if (tier === 'free') return false;
    if (tier === 'premier') return currentPlan === 'free';
    if (tier === 'plus') return currentPlan !== 'plus';
    return true;
  };

  const freeThemes = AR_THEMES.filter(t => t.tier === 'free');
  const premierThemes = AR_THEMES.filter(t => t.tier === 'premier');
  const plusThemes = AR_THEMES.filter(t => t.tier === 'plus');

  const renderThemeCard = (theme: typeof AR_THEMES[0]) => {
    const locked = isThemeLocked(theme.tier);
    const isRealRoom = theme.id === 'real-room-ar';

    return (
      <div
        key={theme.id}
        onClick={() => handleThemeClick(theme)}
        className={`
          group relative h-[340px] rounded-[24px] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100
          ${locked ? 'grayscale-[0.5] hover:grayscale-0' : ''}
          ${isRealRoom ? 'md:col-span-2' : ''}
        `}
      >
        <img
          src={theme.thumbnail}
          alt={theme.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
          <div className="text-3xl mb-2 drop-shadow-md">{theme.icon}</div>
          <h3 className="font-serif text-2xl font-bold text-white drop-shadow-md leading-tight">{theme.title}</h3>
          {theme.isRealAR && (
            <p className="text-white/80 text-xs font-medium mt-1">Live Camera AR</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            {locked ? (
              <span className="bg-black/60 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1">
                🔒 Locked
              </span>
            ) : (
              <span className="bg-white/20 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1.5 rounded-full border border-white/30">
                Free / Unlocked
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#1A1A1A] relative overflow-x-hidden">

      {/* ABSOLUTE NAZAR BOTTU */}
      <div className="absolute top-6 right-6 z-[2000] select-none pointer-events-none drop-shadow-sm">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pr-16 flex justify-between items-center max-w-[1400px] mx-auto">
        <button onClick={handleBack} className="text-white font-bold text-lg drop-shadow-lg flex items-center gap-2 hover:opacity-80 transition-opacity bg-black/10 backdrop-blur-[2px] rounded-full px-4 py-1">
          ← Back
        </button>

        <button
          onClick={handleSeePlans}
          className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all shadow-lg"
        >
          See Plans
        </button>
      </div>

      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col items-center justify-center text-center px-6">
        {/* Background Image - Specific Mountain/Pine Tree/River Valley */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-slate-400"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2560&auto=format&fit=crop")'
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto mt-16">
          <h1 className="font-serif text-[3.5rem] md:text-[5rem] leading-tight mb-6 text-white font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            AR Themed Room
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-12">
            Transform your surroundings into a calming visual sanctuary
          </p>
          <button
            onClick={startTrial}
            className="px-10 py-4 bg-white text-[#0A3A78] rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg active:scale-95 border border-white/50"
          >
            Start with Free Trial
          </button>
        </div>
      </section>

      {/* THEMES WALL */}
      <section id="themes-wall" className="py-16 px-6 max-w-[1280px] mx-auto bg-slate-50 rounded-t-[40px] shadow-inner min-h-screen -mt-20 relative z-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-[#0A3A78] mb-2">Choose Your Sanctuary</h2>
          <p className="text-slate-500">Immersive environments for every mood</p>
        </div>

        {/* Free Access */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-[#0A3A78] mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg text-lg">🔓</span> Free Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {freeThemes.map(renderThemeCard)}
          </div>
        </div>

        {/* Premier Access */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-[#0A3A78] mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-lg">💎</span> Premier Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {premierThemes.map(renderThemeCard)}
          </div>
        </div>

        {/* Premier Plus Access */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-[#0A3A78] mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-lg">👑</span> Premier Plus Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {plusThemes.map(renderThemeCard)}
          </div>
        </div>

      </section>

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
