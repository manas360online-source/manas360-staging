
import React from 'react';

interface HotRingProps {
  isLive: boolean;
  size?: 'sm' | 'md' | 'lg';
  isStartingSoon?: boolean;
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
      {/* Outer Pulse */}
      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isStartingSoon ? 'bg-[#0066ff]' : 'bg-[#0066ff]'}`}></div>
      
      {/* Neon Ring */}
      <div className={`absolute inset-0 border-[2.5px] rounded-full shadow-[0_0_15px_rgba(0,102,255,0.4)] animate-pulse border-[#0066ff]`}></div>
      
      {/* Label */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-10 border bg-blue-600 border-blue-400`}>
        {isStartingSoon ? 'Next Up' : 'Active'}
      </div>

      <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_white] bg-white`}></div>
    </div>
  );
};

export default HotRing;
