import React, { useState, useEffect } from 'react';
import { Layout, Search, Plus, User, FileText, Settings, Share2, Menu, Calendar, Phone, Mail, ArrowLeft, Save, Check, Trash2, Shield, Heart, Zap, Leaf, Moon, Sun, Award, Globe, Briefcase, Clipboard, MessageSquare, History } from 'lucide-react';
import { INITIAL_TEMPLATES, MOCK_PATIENTS, MOCK_SESSIONS } from './constants';
import { Template, Patient, SessionData } from './types';
import { TemplateCard } from './components/TemplateCard';
import { TemplateEditor } from './components/TemplateEditor';
import { AddPatientModal } from './components/AddPatientModal';
import { SessionReportModal } from './components/SessionReportModal';
import { CognitiveRestructuring } from './templates/CognitiveRestructuring';
import { BehavioralActivation } from './templates/BehavioralActivation';
import { ExposureTherapy } from './templates/ExposureTherapy';
import { AnxietyManagement } from './templates/AnxietyManagement';
import { DepressionAssessment } from './templates/DepressionAssessment';

const ACCENT_BLUE = '#1D72FE';

const CrisisFooter = () => (
  <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 py-3 text-center z-50">
    <p className="text-sm text-gray-600">
      In crisis? Need immediate help? <a href="tel:18005990019" style={{color: ACCENT_BLUE}} className="font-bold hover:underline ml-1">Call Tele-MANAS: 1800-599-0019</a>
    </p>
  </footer>
);

const MOCK_THERAPIST = {
  name: 'Dr. Ananya Sharma',
  title: 'Senior Clinical Psychologist',
  license: 'RCI Reg. No: A1234567',
  specialization: 'Cognitive Behavioral Therapy (CBT), Trauma-Informed Care',
  experience: '12+ Years',
  email: 'dr.ananya@manas360.com',
  phone: '+91 98765 43210',
  bio: 'Specializing in anxiety disorders and depression management with a patient-centric approach. Dedicated to providing a safe, judgment-free space for mental wellness journey.',
  stats: [
    { label: 'Sessions', value: '1,240+' },
    { label: 'Patients', value: '480+' },
    { label: 'Rating', value: '4.9/5' }
  ]
};

export default function App() {
  const [view, setView] = useState<'library' | 'session' | 'history' | 'patients' | 'patient-profile' | 'therapist-profile'>('library');
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [sessions, setSessions] = useState<SessionData[]>(MOCK_SESSIONS);
  const [search, setSearch] = useState('');
  
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
  const [activeSession, setActiveSession] = useState<Template | null>(null);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [viewReportSession, setViewReportSession] = useState<SessionData | null>(null);
  const [currentSessionPatient, setCurrentSessionPatient] = useState<{id: string | null, name: string}>({id: null, name: ''});

  const handleRun = (t: Template) => {
    setCurrentSessionPatient({ id: null, name: 'Guest' });
    setActiveSession(t);
    setPendingTemplate(null);
    setView('session');
  };

  const handleSessionComplete = (data: any) => {
    if (!activeSession) return;
    const newSession: SessionData = {
        id: Math.random().toString(36).substr(2, 9),
        templateId: activeSession.id,
        patientName: currentSessionPatient.name,
        date: new Date().toISOString(),
        data: data,
        status: 'completed'
    };
    setSessions([newSession, ...sessions]);
    setView('history');
    setActiveSession(null);
  };

  const LibraryView = () => (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-32 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((t, idx) => (
          <div key={t.id} className="group relative">
            <TemplateCard 
              template={t} 
              onPreview={() => {}}
              onClone={() => {}}
              onRun={handleRun}
              onEdit={() => {}}
              onShare={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const PatientProfileView = () => {
    if (!activePatient) return null;
    const patientSessions = sessions.filter(s => s.patientName === activePatient.name);

    return (
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-32 animate-fade-in">
        <button 
          onClick={() => setView('patients')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={18} /> Back to Patients
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card rounded-[32px] p-8 text-center bg-white">
              <div style={{backgroundColor: `${ACCENT_BLUE}20`, color: ACCENT_BLUE, borderColor: `${ACCENT_BLUE}30`}} className="w-24 h-24 rounded-3xl border flex items-center justify-center font-bold text-4xl mx-auto mb-6">
                {activePatient.name[0]}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activePatient.name}</h2>
              <div className="inline-block px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                {activePatient.status}
              </div>

              <div className="space-y-4 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span>{activePatient.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{activePatient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Age: {activePatient.age}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-8 bg-white">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clipboard size={14} style={{color: ACCENT_BLUE}} /> Clinical Diagnosis
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-medium">
                {activePatient.diagnosis}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-[32px] p-8 bg-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} style={{color: ACCENT_BLUE}} /> Clinical Notes
                </h3>
                {activePatient.notesLastModified && (
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                    Last modified: {new Date(activePatient.notesLastModified).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-700 leading-relaxed text-sm min-h-[160px]">
                {activePatient.notes || "No notes available for this patient."}
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-8 bg-white">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <History size={14} style={{color: ACCENT_BLUE}} /> Recent Sessions
              </h3>
              
              <div className="space-y-4">
                {patientSessions.length > 0 ? (
                  patientSessions.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white transition-all group">
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-1">
                          {templates.find(t => t.id === s.templateId)?.title || "Unknown Session"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(s.date).toLocaleDateString()} at {new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      <button 
                        onClick={() => setViewReportSession(s)}
                        style={{color: ACCENT_BLUE}}
                        className="text-xs font-bold uppercase tracking-widest group-hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 italic text-sm">
                    No session history recorded for this patient.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TherapistProfileView = () => (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-32 animate-fade-in">
      <button 
        onClick={() => setView('library')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={18} /> Back to Library
      </button>
      <div className="glass-card rounded-[40px] overflow-hidden bg-white">
        <div style={{background: `linear-gradient(to right, ${ACCENT_BLUE}10, ${ACCENT_BLUE}20)`}} className="h-48 border-b border-gray-100 relative">
          <div className="absolute -bottom-16 left-12">
            <div style={{background: `linear-gradient(to br, ${ACCENT_BLUE}, #3b82f6)`}} className="w-32 h-32 rounded-3xl border-4 border-white flex items-center justify-center text-white shadow-2xl">
              <User size={64} />
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-12 pb-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{MOCK_THERAPIST.name}</h1>
              <p style={{color: ACCENT_BLUE}} className="font-bold uppercase tracking-widest text-sm">{MOCK_THERAPIST.title}</p>
            </div>
            <button className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {MOCK_THERAPIST.stats.map(stat => (
              <div key={stat.label} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Briefcase size={14} style={{color: ACCENT_BLUE}} /> Professional Background
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {MOCK_THERAPIST.bio}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Award size={14} style={{color: ACCENT_BLUE}} /> Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MOCK_THERAPIST.specialization.split(', ').map(spec => (
                    <span key={spec} style={{backgroundColor: `${ACCENT_BLUE}10`, color: ACCENT_BLUE, borderColor: `${ACCENT_BLUE}20`}} className="px-3 py-1 border rounded-lg text-xs font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Credentials & Contact</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <Shield size={18} className="text-gray-400" />
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-tighter">License Number</span>
                    <span className="text-gray-900 font-medium">{MOCK_THERAPIST.license}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Email Address</span>
                    <span className="text-gray-900 font-medium">{MOCK_THERAPIST.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Phone Number</span>
                    <span className="text-gray-900 font-medium">{MOCK_THERAPIST.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Globe size={18} className="text-gray-400" />
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Experience</span>
                    <span className="text-gray-900 font-medium">{MOCK_THERAPIST.experience}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {view !== 'session' && (
        <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 py-4 px-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setView('library')}>
            <span className="text-xl font-bold text-gray-900">MANAS</span>
            <span style={{color: ACCENT_BLUE}} className="text-xl font-bold">360</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setView('library')} className={`text-sm font-bold uppercase tracking-wider transition-colors ${view === 'library' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}>Library</button>
            <button onClick={() => setView('history')} className={`text-sm font-bold uppercase tracking-wider transition-colors ${view === 'history' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}>Sessions</button>
            <button onClick={() => setView('patients')} className={`text-sm font-bold uppercase tracking-wider transition-colors ${view === 'patients' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}>Patients</button>
            <div 
              onClick={() => setView('therapist-profile')}
              style={{
                backgroundColor: view === 'therapist-profile' ? `${ACCENT_BLUE}10` : 'transparent',
                borderColor: view === 'therapist-profile' ? ACCENT_BLUE : 'rgba(0,0,0,0.05)',
                color: view === 'therapist-profile' ? ACCENT_BLUE : '#A0AEC0'
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border hover:text-gray-900"
            >
              <User size={20} />
            </div>
          </div>
        </nav>
      )}

      {view === 'library' && <LibraryView />}
      {view === 'therapist-profile' && <TherapistProfileView />}
      {view === 'patient-profile' && <PatientProfileView />}
      
      {view === 'history' && (
        <div className="pt-24 px-6 max-w-5xl mx-auto pb-32">
          <button 
            onClick={() => setView('library')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> Back to Library
          </button>
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Past Sessions</h1>
          <div className="space-y-4">
            {sessions.map(s => (
              <div key={s.id} className="glass-card p-6 rounded-2xl flex justify-between items-center transition-all bg-white">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{s.patientName}</h3>
                  <p className="text-sm text-gray-500">{new Date(s.date).toLocaleDateString()} - {templates.find(t => t.id === s.templateId)?.title}</p>
                </div>
                <button onClick={() => setViewReportSession(s)} style={{color: ACCENT_BLUE}} className="font-bold text-sm hover:underline uppercase tracking-widest">VIEW REPORT</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'patients' && (
        <div className="pt-24 px-6 max-w-5xl mx-auto pb-32">
          <button 
            onClick={() => setView('library')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> Back to Library
          </button>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <button onClick={() => setIsAddPatientModalOpen(true)} className="btn-pill px-6 py-2 text-xs">ADD PATIENT</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patients.map(p => (
              <div key={p.id} className="glass-card p-6 rounded-2xl bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <div style={{backgroundColor: `${ACCENT_BLUE}10`, color: ACCENT_BLUE}} className="w-12 h-12 rounded-full flex items-center justify-center font-bold">{p.name[0]}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.diagnosis}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setActivePatient(p); setView('patient-profile'); }}
                  className="w-full py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors uppercase tracking-widest"
                >
                  VIEW PROFILE
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'session' && activeSession && (
        <div className="min-h-screen pb-32">
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <button onClick={() => setView('library')} className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"><ArrowLeft size={16}/> Exit Session</button>
            <div style={{color: ACCENT_BLUE}} className="text-sm font-bold uppercase tracking-widest">Current Session: {currentSessionPatient.name}</div>
            <div className="w-20"></div>
          </div>
          <div className="p-8">
            {activeSession.type === 'cognitive_restructuring' && <CognitiveRestructuring onComplete={handleSessionComplete} />}
            {activeSession.type === 'behavioral_activation' && <BehavioralActivation onComplete={handleSessionComplete} />}
            {activeSession.type === 'exposure_therapy' && <ExposureTherapy onComplete={handleSessionComplete} />}
            {activeSession.type === 'anxiety_management' && <AnxietyManagement onComplete={handleSessionComplete} />}
            {activeSession.type === 'depression_assessment' && <DepressionAssessment onComplete={handleSessionComplete} />}
          </div>
        </div>
      )}

      <CrisisFooter />

      {isAddPatientModalOpen && <AddPatientModal onSave={(p) => { 
        const newPatient = { ...p, id: Math.random().toString(36).substr(2, 9), status: 'Active' as const };
        setPatients([...patients, newPatient]);
        setIsAddPatientModalOpen(false);
      }} onClose={() => setIsAddPatientModalOpen(false)} />}
      {viewReportSession && <SessionReportModal session={viewReportSession} template={templates.find(t => t.id === viewReportSession.templateId)} onClose={() => setViewReportSession(null)} />}
    </div>
  );
}