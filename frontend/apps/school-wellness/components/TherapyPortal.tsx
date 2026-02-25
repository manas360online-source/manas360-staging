
import React from 'react';
import { User } from '../types';

const TherapyPortal: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mind-Body Health</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Unlimited Professional Support</p>
        </div>
        <div className="px-8 py-4 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-3">
          <span className="text-emerald-500 text-xl font-black">∞</span>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Enterprise Premium Access</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           <TherapyCard 
             title="Video Consult" 
             desc="1-on-1 private video session with a senior clinical psychologist." 
             icon="📹" 
             primary 
           />
           <TherapyCard 
             title="Priority Chat" 
             desc="Instant messaging for immediate crisis or stress management." 
             icon="💬" 
           />
           <TherapyCard 
             title="Anonymous Support" 
             desc="Group-based peer sessions facilitated by experts." 
             icon="👥" 
           />
           <TherapyCard 
             title="EAP Integration" 
             desc="Submit claims directly to external insurance providers." 
             icon="🏦" 
           />
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
           <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Your Schedule</h3>
           <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 opacity-60">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">No sessions pending</p>
                 <button className="w-full py-4 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100">Schedule Now</button>
              </div>
           </div>
           
           <div className="mt-10 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
             <span className="text-2xl">🔒</span>
             <div>
               <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider mb-1">Strict Confidentiality</p>
               <p className="text-[9px] text-blue-700 font-bold uppercase leading-relaxed tracking-widest opacity-70">
                 Story 8.2 Protocol: Your manager and HR can NEVER see session contents or booking history.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TherapyCard: React.FC<{ title: string; desc: string; icon: string; primary?: boolean }> = ({ title, desc, icon, primary }) => (
  <div className={`p-10 rounded-[3.5rem] transition-all group hover:-translate-y-2 cursor-pointer ${primary ? 'bg-white border border-blue-100 shadow-2xl shadow-blue-500/10' : 'bg-white border border-slate-100 shadow-xl shadow-blue-500/5 hover:border-blue-100'}`}>
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-sm transition-transform group-hover:scale-110 ${primary ? 'bg-blue-50' : 'bg-slate-50'}`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed mb-8">{desc}</p>
    <button className={`px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all ${primary ? 'bg-[#1d7dfa] text-white shadow-xl shadow-blue-200 hover:bg-blue-600' : 'bg-slate-50 text-slate-400 group-hover:bg-[#1d7dfa] group-hover:text-white group-hover:shadow-xl'}`}>
      Request Session
    </button>
  </div>
);

export default TherapyPortal;
