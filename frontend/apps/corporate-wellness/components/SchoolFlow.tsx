import React, { useState, useRef } from 'react';

interface SchoolFlowProps {
  onComplete: () => void;
}

const SchoolFlow: React.FC<SchoolFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [students, setStudents] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
      setIsAnalyzing(true);
      setProgress(0);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').slice(1);
        const parsed = rows.filter(r => r.trim()).map(r => r.split(',')[0].replace(/"/g, '').trim());
        setStudents(parsed);
      };
      reader.readAsText(file);

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsAnalyzing(false);
              setStep(3);
            }, 800);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }
  };

  const Page1Enrollment = () => (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-[#1d7dfa] tracking-tight">Academic Registration</h2>
        <p className="text-slate-400 font-medium tracking-wider uppercase text-[11px] mt-2">Provision Institutional Infrastructure</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="brand-card p-10 space-y-8">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Institution Profile</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Institution Identity</label>
              <input type="text" className="brand-input" placeholder="e.g. St. Xavier's International" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Coordinator Email</label>
              <input type="email" className="brand-input" placeholder="e.g. counseling@xavier.edu" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Class Range</label>
                <div className="bg-slate-50 h-11 flex items-center justify-center border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">High School</div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Region</label>
                <input type="text" className="brand-input" placeholder="e.g. South India" />
              </div>
            </div>
          </div>
        </div>

        <div className="brand-card p-10 flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Consent Protocol</h3>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                 <span className="text-2xl opacity-60">📝</span>
                 <p className="text-[12px] font-medium text-blue-800 leading-relaxed tracking-wide">
                   System will automatically distribute consent matrices to registered guardians. Student participation is locked until verified.
                 </p>
              </div>
           </div>
           <button onClick={() => setStep(2)} className="btn-brand w-full mt-8 py-4 uppercase tracking-widest text-xs font-semibold">
             Initialize Student Roster →
           </button>
        </div>
      </div>
    </div>
  );

  const Page2Sync = () => (
    <div className="w-full max-w-2xl flex flex-col gap-8 animate-in slide-in-from-right-8 duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-[#1d7dfa] tracking-tight">Academic Registration</h2>
        <p className="text-slate-400 font-medium tracking-wider uppercase text-[11px] mt-2">Student Roster Synchronization</p>
      </header>

      {isAnalyzing ? (
        <div className="brand-card p-16 flex flex-col items-center text-center gap-8">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="space-y-2">
             <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Analyzing Roster</h3>
             <p className="text-slate-400 font-medium text-xs">Parsing demographics and contact records...</p>
          </div>
        </div>
      ) : (
        <div 
          className="brand-card p-16 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group flex flex-col items-center text-center gap-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileUpload} className="hidden" />
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-4xl opacity-60">📁</div>
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Upload Student CSV</h3>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">Browse academic records</p>
          </div>
        </div>
      )}
    </div>
  );

  const Page3Dashboard = () => (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-semibold text-[#1d7dfa] tracking-tight">Academic Registration</h2>
        <p className="text-slate-400 font-medium tracking-wider uppercase text-[11px] mt-2">Console Provisioned</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           <div className="grid grid-cols-3 gap-6">
              <Stat label="Provisioned" value={students.length.toString()} />
              <Stat label="Consent Rate" value="0%" />
              <Stat label="Status" value="Ready" />
           </div>
           <div className="brand-card p-8 space-y-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Roster Extract</h3>
              <div className="flex flex-wrap gap-2">
                 {students.slice(0, 15).map((name, i) => (
                   <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-semibold uppercase tracking-wider rounded border border-slate-100">{name}</span>
                 ))}
                 {students.length > 15 && <span className="px-3 py-1.5 text-slate-300 text-[10px] font-semibold uppercase tracking-wider">+{students.length - 15} more</span>}
              </div>
           </div>
        </div>

        <div className="brand-card p-10 bg-white flex flex-col justify-between border-blue-100">
           <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl opacity-60">🎓</div>
              <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Deployment Ready</h3>
              <p className="text-slate-500 font-medium text-xs leading-relaxed">Infrastructure provisioned. Consent flows initialized. Academic portal active.</p>
           </div>
           <button onClick={onComplete} className="btn-brand w-full mt-10 h-12 py-0 uppercase tracking-widest text-xs font-semibold">
             Complete Setup
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-slate-50">
      {step === 1 && <Page1Enrollment />}
      {step === 2 && <Page2Sync />}
      {step === 3 && <Page3Dashboard />}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="brand-card p-8 text-center bg-white">
    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-semibold text-slate-800 tracking-tight">{value}</p>
  </div>
);

export default SchoolFlow;