import React, { useState, useEffect } from 'react';

interface GoingLiveIndicatorProps {
  onJoin: () => void;
  sessionName: string;
  emoji?: string;
  startTime: string; // ISO string
  initialWaitlist?: number;
  incentiveAmount?: number;
}

const GoingLiveIndicator: React.FC<GoingLiveIndicatorProps> = ({ 
  onJoin, 
  sessionName, 
  emoji = '🧠',
  startTime,
  initialWaitlist = 8,
  incentiveAmount = 50
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(600); 
  const [waitingCount, setWaitingCount] = useState(initialWaitlist);
  const [showJoinedMessage, setShowJoinedMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const diff = Math.floor((new Date(startTime).getTime() - Date.now()) / 1000);
      setTimeRemaining(diff);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    const socialTimer = setInterval(() => {
      if (timeRemaining > 0) {
        setWaitingCount(prev => Math.min(25, prev + (Math.random() > 0.7 ? 1 : 0)));
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(socialTimer);
    };
  }, [startTime, timeRemaining]);

  const formatTime = (seconds: number) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUIConfig = () => {
    // Session Completed State (Image 1)
    if (timeRemaining <= 0) {
      return {
        label: '🏁 ROOM CLOSED',
        color: '#64748b',
        glow: 'rgba(100, 116, 139, 0.2)',
        anim: 'none',
        cta: 'SESSION COMPLETED',
        urgency: 'ROOM IS NOW CLOSED',
        disabled: true,
        emoji: '🏁',
        secondaryText: `${waitingCount} WAS RECENTLY JOINED`
      };
    }
    
    // Red State: 2 mins to 0 mins (Image 2)
    if (timeRemaining <= 120) { 
      return {
        label: '🔴 LIVE NOW',
        color: '#FF1744',
        glow: 'rgba(255, 23, 68, 0.6)',
        anim: 'urgentBlink 0.8s ease-in-out infinite',
        cta: 'JOIN NOW',
        urgency: 'IN SESSION',
        disabled: false,
        emoji: '🚀',
        secondaryText: `${waitingCount} PEOPLE INSIDE`
      };
    }

    // Blue State: 5 mins to 2 mins (Image 3)
    if (timeRemaining <= 300) { 
      return {
        label: '⚡ FINAL MINUTES',
        color: '#00D9FF',
        glow: 'rgba(0, 217, 255, 0.6)',
        anim: 'neonPulse 1.2s ease-in-out infinite',
        cta: 'TAP TO JOIN',
        urgency: 'ONLY A FEW MINS LEFT!',
        disabled: false,
        emoji: '🚀',
        secondaryText: `${waitingCount} PEOPLE WAITING TO JOIN`
      };
    }

    // Green State: > 5 mins (up to 10m+ as requested) (Image 4)
    return {
      label: '✨ GOING LIVE',
      color: '#39FF14',
      glow: 'rgba(57, 255, 20, 0.6)',
      anim: 'neonPulse 2s ease-in-out infinite',
      cta: 'TAP TO JOIN',
      urgency: 'REMAINING',
      disabled: false,
      emoji: '🚀',
      secondaryText: `${waitingCount} PEOPLE WAITING TO JOIN`
    };
  };

  const config = getUIConfig();

  const handleJoin = () => {
    if (config.disabled) return;
    setShowJoinedMessage(true);
    setTimeout(() => {
      setShowJoinedMessage(false);
      onJoin();
    }, 1500);
  };

  return (
    <div 
      className={`relative w-full max-w-[440px] mx-auto p-1.5 rounded-[48px] transition-all duration-700 ${config.disabled ? 'grayscale' : ''}`}
      style={{
        background: config.disabled ? '#1e293b' : `linear-gradient(45deg, ${config.color}, transparent, ${config.color})`,
        backgroundSize: '200% 200%',
        boxShadow: config.disabled ? 'none' : `0 0 40px ${config.glow}`,
        transform: isHovered && !config.disabled ? 'scale(1.02)' : 'scale(1)',
        animation: config.disabled ? 'none' : `borderFlow 3s linear infinite`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes neonPulse {
          0%, 100% { filter: brightness(1.2); opacity: 1; }
          50% { filter: brightness(0.8); opacity: 0.9; }
        }
        @keyframes urgentBlink {
          0%, 100% { filter: brightness(1.5); box-shadow: 0 0 20px rgba(255, 23, 68, 0.8); }
          50% { filter: brightness(1); box-shadow: 0 0 5px rgba(255, 23, 68, 0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="bg-[#0b0c10] rounded-[42px] p-10 flex flex-col items-center">
        
        {/* Neon Status Badge (Pill) */}
        <div 
          className="mb-8 px-6 py-2 rounded-full border-2 flex items-center gap-2"
          style={{ 
            borderColor: config.color, 
            color: config.color,
            textShadow: config.disabled ? 'none' : `0 0 10px ${config.color}`,
            animation: config.anim
          }}
        >
          {config.label === '✨ GOING LIVE' && <span className="text-[12px] animate-pulse">⚡</span>}
          <span className="text-[10px] font-black tracking-[3px] uppercase">{config.label}</span>
        </div>

        {/* Room Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-2">
            <span className={`text-4xl transition-all ${config.disabled ? 'opacity-20' : 'filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'}`}>
              {config.disabled ? '📚' : emoji}
            </span>
            <h2 className={`text-2xl font-black tracking-tighter uppercase ${config.disabled ? 'text-slate-500' : 'text-white'}`}>
              {sessionName}
            </h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">MODERATED DAILY • 60 MINS</p>
        </div>

        {/* Incentive Box (Gold) */}
        <div 
          className={`w-full relative overflow-hidden rounded-[24px] p-6 mb-8 text-left transition-all duration-500 ${config.disabled ? 'opacity-10 grayscale' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 50%, #FFB800 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 5s linear infinite'
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border border-white/30 shadow-inner">
               💰
            </div>
            <div>
              <p className="text-2xl font-black text-[#1a1a2e] leading-none tracking-tighter">Get ₹{incentiveAmount}</p>
              <p className="text-[10px] font-black text-[#1a1a2e]/60 uppercase tracking-widest mt-1">IN YOUR WALLET!</p>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="flex items-center gap-4">
             <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
               {config.disabled ? '🏁' : '⏰'}
             </span>
             <span 
               className={`text-5xl font-black font-mono tracking-tighter ${config.disabled ? 'text-slate-800' : ''}`}
               style={{ 
                 color: config.disabled ? undefined : config.color, 
                 textShadow: config.disabled ? 'none' : `0 0 20px ${config.color}` 
               }}
             >
               {formatTime(timeRemaining)}
             </span>
             {timeRemaining > 0 && <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{config.urgency}</span>}
          </div>
          {config.disabled && <p className="text-slate-600 text-[12px] font-black uppercase tracking-[0.2em]">{config.urgency}</p>}
        </div>

        {/* Social Proof */}
        <div className="mb-10 flex items-center gap-3">
           <span className="text-2xl opacity-60">👥</span>
           <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${config.disabled ? 'text-slate-600' : 'text-slate-400'}`}>
             {config.secondaryText}
           </span>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleJoin}
          disabled={config.disabled}
          className={`w-full py-6 rounded-[24px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 ${config.disabled ? 'bg-[#1e293b] text-slate-600 cursor-not-allowed border border-slate-800' : 'text-[#0b0c10] active:scale-95'}`}
          style={{ 
            backgroundColor: config.disabled ? undefined : config.color,
            boxShadow: config.disabled ? 'none' : `0 15px 40px ${config.glow}`,
            animation: config.disabled ? 'none' : config.anim
          }}
        >
          <span className="text-2xl">{config.emoji}</span>
          <span className="tracking-tighter uppercase">{config.cta}</span>
        </button>

      </div>

      {/* Join Confirmation (Image 2 style confirmation) */}
      {showJoinedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl animate-[fadeIn_0.3s_ease-out]">
           <div className="text-center p-12 rounded-[50px] border-2 bg-[#0b0c10]" style={{ borderColor: config.color, boxShadow: `0 0 60px ${config.glow}` }}>
              <span className="text-9xl block mb-8 animate-bounce">✅</span>
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">ACCESS GRANTED</h3>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm italic">₹{incentiveAmount} BOUNTY SECURED</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default GoingLiveIndicator;