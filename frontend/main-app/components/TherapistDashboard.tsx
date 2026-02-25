
import React, { useState, useEffect } from 'react';
import { Session } from '../types';
import { storageService, TEMPLATES } from '../utils/storageService';

interface TherapistDashboardProps {
  onCreate: () => void;
  onEdit: (session: Session) => void;
  onPreview: (session: Session) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ onCreate, onEdit, onPreview }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    let loaded = storageService.getSessions();
    if (loaded.length === 0) {
      // Seed templates if first run
      TEMPLATES.forEach(t => storageService.saveSession(t));
      loaded = TEMPLATES;
    }
    setSessions(loaded);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      storageService.deleteSession(id);
      setSessions(storageService.getSessions());
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#0F172A] p-8 animate-fade-in transition-colors duration-500 relative">
      
      {/* Absolute Top Right Icon */}
      <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
        <span className="text-[28px] leading-none">🧿</span>
      </div>

      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="font-serif text-[2.5rem] text-[#0A3A78] dark:text-white font-bold transition-colors">Therapist Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 transition-colors">Manage CBT sessions and assessments.</p>
          </div>
          <button 
            onClick={onCreate}
            className="bg-[#1FA2DE] dark:bg-sky-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#0A4E89] dark:hover:bg-sky-500 transition-all"
          >
            + Create New Session
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <div key={session.id} className="bg-white dark:bg-[#1E293B] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-lg transition-all flex flex-col">
              <div className="mb-4 flex justify-between">
                <span className="text-xs font-bold bg-blue-50 dark:bg-sky-900/30 text-blue-600 dark:text-sky-300 px-3 py-1 rounded-full uppercase tracking-wider transition-colors">
                  v{session.version}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-3 transition-colors">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-white mb-2 transition-colors">{session.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 flex-grow transition-colors">{session.description}</p>
              
              <div className="flex gap-2 mt-auto">
                 <button 
                   onClick={() => onPreview(session)}
                   className="flex-1 py-2 rounded-xl bg-[#F0F9FF] dark:bg-sky-900/20 text-[#0A4E89] dark:text-sky-300 font-bold text-sm hover:bg-[#E0F2FE] dark:hover:bg-sky-900/40 transition-colors"
                 >
                   Preview
                 </button>
                 <button 
                   onClick={() => onEdit(session)}
                   className="flex-1 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                 >
                   Edit
                 </button>
                 <button 
                   onClick={() => handleDelete(session.id)}
                   className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                 >
                   🗑
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
