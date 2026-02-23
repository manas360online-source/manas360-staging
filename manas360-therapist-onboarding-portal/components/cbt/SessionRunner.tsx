
import React, { useState } from 'react';
import { SessionTemplate, SessionResult, QuestionType } from './types';
import { ArrowLeft } from 'lucide-react';
import MoodTracker from './MoodTracker';

interface Props {
    template: SessionTemplate;
    onComplete: (result: SessionResult) => void;
    onExit: () => void;
    mode?: 'preview' | 'live';
}

const SessionRunner: React.FC<Props> = ({ template, onComplete, onExit, mode = 'live' }) => {
    const [currentQId, setCurrentQId] = useState<string>(template.questions[0]?.id || '');
    const [history, setHistory] = useState<string[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showMoodTracker, setShowMoodTracker] = useState(false);
    const [completed, setCompleted] = useState(false);

    const currentQ = template.questions.find(q => q.id === currentQId);
    const progress = Math.round(((history.length + 1) / Math.max(template.questions.length, 1)) * 100);

    const handleAnswer = (val: any) => {
        setAnswers(prev => ({ ...prev, [currentQId]: val }));
    };

    const getNextQuestionId = (): string | null => {
        if (!currentQ) return null;

        if (currentQ.type === QuestionType.MCQ && currentQ.branches) {
            const selectedValue = answers[currentQId];
            const selectedOption = currentQ.options?.find(o => o.value === selectedValue);

            if (selectedOption) {
                const branch = currentQ.branches.find(b => b.optionId === selectedOption.id);
                if (branch && template.questions.some(q => q.id === branch.targetQuestionId)) {
                    return branch.targetQuestionId;
                }
            }
        }

        const currentIndex = template.questions.findIndex(q => q.id === currentQId);
        if (currentIndex < template.questions.length - 1) {
            return template.questions[currentIndex + 1].id;
        }

        return null;
    };

    const handleNext = () => {
        if (!currentQ) return;

        if (currentQ.required && (answers[currentQId] === undefined || answers[currentQId] === '')) {
            return;
        }

        const nextId = getNextQuestionId();
        setHistory(prev => [...prev, currentQId]);

        if (nextId) {
            setCurrentQId(nextId);
        } else {
            setShowMoodTracker(true);
        }
    };

    const handleBack = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        const prevId = newHistory.pop();
        setHistory(newHistory);
        if (prevId) setCurrentQId(prevId);
    };

    const handleMoodSaved = (mood: number, note: string) => {
        const finalAnswers = { ...answers, _sessionMood: mood, _moodNote: note };
        const result: SessionResult = {
            sessionId: Math.random().toString(36).substr(2, 9),
            templateId: template.id,
            templateTitle: template.title,
            completedAt: new Date().toISOString(),
            answers: finalAnswers,
            pathTaken: [...history, currentQId]
        };

        if (mode === 'live') {
            onComplete(result);
        }
        setCompleted(true);
        setShowMoodTracker(false);
    };

    if (completed) {
        return (
            <div className="flex flex-col h-full bg-accent">
                <header className="max-w-4xl mx-auto w-full px-6 pt-12 pb-8 flex items-center justify-between">
                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest group"
                    >
                        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        {mode === 'preview' ? 'Exit Preview' : 'Exit Session'}
                    </button>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-lg w-full text-center space-y-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-4xl">✓</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">Session Complete</h2>
                            <p className="text-slate-500 mt-4 text-lg">Thank you for completing this assessment. Your therapist has been notified.</p>
                        </div>
                        <button onClick={onExit} className="w-full py-4 bg-[#002d56] text-white rounded-full font-bold text-lg transition-all shadow-lg">
                            {mode === 'preview' ? 'Return to Editor' : 'Finish'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showMoodTracker) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-accent min-h-full">
                <MoodTracker onSave={handleMoodSaved} />
                <button
                    onClick={() => setShowMoodTracker(false)}
                    className="mt-8 flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest group"
                >
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    Back to Session
                </button>
            </div>
        );
    }

    if (!currentQ) return null;

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans">
            <header className="max-w-4xl mx-auto w-full px-6 pt-12 pb-8 flex items-center justify-between">
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest group"
                >
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    Exit Session
                </button>
                <div className="bg-[#f1f5f9] px-6 py-2 rounded-full">
                    <span className="text-[10px] font-black tracking-widest text-[#1e293b] uppercase">
                        {template.title}
                    </span>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full px-6 mb-8">
                <div className="h-1.5 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#0ea5e9] transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
                <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-12 md:p-16 flex flex-col animate-in fade-in duration-500">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-serif text-[#1e293b] mb-12 leading-[1.3] font-normal">
                            {currentQ.prompt}
                        </h2>

                        <div className="space-y-4">
                            {currentQ.type === QuestionType.MCQ && (
                                <div className="flex flex-col gap-3">
                                    {currentQ.options?.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleAnswer(opt.value)}
                                            className={`text-left px-8 py-5 rounded-2xl transition-all text-lg font-medium ${answers[currentQId] === opt.value ? 'bg-[#0ea5e9] text-white shadow-lg shadow-blue-100' : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b]'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === QuestionType.SLIDER && (
                                <div className="py-12 flex flex-col items-center">
                                    <div className="text-2xl font-black text-[#0ea5e9] mb-4">
                                        {answers[currentQId] || 0}
                                    </div>
                                    <div className="relative w-full h-4 mb-6">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#a3e635] to-[#ef4444]" />
                                        <input
                                            type="range"
                                            min={currentQ.min || 0}
                                            max={currentQ.max || 10}
                                            step={currentQ.step || 1}
                                            value={answers[currentQId] || 0}
                                            onChange={(e) => handleAnswer(Number(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0ea5e9] border-4 border-white rounded-full shadow-md pointer-events-none transition-all duration-150"
                                            style={{ left: `calc(${(answers[currentQId] || 0) / (currentQ.max || 10) * 100}% - 12px)` }}
                                        />
                                    </div>
                                    <div className="flex justify-between w-full text-slate-400 font-bold text-sm px-1">
                                        <span>{currentQ.minLabel || 'Min'}</span>
                                        <span>{currentQ.maxLabel || 'Max'}</span>
                                    </div>
                                </div>
                            )}

                            {currentQ.type === QuestionType.TEXT && (
                                <textarea
                                    className="w-full p-6 text-xl bg-[#f1f5f9] border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none resize-none min-h-[180px] text-[#1e293b] placeholder-slate-400"
                                    placeholder="Type your response..."
                                    value={answers[currentQId] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    autoFocus
                                />
                            )}

                            {currentQ.type === QuestionType.CHECKBOX && (
                                <div className="flex flex-col gap-3">
                                    {currentQ.options?.map(opt => {
                                        const currArr = (answers[currentQId] as string[]) || [];
                                        const isSelected = currArr.includes(opt.value);
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    const newArr = isSelected ? currArr.filter(x => x !== opt.value) : [...currArr, opt.value];
                                                    handleAnswer(newArr);
                                                }}
                                                className={`text-left px-8 py-5 rounded-2xl transition-all text-lg font-medium flex items-center justify-between ${isSelected ? 'bg-[#0ea5e9] text-white shadow-lg shadow-blue-100' : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b]'}`}
                                            >
                                                {opt.label}
                                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-white border-white text-[#0ea5e9]' : 'border-slate-300'}`}>
                                                    {isSelected && <span className="text-xs">✓</span>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-16 flex items-center justify-between border-t border-[#f1f5f9] pt-8">
                        <button
                            onClick={handleBack}
                            disabled={history.length === 0}
                            className="text-[#64748b] hover:text-[#1e293b] disabled:opacity-30 font-bold transition-colors text-lg"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentQ.required && (answers[currentQId] === undefined || answers[currentQId] === '')}
                            className={`px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all ${currentQ.required && (answers[currentQId] === undefined || answers[currentQId] === '') ? 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed' : 'bg-[#002d56] hover:bg-[#001d3d] text-white'}`}
                        >
                            {getNextQuestionId() === null ? 'Complete Assessment' : 'Next Question'}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 0; height: 0; }
        .font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
      `}</style>
        </div>
    );
};

export default SessionRunner;
