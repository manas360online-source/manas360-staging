
import React from 'react';

const ReportsHistory: React.FC = () => {
  const REPORTS = [
    { id: 'R1', title: 'Executive Summary Q3 2025', date: 'Sept 30, 2025', size: '2.4 MB', type: 'ROI / Financial' },
    { id: 'R2', title: 'Departmental Breakdown Q2', date: 'Jun 30, 2025', size: '1.8 MB', type: 'Engagement' },
    { id: 'R3', title: 'Sustained Resilience Audit', date: 'Mar 15, 2025', size: '4.2 MB', type: 'Clinical Outcomes' },
    { id: 'R4', title: 'Annual Infrastructure Overview', date: 'Jan 05, 2025', size: '12 MB', type: 'Enterprise' },
  ];

  const handleDownload = (report: typeof REPORTS[0]) => {
    const content = `Report: ${report.title}\nDate: ${report.date}\nType: ${report.type}\nSize: ${report.size}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Title,Date,Size,Type'];
    const rows = REPORTS.map(r => `${r.id},"${r.title}",${r.date},${r.size},${r.type}`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports_archive.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfigureAutomation = () => {
    alert("Automation configuration panel would open here.");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Reporting Archive</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Audit Trail & Performance Metrics</p>
      </header>

      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Generated Artifacts</h3>
          <button onClick={handleExportCSV} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer">Export All (CSV)</button>
        </div>

        <div className="space-y-4">
          {REPORTS.map((report) => (
            <div key={report.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 hover:bg-white transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-blue-50 transition-colors">📄</div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">{report.title}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                    <span className="text-[10px] font-black text-[#1d7dfa] uppercase tracking-widest">{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{report.size}</span>
                <button onClick={() => handleDownload(report)} className="px-8 py-4 bg-white border border-slate-200 text-[#1d7dfa] rounded-full font-black text-xs uppercase tracking-widest hover:border-[#1d7dfa] transition-all group-hover:shadow-lg shadow-blue-100 cursor-pointer">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-10 bg-white border border-slate-100 rounded-[3.5rem] text-slate-900 relative overflow-hidden group shadow-xl shadow-blue-500/5">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
               <h3 className="text-2xl font-black mb-4 tracking-tighter text-[#1e3a8a]">Automated Reporting Engine</h3>
               <p className="text-slate-400 font-bold text-xs uppercase leading-relaxed tracking-widest opacity-80">
                 Configure systems to automatically transmit anonymized executive memos to stakeholders at the end of every fiscal cycle.
               </p>
            </div>
            <button onClick={handleConfigureAutomation} className="px-12 py-6 bg-[#1d7dfa] hover:bg-blue-600 transition-all rounded-full font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/20 active:scale-95 shrink-0 text-white cursor-pointer">Configure Automation</button>
         </div>
         <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-50 blur-[80px]"></div>
      </div>
    </div>
  );
};

export default ReportsHistory;
