import React from 'react';
import { Search, Clock, Layout, PlayCircle, BookOpen, CheckCircle, Award, ArrowLeft } from 'lucide-react';

interface CourseOverviewProps {
    onStartModule: () => void;
    onBack: () => void;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ onStartModule, onBack }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-mans-600 font-medium transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
            </button>

            {/* Course Header Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Search className="w-10 h-10 text-amber-600" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">5Whys + Empathy</h1>
                    <div className="flex items-center text-gray-500 mb-4 space-x-4 text-sm">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 45 min</span>
                        <span className="flex items-center"><Layout className="w-4 h-4 mr-1" /> 6 screens</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-100">Therapist</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">Coach</span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">ASHA</span>
                    </div>
                    <button
                        onClick={onStartModule}
                        className="bg-mans-600 hover:bg-mans-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                        Start Learning <PlayCircle className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Learning Objectives */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                            <span className="text-lg">🎯</span>
                        </div>
                        <h3 className="font-bold text-gray-800 tracking-wide uppercase text-sm">Learning Objectives</h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            "Understand sympathy vs empathy difference",
                            "Learn the 5Why sequencing with empathy",
                            "Map the Daily Journey of a patient",
                            "Master Projecting Questions technique",
                            "Practice safe inquiry without interrogation"
                        ].map((obj, i) => (
                            <li key={i} className="flex items-start">
                                <div className="w-5 h-5 rounded border-2 border-gray-200 mr-3 mt-0.5 flex-shrink-0"></div>
                                <span className="text-gray-600">{obj}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    {/* Certification Requirements */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                                <span className="text-lg">🥇</span>
                            </div>
                            <h3 className="font-bold text-gray-800 tracking-wide uppercase text-sm">Certification Requirements</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-900 font-medium">
                                <BookOpen className="w-4 h-4 mr-3 text-amber-500" />
                                Complete all 5 modules
                            </div>
                            <div className="flex items-center p-3 bg-teal-50 rounded-lg border border-teal-100 text-teal-900 font-medium">
                                <CheckCircle className="w-4 h-4 mr-3 text-teal-500" />
                                Pass each module quiz (85%+)
                            </div>
                            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-900 font-medium">
                                <PlayCircle className="w-4 h-4 mr-3 text-indigo-500" />
                                Watch all video lessons
                            </div>
                            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100 text-green-900 font-medium">
                                <Award className="w-4 h-4 mr-3 text-green-500" />
                                Earn MANAS360 Certified Badge
                            </div>
                        </div>
                    </div>

                    {/* Required Roles */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <h3 className="font-bold text-gray-800 tracking-wide uppercase text-sm">Required For Roles</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                            Each module shows which roles must complete it. All roles must pass to receive MANAS360 Certification Badge.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm font-semibold">All Roles</span>
                            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-md text-sm font-semibold">Therapists</span>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm font-semibold">Coaches</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm font-semibold">ASHA Workers</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseOverview;
