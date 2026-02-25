
import React, { useState, useEffect } from 'react';

interface PaymentStepProps {
  onClose: () => void;
  onSuccess: () => void;
  sessionName: string;
  startTimeLabel: string;
}

const HotSessionPaymentModal: React.FC<PaymentStepProps> = ({ onClose, onSuccess, sessionName, startTimeLabel }) => {
  const [step, setStep] = useState<'DETAILS' | 'METHODS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePayment = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out] pointer-events-auto">
      <div className="bg-[#111827] w-full max-w-md rounded-[48px] border-2 border-[#39FF14]/30 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
        
        {/* Close Button */}
        {step !== 'PROCESSING' && step !== 'SUCCESS' && (
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

        <div className="p-10">
          {step === 'DETAILS' && (
            <div className="animate-[scaleUp_0.4s_ease-out]">
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-[9px] font-black tracking-widest uppercase mb-4">Hot Session Offer</span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2 leading-none">{sessionName}</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">SECURE YOUR SPOT NOW</p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Starts At</span>
                   <span className="text-sm font-black text-[#39FF14] uppercase tracking-tighter italic">{startTimeLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Fee</span>
                   <div className="flex items-center gap-3">
                      <span className="text-slate-600 line-through text-xs font-black">₹1,200</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">₹1,000</span>
                   </div>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 mb-8 flex items-start gap-4">
                <span className="text-xl">🔔</span>
                <p className="text-[10px] font-bold text-blue-300 leading-relaxed uppercase tracking-widest">
                  Note that once the meeting is started you will get a notification.
                </p>
              </div>

              <button 
                onClick={() => setStep('METHODS')}
                className="w-full py-5 bg-[#39FF14] text-[#111827] rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Proceed to Pay →
              </button>
            </div>
          )}

          {step === 'METHODS' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-center text-xl font-black text-white uppercase tracking-tighter italic mb-8">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['UPI', 'CARD', 'WALLET', 'NETBANKING'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setSelectedMethod(m)}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedMethod === m ? 'bg-[#39FF14]/10 border-[#39FF14]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <span className="text-2xl">{m === 'UPI' ? '📱' : m === 'CARD' ? '💳' : m === 'WALLET' ? '👛' : '🏦'}</span>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{m}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('DETAILS')} className="flex-1 py-5 bg-white/5 text-slate-400 rounded-3xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10">Back</button>
                <button 
                  disabled={!selectedMethod}
                  onClick={handlePayment}
                  className={`flex-[2] py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all ${selectedMethod ? 'bg-[#39FF14] text-[#111827] shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  Pay ₹1,000 Now
                </button>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-12 flex flex-col items-center text-center animate-[fadeIn_0.3s_ease-out]">
               <div className="w-20 h-20 border-4 border-white/5 border-t-[#39FF14] rounded-full animate-spin mb-8"></div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Processing...</h3>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">HANDSHAKE WITH BANK GATEWAY</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-12 flex flex-col items-center text-center animate-[scaleUp_0.4s_ease-out]">
               <div className="w-24 h-24 bg-[#39FF14] text-[#111827] rounded-full flex items-center justify-center text-5xl mb-8 shadow-[0_0_40px_rgba(57,255,20,0.4)]">✓</div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Spot Secured!</h3>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose mb-8">
                 Registration confirmed. <br/> 
                 We will notify you at <span className="text-[#39FF14]">{startTimeLabel}</span>
               </p>
               <div className="bg-blue-600/20 text-blue-400 p-4 rounded-2xl border border-blue-500/20 text-[8px] font-black uppercase tracking-widest">
                  NOTIFICATION ENGINE PRIMED
               </div>
            </div>
          )}
        </div>

        <p className="text-center pb-8 text-[8px] font-black text-slate-700 uppercase tracking-widest">PCI-DSS COMPLIANT • 256-BIT SSL SECURE</p>
      </div>
    </div>
  );
};

const SessionStickyBar: React.FC = () => {
  const [seconds, setSeconds] = useState(10800);
  const [waitingCount, setWaitingCount] = useState(8);
  const [isVisible, setIsVisible] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    const socialTimer = setInterval(() => {
      setWaitingCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(socialTimer);
    };
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sc.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${sc.toString().padStart(2, '0')}`;
  };

  const getStartTimeLabel = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() + seconds * 1000);
    return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getColorConfig = () => {
    const hours = seconds / 3600;
    if (hours > 2) {
      return { 
        color: '#39FF14',
        glow: 'rgba(57, 255, 20, 0.6)',
        label: 'GOING LIVE',
        badgeBg: 'rgba(57, 255, 20, 0.1)'
      };
    } else if (hours > 1) {
      return { 
        color: '#00D9FF',
        glow: 'rgba(0, 217, 255, 0.6)',
        label: 'PREPARING',
        badgeBg: 'rgba(0, 217, 255, 0.1)'
      };
    } else {
      return { 
        color: '#FF1744',
        glow: 'rgba(255, 23, 68, 0.6)',
        label: 'URGENT',
        badgeBg: 'rgba(255, 23, 68, 0.1)'
      };
    }
  };

  const { color, glow, label, badgeBg } = getColorConfig();

  if (!isVisible) return null;

  return (
    <>
      {/* Wrapper fixed to the top right corner */}
      <div className="fixed top-6 right-6 z-[600] pointer-events-none">
        {/* Main Card Container */}
        <div 
          className="bg-[#111827] w-[280px] rounded-[42px] overflow-hidden p-6 flex flex-col items-center border-[3px] animate-[floatingPulse_2s_infinite_ease-in-out] shadow-[0_20px_60px_rgba(0,0,0,0.5)] pointer-events-auto relative transform transition-transform hover:scale-105"
          style={{ 
            borderColor: color, 
            boxShadow: `0 0 40px ${glow}`,
          }}
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Top Status Badge */}
          <div 
            className="px-4 py-1.5 rounded-full border-2 mb-4 flex items-center gap-1.5"
            style={{ borderColor: color, color: color, backgroundColor: badgeBg }}
          >
            <span className="text-xs animate-pulse">⚡</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
          </div>

          {/* Title and Metadata */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
               <span className="text-lg">🧠</span>
               <h4 className="text-[13px] font-black text-white uppercase tracking-tighter italic">Student Stress Room</h4>
            </div>
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em]">MODERATED DAILY • 60 MINS</p>
          </div>

          {/* Incentive Banner (Gold Gradient) */}
          <div className="w-full bg-gradient-to-r from-[#FFB800] via-[#FFD700] to-[#FF8A00] rounded-[24px] py-3 px-4 flex items-center gap-3 mb-4 shadow-lg">
             <div className="text-2xl filter drop-shadow-md">💰</div>
             <div className="flex flex-col">
                <span className="text-sm font-black text-[#1a1a2e] leading-none tracking-tight">Get ₹50</span>
                <span className="text-[7px] font-black text-[#1a1a2e]/60 uppercase tracking-[0.2em] mt-1">IN YOUR WALLET!</span>
             </div>
          </div>

          {/* Timer and Stats */}
          <div className="flex flex-col items-center gap-2 mb-6">
             <div className="flex items-center gap-2">
                <span className="text-sm">⏰</span>
                <span 
                  className="text-2xl font-black font-mono tracking-tighter"
                  style={{ color: color, textShadow: `0 0 15px ${color}` }}
                >
                  {formatTime(seconds)}
                </span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">REMAINING</span>
             </div>
             <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="text-[10px]">👥</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">{waitingCount} WAITING TO JOIN</span>
             </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full py-4 rounded-[18px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl hover:brightness-110"
            style={{ 
              backgroundColor: color, 
              color: '#111827',
              boxShadow: `0 10px 20px ${glow}`
            }}
          >
            <span className="text-sm">🚀</span>
            <span>TAP TO JOIN</span>
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <HotSessionPaymentModal 
          sessionName="Student Stress Room"
          startTimeLabel={getStartTimeLabel()}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => console.log('Payment Success - Room Access Primed')}
        />
      )}

      <style>{`
        @keyframes floatingPulse {
          0%, 100% { transform: translateY(0); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
          50% { transform: translateY(-5px); box-shadow: 0 15px 45px rgba(0,0,0,0.4); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { 
          from { opacity: 0; transform: scale(0.9) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
      `}</style>
    </>
  );
};

export default SessionStickyBar;
