
import React, { useState, useRef, useEffect } from 'react';
import { STEPS, SPECS, FOCUSED_EXPERTISE, LANGUAGES, SHIFTS, THERAPEUTIC_APPROACHES } from './constants';
import { FormData } from './types';
import { generateBio } from './geminiService';
import TrainingGuide from './components/TrainingGuide';
import CourseDashboard from './components/CourseDashboard';
import { User } from './trainingTypes';
import NLPContent from './components/NLPContent';
import CBTSessionManager from './components/cbt/CBTSessionManager';
import SubscriptionPage from './components/SubscriptionPage';
import LeadPlansPage from './components/LeadPlansPage';

// --- Sub-components (Helpers) ---

const Chip: React.FC<{
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, icon, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-[14px] py-[7px] rounded-[20px] text-[12px] font-semibold border-[1.5px] transition-all flex items-center gap-[5px] select-none
      ${selected
        ? 'border-[#0C7C8A] text-white bg-[#0C7C8A]'
        : 'border-[#EDF2F7] text-[#2D3748] hover:border-[#0C7C8A] hover:text-[#0C7C8A] hover:bg-[#E0F4F7]'}`}
  >
    {icon && <span className="text-[14px]">{icon}</span>}
    {label}
  </button>
);

const SpecCard: React.FC<{
  spec: typeof SPECS[0];
  selected: boolean;
  onClick: () => void;
}> = ({ spec, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-[14px] rounded-[12px] border-[1.5px] cursor-pointer transition-all relative
      ${selected
        ? 'border-[#0C7C8A] bg-[#0C7C8A]/[0.06]'
        : 'border-[#EDF2F7] hover:border-[#0C7C8A] hover:bg-[#E0F4F7]'}`}
  >
    {selected && (
      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0C7C8A] text-white flex items-center justify-center text-[11px] font-bold">✓</div>
    )}
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[20px]">{spec.icon}</span>
      <span className="text-[13px] font-bold text-[#1A2332]">{spec.name}</span>
    </div>
    <div className="text-[10.5px] text-[#718096] leading-relaxed">{spec.symptoms}</div>
  </div>
);

const ToggleRow: React.FC<{
  title: string;
  desc: string;
  icon: string;
  bonus?: string;
  active: boolean;
  onChange: (val: boolean) => void;
}> = ({ title, desc, icon, bonus, active, onChange }) => (
  <div
    onClick={() => onChange(!active)}
    className={`flex items-center justify-between p-4 rounded-[12px] border-[1.5px] mb-[10px] transition-all cursor-pointer
      ${active ? 'border-[#0C7C8A] bg-[#0C7C8A]/[0.03]' : 'border-[#EDF2F7] hover:border-[#E0F4F7]'}`}
  >
    <div className="flex items-center gap-[10px]">
      <span className="text-[20px]">{icon}</span>
      <div>
        <div className="text-[13px] font-bold text-[#1A2332]">{title}</div>
        <div className="text-[11px] text-[#718096] mt-[1px]">{desc}</div>
      </div>
    </div>
    <div className="flex items-center gap-[10px]">
      {bonus && <span className="text-[10px] font-bold text-[#38A169] bg-[#38A169]/10 px-2 py-[2px] rounded-[10px]">{bonus}</span>}
      <div className="relative w-11 h-6 shrink-0">
        <div className={`absolute inset-0 rounded-[24px] transition-colors ${active ? 'bg-[#0C7C8A]' : 'bg-[#EDF2F7]'}`} />
        <div className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform ${active ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} />
      </div>
    </div>
  </div>
);

const DocumentUploadCard: React.FC<{
  title: string;
  desc: string;
  icon: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}> = ({ title, desc, icon, file, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[12px] cursor-pointer transition-all h-[160px] text-center
        ${file ? 'border-[#0C7C8A] bg-[#0C7C8A]/[0.02]' : 'border-[#EDF2F7] hover:border-[#0C7C8A] bg-[#F7FAFC]'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {file ? (
        <div className="flex flex-col items-center">
          <span className="text-[28px] mb-2">📄</span>
          <div className="text-[12px] font-bold text-[#0C7C8A] truncate max-w-[150px]">{file.name}</div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            className="text-[10px] text-red-500 font-bold mt-2 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <span className="text-[32px] mb-2">{icon}</span>
          <div className="text-[13px] font-bold text-[#1A2332]">{title}</div>
          <div className="text-[10px] text-[#718096] mt-1">{desc}</div>
          <div className="text-[9px] text-[#A0AEC0] mt-1 italic">PDF or JPEG, max 5MB</div>
        </>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('manas360_currentStep');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);
  const [leadsVisible, setLeadsVisible] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean[]>(new Array(6).fill(false));

  // Training State
  const [trainingView, setTrainingView] = useState<'none' | 'dashboard' | 'guide' | 'nlp' | 'cbt'>('none');

  const [trainingUser, setTrainingUser] = useState<User>({
    id: 'u1',
    name: 'Dr. Priya Sharma',
    role: 'therapist',
    isCertified: false,
    progress: {
      module1: 0,
      module2: 0,
      module3: 0,
      module4: 0,
      module5: 0,
      module6: 0,
      module7: 0,
      quizPassed: false,
      quizAttempts: 0
    }
  });

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('manas360_formData');
    const initialData = {
      professionalTypes: [],
      fullName: '',
      displayName: '',
      dob: '',
      gender: '',
      experience: '',
      email: '',
      mobile: '',
      city: '',
      state: '',
      registrationType: '',
      regNumber: '',
      nmrId: '',
      smc: '',
      regDate: '',
      licenseExpiry: '',
      qualification: '',
      university: '',
      completionYear: '',
      additionalQuals: '',
      selectedSpecializations: [],
      focusedExpertise: [],
      therapeuticApproaches: [],
      languages: [],
      corporateWilling: '',
      corporateCities: [],
      corporateSpecs: [],
      maxSessions: '8 sessions',
      serviceWillingness: {},
      certifications: [],
      pricing: { individual: '', couples: '', followup: '' },
      firstSessionPricing: '',
      insurance: '',
      pan: '',
      upiId: '',
      bankAccount: '',
      ifsc: '',
      bio: '',
      tagline: '',
      signature: '',
      degreeDoc: null,
      regDoc: null,
      aadhaarDoc: null,
      insuranceDoc: null,
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialData, ...parsed, degreeDoc: null, regDoc: null, aadhaarDoc: null, insuranceDoc: null };
      } catch (e) {
        console.error("Failed to parse saved profile data", e);
      }
    }
    return initialData;
  });

  useEffect(() => {
    const { degreeDoc, regDoc, aadhaarDoc, insuranceDoc, ...rest } = formData;
    localStorage.setItem('manas360_formData', JSON.stringify(rest));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('manas360_currentStep', currentStep.toString());
  }, [currentStep]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          formData.professionalTypes.length > 0 &&
          !!formData.fullName.trim() &&
          !!formData.dob &&
          !!formData.experience &&
          !!formData.email.trim() &&
          !!formData.mobile.trim()
        );
      case 2:
        return (
          !!formData.registrationType &&
          !!formData.regNumber.trim() &&
          !!formData.qualification &&
          !!formData.university.trim() &&
          !!formData.degreeDoc &&
          !!formData.regDoc &&
          !!formData.aadhaarDoc
        );
      case 3:
        return formData.selectedSpecializations.length > 0;
      case 4:
        return (
          formData.languages.length > 0 &&
          !!formData.corporateWilling
        );
      case 5:
        return Object.values(formData.serviceWillingness).some(val => val === true);
      case 6:
        return (
          !!formData.pricing.individual &&
          !!formData.bio.trim()
        );
      case 7:
        return agreedTerms.every(Boolean) && !!formData.signature.trim();
      default:
        return true;
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleListItem = (key: keyof FormData, item: string) => {
    const list = formData[key] as string[];
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    updateFormData({ [key]: newList });
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAiBio = async () => {
    if (!formData.fullName || !formData.experience || !formData.qualification) {
      alert("Please fill in your name, experience, and qualification first!");
      return;
    }
    setIsGeneratingBio(true);
    const generated = await generateBio({
      fullName: formData.fullName,
      experience: formData.experience,
      specializations: formData.selectedSpecializations,
      qualification: formData.qualification,
      languages: formData.languages,
    });
    if (generated) {
      updateFormData({ bio: generated });
    }
    setIsGeneratingBio(false);
  };

  const handleSubmit = () => {
    if (!validateStep(7)) return;
    setIsSubmitted(true);
    setSubscriptionVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTraining = () => {
    setTrainingUser(prev => ({ ...prev, name: formData.fullName || prev.name }));
    setTrainingView('dashboard');
  };

  const handleSelectCourse = (courseId: string) => {
    if (courseId === '5whys') {
      setTrainingView('guide');
    } else if (courseId === 'nlp') {
      setTrainingView('nlp');
    } else if (courseId === 'cbt') {
      setTrainingView('cbt');
    }
  };

  const handleUpdateProgress = (mod: keyof User['progress'], val: number) => {
    setTrainingUser(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [mod]: val
      }
    }));
  };

  const completionPct = isSubmitted ? 100 : Math.round(((currentStep - 1) / STEPS.length) * 100);
  const isStepValid = validateStep(currentStep);

  if (trainingView !== 'none') {
    return (
      <div className="min-h-screen bg-[#F7FAFC]">
        {trainingView === 'dashboard' ? (
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <CourseDashboard
              user={trainingUser}
              onSelectCourse={handleSelectCourse}
              onBack={() => {
                setTrainingView('none');
                setSubscriptionVisible(true);
              }}
              onBuyLeads={() => setLeadsVisible(true)}
            />
          </div>
        ) : (
          <div className="flex min-h-screen">
            {trainingView === 'guide' && (
              <TrainingGuide
                user={trainingUser}
                onUpdateProgress={handleUpdateProgress}
                onBack={() => setTrainingView('dashboard')}
              />
            )}
            {trainingView === 'nlp' && (
              <NLPContent
                onBack={() => setTrainingView('dashboard')}
              />
            )}
            {trainingView === 'cbt' && (
              <CBTSessionManager
                onBack={() => setTrainingView('dashboard')}
              />
            )}
          </div>
        )}

        {/* Lead Plans Overlay */}
        {leadsVisible && (
          <div className="fixed inset-0 z-[100] bg-[#FDFCF7] overflow-auto">
            <LeadPlansPage
              onNext={() => setLeadsVisible(false)}
              onPrev={() => setLeadsVisible(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${subscriptionVisible ? 'bg-[#FDFCF7]' : 'bg-[#F7FAFC]'}`}>
      {/* Standalone Subscription Page */}
      {subscriptionVisible && (
        <SubscriptionPage
          onNext={() => {
            setSubscriptionVisible(false);
            setTrainingView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPrev={() => {
            setSubscriptionVisible(false);
            setIsSubmitted(true);
          }}
        />
      )}


      {/* Profile Setup Header & Progress (only if not on subscription page or submitted) */}
      {!subscriptionVisible && !isSubmitted && (
        <div className="max-w-[860px] mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="text-[20px] font-extrabold text-[#064E5C] mb-1">
              MANAS<span className="text-[#D4A017] italic not-italic">360</span>
            </div>
            <h1 className="font-playfair text-[26px] font-bold text-[#1A2332] mb-1">Setup Your Professional Profile</h1>
            <p className="text-[13px] text-[#718096] max-w-[500px] mx-auto leading-relaxed">
              One unified profile for Psychologists, Psychiatrists & Therapists. Takes ~10 minutes. Verification in 48 hours.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#718096] font-semibold">Profile Completion</span>
              <span className="text-[#0C7C8A] font-bold">{completionPct}%</span>
            </div>
            <div className="h-[6px] bg-[#EDF2F7] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0C7C8A] to-[#0D9488] transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-0 mb-7 overflow-x-auto pb-2 no-scrollbar">
            {STEPS.map((step, idx) => {
              const isCompleted = isSubmitted || step.num < currentStep;
              const isActive = !isSubmitted && step.num === currentStep;

              return (
                <React.Fragment key={step.num}>
                  <div
                    onClick={() => !isSubmitted && step.num < currentStep && setCurrentStep(step.num)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all border-2 shrink-0
                      ${isActive
                        ? 'border-[#0C7C8A] text-white bg-[#0C7C8A] shadow-[0_0_0_4px_rgba(12,124,138,0.15)]'
                        : isCompleted
                          ? 'border-[#38A169] text-white bg-[#38A169]'
                          : 'border-[#EDF2F7] text-[#718096] bg-white cursor-default'}`}
                  >
                    {isCompleted ? '✓' : step.num}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-7 h-[2px] shrink-0 ${isCompleted ? 'bg-[#38A169]' : 'bg-[#EDF2F7]'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Card (only if not on subscription page) */}
      {!subscriptionVisible && (
        <div className="max-w-[860px] mx-auto px-4 pb-16">
          <div className="bg-white rounded-[16px] shadow-sm p-5 md:p-8 border border-black/5 min-h-[500px]">
            {isSubmitted ? (
              <div className="animate-fadeUp text-center py-10 relative">
                {/* Back to Step 7 */}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="absolute -top-4 -left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all bg-white shadow-sm"
                >
                  ← Back
                </button>

                <div className="text-[64px] mb-4">🎉</div>
                <h2 className="text-2xl font-extrabold text-[#1A2332] mb-3">Profile Submitted!</h2>
                <p className="text-sm text-[#718096] max-w-[400px] mx-auto mb-8 leading-relaxed">
                  Your credentials are being verified. You'll receive an email within <strong>24-48 hours</strong> with next steps for platform training.
                </p>

                <div className="mb-8">
                  <button
                    onClick={() => {
                      setSubscriptionVisible(true);
                      setIsSubmitted(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#0C7C8A] hover:bg-[#064E5C] text-white px-8 py-3 rounded-[10px] text-[14px] font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    Next Step: Platform Subscription →
                  </button>
                </div>

                <div className="flex justify-center gap-3 flex-wrap">
                  {[
                    { icon: "📋", step: "Step 1", desc: "Verification (48hr)", bg: "bg-[#E0F4F7]", color: "text-[#0C7C8A]" },
                    { icon: "🎓", step: "Step 2", desc: "Training (2 hrs)", bg: "bg-[#F7FAFC]", color: "text-[#718096]" },
                    { icon: "✅", step: "Step 3", desc: "Go LIVE!", bg: "bg-[#F7FAFC]", color: "text-[#718096]" },
                  ].map((item, idx) => (
                    <div key={idx} className={`${item.bg} p-[18px] rounded-[10px] text-center w-28`}>
                      <div className="text-[22px]">{item.icon}</div>
                      <div className={`text-[11px] font-bold ${item.color} mt-1`}>{item.step}</div>
                      <div className="text-[10px] text-[#718096]">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <span className="text-[22px]">⚕️</span>
                      <div>
                        <h2 className="text-[17px] font-bold">Professional Identity</h2>
                        <div className="text-[11px] text-[#718096]">Tell us who you are and your credentials</div>
                      </div>
                    </div>

                    <div className="bg-[#E0F4F7] text-[#064E5C] border-l-[3px] border-[#0C7C8A] p-3.5 rounded-[10px] flex gap-2.5 text-[12px] leading-relaxed mb-4">
                      <span className="mt-0.5">ℹ️</span>
                      <span>One profile works for all — whether you're a Psychiatrist, Psychologist, Counselor, or Therapist. Select all that apply.</span>
                    </div>

                    <div className="mb-[18px]">
                      <label className="block text-[12px] font-bold text-[#2D3748] mb-1.5">Professional Type <span className="text-[#E53E6B]">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Psychiatrist", icon: "🩺" },
                          { label: "Clinical Psychologist", icon: "🧠" },
                          { label: "Counseling Psychologist", icon: "💬" },
                          { label: "Therapist / Counselor", icon: "👨‍⚕️" },
                          { label: "Trainee / Intern", icon: "🎓" }
                        ].map(pt => (
                          <Chip
                            key={pt.label}
                            label={pt.label}
                            icon={pt.icon}
                            selected={formData.professionalTypes.includes(pt.label)}
                            onClick={() => toggleListItem('professionalTypes', pt.label)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-[18px]">
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Full Name (as per registration) <span className="text-[#E53E6B]">*</span></label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={e => updateFormData({ fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="Dr. Priya Sharma"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Display Name <span className="font-normal text-[#718096] text-[11px] ml-1.5">Shown to patients</span></label>
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={e => updateFormData({ displayName: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="Dr. Priya"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-[18px]">
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Date of Birth <span className="text-[#E53E6B]">*</span></label>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={e => updateFormData({ dob: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={e => updateFormData({ gender: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] appearance-none bg-white transition-all"
                        >
                          <option value="">Select…</option>
                          <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Years of Experience <span className="text-[#E53E6B]">*</span></label>
                        <select
                          value={formData.experience}
                          onChange={e => updateFormData({ experience: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] appearance-none bg-white transition-all"
                        >
                          <option value="">Select…</option>
                          <option>0-1 (Intern/Fresh)</option><option>1-3 years</option><option>3-5 years</option><option>5-10 years</option><option>10-20 years</option><option>20+ years</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-[18px]">
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Email <span className="text-[#E53E6B]">*</span></label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => updateFormData({ email: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="priya.sharma@example.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Mobile <span className="text-[#E53E6B]">*</span></label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={e => updateFormData({ mobile: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-5 border-t border-[#EDF2F7]">
                      <button
                        onClick={handleNext}
                        disabled={!isStepValid}
                        className={`text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C]'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        Next: Credentials →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: CREDENTIALS */}
                {currentStep === 2 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <span className="text-[22px]">🔒</span>
                      <div>
                        <h2 className="text-[17px] font-bold">Credentials & Verification</h2>
                        <div className="text-[11px] text-[#718096]">We verify all credentials within 48 hours</div>
                      </div>
                    </div>

                    <div className="bg-[#FEF3CD] text-[#856404] border-l-[3px] border-[#D4A017] p-3.5 rounded-[10px] flex gap-2.5 text-[12px] leading-relaxed mb-4">
                      <span className="mt-0.5">⚡</span>
                      <span><strong>Fast-track:</strong> If your RCI/NMC number is active, verification completes in under 24 hours via API.</span>
                    </div>

                    <div className="mb-[18px]">
                      <label className="block text-[12px] font-bold text-[#2D3748] mb-1.5">Registration Type <span className="text-[#E53E6B]">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "RCI (Psychologists)", icon: "🏛️" },
                          { label: "NMC / NMR (Psychiatrists)", icon: "⚕️" },
                          { label: "State Medical Council", icon: "🏥" },
                          { label: "IACCP / IAC", icon: "📋" },
                          { label: "International", icon: "🌍" }
                        ].map(rt => (
                          <Chip
                            key={rt.label}
                            label={rt.label}
                            icon={rt.icon}
                            selected={formData.registrationType === rt.label}
                            onClick={() => updateFormData({ registrationType: rt.label })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-[18px]">
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Registration / License Number <span className="text-[#E53E6B]">*</span></label>
                        <input
                          type="text"
                          value={formData.regNumber}
                          onChange={e => updateFormData({ regNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="e.g., RCI-A12345"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">NMR ID <span className="font-normal text-[#718096] text-[11px] ml-1.5">If available</span></label>
                        <input
                          type="text"
                          value={formData.nmrId}
                          onChange={e => updateFormData({ nmrId: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="National Medical Register ID"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-[24px]">
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Highest Qualification <span className="text-[#E53E6B]">*</span></label>
                        <select
                          value={formData.qualification}
                          onChange={e => updateFormData({ qualification: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] appearance-none bg-white transition-all"
                        >
                          <option value="">Select…</option>
                          <option>MBBS + MD Psychiatry</option><option>MBBS + DPM</option><option>M.Phil Clinical Psychology</option><option>Ph.D. Clinical Psychology</option><option>M.A. Psychology</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">University / Institution <span className="text-[#E53E6B]">*</span></label>
                        <input
                          type="text"
                          value={formData.university}
                          onChange={e => updateFormData({ university: e.target.value })}
                          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                          placeholder="NIMHANS, Bengaluru"
                        />
                      </div>
                    </div>

                    <div className="mt-8 mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[20px]">📄</span>
                        <h3 className="text-[15px] font-bold text-[#1A2332]">Document Uploads</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DocumentUploadCard
                          title="Degree Certificate"
                          desc="MBBS / MD / M.Phil / PhD"
                          icon="🎓"
                          file={formData.degreeDoc}
                          onFileChange={(file) => updateFormData({ degreeDoc: file })}
                        />
                        <DocumentUploadCard
                          title="Registration Certificate"
                          desc="RCI / NMC / State Council"
                          icon="🏛️"
                          file={formData.regDoc}
                          onFileChange={(file) => updateFormData({ regDoc: file })}
                        />
                        <DocumentUploadCard
                          title="Aadhaar Card"
                          desc="For identity verification"
                          icon="🪪"
                          file={formData.aadhaarDoc}
                          onFileChange={(file) => updateFormData({ aadhaarDoc: file })}
                        />
                        <DocumentUploadCard
                          title="Professional Liability Insurance"
                          desc="Min ₹10L coverage (optional)"
                          icon="🛡️"
                          file={formData.insuranceDoc}
                          onFileChange={(file) => updateFormData({ insuranceDoc: file })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#EDF2F7]">
                      <button onClick={handlePrev} className="bg-transparent text-[#2D3748] border-[1.5px] border-[#EDF2F7] px-6 py-2.5 rounded-[10px] text-[13px] font-bold hover:border-[#0C7C8A] hover:text-[#0C7C8A] transition-all">← Back</button>
                      <button
                        onClick={handleNext}
                        disabled={!isStepValid}
                        className={`text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C]'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        Next: Specializations →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SPECIALIZATIONS */}
                {currentStep === 3 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <span className="text-[22px]">🎯</span>
                      <div>
                        <h2 className="text-[17px] font-bold">Specializations</h2>
                        <div className="text-[11px] text-[#718096]">Select conditions you treat</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {SPECS.map(spec => (
                        <SpecCard
                          key={spec.name}
                          spec={spec}
                          selected={formData.selectedSpecializations.includes(spec.name)}
                          onClick={() => toggleListItem('selectedSpecializations', spec.name)}
                        />
                      ))}
                    </div>

                    <div className="mt-8 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <h2 className="text-[15px] font-bold flex items-center gap-2"><span className="text-[18px]">🔍</span> Focused Expertise</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FOCUSED_EXPERTISE.map(fe => (
                        <Chip
                          key={fe.label}
                          label={fe.label}
                          icon={fe.icon}
                          selected={formData.focusedExpertise.includes(fe.label)}
                          onClick={() => toggleListItem('focusedExpertise', fe.label)}
                        />
                      ))}
                    </div>

                    <div className="mt-8 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <h2 className="text-[15px] font-bold flex items-center gap-2"><span className="text-[18px]">🛠️</span> Therapeutic Approaches</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {THERAPEUTIC_APPROACHES.map(approach => (
                        <Chip
                          key={approach}
                          label={approach}
                          selected={formData.therapeuticApproaches.includes(approach)}
                          onClick={() => toggleListItem('therapeuticApproaches', approach)}
                        />
                      ))}
                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#EDF2F7] mt-8">
                      <button onClick={handlePrev} className="bg-transparent text-[#2D3748] border-[1.5px] border-[#EDF2F7] px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all hover:border-[#0C7C8A]">← Back</button>
                      <button
                        onClick={handleNext}
                        disabled={!isStepValid}
                        className={`text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C]'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        Next: Languages & Location →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: LANGUAGES & LOCATION */}
                {currentStep === 4 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <span className="text-[22px]">🌐</span>
                      <div>
                        <h2 className="text-[17px] font-bold">Languages & Location Preferences</h2>
                        <div className="text-[11px] text-[#718096]">For patient matching and corporate engagements</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-[12px] font-bold text-[#2D3748] mb-1.5">Languages You Can Conduct Sessions In <span className="text-[#E53E6B]">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map(lang => (
                          <Chip
                            key={lang}
                            label={lang}
                            selected={formData.languages.includes(lang)}
                            onClick={() => toggleListItem('languages', lang)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-[15px] font-bold mb-3 flex items-center gap-2"><span className="text-[18px]">🏢</span> Corporate Engagement Preferences</h2>
                      <div className="bg-[#D4EDDA] text-[#155724] border-l-[3px] border-[#38A169] p-3.5 rounded-[10px] flex gap-2.5 text-[12px] leading-relaxed mb-4">
                        <span className="mt-0.5">💰</span>
                        <span>Corporate sessions pay <strong>₹3,000-8,000/session</strong>. Select cities where you can travel for in-person workshops.</span>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[12px] font-bold text-[#2D3748] mb-1.5">Willing to do Corporate Engagements? <span className="text-[#E53E6B]">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {["✅ Yes, in-person + virtual", "💻 Virtual only", "❌ Not interested"].map(opt => (
                            <Chip
                              key={opt}
                              label={opt}
                              selected={formData.corporateWilling === opt}
                              onClick={() => updateFormData({ corporateWilling: opt })}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#EDF2F7]">
                      <button onClick={handlePrev} className="bg-transparent text-[#2D3748] border-[1.5px] border-[#EDF2F7] px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all hover:border-[#0C7C8A]">← Back</button>
                      <button
                        onClick={handleNext}
                        disabled={!isStepValid}
                        className={`text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C]'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        Next: Availability →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: AVAILABILITY */}
                {currentStep === 5 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <span className="text-[22px]">🕐</span>
                      <div>
                        <h2 className="text-[17px] font-bold">Availability & Shifts</h2>
                        <div className="text-[11px] text-[#718096]">Choose your working hours</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                      {SHIFTS.map(shift => (
                        <div
                          key={shift.id}
                          className={`p-4 rounded-[12px] border-[1.5px] text-center cursor-pointer transition-all
                        ${formData.serviceWillingness[shift.id] ? 'border-[#0C7C8A] bg-[#0C7C8A]/[0.06]' : 'border-[#EDF2F7] hover:border-[#0C7C8A] hover:bg-[#E0F4F7]'}`}
                          onClick={() => updateFormData({ serviceWillingness: { ...formData.serviceWillingness, [shift.id]: !formData.serviceWillingness[shift.id] } })}
                        >
                          <div className="text-[24px] mb-1">{shift.icon}</div>
                          <div className="text-[13px] font-bold text-[#1A2332]">{shift.time}</div>
                          <div className="text-[10px] text-[#718096] mb-2">{shift.label}</div>
                          <div className="flex justify-center gap-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border ${shift.days.includes(day) ? 'bg-[#0C7C8A] text-white border-[#0C7C8A]' : 'bg-white text-[#718096] border-[#EDF2F7]'}`}
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <ToggleRow
                        title="AnytimeBuddy Calls"
                        desc="Accept short 15-min support calls anytime during shift"
                        icon="🫂"
                        bonus="+ ₹150/call"
                        active={!!formData.serviceWillingness.buddyCalls}
                        onChange={val => updateFormData({ serviceWillingness: { ...formData.serviceWillingness, buddyCalls: val } })}
                      />
                      <ToggleRow
                        title="Night Shift Premium"
                        desc="Willing to take 10 PM — 6 AM sessions"
                        icon="🌙"
                        bonus="+ 10% premium"
                        active={!!formData.serviceWillingness.nightPremium}
                        onChange={val => updateFormData({ serviceWillingness: { ...formData.serviceWillingness, nightPremium: val } })}
                      />
                      <ToggleRow
                        title="Group Therapy Sessions"
                        desc="Facilitate theme-based group sessions"
                        icon="👥"
                        bonus="+ ₹500/group"
                        active={!!formData.serviceWillingness.groupTherapy}
                        onChange={val => updateFormData({ serviceWillingness: { ...formData.serviceWillingness, groupTherapy: val } })}
                      />
                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#EDF2F7] mt-8">
                      <button onClick={handlePrev} className="bg-transparent text-[#2D3748] border-[1.5px] border-[#EDF2F7] px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all hover:border-[#0C7C8A]">← Back</button>
                      <button
                        onClick={handleNext}
                        disabled={!isStepValid}
                        className={`text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C]'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        Next: Certify & Pricing →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: PRICING & BIO */}
                {currentStep === 6 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#EDF2F7]">
                      <span className="text-[22px]">🏆</span>
                      <div>
                        <h2 className="text-[17px] font-bold">MANAS360 Certification & Pricing</h2>
                        <div className="text-[11px] text-[#718096]">Set your rates and professional bio</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Individual (50 min) <span className="text-[#E53E6B]">*</span></label>
                        <div className="flex items-center">
                          <span className="bg-[#F7FAFC] border-[1.5px] border-[#EDF2F7] border-r-0 px-3 py-2.5 rounded-l-[10px] text-[13px] font-bold">₹</span>
                          <input
                            type="number"
                            value={formData.pricing.individual}
                            onChange={e => updateFormData({ pricing: { ...formData.pricing, individual: e.target.value } })}
                            className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-r-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                            placeholder="1,200"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Couples / Family (60 min)</label>
                        <div className="flex items-center">
                          <span className="bg-[#F7FAFC] border-[1.5px] border-[#EDF2F7] border-r-0 px-3 py-2.5 rounded-l-[10px] text-[13px] font-bold">₹</span>
                          <input
                            type="number"
                            value={formData.pricing.couples}
                            onChange={e => updateFormData({ pricing: { ...formData.pricing, couples: e.target.value } })}
                            className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-r-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                            placeholder="1,800"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Follow-up (30 min)</label>
                        <div className="flex items-center">
                          <span className="bg-[#F7FAFC] border-[1.5px] border-[#EDF2F7] border-r-0 px-3 py-2.5 rounded-l-[10px] text-[13px] font-bold">₹</span>
                          <input
                            type="number"
                            value={formData.pricing.followup}
                            onChange={e => updateFormData({ pricing: { ...formData.pricing, followup: e.target.value } })}
                            className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-r-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all"
                            placeholder="700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Professional Bio <span className="text-[#E53E6B]">*</span></label>
                        <button
                          type="button"
                          onClick={handleAiBio}
                          disabled={isGeneratingBio}
                          className="text-[11px] font-bold text-[#0C7C8A] hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                          {isGeneratingBio ? "✨ Generating..." : "✨ AI Help: Generate Bio"}
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        value={formData.bio}
                        onChange={e => updateFormData({ bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[13px] outline-none focus:border-[#0C7C8A] transition-all resize-none"
                        placeholder="I'm a clinical psychologist with 8 years of experience specialization in..."
                      />
                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#EDF2F7]">
                      <button onClick={handlePrev} className="bg-transparent text-[#2D3748] border-[1.5px] border-[#EDF2F7] px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all hover:border-[#0C7C8A]">← Back</button>
                      <button
                        onClick={handleNext}
                        disabled={!isStepValid}
                        className={`text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold transition-all
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C]'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        Next: Review & Submit →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: SUBMIT */}
                {currentStep === 7 && (
                  <div className="animate-fadeUp">
                    <div className="flex items-center gap-3 mb-1 pb-3">
                      <span className="text-[22px] bg-[#38A169]/10 p-1.5 rounded-md text-[#38A169]">✅</span>
                      <div>
                        <h2 className="text-[17px] font-bold">Review & Submit</h2>
                        <div className="text-[11px] text-[#718096]">Almost there! Review your consents and submit.</div>
                      </div>
                    </div>

                    <div className="bg-[#D4EDDA] border border-[#C3E6CB] p-4 rounded-[10px] mb-6 flex gap-3 text-[12px] text-[#155724] leading-relaxed">
                      <span className="text-[16px]">🚀</span>
                      <p>
                        After submission: Credential verification (24-48 hrs) → Platform training (2 hrs, self-paced) → Quiz (80% pass) → Profile LIVE.
                        <span className="block font-semibold mt-0.5">Start earning from Day 1 of activation.</span>
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {[
                        "Independent Contractor Agreement — I understand I am joining as an independent contractor, not an employee. Revenue split is 60/40 (I receive 60%). Payments via PhonePe, weekly.",
                        "DPDPA Compliance — I agree to handle patient data per Digital Personal Data Protection Act 2023. No data stored outside MANAS360 platform.",
                        "Crisis Protocol — I agree to follow MANAS360 crisis escalation protocol. If a patient shows suicidal ideation, I will follow the mandatory reporting workflow.",
                        "Telemedicine Guidelines — I confirm I hold a valid license and am compliant with Indian Telemedicine Practice Guidelines 2020.",
                        "Code of Ethics — I agree to maintain patient confidentiality, avoid dual relationships, obtain informed consent, and maintain session records per MANAS360 clinical standards.",
                        "Credential Accuracy — I certify that all information, credentials, and documents submitted are authentic. Falsification will result in permanent removal and possible legal action."
                      ].map((term, i) => (
                        <label key={i} className="flex items-start gap-3 p-3.5 rounded-[10px] border-[1.5px] border-[#EDF2F7] cursor-pointer hover:border-[#0C7C8A] transition-all bg-white shadow-sm">
                          <input
                            type="checkbox"
                            checked={agreedTerms[i]}
                            onChange={(e) => {
                              const newAgreed = [...agreedTerms];
                              newAgreed[i] = e.target.checked;
                              setAgreedTerms(newAgreed);
                            }}
                            className="mt-1 w-4 h-4 accent-[#0C7C8A] shrink-0"
                          />
                          <span className="text-[12px] text-[#2D3748] leading-relaxed font-medium">
                            {term.split(' — ')[0]} <span className="font-normal text-[#718096]"> — {term.split(' — ')[1]}</span>
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="block text-[12px] font-bold text-[#2D3748]">Digital Signature <span className="text-[#E53E6B]">*</span></label>
                        <span className="text-[11px] text-[#718096]">Type your full name as registered</span>
                      </div>
                      <input
                        type="text"
                        value={formData.signature}
                        onChange={e => updateFormData({ signature: e.target.value })}
                        className="w-full p-4 border-[1.5px] border-[#EDF2F7] rounded-[10px] text-[26px] outline-none focus:border-[#0C7C8A] transition-all bg-[#F7FAFC]"
                        placeholder="Dr. Priya Sharma"
                        style={{ fontFamily: "'Caveat', cursive, serif" }}
                      />
                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#EDF2F7]">
                      <button onClick={handlePrev} className="bg-white text-[#2D3748] border-[1.5px] border-[#EDF2F7] px-8 py-2.5 rounded-[10px] text-[13px] font-bold transition-all hover:border-[#0C7C8A] shadow-sm">← Back</button>
                      <button
                        onClick={handleSubmit}
                        disabled={!isStepValid}
                        className={`px-8 py-3 rounded-[10px] text-[14px] font-bold transition-all text-white flex items-center gap-2
                      ${isStepValid
                            ? 'bg-[#0C7C8A] hover:bg-[#064E5C] shadow-sm hover:shadow-md'
                            : 'bg-[#CBD5E0] cursor-not-allowed opacity-70'}`}
                      >
                        🚀 Submit Profile for Verification
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
