import React from 'react';
import { User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ENGAGEMENT_DATA = [
  { day: 'Mon', active: 450 }, { day: 'Tue', active: 520 }, { day: 'Wed', active: 610 },
  { day: 'Thu', active: 580 }, { day: 'Fri', active: 490 }, { day: 'Sat', active: 210 }, { day: 'Sun', active: 180 },
];

const DEPT_HEALTH = [
  { name: 'Engineering', engagement: 65 }, { name: 'Sales', engagement: 88 },
  { name: 'Strategy', engagement: 92 }, { name: 'Marketing', engagement: 74 }, { name: 'Support', engagement: 58 },
];

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 font-normal text-[11px] uppercase tracking-wider mt-1">Workforce Metrics • Real-time Monitoring</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 brand-card p-6 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-medium text-slate-700">Engagement Trajectory</h3>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Active Personnel</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENGAGEMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: 'none', fontSize: '12px' }} />
                <Area type="monotone" dataKey="active" stroke="#1d7dfa" strokeWidth={2} fill="#1d7dfa" fillOpacity={0.03} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="brand-card p-6 flex flex-col gap-6">
          <h3 className="text-base font-medium text-slate-700">Departmental Pulse</h3>
          <div className="space-y-5 flex-1">
            {DEPT_HEALTH.map((dept, i) => (
              <div key={i} className="flex flex-col gap-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[11px] font-normal text-slate-500 uppercase tracking-wide">{dept.name}</span>
                    <span className="text-xs font-medium text-slate-700">{dept.engagement}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${dept.engagement}%` }}></div>
                 </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
             <p className="text-[10px] font-normal text-slate-400 uppercase tracking-wide mb-1">Overall Index</p>
             <p className="text-3xl font-normal text-slate-800 tracking-tight">7.8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;