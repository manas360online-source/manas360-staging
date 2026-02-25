
import React, { useState, useEffect } from 'react';
import { Session } from '../types';
import { storageService, TEMPLATES } from '../utils/storageService';
import { useTranslation } from 'react-i18next';

interface AssessmentDashboardProps {
  onStartSession: (session: Session) => void;
  onViewHistory: (record: any) => void;
  onBack: () => void;
}

export const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({ onStartSession, onViewHistory, onBack }) => {
  const { t } = useTranslation();
  const [view, setView] = useState<'available' | 'history'>('available');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Refresh history whenever the view changes to 'history'
    if (view === 'history') {
      setHistory(storageService.getHistory());
    }
  }, [view]);

  const handleDeleteHistory = (id: string) => {
    if (!id) return;
    
    if (window.confirm(t('confirm_delete'))) {
      // 1. Delete from persistent storage
      storageService.deleteHistory(id);
      
      // 2. Immediately update local state to reflect deletion using functional update
      setHistory(prevHistory => prevHistory.filter(record => record.id !== id));
    }
  };

  // Helper to localize templates
  const getLocalizedTemplates = () => {
    return TEMPLATES.map(s => ({
      ...s,
      title: t(`session_${s.id.replace(/-/g, '_')}_title`, s.title),
      description: t(`session_${s.id.replace(/-/g, '_')}_desc`, s.description),
      questions: s.questions.map(q => ({
        ...q,
        text: t(`q_${q.id}_text`, q.text),
        minLabel: q.minLabel ? t(`label_${q.minLabel.replace(/\s+/g, '_').toLowerCase()}`, q.minLabel) : undefined,
        maxLabel: q.maxLabel ? t(`label_${q.maxLabel.replace(/\s+/g, '_').toLowerCase()}`, q.maxLabel) : undefined,
        options: q.options?.map(o => ({
           ...o,
           label: t(`opt_${o.id.replace(/-/g, '_')}`, o.label)
        }))
      }))
    }));
  };

  const localizedTemplates = getLocalizedTemplates();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F5FF] to-white dark:from-slate-900 dark:to-slate-950 p-8 animate-fade-in transition-colors duration-500 relative">
      
      {/* Absolute Top Right Icon */}
      <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button onClick={onBack} className="text-[#0A4E89] dark:text-sky-400 font-bold text-sm hover:underline transition-colors">
                ← {t('btn_back_results')}
              </button>
            </div>
            <h1 className="font-serif text-[2.5rem] text-[#0A3A78] dark:text-white font-bold transition-colors">{t('dashboard_title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 transition-colors">{t('dashboard_subtitle')}</p>
          </div>
          
          <div className="flex bg-white dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <button 
              onClick={() => setView('available')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${view === 'available' ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {t('btn_available')}
            </button>
            <button 
              onClick={() => setView('history')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${view === 'history' ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {t('btn_history')}
            </button>
          </div>
        </header>

        {/* View: Available Assessments */}
        {view === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {localizedTemplates.map(session => (
              <div key={session.id} className="bg-white dark:bg-[#1E293B] p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_-10px_rgba(14,165,233,0.15)] hover:-translate-y-1 transition-all flex flex-col">
                <div className="mb-6 flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-700 flex items-center justify-center text-2xl">
                     📝
                   </div>
                   <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider">
                     {session.questions.length} Qs
                   </span>
                </div>
                
                <h3 className="font-serif text-[1.5rem] font-bold text-[#1A1A1A] dark:text-white mb-3 leading-tight transition-colors">{session.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed flex-grow transition-colors">{session.description}</p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-700 transition-colors">
                   <button 
                     onClick={() => onStartSession(session)}
                     className="w-full py-3 rounded-full bg-[#0A3157] dark:bg-sky-600 text-white font-bold hover:bg-[#124A85] dark:hover:bg-sky-500 shadow-lg hover:shadow-xl transition-all"
                   >
                     {t('btn_start')}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View: Session History */}
        {view === 'history' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
            {history.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                {t('no_history')}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {history.map((record) => (
                  <div key={record.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1A1A1A] dark:text-white text-lg mb-1">{record.sessionTitle}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('completed_on')} {new Date(record.completedAt).toLocaleDateString()} {t('at')} {new Date(record.completedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onViewHistory(record)}
                        className="px-5 py-2 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-sky-300 font-bold text-sm hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        {t('btn_view')}
                      </button>
                      <button 
                        onClick={() => handleDeleteHistory(record.id)}
                        className="px-5 py-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm transition-colors"
                      >
                        {t('btn_delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
