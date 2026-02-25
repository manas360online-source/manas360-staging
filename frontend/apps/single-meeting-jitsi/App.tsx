import React, { useState } from 'react';
import BookingConfirmed from './components/BookingConfirmed';
import VideoSession from './components/VideoSession';
import PostSession from './components/PostSession';
import { AppStep } from './types';
import { MOCK_SESSION, ICONS } from './constants';

interface AppProps {
  onBack?: () => void;
  onHome?: () => void;
}

const App: React.FC<AppProps> = ({ onBack, onHome }) => {
  const [step, setStep] = useState<AppStep>('CONFIRMED');

  const startSession = () => setStep('SESSION');
  const endSession = () => setStep('POST_SESSION');
  const resetApp = () => {
    if (onHome) {
      onHome();
    } else {
      setStep('CONFIRMED');
    }
  };

  const goBack = () => {
    if (step === 'SESSION') {
      setStep('CONFIRMED');
    } else if (step === 'POST_SESSION') {
      setStep('SESSION');
    } else {
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-6 md:p-12 overflow-x-hidden text-slate-900"
      style={{
        background: 'linear-gradient(135deg, #f8faff 0%, #e0efff 100%)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Global Back Button - Positioned to stay visible regardless of host platform layout */}
      <div className="fixed top-8 left-8 z-[100]">
        <button
          onClick={goBack}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-700 shadow-xl border border-slate-100 hover:bg-slate-50 transition-all active:scale-95 group"
          title="Go Back"
        >
          <ICONS.ArrowLeft />
          <span className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400 pointer-events-none">Back</span>
        </button>
      </div>

      <div className="w-full max-w-6xl h-full min-h-[700px] z-10">
        {step === 'CONFIRMED' && (
          <BookingConfirmed
            session={MOCK_SESSION}
            onJoin={startSession}
            onHome={resetApp}
          />
        )}

        {step === 'SESSION' && (
          <VideoSession
            session={MOCK_SESSION}
            onEnd={endSession}
          />
        )}

        {step === 'POST_SESSION' && (
          <PostSession
            session={MOCK_SESSION}
            onHome={resetApp}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default App;