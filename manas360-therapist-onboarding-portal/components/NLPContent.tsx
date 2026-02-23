
import React, { useState, useEffect, useRef } from 'react';
import {
    Volume2,
    ShieldCheck,
    CheckCircle,
    RefreshCw,
    Trophy,
    Download,
    Play,
    Pause,
    ClipboardCheck,
    AlertCircle,
    FileText,
    FileDown,
    ArrowLeft,
    Award
} from 'lucide-react';
import { NLP_MODULES } from './NLPConstants';
import { UserProgress, Certificate } from './NLPTypes';
import confetti from 'canvas-confetti';
import NLPCertificateModal from './NLPCertificateModal';

interface NLPContentProps {
    onBack: () => void;
}

import TrainingSidebar from './TrainingSidebar';

const NLPContent: React.FC<NLPContentProps> = ({ onBack }) => {
    return (
        <>
            <TrainingSidebar />
            <div className="flex-1 h-screen overflow-y-auto bg-[#F7FAFC]">
                <NLPContentInternal onBack={onBack} />
            </div>
        </>
    );
};

const NLPContentInternal: React.FC<NLPContentProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'resources'>('learn');
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize progress from localStorage or default
    const [progress, setProgress] = useState<UserProgress>(() => {
        const saved = localStorage.getItem('nlp_lms_progress');
        return saved ? JSON.parse(saved) : {
            userId: 'user_123',
            studentName: 'Therapist',
            profileImage: '',
            enrolledModules: ['ATMT_0.1'],
            completedModules: [],
            quizScores: {},
            certificates: []
        };
    });

    const [quizState, setQuizState] = useState<{
        started: boolean;
        answers: Record<string, number>;
        submitted: boolean;
        score: number;
    }>({
        started: false,
        answers: {},
        submitted: false,
        score: 0
    });

    const currentCode = 'ATMT_0.1';
    const module = NLP_MODULES.find(m => m.code === currentCode);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        localStorage.setItem('nlp_lms_progress', JSON.stringify(progress));
    }, [progress]);

    if (!module) return <div className="p-20 text-center font-serif text-2xl">Module Not Found</div>;

    const handleDownload = (title: string) => {
        // Generate a placeholder PDF blob for institutional resources
        const docTitle = title.toUpperCase();
        const content = `NLP ORIENTATION: OFFICIAL RESOURCE\n\nDocument: ${docTitle}\nTrack: Professional Registry Gateway\nStatus: Authorized Access Only\n\nThis document contains proprietary institutional frameworks regarding clinical empathy and professional NLP architecture. Use is restricted to registered practitioners.\n\n© ${new Date().getFullYear()} Standard Registry Division.`;

        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleAnswer = (questionId: string, optionIndex: number) => {
        if (quizState.submitted) return;
        setQuizState(prev => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: optionIndex }
        }));
    };

    const submitQuiz = () => {
        let correctCount = 0;
        module.quiz_questions.forEach(q => {
            if (quizState.answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        const percentage = Math.round((correctCount / module.quiz_questions.length) * 100);
        setQuizState(prev => ({ ...prev, submitted: true, score: percentage }));

        if (percentage >= module.passing_score) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0066FF', '#fbbf24', '#ffffff']
            });

            // Update progress
            setProgress(prev => {
                const isNewlyCompleted = !prev.completedModules.includes(module.code);
                const newCompleted = isNewlyCompleted
                    ? [...prev.completedModules, module.code]
                    : prev.completedModules;

                let newCertificates = [...prev.certificates];

                if (isNewlyCompleted) {
                    const cert: Certificate = {
                        id: `NO-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${module.code}`,
                        moduleCode: module.code,
                        moduleTitle: module?.title || '',
                        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                        verificationToken: Math.random().toString(36).substr(2, 12),
                        studentName: prev.studentName
                    };
                    newCertificates.push(cert);
                    setTimeout(() => setActiveCert(cert), 1500);
                }

                return {
                    ...prev,
                    completedModules: newCompleted,
                    quizScores: { ...prev.quizScores, [module.code]: percentage },
                    certificates: newCertificates
                };
            });
        }
    };

    const resetQuiz = () => {
        setQuizState({
            started: true,
            answers: {},
            submitted: false,
            score: 0
        });
    };

    const [activeCert, setActiveCert] = useState<Certificate | null>(null);

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="bg-[#F1F7FE] min-h-screen">
            {activeCert && <NLPCertificateModal cert={activeCert} onClose={() => setActiveCert(null)} />}
            <div className="bg-white border-b border-stone-100">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <button
                        onClick={onBack}
                        className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center space-x-3 mb-6">
                                <span className="px-4 py-2 bg-blue-50 text-[#0066FF] text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-blue-100">
                                    Institutional Module
                                </span>
                                {progress.completedModules.includes(module.code) && (
                                    <span className="px-4 py-2 bg-[#0066FF] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center shadow-lg shadow-blue-100">
                                        <CheckCircle className="w-3 h-3 mr-2" /> Mastery Verified
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-[1.1]">NLP Orientation</h1>
                        </div>

                        <div className="flex items-center space-x-2 bg-stone-50 p-2 rounded-full border border-stone-100 shrink-0">
                            <button
                                onClick={() => setActiveTab('learn')}
                                className={`px-8 py-4 rounded-full font-bold text-sm transition-all flex items-center ${activeTab === 'learn' ? 'bg-white text-slate-900 shadow-xl border border-blue-50' : 'text-slate-400'
                                    }`}
                            >
                                Learn
                            </button>
                            <button
                                onClick={() => setActiveTab('resources')}
                                className={`px-8 py-4 rounded-full font-bold text-sm transition-all flex items-center ${activeTab === 'resources' ? 'bg-white text-slate-900 shadow-xl border border-blue-50' : 'text-slate-400'
                                    }`}
                            >
                                Resources
                            </button>
                            <button
                                onClick={() => setActiveTab('quiz')}
                                className={`px-8 py-4 rounded-full font-bold text-sm transition-all flex items-center ${activeTab === 'quiz' ? 'bg-white text-slate-900 shadow-xl border border-blue-50' : 'text-slate-400'
                                    }`}
                            >
                                Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {activeTab === 'learn' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-12">
                            <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-white">
                                <div className="prose prose-stone max-w-none">
                                    <div className="flex items-center justify-between mb-12">
                                        <h2 className="text-3xl font-serif font-bold text-slate-900">Module Curriculum</h2>
                                        <div className="flex items-center space-x-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck className="w-4 h-4 text-[#0066FF]" /> Clinical Material
                                        </div>
                                    </div>

                                    <p className="text-slate-500 leading-relaxed text-xl mb-12 font-medium">{module.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                        {/* Learning Objectives */}
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                                    <Trophy className="w-5 h-5 text-pink-500" />
                                                </div>
                                                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Learning Objectives</h3>
                                            </div>
                                            <ul className="space-y-4">
                                                {[
                                                    "Understand sympathy vs empathy difference",
                                                    "Learn the 5Why sequencing with empathy",
                                                    "Map the Daily Journey of a patient",
                                                    "Master Projecting Questions technique",
                                                    "Practice safe inquiry without interrogation"
                                                ].map((item, idx) => (
                                                    <li key={idx} className="flex items-start space-x-3">
                                                        <div className="w-5 h-5 rounded-md border-2 border-slate-200 mt-0.5 flex-shrink-0"></div>
                                                        <span className="text-slate-600 font-medium leading-tight">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Certification Requirements */}
                                            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl">
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <ShieldCheck className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Certification Requirements</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { text: "Complete all 5 modules", color: "bg-amber-50 text-amber-800 border-amber-100", icon: FileText },
                                                        { text: "Pass each module quiz (85%+)", color: "bg-emerald-50 text-emerald-800 border-emerald-100", icon: CheckCircle },
                                                        { text: "Watch all video lessons", color: "bg-blue-50 text-blue-800 border-blue-100", icon: Play },
                                                        { text: "Earn MANAS360 Certified Badge", color: "bg-green-50 text-green-800 border-green-100", icon: Award }
                                                    ].map((req, idx) => (
                                                        <div key={idx} className={`flex items-center p-3 rounded-xl border ${req.color} ${req.text.includes('Badge') ? '' : ''}`}>
                                                            <req.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                                            <span className="text-sm font-bold">{req.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Required For Roles */}
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl mb-12">
                                        <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm mb-2">Required For Roles</h3>
                                        <p className="text-slate-500 text-sm mb-6">Each module shows which roles must complete it. All roles must pass to receive MANAS360 Certification Badge.</p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-4 py-2 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">All Roles</span>
                                            <span className="px-4 py-2 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs">Therapists</span>
                                            <span className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">Coaches</span>
                                            <span className="px-4 py-2 rounded-lg bg-pink-100 text-pink-800 font-bold text-xs">ASHA Workers</span>
                                        </div>
                                    </div>

                                    <div className="aspect-video bg-slate-900 rounded-[3.5rem] mb-12 flex items-center justify-center relative overflow-hidden group shadow-2xl border-[12px] border-stone-50">
                                        <img src={`https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1200`} className="w-full h-full object-cover opacity-50 grayscale" alt="Visual Aid" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer group">
                                                <Play className="w-10 h-10 text-white fill-white ml-1 group-hover:text-blue-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-10">
                            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                                        <Volume2 className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h4 className="font-serif text-2xl font-bold mb-2">Institutional Narration</h4>
                                    <p className="text-slate-400 text-xs font-medium mb-10 opacity-70 uppercase tracking-widest">Expert Registry Insights</p>
                                    <audio ref={audioRef} src={module.narration_url} />
                                    <button onClick={togglePlayback} className="w-full py-6 bg-[#0066FF] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-[#0052cc] transition-all flex items-center justify-center group">
                                        {isPlaying ? <Pause className="w-4 h-4 mr-3 fill-white" /> : <Play className="w-4 h-4 mr-3 fill-white" />}
                                        {isPlaying ? 'Pause' : 'Stream Audio'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'resources' ? (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: 'Certification Curriculum', type: 'Institutional Deck', icon: FileText, size: '4.2 MB' },
                            { title: 'Core Principles PDF', type: 'Clinical Research', icon: FileDown, size: '1.8 MB' },
                            { title: 'Ethics Cheat Sheet', type: 'Visual Guide', icon: FileDown, size: '0.5 MB' }
                        ].map((res, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-lg hover:shadow-blue-50 transition-all group flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <res.icon className="w-8 h-8 text-[#0066FF]" />
                                </div>
                                <h4 className="text-xl font-serif font-bold text-slate-800 mb-2">{res.title}</h4>
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] mb-8">{res.type} • {res.size}</p>
                                <button
                                    onClick={() => handleDownload(res.title)}
                                    className="w-full py-4 bg-stone-50 border border-stone-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-[#0066FF] hover:text-white transition-all flex items-center justify-center"
                                >
                                    <Download className="w-3 h-3 mr-2" /> Download Link
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {!quizState.started ? (
                            <div className="bg-white rounded-[4.5rem] p-16 md:p-24 text-center shadow-2xl border border-white animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner">
                                    <ClipboardCheck className="w-10 h-10 text-[#0066FF]" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">Clinical Assessment</h2>
                                <p className="text-slate-400 text-lg mb-16 max-w-lg mx-auto font-medium leading-relaxed">Verify your mastery of the core pillars. 80% accuracy required for registry indexing.</p>
                                <div className="grid grid-cols-2 gap-8 mb-16 max-w-md mx-auto">
                                    <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100">
                                        <span className="text-3xl font-serif font-bold text-slate-800">80%</span>
                                        <p className="text-[10px] font-black text-slate-300 uppercase mt-1 tracking-widest">Passing Grade</p>
                                    </div>
                                    <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100">
                                        <span className="text-3xl font-serif font-bold text-slate-800">{module.quiz_questions.length}</span>
                                        <p className="text-[10px] font-black text-slate-300 uppercase mt-1 tracking-widest">Questions</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setQuizState(prev => ({ ...prev, started: true }))}
                                    className="w-full py-8 bg-[#0066FF] text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-[#0052cc] transition-all"
                                >
                                    Start Assessment
                                </button>
                            </div>
                        ) : quizState.submitted ? (
                            <div className="bg-white rounded-[4.5rem] p-16 md:p-24 text-center shadow-2xl border border-white animate-in slide-in-from-bottom-8 duration-700">
                                {quizState.score >= module.passing_score ? (
                                    <>
                                        <div className="w-32 h-32 bg-blue-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                            <Trophy className="w-16 h-16 text-[#0066FF]" />
                                        </div>
                                        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Verified Success!</h2>
                                        <p className="text-slate-400 text-xl mb-12 font-medium">Final Score: <span className="text-[#0066FF] font-bold">{quizState.score}%</span></p>
                                        <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 mb-12 max-w-lg mx-auto">
                                            <p className="text-blue-900 font-bold leading-relaxed">Institutional standards met. Your completion record is now available in your profile.</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('learn')}
                                            className="w-full py-8 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-slate-800 transition-all"
                                        >
                                            Return to Curriculum
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-32 h-32 bg-amber-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                            <AlertCircle className="w-16 h-16 text-amber-600" />
                                        </div>
                                        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Evaluation Pending</h2>
                                        <p className="text-slate-400 text-xl mb-12 font-medium">Result: <span className="text-amber-600 font-bold">{quizState.score}%</span></p>
                                        <button
                                            onClick={resetQuiz}
                                            className="w-full py-8 bg-amber-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-amber-700 transition-all flex items-center justify-center"
                                        >
                                            <RefreshCw className="w-5 h-5 mr-4" /> Retry Assessment
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {module.quiz_questions.map((q, idx) => (
                                    <div key={q.id} className="bg-white rounded-[4rem] p-12 md:p-16 shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-10 leading-snug">{q.question}</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {q.options.map((opt, oIdx) => (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleAnswer(q.id, oIdx)}
                                                    className={`p-8 rounded-[2rem] text-left transition-all font-bold border-2 ${quizState.answers[q.id] === oIdx
                                                        ? 'bg-blue-50 border-[#0066FF] text-blue-900'
                                                        : 'bg-white border-stone-50 text-slate-500 hover:border-blue-100'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-12 text-center">
                                    <button
                                        onClick={submitQuiz}
                                        disabled={Object.keys(quizState.answers).length < module.quiz_questions.length}
                                        className={`px-24 py-8 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all ${Object.keys(quizState.answers).length === module.quiz_questions.length
                                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Submit Assessment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NLPContent;
