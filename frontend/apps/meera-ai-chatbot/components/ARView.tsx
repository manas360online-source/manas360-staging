
import React, { useState, useEffect } from 'react';
import { Sparkles, X, Wind, Waves, Trees, ArrowRight, Play, Circle, Brain, Zap, User, Eye, Ear, Fingerprint, Palette, Heart } from 'lucide-react';

interface ARViewProps {
  onClose: () => void;
}

type ExerciseType = 'breathing' | 'bodyscan' | 'grounding';

const EXERCISES = {
  breathing: {
    title: "Guided Breathing Exercise",
    subtitle: "4-7-8 technique · 5 minutes",
    icon: <Wind size={24} />,
    color: "bg-purple-600"
  },
  bodyscan: {
    title: "Full Body Relaxation",
    subtitle: "Tension release · 10 minutes",
    icon: <Brain size={24} />,
    color: "bg-blue-600"
  },
  grounding: {
    title: "5-4-3-2-1 Technique",
    subtitle: "Sensory awareness · 3 minutes",
    icon: <Zap size={24} />,
    color: "bg-emerald-600"
  }
};

const BODY_SCAN_STEPS = [
  "Focus on your toes...",
  "Relax your feet and ankles...",
  "Feel the weight of your legs...",
  "Softening your stomach area...",
  "Let your shoulders drop...",
  "Relaxing your jaw and face...",
  "Feeling completely supported."
];

const GROUNDING_STEPS = [
  { label: "5 Things you can see", icon: <Eye size={20} /> },
  { label: "4 Things you can touch", icon: <Fingerprint size={20} /> },
  { label: "3 Things you can hear", icon: <Ear size={20} /> },
  { label: "2 Things you can smell", icon: <Palette size={20} /> },
  { label: "1 Thing you can taste", icon: <Heart size={20} /> }
];

const ARView: React.FC<ARViewProps> = ({ onClose }) => {
  const [activeExercise, setActiveExercise] = useState<ExerciseType>('breathing');
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // Breathing Logic
  const [breatheStatus, setBreatheStatus] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  
  // Generic Timing
  const [timer, setTimer] = useState(0);
  
  // Modality specific state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (!isSessionActive) {
      setTimer(0);
      setCurrentStepIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
      
      if (activeExercise === 'breathing') {
        // 4-7-8 loop logic
        const cycleTime = timer % 19;
        if (cycleTime < 4) setBreatheStatus('Inhale');
        else if (cycleTime < 11) setBreatheStatus('Hold');
        else setBreatheStatus('Exhale');
      }

      if (activeExercise === 'bodyscan') {
        // Change step every 8 seconds
        if (timer > 0 && timer % 8 === 0) {
          setCurrentStepIdx(prev => (prev + 1) % BODY_SCAN_STEPS.length);
        }
      }

      if (activeExercise === 'grounding') {
        // Change step every 15 seconds
        if (timer > 0 && timer % 15 === 0) {
          setCurrentStepIdx(prev => (prev + 1) % GROUNDING_STEPS.length);
        }
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, timer, activeExercise]);

  const renderActiveSession = () => {
    switch (activeExercise) {
      case 'breathing':
        return (
          <div className="relative flex flex-col items-center">
            <div className={`w-64 h-64 rounded-full border-2 border-purple-100 flex items-center justify-center transition-all duration-[4000ms] ${breatheStatus === 'Inhale' ? 'scale-125' : breatheStatus === 'Exhale' ? 'scale-90' : 'scale-110'}`}>
              <div className={`w-48 h-48 bg-purple-600/10 backdrop-blur-lg rounded-full flex flex-col items-center justify-center shadow-inner border border-purple-200/50 transition-all duration-[4000ms] ${breatheStatus === 'Inhale' ? 'scale-110 opacity-100' : 'scale-95 opacity-80'}`}>
                 <p className="text-purple-600 font-black text-xl uppercase tracking-widest animate-pulse">{breatheStatus}</p>
                 <p className="text-[10px] text-purple-400 font-bold mt-1 uppercase">Breathe with me</p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping" />
          </div>
        );
      
      case 'bodyscan':
        return (
          <div className="relative flex flex-col items-center gap-12 max-w-lg">
            <div className="w-64 h-80 relative bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-xl overflow-hidden">
               {/* Vertical Scanning Line */}
               <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan-vertical" />
               
               <div className="flex items-center justify-center h-full opacity-20">
                  <Brain size={120} className="text-blue-500" />
               </div>
            </div>
            
            <div className="h-20 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
               <p className="text-2xl font-black text-slate-800 tracking-tight">{BODY_SCAN_STEPS[currentStepIdx]}</p>
               <p className="text-[10px] text-blue-400 font-black uppercase mt-2 tracking-widest">Focusing Attention</p>
            </div>
          </div>
        );

      case 'grounding':
        const step = GROUNDING_STEPS[currentStepIdx];
        return (
          <div className="relative flex flex-col items-center gap-12 max-w-lg">
             <div className="grid grid-cols-5 gap-3">
                {GROUNDING_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= currentStepIdx ? 'bg-emerald-500' : 'bg-slate-200'}`} 
                  />
                ))}
             </div>

             <div className="w-64 h-64 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-2xl flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                   {step.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 text-center leading-tight">{step.label}</h4>
             </div>

             <div className="text-center max-w-xs">
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   Quietly identify and acknowledge these items in your immediate physical environment.
                </p>
             </div>
          </div>
        );
    }
  };

  if (isSessionActive) {
    return (
      <div className="flex-1 bg-[#f0f9ff] relative overflow-hidden flex flex-col items-center justify-center">
        <style>{`
          @keyframes scan-vertical {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
          .animate-scan-vertical {
            animation: scan-vertical 4s ease-in-out infinite;
          }
        `}</style>

        {/* Immersive Light Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-60" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <button 
          onClick={() => setIsSessionActive(false)}
          className="absolute top-8 right-8 p-3 bg-white/80 backdrop-blur-md text-slate-400 hover:text-slate-900 rounded-full border border-white/50 shadow-sm z-50 transition-all active:scale-95"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 text-center animate-in zoom-in-95 duration-1000">
           <div className="mb-12">
             <div className="w-20 h-20 bg-white/80 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/50 shadow-2xl">
                <span className="text-4xl">🧘‍♀️</span>
             </div>
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">AR Guide Live</h2>
             <h3 className="text-3xl font-black text-slate-800 tracking-tight">{EXERCISES[activeExercise].title}</h3>
           </div>

           {/* Modality Specific Session UI */}
           <div className="min-h-[300px] flex items-center justify-center">
              {renderActiveSession()}
           </div>

           <div className="mt-16">
              <p className="text-slate-400 font-mono font-bold tracking-tighter text-lg">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Session Duration</p>
           </div>
        </div>

        <div className="absolute bottom-12 flex gap-4 animate-in slide-in-from-bottom-5 duration-700">
           <div className="bg-white/80 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/50 shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AR Tracking Calibrated</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f0f9ff] flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Dr. Maya — AR Guide</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Immersive Wellness</p>
           </div>
           <button 
             onClick={onClose}
             className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Avatar Display */}
        <div className="p-10 flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden">
           {/* Decorative floating elements */}
           <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-20 animate-pulse" />
           <div className="absolute bottom-10 right-10 w-6 h-6 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
           
           <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl border border-blue-100/50 flex items-center justify-center mb-6 relative group cursor-pointer hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-purple-500/5 rounded-[2.5rem] group-hover:bg-purple-500/10 transition-colors" />
              <span className="text-6xl animate-bounce" style={{ animationDuration: '4s' }}>🧘‍♀️</span>
           </div>
           <p className="text-xs font-bold text-purple-600/70 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Dr. Maya · AR Avatar
           </p>
        </div>

        {/* Exercise Card (LIGHT THEME) */}
        <div className="px-8 py-6">
           <div className="bg-slate-50 text-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-blue-600/5 opacity-0 group-hover:opacity-10 transition-all rotate-12">
                 <Sparkles size={120} />
              </div>
              
              <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-1 tracking-tight text-slate-800">{EXERCISES[activeExercise].title}</h3>
                 <p className="text-slate-500 text-xs font-medium mb-6">{EXERCISES[activeExercise].subtitle}</p>
                 <span className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-purple-100">
                    AR Mode
                 </span>
              </div>
           </div>
        </div>

        {/* Categories Navigation */}
        <div className="px-8 pb-10">
           <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-8">
              {(['breathing', 'bodyscan', 'grounding'] as ExerciseType[]).map((type) => (
                <button 
                  key={type}
                  onClick={() => {
                    setActiveExercise(type);
                    setTimer(0);
                    setCurrentStepIdx(0);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeExercise === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {type === 'breathing' ? 'Breathing' : type === 'bodyscan' ? 'Body Scan' : 'Grounding'}
                </button>
              ))}
           </div>

           <button 
             onClick={() => setIsSessionActive(true)}
             className="w-full bg-[#9333ea] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-purple-200 hover:bg-[#7e22ce] active:scale-95 transition-all"
           >
             Start AR Session <ArrowRight size={18} />
           </button>
        </div>

      </div>
      
      <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Calibrate device for spatial tracking</p>
    </div>
  );
};

export default ARView;
