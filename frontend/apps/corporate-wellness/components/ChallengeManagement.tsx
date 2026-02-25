
import React, { useState } from 'react';
import { MOCK_CHALLENGES } from '../constants';

interface ChallengeManagementProps {
  onBack?: () => void;
}

const ChallengeManagement: React.FC<ChallengeManagementProps> = ({ onBack }) => {
  const [scheduled, setScheduled] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSchedule = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setScheduled(true);
    }, 1000);
  };

  const handleNewChallenge = () => {
    setShowNewModal(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {onBack && (
            <button
              onClick={onBack}
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:text-[#1d7dfa] transition-all cursor-pointer"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Program Architecture</h1>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Configure Organizational Journeys</p>
          </div>
        </div>
        <button
          onClick={handleNewChallenge}
          className="px-10 py-5 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95 flex items-center space-x-3 cursor-pointer"
        >
          <span>➕</span>
          <span>New Program</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {MOCK_CHALLENGES.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5 group hover:shadow-2xl hover:border-blue-100 transition-all">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl shrink-0 group-hover:bg-blue-50 transition-all shadow-inner">
                {challenge.challenge_type === 'mindfulness' ? '🧘' : '😴'}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{challenge.challenge_name}</h3>
                  <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${challenge.featured ? 'bg-blue-50 text-[#1d7dfa]' : 'bg-slate-100 text-slate-400'}`}>
                    {challenge.featured ? 'Live Infrastructure' : 'Draft Protocol'}
                  </span>
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wide max-w-2xl leading-relaxed">{challenge.description}</p>
              </div>

              <div className="flex items-center space-x-12 shrink-0">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Adoption</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">412</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Completion</p>
                  <p className="text-3xl font-black text-[#1d7dfa] tracking-tighter">68%</p>
                </div>
                <button
                  onClick={handleNewChallenge}
                  className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-white hover:border-blue-200 transition-all shadow-sm"
                >
                  <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">⚙️</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] p-12 text-slate-900 border border-slate-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          {!scheduled ? (
            <>
              <div className="max-w-xl">
                <h4 className="text-3xl font-black mb-4 tracking-tighter text-[#1e3a8a]">Bespoke Enterprise Solutions</h4>
                <p className="text-slate-400 font-bold text-xs uppercase leading-relaxed tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                  Architect custom 12-week wellness architectures tailored to your specific organizational stress vectors and performance targets.
                </p>
              </div>
              <button
                onClick={handleSchedule}
                disabled={submitting}
                className="px-12 py-6 bg-[#1d7dfa] hover:bg-blue-600 disabled:bg-slate-100 transition-all rounded-full font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center space-x-3 shrink-0 text-white"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <span>Initiate Strategy Call</span>
                )}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center md:items-start space-y-4 animate-in slide-in-from-right-10 duration-500 w-full">
              <div className="flex items-center space-x-5">
                <span className="text-5xl">📡</span>
                <h4 className="text-3xl font-black text-[#1d7dfa] tracking-tighter">Protocol Engaged</h4>
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">A strategy architect will synchronize with <strong className="text-slate-900">priya.rao@ibm.com</strong> within 1 business cycle.</p>
              <button onClick={() => setScheduled(false)} className="text-[10px] font-black text-[#1d7dfa] uppercase tracking-[0.2em] underline mt-6 hover:text-slate-900 transition-colors">Revoke Request</button>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 blur-[80px] -mr-20 -mt-20"></div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Architect Program</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10">Define Global Performance Parameters</p>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Protocol Identity</label>
                <input type="text" placeholder="e.g. Cognitive Resilience V1" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Modality</label>
                  <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all">
                    <option>Mindfulness</option>
                    <option>Physiology</option>
                    <option>Sleep Hygiene</option>
                    <option>Sustained Focus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Cycle Duration (Days)</label>
                  <input type="number" defaultValue={30} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="mt-12 flex space-x-4">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                Abort
              </button>
              <button
                onClick={() => {
                  alert('Design Committed: AI generating daily micro-learning sequences.');
                  setShowNewModal(false);
                }}
                className="flex-1 py-5 bg-[#1d7dfa] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
              >
                Deploy Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeManagement;
