import React, { useState } from 'react';
import {
    Search,
    Brain,
    Globe,
    MessageCircle,
    Layout,
    Award,
    Clock,
    CheckCircle,
    PlayCircle,
    ChevronRight,
    Smartphone,
    BookOpen,
    ShieldCheck,
    Flame
} from 'lucide-react';
import { User } from '../trainingTypes';

interface CourseDashboardProps {
    user: User;
    onSelectCourse: (courseId: string) => void;
    onBack: () => void;
    onBuyLeads: () => void;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ user, onSelectCourse, onBack, onBuyLeads }) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string>('5whys');
    const [visitedModules, setVisitedModules] = useState<string[]>(['5whys']);

    // Calculate progress for 5 Whys
    const calculate5WhysProgress = () => {
        const { module1, module2, module3, module4, module5, module6, module7 } = user.progress;
        const total = module1 + module2 + module3 + module4 + module5 + module6 + module7;
        return Math.round(total / 7);
    };

    // Calculate progress for NLP
    const calculateNLPProgress = () => {
        try {
            const saved = localStorage.getItem('nlp_lms_progress');
            if (saved) {
                const parsed = JSON.parse(saved);
                const completedCount = parsed.completedModules?.length || 0;
                return completedCount > 0 ? 100 : 0;
            }
        } catch (e) {
            console.error("Failed to parse NLP progress", e);
        }
        return 0;
    };

    // Calculate progress for CBT
    const calculateCBTProgress = () => {
        try {
            const stored = localStorage.getItem('mindframe_results_v3');
            if (stored) {
                const results = JSON.parse(stored);
                return results.length > 0 ? 100 : 0;
            }
        } catch (e) {
            console.error("Failed to parse CBT results", e);
        }
        return 0;
    };

    const whysProgress = calculate5WhysProgress();
    const nlpProgress = calculateNLPProgress();
    const cbtProgress = calculateCBTProgress();

    const moduleOrder = ['5whys', 'nlp', 'nri', 'cbt', 'dashboard'];

    const handleCourseClick = (courseId: string) => {
        const index = moduleOrder.indexOf(courseId);
        const previousModulesVisited = moduleOrder.slice(0, index).every(id => visitedModules.includes(id));

        if (previousModulesVisited || courseId === '5whys') {
            setSelectedCourseId(courseId);
            if (!visitedModules.includes(courseId)) {
                setVisitedModules(prev => [...prev, courseId]);
            }
        }
    };

    const courses = [
        {
            id: '5whys',
            title: '5Whys + Empathy',
            subtitle: 'Root Cause Inquiry',
            icon: Search,
            color: 'bg-amber-100 text-amber-600',
            borderColor: 'border-amber-200',
            accentColor: 'text-amber-600',
            progress: whysProgress,
            duration: '45 min',
            screens: '5 screens',
            isLocked: false,
            completed: whysProgress === 100,
            lessons: [
                { id: 1, title: 'Sympathy vs Empathy', duration: '5 min', type: 'Core concept' },
                { id: 2, title: 'The 5Why Sequence', duration: '10 min', type: 'Technique' },
                { id: 3, title: 'Daily Journey Mapping', duration: '10 min', type: 'Practice' },
                { id: 4, title: 'Projecting Questions', duration: '10 min', type: 'Advanced' }
            ],
            objectives: [
                "Understand sympathy vs empathy difference",
                "Learn the 5Why sequencing with empathy",
                "Map the Daily Journey of a patient",
                "Master Projecting Questions technique",
                "Practice safe inquiry without interrogation"
            ]
        },
        {
            id: 'nlp',
            title: 'Fundamentals of NLP',
            subtitle: 'Neuro-Linguistic Programming',
            icon: Brain,
            color: 'bg-emerald-100 text-emerald-600',
            borderColor: 'border-emerald-200',
            accentColor: 'text-emerald-600',
            progress: nlpProgress,
            duration: '50 min',
            screens: '6 screens',
            isLocked: !visitedModules.includes('5whys'),
            completed: nlpProgress === 100,
            lessons: [
                { id: 1, title: 'NLP Orientation', duration: '10 min', type: 'Foundation' },
                { id: 2, title: 'Sensory Awareness', duration: '15 min', type: 'Practice' },
                { id: 3, title: 'Outcome Thinking', duration: '10 min', type: 'Cognition' },
                { id: 4, title: 'Rapport Building', duration: '15 min', type: 'Social' }
            ],
            objectives: [
                "Understand sensory acuity",
                "Apply representational systems",
                "Master rapport building",
                "Learn anchoring techniques",
                "Apply meta-model questioning"
            ]
        },
        {
            id: 'nri',
            title: 'NRI Mindset',
            subtitle: 'Diaspora Cultural Context',
            icon: Globe,
            color: 'bg-indigo-100 text-indigo-600',
            borderColor: 'border-indigo-200',
            accentColor: 'text-indigo-600',
            progress: 0,
            duration: '35 min',
            screens: '4 screens',
            isLocked: !visitedModules.includes('nlp'),
            completed: false,
            lessons: [],
            objectives: []
        },
        {
            id: 'cbt',
            title: 'What Good CBT Looks Like',
            subtitle: 'Gold Standard Therapy',
            icon: MessageCircle,
            color: 'bg-purple-100 text-purple-600',
            borderColor: 'border-purple-200',
            accentColor: 'text-purple-600',
            progress: cbtProgress,
            duration: '40 min',
            screens: '8 screens',
            isLocked: !visitedModules.includes('nri'),
            completed: cbtProgress === 100,
            lessons: [
                { id: 1, title: 'Thought Identification', duration: '10 min', type: 'Assessment' },
                { id: 2, title: 'Cognitive Reframing', duration: '15 min', type: 'Intervention' },
                { id: 3, title: 'Behavioral Activation', duration: '10 min', type: 'Practice' },
                { id: 4, title: 'Agenda Setting', duration: '5 min', type: 'Structure' }
            ],
            objectives: [
                "Identify core components of a CBT session",
                "Distinguish thoughts/feelings/behaviors",
                "Structure 50-minute sessions",
                "Master collaborative agenda setting",
                "Apply Socratic questioning"
            ]
        },
        {
            id: 'dashboard',
            title: 'Dashboard & Tools',
            subtitle: 'Platform Navigation',
            icon: Layout,
            color: 'bg-orange-100 text-orange-600',
            borderColor: 'border-orange-200',
            accentColor: 'text-orange-600',
            progress: 0,
            duration: '30 min',
            screens: '4 screens',
            isLocked: !visitedModules.includes('cbt'),
            completed: false,
            lessons: [],
            objectives: []
        }
    ];

    const overallProgress = (visitedModules.length / 5) * 100;
    const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* --- Left Column: Course List --- */}
                <div className="lg:w-1/4 w-full space-y-6">
                    <div>
                        <button
                            onClick={onBack}
                            className="flex items-center text-gray-500 hover:text-mans-600 font-medium transition-colors mb-4 text-sm"
                        >
                            ← Back to Home
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">OnBoarding journey</h1>
                        <p className="text-xs text-gray-500 mb-6">Complete all 5 modules to earn certification</p>

                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall Progress</span>
                                <span className="text-[10px] font-bold text-gray-600">{overallProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-mans-500 h-full transition-all duration-700" style={{ width: `${overallProgress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => handleCourseClick(course.id)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2
                                    ${selectedCourseId === course.id
                                        ? 'bg-amber-50/50 border-amber-200 shadow-sm'
                                        : 'bg-white border-transparent hover:bg-gray-50'
                                    } ${course.isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${course.color} shrink-0`}>
                                        <course.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-[13px] font-bold truncate ${selectedCourseId === course.id ? 'text-amber-900' : 'text-gray-800'}`}>
                                                {course.title}
                                            </h3>
                                            {!course.isLocked && (
                                                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">
                                                    {course.duration}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-0.5">
                                            <p className="text-[11px] text-gray-400 truncate">{course.subtitle}</p>
                                            {selectedCourseId === course.id && (
                                                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-1.5 py-0.5 rounded">Active</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="pt-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Required For Roles</h4>
                        <div className="flex flex-wrap gap-2">
                            {['All Roles', 'Therapists', 'Coaches', 'ASHA Workers'].map((role) => (
                                <span key={role} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors
                                    ${role === 'All Roles' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        role === 'Therapists' ? 'bg-teal-100 text-teal-700 border-teal-200' :
                                            role === 'Coaches' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                                'bg-purple-100 text-purple-700 border-purple-200'}
                                `}>
                                    {role}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                            Each module shows which roles must complete it. All roles must pass to receive MANAS360 Certification Badge.
                        </p>
                    </div>
                </div>

                {/* --- Middle Column: Mobile Preview --- */}
                <div className="lg:w-2/5 w-full flex justify-center">
                    <div className="relative w-[300px] h-[600px] bg-white rounded-[3rem] border-[8px] border-gray-100 shadow-2xl overflow-hidden flex flex-col">
                        {/* Status Bar */}
                        <div className="h-6 w-full px-6 flex justify-between items-center bg-transparent mt-2">
                            <span className="text-[10px] font-bold text-gray-900">9:41</span>
                            <div className="flex gap-1 items-center">
                                <Smartphone className="w-2.5 h-2.5" />
                                <span className="text-[8px] font-bold">87%</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                            <div className="text-center mb-6">
                                <div className={`w-14 h-14 ${activeCourse.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                                    <activeCourse.icon className="w-7 h-7" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 font-serif leading-tight">{activeCourse.title} Framework</h2>
                                <p className="text-[10px] text-gray-500 mt-1 italic">The foundation of deep patient understanding</p>
                            </div>

                            <div className={`p-4 rounded-2xl ${activeCourse.color} bg-opacity-30 border-2 ${activeCourse.borderColor} mb-6`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs">💡</span>
                                    <h4 className="text-[11px] font-bold text-gray-800 tracking-tight">What You'll Learn</h4>
                                </div>
                                <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                                    The integrated {activeCourse.title} approach finds the root cause of a patient's suffering—not just their symptoms. Empathy comes first, always.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {activeCourse.lessons.map((lesson) => (
                                    <div key={lesson.id} className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer shadow-sm">
                                        <div className={`w-8 h-8 rounded-lg ${activeCourse.color} flex items-center justify-center text-[11px] font-bold flex-shrink-0`}>
                                            {lesson.id}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-[11px] font-bold text-gray-800 truncate">{lesson.title}</h5>
                                            <p className="text-[9px] text-gray-400">{lesson.duration} · {lesson.type}</p>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-amber-400" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Bar */}
                        <div className="h-16 border-t border-gray-50 flex items-center justify-around px-2">
                            {[
                                { icon: Smartphone, label: 'home' },
                                { icon: ChevronRight, label: 'back', rotate: 180 },
                                { icon: ChevronRight, label: 'next' },
                                { icon: Award, label: 'profile' }
                            ].map((nav, i) => (
                                <button key={i} className="flex flex-col items-center gap-1 group">
                                    <nav.icon className={`w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors ${nav.rotate ? 'rotate-180' : ''}`} />
                                    <span className="text-[8px] font-black uppercase text-gray-300 group-hover:text-amber-500 tracking-widest">{nav.label}</span>
                                </button>
                            ))}
                        </div>
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-100 rounded-b-2xl flex justify-center items-end pb-1.5">
                            <div className="w-10 h-1 rounded-full bg-gray-200"></div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Details --- */}
                <div className="lg:w-1/3 w-full space-y-6">
                    {/* Course Card Summary */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex gap-4 items-start mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeCourse.color}`}>
                                <activeCourse.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{activeCourse.title}</h3>
                                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 font-medium">
                                    <span>{activeCourse.duration}</span>
                                    <span>·</span>
                                    <span>{activeCourse.screens}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Required for:</h5>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-teal-50 text-teal-600 border border-teal-100 rounded-md text-[9px] font-bold uppercase">Therapist</span>
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[9px] font-bold uppercase">Coach</span>
                                    <span className="px-2 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded-md text-[9px] font-bold uppercase">ASHA</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-bold text-gray-800">Screen 1 of 5</span>
                                <button
                                    onClick={() => onSelectCourse(activeCourse.id)}
                                    className="px-6 py-2 bg-mans-600 hover:bg-mans-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    {activeCourse.completed ? 'Review' : 'Active'} <PlayCircle className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                            <BookOpen className="w-3.5 h-3.5" /> Learning Objectives
                        </h4>
                        <ul className="space-y-4">
                            {activeCourse.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-100 mt-0.5 flex-shrink-0"></div>
                                    <span className="text-[11px] text-gray-500 font-medium leading-relaxed">{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Certification Requirements */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                            <ShieldCheck className="w-3.5 h-3.5" /> Certification Requirements
                        </h4>
                        <div className="space-y-3">
                            {[
                                { text: 'Complete all 5 modules', color: 'bg-amber-100/50 text-amber-900 border-amber-200' },
                                { text: 'Pass each module quiz (85%+)', color: 'bg-teal-100/50 text-teal-900 border-teal-200' },
                                { text: 'Watch all video lessons', color: 'bg-indigo-100/50 text-indigo-900 border-indigo-200' },
                                { text: 'Earn MANAS360 Certified Badge', color: 'bg-green-100/50 text-green-900 border-green-200' }
                            ].map((req, i) => (
                                <div key={i} className={`p-3 rounded-xl border-t-4 ${req.color} text-[11px] font-bold shadow-sm`}>
                                    {req.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Leads</h4>
                            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Ready</span>
                        </div>
                        <button
                            onClick={onBuyLeads}
                            className="w-full group relative overflow-hidden bg-gradient-to-br from-[#0C7C8A] to-[#0A6672] text-white p-4 rounded-2xl font-black text-sm shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                            <span>Buy Leads / Matching Leads →</span>
                            <div className="absolute right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </button>
                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed text-center px-4">
                            Subscribe to a lead plan to start receiving verified patient inquiries today.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseDashboard;
