import React, { useState } from 'react';
import { X, User, Play, Users, ChevronDown } from 'lucide-react';
import { Template, Patient } from '../types';

interface Props {
  template: Template;
  patients: Patient[];
  onStart: (patientId: string | null, customName: string) => void;
  onClose: () => void;
}

const ACCENT_BLUE = '#1D72FE';

export const SessionSetupModal: React.FC<Props> = ({ template, patients, onStart, onClose }) => {
  const [mode, setMode] = useState<'existing' | 'guest'>('existing');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [guestName, setGuestName] = useState('');

  const handleStart = () => {
    if (mode === 'existing' && !selectedPatientId) {
        alert('Please select a patient');
        return;
    }
    if (mode === 'guest' && !guestName.trim()) {
        alert('Please enter a name');
        return;
    }

    if (mode === 'existing') {
        const p = patients.find(p => p.id === selectedPatientId);
        onStart(selectedPatientId, p?.name || 'Unknown Patient');
    } else {
        onStart(null, guestName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Start Session</h2>
                <p style={{color: ACCENT_BLUE}} className="text-sm uppercase tracking-widest mt-1 font-bold">{template.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-gray-900">
                <X size={20} />
            </button>
        </div>

        <div className="p-8">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-8 border border-gray-200">
                <button 
                    onClick={() => setMode('existing')}
                    style={{
                      backgroundColor: mode === 'existing' ? 'white' : 'transparent',
                      color: mode === 'existing' ? ACCENT_BLUE : '#A0AEC0'
                    }}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'existing' ? 'shadow-sm' : 'hover:text-gray-600'}`}
                >
                    Existing Patient
                </button>
                <button 
                    onClick={() => setMode('guest')}
                    style={{
                      backgroundColor: mode === 'guest' ? 'white' : 'transparent',
                      color: mode === 'guest' ? ACCENT_BLUE : '#A0AEC0'
                    }}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'guest' ? 'shadow-sm' : 'hover:text-gray-600'}`}
                >
                    Guest
                </button>
            </div>

            {mode === 'existing' ? (
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest ml-1">Select Patient</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#1D72FE] outline-none appearance-none text-gray-900 font-medium transition-all"
                        >
                            <option value="">-- Choose Patient --</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
            ) : (
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest ml-1">Patient Name</label>
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#1D72FE] outline-none text-gray-900 font-medium transition-all"
                            placeholder="e.g. John Doe"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            <button 
                onClick={handleStart}
                style={{backgroundColor: ACCENT_BLUE}}
                className="w-full py-4 text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-3 transition-all shadow-lg uppercase tracking-widest text-sm"
            >
                <Play size={18} fill="currentColor" /> Begin Session
            </button>
        </div>
      </div>
    </div>
  );
};