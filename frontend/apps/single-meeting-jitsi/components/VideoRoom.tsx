
import React, { useEffect, useRef, useState } from 'react';
import { Session, User, ChatMessage, UserRole, VRAccessTier } from '../types';
import { ICONS, generateAnonymousName } from '../constants';

interface VideoRoomProps {
  session: Session;
  currentUser: User;
  onLeave: () => void;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ session, currentUser, onLeave }) => {
  const [micOn, setMicOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isGoggleMode, setIsGoggleMode] = useState(session.vrTier === VRAccessTier.MOBILE_VR);

  const manas360ContainerRef = useRef<HTMLDivElement>(null);
  const manas360ApiRef = useRef<any>(null);

  const ambiance = (() => {
    const env = session.vrEnvironment;
    if (!env) return { sound: '', video: '', label: 'Standard' };
    
    // Consistent mapping of HD environment assets
    const mapping: Record<string, {sound: string, video: string, label: string}> = {
      'therapy_forest': { 
          sound: 'https://www.soundjay.com/nature/sounds/forest-birds-chirping-01.mp3',
          video: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
          label: 'Grounding / Nature'
      },
      'office_meeting': { 
          sound: 'https://www.soundjay.com/misc/sounds/typing-on-keyboard-01.mp3',
          video: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-office-building-empty-at-night-42415-large.mp4',
          label: 'Exposure / Social'
      },
      'public_stage': { 
          sound: 'https://www.soundjay.com/ambient/sounds/theatre-ambience-1.mp3',
          video: 'https://assets.mixkit.co/videos/preview/mixkit-view-of-a-theater-from-the-stage-41916-large.mp4',
          label: 'Exposure / Speaking'
      }
    };
    return mapping[env.id] || { sound: '', video: '', label: env.therapy_type };
  })();

  useEffect(() => {
    if (session.isVR || !window.JitsiMeetExternalAPI || !manas360ContainerRef.current) return;
    
    // Standard Call Setup
    const domain = 'meet.jit.si';
    const roomName = `manas360-${session.id}`;
    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: manas360ContainerRef.current,
      userInfo: { displayName: currentUser.name }
    };
    manas360ApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    return () => manas360ApiRef.current?.dispose();
  }, [session, currentUser]);

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (session.isVR) {
    const Viewport = ({ isRightEye = false }) => (
      <div className={`relative flex-1 h-full overflow-hidden ${isGoggleMode ? 'border-x border-white/5' : ''}`}>
          {/* Main Content */}
          <img 
              src={session.vrEnvironment?.thumbnail} 
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-[0.5px] animate-[gentleZoom_40s_infinite_alternate]" 
              alt="Backdrop"
          />
          {ambiance.video && (
              <video 
                  src={ambiance.video} 
                  autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen scale-110"
              />
          )}

          {/* Eye Lens Distortion Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.85)_100%)]"></div>
          
          {/* HUD Content (Rendered per eye in SBS) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-px h-16 bg-white/20 mb-8"></div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter opacity-80 drop-shadow-2xl">{session.vrEnvironment?.name}</h3>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mt-4">{isGoggleMode ? (isRightEye ? 'R-Eye' : 'L-Eye') : '360 Immersive'}</p>
          </div>

          {/* Ambient Grid for depth sensation */}
          <div className="absolute inset-0 border border-white/5 opacity-10" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      </div>
    );

    return (
        <div className="fixed inset-0 bg-black flex flex-col font-sans overflow-hidden">
            {/* Stereoscopic or Monoscopic Viewport */}
            <div className="flex-1 flex overflow-hidden">
                <Viewport />
                {isGoggleMode && <Viewport isRightEye={true} />}
            </div>

            {/* VR Navigation / Control Bar (Floating) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-10 py-4 bg-black/60 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
                <div className="flex flex-col items-start pr-6 border-r border-white/10">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Time in Sim</span>
                    <span className="text-white font-mono font-bold text-sm tracking-widest">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsGoggleMode(!isGoggleMode)}
                        className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isGoggleMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    >
                        {isGoggleMode ? '👓 Goggle View: ON' : '📱 Window Mode'}
                    </button>
                    <div className="w-px h-6 bg-white/10"></div>
                    <button 
                        onClick={onLeave}
                        className="px-6 py-2 bg-red-600/80 text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-red-600 transition-all"
                    >
                        Exit Simulation
                    </button>
                </div>
            </div>

            {/* Orientation Warning (Desktop Demo) */}
            {!isGoggleMode && (
                <div className="absolute top-10 right-10 text-right z-30 pointer-events-none opacity-40">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Gyroscope: Manual Override</p>
                    <p className="text-[8px] text-white/50 uppercase mt-1">Cursor tracking enabled</p>
                </div>
            )}

            <style>{`
                @keyframes gentleZoom {
                    from { transform: scale(1.1); }
                    to { transform: scale(1.25); }
                }
            `}</style>
        </div>
    );
  }

  // Standard Video Call View
  return (
    <div className="fixed inset-0 bg-[#0a0c10] flex flex-col font-sans overflow-hidden">
      <div className="h-16 bg-white/5 border-b border-white/10 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4 text-white">
          <h2 className="text-xs font-black uppercase tracking-widest">{session.patientName}</h2>
          <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Secured Audio/Video</span>
          </div>
        </div>
        <button onClick={onLeave} className="text-[10px] font-black text-white/60 uppercase tracking-widest hover:text-white transition-all">End Call</button>
      </div>
      <div ref={manas360ContainerRef} className="flex-1"></div>
    </div>
  );
};

export default VideoRoom;
