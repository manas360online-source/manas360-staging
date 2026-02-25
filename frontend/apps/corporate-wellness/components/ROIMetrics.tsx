import React, { useState } from 'react';
import { ROIMetrics } from '../types';
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
  const [costPerDay, setCostPerDay] = useState(15000); 

  const totalSaved = 170 * costPerDay;
  const programCost = 680000;
  const netSavings = totalSaved - programCost;
  const roiRatio = (totalSaved / programCost).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ROI & Financial Analytics</h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-0.5">Quantifying Strategic Impact</p>
        </div>
        <div className="px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-sm text-center">
          <p className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-0.5">Impact Ratio</p>
          <p className="text-2xl font-black tracking-tighter">{roiRatio}x</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 tracking-tight">ROI Projection Tool</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Cost per Absentee Day (₹)</label>
              <input 
                type="range" 
                min="5000" 
                max="30000" 
                step="1000" 
                value={costPerDay} 
                onChange={(e) => setCostPerDay(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#1d7dfa]"
              />
              <div className="flex justify-between mt-3 font-bold text-[8px] text-[#1d7dfa] uppercase tracking-widest">
                <span>₹5k</span>
                <span className="bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">₹{costPerDay.toLocaleString()}</span>
                <span>₹30k</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Avoided Absence</span>
                <span className="font-black text-slate-900">170 Days</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Productivity Gain</span>
                <span className="font-black text-emerald-600">₹{(totalSaved/100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Net Savings</span>
                <span className="font-black text-[#1d7dfa]">₹{(netSavings/100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 tracking-tight">Absence Reduction Curve</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ABSENTEEISM_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 800}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }} />
                <Line type="monotone" name="Baseline" dataKey="baseline" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" name="Wellness Impact" dataKey="current" stroke="#1d7dfa" strokeWidth={3} dot={{r: 4, fill: '#1d7dfa', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIMetricsView;