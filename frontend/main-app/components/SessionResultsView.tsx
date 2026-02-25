
import React from 'react';
import { Session, Answer } from '../types';
import { storageService, TEMPLATES } from '../utils/storageService';
import { useTranslation } from 'react-i18next';
import { formatDate, formatTime } from '../utils/formatters';

interface SessionResultsViewProps {
  historyRecord: any;
  onBack: () => void;
}

export const SessionResultsView: React.FC<SessionResultsViewProps> = ({ historyRecord, onBack }) => {
  const { t } = useTranslation();

  const getLocalizedTemplate = (sessionId: string, sessionTitle: string) => {
    let found = TEMPLATES.find(t => t.id === sessionId);
    if (!found) {
      found = TEMPLATES.find(s => s.title === sessionTitle);
    }
    
    if (!found) return null;

    return {
      ...found,
      title: t(`session_${found.id.replace(/-/g, '_')}_title`, found.title),
      description: t(`session_${found.id.replace(/-/g, '_')}_desc`, found.description),
      questions: found.questions.map(q => ({
        ...q,
        text: t(`q_${q.id}_text`, q.text),
        options: q.options?.map(o => ({
           ...o,
           label: t(`opt_${o.id.replace(/-/g, '_')}`, o.label)
        }))
      }))
    };
  };

  const template = getLocalizedTemplate(historyRecord.sessionId, historyRecord.sessionTitle);

  const renderAnswerValue = (questionId: string, value: string | number | string[]) => {
    if (!template) return JSON.stringify(value);

    const question = template.questions.find(q => q.id === questionId);
    if (!question) return JSON.stringify(value);

    if (question.type === 'multiple-choice' && question.options) {
      const option = question.options.find(o => o.id === value);
      return option ? option.label : value;
    }

    if (question.type === 'checkbox' && question.options && Array.isArray(value)) {
      const labels = value.map(v => {
        const opt = question.options?.find(o => o.id === v);
        return opt ? opt.label : v;
      });
      return labels.join(', ');
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#0F172A] p-8 animate-fade-in flex flex-col items-center transition-colors duration-500 relative">
      
      <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="w-full max-w-3xl">
        
        <div className="flex justify-between items-center mb-8">
           <button onClick={onBack} className="text-[#0A4E89] dark:text-sky-400 font-bold text-sm hover:underline transition-colors">
            ← {t('results_back')}
          </button>
          <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
            {t('results_view_title')}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
          <h1 className="font-serif text-[2rem] font-bold text-[#0A3A78] dark:text-white mb-2 transition-colors">
            {template ? template.title : historyRecord.sessionTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors">
            {t('completed_on')} {formatDate(historyRecord.completedAt)} {t('at')} {formatTime(historyRecord.completedAt)}
          </p>

          <div className="space-y-8">
            {template ? (
              template.questions.map((q, index) => {
                const answer = historyRecord.answers.find((a: Answer) => a.questionId === q.id);
                const hasAnswer = answer !== undefined;

                return (
                  <div key={q.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 pb-6 last:pb-0 transition-colors">
                    <p className="font-bold text-[#1A1A1A] dark:text-slate-200 text-lg mb-3 transition-colors">
                      <span className="text-slate-400 dark:text-slate-600 mr-2">{index + 1}.</span>
                      {q.text}
                    </p>
                    <div className="pl-6 md:pl-8">
                      {hasAnswer ? (
                        <p className="text-[#1FA2DE] dark:text-sky-400 font-medium text-lg transition-colors">
                          {renderAnswerValue(q.id, answer.value)}
                        </p>
                      ) : (
                        <p className="text-slate-400 dark:text-slate-600 italic transition-colors">{t('results_skipped')}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400 italic transition-colors">
                Original assessment template not found. Displaying raw data:
                <pre className="text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mt-4 overflow-auto text-xs text-slate-700 dark:text-slate-300">
                  {JSON.stringify(historyRecord.answers, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
