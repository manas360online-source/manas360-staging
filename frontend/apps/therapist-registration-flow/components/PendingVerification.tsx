
import React, { useEffect, useState } from 'react';
import { CheckCircle, Search, Hourglass, ArrowLeft } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const PendingVerification: React.FC<Props> = ({ onComplete, onBack }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 100 ? p + 2 : 100));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-8 items-center text-center">
      <div className="w-full flex justify-between items-start">
        <button onClick={onBack} className="bg-[#EDF5FF] p-1.5 rounded-full hover:bg-[#D0E4FF] transition-colors">
          <ArrowLeft size={16} className="text-[#1D75FF]" />
        </button>
        <div className="bg-[#EDF5FF] text-[#1D75FF] px-3 py-1 rounded-full text-[10px] font-bold">Story 2.1</div>
      </div>

      <header>
        <h1 className="text-3xl font-black text-[#1D3A63] leading-tight">Verification in Progress</h1>
      </header>

      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-[#EDF5FF] flex items-center justify-center border-4 border-white shadow-inner relative overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 w-full bg-[#1D75FF]/20 transition-all duration-300" 
            style={{ height: `${progress}%` }}
          />
          <Hourglass size={40} className="text-[#1D75FF] animate-pulse relative z-10" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Under Review</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Our team is currently verifying your clinical credentials.
        </p>
      </div>

      <div className="w-full bg-[#EDF5FF]/50 rounded-[2rem] p-6 border border-[#D0E4FF]/30 flex flex-col gap-3">
        {['Degree Certificate', 'RCI/NMC ID', 'Profile Image'].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full shadow-sm">
              <CheckCircle size={14} className="text-[#1D75FF]" />
            </div>
            <span className="text-sm font-semibold text-slate-700">{item}:</span>
            <span className="text-[10px] text-slate-400 ml-auto font-black uppercase tracking-wider">RECEIVED</span>
          </div>
        ))}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#D0E4FF]/30">
          <Search size={14} className="text-amber-500" />
          <span className="text-sm font-bold text-[#1D3A63]">Review Status:</span>
          <span className="text-[10px] text-[#1D75FF] ml-auto font-black animate-pulse uppercase tracking-widest">Processing...</span>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-[#1D75FF] hover:bg-[#1D75FF]/90 text-white font-black py-5 rounded-full shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
      >
        Simulate Approval
      </button>
      
      <p className="text-[10px] font-bold text-slate-400">
        Notifications will be sent via SMS and Email.
      </p>
    </div>
  );
};

export default PendingVerification;
