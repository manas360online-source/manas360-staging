
import React, { useState } from 'react';
import { SessionTemplate, SessionResult } from '../types';
import { Plus, Play, Edit, Trash2, FileText, Download, Sparkles, Loader2, BarChart2, Share, GraduationCap, Smile } from 'lucide-react';
import { generateSessionTemplate } from '../services/geminiService';

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
  onBack?: () => void;
}

const Dashboard: React.FC<Props> = ({ templates, results, onCreate, onEdit, onDelete, onRun, onAddGenerated, onViewResults, onEnterAcademy, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);

  const handleGenerate = async () => {
    if (!genTopic) return;
    setIsGenerating(true);
    try {
      const template = await generateSessionTemplate(genTopic);
      onAddGenerated(template);
      setShowGenModal(false);
      setGenTopic('');
    } catch (e) {
      console.error(e);
      alert("Failed to generate session. Please check API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportTemplate = (t: SessionTemplate) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(t, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${t.title.replace(/\s+/g, '_')}_v${t.version}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getLatestMood = () => {
    const latestResult = results.slice().reverse().find(r => r.answers._sessionMood);
    if (!latestResult) return null;
    const mood = Number(latestResult.answers._sessionMood);
    const map = ['😢', '😟', '😐', '😊', '😁'];
    return { emoji: map[mood - 1] || '😐', note: latestResult.answers._moodNote };
  };

  const latestMood = getLatestMood();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                title="Back to Home"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-slate-900">Therapist Dashboard</h1>
          </div>
          <p className="text-slate-500 mt-1">Manage your CBT session templates and patient activities.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onEnterAcademy}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md shadow-blue-200"
          >
            <GraduationCap size={18} />
            Therapist Academy
          </button>
          <button
            onClick={onViewResults}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <BarChart2 size={18} />
            Session History
          </button>
          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Sparkles size={18} />
            AI Generator
          </button>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-200"
          >
            <Plus size={18} />
            Create New
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Templates</p>
          <p className="text-3xl font-black text-slate-900">{templates.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sessions Completed</p>
          <p className="text-3xl font-black text-slate-900">{results.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Latest Patient Mood</p>
            <p className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
              {latestMood ? (latestMood.note || 'No note added') : 'No check-ins yet'}
            </p>
          </div>
          <div className="text-4xl">
            {latestMood ? latestMood.emoji : '—'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">CBT Templates</h2>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No Templates Yet</h3>
          <p className="text-slate-500 mb-6">Create a new session template or use AI to generate one.</p>
          <button onClick={onCreate} className="text-primary font-semibold hover:underline">Create Manual Template</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(t => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/20 transition-all flex flex-col group overflow-hidden">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">v{t.version}</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleExportTemplate(t)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Export JSON"><Share size={14} /></button>
                    <button onClick={() => onEdit(t)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Edit"><Edit size={14} /></button>
                    <button onClick={() => onDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 truncate">{t.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{t.description || 'No description provided for this therapeutic module.'}</p>
                <div className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1.5"><FileText size={12} /> {t.questions.length} Qs</span>
                  <span className="flex items-center gap-1.5"><Loader2 size={12} className="opacity-50" /> {new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                <button onClick={() => onRun(t)} className="flex-1 flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md">
                  <Play size={14} fill="currentColor" /> Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-8 text-indigo-600">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">AI Session Generator</h2>
            </div>

            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Describe the clinical focus (e.g., "Social Anxiety Exposure", "Insomnia Intake") and Gemini will construct a structured CBT session for you.
            </p>

            <textarea
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              placeholder="e.g. Cognitive restructuring for impostor syndrome..."
              className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none mb-8 h-32 transition-all placeholder-slate-400 font-medium"
              autoFocus
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={() => setShowGenModal(false)} className="px-6 py-3 text-slate-500 font-bold uppercase text-[10px] tracking-[2px] hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !genTopic}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-[2px] hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100"
              >
                {isGenerating && <Loader2 size={16} className="animate-spin" />}
                {isGenerating ? 'Generating...' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
