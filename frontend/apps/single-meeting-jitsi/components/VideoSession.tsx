import React, { useEffect, useRef, useState } from 'react';
import { SessionInfo } from '../types';
import { ICONS } from '../constants';

interface Props {
  session: SessionInfo;
  onEnd: () => void;
}

const VideoSession: React.FC<Props> = ({ session, onEnd }) => {
  const [timer, setTimer] = useState(1425); 
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    
    if (window.JitsiMeetExternalAPI && containerRef.current) {
      new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: `manas360-therapy-desktop-${Date.now()}`,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'chat', 'tileview', 'settings'
          ],
          VIDEO_LAYOUT_FIT: 'both',
        },
        configOverwrite: {
          startWithAudioMuted: false,
          disableDeepLinking: true,
        }
      });
    }

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.5s_ease-out]">
      <header className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">M</div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">Live Session</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.therapistName}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-full">
               Active HD Stream
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        {/* Main Video Frame */}
        <div className="lg:col-span-9 bg-white rounded-[40px] overflow-hidden shadow-2xl border-4 border-white relative">
          <div ref={containerRef} className="w-full h-full bg-white"></div>
          <div className="absolute top-6 left-6 pointer-events-none">
             <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold text-slate-800 shadow-lg">
                <span className="text-lg">👩‍⚕️</span>
                Dr. Ananya Sharma
             </div>
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex-1">
             <div className="text-center mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration Remaining</p>
                <div className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                   {formatTimer(Math.max(0, 45*60 - timer))}
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (timer / (45*60)) * 100)}%` }}></div>
                </div>
             </div>

             <div className="space-y-4 mb-10">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Clinical Tools</h4>
                <button className="w-full bg-slate-50 hover:bg-blue-50 text-slate-700 py-4 px-6 rounded-2xl text-left font-bold text-sm transition-all border border-slate-100 flex items-center justify-between group">
                   Whiteboard
                   <span className="opacity-0 group-hover:opacity-100">→</span>
                </button>
                <button className="w-full bg-slate-50 hover:bg-blue-50 text-slate-700 py-4 px-6 rounded-2xl text-left font-bold text-sm transition-all border border-slate-100 flex items-center justify-between group">
                   Shared Notes
                   <span className="opacity-0 group-hover:opacity-100">→</span>
                </button>
             </div>

             <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mb-4">
                   <span className="text-amber-500">🔒</span>
                   GDPR & HIPAA Compliant Session
                </div>
             </div>
          </div>

          <button 
            onClick={onEnd}
            className="bg-red-500 hover:bg-red-600 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="text-xl">🛑</span> End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSession;