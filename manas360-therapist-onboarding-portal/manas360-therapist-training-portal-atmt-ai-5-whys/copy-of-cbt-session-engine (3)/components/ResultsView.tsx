
import React, { useState } from 'react';
import { SessionResult, QuestionType } from '../types';
import { ArrowLeft, Trash2, Heart } from 'lucide-react';
import { getTemplates } from '../services/storageService';

interface Props {
  results: SessionResult[];
  onBack: () => void;
  onDelete?: (sessionId: string) => void;
}

const ResultsView: React.FC<Props> = ({ results, onBack, onDelete }) => {
  const [selectedResult, setSelectedResult] = useState<SessionResult | null>(null);
  const templates = getTemplates();

  const getQuestionText = (templateId: string, qId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.questions.find(q => q.id === qId)?.prompt || qId;
  };

  const getAnswerLabel = (templateId: string, qId: string, value: any) => {
    const template = templates.find(t => t.id === templateId);
    const question = template?.questions.find(q => q.id === qId);
    
    if (question?.type === QuestionType.MCQ || question?.type === QuestionType.CHECKBOX) {
      if (Array.isArray(value)) {
        return value.map(v => question.options?.find(o => o.value === v)?.label || v).join(', ');
      }
      return question.options?.find(o => o.value === value)?.label || value;
    }
    return value?.toString() || '';
  };

  const getMoodEmoji = (value: any) => {
    const map = ['😢', '😟', '😐', '😊', '😁'];
    return map[Number(value) - 1] || '😐';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (selectedResult) {
    const questions = Object.entries(selectedResult.answers).filter(([k]) => !k.startsWith('_'));
    const moodValue = selectedResult.answers._sessionMood;
    const moodNote = selectedResult.answers._moodNote;
    
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-6 font-sans text-slate-900">
        <header className="max-w-4xl mx-auto w-full mb-12 flex items-center justify-between">
          <button 
            onClick={() => setSelectedResult(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest group"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to History
          </button>
          <div className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase">
            DETAILED REPORT
          </div>
        </header>

        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-12 md:p-20">
          <h1 className="text-4xl font-serif text-[#1e40af] mb-4 font-bold">
            {selectedResult.templateTitle}
          </h1>
          <p className="text-[#94a3b8] text-sm mb-16">
            Completed on {formatDate(selectedResult.completedAt)}
          </p>

          {moodValue && (
            <div className="mb-20 p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <Heart size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[2px]">Patient Mood Check-in</span>
              </div>
              <div className="flex items-start gap-6">
                <div className="text-6xl">{getMoodEmoji(moodValue)}</div>
                <div>
                   <p className="text-lg font-bold text-slate-800 mb-1">
                     {moodValue === 1 ? 'Very Sad' : moodValue === 2 ? 'Sad' : moodValue === 3 ? 'Neutral' : moodValue === 4 ? 'Happy' : 'Very Happy'}
                   </p>
                   <p className="text-slate-500 text-sm leading-relaxed italic">
                     {moodNote ? `"${moodNote}"` : "No specific note was added for this check-in."}
                   </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-16">
            <div className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase mb-8 pb-4 border-b border-slate-100">
              SESSION RESPONSES
            </div>
            {questions.map(([qId, ans], idx) => (
              <div key={qId} className="space-y-4">
                <h3 className="text-lg font-bold text-[#1e293b] leading-relaxed">
                  <span className="text-[#94a3b8] mr-2">{idx + 1}.</span>
                  {getQuestionText(selectedResult.templateId, qId)}
                </h3>
                <div className="pl-6">
                  <p className="text-xl text-[#0ea5e9] font-medium">
                    {getAnswerLabel(selectedResult.templateId, qId, ans)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest group"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Dashboard
          </button>
        </div>

        <h2 className="text-2xl font-black text-[#1e293b] mb-8">Session History</h2>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No completed sessions yet.</p>
            </div>
          ) : (
            results.slice().reverse().map(r => (
              <div 
                key={r.sessionId} 
                className="bg-white rounded-[2.5rem] p-8 flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-50"
              >
                <div className="flex items-center gap-6 min-w-0">
                  {r.answers._sessionMood && (
                    <div className="text-3xl shrink-0 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                      {getMoodEmoji(r.answers._sessionMood)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#1e293b] mb-1 truncate">
                      {r.templateTitle}
                    </h3>
                    <p className="text-sm text-[#94a3b8]">
                      Completed on {new Date(r.completedAt).toLocaleDateString()} at {new Date(r.completedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 ml-4">
                  <button 
                    onClick={() => setSelectedResult(r)}
                    className="bg-[#eff6ff] text-[#2563eb] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#dbeafe] transition-colors"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => onDelete?.(r.sessionId)}
                    className="text-[#ef4444] font-bold text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
