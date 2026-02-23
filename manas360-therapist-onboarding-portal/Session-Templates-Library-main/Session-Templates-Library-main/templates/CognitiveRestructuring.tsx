import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

const ACCENT_BLUE = '#1D72FE';

export const CognitiveRestructuring: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    situation: '',
    thoughts: '',
    emotions: { anxiety: '', sadness: '', anger: '', shame: '', other: '', otherName: '' },
    evidenceFor: '',
    evidenceAgainst: '',
    distortions: [] as string[],
    alternativeThought: '',
    emotionsAfter: { anxiety: '', sadness: '', anger: '', shame: '', other: '' }
  });

  const nextStep = () => {
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleEmotionChange = (type: string, value: string, isAfter: boolean = false) => {
    const key = isAfter ? 'emotionsAfter' : 'emotions';
    setData(prev => ({
        ...prev,
        [key]: { ...prev[key as 'emotions' | 'emotionsAfter'], [type]: value }
    }));
  };

  const handleDistortionToggle = (distortion: string) => {
    setData(prev => {
      const exists = prev.distortions.includes(distortion);
      return {
        ...prev,
        distortions: exists 
          ? prev.distortions.filter(d => d !== distortion)
          : [...prev.distortions, distortion]
      };
    });
  };

  const distortionsList = [
      { id: 'all-or-nothing', label: 'All-or-Nothing Thinking', desc: 'Seeing things in black-and-white categories' },
      { id: 'overgeneralization', label: 'Overgeneralization', desc: 'Seeing a single negative event as a never-ending pattern' },
      { id: 'mental-filter', label: 'Mental Filter', desc: 'Focusing only on negative details' },
      { id: 'discounting', label: 'Discounting the Positive', desc: 'Insisting positive experiences "don\'t count"' },
      { id: 'jumping', label: 'Jumping to Conclusions', desc: 'Making negative interpretations without facts' },
      { id: 'catastrophizing', label: 'Catastrophizing', desc: 'Expecting disaster' },
      { id: 'emotional', label: 'Emotional Reasoning', desc: '"I feel it, therefore it must be true"' },
      { id: 'shoulds', label: 'Should Statements', desc: 'Using "should," "must," or "ought"' },
      { id: 'labeling', label: 'Labeling', desc: 'Attaching a negative label to yourself or others' },
      { id: 'personalization', label: 'Personalization', desc: 'Blaming yourself for something you weren\'t responsible for' }
  ];

  const progress = Math.min(((step) / 8) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
      <div style={{background: `linear-gradient(to right, ${ACCENT_BLUE}, #3b82f6)`}} className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">🧠 Cognitive Restructuring</h1>
        <p className="opacity-90 text-lg text-white/90">Challenge and change negative thought patterns</p>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase font-semibold">Duration</div>
          <div style={{color: ACCENT_BLUE}} className="font-bold">45-60 min</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase font-semibold">Difficulty</div>
          <div style={{color: ACCENT_BLUE}} className="font-bold">Moderate</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase font-semibold">Focus</div>
          <div style={{color: ACCENT_BLUE}} className="font-bold">Thoughts</div>
        </div>
      </div>

      <div className="h-2 bg-gray-100 w-full">
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: ACCENT_BLUE }}
        />
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">1</span>
              <h2 className="text-2xl font-bold text-gray-800">Identify the Triggering Situation</h2>
            </div>
            <p className="text-gray-600 mb-6">Think of a recent situation where you felt distressed, anxious, or upset. Be specific about what happened, when, where, and who was involved.</p>
            
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg mb-6 shadow-sm">
              <span style={{color: ACCENT_BLUE}} className="font-bold block mb-1">Example:</span>
              <p className="text-gray-700 italic">"My boss criticized my presentation in front of the team during yesterday's meeting."</p>
            </div>

            <label className="block font-bold text-gray-700 mb-2">Your situation:</label>
            <textarea 
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-[#1D72FE] outline-none transition-colors min-h-[120px]"
              placeholder="Describe the situation in detail..."
              value={data.situation}
              onChange={e => setData({...data, situation: e.target.value})}
            />
            
            <div className="flex justify-end mt-8">
              <button onClick={nextStep} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">2</span>
              <h2 className="text-2xl font-bold text-gray-800">Identify Automatic Thoughts</h2>
            </div>
            <p className="text-gray-600 mb-4">What thoughts went through your mind during or immediately after this situation? Write down everything that came to mind, even if it seems irrational.</p>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
              <strong style={{color: ACCENT_BLUE}}>💡 Tip:</strong>
              <span className="text-blue-900 ml-2">Automatic thoughts are often in "shorthand" - brief statements or images that flash through your mind.</span>
            </div>

            <label className="block font-bold text-gray-700 mb-2">Automatic thoughts:</label>
            <textarea 
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-[#1D72FE] outline-none transition-colors min-h-[120px]"
              placeholder="e.g., 'I'm terrible at my job'..."
              value={data.thoughts}
              onChange={e => setData({...data, thoughts: e.target.value})}
            />
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={nextStep} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">3</span>
              <h2 className="text-2xl font-bold text-gray-800">Identify Emotions & Rate Intensity</h2>
            </div>
            <p className="text-gray-600 mb-6">What emotions did you feel? Rate the intensity of each emotion from 0 (not at all) to 10 (extremely intense).</p>
            
            <div className="overflow-hidden border border-gray-100 rounded-lg mb-6">
                <table className="w-full text-left border-collapse">
                    <thead style={{backgroundColor: ACCENT_BLUE}} className="text-white">
                        <tr>
                            <th className="p-4 font-bold uppercase text-xs tracking-widest">Emotion</th>
                            <th className="p-4 font-bold uppercase text-xs tracking-widest w-40">Intensity (0-10)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {['Anxiety', 'Sadness', 'Anger', 'Shame'].map((emotion) => (
                            <tr key={emotion} className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-700 font-medium">{emotion}</td>
                                <td className="p-4">
                                    <input 
                                        type="number" 
                                        min="0" max="10"
                                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-[#1D72FE] outline-none transition-all"
                                        placeholder="0-10"
                                        value={data.emotions[emotion.toLowerCase() as keyof typeof data.emotions] as string}
                                        onChange={(e) => handleEmotionChange(emotion.toLowerCase(), e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={nextStep} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">4</span>
              <h2 className="text-2xl font-bold text-gray-800">Examine the Evidence</h2>
            </div>
            <p className="text-gray-600 mb-6">Now let's look at your automatic thoughts objectively. What evidence supports them? What evidence contradicts them?</p>
            
            <label className="block font-bold text-gray-700 mb-2">Evidence FOR your thought:</label>
            <textarea 
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-[#1D72FE] outline-none transition-colors min-h-[100px] mb-6"
              placeholder="Facts only..."
              value={data.evidenceFor}
              onChange={e => setData({...data, evidenceFor: e.target.value})}
            />

            <label className="block font-bold text-gray-700 mb-2">Evidence AGAINST your thought:</label>
            <textarea 
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-[#1D72FE] outline-none transition-colors min-h-[100px] mb-6"
              placeholder="Facts only..."
              value={data.evidenceAgainst}
              onChange={e => setData({...data, evidenceAgainst: e.target.value})}
            />
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={nextStep} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">5</span>
              <h2 className="text-2xl font-bold text-gray-800">Identify Cognitive Distortions</h2>
            </div>
            <p className="text-gray-600 mb-6">Which thinking traps might you be falling into?</p>
            
            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 space-y-4">
                {distortionsList.map((dist) => (
                    <label key={dist.id} className="flex items-start gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            style={{accentColor: ACCENT_BLUE}}
                            className="mt-1.5 w-4 h-4 rounded border-gray-300"
                            checked={data.distortions.includes(dist.id)}
                            onChange={() => handleDistortionToggle(dist.id)}
                        />
                        <div>
                            <span style={{color: data.distortions.includes(dist.id) ? ACCENT_BLUE : '#1F2937'}} className="font-bold transition-colors">{dist.label}:</span>
                            <span className="text-gray-500 text-sm ml-1">{dist.desc}</span>
                        </div>
                    </label>
                ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={nextStep} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">6</span>
              <h2 className="text-2xl font-bold text-gray-800">Balanced Thoughts</h2>
            </div>
            <textarea 
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-[#1D72FE] outline-none transition-colors min-h-[150px] mb-6"
              placeholder="Write a more realistic way of thinking..."
              value={data.alternativeThought}
              onChange={e => setData({...data, alternativeThought: e.target.value})}
            />
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={nextStep} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <span style={{backgroundColor: ACCENT_BLUE}} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold mr-3">7</span>
              <h2 className="text-2xl font-bold text-gray-800">Final Emotion Check</h2>
            </div>
            <div className="overflow-hidden border border-gray-100 rounded-lg mb-8">
                <table className="w-full text-left border-collapse">
                    <thead style={{backgroundColor: ACCENT_BLUE}} className="text-white">
                        <tr>
                            <th className="p-4 font-bold uppercase text-xs tracking-widest">Emotion</th>
                            <th className="p-4 font-bold uppercase text-xs tracking-widest w-40">New Intensity (0-10)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {['Anxiety', 'Sadness', 'Anger', 'Shame'].map((emotion) => (
                            <tr key={emotion} className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-700 font-medium">{emotion}</td>
                                <td className="p-4">
                                    <input 
                                        type="number" 
                                        min="0" max="10"
                                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-[#1D72FE] outline-none transition-all"
                                        placeholder="0-10"
                                        value={data.emotionsAfter[emotion.toLowerCase() as keyof typeof data.emotionsAfter] as string}
                                        onChange={(e) => handleEmotionChange(emotion.toLowerCase(), e.target.value, true)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={() => setStep(8)} style={{backgroundColor: ACCENT_BLUE}} className="px-6 py-3 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                Complete Session <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="animate-fade-in text-center py-12">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                <CheckCircle size={48} />
             </div>
             <h3 className="text-3xl font-bold text-gray-900 mb-4">Session Complete!</h3>
             <p className="text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">Great work. You've successfully identified and challenged your thought patterns.</p>
             <button 
                onClick={() => onComplete(data)} 
                style={{backgroundColor: ACCENT_BLUE}}
                className="px-10 py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest"
             >
                Save Results
             </button>
          </div>
        )}
      </div>
    </div>
  );
};