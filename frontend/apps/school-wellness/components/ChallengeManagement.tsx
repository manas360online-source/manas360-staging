
import React, { useState } from 'react';
import { MOCK_CHALLENGES } from '../constants';

const ChallengeManagement: React.FC = () => {
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Program Architecture</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Configure Academic Journeys</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="px-6 py-3.5 bg-[#1d7dfa] text-white rounded-full font-bold text-[12px] uppercase tracking-wide shadow-lg hover:bg-blue-600 transition-all flex items-center space-x-2"
        >
          <span>➕</span>
          <span>New Program</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_CHALLENGES.map((challenge) => (
          <div key={challenge.id} className="brand-card p-8 group hover:border-blue-100 bg-white">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:bg-blue-50 transition-all">
                {challenge.challenge_type === 'mindfulness' ? '🧘' : '😴'}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{challenge.challenge_name}</h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${challenge.featured ? 'bg-blue-50 text-[#1d7dfa]' : 'bg-slate-100 text-slate-400'}`}>
                    {challenge.featured ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="text-slate-400 font-medium text-xs max-w-2xl leading-relaxed">{challenge.description}</p>
              </div>

              <div className="flex items-center space-x-8 shrink-0">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adoption</p>
                  <p className="text-xl font-black text-slate-900">412</p>
                </div>
                <button className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-white hover:border-blue-200 transition-all">
                  <span className="text-lg">⚙️</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
             <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter">Architect Program</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Name</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" placeholder="e.g. Cognitive Resilience" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowNewModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-full font-bold text-[11px] uppercase tracking-widest">Cancel</button>
                  <button className="flex-1 py-4 bg-[#1d7dfa] text-white rounded-full font-bold text-[11px] uppercase tracking-widest">Create</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeManagement;
