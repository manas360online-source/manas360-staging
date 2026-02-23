import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Activity, BookOpen, Music, Users, Coffee, PenTool } from 'lucide-react';

export const BehavioralActivation: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    activityLevel: 0,
    avoidedActivities: '',
    moodImpact: '',
    selectedActivities: [] as string[],
    customActivity: '',
    meaningfulActivities: {
        work: '',
        relationships: '',
        health: '',
        growth: '',
        home: ''
    },
    schedule: [
        { day: 'Monday', time: '', activity: '', duration: '' },
        { day: 'Tuesday', time: '', activity: '', duration: '' },
        { day: 'Wednesday', time: '', activity: '', duration: '' },
        { day: 'Thursday', time: '', activity: '', duration: '' },
        { day: 'Friday', time: '', activity: '', duration: '' },
        { day: 'Saturday', time: '', activity: '', duration: '' },
        { day: 'Sunday', time: '', activity: '', duration: '' },
    ],
    barriers: '',
    solutions: ''
  });

  const nextStep = () => {
      setStep(s => s + 1);
      window.scrollTo(0,0);
  };
  
  const prevStep = () => {
      setStep(s => s - 1);
      window.scrollTo(0,0);
  };

  const toggleActivity = (name: string) => {
    setData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(name)
        ? prev.selectedActivities.filter(a => a !== name)
        : [...prev.selectedActivities, name]
    }));
  };
  
  const updateSchedule = (index: number, field: string, value: string) => {
      const newSchedule = [...data.schedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      setData({...data, schedule: newSchedule});
  };

  const updateMeaningful = (field: string, value: string) => {
      setData(prev => ({
          ...prev,
          meaningfulActivities: { ...prev.meaningfulActivities, [field]: value }
      }));
  };

  const prebuiltActivities = [
    { icon: '🚶', name: 'Walking', desc: 'Short walk outside' },
    { icon: '📚', name: 'Reading', desc: 'Book or article' },
    { icon: '🎵', name: 'Music', desc: 'Listen or play' },
    { icon: '👥', name: 'Social', desc: 'Call or meet friend' },
    { icon: '🍳', name: 'Cooking', desc: 'Prepare a meal' },
    { icon: '🎨', name: 'Creative', desc: 'Art, writing, craft' },
    { icon: '🏃', name: 'Exercise', desc: 'Any physical activity' },
    { icon: '🌱', name: 'Nature', desc: 'Garden, park visit' },
    { icon: '🎮', name: 'Gaming', desc: 'Video or board games' },
    { icon: '🧘', name: 'Relaxation', desc: 'Meditation, yoga' },
    { icon: '📺', name: 'Entertainment', desc: 'Movie, show' },
    { icon: '🛠️', name: 'Hobby', desc: 'Personal project' },
  ];

  const moodLevels = [
      { level: 1, emoji: '😴', label: 'Very Low' },
      { level: 2, emoji: '😐', label: 'Low' },
      { level: 3, emoji: '🙂', label: 'Moderate' },
      { level: 4, emoji: '😊', label: 'Active' },
      { level: 5, emoji: '🤩', label: 'Very Active' },
  ];

  const progress = (step / 7) * 100;

  return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden font-sans">
        {/* Header matching HTML style */}
        <div className="bg-gradient-to-br from-[#11998e] to-[#38ef7d] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">⚡ Behavioral Activation</h1>
            <p className="opacity-90 text-lg">Break the cycle of inactivity and depression through action</p>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border-b border-gray-100">
            <div className="text-center">
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Duration</div>
                <div className="text-[#11998e] font-bold text-lg">30-45 min</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Difficulty</div>
                <div className="text-[#11998e] font-bold text-lg">Easy-Moderate</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Focus</div>
                <div className="text-[#11998e] font-bold text-lg">Action & Mood</div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
            <div 
                className="h-full bg-gradient-to-r from-[#11998e] to-[#38ef7d] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
            />
        </div>

        <div className="p-8">
            {/* Step 1 */}
            {step === 1 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#11998e] text-white flex items-center justify-center font-bold mr-3">1</span>
                        <h2 className="text-2xl font-bold text-gray-800">Assess Your Current Activity Level</h2>
                    </div>
                    <p className="text-gray-600 mb-6">How active have you been in the past week? Rate your overall activity level:</p>

                    <div className="flex gap-2 md:gap-4 mb-8">
                        {moodLevels.map((m) => (
                            <button
                                key={m.level}
                                onClick={() => setData({...data, activityLevel: m.level})}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                                    data.activityLevel === m.level 
                                    ? 'border-[#11998e] bg-[#11998e]/10 shadow-md' 
                                    : 'border-gray-200 hover:border-[#11998e]'
                                }`}
                            >
                                <div className="text-3xl mb-2">{m.emoji}</div>
                                <div className="font-bold text-sm text-gray-700">{m.label}</div>
                            </button>
                        ))}
                    </div>

                    <label className="block font-bold text-gray-700 mb-2">What activities have you been avoiding or doing less of?</label>
                    <textarea 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#11998e] outline-none transition-colors min-h-[100px] mb-6"
                        placeholder="List activities you've stopped doing or do less frequently..."
                        value={data.avoidedActivities}
                        onChange={(e) => setData({...data, avoidedActivities: e.target.value})}
                    />

                    <div className="flex justify-end">
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#11998e] text-white flex items-center justify-center font-bold mr-3">2</span>
                        <h2 className="text-2xl font-bold text-gray-800">Understand the Mood-Activity Connection</h2>
                    </div>
                    <p className="text-gray-600 mb-6">When we feel depressed or anxious, we often withdraw and become less active. This creates a vicious cycle: inactivity → worse mood → more inactivity.</p>

                    <div className="bg-[#FFF3CD] border-2 border-[#FFC107] p-4 rounded-xl mb-6 text-[#856404]">
                        <strong>🔄 The Cycle:</strong> Low mood → Avoid activities → Feel worse → Avoid more → Even lower mood
                    </div>

                    <label className="block font-bold text-gray-700 mb-2">How has reduced activity affected your mood?</label>
                    <textarea 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#11998e] outline-none transition-colors min-h-[120px] mb-6"
                        placeholder="Describe how being less active has made you feel..."
                        value={data.moodImpact}
                        onChange={(e) => setData({...data, moodImpact: e.target.value})}
                    />

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#11998e] text-white flex items-center justify-center font-bold mr-3">3</span>
                        <h2 className="text-2xl font-bold text-gray-800">Identify Pleasurable Activities</h2>
                    </div>
                    <p className="text-gray-600 mb-6">Select activities that you used to enjoy or think you might find pleasurable. Choose at least 3:</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {prebuiltActivities.map((act) => (
                            <div 
                                key={act.name}
                                onClick={() => toggleActivity(act.name)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                                    data.selectedActivities.includes(act.name)
                                    ? 'border-[#11998e] bg-[#11998e]/10'
                                    : 'border-gray-200 hover:border-[#11998e]'
                                }`}
                            >
                                <div className="text-3xl mb-2">{act.icon}</div>
                                <div className="font-bold text-gray-800">{act.name}</div>
                                <div className="text-xs text-gray-500">{act.desc}</div>
                            </div>
                        ))}
                    </div>

                    <label className="block font-bold text-gray-700 mb-2">Other activities (optional):</label>
                    <input 
                        type="text"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#11998e] outline-none transition-colors mb-6"
                        placeholder="Add your own activities..."
                        value={data.customActivity}
                        onChange={(e) => setData({...data, customActivity: e.target.value})}
                    />

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#11998e] text-white flex items-center justify-center font-bold mr-3">4</span>
                        <h2 className="text-2xl font-bold text-gray-800">Identify Meaningful/Important Activities</h2>
                    </div>
                    <p className="text-gray-600 mb-6">These are activities aligned with your values or goals, even if not immediately pleasurable:</p>

                    <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#11998e] text-white">
                                <tr>
                                    <th className="p-4 font-semibold w-1/3">Life Domain</th>
                                    <th className="p-4 font-semibold">Important Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="bg-gray-50">
                                    <td className="p-4 font-medium text-gray-700">Work/Career</td>
                                    <td className="p-4"><input type="text" className="w-full bg-transparent border-b border-gray-300 focus:border-[#11998e] outline-none py-1" placeholder="e.g., Apply for jobs" value={data.meaningfulActivities.work} onChange={e => updateMeaningful('work', e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-gray-700">Relationships</td>
                                    <td className="p-4"><input type="text" className="w-full bg-transparent border-b border-gray-300 focus:border-[#11998e] outline-none py-1" placeholder="e.g., Call parent" value={data.meaningfulActivities.relationships} onChange={e => updateMeaningful('relationships', e.target.value)} /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 font-medium text-gray-700">Health</td>
                                    <td className="p-4"><input type="text" className="w-full bg-transparent border-b border-gray-300 focus:border-[#11998e] outline-none py-1" placeholder="e.g., Doctor appointment" value={data.meaningfulActivities.health} onChange={e => updateMeaningful('health', e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-gray-700">Personal Growth</td>
                                    <td className="p-4"><input type="text" className="w-full bg-transparent border-b border-gray-300 focus:border-[#11998e] outline-none py-1" placeholder="e.g., Learn new skill" value={data.meaningfulActivities.growth} onChange={e => updateMeaningful('growth', e.target.value)} /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 font-medium text-gray-700">Home/Environment</td>
                                    <td className="p-4"><input type="text" className="w-full bg-transparent border-b border-gray-300 focus:border-[#11998e] outline-none py-1" placeholder="e.g., Clean room" value={data.meaningfulActivities.home} onChange={e => updateMeaningful('home', e.target.value)} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#11998e] text-white flex items-center justify-center font-bold mr-3">5</span>
                        <h2 className="text-2xl font-bold text-gray-800">Create Your Weekly Activity Schedule</h2>
                    </div>
                    <p className="text-gray-600 mb-4">Schedule specific activities for the coming week. Start small - it's better to succeed at small goals than fail at large ones.</p>
                    
                    <div className="bg-[#FFF3CD] border-2 border-[#FFC107] p-4 rounded-xl mb-6 text-[#856404]">
                        <strong>💡 Tips:</strong> Be specific (when, where, how long), start with easy activities, schedule at optimal energy times.
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead className="bg-[#11998e] text-white">
                                <tr>
                                    <th className="p-3 font-semibold w-24">Day</th>
                                    <th className="p-3 font-semibold w-28">Time</th>
                                    <th className="p-3 font-semibold">Activity</th>
                                    <th className="p-3 font-semibold w-24">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.schedule.map((row, idx) => (
                                    <tr key={row.day} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="p-3 font-medium text-gray-700">{row.day}</td>
                                        <td className="p-3">
                                            <input type="time" className="w-full border border-gray-300 rounded px-2 py-1" value={row.time} onChange={e => updateSchedule(idx, 'time', e.target.value)} />
                                        </td>
                                        <td className="p-3">
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1" placeholder="What will you do?" value={row.activity} onChange={e => updateSchedule(idx, 'activity', e.target.value)} />
                                        </td>
                                        <td className="p-3">
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1" placeholder="15 min" value={row.duration} onChange={e => updateSchedule(idx, 'duration', e.target.value)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 6 */}
            {step === 6 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#11998e] text-white flex items-center justify-center font-bold mr-3">6</span>
                        <h2 className="text-2xl font-bold text-gray-800">Anticipate and Problem-Solve Barriers</h2>
                    </div>
                    <p className="text-gray-600 mb-6">What might get in the way of completing your planned activities? How will you overcome these obstacles?</p>

                    <label className="block font-bold text-gray-700 mb-2">Potential barriers:</label>
                    <textarea 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#11998e] outline-none transition-colors min-h-[100px] mb-6"
                        placeholder="e.g., 'Feeling too tired', 'Bad weather', 'No one to call'..."
                        value={data.barriers}
                        onChange={(e) => setData({...data, barriers: e.target.value})}
                    />

                    <label className="block font-bold text-gray-700 mb-2">Solutions/coping strategies:</label>
                    <textarea 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#11998e] outline-none transition-colors min-h-[100px] mb-6"
                        placeholder="e.g., 'Do it anyway for just 5 minutes', 'Indoor alternatives', 'Text instead of call'..."
                        value={data.solutions}
                        onChange={(e) => setData({...data, solutions: e.target.value})}
                    />

                    <div className="bg-[#FFF3CD] border-2 border-[#FFC107] p-4 rounded-xl mb-6 text-[#856404]">
                        <strong>💡 Remember:</strong> Action comes BEFORE motivation. Do the activity even if you don't feel like it - the motivation often comes after you start.
                    </div>

                    <div className="flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button onClick={() => setStep(7)} className="px-6 py-3 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            Complete Session <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 7: Completion */}
            {step === 7 && (
                <div className="animate-fade-in">
                    <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center mb-8">
                        <h3 className="text-2xl font-bold text-green-800 mb-2">✅ Session Complete!</h3>
                        <p className="text-green-700">Behavioral Activation plan created! Remember to track your activities and mood daily.</p>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => onComplete(data)} 
                            className="px-8 py-4 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Save & Return to Library
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
  );
};