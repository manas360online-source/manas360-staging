import React, { useState, useRef } from 'react';

interface CorporateOnboardingProps {
  onComplete: (users: string[]) => void;
  onBack?: () => void;
}

const CorporateOnboarding: React.FC<CorporateOnboardingProps> = ({ onComplete, onBack }) => {
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
      }, 30);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-6 bg-slate-50 relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-full font-bold text-[10px] uppercase tracking-widest hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm z-50 cursor-pointer"
        >
          ← Back
        </button>
      )}
      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#1d7dfa] tracking-tight">
            Corporate Registration
          </h1>
          <p className="text-slate-400 font-medium tracking-wider uppercase text-[11px] mt-2">Provision Organizational Infrastructure</p>
        </div>

        <div className="brand-card p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <section className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Profile Setup</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Organization Name</label>
                  <input type="text" className="brand-input" placeholder="e.g. Global Tech Solutions Inc." />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
                  <input type="email" className="brand-input" placeholder="e.g. admin@globaltech.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Size</label>
                    <div className="bg-slate-50 h-11 flex items-center justify-center border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium">1k - 5k</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Vertical</label>
                    <div className="bg-slate-50 h-11 flex items-center justify-center border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium">Tech</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Program Tier</h2>
              <div className="space-y-2.5">
                <TierButton label="Foundation" sub="Core Metrics" active={selectedTier === 'Foundation'} onClick={() => setSelectedTier('Foundation')} />
                <TierButton label="Performance" sub="Advanced ROI" active={selectedTier === 'Performance'} onClick={() => setSelectedTier('Performance')} />
                <TierButton label="Enterprise" sub="Full Custom" active={selectedTier === 'Enterprise'} onClick={() => setSelectedTier('Enterprise')} />
              </div>
            </section>
          </div>

          <div className="pt-8 border-t border-slate-100 text-center">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-6">Employee Sync</h2>

            <div
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`h-32 rounded-xl border border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${progress === 100
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileUpload} className="hidden" />

              {isAnalyzing ? (
                <div className="w-full max-w-xs px-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{progress < 100 ? 'Syncing...' : 'Ready'}</span>
                    <span className="text-xs font-semibold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="px-4">
                  <h3 className="text-sm font-semibold text-slate-600">Import Employee Roster (.CSV)</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">Click to browse files</p>
                </div>
              )}
            </div>

            {progress === 100 && (
              <div className="mt-8">
                <button
                  onClick={() => onComplete(roster)}
                  className="btn-brand h-12 px-16 text-xs font-semibold uppercase tracking-widest"
                >
                  Enter Console →
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
    className={`w-full h-14 px-4 rounded-xl border transition-all flex items-center justify-between ${active
        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
        : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
  >
    <div className="text-left">
      <span className="text-sm font-semibold block leading-none mb-1">{label}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">{sub}</span>
    </div>
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
      {active && <span className="text-[10px]">✓</span>}
    </div>
  </button>
);

export default CorporateOnboarding;