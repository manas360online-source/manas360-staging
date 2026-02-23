import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ExposureTherapy: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    fear: '',
    impact: '',
    currentSuds: '',
    hierarchy: [
      { suds: 20, situation: '' },
      { suds: 35, situation: '' },
      { suds: 50, situation: '' },
      { suds: 65, situation: '' },
      { suds: 80, situation: '' },
      { suds: 95, situation: '' },
    ],
    plan: {
      situation: '',
      when: '',
      safetyBehaviors: ''
    }
  });

  const nextStep = () => {
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const updateHierarchy = (index: number, field: 'suds' | 'situation', value: any) => {
    const newH = [...data.hierarchy];
    newH[index] = { ...newH[index], [field]: value };
    setData({ ...data, hierarchy: newH });
  };

  const getSudsColor = (suds: number) => {
      if (suds <= 30) return 'bg-green-100 text-green-800 border-green-200';
      if (suds <= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      return 'bg-red-100 text-red-800 border-red-200';
  };

  const progress = (step / 5) * 100;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#f093fb] to-[#f5576c] p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">🎯 Exposure Therapy Planning</h1>
        <p className="opacity-90 text-lg">Face your fears gradually and safely</p>
      </div>

      {/* Session Info */}
      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border-b border-gray-100">
        <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</div>
            <div className="text-[#f5576c] font-bold text-lg">45-60 min</div>
        </div>
        <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Difficulty</div>
            <div className="text-[#f5576c] font-bold text-lg">Moderate-High</div>
        </div>
        <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Focus</div>
            <div className="text-[#f5576c] font-bold text-lg">Anxiety/Fears</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 w-full">
        <div 
          className="h-full bg-gradient-to-r from-[#f093fb] to-[#f5576c] transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="p-8">
        {/* Step 1 */}
        {step === 1 && (
            <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                    <span className="w-8 h-8 rounded-full bg-[#f5576c] text-white flex items-center justify-center font-bold mr-3">1</span>
                    <h2 className="text-2xl font-bold text-gray-800">Identify Your Fear/Anxiety</h2>
                </div>
                
                <label className="block font-bold text-gray-700 mb-2">What situation, object, or activity are you avoiding due to anxiety?</label>
                <textarea 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#f093fb] outline-none transition-colors mb-6 min-h-[100px]"
                    placeholder="e.g., 'Public speaking', 'Flying', 'Social situations', 'Spiders'..."
                    value={data.fear}
                    onChange={(e) => setData({...data, fear: e.target.value})}
                />

                <label className="block font-bold text-gray-700 mb-2">How does this fear impact your life?</label>
                <textarea 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#f093fb] outline-none transition-colors mb-8 min-h-[100px]"
                    placeholder="Describe how avoiding this has affected your work, relationships, or daily life..."
                    value={data.impact}
                    onChange={(e) => setData({...data, impact: e.target.value})}
                />

                <div className="flex justify-end">
                    <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
            <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                    <span className="w-8 h-8 rounded-full bg-[#f5576c] text-white flex items-center justify-center font-bold mr-3">2</span>
                    <h2 className="text-2xl font-bold text-gray-800">Rate Your Current Fear Level</h2>
                </div>
                <p className="text-gray-600 mb-6">On a scale of 0-100 (SUDS - Subjective Units of Distress), how anxious do you feel thinking about this fear?</p>
                
                <div className="mb-8">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f5576c] mb-4"
                        value={data.currentSuds}
                        onChange={(e) => setData({...data, currentSuds: e.target.value})}
                    />
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            className="w-24 p-3 border-2 border-gray-200 rounded-lg focus:border-[#f093fb] outline-none text-center font-bold text-xl"
                            placeholder="0"
                            value={data.currentSuds}
                            onChange={(e) => setData({...data, currentSuds: e.target.value})}
                        />
                        <span className="text-gray-500 font-medium">/ 100</span>
                    </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 mb-8">
                    <strong>SUDS Scale:</strong> 0=No anxiety, 25=Mild, 50=Moderate, 75=High, 100=Extreme panic
                </div>

                <div className="flex justify-between">
                    <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
            <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                    <span className="w-8 h-8 rounded-full bg-[#f5576c] text-white flex items-center justify-center font-bold mr-3">3</span>
                    <h2 className="text-2xl font-bold text-gray-800">Build Your Fear Hierarchy</h2>
                </div>
                <p className="text-gray-600 mb-6">List situations related to your fear from least to most anxiety-provoking. Rate each 0-100.</p>
                
                <div className="space-y-3 mb-8">
                    {data.hierarchy.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white border-2 border-gray-100 rounded-lg transition-colors hover:border-[#f093fb]">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${getSudsColor(item.suds)}`}>
                                 <input 
                                    type="number"
                                    className="w-full h-full bg-transparent text-center outline-none"
                                    value={item.suds}
                                    onChange={(e) => updateHierarchy(idx, 'suds', parseInt(e.target.value))}
                                 />
                            </div>
                            <input 
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 font-medium"
                                placeholder={
                                    idx === 0 ? "Easiest situation (e.g., 'Watch video of spider')" : 
                                    idx === 5 ? "Hardest situation (e.g., 'Hold large spider')" : 
                                    "Describe situation..."
                                }
                                value={item.situation}
                                onChange={(e) => updateHierarchy(idx, 'situation', e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
            <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                    <span className="w-8 h-8 rounded-full bg-[#f5576c] text-white flex items-center justify-center font-bold mr-3">4</span>
                    <h2 className="text-2xl font-bold text-gray-800">Plan Your First Exposure</h2>
                </div>
                
                <label className="block font-bold text-gray-700 mb-2">Choose a situation from your hierarchy (start with SUDS 20-40):</label>
                <input 
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#f093fb] outline-none transition-colors mb-6"
                    placeholder="What will you do?"
                    value={data.plan.situation}
                    onChange={(e) => setData({...data, plan: {...data.plan, situation: e.target.value}})}
                />

                <label className="block font-bold text-gray-700 mb-2">When will you do this?</label>
                <input 
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#f093fb] outline-none transition-colors mb-6"
                    placeholder="Day, time, duration"
                    value={data.plan.when}
                    onChange={(e) => setData({...data, plan: {...data.plan, when: e.target.value}})}
                />

                <label className="block font-bold text-gray-700 mb-2">Safety behaviors to eliminate (optional):</label>
                <textarea 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#f093fb] outline-none transition-colors mb-6 min-h-[100px]"
                    placeholder="What coping behaviors might prevent you from fully experiencing the exposure? (e.g., 'holding someone's hand', 'wearing sunglasses')"
                    value={data.plan.safetyBehaviors}
                    onChange={(e) => setData({...data, plan: {...data.plan, safetyBehaviors: e.target.value}})}
                />

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 mb-8">
                    <strong>💡 Key Rules:</strong><br/>
                    • Stay in situation until anxiety reduces by at least 50%<br/>
                    • Don't leave while anxiety is peaking<br/>
                    • Repeat same exposure until SUDS drops below 30<br/>
                    • Then move to next level
                </div>

                <div className="flex justify-between">
                    <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
            <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                    <span className="w-8 h-8 rounded-full bg-[#f5576c] text-white flex items-center justify-center font-bold mr-3">5</span>
                    <h2 className="text-2xl font-bold text-gray-800">Track Your Progress</h2>
                </div>
                <p className="text-gray-600 mb-4">After each exposure, record:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8 ml-4">
                    <li>Peak SUDS during exposure</li>
                    <li>Final SUDS at end</li>
                    <li>Duration of exposure</li>
                    <li>What you learned</li>
                    <li>Next exposure plan</li>
                </ul>

                <div className="flex justify-between gap-4">
                    <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button 
                        onClick={() => onComplete(data)} 
                        className="flex-1 py-3 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
                    >
                        Complete Planning ✓
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};