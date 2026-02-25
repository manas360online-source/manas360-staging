
import React from 'react';
import { PhoneCall, MessageSquare, AlertCircle } from 'lucide-react';
import { EMERGENCY_RESOURCES } from '../constants';

const CrisisPanel: React.FC = () => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-6 animate-pulse">
      <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-3">
        <AlertCircle size={18} />
        Immediate Help Available
      </div>
      <div className="space-y-3">
        {EMERGENCY_RESOURCES.map((res, i) => (
          <div key={i} className="flex items-center justify-between bg-white/80 p-3 rounded-xl border border-red-50">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{res.title}</span>
              <span className="text-sm font-bold text-slate-800">{res.contact}</span>
            </div>
            <a 
              href={res.contact.includes('988') ? 'tel:988' : '#'} 
              className="p-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
            >
              {res.contact.includes('Text') ? <MessageSquare size={16} /> : <PhoneCall size={16} />}
            </a>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-red-600/70 mt-3 italic">
        * If you are in immediate danger, please call emergency services right away.
      </p>
    </div>
  );
};

export default CrisisPanel;
