import React, { useState, useEffect } from 'react';
import { JourneyMap } from '../components/JourneyMap';
import { CERTIFICATIONS } from '../constants';
import { CardSkeleton } from '../components/Skeleton';

export const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Simulate loading delay for skeleton demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 600) {
            setShowStickyCTA(true);
        } else {
            setShowStickyCTA(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCertifications = () => {
      const element = document.getElementById('certifications-grid');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <div className="flex flex-col font-sans pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 to-purple-600 text-white py-16 md:py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif font-black leading-[1.1] mb-6 md:mb-10 drop-shadow-2xl">
            Transform Your Career,<br />
            Transform Lives
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-purple-50 max-w-4xl mx-auto mb-12 md:mb-20 font-medium opacity-95 leading-relaxed px-2">
            Join India's premier mental health certification ecosystem. From community champions to consciousness masters.
          </p>
          
          {/* Stats Grid */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-12 mt-8">
            <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 min-w-[200px] md:min-w-[280px] shadow-lg">
                <span className="block font-serif text-4xl md:text-7xl font-black mb-2 md:mb-4">6</span>
                <span className="text-xs md:text-lg font-bold text-purple-50 uppercase tracking-widest">Certifications</span>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 min-w-[200px] md:min-w-[280px] shadow-lg">
                <span className="block font-serif text-4xl md:text-7xl font-black mb-2 md:mb-4">₹6L+</span>
                <span className="text-xs md:text-lg font-bold text-purple-50 uppercase tracking-widest">Potential Income</span>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 min-w-[200px] md:min-w-[280px] shadow-lg">
                <span className="block font-serif text-4xl md:text-7xl font-black mb-2 md:mb-4">5 Weeks</span>
                <span className="text-xs md:text-lg font-bold text-purple-50 uppercase tracking-widest">Fast Track</span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Map Section */}
      <section id="journey" className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12">
          {loading ? (
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="h-10 md:h-16 w-3/4 bg-slate-200 rounded mx-auto mb-4 animate-pulse"></div>
                    <div className="h-4 md:h-6 w-1/2 bg-slate-200 rounded mx-auto animate-pulse"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-16">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
          ) : (
            <JourneyMap certifications={CERTIFICATIONS} />
          )}
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div 
        className={`
            fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-4px_30px_rgba(0,0,0,0.15)] z-50 
            transform transition-transform duration-300 ease-in-out border-t border-slate-200
            ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="font-bold text-base md:text-xl text-slate-900 leading-tight">Ready to Transform Your Career?</div>
                <div className="text-slate-600 text-xs md:text-sm truncate hidden sm:block">Join 1,000+ certified professionals earning ₹16K-1.8L/month</div>
            </div>
            <button 
                onClick={scrollToCertifications}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm md:text-base hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap shadow-md"
            >
                Choose Your Certification
            </button>
        </div>
      </div>

    </div>
  );
};