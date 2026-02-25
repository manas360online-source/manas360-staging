
import React from 'react';

const ReportsHistory: React.FC = () => {
  const REPORTS = [
    { id: 'R1', title: 'Grade-level Wellness Summary Q1', date: 'Oct 15, 2024', size: '2.4 MB', type: 'Academic Pulse' },
    { id: 'R2', title: 'SEL Participation Audit - MidTerm', date: 'Sept 30, 2024', size: '1.8 MB', type: 'Student Engagement' },
    { id: 'R3', title: 'Student Stress Index Trends', date: 'Aug 22, 2024', size: '4.2 MB', type: 'Counselor Insights' },
    { id: 'R4', title: 'Campus Consent Compliance Log', date: 'July 10, 2024', size: '12 MB', type: 'Regulatory' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Academic Analytics</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Institutional Audit Trail & Student Wellness Statistics</p>
      </header>

      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Generated Artifacts</h3>
          <button className="px-8 py-4 bg-slate-50 text-slate-500 rounded-full font-bold text-[12px] uppercase tracking-wide hover:bg-slate-100 transition-all whitespace-nowrap">Export Archive (CSV)</button>
        </div>

        <div className="space-y-4">
          {REPORTS.map((report) => (
            <div key={report.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 hover:bg-white transition-all group shadow-sm">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-blue-50 transition-colors shrink-0">📄</div>
                <div className="min-w-0">
                  <h4 className="text-xl font-black text-slate-800 tracking-tight truncate">{report.title}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{report.date}</span>
                    <span className="text-[11px] font-bold text-[#1d7dfa] uppercase tracking-wide whitespace-nowrap">{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">{report.size}</span>
                <button className="px-8 py-4 bg-white border border-slate-200 text-[#1d7dfa] rounded-full font-bold text-[12px] uppercase tracking-wide hover:border-[#1d7dfa] transition-all group-hover:shadow-lg shadow-blue-100 whitespace-nowrap">Open Report</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-10 bg-white border border-slate-100 rounded-[3.5rem] text-slate-900 relative overflow-hidden group shadow-xl shadow-blue-500/5">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
               <h3 className="text-2xl font-black mb-4 tracking-tighter text-[#1e3a8a]">Institutional Reporting Automator</h3>
               <p className="text-slate-400 font-bold text-xs uppercase leading-relaxed tracking-widest opacity-80">
                 Schedule monthly student wellness memos for transmission to the School Board, Department Heads, and verified Guardians.
               </p>
            </div>
            <button className="px-12 py-6 bg-[#1d7dfa] hover:bg-blue-600 transition-all rounded-full font-bold text-[13px] uppercase tracking-wide shadow-2xl shadow-blue-500/20 active:scale-95 shrink-0 text-white whitespace-nowrap">Setup Automation</button>
         </div>
         <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-50 blur-[80px]"></div>
      </div>
    </div>
  );
};

export default ReportsHistory;
