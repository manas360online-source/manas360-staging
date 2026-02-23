import React, { useState } from 'react';
import { X, Save, User, Calendar, Mail, Phone, Clipboard } from 'lucide-react';
import { Patient } from '../types';

interface Props {
  onSave: (patient: Omit<Patient, 'id' | 'status'>) => void;
  onClose: () => void;
}

export const AddPatientModal: React.FC<Props> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    diagnosis: '',
    lastSession: new Date().toISOString().split('T')[0],
    nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      age: parseInt(formData.age) || 0,
      email: formData.email,
      phone: formData.phone,
      diagnosis: formData.diagnosis,
      lastSession: new Date(formData.lastSession).toISOString(),
      nextSession: new Date(formData.nextSession).toISOString(),
      notes: formData.notes,
      notesLastModified: formData.notes ? new Date().toISOString() : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-[32px] w-full max-w-xl shadow-2xl p-8 border border-gray-100 bg-white">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="text" 
                placeholder="e.g. John Doe"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest ml-1">Age</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest ml-1">Diagnosis</label>
                <div className="relative">
                  <Clipboard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Anxiety"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                    value={formData.diagnosis}
                    onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                  />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    placeholder="(555) 123-4567"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest ml-1">Next Session</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                    value={formData.nextSession}
                    onChange={e => setFormData({...formData, nextSession: e.target.value})}
                  />
                </div>
             </div>
             <div className="flex items-end">
                <p className="text-[10px] text-gray-500 leading-tight p-1">Default last session set to today.</p>
             </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
             <button type="button" onClick={onClose} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">Cancel</button>
             <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg uppercase tracking-widest text-xs">
                <Save size={18} /> Save Patient
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};