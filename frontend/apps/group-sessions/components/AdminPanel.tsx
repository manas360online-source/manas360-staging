import React, { useState } from 'react';
import { ICONS } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeVariant, setActiveVariant] = useState<'control' | 'variant_b' | 'variant_c'>('variant_b');

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8 text-white animate-[fadeIn_0.3s_ease-out] font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
         <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg text-black"><ICONS.Chart /></div>
            <h1 className="text-xl font-black uppercase tracking-widest">Admin Panel > A/B Testing</h1>
         </div>
         <button onClick={onClose} className="bg-slate-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-700">Exit Admin</button>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
         <section className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h2 className="text-2xl font-black tracking-tight mb-2">EXPERIMENT: going_live_incentive_test</h2>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Status: Running</span>
               </div>
               <div className="flex gap-2">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase">[Pause]</button>
                  <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase">[End]</button>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Started</p>
                  <p className="font-bold">Jan 15, 2025</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                  <p className="font-bold">2 weeks</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Sample Size</p>
                  <p className="font-bold">10,000 users</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Significance</p>
                  <p className="font-bold text-emerald-400">87%</p>
               </div>
            </div>
         </section>

         <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Live Variants</h3>
            {[
              { key: 'control', name: 'Variant A (Control)', traffic: '33%', incentive: 'N/A', indicator: 'OFF', joins: '2.1%', winning: false },
              { key: 'variant_b', name: 'Variant B (Recommended)', traffic: '33%', incentive: '₹50', indicator: 'ON', joins: '8.7%', winning: true },
              { key: 'variant_c', name: 'Variant C', traffic: '33%', incentive: '₹100', indicator: 'ON', joins: '9.2%', winning: false }
            ].map(v => (
              <div key={v.key} className={`p-6 rounded-[32px] border transition-all ${activeVariant === v.key ? 'bg-slate-800 border-emerald-500' : 'bg-slate-900/30 border-slate-800 opacity-60'}`}>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className={`w-3 h-3 rounded-full ${activeVariant === v.key ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                       <h4 className="font-black uppercase tracking-tighter">{v.name} - {v.traffic} traffic</h4>
                       {v.winning && <span className="bg-yellow-500/20 text-yellow-500 text-[8px] font-black px-2 py-0.5 rounded uppercase">⭐ Winner</span>}
                    </div>
                    <button onClick={() => setActiveVariant(v.key as any)} className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Select Variant</button>
                 </div>
                 <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-black/20 p-4 rounded-2xl">
                       <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Indicator</p>
                       <p className="text-xs font-black">{v.indicator}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl">
                       <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Incentive</p>
                       <p className="text-xs font-black">{v.incentive}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl">
                       <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Join Rate</p>
                       <p className="text-xs font-black text-emerald-400">{v.joins}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl">
                       <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">ROI</p>
                       <p className="text-xs font-black">{v.key === 'variant_b' ? '2.5x' : '1.8x'}</p>
                    </div>
                 </div>
              </div>
            ))}
         </section>

         <div className="bg-emerald-500 p-8 rounded-[40px] text-slate-950">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Recommendation</h3>
            <p className="text-sm font-bold opacity-80 leading-relaxed">Based on statistical analysis, VARIANT B (₹50 incentive) is recommended. It provides 314% lift with better ROI than ₹100. Higher incentives drive volume but lower conversion efficiency.</p>
            <div className="flex gap-4 mt-8">
               <button className="flex-1 bg-slate-950 text-white py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Roll out to 100%</button>
               <button className="flex-1 border-2 border-slate-950 py-4 rounded-full font-black text-[10px] uppercase tracking-widest">Export CSV</button>
            </div>
         </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default AdminPanel;