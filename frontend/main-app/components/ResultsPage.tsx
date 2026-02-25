
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ResultsPageProps {
  data: {
    symptoms: string[]; // now IDs
    impact: string;     // now ID
    selfHarm: string;   // now ID
  } | null;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ data }) => {
  const { t } = useTranslation();

  const handleBack = () => {
    window.location.hash = '#/assessment';
  };

  // Fallback if accessed directly without data
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] dark:bg-[#030712] transition-colors duration-500">
        <button onClick={() => window.location.hash = ''} className="text-blue-500 underline dark:text-sky-400">{t('return_home')}</button>
      </div>
    );
  }

  // Logic for Severity based on count
  const symptomCount = data.symptoms.length;
  let severity = t('mild');
  let emoji = "😊";
  let color = "text-emerald-600 dark:text-emerald-400";
  let message = t('msg_mild');

  if (symptomCount >= 3 && symptomCount < 6) {
    severity = t('moderate');
    emoji = "😟";
    color = "text-orange-500 dark:text-orange-400";
    message = t('msg_moderate');
  } else if (symptomCount >= 6) {
    severity = t('significant');
    emoji = "😞";
    color = "text-red-500 dark:text-red-400";
    message = t('msg_significant');
  }

  // Logic for Primary Condition based on IDs (Worry/Racing thoughts/Restless)
  const anxietyIndicators = ['symptom_3', 'symptom_4', 'symptom_11'];
  const primaryCondition = data.symptoms.some(s => anxietyIndicators.includes(s))
    ? t('condition_anxiety')
    : t('condition_depression');

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#030712] py-12 px-6 animate-fade-in flex flex-col items-center transition-colors duration-500 relative">

      {/* Absolute Top Right Icon - Adjusted for mobile */}
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
          <h1 className="font-serif text-[#0A3A78] dark:text-white font-bold text-xl md:text-2xl tracking-widest uppercase text-center">
            Assessment Results
          </h1>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 text-center transition-colors duration-500">

        <div className="text-[5rem] mb-4 animate-float filter dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{emoji}</div>

        <h1 className="font-serif text-[2.5rem] text-wellness-slate dark:text-white mb-2 transition-colors">
          {severity} {t('distress_label')}
        </h1>

        <p className={`text-lg font-medium mb-8 ${color} transition-colors`}>
          {message}
        </p>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 text-left mb-12 transition-colors border border-transparent dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{t('summary_analysis')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('primary_concern')}</p>
              <p className="text-xl font-serif text-wellness-slate dark:text-slate-100 font-medium transition-colors">{primaryCondition} {t('indicators')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('impact_life')}</p>
              <p className="text-xl font-serif text-wellness-slate dark:text-slate-100 font-medium transition-colors">{t(data.impact)}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{t('key_symptoms')}</p>
              <div className="flex flex-wrap gap-2">
                {data.symptoms.slice(0, 3).map(id => (
                  <span key={id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors">
                    {t(id)}
                  </span>
                ))}
                {data.symptoms.length > 3 && (
                  <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg text-sm text-slate-400 dark:text-slate-500 transition-colors">
                    +{data.symptoms.length - 3} {t('more_symptoms')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">

          {/* Primary Action: See Matched Therapists */}
          <button
            onClick={() => window.location.hash = '#/therapist-matching/'}
            className="
              w-full py-4 px-6
              bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white
              rounded-full font-sans font-bold text-[1.1rem]
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:brightness-110
              transition-all duration-300 ease-out
              flex items-center justify-center gap-2
            "
          >
            See Matched Therapists →
          </button>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Secondary Action: AI Chat */}
            <button
              onClick={() => window.location.hash = '#/meera-chat'}
              className="
                group flex-1 py-4 px-5
                bg-white dark:bg-slate-800 border-2 border-[#1FA2DE] dark:border-sky-500 text-[#1FA2DE] dark:text-sky-400
                rounded-full font-sans font-bold text-[1rem]
                transition-all duration-300 ease-out
                hover:bg-[#1FA2DE] dark:hover:bg-sky-600 hover:text-white dark:hover:text-white hover:shadow-md
                active:scale-[0.98]
                flex items-center justify-center gap-2
              "
            >
              <span>🤖</span> Try Free AI Chat First
            </button>

            {/* Tertiary: Full Assessment */}
            <button
              onClick={() => window.location.hash = '#/full-assessment'}
              className="
                group flex-1 py-4 px-5
                bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300
                rounded-full font-sans font-bold text-[1rem]
                transition-all duration-300 ease-out
                hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500
                active:scale-[0.98]
                flex items-center justify-center gap-2
              "
            >
              <span>🩺</span> {t('full_assessment')}
            </button>
          </div>

          <button
            onClick={() => window.location.hash = '#/home'}
            className="
              w-full py-3
              text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300
              font-medium text-sm underline decoration-slate-300 underline-offset-4
              transition-colors
            "
          >
            {t('skip_return')}
          </button>
        </div>

      </div>

    </div>
  );
};
