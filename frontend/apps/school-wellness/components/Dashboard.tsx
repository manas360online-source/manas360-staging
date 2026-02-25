
import React from 'react';
import { User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ENGAGEMENT_DATA = [
  { day: 'Mon', active: 850 }, { day: 'Tue', active: 920 }, { day: 'Wed', active: 1010 },
  { day: 'Thu', active: 980 }, { day: 'Fri', active: 890 }, { day: 'Sat', active: 410 }, { day: 'Sun', active: 380 },
];

const GRADE_HEALTH = [
  { name: 'Grade 9', engagement: 82 }, { name: 'Grade 10', engagement: 74 },
  { name: 'Grade 11', engagement: 91 }, { name: 'Grade 12', engagement: 68 },
];

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-4xl font-black text-[#1e3a8a] tracking-tighter truncate">Academic Overview</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Institution Pulse • Student Wellness Aggregate</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 brand-card p-8 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#1e3a8a] tracking-tight">Engagement Trend</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 7 Days</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENGAGEMENT_DATA}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d7dfa" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1d7dfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="active" stroke="#1d7dfa" strokeWidth={3} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="brand-card p-8 flex flex-col gap-8 bg-white">
          <h3 className="text-xl font-bold text-[#1e3a8a] tracking-tight">Grade-level Health</h3>
          <div className="space-y-6 flex-1">
            {GRADE_HEALTH.map((grade, i) => (
              <div key={i} className="flex flex-col gap-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{grade.name}</span>
                    <span className="text-lg font-black text-[#1e3a8a]">{grade.engagement}%</span>
                 </div>
                 <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-[#1d7dfa] rounded-full transition-all duration-1000" style={{ width: `${grade.engagement}%` }}></div>
                 </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-50">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">System automatically flags cohorts dropping below 60% wellness thresholds.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
