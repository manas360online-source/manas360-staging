import React, { useState } from 'react';
import { AlertCircle, RotateCcw, Save, ArrowLeft, ArrowRight } from 'lucide-react';

export const DepressionAssessment: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(-1));
  const [showResult, setShowResult] = useState(false);

  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way"
  ];

  const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
  ];

  const handleSelect = (val: number) => {
    const newA = [...answers];
    newA[currentQuestionIndex] = val;
    setAnswers(newA);
    
    // Auto advance after short delay if not last question
    if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
        }, 250);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        calculateResults();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    if (answers.includes(-1)) return;
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  const resetAssessment = () => {
    setAnswers(Array(9).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResult(false);
    window.scrollTo(0, 0);
  };

  const score = answers.reduce((a, b) => (b > -1 ? a + b : a), 0);
  const progress = ((currentQuestionIndex + 1) / 9) * 100;

  const getResultData = (totalScore: number) => {
    let severity, interpretation, recommendations, colorClass;

    if (totalScore <= 4) {
        severity = 'Minimal Depression';
        interpretation = 'Your responses suggest minimal or no depression symptoms. Continue monitoring your mental health and maintain healthy habits.';
        recommendations = '• Continue self-care practices\n• Stay connected with friends and family\n• Maintain regular exercise and sleep schedule\n• Consider preventive mental health check-ins';
        colorClass = 'from-[#84fab0] to-[#8fd3f4]';
    } else if (totalScore <= 9) {
        severity = 'Mild Depression';
        interpretation = 'Your responses suggest mild depression symptoms. Consider implementing self-help strategies and monitoring your symptoms.';
        recommendations = '• Try behavioral activation (scheduling pleasant activities)\n• Practice cognitive restructuring techniques\n• Consider therapy if symptoms persist\n• Monitor symptoms weekly\n• Ensure adequate sleep, nutrition, and exercise';
        colorClass = 'from-[#ffecd2] to-[#fcb69f]';
    } else if (totalScore <= 14) {
        severity = 'Moderate Depression';
        interpretation = 'Your responses suggest moderate depression. Professional support is recommended to help manage your symptoms.';
        recommendations = '• Schedule appointment with therapist or counselor\n• Consider starting psychotherapy (CBT recommended)\n• Discuss treatment options with healthcare provider\n• Implement both self-help and professional strategies\n• Weekly therapy sessions recommended';
        colorClass = 'from-[#ff9a9e] to-[#fecfef]';
    } else if (totalScore <= 19) {
        severity = 'Moderately Severe Depression';
        interpretation = 'Your responses suggest moderately severe depression. It is important to seek professional treatment promptly.';
        recommendations = '• Contact mental health professional immediately\n• Weekly therapy sessions essential\n• May benefit from combination of therapy and medication\n• Ensure strong support system\n• Consider intensive outpatient programs if needed';
        colorClass = 'from-[#ff9a9e] to-[#fecfef]';
    } else {
        severity = 'Severe Depression';
        interpretation = 'Your responses suggest severe depression. Please seek professional help immediately.';
        recommendations = '• Contact mental health professional or emergency services NOW\n• Intensive treatment recommended (may include hospitalization)\n• Combination therapy and medication typically needed\n• Daily monitoring and support essential\n• Crisis hotline: 988 (US) or local emergency services';
        colorClass = 'from-[#ff0844] to-[#ffb199]';
    }

    // Check for suicidal ideation (Question 9)
    if (answers[8] > 0) {
        recommendations = '⚠️ IMMEDIATE ACTION NEEDED:\n\n• Contact crisis helpline NOW: 988\n• Text HOME to 741741\n• Go to nearest emergency room\n• Call emergency services (911/112)\n• Do NOT wait - seek help immediately\n\n' + recommendations;
    }

    return { severity, interpretation, recommendations, colorClass };
  };

  const resultData = getResultData(score);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#a8edea] to-[#fed6e3] p-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-2">📊 Depression Assessment (PHQ-9)</h1>
        <p className="opacity-90 text-lg">Patient Health Questionnaire - 9 Item</p>
      </div>

      <div className="p-8">
        {!showResult ? (
            <div className="animate-fade-in">
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-gray-500 uppercase">Question {currentQuestionIndex + 1} of 9</span>
                        <span className="text-sm font-medium text-gray-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#a8edea] transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <p className="mb-8 text-gray-600 font-medium text-lg">Over the <strong className="text-gray-900">last 2 weeks</strong>, how often have you been bothered by any of the following problems?</p>
                
                <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#a8edea] min-h-[400px] flex flex-col justify-center">
                    <p className="font-bold text-gray-800 text-2xl mb-8 leading-tight">{questions[currentQuestionIndex]}</p>
                    
                    {currentQuestionIndex === 8 && (
                        <div className="mb-6 text-sm text-red-600 font-bold bg-red-50 p-4 rounded-lg border border-red-200">
                            ⚠️ If you select any value other than "0" for this question, please seek immediate help.
                        </div>
                    )}

                    <div className="space-y-3">
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 hover:translate-x-1 hover:shadow-sm ${
                                    answers[currentQuestionIndex] === opt.value
                                    ? 'border-[#a8edea] bg-[#a8edea]/20'
                                    : 'border-gray-200 bg-white hover:border-[#a8edea]'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors ${
                                    answers[currentQuestionIndex] === opt.value ? 'bg-[#a8edea] text-teal-900' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {opt.value}
                                </div>
                                <div className="font-medium text-gray-700 text-lg">{opt.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <button 
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>

                    <button 
                        onClick={handleNext}
                        disabled={answers[currentQuestionIndex] === -1}
                        className="px-6 py-3 bg-gradient-to-r from-[#a8edea] to-[#fed6e3] text-gray-800 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="text-center py-4 animate-fade-in">
                <div className={`w-40 h-40 mx-auto rounded-full flex flex-col items-center justify-center mb-8 bg-gradient-to-br ${resultData.colorClass} text-white shadow-xl`}>
                    <span className="text-5xl font-bold drop-shadow-sm">{score}</span>
                    <span className="text-sm font-medium opacity-90 mt-1">/ 27</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{resultData.severity}</h2>
                
                <div className="text-left space-y-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-2 text-lg">What this means:</h3>
                        <p className="text-gray-700 leading-relaxed">{resultData.interpretation}</p>
                    </div>

                    <div className={`p-6 rounded-xl border-2 ${answers[8] > 0 ? 'bg-red-50 border-red-500' : 'bg-[#D4EDDA] border-[#28A745]'}`}>
                        <h3 className={`font-bold mb-2 text-lg ${answers[8] > 0 ? 'text-red-800' : 'text-[#155724]'}`}>Recommended Actions:</h3>
                        <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm md:text-base">
                            {resultData.recommendations}
                        </pre>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={resetAssessment}
                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={20} /> Take Again
                    </button>
                    <button 
                        onClick={() => onComplete({ score, severity: resultData.severity, answers })} 
                        className="px-8 py-3 bg-gradient-to-r from-[#a8edea] to-[#fed6e3] text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={20} /> Save Results
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};