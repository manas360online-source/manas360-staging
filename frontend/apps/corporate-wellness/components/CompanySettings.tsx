import React, { useState } from 'react';
import { User } from '../types';

const CompanySettings: React.FC<{ user: User }> = ({ user }) => {
  const [ssoProvider, setSsoProvider] = useState('okta');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Company Setup</h1>
        <p className="text-slate-400 font-medium uppercase text-[11px] tracking-wider mt-1">Enterprise Configuration & Infrastructure</p>
      </header>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-xl border border-emerald-100 font-semibold text-sm animate-in slide-in-from-top-4">
          ✓ Configuration successfully synchronized with global servers.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Details */}
        <section className="brand-card p-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-3">
            <span className="bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center text-lg">🏢</span> Company Profile
          </h3>
          <div className="space-y-5">
            <InputField label="Entity Identity" placeholder="e.g. Global Tech Solutions Inc." />
            <InputField label="Global HQ" placeholder="e.g. Innovation Hub, Sector 12" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Employee Count" placeholder="e.g. 2,000" />
              <InputField label="Contract Status" placeholder="e.g. Active (Tier 1)" />
            </div>
          </div>
        </section>

        {/* Privacy & Compliance */}
        <section className="brand-card p-8 relative overflow-hidden group">
          <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-3 relative z-10">
            <span className="bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center text-lg">🛡️</span> Security & Privacy
          </h3>
          <div className="space-y-4 relative z-10">
            <Toggle label="Manager Anonymity Shield" checked={true} description="Restrict manager access to aggregate trends only." />
            <Toggle label="k-Anonymity (k=5)" checked={true} description="Hide data if group size is below 5 employees." />
            <Toggle label="Compliance Audits" checked={true} description="Automatic data processing audits enabled." />
          </div>
        </section>

        {/* SSO Integration */}
        <section className="lg:col-span-2 brand-card p-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-3">
              <span className="bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center text-lg">🔐</span> SSO Integration
            </h3>
            <div className="flex gap-2">
              <ProviderBtn active={ssoProvider === 'okta'} onClick={() => setSsoProvider('okta')} label="Okta" />
              <ProviderBtn active={ssoProvider === 'azure'} onClick={() => setSsoProvider('azure')} label="Azure AD" />
              <ProviderBtn active={ssoProvider === 'google'} onClick={() => setSsoProvider('google')} label="Workspace" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Identity Provider (IdP) URL" placeholder="https://sso.yourcompany.com" />
            <InputField label="App Federation Metadata" placeholder="Upload XML or paste URL" />
            <InputField label="SSO Target URL" defaultValue="https://portal.systems/api/v1/sso/acs" readOnly />
            <InputField label="Service Provider Entity ID" defaultValue="https://portal.systems" readOnly />
          </div>

          <div className="mt-10 p-5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-semibold text-[#1d7dfa] uppercase tracking-wider mb-3 px-1">Attribute Mapping Configuration</p>
            <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600 p-1">
              <div className="flex flex-col gap-1"><span>First Name</span><span className="text-[#1d7dfa] font-normal">firstName</span></div>
              <div className="flex flex-col gap-1"><span>Last Name</span><span className="text-[#1d7dfa] font-normal">lastName</span></div>
              <div className="flex flex-col gap-1"><span>Department</span><span className="text-[#1d7dfa] font-normal">dept</span></div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3">
            <button className="h-11 px-6 bg-slate-50 text-slate-500 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all">Test Connection</button>
            <button onClick={handleSave} className="btn-brand px-10 text-xs font-semibold uppercase tracking-widest">Save Infrastructure</button>
          </div>
        </section>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string; placeholder?: string; defaultValue?: string; readOnly?: boolean }> = ({ label, placeholder, defaultValue, readOnly }) => (
  <div>
    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2 px-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      defaultValue={defaultValue} 
      readOnly={readOnly}
      className={`brand-input ${readOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400 border-slate-100' : ''}`} 
    />
  </div>
);

const ProviderBtn: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`h-9 px-4 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all border ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white text-slate-400 hover:border-slate-300'}`}
  >
    {label}
  </button>
);

const Toggle: React.FC<{ label: string; description: string; checked: boolean }> = ({ label, description, checked }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:bg-white hover:border-slate-200">
    <div className="max-w-[80%]">
      <p className="font-semibold text-sm text-slate-900 leading-none mb-1.5">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{description}</p>
    </div>
    <div className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${checked ? 'bg-[#1d7dfa]' : 'bg-slate-200'}`}>
       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-6' : 'left-1'}`}></div>
    </div>
  </div>
);

export default CompanySettings;