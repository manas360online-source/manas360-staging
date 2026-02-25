
import React from 'react';
import { TherapistData } from '../types';

interface Props {
  data: TherapistData;
  setData: React.Dispatch<React.SetStateAction<TherapistData>>;
  onNext: () => void;
}

const RegistrationForm: React.FC<Props> = ({ data, setData, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#1D3A63] leading-tight">Therapist Registration</h1>
          <p className="text-slate-400 text-lg mt-2 font-medium">Please share your details with us to join the network.</p>
        </div>
        <div className="hidden lg:flex gap-2">
          <div className="bg-[#EDF5FF] text-[#1D75FF] px-4 py-2 rounded-full text-xs font-bold border border-[#D0E4FF]">FORM ID: T01</div>
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-bold">STORY: 2.1</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Basic Information</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={data.fullName}
              onChange={handleChange}
              placeholder="Full Legal Name"
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium"
            />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Professional Email Address"
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium"
            />
            <input
              type="tel"
              name="mobile"
              value={data.mobile}
              onChange={handleChange}
              placeholder="Mobile Number (+91)"
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Professional Credentials</h3>
          <div className="space-y-4">
            <select
              name="qualification"
              value={data.qualification}
              onChange={handleChange}
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all text-slate-600 appearance-none font-medium"
            >
              <option value="">Select Qualification</option>
              <option value="PhD">PhD in Psychology</option>
              <option value="MPhil">MPhil in Clinical Psychology</option>
              <option value="MSc">MSc in Clinical Psychology</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="rciRegNo"
                value={data.rciRegNo}
                onChange={handleChange}
                placeholder="RCI/NMC Reg No."
                className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium"
              />
              <input
                type="text"
                name="yearsExp"
                value={data.yearsExp}
                onChange={handleChange}
                placeholder="Years of Exp."
                className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            <select
              name="specialization"
              value={data.specialization}
              onChange={handleChange}
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all text-slate-600 appearance-none font-medium"
            >
              <option value="">Core Specialization</option>
              <option value="CBT">Cognitive Behavioral Therapy (CBT)</option>
              <option value="DBT">Dialectical Behavior Therapy (DBT)</option>
              <option value="EMDR">EMDR / Trauma Focus</option>
            </select>

            <select
              name="languages"
              value={data.languages}
              onChange={handleChange}
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all text-slate-600 appearance-none font-medium"
            >
              <option value="">Preferred Languages</option>
              <option value="English">English Only</option>
              <option value="Hindi">Hindi Only</option>
              <option value="Multiple">Bilingual (English, Hindi, Regional)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-[#D0E4FF]/30 flex items-center justify-between">
        <p className="text-slate-400 text-sm hidden md:block">Ensuring all data provided is accurate as per official records.</p>
        <button
          onClick={onNext}
          className="w-full md:w-auto px-12 bg-[#1D75FF] hover:bg-[#1D75FF]/90 text-white font-black py-5 rounded-full flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-500/20 text-lg uppercase tracking-wider"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
