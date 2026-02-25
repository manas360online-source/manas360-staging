import React, { useState } from 'react';
import { SessionInfo } from '../types';
import { ICONS } from '../constants';

interface Props {
  session: SessionInfo;
  onJoin: () => void;
  onHome: () => void;
}

const BookingConfirmed: React.FC<Props> = ({ session, onJoin, onHome }) => {
  const [calendarAdded, setCalendarAdded] = useState(false);

  const buttonBaseClass = "flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-4";

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.6s_ease-out]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Booking Confirmed</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Reference: MS-2026-X12</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Status Area */}
        <div className="lg:col-span-4 bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center shadow-[0_20px_40px_rgba(16,185,129,0.2)] mb-8">
            <ICONS.Check />
          </div>
          <h2 className="text-emerald-600 text-3xl font-black uppercase tracking-tight mb-4">Confirmed!</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">Your HD video session with Dr. Ananya is fully secured and scheduled.</p>
          
          <div className="w-full space-y-4 pt-8 border-t border-slate-50">
             <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">📧</div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400">Notification</p>
                   <p className="text-xs font-bold text-slate-700">Email sent to registered user</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">📱</div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400">SMS Confirm</p>
                   <p className="text-xs font-bold text-slate-700">{session.phone}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Details Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16"></div>
             
             <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">👩‍⚕️</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{session.therapistName}</h3>
                    <p className="text-blue-600 text-xs font-black uppercase tracking-widest">Clinical Psychologist</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-slate-900">{session.price}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Amount Paid</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Schedule</p>
                   <div className="flex items-center gap-3">
                      <ICONS.Calendar />
                      <span className="font-bold text-slate-800">{session.date} • {session.time}</span>
                   </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Platform</p>
                   <div className="flex items-center gap-3 text-slate-800 font-bold">
                      <span className="text-lg">📹</span>
                      <span>HD Video • {session.duration}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <button 
               onClick={onJoin}
               className={buttonBaseClass}
             >
               <span className="text-xl">▶</span> Join Meeting
             </button>
             <button 
               onClick={() => setCalendarAdded(true)}
               className={buttonBaseClass}
             >
               {calendarAdded ? <span className="text-xl">✓</span> : <span className="text-xl">📅</span>}
               {calendarAdded ? 'Added' : 'Add to Calendar'}
             </button>
             <button 
               onClick={onHome}
               className={buttonBaseClass}
             >
               <span className="text-xl">🏠</span> Go to Home
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default BookingConfirmed;