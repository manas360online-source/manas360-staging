
import React from 'react';
import { Session, User } from '../types';
import { VR_ENVIRONMENTS } from '../constants';

interface DashboardProps {
  user: User;
  sessions: Session[];
  onJoinSession: (session: Session) => void;
  activeTab: 'SESSIONS' | 'VR_LAB';
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, onJoinSession, activeTab }) => {
  const individualSessions = sessions.filter(s => !s.isGroup);

  return (
    <div className="min-h-screen pt-20 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
            <div className="w-16 h-16 bg-[#0066ff] rounded-[24px] flex items-center justify-center text-white font-black text-3xl shadow-xl mb-6 mx-auto">M</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2 italic">Support Console</h1>
            <p className="text-[11px] font-black text-[#0066ff] uppercase tracking-[0.4em] opacity-80">
              SECURE JOIN TERMINAL • {user.name}
            </p>
        </header>

        {activeTab === 'SESSIONS' ? (
          <section className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Upcoming Consultations</h2>
                <span className="bg-blue-50 text-[#0066ff] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Active Deck</span>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {individualSessions.length > 0 ? individualSessions.map(session => (
                    <div key={session.id} className={`bg-white p-8 rounded-[48px] border-2 transition-all flex items-center justify-between group hover:shadow-2xl hover:scale-[1.01] ${session.isVR ? 'border-purple-100 hover:border-purple-600' : 'border-white hover:border-[#0066ff]'}`}>
                        <div className="flex items-center gap-8">
                            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center font-black text-3xl shadow-sm ${session.isVR ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-[#0066ff]'}`}>
                                {session.isVR ? '🥽' : session.patientName?.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                  <h4 className="font-black text-slate-900 uppercase tracking-tighter text-2xl group-hover:text-[#0066ff] transition-colors">{session.patientName}</h4>
                                  {session.isVR && <span className="bg-purple-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">VR CBT</span>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                    <span className="text-[11px] font-black text-[#0066ff] uppercase tracking-widest italic">{session.isVR ? 'Immersive Sim' : 'E2EE Locked'}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => onJoinSession(session)} className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl active:scale-95 ${session.isVR ? 'bg-purple-600 shadow-purple-600/30 text-white' : 'bg-[#0066ff] shadow-blue-600/30 text-white'}`}>
                          Join Room
                        </button>
                    </div>
                )) : (
                  <div className="py-24 bg-white/50 border-2 border-dashed border-slate-200 rounded-[56px] text-center">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">No joinable sessions scheduled at this moment.</p>
                  </div>
                )}
            </div>
          </section>
        ) : (
          <section className="animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-12">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">VR Environment Library</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Catalog for Clinical Use</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {VR_ENVIRONMENTS.map(env => (
                 <div key={env.id} className="group bg-white rounded-[48px] overflow-hidden border-2 border-white hover:border-purple-600 transition-all shadow-sm hover:shadow-2xl">
                    <div className="aspect-video relative overflow-hidden">
                       <img src={env.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={env.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                       <div className="absolute bottom-6 left-8 flex items-center gap-4">
                          <span className="text-3xl bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20">{env.icon}</span>
                          <div>
                            <p className="text-white text-xl font-black uppercase tracking-tighter leading-none">{env.name}</p>
                            <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-1">{env.therapy_type} protocol</p>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
