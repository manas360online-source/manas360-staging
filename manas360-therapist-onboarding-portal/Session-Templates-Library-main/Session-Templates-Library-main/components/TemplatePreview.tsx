import React from 'react';
import { X, Copy, Play, Clock, Layout } from 'lucide-react';
import { Template } from '../types';

interface Props {
  template: Template;
  onClose: () => void;
  onClone: () => void;
  onRun: () => void;
}

export const TemplatePreview: React.FC<Props> = ({ template, onClose, onClone, onRun }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 bg-white">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest">Template Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 overflow-y-auto">
           <div className="flex items-center gap-3 mb-6">
              <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">{template.title}</h1>
              {template.isSystem && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-blue-100">Official</span>}
           </div>
           
           <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
             {template.description}
           </p>

           <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <Clock size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Duration</span>
                </div>
                <span className="font-semibold text-gray-900 text-lg">{template.duration}</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <Layout size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Format</span>
                </div>
                <span className="font-semibold text-gray-900 text-lg">{template.type.replace('_', ' ').toUpperCase()}</span>
              </div>
           </div>

           <div className="border-t border-gray-100 pt-8">
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-sm" style={{color: '#1D72FE'}}>Included in this session</h3>
              <ul className="space-y-4 text-gray-600">
                 <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Structured step-by-step guidance
                 </li>
                 <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Interactive forms and inputs
                 </li>
                 <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Clinical report generated on completion
                 </li>
              </ul>
           </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
           <button onClick={onClone} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm uppercase tracking-widest">
              Clone Template
           </button>
           <button onClick={onRun} className="px-8 py-3 bg-[#1D72FE] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg text-sm uppercase tracking-widest">
              <Play size={16} fill="currentColor" /> Use Now
           </button>
        </div>
      </div>
    </div>
  );
};