import React from 'react';

export const BackgroundParticles: React.FC = () => {
  const particles = [
    { left: '10%', top: '20%', delay: '0s' },
    { left: '30%', top: '40%', delay: '2s' },
    { left: '50%', top: '15%', delay: '4s' },
    { left: '70%', top: '35%', delay: '1s' },
    { left: '85%', top: '25%', delay: '3s' },
    { left: '20%', top: '60%', delay: '5s' },
    { left: '60%', top: '70%', delay: '2.5s' },
    { left: '80%', top: '55%', delay: '4.5s' },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {particles.map((p, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};