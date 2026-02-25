
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
    if (file && file.type === "text/csv") {
      setIsAnalyzing(true);
      setProgress(0);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').slice(1);
        const parsed = rows.filter(r => r.trim()).map(r => r.split(',')[0].replace(/"/g, ''));
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
    <div className="w-full max-w-6xl flex flex-col gap-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-6xl font-black text-[#1e3a8a] tracking-tighter">Academic Enrollment</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="brand-card p-12 space-y-10">
          <h3 className="text-2xl font-black text-[#1e3a8a]">Institution Profile</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Institution Identity</label>
              <input type="text" className="brand-input" defaultValue="St. Xavier's International" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Coordinator Email</label>
              <input type="email" className="brand-input" defaultValue="counseling@xavier.edu" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Class Range</label>
                <select className="brand-input"><option>Primary (1-5)</option><option>High School (9-12)</option></select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Region</label>
                <input type="text" className="brand-input" defaultValue="South India" />
              </div>
            </div>
          </div>
        </div>

        <div className="brand-card p-12 bg-white flex flex-col justify-between">
           <div className="space-y-8">
              <h3 className="text-2xl font-black text-[#1e3a8a]">Parental Consent Protocol</h3>
              <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-6">
                 <span className="text-4xl">📝</span>
                 <p className="text-sm font-bold text-[#1e3a8a] uppercase leading-relaxed tracking-widest">
                   System will automatically distribute consent matrices to registered guardians. Student participation is locked until verified.
                 </p>
              </div>
           </div>
           <button onClick={() => setStep(2)} className="btn-brand w-full mt-12">Initialize Student Roster →</button>
        </div>
      </div>
    </div>
  );

  const Page2Sync = () => (
    <div className="w-full max-w-4xl flex flex-col gap-12 animate-in slide-in-from-right-8 duration-700">
      <header className="text-center">
        <h2 className="text-6xl font-black text-[#1e3a8a] tracking-tighter">Student Roster</h2>
      </header>

      {isAnalyzing ? (
        <div className="brand-card p-24 flex flex-col items-center text-center gap-12">
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full analysis-shimmer" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="space-y-4">
             <h3 className="text-4xl font-black text-[#1e3a8a]">Analyzing Student Roster</h3>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Parsing student demographics and guardian contacts...</p>
          </div>
        </div>
      ) : (
        <div 
          className="brand-card p-24 border-4 border-dashed border-blue-100 hover:border-[#1d7dfa] transition-all cursor-pointer group flex flex-col items-center text-center gap-10"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileUpload} className="hidden" />
          <div className="w-40 h-40 bg-blue-50 rounded-[3rem] flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">📁</div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-[#1e3a8a]">Upload Student CSV</h3>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Browse Local Drive for Academic Records</p>
          </div>
        </div>
      )}
    </div>
  );

  const Page3Dashboard = () => (
    <div className="w-full max-w-6xl flex flex-col gap-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-6xl font-black text-[#1e3a8a] tracking-tighter">Academic Console</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <div className="grid grid-cols-3 gap-8">
              <Stat label="Provisioned" value={students.length.toString()} />
              <Stat label="Consent Rate" value="0%" />
              <Stat label="Status" value="Ready" />
           </div>
           <div className="brand-card p-12 space-y-6">
              <h3 className="text-2xl font-black text-[#1e3a8a]">Student Roster Extract</h3>
              <div className="flex flex-wrap gap-3">
                 {students.slice(0, 20).map((name, i) => (
                   <span key={i} className="px-5 py-2 bg-blue-50 text-[#1d7dfa] text-[10px] font-black uppercase tracking-widest rounded-full">{name}</span>
                 ))}
                 {students.length > 20 && <span className="px-5 py-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">+{students.length - 20} more</span>}
              </div>
           </div>
        </div>

        <div className="brand-card p-12 bg-[#1d7dfa] text-white flex flex-col justify-between">
           <div className="space-y-8">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl">🎓</div>
              <h3 className="text-4xl font-black tracking-tighter">Deployment Ready</h3>
              <p className="text-white/80 font-bold text-sm uppercase tracking-widest leading-relaxed">Counseling infrastructure is provisioned. Consent flows initialized. Academic portal is active.</p>
           </div>
           <button onClick={onComplete} className="w-full py-6 bg-white text-[#1d7dfa] rounded-full font-black text-xs uppercase tracking-widest shadow-2xl mt-12 hover:scale-105 transition-transform">Complete Setup</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-16">
      {step === 1 && <Page1Enrollment />}
      {step === 2 && <Page2Sync />}
      {step === 3 && <Page3Dashboard />}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="brand-card p-10 text-center">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl font-black text-[#1e3a8a] tracking-tighter">{value}</p>
  </div>
);

export default SchoolFlow;
