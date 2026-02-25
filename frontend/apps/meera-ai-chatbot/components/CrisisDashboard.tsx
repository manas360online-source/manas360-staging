
import React, { useState, useMemo } from 'react';
import {
   ShieldAlert, Phone, MessageSquare, Activity, AlertCircle,
   MapPin, Info, ArrowLeft, ChevronRight, User, Stethoscope,
   Moon, Battery, Zap, ClipboardCheck, TrendingUp, Search,
   Bell, LogOut, X, FileText, Calendar, Clock, AlertTriangle,
   Play, ArrowRight, Heart
} from 'lucide-react';
import { EMERGENCY_RESOURCES } from '../constants';
import MessageBubble from './MessageBubble';
import { Message, Role } from '../types';

interface CrisisDashboardProps {
   onBack: () => void;
   mitraChat: {
      messages: Message[];
      onSendMessage: (text: string) => void;
      isLoading: boolean;
   };
}

const PHQ9_QUESTIONS = [
   "Little interest or pleasure in doing things",
   "Feeling down, depressed, or hopeless",
   "Trouble falling or staying asleep, or sleeping too much",
   "Feeling tired or having little energy",
   "Poor appetite or overeating",
   "Feeling bad about yourself — or that you are a failure",
   "Trouble concentrating on things",
   "Moving/speaking slowly or being restless",
   "Thoughts of hurting yourself or that you'd be better off dead"
];

const SCALES = ["Not at all", "Several days", "More than half", "Nearly every day"];

const CrisisDashboard: React.FC<CrisisDashboardProps> = ({ onBack, mitraChat }) => {
   const [mode, setMode] = useState<'landing' | 'patient' | 'clinical'>('landing');

   // Patient Flow State
   const [patientStep, setPatientStep] = useState<'reg' | 'wellness' | 'phq9' | 'hub'>('reg');
   const [patientData, setPatientData] = useState({ name: '', age: '', dob: '', id: '10223' });
   const [wellnessLog, setWellnessLog] = useState({ sleep: 7, sleepQual: 2, energy: 1, stress: 2 });
   const [phq9Answers, setPhq9Answers] = useState<number[]>(new Array(9).fill(0));
   const [activeTab, setActiveTab] = useState<'checkin' | 'chat' | 'tracking'>('checkin');

   // Clinical State
   const [showReport, setShowReport] = useState<string | null>(null);

   const phq9Score = useMemo(() => phq9Answers.reduce((a, b) => a + b, 0), [phq9Answers]);

   // RENDER: LANDING
   if (mode === 'landing') {
      return (
         <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest">
               <ArrowLeft size={16} /> Back to Hub
            </button>

            <div className="mb-12">
               <div className="w-16 h-16 bg-[#e91e63] rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg mx-auto mb-6">M</div>
               <h1 className="text-4xl font-black text-[#0f172a] mb-2">Manas360</h1>
               <p className="text-slate-400 font-bold">Mental Wellness Platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
               <button
                  onClick={() => setMode('patient')}
                  className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 text-left hover:scale-[1.02] transition-all group"
               >
                  <User size={48} className="text-[#512da8] mb-8" />
                  <h2 className="text-2xl font-black text-slate-800 mb-4">Patient Portal</h2>
                  <p className="text-slate-400 text-sm font-medium mb-12">Access clinical assessments, wellness tracking, and support chat.</p>
                  <div className="text-[#e91e63] font-black text-sm flex items-center gap-2">
                     Enter Portal <ArrowRight size={18} />
                  </div>
               </button>

               <button
                  onClick={() => setMode('clinical')}
                  className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 text-left hover:scale-[1.02] transition-all group"
               >
                  <Stethoscope size={48} className="text-[#512da8] mb-8" />
                  <h2 className="text-2xl font-black text-slate-800 mb-4">Clinical Dashboard</h2>
                  <p className="text-slate-400 text-sm font-medium mb-12">Real-time surveillance dashboard with automated triage and demographics.</p>
                  <div className="text-[#e91e63] font-black text-sm flex items-center gap-2">
                     Launch Platform <ArrowRight size={18} />
                  </div>
               </button>
            </div>
         </div>
      );
   }

   // RENDER: PATIENT FLOW
   if (mode === 'patient') {
      // Registration
      if (patientStep === 'reg') {
         return (
            <div className="flex-1 bg-slate-50 flex items-center justify-center p-6">
               <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-lg">
                  <h2 className="text-3xl font-serif text-[#0f172a] mb-8">Patient Registration</h2>
                  <div className="space-y-6 mb-10">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                        <input
                           type="text"
                           placeholder="e.g. Sanky"
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#2962ff]"
                           value={patientData.name}
                           onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Age</label>
                           <input
                              type="number"
                              placeholder="25"
                              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#2962ff]"
                              value={patientData.age}
                              onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">DOB</label>
                           <input
                              type="date"
                              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#2962ff]"
                              value={patientData.dob}
                              onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                           />
                        </div>
                     </div>
                  </div>
                  <button
                     onClick={() => patientData.name && setPatientStep('wellness')}
                     className="w-full bg-[#2962ff] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all"
                  >
                     Start Wellness Session
                  </button>
               </div>
            </div>
         );
      }

      // Wellness Center Step 1
      if (patientStep === 'wellness') {
         return (
            <div className="flex-1 bg-slate-50 flex items-center justify-center p-6">
               <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-4xl relative">
                  <div className="flex justify-between items-center mb-12">
                     <div>
                        <h2 className="text-4xl font-serif text-[#0f172a] mb-2">Wellness Center</h2>
                        <p className="text-[#2962ff] text-[10px] font-black uppercase tracking-widest">Active: {patientData.name.toUpperCase()} ({patientData.id})</p>
                     </div>
                     <div className="flex bg-slate-100 p-1 rounded-full">
                        <button className="bg-[#2962ff] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Daily Log</button>
                        <button className="text-slate-300 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">AI Support</button>
                     </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-12">
                     <h3 className="text-3xl font-serif text-[#0f172a]">Let's start with you, {patientData.name.toLowerCase()}</h3>
                     <span className="text-[#2962ff] text-[10px] font-black uppercase tracking-widest">Step 1 of 3</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-16">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Hours of Sleep</label>
                        <input
                           type="range"
                           min="0" max="12" step="1"
                           className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2962ff]"
                           value={wellnessLog.sleep}
                           onChange={(e) => setWellnessLog({ ...wellnessLog, sleep: parseInt(e.target.value) })}
                        />
                        <div className="flex justify-between mt-4">
                           <span className="text-[10px] font-black text-slate-300 uppercase">0 hrs</span>
                           <span className="text-sm font-black text-[#2962ff]">{wellnessLog.sleep} HRS</span>
                           <span className="text-[10px] font-black text-slate-300 uppercase">12+ hrs</span>
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Energy Level</label>
                        <div className="flex gap-3">
                           {[1, 2, 3, 4, 5].map(val => (
                              <button
                                 key={val}
                                 onClick={() => setWellnessLog({ ...wellnessLog, energy: val })}
                                 className={`w-12 h-12 rounded-2xl font-bold transition-all ${wellnessLog.energy === val ? 'bg-[#2962ff] text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-100 text-slate-300'}`}
                              >{val}</button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Sleep Quality</label>
                        <div className="flex gap-3">
                           {[1, 2, 3, 4, 5].map(val => (
                              <button
                                 key={val}
                                 onClick={() => setWellnessLog({ ...wellnessLog, sleepQual: val })}
                                 className={`w-12 h-12 rounded-2xl font-bold transition-all ${wellnessLog.sleepQual === val ? 'bg-[#2962ff] text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-100 text-slate-300'}`}
                              >{val}</button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Stress Intensity</label>
                        <div className="flex gap-3">
                           {[1, 2, 3, 4, 5].map(val => (
                              <button
                                 key={val}
                                 onClick={() => setWellnessLog({ ...wellnessLog, stress: val })}
                                 className={`w-12 h-12 rounded-2xl font-bold transition-all ${wellnessLog.stress === val ? 'bg-[#2962ff] text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-100 text-slate-300'}`}
                              >{val}</button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end">
                     <button
                        onClick={() => setPatientStep('phq9')}
                        className="bg-[#2962ff] text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-3 active:scale-95 transition-all"
                     >
                        Continue <ArrowRight size={20} />
                     </button>
                  </div>
               </div>
            </div>
         );
      }

      // PHQ-9 & Hub Navigation
      return (
         <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white">
               <h1 className="text-2xl font-black text-[#0f172a] mb-1">Patient Wellness Center</h1>
               <p className="text-slate-400 text-xs font-medium">Monitoring wellness for {patientData.name.toLowerCase()}</p>

               <div className="flex gap-10 mt-8 border-b border-slate-50">
                  {[
                     { id: 'checkin', label: 'Daily Check-in', icon: <ClipboardCheck size={16} /> },
                     { id: 'chat', label: 'AI Support Chat', icon: <MessageSquare size={16} /> },
                     { id: 'tracking', label: 'Progress Tracking', icon: <TrendingUp size={16} /> }
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'border-[#2962ff] text-[#2962ff]' : 'border-transparent text-slate-300 hover:text-slate-400'}`}
                     >
                        {tab.icon}
                        {tab.label}
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               {activeTab === 'checkin' && (
                  <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-slate-50">
                     <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl">📋</span>
                        <h2 className="text-xl font-black text-[#0f172a]">PHQ-9 Mental Health Assessment</h2>
                     </div>
                     <p className="text-slate-400 text-sm mb-10 italic">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>

                     <div className="space-y-8 mb-12">
                        {PHQ9_QUESTIONS.map((q, qIdx) => (
                           <div key={qIdx} className="space-y-4">
                              <p className="font-bold text-slate-800 text-[15px]"><span className="text-[#2962ff] mr-2">{qIdx + 1}.</span> {q}</p>
                              <div className="flex flex-wrap gap-2">
                                 {SCALES.map((scale, sIdx) => (
                                    <button
                                       key={sIdx}
                                       onClick={() => {
                                          const newAnswers = [...phq9Answers];
                                          newAnswers[qIdx] = sIdx;
                                          setPhq9Answers(newAnswers);
                                       }}
                                       className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${phq9Answers[qIdx] === sIdx ? 'bg-[#512da8] text-white border-[#512da8]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                                    >
                                       {scale}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>

                     <button
                        onClick={() => setActiveTab('chat')}
                        className="w-full bg-[#512da8] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-100 transition-all active:scale-95"
                     >
                        Submit Assessment
                     </button>
                  </div>
               )}

               {activeTab === 'chat' && (
                  <div className="max-w-4xl mx-auto h-full flex flex-col bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden">
                     <div className="bg-[#512da8] p-5 text-white">
                        <h3 className="font-black text-sm">AI Wellness Companion</h3>
                        <p className="text-[10px] text-purple-200 uppercase font-bold tracking-widest">Confidential Support Chat</p>
                     </div>
                     <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                        {mitraChat.messages.map(m => <MessageBubble key={m.id} message={m} mode="text" />)}
                        {mitraChat.isLoading && (
                           <div className="flex justify-start">
                              <div className="bg-slate-50 px-4 py-2 rounded-2xl rounded-tl-none animate-pulse text-slate-400 text-xs font-bold">Meera is typing...</div>
                           </div>
                        )}
                     </div>
                     <div className="p-4 border-t border-slate-50 flex gap-2">
                        <input
                           type="text"
                           placeholder="Share what's on your mind..."
                           className="flex-1 bg-slate-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#512da8]"
                           onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                 mitraChat.onSendMessage(e.currentTarget.value);
                                 e.currentTarget.value = '';
                              }
                           }}
                        />
                        <button className="bg-[#512da8] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">Send</button>
                     </div>
                  </div>
               )}

               {activeTab === 'tracking' && (
                  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[2rem] shadow-xl border border-slate-50">
                     <h2 className="text-2xl font-black text-[#0f172a] mb-12">Clinical Outcome & Progress</h2>

                     <div className="grid grid-cols-2 gap-12">
                        <div>
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">PHQ-9 History</h4>
                           <div className="h-48 flex items-end gap-2 bg-slate-50/50 p-4 rounded-2xl">
                              {/* Simulated Chart Bars */}
                              {[12, 18, 15, phq9Score].map((score, i) => (
                                 <div key={i} className="flex-1 bg-indigo-100 rounded-t-lg relative group">
                                    <div
                                       className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000 ${i === 3 ? 'bg-indigo-600' : 'bg-indigo-300'}`}
                                       style={{ height: `${(score / 27) * 100}%` }}
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Wellness Trends</h4>
                           <div className="bg-[#512da8] p-8 rounded-[2rem] text-white">
                              <p className="text-sm font-bold mb-2">Latest Wellness Averages</p>
                              <p className="text-xs text-purple-200">Complete your daily log to see trends.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      );
   }

   // RENDER: CLINICAL DASHBOARD (THERAPIST)
   if (mode === 'clinical') {
      return (
         <div className="flex-1 bg-slate-50 flex overflow-hidden">
            {/* Main Panel */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
               <header className="flex justify-between items-center mb-10">
                  <div>
                     <h1 className="text-2xl font-black text-[#0f172a]">Clinical Assessments Repository</h1>
                     <p className="text-slate-400 text-xs font-medium">Monitoring platform sentiment and critical cases</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <Bell size={20} className="text-slate-400" />
                        <div className="w-10 h-10 bg-slate-100 rounded-full" />
                     </div>
                  </div>
               </header>

               <div className="grid grid-cols-3 gap-6 mb-12">
                  {[
                     { label: 'Platform Sentiment', value: '42.5', trend: '5.2%', trendUp: true },
                     { label: 'Active Surveillance', value: '128', sub: 'Assigned Cases' },
                     { label: 'Detection Precision', value: '92.4%', tag: 'Gemini AI' }
                  ].map((stat, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                        <div className="flex items-baseline gap-4">
                           <span className="text-4xl font-black text-[#0f172a] tracking-tight">{stat.value}</span>
                           {stat.trend && <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-bold">{stat.trend}</span>}
                        </div>
                        {stat.sub && <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest text-right">{stat.sub}</p>}
                        {stat.tag && <div className="absolute top-8 right-8 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-blue-100">{stat.tag}</div>}
                     </div>
                  ))}
               </div>

               <div className="space-y-8">
                  <section>
                     <h3 className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> Immediate Attention
                     </h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-red-50 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-red-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient #P-5481</p>
                                 <h4 className="text-xl font-black text-[#0f172a]">John Smith</h4>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">Age: 34</p>
                              </div>
                              <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">Critical</span>
                           </div>
                           <div className="flex gap-12 mb-8">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">PHQ-9 Score</p>
                                 <p className="text-2xl font-black text-[#0f172a]">21</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stress Lvl</p>
                                 <p className="text-2xl font-black text-[#0f172a]">5/5</p>
                              </div>
                           </div>
                           <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                              <span className="text-[10px] font-bold text-slate-300">2/13/2026</span>
                              <button
                                 onClick={() => setShowReport('John Smith')}
                                 className="text-[#2962ff] text-[10px] font-black uppercase tracking-widest hover:underline"
                              >View Full Details</button>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section>
                     <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300" /> Standard Monitoring
                     </h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 opacity-60">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient #P-ZJCT</p>
                                 <h4 className="text-xl font-black text-[#0f172a]">Sanky</h4>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">Age: 25</p>
                              </div>
                           </div>
                           <div className="flex gap-12 mb-8">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">PHQ-9 Score</p>
                                 <p className="text-2xl font-black text-[#0f172a]">{phq9Score}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stress Lvl</p>
                                 <p className="text-2xl font-black text-[#0f172a]">{wellnessLog.stress}/5</p>
                              </div>
                           </div>
                           <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                              <span className="text-[10px] font-bold text-slate-300">2/13/2026</span>
                              <button className="text-[#2962ff] text-[10px] font-black uppercase tracking-widest">View Full Details</button>
                           </div>
                        </div>
                     </div>
                  </section>
               </div>
            </div>

            {/* Sidebar Triage */}
            <aside className="w-96 bg-white p-8 border-l border-slate-100 flex flex-col shadow-2xl">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="flex items-center gap-2 font-black text-xl text-slate-800">
                     <Heart className="text-red-600" fill="currentColor" size={24} /> Emergency Triage
                  </h2>
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-red-100">Live</span>
               </div>

               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Monitoring 1 Pending Cases</p>

               <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-4 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">Critical Urgency</span>
                     <span className="text-[10px] text-slate-400 font-mono">12:22 PM</span>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-lg">JS</div>
                     <div>
                        <h4 className="font-black text-sm text-slate-800">John Smith</h4>
                        <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider">Stress: 5/5 • Energy: 2/5</p>
                     </div>
                  </div>

                  <button className="w-full bg-[#e91e63] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:bg-[#c2185b] active:scale-95 transition-all">
                     Intercept Now
                  </button>
               </div>

               <div className="mt-auto pt-8 border-t border-slate-100">
                  <button onClick={() => setMode('landing')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-xs font-black uppercase tracking-widest">
                     <LogOut size={16} /> Sign Out
                  </button>
               </div>
            </aside>

            {/* Report Modal */}
            {showReport && (
               <div className="fixed inset-0 z-50 bg-slate-100/80 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border border-slate-200">
                     <button onClick={() => setShowReport(null)} className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <X size={24} />
                     </button>

                     <div className="p-12">
                        <div className="flex items-center gap-4 mb-10">
                           <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                              <FileText size={28} />
                           </div>
                           <div>
                              <h2 className="text-2xl font-black text-[#0f172a]">Clinical Assessment Report: {showReport}</h2>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Record ID: p-5481 • Age: 34 • DOB: 12/04/1990</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                           <section>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Risk Architecture</h4>
                              <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center gap-8 border border-slate-100 shadow-inner">
                                 <div className="w-24 h-24 rounded-full border-[6px] border-red-600 flex flex-col items-center justify-center">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Score</span>
                                    <span className="text-2xl font-black text-slate-800">75</span>
                                 </div>
                                 <div>
                                    <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mb-2 inline-block">Critical Priority</span>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Composite risk derived from standardized testing and behavioral patterns.</p>
                                 </div>
                              </div>
                           </section>

                           <section>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Standardized Scores</h4>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <div>
                                       <p className="text-sm font-black text-slate-800">PHQ-9 (Depression)</p>
                                       <p className="text-[9px] text-slate-400 uppercase font-bold">Standard clinical diagnostic</p>
                                    </div>
                                    <span className="text-xl font-black text-blue-600">19</span>
                                 </div>
                                 <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800">
                                    <div className="flex justify-between items-center mb-1">
                                       <p className="text-sm font-bold">Item #9 Response</p>
                                       <span className="text-xl font-black text-red-600">1</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold">Self-harm indicator</p>
                                 </div>
                              </div>
                           </section>

                           <section>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Daily Wellness Log</h4>
                              <div className="grid grid-cols-2 gap-4">
                                 {[
                                    { label: 'Sleep', val: '4 hrs' },
                                    { label: 'Energy', val: '2/5' },
                                    { label: 'Stress', val: '5/5' },
                                    { label: 'Sleep Quality', val: '1/5' }
                                 ].map((log, i) => (
                                    <div key={i} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                       <p className="text-[9px] font-black text-[#2962ff] uppercase mb-1">{log.label}</p>
                                       <p className="text-lg font-black text-slate-800">{log.val}</p>
                                    </div>
                                 ))}
                              </div>
                           </section>

                           <section>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">AI Detection Insights</h4>
                              <div className="p-6 bg-white border border-dashed border-slate-200 rounded-[2rem]">
                                 <p className="text-xs text-slate-500 leading-relaxed italic">
                                    "System detected consistent low energy levels and elevated stress intensity compared to historical baseline. High priority monitoring recommended."
                                 </p>
                              </div>
                           </section>
                        </div>

                        <div className="mt-16 flex flex-col gap-6">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Action Plan</h4>
                           <div className="grid grid-cols-2 gap-6">
                              <button className="w-full bg-white border border-slate-200 text-slate-800 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">
                                 Send Patient Follow-up
                              </button>
                              <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 transition-all active:scale-95">
                                 Schedule Emergency Session
                              </button>
                           </div>
                        </div>

                        <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">HIPAA Compliant Record</span>
                           <button onClick={() => setShowReport(null)} className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Close Report</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      );
   }

   return null;
};

export default CrisisDashboard;
