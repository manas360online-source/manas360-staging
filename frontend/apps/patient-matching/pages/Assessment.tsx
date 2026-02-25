import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, CheckCircle, PhoneCall, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';

const QUESTIONS = [
  { id: 'q1', text: "Little interest or pleasure in doing things?" },
  { id: 'q2', text: "Feeling down, depressed, or hopeless?" },
  { id: 'q3', text: "Trouble falling or staying asleep, or sleeping too much?" },
  { id: 'q4', text: "Feeling tired or having little energy?" },
  { id: 'q5', text: "Feeling nervous, anxious, or on edge?" },
];

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createNewPatient, patients, currentUserId } = useApp();
  const [step, setStep] = useState(0); // Start at 0 for first question
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState('Guest'); // Default name since input is removed

  // Restore state if navigating back from Landing Page
  React.useEffect(() => {
    if (location.state?.showComplete && currentUserId) {
      const patient = patients.find(p => p.id === currentUserId);
      if (patient && patient.answers) {
        setAnswers(patient.answers);
        setStep(QUESTIONS.length);
      }
    }
  }, [location.state, currentUserId, patients]);

  const handleScore = (value: number) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: value }));
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setStep(QUESTIONS.length); // Finish
    }
  };

  const calculateTotal = (): number => (Object.values(answers) as number[]).reduce((a: number, b: number) => a + b, 0);

  // Story 5.5 Triage Logic
  const getRecommendation = () => {
    const score = calculateTotal();
    const scaledScore = score * 1.8; // Scaling 0-15 to 0-27 approx

    if (scaledScore >= 20) {
      return {
        type: 'CRITICAL',
        label: 'Crisis Support & Psychiatry',
        desc: 'Your symptoms indicate a need for immediate, integrated care.',
        isCrisis: true
      };
    }
    return {
      type: 'MODERATE',
      label: 'Foundation Therapy',
      desc: 'A psychologist will work with you to build strong mental health foundations.',
      isCrisis: false
    };
  };

  const handleFinish = (target: string) => {
    const score = calculateTotal() * 1.8;
    createNewPatient(name, score, answers);
    navigate(target);
  };

  if (step === QUESTIONS.length) {
    const rec = getRecommendation();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#f0f6ff] py-10">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} strokeWidth={2.5} />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 mb-4">Assessment Complete</h2>
          <p className="text-slate-500 text-base mb-8 leading-relaxed">{rec.desc}</p>

          <div className="bg-blue-50 p-6 rounded-3xl mb-8 border border-blue-100">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Recommended Care Path</p>
            <p className="text-2xl font-serif text-[#1d74f5] font-bold leading-tight">{rec.label}</p>
          </div>

          {rec.isCrisis ? (
            <div className="space-y-4">
              <button
                onClick={() => handleFinish('/crisis-support')}
                className="w-full bg-red-600 text-white px-6 py-4 rounded-3xl font-bold text-lg shadow-lg hover:bg-red-700 flex items-center justify-center gap-3 transition-transform hover:scale-105"
              >
                <PhoneCall size={20} />
                Crisis Support
              </button>
              <Button fullWidth variant="outline" onClick={() => handleFinish('/select-psychiatrist')} className="rounded-3xl py-4 text-lg border-2">
                <Stethoscope size={20} />
                Connect to Psychiatrist
              </Button>
            </div>
          ) : (
            <Button fullWidth onClick={() => handleFinish('/select-psychologist')} className="rounded-3xl py-4 text-lg">
              Meet Your Psychologist
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#f0f6ff] relative py-8">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

      <div className="w-full max-w-2xl mb-8 px-2">
        <button
          onClick={() => step === 0 ? navigate('/') : setStep(prev => prev - 1)}
          className="text-slate-400 hover:text-[#1d74f5] flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> <span className="text-base font-bold">Back</span>
        </button>

        {/* Progress Bar - Updated colors for better visibility */}
        <div className="h-3 bg-blue-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#1d74f5] transition-all duration-500 ease-out rounded-full shadow-md"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl max-w-2xl w-full text-center">
        <h3 className="font-serif text-xl md:text-2xl font-medium text-slate-800 mb-8 leading-relaxed">
          Over the last 2 weeks, how often have you been bothered by: <br />
          <span className="text-[#1d74f5] font-bold block mt-4 text-2xl md:text-4xl">{QUESTIONS[step].text}</span>
        </h3>

        <div className="grid gap-3 md:gap-4">
          {[
            { label: 'Not at all', val: 0 },
            { label: 'Several days', val: 1 },
            { label: 'More than half the days', val: 2 },
            { label: 'Nearly every day', val: 3 },
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => handleScore(opt.val)}
              className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-[#1d74f5] hover:bg-blue-50 text-slate-600 hover:text-[#1d74f5] font-bold text-lg transition-all text-left px-6 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};