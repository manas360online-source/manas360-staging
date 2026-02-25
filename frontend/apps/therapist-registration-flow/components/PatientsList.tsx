
import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  ArrowLeft, 
  Search, 
  User, 
  Activity, 
  Clock, 
  ChevronRight, 
  FileText, 
  Calendar, 
  Filter,
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  History,
  X,
  Download,
  Plus,
  Save
} from 'lucide-react';

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Aarav Mehta', age: 24, gender: 'Male', diagnosis: 'Generalized Anxiety Disorder (GAD)', progress: 65, history: 'Patient has had persistent anxiety for 2 years. Previously tried self-help. Joined MANS360 3 months ago.', requiredTreatment: 'Cognitive Behavioral Therapy (CBT) focus on exposure therapy and cognitive restructuring.', lastSession: '2 days ago' },
  { id: '2', name: 'Meera Sharma', age: 31, gender: 'Female', diagnosis: 'Post-Partum Depression', progress: 40, history: 'Symptoms started 4 months post-delivery. Difficulty bonding with infant. Frequent insomnia and low mood.', requiredTreatment: 'Interpersonal Therapy (IPT) and mood regulation techniques. Support group participation recommended.', lastSession: 'Today' },
  { id: '3', name: 'Rohan Gupta', age: 45, gender: 'Male', diagnosis: 'Workplace Burnout & Stress', progress: 85, history: 'High-stress corporate role. Physical fatigue and cynicism. Significant improvement in last month using mindfulness.', requiredTreatment: 'Stress management, boundary setting workshops, and career counseling integration.', lastSession: '1 week ago' },
  { id: '4', name: 'Sanya Iyer', age: 19, gender: 'Female', diagnosis: 'Eating Disorder (Anorexia)', progress: 20, history: 'Early intervention. Co-morbid with social anxiety. Family history of similar traits. Low weight maintenance.', requiredTreatment: 'Family-Based Treatment (FBT) and nutrition-focused CBT. Weekly weight monitoring.', lastSession: '3 days ago' },
  { id: '5', name: 'Vikram Singh', age: 52, gender: 'Male', diagnosis: 'Bipolar II Disorder', progress: 55, history: 'Long history of cycling moods. Currently in a stable maintenance phase. Medication adherent.', requiredTreatment: 'Psychoeducation, social rhythm therapy, and mood tracking digital logs.', lastSession: 'Yesterday' },
  { id: '10', name: 'Priya Reddy', age: 27, gender: 'Female', diagnosis: 'OCD (Symmetry & Order)', progress: 60, history: 'Symptoms present since childhood. Escalated during pandemic. Spending 3+ hours on rituals daily.', requiredTreatment: 'Exposure and Response Prevention (ERP). Gradual removal of reassurance seeking.', lastSession: 'Today' },
];

interface Props {
  onBack: () => void;
}

const PatientsList: React.FC<Props> = ({ onBack }) => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(MOCK_PATIENTS[0].id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedId) || patients[0];

  const handleDownloadPDF = () => {
    showToast(`Generating report for ${selectedPatient.name}...`, 'info');
    setTimeout(() => showToast('Clinical report downloaded successfully.'), 1500);
  };

  const handleNewSession = () => showToast(`Starting session with ${selectedPatient.name}...`, 'info');
  const handleEditOpen = () => {
    setEditPatientData({ ...selectedPatient });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPatientData) {
      setPatients(prev => prev.map(p => p.id === editPatientData.id ? editPatientData : p));
      setIsEditModalOpen(false);
      showToast('Patient record updated successfully.');
    }
  };

  return (
    <div className="w-full max-w-7xl bg-white rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-8 min-h-[85vh] relative">
      
      {toast && (
        <div className="fixed top-10 right-10 z-50 animate-in fade-in slide-in-from-right-10 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'success' ? 'bg-[#1D75FF] text-white border-blue-400' : 'bg-indigo-600 text-white border-indigo-500'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <Activity size={20} />}
            <span className="font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {isEditModalOpen && editPatientData && (
        <div className="fixed inset-0 z-[100] bg-[#1D3A63]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl border border-white animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-[#1D3A63]">Edit Record</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="bg-[#EDF5FF] p-2 rounded-full hover:bg-[#D0E4FF] text-[#1D75FF]">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={editPatientData.name} 
                  onChange={e => setEditPatientData({...editPatientData, name: e.target.value})}
                  className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-bold text-slate-800"
                />
                <input 
                  type="text" 
                  value={editPatientData.diagnosis} 
                  onChange={e => setEditPatientData({...editPatientData, diagnosis: e.target.value})}
                  className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input 
                  type="number" 
                  value={editPatientData.age} 
                  onChange={e => setEditPatientData({...editPatientData, age: parseInt(e.target.value)})}
                  className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-bold text-slate-800"
                />
                <select 
                  value={editPatientData.gender} 
                  onChange={e => setEditPatientData({...editPatientData, gender: e.target.value})}
                  className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-bold text-slate-800 appearance-none"
                >
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
                <input 
                  type="number" 
                  value={editPatientData.progress} 
                  onChange={e => setEditPatientData({...editPatientData, progress: parseInt(e.target.value)})}
                  className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-bold text-slate-800"
                />
              </div>

              <textarea 
                value={editPatientData.history} 
                onChange={e => setEditPatientData({...editPatientData, history: e.target.value})}
                rows={3}
                className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-medium text-slate-600"
              />

              <textarea 
                value={editPatientData.requiredTreatment} 
                onChange={e => setEditPatientData({...editPatientData, requiredTreatment: e.target.value})}
                rows={3}
                className="w-full bg-blue-50 border border-blue-100 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-bold text-[#1D75FF]"
              />

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-full transition-all uppercase tracking-widest text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#1D75FF] hover:bg-[#1D75FF]/90 text-white font-black py-4 rounded-full shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  <Save size={18} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button onClick={onBack} className="bg-[#EDF5FF] p-3 rounded-full hover:bg-[#D0E4FF] transition-colors shrink-0">
            <ArrowLeft size={24} className="text-[#1D75FF]" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#1D3A63] leading-tight">Patient Registry</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Total {patients.length} active cases</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto md:max-w-lg flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#EDF5FF] border border-[#D0E4FF] rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-slate-600 font-medium"
            />
          </div>
          <button onClick={() => showToast('Filters applied', 'info')} className="bg-[#EDF5FF] p-3.5 rounded-2xl hover:bg-[#D0E4FF] text-[#1D75FF] border border-[#D0E4FF] transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
        
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => setSelectedId(patient.id)}
              className={`p-4 rounded-[2rem] border transition-all duration-300 cursor-pointer flex items-center gap-4 group ${
                selectedId === patient.id 
                  ? 'bg-[#1D75FF] text-white border-[#1D75FF] shadow-xl shadow-blue-500/20 translate-x-2' 
                  : 'bg-white border-slate-100 hover:border-[#D0E4FF] hover:bg-[#EDF5FF]/30 text-slate-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-colors ${
                selectedId === patient.id ? 'bg-white/20' : 'bg-[#EDF5FF] text-[#1D75FF]'
              }`}>
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-black truncate ${selectedId === patient.id ? 'text-white' : 'text-[#1D3A63]'}`}>{patient.name}</h3>
                <p className={`text-[10px] font-bold uppercase truncate tracking-wider ${selectedId === patient.id ? 'text-white/70' : 'text-slate-400'}`}>{patient.diagnosis}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-[#EDF5FF]/30 rounded-[3rem] p-8 md:p-12 border border-[#D0E4FF]/30 flex flex-col gap-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-[#1D75FF] flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/30">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#1D3A63]">{selectedPatient.name}</h2>
                <p className="text-slate-400 font-bold text-sm mt-1">{selectedPatient.age}y • {selectedPatient.gender} • Case #{selectedPatient.id}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleEditOpen} className="bg-[#1D75FF] text-white px-8 py-4 rounded-full font-black shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
                Edit Record
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#D0E4FF]/30 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-[#1D75FF] rounded-2xl"><TrendingUp size={24} /></div>
              <div>
                <span className="block text-2xl font-black text-slate-800">{selectedPatient.progress}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D0E4FF]/30 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Clock size={24} /></div>
              <div>
                <span className="block text-2xl font-black text-slate-800">{selectedPatient.lastSession}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Last Log</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D0E4FF]/30 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-[#1D75FF] rounded-2xl"><Activity size={24} /></div>
              <div><span className="block text-2xl font-black text-slate-800">CBT</span><span className="text-[10px] font-bold text-slate-400 uppercase">Method</span></div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-[#D0E4FF]/30 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-[#1D3A63]">Diagnosis</h3>
            <p className="text-2xl font-bold text-[#1D75FF] bg-[#EDF5FF] px-6 py-3 rounded-2xl inline-block">{selectedPatient.diagnosis}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-[#D0E4FF]/30 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Case History</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{selectedPatient.history}</p>
            </div>
            <div className="bg-[#1D75FF] text-white p-8 rounded-[2rem] shadow-xl shadow-blue-500/10">
              <h4 className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-4">Treatment Plan</h4>
              <p className="leading-relaxed font-bold text-lg">{selectedPatient.requiredTreatment}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D0E4FF]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={handleDownloadPDF} className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest">
                <Download size={18} className="inline mr-2" /> PDF Report
              </button>
              <button onClick={handleNewSession} className="flex-1 md:flex-none bg-[#1D75FF] hover:bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20">
                <Plus size={18} className="inline mr-2" /> New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
