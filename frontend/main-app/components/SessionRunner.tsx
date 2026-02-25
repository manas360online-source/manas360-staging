
import React, { useState, useEffect } from 'react';
import { Session, Answer, Question } from '../types';
import { useTranslation } from 'react-i18next';

interface SessionRunnerProps {
  session: Session;
  onExit: () => void;
  onComplete: (answers: Answer[]) => void;
  readOnly?: boolean; 
}

export const SessionRunner: React.FC<SessionRunnerProps> = ({ session, onExit, onComplete }) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]); 
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  
  // Initialize history with first question
  useEffect(() => {
    if (session.questions.length > 0 && questionHistory.length === 0) {
      setQuestionHistory([session.questions[0].id]);
    }
  }, [session]);

  const currentQuestionId = questionHistory[questionHistory.length - 1];
  const currentQuestion = session.questions.find(q => q.id === currentQuestionId) || session.questions[0];
  
  const progress = Math.min(((questionHistory.length) / (session.questions.length || 1)) * 100, 100);

  const handleAnswer = (value: string | number | string[]) => {
    // Save answer
    const newAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), { questionId: currentQuestion.id, value }];
    setAnswers(newAnswers);
  };

  const handleCheckboxToggle = (optionId: string) => {
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
    let currentValues: string[] = [];
    
    if (currentAnswer && Array.isArray(currentAnswer.value)) {
      currentValues = [...currentAnswer.value];
    }

    if (currentValues.includes(optionId)) {
      currentValues = currentValues.filter(v => v !== optionId);
    } else {
      currentValues.push(optionId);
    }
    
    handleAnswer(currentValues);
  };

  const getAnswerValue = () => {
    return answers.find(a => a.questionId === currentQuestion.id)?.value;
  };

  const isAnswered = () => {
    if (currentQuestion.required === false) return true;
    const val = getAnswerValue();
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== '';
  };

  const handleNext = () => {
    if (!isAnswered()) {
      alert(t('runner_alert_answer'));
      return;
    }

    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

    // Branching Logic
    let nextQId: string | undefined;
    
    if (currentQuestion.type === 'multiple-choice' && currentQuestion.options) {
      const selectedOption = currentQuestion.options.find(o => o.id === currentAnswer?.value);
      if (selectedOption?.nextQuestionId) {
        nextQId = selectedOption.nextQuestionId;
      }
    }

    // Default linear progression
    if (!nextQId) {
      const currentIndexInAll = session.questions.findIndex(q => q.id === currentQuestion.id);
      if (currentIndexInAll < session.questions.length - 1) {
        nextQId = session.questions[currentIndexInAll + 1].id;
      } else {
        nextQId = 'end';
      }
    }

    if (nextQId === 'end') {
      setIsCompletedScreen(true);
    } else {
      setQuestionHistory([...questionHistory, nextQId]);
    }
  };

  const handleBack = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      setQuestionHistory(newHistory);
    } else {
      onExit();
    }
  };

  const handleFinish = () => {
    onComplete(answers);
  };

  // Completion Screen
  if (isCompletedScreen) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#1a1c22] flex flex-col items-center justify-center py-12 px-6 animate-fade-in text-center transition-colors duration-500 relative">
        
        {/* Absolute Top Right Icon */}
        <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
          <span className="text-[28px] leading-none">🧿</span>
        </div>

        <div className="w-full max-w-2xl bg-white dark:bg-[#262a33] rounded-[40px] p-12 shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="font-serif text-[2.5rem] text-[#0A3A78] dark:text-white mb-4 transition-colors">{t('runner_complete_title')}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 transition-colors">
            {t('runner_complete_msg')}
          </p>
          <button 
            onClick={handleFinish}
            className="px-10 py-4 rounded-full bg-[#1FA2DE] dark:bg-sky-600 text-white font-bold text-lg shadow-lg hover:bg-[#0A4E89] dark:hover:bg-sky-500 hover:shadow-xl transition-all"
          >
            {t('runner_return')}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#1a1c22] flex flex-col items-center py-12 px-6 animate-fade-in transition-colors duration-500 relative">
       
       {/* Absolute Top Right Icon */}
       <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
         <span className="text-[28px] leading-none">🧿</span>
       </div>

       {/* Header with Exit */}
       <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
        <button onClick={onExit} className="text-[#0A4E89] dark:text-sky-400 font-bold text-sm hover:underline transition-colors">
          ← {t('runner_exit')}
        </button>
        <div className="text-sm font-bold text-[#1A1A1A] dark:text-sky-200 uppercase tracking-widest bg-[#F1F4F6] dark:bg-slate-800 px-4 py-1 rounded-full border border-transparent dark:border-slate-700 transition-colors">
          {session.title}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-gray-200 dark:bg-slate-800 h-2 rounded-full mb-12 transition-colors">
        <div 
          className="bg-[#1FA2DE] dark:bg-sky-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-[#262a33] rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col justify-between transition-colors duration-500">
        
        <div>
          <h2 className="font-serif text-[1.8rem] text-[#000000] dark:text-white mb-8 leading-tight transition-colors">
            {currentQuestion.text}
          </h2>

          {/* Render Input based on Type */}
          <div className="space-y-4">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    className={`
                      w-full text-left px-6 py-4 rounded-2xl text-[1.1rem] font-medium transition-all duration-200 border
                      ${getAnswerValue() === opt.id
                        ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white border-transparent shadow-md transform scale-[1.01]' 
                        : 'bg-[#F1F4F6] dark:bg-slate-800/60 text-[#1A1A1A] dark:text-slate-200 border-[#D5D9DD] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'checkbox' && currentQuestion.options && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map(opt => {
                   const val = getAnswerValue();
                   const isSelected = Array.isArray(val) && val.includes(opt.id);
                   return (
                    <button
                      key={opt.id}
                      onClick={() => handleCheckboxToggle(opt.id)}
                      className={`
                        w-full text-left px-6 py-4 rounded-2xl text-[1.1rem] font-medium transition-all duration-200 border flex justify-between items-center
                        ${isSelected
                          ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white border-transparent shadow-md transform scale-[1.01]' 
                          : 'bg-[#F1F4F6] dark:bg-slate-800/60 text-[#1A1A1A] dark:text-slate-200 border-[#D5D9DD] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <textarea
                className="w-full p-4 bg-[#F1F4F6] dark:bg-slate-800/60 border border-[#D5D9DD] dark:border-slate-700 text-wellness-text dark:text-white rounded-2xl text-lg min-h-[150px] focus:outline-none focus:border-[#1FA2DE] dark:focus:border-sky-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Type your answer here..."
                value={getAnswerValue() as string || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {currentQuestion.type === 'slider' && (
              <div className="py-8 px-2 flex flex-col items-center">
                <span className="text-[#1FA2DE] dark:text-sky-400 font-bold text-2xl mb-4 transition-colors">
                  {getAnswerValue() || 0}
                </span>
                <input 
                  type="range" 
                  min={currentQuestion.min || 0} 
                  max={currentQuestion.max || 10} 
                  step={currentQuestion.step || 1}
                  value={getAnswerValue() as number || 0}
                  onChange={(e) => handleAnswer(Number(e.target.value))}
                  className="custom-slider"
                />
                <div className="w-full flex justify-between mt-4 text-slate-500 dark:text-slate-400 font-medium transition-colors">
                  <span>{currentQuestion.minLabel || 'Low'}</span>
                  <span>{currentQuestion.maxLabel || 'High'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t border-slate-100 dark:border-slate-700 transition-colors">
           <button 
             onClick={handleBack}
             className="px-8 py-3 rounded-full font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
           >
             {t('runner_back')}
           </button>
           <button 
             onClick={handleNext}
             disabled={!isAnswered()}
             className={`
               px-10 py-3 rounded-full font-bold text-white transition-all shadow-lg
               ${!isAnswered()
                 ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500 dark:text-slate-400'
                 : 'bg-[#0A3157] dark:bg-sky-600 hover:bg-[#124A85] dark:hover:bg-sky-500 hover:shadow-xl hover:-translate-y-1'
               }
             `}
           >
             {session.questions.findIndex(q => q.id === currentQuestion.id) === session.questions.length - 1 ? t('runner_finish') : t('runner_next')}
           </button>
        </div>

      </div>
    </div>
  );
};
