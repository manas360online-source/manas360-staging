
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AssessmentProps {
  onSubmit: (data: any, isCritical: boolean) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ onSubmit }) => {
  const { t, i18n } = useTranslation();
  // State now stores IDs, not displayed strings
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [impact, setImpact] = useState<string>('');
  const [selfHarm, setSelfHarm] = useState<string>('');

  const toggleSymptom = (id: string) => {
    if (symptoms.includes(id)) {
      setSymptoms(symptoms.filter((s) => s !== id));
    } else {
      setSymptoms([...symptoms, id]);
    }
  };

  const handleFinish = () => {
    // Basic validation
    if (!selfHarm || !impact) {
      alert(t('assessment_alert'));
      return;
    }

    // Critical check using ID
    const isCritical = selfHarm === 'harm_3';

    // Submit IDs
    onSubmit({
      symptoms,
      impact,
      selfHarm
    }, isCritical);
  };

  const handleBack = () => {
    // Check if user came from Free Tools or Home
    if (window.location.hash.includes('source=free-tools')) {
      window.location.hash = `#/${i18n.language}/free-tools`;
    } else {
      // Changed default back navigation to Profile Setup per request
      window.location.hash = `#/${i18n.language}/profile-setup`;
    }
  };

  // Define keys for options
  const symptomKeys = [
    'symptom_1', 'symptom_2', 'symptom_3', 'symptom_4',
    'symptom_5', 'symptom_6', 'symptom_7', 'symptom_8',
    'symptom_9', 'symptom_10', 'symptom_11', 'symptom_12'
  ];

  const impactKeys = [
    'impact_1', 'impact_2', 'impact_3', 'impact_4', 'impact_5'
  ];

  const selfHarmKeys = [
    'harm_1', 'harm_2', 'harm_3'
  ];

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#030712] flex flex-col items-center py-12 px-6 animate-fade-in transition-colors duration-500 ease-in-out relative">

      {/* Absolute Top Right Icon */}
      <div className="absolute top-2 right-4 md:top-6 md:right-8 select-none pointer-events-none drop-shadow-sm z-50 text-black dark:text-white">
        <span className="text-[26px] md:text-[28px] leading-none">🧿</span>
      </div>

      {/* Header */}
      <div className="w-full max-w-5xl mb-12 flex items-center relative mt-8 md:mt-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#0A3A78] dark:text-sky-400 font-bold text-lg hover:opacity-75 transition-opacity z-10"
        >
          <span className="text-2xl">←</span> Back
        </button>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="font-serif text-[#0A3A78] dark:text-white font-bold text-xl md:text-2xl tracking-widest uppercase text-center hidden md:block">
            Mental Health Assessment
          </h1>
          <h1 className="font-serif text-[#0A3A78] dark:text-white font-bold text-lg tracking-widest uppercase text-center md:hidden">
            Assessment
          </h1>
        </div>
      </div>

      {/* Main Content Container - Widened to max-w-5xl for one-line questions */}
      <div className="w-full max-w-5xl space-y-20 pb-20">

        {/* Question 1 */}
        <section>
          <div className="mb-8">
            <h2 className="font-serif text-[1.8rem] md:text-[2.2rem] text-[#0A3A78] dark:text-white leading-tight transition-colors">
              {t('q1_text')}
            </h2>
            <p className="text-sm font-sans text-[#475569] dark:text-slate-400 font-bold mt-3 tracking-wider uppercase opacity-80">
              {t('q1_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {symptomKeys.map((key) => {
              const isSelected = symptoms.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleSymptom(key)}
                  className={`
                    w-full text-left px-6 py-5 rounded-2xl text-[1rem] font-medium transition-all duration-200 border-2
                    flex items-center justify-between group
                    ${isSelected
                      ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white border-[#1FA2DE] dark:border-sky-500 shadow-lg scale-[1.02]'
                      : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-200 border-slate-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 hover:bg-sky-50 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <span className="leading-snug pr-2">{t(key)}</span>
                  <span className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected
                      ? 'border-white bg-white text-[#1FA2DE]'
                      : 'border-slate-300 dark:border-slate-500 group-hover:border-sky-300'
                    }
                  `}>
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Question 2 */}
        <section>
          <h2 className="font-serif text-[1.8rem] md:text-[2.2rem] text-[#0A3A78] dark:text-white mb-8 leading-tight transition-colors">
            {t('q2_text')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {impactKeys.map((key) => {
              const isSelected = impact === key;
              return (
                <button
                  key={key}
                  onClick={() => setImpact(key)}
                  className={`
                    w-full px-4 py-5 rounded-2xl text-[1rem] font-medium transition-all duration-200 border-2 text-center
                    ${isSelected
                      ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white border-[#1FA2DE] dark:border-sky-500 shadow-lg transform -translate-y-1'
                      : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-200 border-slate-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 hover:bg-sky-50 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  {t(key)}
                </button>
              );
            })}
          </div>
        </section>

        {/* Question 3 */}
        <section>
          <h2 className="font-serif text-[1.8rem] md:text-[2.2rem] text-[#0A3A78] dark:text-white mb-8 leading-tight transition-colors">
            {t('q3_text')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selfHarmKeys.map((key) => {
              const isSelected = selfHarm === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelfHarm(key)}
                  className={`
                    w-full px-6 py-5 rounded-2xl text-[1.1rem] font-medium transition-all duration-200 border-2 text-left flex justify-between items-center group
                    ${isSelected
                      ? 'bg-[#1FA2DE] dark:bg-sky-600 text-white border-[#1FA2DE] dark:border-sky-500 shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-200 border-slate-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 hover:bg-sky-50 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <span>{t(key)}</span>
                  {isSelected && <span className="bg-white text-[#1FA2DE] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Submit */}
        <div className="pt-8">
          <button
            onClick={handleFinish}
            disabled={!selfHarm || !impact}
            className={`
              w-full md:w-auto md:px-20 md:mx-auto block py-5 rounded-full text-[1.2rem] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl
              ${(!selfHarm || !impact)
                ? 'bg-[#E2E8F0] dark:bg-slate-800 text-[#94A3B8] dark:text-slate-500 cursor-not-allowed border border-transparent dark:border-slate-700'
                : 'bg-[#0A3157] dark:bg-sky-600 text-white hover:bg-[#124A85] dark:hover:bg-sky-500 hover:shadow-2xl hover:-translate-y-1'
              }
            `}
          >
            {t('submit_analyze')}
          </button>
        </div>

      </div>
    </div>
  );
};
