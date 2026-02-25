
import React, { useState, useRef } from 'react';

interface SchoolOnboardingProps {
  onComplete: (students: string[]) => void;
  onBack?: () => void;
}

const SchoolOnboarding: React.FC<SchoolOnboardingProps> = ({ onComplete, onBack }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [roster, setRoster] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for the text inputs
  const [schoolName, setSchoolName] = useState('');
  const [district, setDistrict] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isCsv = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
      if (!isCsv) {
        setError("Invalid file type. Please upload a .CSV file only.");
        return;
      }
      setError(null);
      setIsAnalyzing(true);
      setProgress(0);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const names = text.split('\n').slice(1).map(r => r.split(',')[0].trim()).filter(n => n.length > 0);
        setRoster(names);
      };
      reader.readAsText(file);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + 5;
        });
      }, 50);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log("Back button clicked: Logic disabled in this environment.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Fixed Back Button in the top corner */}
      <button
        onClick={handleBack}
        className="fixed top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-full transition-all hover:bg-slate-50 hover:text-blue-500 shadow-sm active:scale-95"
      >
        <span className="text-sm">←</span>
        Back
      </button>

      <div className="w-full max-w-3xl space-y-10 animate-in fade-in duration-700">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-light text-[#1d7dfa] tracking-tighter">School Registration</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Institutional Infrastructure Configuration</p>
        </div>

        <div className="brand-card p-10 md:p-12 shadow-2xl bg-white/90 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Identity</h2>
              <div className="space-y-4">
                <InputGroup
                  label="School Name"
                  placeholder="e.g. St. Xavier's International"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
                <InputGroup
                  label="District"
                  placeholder="e.g. Karnataka, Sector 4"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Records Sync</h2>
              <div
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${progress === 100 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                  } ${error ? 'border-red-200 bg-red-50' : ''}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".csv" />
                {isAnalyzing ? (
                  <div className="w-full px-8 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-3">{progress < 100 ? 'Syncing...' : 'Ready'}</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-3xl mb-2">{error ? '⚠️' : '📂'}</span>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{error || 'Import CSV'}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {progress === 100 && (
            <div className="mt-10 flex justify-center animate-in slide-in-from-top-2">
              <button
                onClick={() => onComplete(roster)}
                className="px-10 py-4 bg-[#1d7dfa] text-white rounded-full font-bold text-[13px] uppercase tracking-wide shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                Launch Academic Console →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[13px] text-slate-800 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
    />
  </div>
);

export default SchoolOnboarding;
