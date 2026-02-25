
import React, { useState } from 'react';
import { Step, TherapistData, UploadedFiles } from './types';
import DocumentUpload from './components/DocumentUpload';
import PendingVerification from './components/PendingVerification';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import PatientsList from './components/PatientsList';
import { Check } from 'lucide-react';

interface TherapistRegistrationFlowProps {
  onBack?: () => void;
}

const TherapistRegistrationFlow: React.FC<TherapistRegistrationFlowProps> = ({ onBack }) => {
  // Start directly at the UPLOAD step as requested
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [therapistData, setTherapistData] = useState<TherapistData>({
    fullName: 'Dr. Professional', // Default placeholder
    email: '',
    mobile: '',
    qualification: '',
    rciRegNo: '',
    yearsExp: '',
    specialization: '',
    languages: ''
  });

  // Parse name and mobile from query parameters
  React.useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const name = params.get('name');
      const mobile = params.get('mobile');
      if (name || mobile) {
        setTherapistData(prev => ({
          ...prev,
          fullName: name || prev.fullName,
          mobile: mobile || prev.mobile
        }));
      }
    }
  }, []);

  const [files, setFiles] = useState<UploadedFiles>({
    degree: null,
    rci: null,
    photo: null
  });

  const nextStep = () => {
    switch (currentStep) {
      case Step.UPLOAD: setCurrentStep(Step.VERIFICATION); break;
      case Step.VERIFICATION: setCurrentStep(Step.DASHBOARD); break;
      case Step.DASHBOARD: setCurrentStep(Step.ANALYTICS); break;
      default: break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case Step.VERIFICATION: setCurrentStep(Step.UPLOAD); break;
      case Step.DASHBOARD: setCurrentStep(Step.VERIFICATION); break;
      case Step.ANALYTICS: setCurrentStep(Step.DASHBOARD); break;
      case Step.PATIENTS: setCurrentStep(Step.DASHBOARD); break;
      default: break;
    }
  };

  const goToPatients = () => setCurrentStep(Step.PATIENTS);

  // Adjusted progress bar for onboarding flow starting from Upload
  const onboardingSteps = [Step.UPLOAD, Step.VERIFICATION, Step.DASHBOARD];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-12 lg:p-16">

      {/* Persistent Registrant Info Header */}
      {(therapistData.fullName !== 'Dr. Professional' || therapistData.mobile) && (
        <div className="w-full max-w-5xl mb-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 flex flex-wrap items-center justify-between gap-4 animate-fade-in-down">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrant Name</span>
              <span className="text-sm font-bold text-[#1D75FF]">{therapistData.fullName}</span>
            </div>
            {therapistData.mobile && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                <span className="text-sm font-bold text-[#1D75FF]">+91 {therapistData.mobile}</span>
              </div>
            )}
          </div>
          <div className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-tighter">Onboarding Active</div>
        </div>
      )}

      {/* Horizontal Status Bar - Clean Flow without Numbers */}
      {[Step.UPLOAD, Step.VERIFICATION].includes(currentStep) && (
        <div className="w-full max-w-5xl mb-12 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50 flex items-center justify-between">
          <div className="flex items-center gap-8 w-full max-w-2xl">
            {onboardingSteps.map((s, idx) => {
              const isActive = currentStep === s;
              const isPast = onboardingSteps.indexOf(currentStep) > idx;
              return (
                <div key={s} className="flex items-center gap-3 flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#1D75FF] shadow-lg shadow-blue-500/30' :
                    isPast ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                    {isPast && <Check size={18} className="text-[#1D75FF]" />}
                    {isActive && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider hidden md:block ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.replace('_', ' ')}
                  </span>
                  {idx < onboardingSteps.length - 1 && (
                    <div className={`h-[2px] flex-1 hidden md:block transition-colors duration-500 ${isPast ? 'bg-[#1D75FF]/30' : 'bg-slate-100'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Journey Progress</span>
            <span className="text-sm font-black text-[#1D75FF]">
              {Math.round(((onboardingSteps.indexOf(currentStep) + 1) / onboardingSteps.length) * 100)}%
            </span>
          </div>
        </div>
      )}

      <main className="w-full max-w-7xl flex justify-center items-start transition-all duration-500">
        {currentStep === Step.UPLOAD && (
          <DocumentUpload
            files={files}
            setFiles={setFiles}
            onNext={nextStep}
            onBack={onBack}
          />
        )}
        {currentStep === Step.VERIFICATION && (
          <PendingVerification
            onComplete={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === Step.DASHBOARD && (
          <Dashboard
            name={therapistData.fullName}
            onNext={nextStep}
            onBack={prevStep}
            onViewPatients={goToPatients}
          />
        )}
        {currentStep === Step.ANALYTICS && (
          <Analytics
            onBack={prevStep}
          />
        )}
        {currentStep === Step.PATIENTS && (
          <PatientsList
            onBack={prevStep}
          />
        )}
      </main>

      <footer className="mt-12 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
        MANS360 Professional Network • Secure Healthcare Environment
      </footer>
    </div>
  );
};

export default TherapistRegistrationFlow;
