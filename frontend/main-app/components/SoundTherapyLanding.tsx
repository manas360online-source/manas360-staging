import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storageService';

export const SoundTherapyLanding: React.FC = () => {
  const { i18n } = useTranslation();
  const [plan, setPlan] = useState<'free' | 'daily' | 'complete'>('free');
  const [isAmbientMuted, setIsAmbientMuted] = useState(true);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const freePlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // Updated Image URLs - Sound Therapy / Singing Bowls Hero
  const HERO_IMAGE =  "/images/sound-therapy-hero.jpg";
  
  // Free Track URL - Using a reliable remote URL to prevent 404 errors
  const FREE_TRACK_URL = "/audio/free/music_from_another_world.mp3";
  
  // Categories
  const TEMPLE_IMAGE = "/images/Tirupati_temple.jpg";
  const BEACH_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop";
  const MOUNTAIN_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop";
  const FOREST_IMAGE = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop";

  // Moments
  const COMMUTE_IMAGE = "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000&auto=format&fit=crop"; // Rainy window/relaxing commute
  const SLEEP_IMAGE = "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=1600"; // Person sleeping

  useEffect(() => {
    // Load subscription plan
    setPlan(storageService.getSoundTherapyPlan());
    
    // Setup ambient audio
    if (ambientAudioRef.current) {
        ambientAudioRef.current.volume = 0; // Start at 0
    }
  }, []);

  const toggleAmbientSound = () => {
    if (ambientAudioRef.current) {
      if (isAmbientMuted) {
        // Turn ON
        setIsAmbientMuted(false);
        ambientAudioRef.current.muted = false;
        ambientAudioRef.current.play().catch(e => console.log('Autoplay prevented. User interaction required.'));
        // Smooth fade in
        let vol = 0;
        const interval = setInterval(() => {
          if (vol < 0.5) {
            vol += 0.05;
            if (ambientAudioRef.current) ambientAudioRef.current.volume = vol;
          } else {
            clearInterval(interval);
          }
        }, 200);
      } else {
        // Turn OFF
        // Smooth fade out
        let vol = ambientAudioRef.current.volume;
        const interval = setInterval(() => {
          if (vol > 0.05) {
            vol -= 0.05;
            if (ambientAudioRef.current) ambientAudioRef.current.volume = vol;
          } else {
            if (ambientAudioRef.current) {
              ambientAudioRef.current.pause();
              ambientAudioRef.current.muted = true;
            }
            setIsAmbientMuted(true);
            clearInterval(interval);
          }
        }, 100);
      }
    }
  };

  const handleSeePlans = () => {
    window.location.hash = `#/${i18n.language}/sound-therapy/plans`;
  };

  const navigateToCategory = (category: string) => {
    // Categories unlock with ANY paid plan (daily or complete)
    if (plan === 'free') {
      handleSeePlans();
    } else {
      window.location.hash = `#/${i18n.language}/sound-therapy/${category}`;
    }
  };

  const playMoment = (momentName: string) => {
    // Moments unlock ONLY with Complete plan (₹199)
    if (plan !== 'complete') {
        handleSeePlans();
    } else {
        alert(`Playing ${momentName}...`);
    }
  };

  const handleBack = () => {
    // Check if user came from Free Tools
    if (window.location.hash.includes('source=free-tools')) {
      window.location.hash = `#/${i18n.language}/free-tools`;
    } else {
      window.location.hash = `#/${i18n.language}/home`;
    }
  };

  const handleFreePlay = () => {
    console.log(`Playing: ${FREE_TRACK_URL}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A1A1A] transition-colors duration-500 relative overflow-x-hidden">
      
      {/* ABSOLUTE NAZAR BOTTU - TOP RIGHT CORNER OF PAGE */}
      <div className="absolute top-6 right-6 z-[2000] select-none pointer-events-none drop-shadow-sm">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      {/* Ambient Audio Element (Hidden) */}
      <audio 
        ref={ambientAudioRef} 
        loop 
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" 
        crossOrigin="anonymous"
        muted 
      />

      {/* Navigation - Added pr-16 to avoid overlapping with Nazar Bottu */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pr-16 flex justify-between items-center max-w-[1400px] mx-auto">
        <button onClick={handleBack} className="text-white font-bold text-lg drop-shadow-md flex items-center gap-2 hover:opacity-80 transition-opacity shadow-black/20">
          ← Back
        </button>
        <div className="text-white font-serif text-xl tracking-widest drop-shadow-lg font-bold shadow-black/20">MANAS360</div>
        
        {/* Always show See Plans button, regardless of subscription status */}
        <button 
          onClick={handleSeePlans}
          className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all shadow-lg"
        >
          See Plans
        </button>
      </div>

      {/* HERO SECTION - Clean, Premium, Light (Calm.com style) */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#E0F2FE]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <img 
             src={HERO_IMAGE} 
             className="w-full h-full object-cover"
             alt="Sound Therapy Hero"
           />
           {/* SUBTLE Overlay ONLY - No heavy fog, no brown tint */}
           <div className="absolute inset-0 bg-black/25"></div>
        </div>

        {/* Increased mt-32 to create gap between LOGO and Text */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up mt-32">
          <div className="space-y-2 mb-8 font-medium tracking-wide text-lg md:text-2xl drop-shadow-lg text-white/95">
            <p>After a long drive.</p>
            <p>After long hours at work.</p>
            <p>After... everything.</p>
          </div>
          
          <p className="text-xl md:text-3xl font-serif italic text-white drop-shadow-lg mb-6">You deserve this moment.</p>
          
          <h1 className="font-serif text-[3.5rem] md:text-[6rem] leading-none mb-8 drop-shadow-xl tracking-tight text-white font-bold">
            YOUR GREAT PLACE
          </h1>
          <p className="text-lg md:text-xl font-medium mb-12 tracking-wide opacity-100 drop-shadow-md text-white">Where peace is always one tap away.</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => {
                 const player = document.getElementById('free-player');
                 player?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-4 bg-white text-[#0A3A78] rounded-full font-bold text-lg hover:bg-sky-50 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-xl active:scale-95"
            >
              Start Free
            </button>
            
            <button 
              onClick={toggleAmbientSound}
              className={`
                px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex items-center gap-2
                ${!isAmbientMuted 
                  ? 'bg-[#1FA2DE] text-white border-2 border-[#1FA2DE] hover:bg-[#1590C9]' 
                  : 'bg-black/30 backdrop-blur-md border-2 border-white text-white hover:bg-black/40'
                }
              `}
            >
              {!isAmbientMuted ? (
                <>
                  <span className="animate-pulse">🔊</span> Sample ON
                </>
              ) : (
                <>
                  <span>🔇</span> Sample OFF
                </>
              )}
            </button>
          </div>

          <div className="mt-12 text-sm font-medium bg-black/30 backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/20 shadow-lg text-white">
            🌟 487 people found their peace today
          </div>
        </div>
      </section>

      {/* EXPERIENCE CATEGORIES - The Sanctuaries */}
      <section id="experience-categories" className="py-24 px-6 max-w-[1280px] mx-auto bg-[#FDFCF8]">
        <div className="text-center mb-16">
          <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] text-[#0A3A78] mb-3">Where do you want to be right now?</h2>
          <p className="text-slate-500 text-lg">Close your eyes. Choose your sanctuary.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CategoryCard 
            title="Ocean Peace" 
            emoji="🏖️" 
            image={BEACH_IMAGE}
            isLocked={plan === 'free'}
            onClick={() => navigateToCategory('beach')}
          />
          <CategoryCard 
            title="Mountain" 
            emoji="🏔️" 
            image={MOUNTAIN_IMAGE}
            isLocked={plan === 'free'}
            onClick={() => navigateToCategory('mountain')}
          />
          <CategoryCard 
            title="Temple" 
            emoji="🕉️" 
            image={TEMPLE_IMAGE}
            isLocked={plan === 'free'}
            onClick={() => navigateToCategory('temple')}
          />
          <CategoryCard 
            title="Forest" 
            emoji="🎋" 
            image={FOREST_IMAGE}
            isLocked={plan === 'free'}
            onClick={() => navigateToCategory('forest')}
          />
        </div>

        {plan === 'free' && (
          <div className="mt-16 text-center">
             <button 
               onClick={handleSeePlans}
               className="px-12 py-4 rounded-full bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
             >
               See Plans & Unlock All
             </button>
          </div>
        )}
      </section>

      {/* MOMENTS SECTION */}
      <section className="py-24 px-6 bg-[#F0F9FF]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[2.5rem] md:text-[3rem] text-[#0A3A78] mb-3">For Every Moment of Your Day</h2>
            <p className="text-slate-500 text-lg">Your sanctuary adapts to your rhythm.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MomentCard 
              time="6:00 AM" 
              title="Morning Routine" 
              icon="☀️" 
              image="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop"
              isLocked={plan !== 'complete'}
              onPlay={() => playMoment('Morning Routine')}
            />
            <MomentCard 
              time="3:00 PM" 
              title="Work Break" 
              icon="💼" 
              image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"
              isLocked={plan !== 'complete'}
              onPlay={() => playMoment('Work Break')}
            />
            <MomentCard 
              time="6:30 PM" 
              title="Commute Home" 
              icon="🚗" 
              image={COMMUTE_IMAGE}
              isLocked={plan !== 'complete'}
              onPlay={() => playMoment('Commute')}
            />
            <MomentCard 
              time="10:00 PM" 
              title="Before Bed" 
              icon="🌙" 
              image={SLEEP_IMAGE}
              isLocked={plan !== 'complete'}
              onPlay={() => playMoment('Bedtime')}
            />
          </div>
        </div>
      </section>

      {/* FREE PLAYER SECTION */}
      <section id="free-player" className="py-24 px-6 max-w-[900px] mx-auto text-center">
        <h2 className="font-serif text-[2.5rem] text-[#0A3A78] mb-2">Try It Now</h2>
        <p className="text-slate-500 mb-10">Experience a glimpse of tranquility. No sign-up required.</p>
        
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E59FF] to-[#004BCE] flex items-center justify-center text-white text-4xl shadow-lg mb-6 animate-pulse-slow">
              🎵
            </div>
            <h3 className="font-bold text-xl text-[#0A3A78] mb-1">Music from Another World</h3>
            <p className="text-slate-400 text-sm mb-8">Free Preview Track</p>
            
            <audio 
              ref={freePlayerRef}
              controls 
              className="w-full max-w-md"
              src={FREE_TRACK_URL} 
              onPlay={handleFreePlay}
              onEnded={handleSeePlans}
              onError={() => console.error("Audio error. Please ensure file exists or url is correct")}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (LIFESTYLE) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="font-serif text-[2rem] text-[#0A3A78] mb-12">Real People, Real Moments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              text="I never knew I needed a 'Temple' in my pocket until now. My commute feels like a pilgrimage to peace."
              author="Rohan, Mumbai"
            />
            <TestimonialCard 
              text="The ocean sounds are so realistic. I close my eyes and I'm back in Goa, away from all the noise."
              author="Sneha, Delhi"
            />
            <TestimonialCard 
              text="Just 10 minutes of 'Forest' before bed and I sleep like a baby. It's my daily reset button."
              author="Arjun, Bangalore"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center bg-[#0A3A78] text-white">
        <h2 className="font-serif text-[3rem] mb-8">Your Great Place Awaits</h2>
        <button 
          onClick={handleSeePlans}
          className="px-12 py-5 bg-white text-[#0A3A78] rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
        >
          Start Free
        </button>
      </section>

    </div>
  );
};

// --- Sub-components ---

const CategoryCard: React.FC<{ title: string, emoji: string, image: string, isLocked: boolean, onClick: () => void }> = ({ title, emoji, image, isLocked, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative h-[320px] rounded-[32px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
  >
    {/* Darker overlay on hover for better text visibility if needed */}
    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10"></div>
    <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
    
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <div className="text-4xl mb-2 drop-shadow-md">{emoji}</div>
      <h3 className="font-serif text-2xl font-bold text-white drop-shadow-md">{title}</h3>
    </div>

    {isLocked && (
      <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/20 shadow-sm">
        🔒 Locked
      </div>
    )}
  </div>
);

const MomentCard: React.FC<{ time: string, title: string, icon: string, image: string, isLocked: boolean, onPlay: () => void }> = ({ time, title, icon, image, isLocked, onPlay }) => (
  <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
    <div className="h-40 overflow-hidden relative">
      <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={title} />
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md border border-white/10">
        {time}
      </div>
    </div>
    <div className="p-5 flex justify-between items-center">
      <div>
        <div className="text-2xl mb-1">{icon}</div>
        <h4 className="font-bold text-[#0A3A78] text-lg">{title}</h4>
      </div>
      <button 
        onClick={onPlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-[#1FA2DE] text-white hover:scale-110 shadow-md'}`}
      >
        {isLocked ? '🔒' : '▶'}
      </button>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ text: string, author: string }> = ({ text, author }) => (
  <div className="bg-[#F8FAFC] p-8 rounded-[32px] text-left border border-slate-100 hover:shadow-md transition-shadow">
    <div className="text-sky-300 text-4xl font-serif mb-4">“</div>
    <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6 italic">{text}</p>
    <p className="font-bold text-[#0A3A78] text-sm uppercase tracking-wide">— {author}</p>
  </div>
);
