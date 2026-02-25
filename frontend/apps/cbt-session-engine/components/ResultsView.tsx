
import React from 'react';
import { SessionResult } from '../types';
import { ArrowLeft, Download, FileText, Smile } from 'lucide-react';

interface Props {
  results: SessionResult[];
  onBack: () => void;
}

const ResultsView: React.FC<Props> = ({ results, onBack }) => {

  const handleExportCSV = (r: SessionResult) => {
    const headers = ['Question ID', 'Answer'];
    const rows = Object.entries(r.answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(';') : v]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `session_${r.sessionId}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handlePrint = () => {
      window.print();
  };

  const getMoodEmoji = (mood: any) => {
    const m = Number(mood);
    if (m === 1) return '😢';
    if (m === 2) return '😟';
    if (m === 3) return '😐';
    if (m === 4) return '😊';
    if (m === 5) return '😁';
    return '❓';
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8 no-print">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 flex items-center gap-2 group transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-slate-700 group-hover:text-slate-900">Return to Dashboard</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2 no-print">
            <h2 className="text-2xl font-bold text-slate-800">Session History</h2>
            <p className="text-sm text-slate-500">{results.length} total sessions recorded</p>
        </div>

        {results.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
             <FileText size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500 italic">No completed sessions found.</p>
           </div>
        ) : (
            results.slice().reverse().map(r => (
                <div key={r.sessionId} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm break-inside-avoid hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <div>
                            <h3 className="font-bold text-xl text-slate-800">{r.templateTitle}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-slate-500">{new Date(r.completedAt).toLocaleString()}</p>
                                <span className="text-slate-300">•</span>
                                <p className="text-xs text-slate-400 font-mono">ID: {r.sessionId}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 no-print shrink-0">
                            <button onClick={() => handleExportCSV(r)} className="text-xs font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-slate-100">
                                <Download size={14} /> Export CSV
                            </button>
                            <button onClick={handlePrint} className="text-xs font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-slate-100">
                                <FileText size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* Mood Tracker Summary */}
                    {r.answers._sessionMood && (
                        <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="text-4xl p-2 bg-white rounded-2xl shadow-sm border border-blue-100">
                                {getMoodEmoji(r.answers._sessionMood)}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[2px] mb-1">Session Mood Check-in</p>
                                <p className="text-slate-700 italic text-sm">
                                    {r.answers._moodNote ? `"${r.answers._moodNote}"` : 'No journal entry added for this session.'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
                        {Object.entries(r.answers).filter(([k]) => !k.startsWith('_')).map(([qId, ans]) => (
                            <div key={qId} className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest" title={qId}>{qId}</span>
                                <span className="text-slate-800 font-semibold text-base">
                                    {Array.isArray(ans) ? ans.join(', ') : ans.toString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>
      <style>{`
        @media print {
            .no-print { display: none !important; }
            body { background: white; }
            .shadow-sm { box-shadow: none; border: 1px solid #ccc; }
            .rounded-2xl { border-radius: 8px !important; }
        }
      `}</style>
    </div>
  );
};

export default ResultsView;
