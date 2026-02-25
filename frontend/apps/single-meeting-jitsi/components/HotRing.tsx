import React from 'react';

interface HotRingProps {
  isLive: boolean;
  size?: 'sm' | 'md' | 'lg';
  isStartingSoon?: boolean; // New prop for sparkles
}

const HotRing: React.FC<HotRingProps> = ({ isLive, size = 'md', isStartingSoon }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  if (!isLive && !isStartingSoon) return null;

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* PDF Part 2: Sparkles Particle Effect */}
      {isStartingSoon && (
        <div className="absolute inset-0 z-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translate(30px)`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Outer Pulse */}
      <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${isStartingSoon ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
      
      {/* Neon Ring */}
      <div className={`absolute inset-0 border-[3px] rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse ${isStartingSoon ? 'border-yellow-400' : 'border-red-500'}`}></div>
      
      {/* Hot Now Label */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10 border ${isStartingSoon ? 'bg-yellow-600 border-yellow-400' : 'bg-red-600 border-red-400'}`}>
        {isStartingSoon ? 'Starting Soon' : 'Hot Now'}
      </div>

      <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_white] ${isStartingSoon ? 'bg-yellow-200' : 'bg-white'}`}></div>
    </div>
  );
};

export default HotRing;