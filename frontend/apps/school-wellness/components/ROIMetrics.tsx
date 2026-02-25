
import React, { useState } from 'react';
// Fix: Removed ROIMetrics import as it is not used and not exported from types.ts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const ABSENTEEISM_TREND = [
  { month: 'Jan', baseline: 150, current: 145 },
  { month: 'Feb', baseline: 155, current: 140 },
  { month: 'Mar', baseline: 145, current: 120 },
  { month: 'Apr', baseline: 160, current: 110 },
  { month: 'May', baseline: 150, current: 95 },
  { month: 'Jun', baseline: 155, current: 88 },
];

const ROIMetricsView: React.FC = () => {
  const [costPerDay, setCostPerDay] = useState(15000); // INR

  const totalSaved = 170 * costPerDay;
  const programCost = 680000;
  const netSavings = totalSaved - programCost;
  const roiRatio = (totalSaved / programCost).toFixed(2);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ROI & Financial Analytics</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Quantifying Wellness Impact</p>
        </div>
        <div className="px-10 py-6 bg-emerald-600 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80 mb-1">Impact Ratio</p>
          <p className="text-4xl font-black tracking-tighter">{roiRatio}x</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Interactive ROI Model</h3>
          <div className="space-y-10">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Avg Cost per Absentee Day (₹)</label>
              <input 
                type="range" 
                min="5000" 
                max="30000" 
                step="1000" 
                value={costPerDay} 
                onChange={(e) => setCostPerDay(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#1d7dfa]"
              />
              <div className="flex justify-between mt-4 font-black text-[10px] text-[#1d7dfa] uppercase tracking-widest">
                <span>₹5,000</span>
                <span className="bg-blue-50 px-3 py-1 rounded-full">₹{costPerDay.toLocaleString()}</span>
                <span>₹30,000</span>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-50 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absence Days Avoided</span>
                <span className="font-black text-slate-900">170 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Productivity Gain</span>
                <span className="font-black text-emerald-600">₹{(totalSaved/100000).toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Ecosystem Savings</span>
                <span className="font-black text-[#1d7dfa]">₹{(netSavings/100000).toFixed(2)} Lakhs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Systematic Absence Reduction</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ABSENTEEISM_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 35px -5px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }} />
                <Line type="monotone" name="Static Baseline" dataKey="baseline" stroke="#e2e8f0" strokeWidth={3} strokeDasharray="8 8" dot={false} />
                <Line type="monotone" name="MANAS360 Impact" dataKey="current" stroke="#1d7dfa" strokeWidth={6} dot={{r: 8, fill: '#1d7dfa', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
          <h4 className="text-2xl font-black mb-6 tracking-tight">Executive Insight Summary</h4>
          <p className="text-slate-400 font-bold text-sm uppercase leading-relaxed tracking-wider mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
            Program integration has neutralized unscheduled absences by <span className="text-white font-black">37.8%</span> relative to industry peers. This recovered <span className="text-white font-black">1,360 high-intensity engineering hours</span> in Q3, directly correlating with accelerated project delivery cycles.
          </p>
          <button className="px-10 py-5 bg-white/10 hover:bg-white/20 transition-all rounded-full font-black text-xs uppercase tracking-[0.25em] backdrop-blur-md">Export Financial Memo</button>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[60px]"></div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Benchmark Analysis</h3>
          <div className="space-y-8">
             <ComparisonBar label="MANAS360 Score" value={2.75} max={4} color="bg-[#1d7dfa]" />
             <ComparisonBar label="Tech Vertical Avg" value={2.10} max={4} color="bg-slate-200" />
             <ComparisonBar label="Enterprise Global" value={1.80} max={4} color="bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonBar: React.FC<{ label: string, value: number, max: number, color: string }> = ({ label, value, max, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black mb-3">
      <span className="text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-slate-900 tracking-widest">{value}x ROI</span>
    </div>
    <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(value/max)*100}%` }}></div>
    </div>
  </div>
);

export default ROIMetricsView;
