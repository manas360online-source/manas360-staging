import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Template } from '../types';

interface Props {
  template: Template;
  onSave: (t: Template) => void;
  onClose: () => void;
}

export const TemplateEditor: React.FC<Props> = ({ template, onSave, onClose }) => {
  const [data, setData] = useState(template);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm">
       <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">{template.id ? 'Edit Template' : 'Create Template'}</h2>
             <button onClick={onClose}><X /></button>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Template Title</label>
                <input 
                  type="text" 
                  value={data.title}
                  onChange={e => setData({...data, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. My Custom Session"
                />
             </div>
             
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tool Type</label>
                <select 
                   value={data.type}
                   onChange={e => setData({...data, type: e.target.value as any})}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                   <option value="cognitive_restructuring">Cognitive Restructuring (CBT)</option>
                   <option value="behavioral_activation">Behavioral Activation</option>
                   <option value="exposure_therapy">Exposure Therapy</option>
                   <option value="anxiety_management">Anxiety Management</option>
                   <option value="depression_assessment">Depression Assessment (PHQ-9)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the interactive tool to use for this session.</p>
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  value={data.description}
                  onChange={e => setData({...data, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  placeholder="Describe the purpose of this template..."
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                   <input 
                     type="text" 
                     value={data.duration}
                     onChange={e => setData({...data, duration: e.target.value})}
                     className="w-full p-2 border border-gray-300 rounded-lg"
                     placeholder="e.g. 30-45 min"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Difficulty</label>
                   <select 
                     value={data.difficulty}
                     onChange={e => setData({...data, difficulty: e.target.value as any})}
                     className="w-full p-2 border border-gray-300 rounded-lg"
                   >
                     <option>Low</option>
                     <option>Moderate</option>
                     <option>High</option>
                   </select>
                </div>
             </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-gray-600 font-semibold">Cancel</button>
             <button onClick={() => onSave(data)} style={{backgroundColor: '#1D72FE'}} className="px-6 py-2 text-white rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                <Save size={18} /> Save Template
             </button>
          </div>
       </div>
    </div>
  );
};