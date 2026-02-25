
import React, { useState, useEffect } from 'react';
import { Session, User, VRAccessTier, DeviceCapabilities } from '../types';
import { ICONS, VR_MODULES } from '../constants';

interface VRSessionLauncherProps {
  session: Session;
  currentUser: User;
  onLaunch: (tier: VRAccessTier) => void;
  onBack: () => void;
}

const VRSessionLauncher: React.FC<VRSessionLauncherProps> = ({ session, currentUser, onLaunch, onBack }) => {
  const [deviceTier, setDeviceTier] = useState<VRAccessTier>(VRAccessTier.BROWSER_3D);
  const [loading, setLoading] = useState(false);
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasWebXR: false,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    isHeadset: false
  });

  useEffect(() => {
    // CONDITIONAL HARDWARE DETECTION (Academically Valid WebXR Check)
    const checkXR = async () => {
      setLoading(true);
      if ('xr' in navigator) {
        try {
          const supported = await (navigator as any).xr.isSessionSupported('immersive-vr');
          setCapabilities(prev => ({ ...prev, hasWebXR: supported, isHeadset: supported }));
          if (supported) setDeviceTier(VRAccessTier.IMMERSIVE_VR);
        } catch (e) {
          console.log("WebXR check failed, falling back to 3D mode.");
        }
      }
      setTimeout(() => setLoading(false), 1200);
    };

    checkXR();
  }, []);

  const deviceOptions = [
    { 
      id: VRAccessTier.BROWSER_3D, 
      label: 'Interactive 3D', 
      note: 'Standard Display', 
      icon: '💻', 
      details: 'No headset required. Interactive 360 environments via browser.' 
    },
    { 
      id: VRAccessTier.MOBILE_VR, 
      label: 'Cardboard / Mobile', 
      note: 'Entry VR Tier', 
      icon: '📱', 
      details: 'Stereoscopic split-screen for phone-based VR goggles.' 
    },
    { 
      id: VRAccessTier.IMMERSIVE_VR, 
      label: 'Full Immersion', 
      note: 'High-End VR (WebXR)', 
      icon: '🥽', 
      details: 'Direct link to Meta Quest / Pico devices for total immersion.',
      badge: capabilities.hasWebXR ? 'Hardware Detected' : 'Manual Select'
    }
  ];

  const plannedModules = VR_MODULES.filter(m => session.modules_planned?.includes(m.id));

  return (
    <div className="min-h-screen bg-[#05060a] text-white p-6 md:p-10 font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* VR HUD Status Bar */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">System Ready / VR-Sync Active</span>
           </div>
           <div className="flex gap-4">
              <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${capabilities.hasWebXR ? 'border-emerald-500 text-emerald-500' : 'border-white/10 text-white/20'}`}>WebXR</div>
              <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${capabilities.isMobile ? 'border-blue-500 text-blue-500' : 'border-white/10 text-white/20'}`}>Mobile Gyro</div>
           </div>
        </div>

        {/* Content Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">
            Calibrate <span className="text-purple-500">Immersive</span> Path
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
            Target: {session.vrEnvironment?.name} / Grounding Protocol Active
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Device Selection */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Hardware Selection</h3>
                {deviceOptions.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => setDeviceTier(opt.id)}
                      className={`group p-6 rounded-[32px] border-2 transition-all cursor-pointer flex gap-6 relative overflow-hidden ${deviceTier === opt.id ? 'bg-purple-600 border-purple-400 shadow-[0_20px_60px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100 hover:bg-white/10'}`}
                    >
                        <div className="text-4xl bg-black/20 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                          {opt.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-black uppercase tracking-tighter">{opt.label}</p>
                                {opt.badge && (
                                    <span className="text-[7px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest">{opt.badge}</span>
                                )}
                            </div>
                            <p className="text-[9px] font-black text-purple-200 uppercase tracking-widest mb-2 opacity-60">{opt.note}</p>
                            <p className="text-[10px] text-white/50 leading-snug group-hover:text-white/80 transition-colors">{opt.details}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Column: Environment Preview */}
            <div className="space-y-8">
                <div className="bg-[#1e293b]/30 rounded-[48px] p-2 border border-white/10 overflow-hidden relative group">
                    <img 
                      src={session.vrEnvironment?.thumbnail} 
                      alt="VR Preview" 
                      className="w-full aspect-square object-cover rounded-[40px] group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-center">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] mb-2 block">Environment Active</span>
                        <h4 className="text-2xl font-black uppercase tracking-tight">{session.vrEnvironment?.name}</h4>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-[32px] p-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Planned Modules</h3>
                    <div className="flex flex-wrap gap-2">
                        {plannedModules.map(mod => (
                            <div key={mod.id} className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                                <span className="text-sm">{mod.icon}</span>
                                <span className="text-[9px] font-black uppercase">{mod.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="mt-16 flex flex-col items-center gap-6">
            <button 
                onClick={() => onLaunch(deviceTier)}
                className="w-full max-w-md bg-white text-black py-6 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4"
            >
                {loading ? 'Initializing XR Core...' : 'Enter Simulation Room'}
            </button>
            <button 
                onClick={onBack}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all underline underline-offset-8"
            >
                Cancel / Return to Portal
            </button>
        </div>

      </div>
    </div>
  );
};

export default VRSessionLauncher;
