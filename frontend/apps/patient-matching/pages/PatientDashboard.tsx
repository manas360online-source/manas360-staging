import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Calendar, FileText, Lock, DollarSign, ArrowLeft, Stethoscope, ArrowRight, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Replicating Questions and Options to display report
const QUESTIONS = [
    { id: 'q1', text: "Little interest or pleasure in doing things?" },
    { id: 'q2', text: "Feeling down, depressed, or hopeless?" },
    { id: 'q3', text: "Trouble falling or staying asleep, or sleeping too much?" },
    { id: 'q4', text: "Feeling tired or having little energy?" },
    { id: 'q5', text: "Feeling nervous, anxious, or on edge?" },
];

const ANSWER_LABELS: Record<number, string> = {
    0: 'Not at all',
    1: 'Several days',
    2: 'More than half the days',
    3: 'Nearly every day'
};

export const PatientDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { patients, currentUserId } = useApp();
    const currentUser = patients.find(p => p.id === currentUserId);
    const [showReport, setShowReport] = useState(false);

    // Redirect if no user found
    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-lg font-bold text-slate-800 mb-3">No active session found.</h2>
                <Button onClick={() => navigate('/')} className="text-sm py-2 px-4">Return Home</Button>
            </div>
        )
    }

    // View: Referral Accepted by Psychiatrist (Request Sent), Pending Patient Booking
    if (currentUser.referralStatus === 'Accepted' && !currentUser.isBooked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-50">
                    <div className="w-16 h-16 bg-blue-100 text-[#1d74f5] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope size={28} />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-slate-800 mb-2 leading-snug">
                        Referral to Psychiatrist
                    </h2>

                    <div className="bg-slate-50 p-4 rounded-xl mb-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Referred By</p>
                        <h3 className="font-serif font-bold text-slate-800 text-lg">Dr. Sanky</h3>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                            Your sessions will be forwarded to a psychiatrist. Please continue by booking a psychiatrist session.
                        </p>
                    </div>

                    <Button fullWidth onClick={() => navigate('/select-psychiatrist')} className="text-base py-3 rounded-xl">
                        Connect to Psychiatrist
                    </Button>

                    <div className="mt-4">
                        <button onClick={() => window.location.hash = '#/home'} className="text-slate-400 hover:text-[#1d74f5] font-medium text-sm">
                            Skip to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Gated Access: Must be booked
    if (!currentUser.isBooked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-blue-50">
                    <Lock size={32} className="text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">Dashboard Locked</h2>
                    <p className="text-slate-500 text-sm mb-6">You need to book a session to access your care dashboard.</p>
                    <Button onClick={() => navigate('/assessment/start')} className="w-full py-2 text-sm rounded-xl">Take Assessment & Book</Button>

                    <div className="mt-4">
                        <button onClick={() => window.location.hash = '#/home'} className="text-slate-400 hover:text-[#1d74f5] font-medium text-xs">
                            Skip to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // VIEW: FULL REPORT
    if (showReport) {
        return (
            <div className="max-w-3xl mx-auto py-6 px-4">
                <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-[#1d74f5] flex items-center gap-2 mb-6">
                    <ArrowLeft size={16} /> <span className="text-sm font-bold">Back to Dashboard</span>
                </button>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-serif text-xl font-bold text-slate-800 mb-4">Full Assessment Report</h2>
                    <div className="space-y-4">
                        {QUESTIONS.map((q) => {
                            const score = currentUser.answers?.[q.id];
                            return (
                                <div key={q.id} className="border-b border-slate-50 pb-3 last:border-0">
                                    <p className="font-medium text-slate-700 mb-1 text-sm">{q.text}</p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-400">Your answer:</span>
                                        <span className="font-bold text-[#1d74f5]">
                                            {score !== undefined ? ANSWER_LABELS[score] : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    // VIEW: DASHBOARD
    const currentScore = currentUser.phq9Score || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="-ml-3 mb-4">
                <button
                    onClick={() => navigate('/assessment/start', { state: { showComplete: true } })}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#1d74f5] transition-colors group px-3 py-2 rounded-xl hover:bg-blue-50"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-serif font-bold text-lg">Back</span>
                </button>
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-800">Hello, {currentUser.name.split(' ')[0]}</h1>

            {/* Booked Session Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-bl-lg">
                    CONFIRMED
                </div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    Your Upcoming Session
                </h2>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {currentUser.bookedDoctorRole === 'Psychologist' ? '👩‍⚕️' : '👨‍⚕️'}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900">{currentUser.bookedDoctorName}</h3>
                        <p className="text-[#1d74f5] font-bold uppercase tracking-wider text-xs mb-3">{currentUser.bookedDoctorRole}</p>

                        <div className="grid md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-400" size={18} />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Date & Time</p>
                                    <p className="font-semibold text-slate-800 text-sm">{currentUser.bookingDate} • {currentUser.bookingTime}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-slate-400" size={18} />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Amount Paid</p>
                                    <p className="font-semibold text-slate-800 text-sm">₹{currentUser.amountPaid}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress & Assessment Section */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-lg">Assessment Results</h3>
                    <FileText className="text-slate-400" size={18} />
                </div>

                <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-600 font-medium">PHQ-9 Score (Depression)</span>
                            <span className="font-bold text-[#1d74f5]">{currentScore}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full">
                            <div className="bg-[#1d74f5] h-full rounded-full" style={{ width: `${Math.min(100, currentScore * 3.7)}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5">
                            Result: {currentScore >= 20 ? 'Critical' : currentScore >= 15 ? 'Severe' : 'Moderate'}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="text-xs py-2 px-3 h-auto rounded-lg" onClick={() => setShowReport(true)}>View Full Report</Button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4 gap-4">
                <Button
                    onClick={() => window.location.hash = '#/video-session'}
                    className="text-base px-8 py-3 bg-[#1d74f5] text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 rounded-xl font-bold flex items-center gap-2"
                >
                    <Video size={20} />
                    Video Session
                </Button>

                <Button
                    onClick={() => window.location.hash = '#/home'}
                    className="text-base px-8 py-3 bg-[#1d74f5] text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 rounded-xl font-bold"
                >
                    Skip to Home
                </Button>
            </div>
        </div>
    );
};