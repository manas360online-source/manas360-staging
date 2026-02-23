
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getResults } from '../services/storageService';

interface Props {
  onSave: (mood: number, note: string) => void;
}

const MoodTracker: React.FC<Props> = ({ onSave }) => {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [note, setNote] = useState('');
  const [trendData, setTrendData] = useState<{ day: string; value: number; color: string }[]>([]);

  const moods = [
    { id: 1, emoji: '😢', label: 'Very Sad' },
    { id: 2, emoji: '😟', label: 'Sad' },
    { id: 3, emoji: '😐', label: 'Neutral' },
    { id: 4, emoji: '😊', label: 'Happy' },
    { id: 5, emoji: '😁', label: 'Very Happy' },
  ];

  useEffect(() => {
    // Calculate 7-day trend from real storage
    const results = getResults();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    // Initialize data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return {
        dateStr: d.toDateString(),
        dayName: days[d.getDay()],
        moods: [] as number[]
      };
    });

    // Populate with actual data
    results.forEach(res => {
      if (res.answers._sessionMood) {
        const resDate = new Date(res.completedAt).toDateString();
        const dayMatch = last7Days.find(d => d.dateStr === resDate);
        if (dayMatch) {
          dayMatch.moods.push(Number(res.answers._sessionMood));
        }
      }
    });

    // Map to UI format
    const colors = [
      'bg-red-400',    // Mon
      'bg-orange-400', // Tue
      'bg-amber-400',  // Wed
      'bg-yellow-400', // Thu
      'bg-emerald-400',// Fri
      'bg-teal-400',   // Sat
      'bg-primary'     // Sun
    ];

    const finalTrend = last7Days.map((day, idx) => {
      const avg = day.moods.length > 0 
        ? (day.moods.reduce((a, b) => a + b, 0) / day.moods.length) 
        : 0;
      
      // Convert 1-5 scale to percentage (1=20%, 5=100%)
      const percentage = avg > 0 ? (avg / 5) * 100 : 5; // Minimum height of 5% for empty days
      
      return {
        day: day.dayName,
        value: percentage,
        color: colors[idx % colors.length]
      };
    });

    setTrendData(finalTrend);
  }, []);

  return (
    <div className="w-full max-w-sm bg-white text-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Mood Tracker</h2>
      
      <div className="space-y-8">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-5">Daily Check-in — How are you today?</p>
          <div className="flex justify-between items-center">
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`text-4xl transition-all duration-300 transform hover:scale-125 rounded-full p-2 ${
                  selectedMood === m.id 
                    ? 'ring-4 ring-primary/20 bg-blue-50 scale-110 shadow-lg' 
                    : 'grayscale-[0.5] opacity-50 hover:opacity-100 hover:grayscale-0'
                }`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Journal Note</label>
          <input
            type="text"
            placeholder="Add a note (optional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-slate-400 text-slate-700"
          />
        </div>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-primary text-[10px] font-black uppercase tracking-[2px] mb-5">Your 7-Day Trend</p>
          <div className="flex items-end justify-between h-28 gap-2 px-1">
            {trendData.map((d, idx) => (
              <div key={`${d.day}-${idx}`} className="flex flex-col items-center flex-1 gap-3">
                <div 
                  className={`w-full rounded-full ${d.color} transition-all duration-1000 shadow-sm opacity-90`} 
                  style={{ height: `${d.value}%` }}
                />
                <span className="text-[10px] text-slate-400 font-bold uppercase">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSave(selectedMood, note)}
          className="w-full bg-primary hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-[0.98] uppercase text-xs tracking-widest"
        >
          Save Check-in <CheckCircle2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default MoodTracker;
