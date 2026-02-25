
import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storageService';

// --- STAR SVG FOR TILES ---
const StarTile = ({ date }: { date: number }) => (
  <div className="relative flex items-center justify-center animate-fade-in group hover:scale-110 transition-transform cursor-pointer">
    <svg 
      viewBox="0 0 24 24" 
      className="w-10 h-10 md:w-14 md:h-14 text-yellow-400 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
      fill="currentColor"
    >
      <path d="M12 1.5l3.09 6.26L22 8.7l-5 4.87 1.18 6.88L12 17.2l-6.18 3.25L7 13.57 2 8.7l6.91-.94L12 1.5z" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-[0.7rem] md:text-[0.9rem] font-black text-[#0A3A78] mt-0.5 select-none pointer-events-none">
      {date}
    </span>
  </div>
);

export const StreaksJourney: React.FC = () => {
  // --- DEMO INTERACTIVE STATE ---
  const [demoStarredDates, setDemoStarredDates] = useState<Set<number>>(new Set());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate] = useState(new Date());
  
  // Badge logic based on total starred days in this demo session
  const streakCount = demoStarredDates.size;

  const handleBack = () => {
    window.location.hash = '#/home';
  };

  const badges = [
    { id: 'bronze', emoji: '🥉', title: '7-day streak', threshold: 7 },
    { id: 'silver', emoji: '🥈', title: '30-day streak', threshold: 30 },
    { id: 'gold', emoji: '🥇', title: '90-day streak', threshold: 90 },
  ];

  const highestUnlockedBadge = [...badges].reverse().find(b => streakCount >= b.threshold);

  const toggleDate = (day: number) => {
    const newSet = new Set(demoStarredDates);
    if (newSet.has(day)) {
      newSet.delete(day);
    } else {
      newSet.add(day);
    }
    setDemoStarredDates(newSet);
  };

  // Calendar Logic
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const renderCalendar = () => {
    const days = [];
    const todayNum = currentDate.getDate();
    
    // Empty slots for start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === todayNum;
      const isStarred = demoStarredDates.has(d);

      days.push(
        <div key={d} className="h-12 md:h-16 flex items-center justify-center relative">
          {/* Today Highlight: Dark Blue Circle behind the date cell */}
          {isToday && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-800 rounded-full shadow-lg opacity-20 scale-110"></div>
            </div>
          )}
          
          <div 
            onClick={() => toggleDate(d)}
            className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer"
          >
            {isStarred ? (
              <StarTile date={d} />
            ) : (
              <div className={`
                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${isToday ? 'bg-blue-800 text-white scale-110 shadow-md ring-2 ring-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}>
                {d}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 lg:p-8 transition-colors duration-500 relative overflow-x-hidden dark:bg-[#030712]">
      {/* Background with Blur Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-[#EBF5FF] dark:bg-[#030712]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2560&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: document.documentElement.classList.contains('dark') ? 'blur(8px) brightness(0.2)' : 'blur(4px) brightness(1.1)',
        }}
      ></div>

      <div className="absolute inset-0 z-1 bg-white/40 dark:bg-slate-950/70 pointer-events-none"></div>

      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-[920px] bg-white/90 dark:bg-[#0A0F1D]/95 backdrop-blur-3xl rounded-[40px] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)] border border-white/60 dark:border-slate-800/80 flex flex-col transition-all duration-500 overflow-hidden">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-[#0052CC] dark:text-sky-400 font-black text-[1.1rem] hover:opacity-75 transition-all group uppercase tracking-tight"
          >
            <span className="text-2xl transition-transform group-hover:-translate-x-1">←</span> Dashboard
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Demo Interaction</span>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className={`relative z-[5001] p-3.5 rounded-2xl transition-all duration-500 shadow-sm ${showCalendar ? 'bg-[#0052CC] text-white' : 'bg-white dark:bg-slate-800 text-[#0052CC] dark:text-sky-300 hover:scale-105'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </button>

            {/* Nazar Bottu / Evil Eye Icon */}
            <div className="select-none pointer-events-none drop-shadow-sm">
              <span className="text-[28px] leading-none">🧿</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col items-center">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-[3rem] md:text-[4.2rem] font-bold text-[#0A3A78] dark:text-white mb-2 leading-none tracking-tight">Streaks Journey</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Click calendar icon to view progress</p>
              <span className="bg-blue-50 dark:bg-sky-500/10 text-[#0052CC] dark:text-sky-400 px-6 py-1 rounded-full font-black text-xl md:text-2xl border border-blue-100 dark:border-sky-500/20 shadow-sm">
                {streakCount} Days Logged
              </span>
            </div>
          </div>

          {/* Featured Milestone Card - Only if unlocked */}
          {highestUnlockedBadge && (
            <div className="mb-20 w-full max-w-[500px] relative animate-fade-in-up">
              <div className="absolute inset-0 bg-yellow-400/20 blur-[60px] rounded-full scale-125 animate-pulse"></div>
              <div className="relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-md rounded-[40px] p-8 border border-white/60 dark:border-slate-800/60 flex flex-col items-center shadow-xl">
                <div className="text-[7rem] md:text-[8.5rem] drop-shadow-2xl animate-float cursor-default">
                  {highestUnlockedBadge.emoji}
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-[2rem] md:text-[2.5rem] font-serif font-black text-[#0A3A78] dark:text-white leading-tight">Achievement Unlocked</h2>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em] text-xs md:text-sm mt-1">{highestUnlockedBadge.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* All Badges Row */}
          <div className="w-full">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] whitespace-nowrap">Your Milestones</h3>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 md:gap-10">
              {badges.map((badge) => {
                const unlocked = streakCount >= badge.threshold;
                return (
                  <div 
                    key={badge.id} 
                    className={`
                      relative p-8 rounded-[40px] flex flex-col items-center text-center transition-all duration-700 border
                      ${unlocked 
                        ? 'bg-white dark:bg-slate-800 border-white dark:border-slate-700 shadow-2xl scale-105 animate-pulse' 
                        : 'bg-slate-100/30 dark:bg-slate-900/20 border-transparent opacity-40'
                      }
                    `}
                  >
                    <div className={`text-5xl md:text-7xl mb-4 transition-all duration-500 ${unlocked ? 'drop-shadow-lg scale-110' : 'grayscale brightness-50'}`}>
                      {unlocked ? badge.emoji : '🔒'}
                    </div>
                    <div className={`font-black text-[0.85rem] md:text-[1.1rem] leading-tight uppercase tracking-tight ${unlocked ? 'text-[#0A3A78] dark:text-white' : 'text-slate-500'}`}>
                      {badge.title}
                    </div>
                    
                    {unlocked ? (
                      <div className="mt-3 py-1 px-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                        <span className="text-[0.6rem] md:text-[0.7rem] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Unlocked</span>
                      </div>
                    ) : (
                      <div className="mt-3 py-1 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                        <span className="text-[0.6rem] md:text-[0.7rem] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Locked</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Calendar Modal Overlay */}
      {showCalendar && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
            onClick={() => setShowCalendar(false)}
          ></div>
          <div className="relative w-full max-w-[700px] animate-fade-in-up">
            <div className="bg-white dark:bg-[#111827] rounded-[40px] p-8 md:p-10 border border-white dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-serif text-3xl font-bold text-[#0A3A78] dark:text-white">
                  {monthNames[currentDate.getMonth()]} <span className="text-slate-300 dark:text-slate-600 font-sans">{currentDate.getFullYear()}</span>
                </h3>
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-y-4 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-[0.7rem] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] mb-4">{day}</div>
                ))}
                {renderCalendar()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
