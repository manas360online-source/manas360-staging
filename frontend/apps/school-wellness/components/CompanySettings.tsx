
import React, { useState } from 'react';
import { User } from '../types';

const CompanySettings: React.FC<{ user: User }> = ({ user }) => {
  const [lmsProvider, setLmsProvider] = useState('classroom');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Institution Setup</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Academic Configuration & Wellness Infrastructure</p>
      </header>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl border border-emerald-100 font-bold text-sm animate-in slide-in-from-top-4">
          ✓ Institution configuration synchronized with campus servers.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Registration Details */}
        <section className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <span className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm">🏫</span> School Profile
          </h3>
          <div className="space-y-6">
            <InputField label="Institution Identity" defaultValue="St. Xavier's International School" />
            <InputField label="District / Board" defaultValue="CISCE Karnataka Division" />
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Student Capacity" defaultValue="2,500" />
              <InputField label="Grade Coverage" defaultValue="9 - 12 (High School)" />
            </div>
          </div>
        </section>

        {/* Student Privacy */}
        <section className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3 relative z-10">
            <span className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm">🛡️</span> Campus Privacy
          </h3>
          <div className="space-y-6 relative z-10">
            <Toggle label="Student Anonymity Shield" checked={true} description="Hide student identities from teacher-level analytics." />
            <Toggle label="Guardian Consent Guard" checked={true} description="Restrict participation until parent consent is verified." />
            <Toggle label="Compliance Logs" checked={true} description="Log all counseling interactions for audit trails." />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[80px] -mr-32 -mt-32 opacity-40"></div>
        </section>

        {/* SMS Integration */}
        <section className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm">🔗</span> Learning Management (LMS / SMS)
            </h3>
            <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl">
              <ProviderBtn active={lmsProvider === 'classroom'} onClick={() => setLmsProvider('classroom')} label="Classroom" />
              <ProviderBtn active={lmsProvider === 'canvas'} onClick={() => setLmsProvider('canvas')} label="Canvas" />
              <ProviderBtn active={lmsProvider === 'powerschool'} onClick={() => setLmsProvider('powerschool')} label="PowerSchool" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="SMS API Endpoint" placeholder="https://api.powerschool.xavier.edu" />
            <InputField label="Developer Token" placeholder="Paste institution access key" />
            <InputField label="Redirect URI" defaultValue="https://wellness.xavier.edu/auth/callback" readOnly />
            <InputField label="Institutional Client ID" defaultValue="XVR-ACAD-9921-X" readOnly />
          </div>

          <div className="mt-10 p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem]">
            <p className="text-[11px] font-bold text-[#1d7dfa] uppercase tracking-wide mb-4 px-2">Academic Data Mapping</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[11px] font-bold text-slate-500 p-2 uppercase tracking-tight">
              <div className="flex flex-col gap-1"><span>Student ID</span><span className="text-[#1d7dfa]">enrollmentNo</span></div>
              <div className="flex flex-col gap-1"><span>Grade Level</span><span className="text-[#1d7dfa]">currentGrade</span></div>
              <div className="flex flex-col gap-1"><span>Guardian Email</span><span className="text-[#1d7dfa]">parent_contact</span></div>
              <div className="flex flex-col gap-1"><span>Locker/House</span><span className="text-[#1d7dfa]">assignedHouse</span></div>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-4">
            <button className="px-10 py-5 bg-slate-50 text-slate-500 rounded-full font-bold text-[13px] uppercase tracking-wide hover:bg-slate-100 transition-all">Test Sync</button>
            <button onClick={handleSave} className="px-12 py-5 bg-[#1d7dfa] text-white rounded-full font-bold text-[13px] uppercase tracking-wide shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95">Save Institutional Config</button>
          </div>
        </section>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string; placeholder?: string; defaultValue?: string; readOnly?: boolean }> = ({ label, placeholder, defaultValue, readOnly }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2 px-2">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      defaultValue={defaultValue} 
      readOnly={readOnly}
      className={`w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`} 
    />
  </div>
);

const ProviderBtn: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${active ? 'bg-[#1d7dfa] text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
  >
    {label}
  </button>
);

const Toggle: React.FC<{ label: string; description: string; checked: boolean }> = ({ label, description, checked }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] transition-all hover:bg-white hover:shadow-md">
    <div className="max-w-[80%]">
      <p className="font-bold text-sm tracking-tight text-slate-900">{label}</p>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-1 leading-relaxed">{description}</p>
    </div>
    <div className={`w-14 h-7 rounded-full relative transition-colors cursor-pointer ${checked ? 'bg-[#1d7dfa]' : 'bg-slate-200'}`}>
       <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-8' : 'left-1'}`}></div>
    </div>
  </div>
);

export default CompanySettings;
