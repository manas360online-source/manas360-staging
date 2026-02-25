
import React from 'react';
import { SessionTemplate, SessionResult } from './types';
import { FileText, BarChart2, GraduationCap, Pencil, ArrowLeft } from 'lucide-react';

interface Props {
    templates: SessionTemplate[];
    results: SessionResult[];
    onCreate: () => void;
    onEdit: (t: SessionTemplate) => void;
    onDelete: (id: string) => void;
    onRun: (t: SessionTemplate) => void;
    onAddGenerated: (t: SessionTemplate) => void;
    onViewResults: () => void;
    onEnterAcademy: () => void;
}

const CBTDashboard: React.FC<Props> = ({ templates, results, onCreate, onEdit, onDelete, onRun, onAddGenerated, onViewResults, onEnterAcademy }) => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Top Left Back Button */}
            <div className="mb-8">
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest group"
                >
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    Back to Dashboard
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">What Good CBT Looks Like</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onEnterAcademy}
                        className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-200"
                    >
                        < GraduationCap size={18} />
                        Therapist Academy
                    </button>
                    <button
                        onClick={onViewResults}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <BarChart2 size={18} />
                        Session History
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800">CBT Templates</h2>
            </div>

            {templates.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Templates Yet</h3>
                    <p className="text-slate-500 mb-6">Create a session template to get started.</p>
                    <button onClick={onCreate} className="text-primary font-semibold hover:underline">Create Manual Template</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map(t => (
                        <div key={t.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all p-8 flex flex-col border border-slate-100 group overflow-hidden">
                            <div className="flex justify-between items-start mb-8">
                                <div className="bg-[#f1f7fe] p-4 rounded-2xl">
                                    <div className="relative">
                                        <FileText className="text-slate-400" size={28} />
                                        <Pencil className="text-orange-400 absolute -top-1 -right-1" size={12} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                                    <div className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        {t.questions.length} QS
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black text-slate-900 mb-4 leading-tight whitespace-nowrap overflow-visible" title={t.title}>
                                    {t.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {t.description || 'A structured therapeutic module to assess and guide clinical progress.'}
                                </p>
                            </div>

                            <button
                                onClick={() => onRun(t)}
                                className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-full font-bold text-base transition-all shadow-lg active:scale-[0.98]"
                            >
                                Start Session
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CBTDashboard;
