import React, { useEffect, useState } from 'react';
import { User, Session } from '../types';
import { ICONS } from '../constants';

interface WaitingRoomProps {
  session: Session;
  onAdmit: () => void;
  isTherapist: boolean;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ session, onAdmit, isTherapist }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-white">
        
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-[#0066ff] rounded-full flex items-center justify-center bg-white z-10 text-[#0066ff]">
                <ICONS.Video />
            </div>
        </div>

        {isTherapist ? (
            <>
                <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Patient is Ready</h2>
                <p className="text-slate-500 mb-8 font-medium">
                    {session.patientName} is in the waiting room. 
                    <br/>
                    Start the session when you are ready.
                </p>
                <button 
                    onClick={onAdmit}
                    className="w-full py-5 bg-[#0066ff] hover:brightness-110 text-white rounded-full font-black text-sm shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 uppercase tracking-widest"
                >
                    Admit Patient
                </button>
            </>
        ) : (
            <>
                <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Waiting for Therapist{dots}</h2>
                <p className="text-slate-500 mb-8 font-medium">
                    Please sit back and relax. Your secure session with {session.therapistName} will begin shortly.
                </p>
                
                <div className="bg-[#f0f7ff] rounded-[32px] p-6 text-left border border-blue-100/50">
                    <h3 className="font-black text-blue-700 mb-3 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <ICONS.ShieldCheck /> Pre-call Check
                    </h3>
                    <ul className="space-y-3 text-sm font-bold text-slate-600">
                        <li className="flex items-center gap-2 text-[#0066ff]">✓ Camera working</li>
                        <li className="flex items-center gap-2 text-[#0066ff]">✓ Microphone working</li>
                        <li className="flex items-center gap-2 text-[#0066ff]">✓ Secure connection established</li>
                    </ul>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;