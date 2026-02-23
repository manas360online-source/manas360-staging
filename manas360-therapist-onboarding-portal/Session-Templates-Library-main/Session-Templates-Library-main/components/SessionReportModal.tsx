import React from 'react';
import { X, Calendar, User, FileText, CheckCircle } from 'lucide-react';
import { SessionData, Template } from '../types';

interface Props {
  session: SessionData;
  template?: Template;
  onClose: () => void;
}

export const SessionReportModal: React.FC<Props> = ({ session, template, onClose }) => {
  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) return value.join(', ');
        return (
            <ul className="list-disc list-inside ml-2">
                {Object.entries(value).map(([k, v]) => (
                    <li key={k}><span className="font-medium capitalize text-blue-400">{k}:</span> {renderValue(v)}</li>
                ))}
            </ul>
        );
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-[32px] w-full max-w-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto border border-gray-100 bg-white">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div>
              <h2 className="text-2xl font-bold text-gray-900">Session Report</h2>
              <p className="text-sm text-gray-400 uppercase tracking-widest mt-1 font-bold" style={{color: '#1D72FE'}}>{template?.title || 'Unknown Template'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Date</span>
                </div>
                <div className="font-semibold text-gray-900">
                    {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <User size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Patient</span>
                </div>
                <div className="font-semibold text-gray-900">{session.patientName}</div>
            </div>
        </div>

        <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <FileText size={20} style={{color: '#1D72FE'}}/> Session Summary
            </h3>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <div className="space-y-6">
                    {Object.entries(session.data).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="text-gray-700 text-sm leading-relaxed">
                                {renderValue(value)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4">
             <button onClick={onClose} style={{backgroundColor: '#1D72FE'}} className="px-8 py-3 text-white rounded-xl font-bold transition-all hover:opacity-90 shadow-lg uppercase tracking-widest text-xs">
                Close Report
             </button>
        </div>
      </div>
    </div>
  );
};