import React, { useState } from 'react';
import { SessionInfo } from '../types';

interface Props {
  session: SessionInfo;
  onHome: () => void;
}

const PostSession: React.FC<Props> = ({ session, onHome }) => {
  const [rating, setRating] = useState<number | null>(null);
  const emojis = ['☹️', '😐', '😊', '😁', '🤩'];

  return (
    <div className="flex flex-col items-center justify-center h-full animate-[fadeIn_0.5s_ease-out]">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-[60px] p-16 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
           
           <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-10 inline-block">Session Completed</span>
           
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-6">How was your session?</h2>
           <p className="text-slate-500 font-medium mb-12">Your feedback helps {session.therapistName} provide better care.</p>
           
           <div className="flex justify-center gap-6 mb-12">
            {emojis.map((emoji, idx) => (
              <button 
                key={idx}
                onClick={() => setRating(idx)}
                className={`text-5xl transition-all hover:scale-125 hover:rotate-6 ${rating === idx ? 'scale-125 grayscale-0' : 'grayscale opacity-30 hover:opacity-100 hover:grayscale-0'}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <textarea 
            placeholder="Write a brief note about your experience (optional)..."
            className="w-full bg-slate-50 rounded-[32px] p-8 text-sm text-slate-700 border border-slate-100 outline-none focus:border-blue-500 focus:bg-white transition-all h-40 resize-none mb-10"
          ></textarea>

          <div className="flex gap-4">
             <button 
               onClick={onHome}
               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <span className="text-xl">🏠</span> Submit & Go Home
             </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="text-blue-500">📄</span>
              Session Summary Available
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="text-emerald-500">💳</span>
              Receipt Issued
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostSession;