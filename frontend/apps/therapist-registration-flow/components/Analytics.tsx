
import React from 'react';
import { ArrowLeft, PieChart, Wallet, Star, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Week 1', val: 40 },
  { name: 'Week 2', val: 30 },
  { name: 'Week 3', val: 65 },
  { name: 'Week 4', val: 45 },
  { name: 'Week 5', val: 80 },
  { name: 'Week 6', val: 60 },
];

interface Props {
  onBack: () => void;
}

const Analytics: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="w-full max-w-7xl bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="bg-[#EDF5FF] p-3 rounded-full hover:bg-[#D0E4FF] transition-colors">
            <ArrowLeft size={24} className="text-[#1D75FF]" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-[#1D3A63] leading-tight">Analytics</h1>
            <p className="text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold text-xs">Clinical Insight Engine</p>
          </div>
        </div>
        <button className="hidden md:flex items-center gap-3 bg-[#1D75FF] text-white px-8 py-4 rounded-full font-black shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
          <Download size={20} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-[#EDF5FF]/30 p-8 rounded-[2.5rem] border border-[#D0E4FF]/30 text-center space-y-2">
           <Star className="mx-auto text-amber-500 fill-amber-500" size={32} />
           <span className="block text-4xl font-black text-[#1D3A63]">4.92</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
        </div>
        <div className="bg-[#EDF5FF]/30 p-8 rounded-[2.5rem] border border-[#D0E4FF]/30 text-center space-y-2">
           <TrendingUp className="mx-auto text-[#1D75FF]" size={32} />
           <span className="block text-4xl font-black text-[#1D3A63]">89%</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Success</span>
        </div>
        <div className="bg-[#EDF5FF]/30 p-8 rounded-[2.5rem] border border-[#D0E4FF]/30 text-center space-y-2">
           <PieChart className="mx-auto text-indigo-500" size={32} />
           <span className="block text-4xl font-black text-[#1D3A63]">96%</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retention</span>
        </div>
        <div className="bg-[#EDF5FF]/30 p-8 rounded-[2.5rem] border border-[#D0E4FF]/30 text-center space-y-2">
           <Wallet className="mx-auto text-amber-600" size={32} />
           <span className="block text-4xl font-black text-[#1D3A63]">₹2.4L</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-[#D0E4FF]/30 rounded-[3rem] p-10 shadow-xl space-y-8">
          <h3 className="text-2xl font-black text-[#1D3A63]">Session Frequency</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f1f7ff'}} contentStyle={{borderRadius: '1rem', border: 'none'}} />
                <Bar dataKey="val" fill="#1D75FF" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1D3A63] text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center gap-6">
           <h3 className="text-3xl font-black">Performance Leader</h3>
           <p className="text-slate-400 text-lg leading-relaxed">
             You are in the <strong>Top 5%</strong> of providers. Exceptional adherence and outcomes across clinical records.
           </p>
           <div className="pt-6 flex gap-10">
             <div><span className="block text-4xl font-black">94%</span><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adherence</span></div>
             <div><span className="block text-4xl font-black">240+</span><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Log Hours</span></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
