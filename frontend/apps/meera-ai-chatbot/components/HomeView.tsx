
import React from 'react';
import { MessageCircle, Sparkles, ShieldAlert, ArrowRight, Heart, Brain, Zap, Activity } from 'lucide-react';

interface HomeViewProps {
  onSelectMode: (mode: 'chat' | 'ar-mode' | 'crisis-dashboard') => void;
  userName: string;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectMode, userName }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#f0f7ff] custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <p className="text-[#1068eb] font-black uppercase tracking-[0.2em] text-[10px] mb-2">Welcome Back</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            How are you feeling,<br /><span className="text-[#1068eb]">{userName}?</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* AI MITRA MODE */}
          <button
            onClick={() => onSelectMode('chat')}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-100/50 text-left transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200"
          >
            <div className="w-16 h-16 bg-blue-50 text-[#1068eb] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#1068eb] group-hover:text-white transition-all shadow-inner">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">AI Meera</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Your empathetic support companion. 24/7 support via text and real-time voice notes.
            </p>
            <div className="flex items-center gap-2 text-[#1068eb] font-black text-xs uppercase tracking-widest">
              Enter Support <ArrowRight size={16} />
            </div>
            <div className="absolute top-6 right-6">
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-emerald-100">Live</span>
            </div>
          </button>

          {/* AR MODE */}
          <button
            onClick={() => onSelectMode('ar-mode')}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-100/50 text-left transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200"
          >
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">AR Mode</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Immersive mindfulness. Spatial audio and augmented therapeutic environments.
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest">
              Launch Immersive <ArrowRight size={16} />
            </div>
            <div className="absolute top-6 right-6">
              <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-purple-100">Experimental</span>
            </div>
          </button>

          {/* CRISIS DETECTION */}
          <button
            onClick={() => onSelectMode('crisis-dashboard')}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-100/50 text-left transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-red-200"
          >
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Crisis Detection</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Real-time safety monitoring, sentiment analysis, and emergency protocol routing.
            </p>
            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest">
              Safety Dashboard <ArrowRight size={16} />
            </div>
            <div className="absolute top-6 right-6">
              <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-red-100">Critical</span>
            </div>
          </button>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-100 rounded-[3rem] p-10 text-slate-800 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600">
              <Brain size={140} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px] mb-4">
                <Zap size={14} fill="currentColor" />
                Quick Affirmation
              </div>
              <p className="text-2xl font-serif italic mb-6 leading-relaxed">
                "Your current situation is not your final destination. You have the power to grow and heal."
              </p>
              <button className="bg-white hover:bg-blue-100 text-[#1068eb] border border-blue-200 px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm">
                Get Another
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-blue-50 shadow-xl shadow-blue-100/30">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                <Activity size={18} className="text-[#1068eb]" />
                Wellness Pulse
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly View</span>
            </div>
            <div className="flex items-end gap-3 h-32 mb-4">
              {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-50 rounded-t-xl relative group">
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t-xl transition-all duration-700 ${i === 3 ? 'bg-[#1068eb]' : 'bg-blue-200'}`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">Your average emotional stability has improved by 12% this week.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeView;
