
import React, { useState, useRef } from 'react';

interface CorporateOnboardingProps {
  onComplete: (users: string[]) => void;
}

const CorporateOnboarding: React.FC<CorporateOnboardingProps> = ({ onComplete }) => {
  const [selectedTier, setSelectedTier] = useState<'Foundation' | 'Performance' | 'Enterprise'>('Performance');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [roster, setRoster] = useState<string[]>([]);
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
        const parsed = rows.filter(r => r.trim()).map(r => {
          const cols = r.split(',');
          return cols[0].replace(/"/g, '').trim();
        }).filter(name => name.length > 0);
        setRoster(parsed);
      };
      reader.readAsText(file);

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 40);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-20 px-6 bg-[#f8fafc] relative">
      {/* Floating Back Button */}
      <button 
        onClick={handleGoBack}
        className="fixed top-12 left-12 flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-xl hover:bg-white text-slate-400 hover:text-slate-700 rounded-full transition-all font-bold text-[10px] uppercase tracking-[0.2em] border border-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] group z-50"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Hub
      </button>

      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-20">
          <h1 className="text-7xl font-light text-[#0f172a] tracking-tight mb-4">
            Corporate <span className="font-bold">Registration</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Initialize your organization's wellness infrastructure</p>
        </div>

        <div className="bg-white/80 backdrop-blur-3xl rounded-[4rem] p-16 md:p-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-white">
          {/* Step 1: Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
            <section className="space-y-12">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Organization Profile</h2>
              <div className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#1d7dfa]">Entity Identity</label>
                  <input type="text" className="w-full bg-slate-50/50 border-b border-transparent focus:border-[#1d7dfa] p-4 text-lg font-semibold text-slate-700 outline-none transition-all rounded-xl" defaultValue="Global Tech Solutions Inc." />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#1d7dfa]">System Administrator</label>
                  <input type="email" className="w-full bg-slate-50/50 border-b border-transparent focus:border-[#1d7dfa] p-4 text-lg font-semibold text-slate-700 outline-none transition-all rounded-xl" defaultValue="admin@globaltech.com" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Headcount</label>
                    <div className="bg-slate-50/50 p-4 rounded-xl text-slate-600 font-semibold cursor-default">1k - 5k</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vertical</label>
                    <div className="bg-slate-50/50 p-4 rounded-xl text-slate-600 font-semibold cursor-default">Technology</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Program Tier</h2>
              <div className="space-y-4">
                <TierButton 
                  label="Foundation" 
                  sub="Essential Metrics" 
                  active={selectedTier === 'Foundation'} 
                  onClick={() => setSelectedTier('Foundation')} 
                />
                <TierButton 
                  label="Performance" 
                  sub="Advanced ROI & Therapy" 
                  active={selectedTier === 'Performance'} 
                  onClick={() => setSelectedTier('Performance')} 
                />
                <TierButton 
                  label="Enterprise" 
                  sub="Full Infrastructure Sync" 
                  active={selectedTier === 'Enterprise'} 
                  onClick={() => setSelectedTier('Enterprise')} 
                />
              </div>
            </section>
          </div>

          {/* Step 2: Sync */}
          <div className="pt-24 border-t border-slate-50">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-10 text-center">Workforce Integration</h2>
            
            <div 
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`relative group h-64 rounded-[3rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                progress === 100 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : isAnalyzing 
                  ? 'border-blue-100 bg-slate-50/30' 
                  : 'border-slate-100 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileUpload} className="hidden" />
              
              {isAnalyzing ? (
                <div className="w-full max-w-sm text-center px-12">
                  <div className="text-3xl mb-6">{progress === 100 ? '✅' : '⚙️'}</div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{progress < 100 ? 'Syncing...' : 'Complete'}</span>
                    <span className="text-xs font-black text-blue-500">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="text-center group-hover:scale-105 transition-transform duration-500">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-3xl mx-auto mb-6">📁</div>
                  <h3 className="text-lg font-bold text-slate-700">Drop Employee Roster</h3>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">Required: .CSV Format Only</p>
                </div>
              )}
            </div>

            {progress === 100 && (
              <div className="mt-16 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
                <button 
                  onClick={() => onComplete(roster)}
                  className="group relative flex items-center gap-6 px-16 py-6 bg-[#1d7dfa] text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-600 hover:-translate-y-1 active:translate-y-0 transition-all"
                >
                  Launch Admin Console
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TierButton: React.FC<{ label: string; sub: string; active: boolean; onClick: () => void }> = ({ label, sub, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
      active 
        ? 'border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/20' 
        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
    }`}
  >
    <div className="text-left">
      <span className={`text-base font-bold tracking-tight block ${active ? 'text-white' : 'text-slate-700'}`}>{label}</span>
      <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 block opacity-60 ${active ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</span>
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'border-white bg-white text-blue-500' : 'border-slate-200 bg-white'}`}>
      {active && <span className="text-[10px]">✓</span>}
    </div>
  </button>
);

export default CorporateOnboarding;
