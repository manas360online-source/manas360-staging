
import React, { useState, useEffect } from 'react';
import { User, WellnessChallenge, ChallengeEnrollment } from '../types';
import { MOCK_CHALLENGES, ANIMAL_NAMES } from '../constants';

interface EmployeePortalProps {
  user: User;
  activeView: 'home' | 'challenges' | 'leaderboard';
  onViewChange: (view: 'home' | 'challenges' | 'leaderboard') => void;
}

const ALL_REWARDS = [
  { id: 'b1', icon: "🌱", label: "Early Bird", description: "Completed 5 sessions before 9:00 AM", earned: true },
  { id: 'b2', icon: "🧘", label: "Zen Master", description: "10 hours of mindfulness completed", earned: true },
  { id: 'b3', icon: "🌊", label: "Hydration Hero", description: "Logged water intake for 7 consecutive days", earned: true },
  { id: 'b4', icon: "🔥", label: "Streak Star", description: "Reached a 10-day wellness streak", earned: false },
  { id: 'b5', icon: "💤", label: "Sleep King", description: "8 hours of sleep for 5 nights in a row", earned: false },
  { id: 'b6', icon: "🍎", label: "Nutritionist", description: "Completed a healthy eating workshop", earned: false },
  { id: 'b7', icon: "🏃", label: "Marathoner", description: "Walked 100,000 steps in one week", earned: false },
  { id: 'b8', icon: "🤝", label: "Team Player", description: "Joined a departmental wellness group", earned: false },
];

const EmployeePortal: React.FC<EmployeePortalProps> = ({ user, activeView, onViewChange }) => {
  const [enrollments, setEnrollments] = useState<ChallengeEnrollment[]>([
    {
      id: 'en-initial',
      challenge_id: 'ch-1',
      patient_id: user.id,
      enrolled_at: new Date().toISOString(),
      status: 'in_progress',
      days_completed: 4,
      current_streak: 5,
      longest_streak: 5,
      total_points_earned: 75,
      check_ins: {}
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const handleEnroll = (challenge: WellnessChallenge) => {
    if (enrollments.some(e => e.challenge_id === challenge.id)) {
      onViewChange('home');
      return;
    }

    const newEnrollment: ChallengeEnrollment = {
      id: `en-${Date.now()}`,
      challenge_id: challenge.id,
      patient_id: user.id,
      enrolled_at: new Date().toISOString(),
      status: 'enrolled',
      days_completed: 0,
      current_streak: 0,
      longest_streak: 0,
      total_points_earned: 0,
      check_ins: {}
    };
    setEnrollments([...enrollments, newEnrollment]);
    onViewChange('home');
  };

  const handleCompleteSession = (enrollmentId: string) => {
    setSessionComplete(true);
    setTimeout(() => {
      setEnrollments(prev => prev.map(en => {
        if (en.id === enrollmentId) {
          const challenge = MOCK_CHALLENGES.find(c => c.id === en.challenge_id);
          return {
            ...en,
            days_completed: en.days_completed + 1,
            total_points_earned: en.total_points_earned + (challenge?.points_per_day || 5),
            current_streak: en.current_streak + 1
          };
        }
        return en;
      }));
      setActiveSessionId(null);
      setSessionComplete(false);
    }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Good morning, {user.name.split(' ')[0]} ☀️</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Keep the 5-day streak alive!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Points" value={(enrollments.reduce((acc, curr) => acc + curr.total_points_earned, 0) + 1165).toLocaleString()} sub="Top 15% Rank" icon="💎" />
        <StatCard label="Current Streak" value="5 Days" sub="Record: 12" icon="🔥" />
        <StatCard label="Focus Minutes" value="120" sub="Month-to-Date" icon="🧘" />
        <StatCard label="Activities" value={(enrollments.reduce((acc, curr) => acc + curr.days_completed, 0) + 4).toString()} sub="Target: 12" icon="✅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Progress</h3>
          {enrollments.length > 0 ? (
            enrollments.map((en) => {
              const challenge = MOCK_CHALLENGES.find(c => c.id === en.challenge_id);
              if (!challenge) return null;
              const progress = Math.min(100, Math.round((en.days_completed / challenge.duration_days) * 100));
              return (
                <div key={en.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5 flex flex-col md:flex-row gap-8 items-center transition-all hover:shadow-2xl">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl shrink-0 shadow-sm">
                    {challenge.challenge_type === 'mindfulness' ? '🧘' : '😴'}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{challenge.challenge_name}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Day {en.days_completed + 1} of {challenge.duration_days}</p>
                      </div>
                      <span className="text-2xl font-black text-[#1d7dfa]">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                      <div className="h-full bg-[#1d7dfa] transition-all duration-1000 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveSessionId(en.id)}
                    className="px-8 py-5 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95 whitespace-nowrap"
                  >
                    Launch Session
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 shadow-inner">
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active programs found</p>
               <button onClick={() => onViewChange('challenges')} className="mt-6 px-10 py-5 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95">Discover Challenges</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
           <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Hall of Fame</h3>
           <div className="grid grid-cols-2 gap-4">
              {ALL_REWARDS.filter(r => r.earned).slice(0, 3).map(reward => (
                <BadgeItem key={reward.id} icon={reward.icon} label={reward.label} />
              ))}
              <div className="aspect-square bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-100">
                <span className="text-3xl opacity-20">🔒</span>
              </div>
           </div>
           <button 
            onClick={() => setShowRewardsModal(true)}
            className="w-full mt-10 py-5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95"
           >
            View Milestone Catalog
           </button>
        </div>
      </div>

      {showRewardsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Wellness Milestones</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Unlock rewards by staying consistent</p>
              </div>
              <button 
                onClick={() => setShowRewardsModal(false)}
                className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-300 transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ALL_REWARDS.map((reward) => (
                  <div key={reward.id} className={`p-8 rounded-[2.5rem] border transition-all flex items-center space-x-6 ${
                    reward.earned 
                      ? 'bg-white border-blue-100 shadow-xl shadow-blue-500/5' 
                      : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                  }`}>
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shrink-0 ${
                      reward.earned ? 'bg-blue-50' : 'bg-white shadow-inner'
                    }`}>
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight">{reward.label}</h4>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed mt-1">{reward.description}</p>
                      <div className="mt-3">
                        {reward.earned ? (
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Mastered</span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">Locked</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">3 / {ALL_REWARDS.length} Milestones Achieved</p>
              <button 
                onClick={() => setShowRewardsModal(false)}
                className="px-10 py-5 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
              >
                Continue Journey
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 md:p-16 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {!sessionComplete ? (
              <>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-28 h-28 bg-blue-50 rounded-[2.5rem] text-5xl mb-10 shadow-sm animate-bounce">
                    {MOCK_CHALLENGES.find(c => c.id === enrollments.find(e => e.id === activeSessionId)?.challenge_id)?.challenge_type === 'mindfulness' ? '🧘' : '😴'}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Your Daily Session</h3>
                  <p className="text-[#1d7dfa] font-black text-xs tracking-[0.25em] uppercase">
                    {MOCK_CHALLENGES.find(c => c.id === enrollments.find(e => e.id === activeSessionId)?.challenge_id)?.challenge_name}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-12 border border-slate-100 shadow-inner">
                  <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                    {MOCK_CHALLENGES.find(c => c.id === enrollments.find(e => e.id === activeSessionId)?.challenge_id)?.daily_prompts['1'].title}
                  </h4>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-wide">
                    {MOCK_CHALLENGES.find(c => c.id === enrollments.find(e => e.id === activeSessionId)?.challenge_id)?.daily_prompts['1'].prompt}
                  </p>
                  <div className="mt-8 flex items-center space-x-3 text-[#1d7dfa]">
                    <span className="text-2xl">⏱️</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                      {MOCK_CHALLENGES.find(c => c.id === enrollments.find(e => e.id === activeSessionId)?.challenge_id)?.daily_prompts['1'].duration_minutes} Minute Practice
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setActiveSessionId(null)}
                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-600 transition-all"
                  >
                    Pause Practice
                  </button>
                  <button 
                    onClick={() => handleCompleteSession(activeSessionId)}
                    className="flex-1 py-5 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    Finish Session
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 animate-in zoom-in duration-500">
                <div className="text-8xl mb-10">✨</div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Momentum Gained</h3>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-12">Consistency is the path to growth</p>
                <div className="inline-flex items-center space-x-4 px-10 py-5 bg-emerald-50 text-emerald-600 rounded-full font-black text-xs uppercase tracking-[0.25em]">
                  <span>+20 XP</span>
                  <span className="text-emerald-200">|</span>
                  <span>🔥 Streak Up</span>
                </div>
              </div>
            )}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Wellness Hub</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Select your next evolution</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {MOCK_CHALLENGES.map((challenge) => {
          const isEnrolled = enrollments.some(e => e.challenge_id === challenge.id);
          return (
            <div key={challenge.id} className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-blue-500/5 flex flex-col group hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="h-52 bg-[#1d7dfa] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-white text-[10px] font-black uppercase tracking-[0.25em] border border-white/30">
                    {challenge.challenge_type}
                  </span>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="text-8xl">{challenge.challenge_type === 'mindfulness' ? '🧘' : '😴'}</span>
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{challenge.challenge_name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-8 leading-relaxed line-clamp-3">{challenge.description}</p>
                <div className="flex items-center space-x-6 mb-10">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">⏱️</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{challenge.duration_days} Days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{challenge.difficulty_level}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleEnroll(challenge)}
                  disabled={isEnrolled}
                  className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                    isEnrolled 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                      : 'bg-[#1d7dfa] text-white hover:bg-blue-600 shadow-blue-200 active:scale-95'
                  }`}
                >
                  {isEnrolled ? 'Already Enrolled' : 'Begin Challenge'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Collective Rankings</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Growth through collaborative competition</p>
      </header>

      <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-xl shadow-blue-500/5 overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Anonymized Standings</h3>
          <span className="text-[10px] font-black text-[#1d7dfa] bg-blue-50 px-5 py-2 rounded-full uppercase tracking-[0.25em]">System-Wide</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Rank</th>
                <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Employee Alias</th>
                <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Department</th>
                <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">XP Points</th>
                <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...Array(8)].map((_, i) => (
                <tr key={i} className={`hover:bg-slate-50/50 transition-all ${i === 2 ? 'bg-blue-50/50 group' : ''}`}>
                  <td className="py-6 font-black text-slate-900 text-xl">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td className="py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-inner group-hover:bg-white">🐾</div>
                      <span className="font-black text-slate-700 tracking-tight">
                        Anonymous {ANIMAL_NAMES[i]} 
                        {i === 2 && <span className="text-[8px] bg-[#1d7dfa] text-white px-3 py-1 rounded-full ml-3 tracking-widest uppercase font-black">Identity Protected</span>}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Engineering</td>
                  <td className="py-6 font-black text-slate-900 text-right text-lg">{1240 - (i * 120)}</td>
                  <td className="py-6 font-black text-orange-500 text-right text-sm">{15 - i} 🔥</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] flex items-start space-x-5">
          <span className="text-3xl">🛡️</span>
          <div>
            <p className="text-sm font-black text-blue-900 uppercase tracking-wider">Privacy Integrity Guaranteed</p>
            <p className="text-[11px] text-blue-700 font-bold uppercase tracking-widest leading-relaxed mt-1 opacity-80">Aliases are generated randomly. Managers only receive aggregated high-level participation trends.</p>
          </div>
        </div>
      </div>
    </div>
  );

  switch (activeView) {
    case 'challenges': return renderChallenges();
    case 'leaderboard': return renderLeaderboard();
    case 'home':
    default: return renderDashboard();
  }
};

const StatCard: React.FC<{ label: string; value: string; sub: string; icon: string }> = ({ label, value, sub, icon }) => (
  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-blue-500/5 transition-all hover:shadow-2xl group cursor-default">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-[#1d7dfa] transition-colors">{label}</span>
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-80">{sub}</p>
  </div>
);

const BadgeItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="aspect-square bg-white rounded-[2rem] flex flex-col items-center justify-center border border-slate-100 shadow-xl shadow-blue-500/5 p-4 text-center group hover:border-blue-200 transition-all cursor-default">
    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1d7dfa]">{label}</span>
  </div>
);

export default EmployeePortal;
