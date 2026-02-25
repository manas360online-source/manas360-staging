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
    PlayCircle
} from 'lucide-react';
import { User } from '../trainingTypes';
import CourseOverview from './CourseOverview';
import NLPCourseOverview from './NLPCourseOverview';
import CBTCourseOverview from './cbt/CBTCourseOverview';

interface CourseDashboardProps {
    user: User;
    onSelectCourse: (courseId: string) => void;
    onBack: () => void;
    onLogout: () => void;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ user, onSelectCourse, onBack, onLogout }) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const courses = [
        {
            id: '5whys',
            title: '5Whys + Empathy',
            subtitle: 'Root Cause Inquiry',
            icon: Search,
            color: 'bg-amber-100 text-amber-600',
            progress: 100, // Assuming this one is done based on screenshot context or user flow
            duration: '45 min',
            isLocked: false,
            completed: false
        },
        {
            id: 'nlp',
            title: 'Fundamentals of NLP',
            subtitle: 'Neuro-Linguistic Programming',
            icon: Brain,
            color: 'bg-emerald-100 text-emerald-600',
            progress: 100,
            duration: '50 min',
            isLocked: false,
            completed: false
        },
        {
            id: 'nri',
            title: 'NRI Mindset',
            subtitle: 'Diaspora Cultural Context',
            icon: Globe,
            color: 'bg-indigo-100 text-indigo-600',
            progress: 0,
            duration: '35 min',
            isLocked: true,
            completed: false
        },
        {
            id: 'cbt',
            title: 'What Good CBT Looks Like',
            subtitle: 'Gold Standard Therapy',
            icon: MessageCircle,
            color: 'bg-purple-100 text-purple-600',
            progress: 0,
            duration: '40 min',
            isLocked: false,
            completed: false
        },
        {
            id: 'dashboard',
            title: 'Dashboard & Tools',
            subtitle: 'Platform Navigation',
            icon: Layout,
            color: 'bg-orange-100 text-orange-600',
            progress: 0,
            duration: '30 min',
            isLocked: true,
            completed: false
        }
    ];

    const handleCourseClick = (courseId: string) => {
        if (courseId === '5whys' || courseId === 'nlp' || courseId === 'cbt') {
            setSelectedCourseId(courseId);
        } else {
            // Placeholder for other courses
            console.log("Selected course:", courseId);
        }
    };

    const handleStartModule = () => {
        if (selectedCourseId) {
            onSelectCourse(selectedCourseId);
        }
    };

    if (selectedCourseId === '5whys') {
        return (
            <CourseOverview
                onStartModule={handleStartModule}
                onBack={() => setSelectedCourseId(null)}
            />
        );
    }

    if (selectedCourseId === 'nlp') {
        return (
            <NLPCourseOverview
                onStartModule={handleStartModule}
                onBack={() => setSelectedCourseId(null)}
            />
        );
    }

    if (selectedCourseId === 'cbt') {
        return (
            <CBTCourseOverview
                onStartModule={handleStartModule}
                onBack={() => setSelectedCourseId(null)}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-mans-600 font-medium transition-colors mb-4"
                >
                    ← Back to Home
                </button>
                <h1 className="text-3xl font-bold text-gray-900 font-serif mb-2">Learning Journey</h1>
                <div className="flex justify-between items-end">
                    <p className="text-gray-500">Complete all modules to earn certification</p>
                    <div className="text-right">
                        <span className="text-sm font-semibold text-gray-500 block mb-1">Overall Progress</span>
                        <div className="w-48 bg-gray-100 rounded-full h-2">
                            <div className="bg-mans-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <button
                        key={course.id}
                        onClick={() => !course.isLocked && handleCourseClick(course.id)}
                        disabled={course.isLocked}
                        className={`
              relative group text-left p-6 rounded-2xl transition-all duration-300 border-2
              ${course.isLocked
                                ? 'bg-gray-50 border-gray-100 opacity-75 cursor-not-allowed'
                                : 'bg-white border-transparent hover:border-mans-200 hover:shadow-xl hover:-translate-y-1'
                            }
              ${course.id === '5whys' ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
            `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.color} shadow-sm`}>
                                <course.icon className="w-6 h-6" />
                            </div>

                            {course.completed ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Done
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> {course.duration}
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-mans-600 transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{course.subtitle}</p>

                        {!course.isLocked && !course.completed && (
                            <div className="flex items-center text-mans-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Start Module
                            </div>
                        )}

                        {course.id === '5whys' && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <button
                    type="button"
                    onClick={onLogout}
                    className="px-5 py-2 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default CourseDashboard;
