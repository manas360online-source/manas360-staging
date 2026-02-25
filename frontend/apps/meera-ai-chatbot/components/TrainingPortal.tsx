
import React, { useState, useEffect, useMemo } from 'react';
import { TRAINING_MODULES, MODULE_QUIZZES } from '../constants';
import { TrainingModule, TherapistProfile, Certification, QuizAttempt } from '../types';
import { BookOpen, GraduationCap, Play, CheckCircle2, Award, Clock, Printer, ChevronLeft, ArrowRight, Lock, History, ShieldCheck, BadgeCheck, AlertCircle, RotateCcw, X } from 'lucide-react';
import QuizInterface from './QuizInterface';

interface TrainingPortalProps {
  profile: TherapistProfile;
  onUpdateProfile: (profile: TherapistProfile) => void;
}

const PASS_THRESHOLD = 85;
const RETAKE_WAIT_MS = 60 * 1000;

const TrainingPortal: React.FC<TrainingPortalProps> = ({ profile, onUpdateProfile }) => {
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCert, setShowCert] = useState<Certification | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);

  useEffect(() => {
    if (!activeModule) return;
    const attempt = profile.quizAttempts[activeModule.id];
    if (attempt && attempt.score < PASS_THRESHOLD) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, RETAKE_WAIT_MS - (Date.now() - attempt.timestamp));
        setCooldownTime(remaining);
        if (remaining === 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCooldownTime(0);
    }
  }, [activeModule, profile.quizAttempts]);

  const startModule = (module: TrainingModule) => {
    setActiveModule(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getModuleStatus = (module: TrainingModule) => {
    const isCompleted = profile.certifications.some(c => c.moduleCode === module.code);
    const progress = profile.trainingProgress[module.id] || 0;
    const attempt = profile.quizAttempts[module.id];

    return { isCompleted, progress, attempt };
  };

  const completeQuiz = (score: number) => {
    if (!activeModule) return;
    const passed = score >= PASS_THRESHOLD;
    const modulePrefix = activeModule.code.toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const certNumber = `MITRA-${modulePrefix}-${year}-${seq}`;

    let newCertifications = [...profile.certifications];
    if (passed) {
      const cert: Certification = {
        id: `cert-${Date.now()}`,
        moduleCode: activeModule.code,
        title: activeModule.title,
        issuedAt: Date.now(),
        certNumber,
        score
      };
      newCertifications.push(cert);
    }

    const updatedProfile: TherapistProfile = {
      ...profile,
      isCertified: newCertifications.length > 0,
      trainingProgress: {
        ...profile.trainingProgress,
        [activeModule.id]: passed ? 100 : (profile.trainingProgress[activeModule.id] || 0)
      },
      certifications: newCertifications,
      quizAttempts: {
        ...profile.quizAttempts,
        [activeModule.id]: { timestamp: Date.now(), score }
      }
    };

    onUpdateProfile(updatedProfile);
    setShowQuiz(false);
  };

  const canRetake = (moduleId: string) => {
    const attempt = profile.quizAttempts[moduleId];
    if (!attempt) return true;
    if (attempt.score >= PASS_THRESHOLD) return false;
    return (Date.now() - attempt.timestamp) >= RETAKE_WAIT_MS;
  };

  return (
    <div className="flex-1 bg-[#f0f7ff] overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto">

        {!activeModule ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Therapist Dashboard</h2>
              </div>
              <div className="flex gap-3">
                <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1068eb] shadow-inner">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certs</p>
                    <p className="text-xl font-black text-slate-800">{profile.certifications.length}</p>
                  </div>
                </div>
                <div className="bg-[#1068eb] px-6 py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 flex items-center gap-4 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                    <BadgeCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Verified</p>
                    <p className="text-xl font-black">{profile.isCertified ? 'YES' : 'NO'}</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-12">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <BookOpen size={18} className="text-[#1068eb]" />
                Available Training Modules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TRAINING_MODULES.map(module => {
                  const { isCompleted, progress, attempt } = getModuleStatus(module);
                  const isFailed = attempt && attempt.score < PASS_THRESHOLD;

                  return (
                    <div key={module.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors shadow-inner">
                        <img src={module.badgeUrl} alt="" className="w-10 h-10 object-contain" />
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-2 leading-tight">{module.title}</h4>
                      <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3 leading-relaxed font-medium">
                        {module.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                            <Clock size={14} />
                            {module.durationMinutes} mins
                          </div>
                          {isCompleted ? (
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase border border-emerald-100">Certified</span>
                          ) : isFailed ? (
                            <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg uppercase border border-red-100">Failed ({attempt.score}%)</span>
                          ) : (
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase border border-blue-100">{progress}% Progress</span>
                          )}
                        </div>
                        <button
                          onClick={() => startModule(module)}
                          className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-tight transition-all active:scale-95 flex items-center justify-center gap-2 ${isCompleted
                              ? 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                              : isFailed ? 'bg-slate-800 text-white' : 'bg-[#1068eb] text-white hover:bg-[#0d56c4] shadow-lg shadow-blue-100'
                            }`}
                        >
                          {isCompleted ? 'Review Module' : isFailed ? 'Retake Exam' : (progress > 0 ? 'Resume Training' : 'Enroll Now')}
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {profile.certifications.length > 0 && (
              <section>
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <Award size={18} className="text-[#1068eb]" />
                  Your Professional Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications.map(cert => (
                    <div key={cert.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                          <Award size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-800">{cert.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">{cert.certNumber}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCert(cert)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-[#1068eb] hover:bg-blue-50 rounded-2xl transition-all"
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <button
              onClick={() => setActiveModule(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-[#1068eb] font-black text-sm mb-10 transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO DASHBOARD
            </button>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden mb-12">
              <div className="p-10 md:p-16">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-[#1068eb] shadow-inner">
                        <BookOpen size={32} />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{activeModule.title}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Module Code: {activeModule.code}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    {activeModule.sections.map((section, idx) => (
                      <div key={section.id} className="relative pl-14">
                        {idx < activeModule.sections.length - 1 && (
                          <div className="absolute left-6 top-10 bottom-[-3rem] w-0.5 bg-slate-100" />
                        )}
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 font-black text-lg">
                          {idx + 1}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-4">{section.title}</h3>
                        <div className="text-slate-500 text-[16px] leading-relaxed font-medium">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-20 p-10 bg-blue-50 border border-blue-100 rounded-[2.5rem] text-slate-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600 rotate-12 scale-150">
                      <GraduationCap size={160} />
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-2 tracking-tight">Certification Examination</h3>
                      <p className="text-slate-500 font-medium mb-8 max-w-md">
                        Standardized evaluation. Requires <strong>85%</strong> to pass. If failed, a 1-minute mandatory review period is enforced.
                      </p>

                      {!profile.certifications.some(c => c.moduleCode === activeModule.code) ? (
                        canRetake(activeModule.id) ? (
                          <button
                            onClick={() => setShowQuiz(true)}
                            className="bg-[#1068eb] text-white font-black px-10 py-4 rounded-2xl hover:bg-[#0d56c4] shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-3"
                          >
                            <Play size={18} fill="currentColor" />
                            {profile.quizAttempts[activeModule.id] ? 'Retake Exam' : 'Start Examination'}
                          </button>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center gap-4">
                              <RotateCcw size={20} className="text-red-400 animate-spin-slow" />
                              <div>
                                <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Cooldown Active</p>
                                <p className="text-xs text-slate-500">Please review the materials. Retake available in {Math.ceil(cooldownTime / 1000)}s.</p>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
                          <CheckCircle2 size={24} className="text-emerald-500" />
                          <div>
                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Module Complete</p>
                            <p className="text-xs text-slate-500">You are officially certified in this domain.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQuiz && activeModule && (
          <QuizInterface
            quizTitle={activeModule.title}
            questions={MODULE_QUIZZES[activeModule.id] || []}
            onComplete={completeQuiz}
            onCancel={() => setShowQuiz(false)}
          />
        )}

        {showCert && (
          <div className="fixed inset-0 z-[100] bg-slate-100/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-[1rem] shadow-2xl border-[12px] border-slate-50 relative animate-in zoom-in-95 duration-500 overflow-hidden group">

              {/* Background Texture Curves (LIGHT) */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-5 pointer-events-none">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  <path d="M0 500 C 200 400 400 450 600 350 C 800 250 900 300 1000 200 L 1000 500 Z" fill="#b8860b" />
                </svg>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowCert(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all z-20"
              >
                <X size={20} />
              </button>

              <div className="p-12 md:p-16 relative z-10">
                {/* QR Code Placeholder */}
                <div className="absolute top-12 right-12 w-16 h-16 bg-white p-1 rounded-sm border border-slate-100">
                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MITRA-VERIFIED')] bg-cover opacity-80" />
                </div>

                {/* Main Content */}
                <div className="text-center">
                  <h2 className="text-[#8b4513] text-5xl md:text-6xl font-serif font-medium tracking-tight mb-2 uppercase">Certificate</h2>
                  <h3 className="text-[#a0522d] text-2xl md:text-3xl font-serif tracking-[0.2em] mb-12 uppercase">of Completion</h3>

                  <p className="text-slate-500 text-xl font-medium mb-12">This is to certify that</p>

                  <h1 className="text-[#8b4513] text-6xl md:text-8xl font-['Great_Vibes'] mb-12 py-4">
                    {profile.name}
                  </h1>

                  <div className="max-w-2xl mx-auto mb-16">
                    <p className="text-slate-500 text-base leading-relaxed inline">
                      has successfully completed the course and awarded by Meera Mental Wellness Ltd., as
                    </p>
                    <h4 className="text-[#8b4513] text-2xl md:text-3xl font-serif mt-6 uppercase">
                      Meera Certified Therapist
                    </h4>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-20 border-t border-slate-100 pt-12">
                    <div className="text-left">
                      <p className="text-[#a0522d] text-lg font-serif">Certification ID :</p>
                      <p className="text-slate-400 text-sm font-mono mt-1 tracking-wider">{showCert.certNumber}</p>
                    </div>

                    {/* Seal Visualization (LIGHT) */}
                    <div className="relative group-hover:scale-110 transition-transform duration-700">
                      <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500 rounded-full blur-[40px] opacity-10" />
                      <div className="w-32 h-32 bg-[#d4af37] rounded-full border-4 border-white shadow-xl relative flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border-2 border-white/50 flex items-center justify-center p-2">
                          <div className="text-white font-black text-[10px] uppercase text-center leading-none">
                            Tele-Manas<br />Verified<br />Quality
                          </div>
                        </div>
                        {/* Ribbon Tails */}
                        <div className="absolute -bottom-10 left-4 w-10 h-16 bg-[#d4af37] clip-path-ribbon opacity-90 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
                        <div className="absolute -bottom-10 right-4 w-10 h-16 bg-[#d4af37] clip-path-ribbon opacity-90 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-2 font-['Great_Vibes'] text-[#8b4513] text-4xl">Howard Ong</div>
                      <div className="w-56 h-[1px] bg-slate-200 mb-2" />
                      <p className="text-[#8b4513] text-xs font-serif tracking-widest uppercase">Howard Ong</p>
                      <p className="text-slate-400 text-[10px] tracking-tight mt-1">Chair-Clinical Advisory Board</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => window.print()} className="px-10 py-4 bg-[#d4af37] text-white rounded-full font-black text-sm shadow-xl hover:bg-[#b8860b] transition-all active:scale-95 flex items-center gap-2">
                <Printer size={18} />
                Print Certification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingPortal;
