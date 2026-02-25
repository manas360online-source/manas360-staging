
import React from 'react';
import { User } from '../types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, LineChart, Line } from 'recharts';

const TEAM_WELLNESS_DATA = [
  { metric: 'Participation', team: 28.2, company: 42.5 },
  { metric: 'Wellness Score', team: 6.3, company: 6.1 },
  { metric: 'Stress Level', team: 7.1, company: 6.2 },
  { metric: 'Check-in Rate', team: 55, company: 68 },
];

const ANALYTICS_TRENDS = [
  { month: 'Jan', stress: 7.5, engagement: 55 },
  { month: 'Feb', stress: 7.8, engagement: 52 },
  { month: 'Mar', stress: 8.2, engagement: 48 },
  { month: 'Apr', stress: 7.6, engagement: 58 },
  { month: 'May', stress: 7.1, engagement: 62 },
  { month: 'Jun', stress: 7.1, engagement: 65 },
];

const TEAM_RANKINGS = [
  { dept: 'HR', score: 92 },
  { dept: 'Sales', score: 88 },
  { dept: 'Marketing', score: 74 },
  { dept: 'Engineering', score: 63, current: true },
  { dept: 'Finance', score: 58 },
];

interface ManagerDashboardProps {
  user: User;
  view: 'home' | 'analytics' | 'leaderboard';
}

// Added MetricBox component to fix "Cannot find name 'MetricBox'" error
const MetricBox: React.FC<{ title: string; value: string; sub: string; color: string; bg: string }> = ({ title, value, sub, color, bg }) => (
  <div className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 ${bg}`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-80">{sub}</p>
  </div>
);

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, view }) => {
  const renderHome = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Team Oversight</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">{user.department} Unit • Engineering Vertical</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricBox title="Unit Adoption" value="28.2%" sub="Benchmark Critical" color="text-red-500" bg="bg-red-50" />
        <MetricBox title="Stress Index" value="7.1/10" sub="Q3 Trend Rising" color="text-amber-500" bg="bg-white" />
        <MetricBox title="Health Score" value="6.3/10" sub="Sector Average 6.1" color="text-[#1d7dfa]" bg="bg-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Team vs. Company Benchmark</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_WELLNESS_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                <Bar dataKey="team" fill="#1d7dfa" radius={[10, 10, 0, 0]} name="Your Team" />
                <Bar dataKey="company" fill="#e2e8f0" radius={[10, 10, 0, 0]} name="Company Avg" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Priority Interventions</h3>
          <div className="space-y-6">
            <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-start gap-5">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-sm font-black text-red-900 uppercase tracking-wider mb-1">Burnout Risk: High</p>
                <p className="text-[10px] text-red-700 font-bold uppercase leading-relaxed tracking-widest opacity-80">
                  Engineering stress levels have risen 15% in the last 30 days. Consider schedule adjustments.
                </p>
              </div>
            </div>
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start gap-5">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-sm font-black text-blue-900 uppercase tracking-wider mb-1">Low Engagement</p>
                <p className="text-[10px] text-blue-700 font-bold uppercase leading-relaxed tracking-widest opacity-80">
                  Participation is 14% below company average. Suggest a mindfulness workshop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Team Analytics</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Deeper Data Insight</p>
      </header>

      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
        <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Monthly Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ANALYTICS_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '10px' }} />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Stress" />
              <Line type="monotone" dataKey="engagement" stroke="#1d7dfa" strokeWidth={3} dot={{ r: 4 }} name="Engagement %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Departmental Standings</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Cross-Unit Wellness Comparison</p>
      </header>

      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
        <div className="space-y-8">
          {TEAM_RANKINGS.map((rank, i) => (
            <div key={i} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${rank.current ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-50 hover:border-slate-100'}`}>
              <div className="flex items-center gap-6">
                <span className="text-2xl font-black text-slate-300">#{i + 1}</span>
                <span className="text-lg font-black text-slate-900 uppercase tracking-tight">{rank.dept}</span>
                {rank.current && <span className="bg-[#1d7dfa] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ml-3">Your Unit</span>}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${rank.current ? 'bg-[#1d7dfa]' : 'bg-slate-300'}`} style={{ width: `${rank.score}%` }}></div>
                </div>
                <span className="text-xl font-black text-slate-900">{rank.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Added return switch statement to fix "Type 'void' is not assignable to type 'ReactNode'" error
  switch (view) {
    case 'analytics': return renderAnalytics();
    case 'leaderboard': return renderLeaderboard();
    case 'home':
    default: return renderHome();
  }
};

export default ManagerDashboard;
