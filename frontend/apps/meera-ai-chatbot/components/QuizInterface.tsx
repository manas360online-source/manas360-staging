
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Timer, Award } from 'lucide-react';

interface QuizInterfaceProps {
  quizTitle: string;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onCancel: () => void;
  timeLimitMinutes?: number;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  quizTitle, 
  questions, 
  onComplete, 
  onCancel,
  timeLimitMinutes = 20
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimitMinutes * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0 && !submitted) {
      const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeRemaining, submitted]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    
    const score = (correctCount / questions.length) * 100;
    setTimeout(() => onComplete(score), 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-right-10 duration-500">
      {/* QUIZ HEADER */}
      <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{quizTitle}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Therapist Certification Exam</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-[#1068eb] px-5 py-2.5 rounded-2xl border border-blue-100 font-mono">
          <Timer size={18} className={timeRemaining < 60 ? 'text-red-500 animate-pulse' : ''} />
          <span className="font-bold">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1.5 bg-slate-100 relative">
        <div 
          className="absolute inset-y-0 left-0 bg-[#1068eb] transition-all duration-300 shadow-[0_0_10px_rgba(16,104,235,0.4)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black text-[#1068eb] bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-blue-100">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-8">
            {question.text}
          </h3>

          <div className="space-y-4">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(question.id, key)}
                disabled={submitted}
                className={`w-full group relative flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left ${
                  answers[question.id] === key 
                    ? 'border-[#1068eb] bg-blue-50/50 shadow-md' 
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                } ${submitted && key === question.correctAnswer ? 'border-emerald-500 bg-emerald-50' : ''}
                  ${submitted && answers[question.id] === key && key !== question.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                `}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${
                  answers[question.id] === key ? 'bg-[#1068eb] text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {key.toUpperCase()}
                </div>
                <span className="text-[16px] font-bold text-slate-700 flex-1">{value}</span>
                
                {submitted && key === question.correctAnswer && <CheckCircle size={24} className="text-emerald-500" />}
                {submitted && answers[question.id] === key && key !== question.correctAnswer && <XCircle size={24} className="text-red-500" />}
              </button>
            ))}
          </div>

          {submitted && (
            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[10px] font-black text-[#1068eb] uppercase tracking-widest mb-2">Rationale</p>
              <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                "{question.explanation}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QUIZ NAVIGATION */}
      <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0 || submitted}
          className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 disabled:opacity-30 transition-all flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="hidden md:flex gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => !submitted && setCurrentQuestion(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentQuestion 
                  ? 'bg-[#1068eb] w-8' 
                  : (answers[questions[idx].id] ? 'bg-blue-200' : 'bg-slate-200')
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitted || Object.keys(answers).length < questions.length}
              className="px-10 py-3 rounded-2xl bg-[#1068eb] text-white font-bold hover:bg-[#0d56c4] shadow-xl shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:bg-slate-200"
            >
              <Award size={18} />
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
