import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundParticles } from '../components/BackgroundParticles';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { TrustBar } from '../components/TrustBar';
import { HowItWorks } from '../components/HowItWorks';
import { CrisisBanner } from '../components/CrisisBanner';
import { FinalCTA } from '../components/FinalCTA';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-slate-900 relative overflow-x-hidden">
      <div
        className="relative w-full min-h-[100vh] md:min-h-[92vh] flex flex-col transition-all duration-700 z-[100]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=2560&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-[#031428]/35 dark:bg-[#020617]/65 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#DBEEF9]/55 via-[#DBEEF9]/20 to-[#FDFCF8] dark:from-[#030712]/85 dark:via-[#030712]/65 dark:to-[#030712] pointer-events-none z-0"></div>
        <div className="landing-water-waves z-[6]" aria-hidden="true">
          <svg className="wave-svg back" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path className="wave-path" d="M0,72 C180,36 320,96 510,72 C700,48 860,12 1040,38 C1210,62 1320,94 1440,72 L1440,120 L0,120 Z" />
          </svg>
          <svg className="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path className="wave-path" d="M0,58 C150,84 290,22 470,50 C650,78 790,106 980,78 C1160,52 1290,24 1440,56 L1440,120 L0,120 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/90 to-transparent dark:from-[#030712] dark:via-[#030712]/90 pointer-events-none z-0"></div>

        <BackgroundParticles />

        <div className="relative z-[1500] w-full">
          <Header onLoginClick={() => navigate('/auth')} />
        </div>

        <div className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-20 md:mt-28 pb-28 md:pb-40">
          <Hero onStartClick={() => navigate('/auth')} />
        </div>
      </div>

      <main className="relative z-10 -mt-8 md:-mt-12">
        <TrustBar />
        <HowItWorks />
        <FinalCTA onStartClick={() => navigate('/auth')} />
        <CrisisBanner />
      </main>
    </div>
  );
};

export default LandingPage;
