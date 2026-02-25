
import React from 'react';
import { User } from '../types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, LineChart, Line, Cell } from 'recharts';
import { ANIMAL_NAMES } from '../constants';

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

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, view }) => {
  const renderHome = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Team Oversight</h1>
          {/* Fix: Property 'department' does not exist on type 'User'. Changed to 'role'. */}
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">{user.role} Unit • Engineering Vertical</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricBox title="Unit Adoption" value="28.2%" sub="Benchmark Critical" color="text-red-500" bg="bg-red-50" />
        <MetricBox title="Stress Index" value="7.1/10" sub="Q3 Trend Rising" color="text-amber-500" bg="bg-amber-50" />
        <MetricBox title="Check-in Velocity" value="55%" sub="+12% Weekly Delta" color="text-[#1d7dfa]" bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Cross-Unit Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_WELLNESS_DATA} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                {/* Fix: textTransform is not a valid SVG text property in tick object. Removed it. */}
                <YAxis dataKey="metric" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 35px -5px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="team" name="Your Unit" fill="#1d7dfa" radius={[0, 10, 10, 0]} barSize={24} />
                <Bar dataKey="company" name="Global Avg" fill="#e2e8f0" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Manager Directives</h3>
          <div className="space-y-4">
             <TodoItem icon="📢" text="Address Peak Stress in Sprint Review" />
             <TodoItem icon="✨" text="Commend Team for Sleep Program completion" />
             <TodoItem icon="🗓️" text="Authorize Wellness Synchronicity Hour" />
          </div>
          <div className="mt-10 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
            <span className="text-2xl mt-1">🛡️</span>
            <div>
              <p className="text-[10px] font-black mb-1 uppercase tracking-[0.25em] text-[#1d7dfa]">Privacy Integrity Shield</p>
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest leading-relaxed opacity-80 italic">K-anonymity protocols active. Individual data trajectories are mathematically shielded to ensure absolute employee anonymity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Advanced Team Metrics</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Multi-dimensional Performance Analysis</p>
      </header>

      <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-xl shadow-blue-500/5">
        <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Systemic Interaction Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ANALYTICS_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} />
              <Tooltip />
              <Line type="monotone" name="Stress Magnitude" dataKey="stress" stroke="#ef4444" strokeWidth={5} dot={{r: 6}} />
              <Line type="monotone" name="Adoption Rate (%)" dataKey="engagement" stroke="#1d7dfa" strokeWidth={5} dot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Program Adoption</h3>
          <div className="space-y-6">
            <ProgressBar label="Mindfulness Practices" value={78} />
            <ProgressBar label="Sleep Optimization" value={62} />
            <ProgressBar label="System Ergonomics" value={34} />
          </div>
        </div>
        <div className="bg-blue-50 rounded-[3.5rem] p-10 border border-blue-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
           <h4 className="text-2xl font-black mb-4 tracking-tight text-[#1d7dfa]">Decision Support AI</h4>
           <p className="text-blue-900/80 font-bold text-sm uppercase leading-relaxed tracking-widest group-hover:text-blue-900 transition-colors">
             Stress peak in March correlated with project release velocity. Post-event recovery is trending positive as employees adopted mindfulness sequences. Strategic recommendation: Maintain modality focus.
           </p>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1d7dfa]/5 blur-[60px]"></div>
        </div>
      </div>
    </div>
  );

  const renderRanking = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Organizational Standings</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Cross-Departmental Performance Benchmarking</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Aggregate Wellness Index</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_RANKINGS} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                {/* Fix: textTransform is not a valid SVG text property in tick object. Removed it. */}
                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip />
                <Bar dataKey="score" radius={[12, 12, 0, 0]} barSize={48}>
                  {TEAM_RANKINGS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.current ? '#1d7dfa' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Top Performance (Masked)</h3>
          <div className="space-y-6">
            {ANIMAL_NAMES.slice(0, 5).map((animal, i) => (
              <div key={animal} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-slate-300">#{i + 1}</span>
                  <span className="text-sm font-black text-slate-700 tracking-tight group-hover:text-[#1d7dfa] transition-colors">Anonymous {animal}</span>
                </div>
                <span className="text-[10px] font-black text-[#1d7dfa] uppercase tracking-widest">{(1200 - i * 50)} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  switch (view) {
    case 'analytics': return renderAnalytics();
    case 'leaderboard': return renderRanking();
    case 'home':
    default: return renderHome();
  }
};

const MetricBox: React.FC<{ title: string; value: string; sub: string; color: string; bg: string }> = ({ title, value, sub, color, bg }) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:-translate-y-2 group cursor-default">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 group-hover:text-slate-900 transition-colors">{title}</p>
    <h2 className={`text-5xl font-black tracking-tighter ${color}`}>{value}</h2>
    <p className={`text-[10px] font-black mt-4 px-4 py-1.5 rounded-full uppercase tracking-widest ${bg} ${color}`}>{sub}</p>
  </div>
);

const TodoItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center space-x-5 p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
    <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-sm text-slate-700 font-black tracking-tight uppercase">{text}</span>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black mb-3 px-1">
      <span className="text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-slate-900 tracking-widest">{value}% Adoption</span>
    </div>
    <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
      <div className="h-full bg-[#1d7dfa] rounded-full transition-all duration-1000 ease-out" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default ManagerDashboard;
