import React, { useState, useEffect } from 'react';
import { Play, Pause, ArrowLeft, ArrowRight } from 'lucide-react';

export const AnxietyManagement: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingText, setBreathingText] = useState('BREATHE');
  const [breathingScale, setBreathingScale] = useState(1);
  
  // Data State
  const [grounding, setGrounding] = useState({
    see: '',
    touch: '',
    hear: '',
    smell: '',
    taste: ''
  });
  
  const [worryTime, setWorryTime] = useState({
    time: '',
    activity: ''
  });
  
  const [anxietyScale, setAnxietyScale] = useState({
    before: '',
    after: ''
  });

  const nextStep = () => {
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const progress = (step / 5) * 100;

  // Breathing Logic
  useEffect(() => {
    let interval: any;
    let timeoutIds: any[] = [];
    
    if (breathingActive) {
      const runCycle = () => {
        // Inhale (4s)
        setBreathingText('Inhale (4)');
        setBreathingScale(1.3); // Expand
        
        const t1 = setTimeout(() => {
          // Hold (7s)
          setBreathingText('Hold (7)');
          setBreathingScale(1.3); // Stay expanded
          
          const t2 = setTimeout(() => {
            // Exhale (8s)
            setBreathingText('Exhale (8)');
            setBreathingScale(1); // Contract
          }, 7000);
          timeoutIds.push(t2);

        }, 4000);
        timeoutIds.push(t1);
      };

      runCycle(); // Initial run
      interval = setInterval(runCycle, 19000); // 4 + 7 + 8 = 19s total cycle
    } else {
      setBreathingText('BREATHE');
      setBreathingScale(1);
      timeoutIds.forEach(clearTimeout);
    }

    return () => {
      clearInterval(interval);
      timeoutIds.forEach(clearTimeout);
    };
  }, [breathingActive]);

  const handleComplete = () => {
    onComplete({
      grounding,
      worryTime,
      anxietyScale
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">🌊 Anxiety Management Toolkit</h1>
            <p className="opacity-90 text-lg">Evidence-based techniques to calm your mind and body</p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
            <div 
                className="h-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
            />
        </div>

        <div className="p-8 space-y-8">
            {/* Technique 1: Breathing */}
            {step === 1 && (
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#4facfe] animate-fade-in">
                    <h2 className="text-xl font-bold text-[#4facfe] mb-4">1. 4-7-8 Breathing Technique</h2>
                    <p className="text-gray-600 mb-6">This breathing pattern activates your parasympathetic nervous system, promoting immediate calm.</p>
                    
                    <div className="flex flex-col items-center justify-center my-8">
                        <div 
                            className="w-48 h-48 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-transform ease-in-out"
                            style={{ 
                                transform: `scale(${breathingScale})`,
                                transitionDuration: breathingText.includes('Inhale') ? '4000ms' : breathingText.includes('Exhale') ? '8000ms' : '0ms'
                            }}
                        >
                            {breathingText}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <button 
                            onClick={() => setBreathingActive(!breathingActive)}
                            className="px-8 py-3 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                        >
                            {breathingActive ? <><Pause size={20} /> Pause Breathing</> : <><Play size={20} /> Start Guided Breathing</>}
                        </button>
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 mb-8">
                        <li>Inhale through nose for 4 counts</li>
                        <li>Hold breath for 7 counts</li>
                        <li>Exhale through mouth for 8 counts</li>
                        <li>Repeat 4-8 times</li>
                    </ul>

                    <div className="flex justify-end">
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Next Technique <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Technique 2: Grounding */}
            {step === 2 && (
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#4facfe] animate-fade-in">
                    <h2 className="text-xl font-bold text-[#4facfe] mb-4">2. 5-4-3-2-1 Grounding Exercise</h2>
                    <p className="text-gray-600 mb-6">Ground yourself in the present moment using your five senses:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center">
                            <div className="text-3xl mb-2">👁️</div>
                            <div className="font-bold text-gray-800 mb-2">5 Things You SEE</div>
                            <textarea 
                                className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px]" 
                                placeholder="List 5 things..."
                                value={grounding.see}
                                onChange={(e) => setGrounding({...grounding, see: e.target.value})}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center">
                            <div className="text-3xl mb-2">🤚</div>
                            <div className="font-bold text-gray-800 mb-2">4 Things You TOUCH</div>
                            <textarea 
                                className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px]" 
                                placeholder="List 4 things..."
                                value={grounding.touch}
                                onChange={(e) => setGrounding({...grounding, touch: e.target.value})}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center">
                            <div className="text-3xl mb-2">👂</div>
                            <div className="font-bold text-gray-800 mb-2">3 Things You HEAR</div>
                            <textarea 
                                className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px]" 
                                placeholder="List 3 things..."
                                value={grounding.hear}
                                onChange={(e) => setGrounding({...grounding, hear: e.target.value})}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center">
                            <div className="text-3xl mb-2">👃</div>
                            <div className="font-bold text-gray-800 mb-2">2 Things You SMELL</div>
                            <textarea 
                                className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px]" 
                                placeholder="List 2 things..."
                                value={grounding.smell}
                                onChange={(e) => setGrounding({...grounding, smell: e.target.value})}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center md:col-span-2 lg:col-span-1">
                            <div className="text-3xl mb-2">👅</div>
                            <div className="font-bold text-gray-800 mb-2">1 Thing You TASTE</div>
                            <textarea 
                                className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px]" 
                                placeholder="List 1 thing..."
                                value={grounding.taste}
                                onChange={(e) => setGrounding({...grounding, taste: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Next Technique <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Technique 3: PMR */}
            {step === 3 && (
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#4facfe] animate-fade-in">
                    <h2 className="text-xl font-bold text-[#4facfe] mb-4">3. Progressive Muscle Relaxation</h2>
                    <p className="text-gray-600 mb-4">Systematically tense and release muscle groups:</p>
                    
                    <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4 mb-6">
                        <li><strong className="text-gray-900">Fists:</strong> Clench tight for 5 seconds, then release</li>
                        <li><strong className="text-gray-900">Arms:</strong> Tense biceps, hold, release</li>
                        <li><strong className="text-gray-900">Shoulders:</strong> Raise to ears, hold, drop</li>
                        <li><strong className="text-gray-900">Face:</strong> Scrunch facial muscles, hold, relax</li>
                        <li><strong className="text-gray-900">Stomach:</strong> Tighten abs, hold, release</li>
                        <li><strong className="text-gray-900">Legs:</strong> Tense thighs and calves, hold, release</li>
                        <li><strong className="text-gray-900">Feet:</strong> Curl toes, hold, release</li>
                    </ol>

                    <div className="bg-[#D4EDDA] border-2 border-[#28A745] p-4 rounded-lg text-[#155724] mb-8">
                        <strong>💡 Tip:</strong> Notice the difference between tension and relaxation in each muscle group.
                    </div>

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Next Technique <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Technique 4: Worry Time */}
            {step === 4 && (
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#4facfe] animate-fade-in">
                    <h2 className="text-xl font-bold text-[#4facfe] mb-4">4. Worry Time Technique</h2>
                    <p className="text-gray-600 mb-4">Contain your worries to a specific time rather than letting them intrude all day.</p>
                    
                    <label className="block font-bold text-gray-700 mb-2">Schedule your daily "worry time" (15-30 minutes):</label>
                    <input 
                        type="time" 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#4facfe] outline-none transition-colors mb-4"
                        value={worryTime.time}
                        onChange={(e) => setWorryTime({...worryTime, time: e.target.value})}
                    />

                    <label className="block font-bold text-gray-700 mb-2">What will you do during worry time?</label>
                    <textarea 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#4facfe] outline-none transition-colors mb-2 min-h-[100px]"
                        placeholder="e.g., 'Write down all worries, then problem-solve or let go'"
                        value={worryTime.activity}
                        onChange={(e) => setWorryTime({...worryTime, activity: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mb-8">When worries arise outside this time, tell yourself: "I'll think about this during my worry time at [scheduled time]"</p>

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Next Technique <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Technique 5: Anxiety Scale */}
            {step === 5 && (
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#4facfe] animate-fade-in">
                    <h2 className="text-xl font-bold text-[#4facfe] mb-4">5. Anxiety Scale Check-In</h2>
                    <p className="text-gray-600 mb-6">Rate your current anxiety level (0-10) before and after using these techniques:</p>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block font-bold text-gray-700 mb-2">Before (0-10):</label>
                            <input 
                                type="number" 
                                min="0" max="10" 
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#4facfe] outline-none transition-colors"
                                placeholder="0-10"
                                value={anxietyScale.before}
                                onChange={(e) => setAnxietyScale({...anxietyScale, before: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-gray-700 mb-2">After (0-10):</label>
                            <input 
                                type="number" 
                                min="0" max="10" 
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#4facfe] outline-none transition-colors"
                                placeholder="0-10"
                                value={anxietyScale.after}
                                onChange={(e) => setAnxietyScale({...anxietyScale, after: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button 
                            onClick={handleComplete} 
                            className="flex-1 py-3 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                        >
                            Complete Session ✓
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};