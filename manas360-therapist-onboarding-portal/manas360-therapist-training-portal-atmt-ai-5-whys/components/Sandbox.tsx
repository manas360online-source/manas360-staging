import React, { useState } from 'react';
import { DUMMY_PATIENTS } from '../constants';
import { User, FileText, RefreshCw, AlertTriangle, Search, Flag, CheckCircle, RotateCcw } from 'lucide-react';

const Sandbox = ({ isCertified }: { isCertified: boolean }) => {
  const [patients, setPatients] = useState(DUMMY_PATIENTS);
  const [activePatient, setActivePatient] = useState(DUMMY_PATIENTS[0]);
  const [noteDraft, setNoteDraft] = useState(`Subjective: ${DUMMY_PATIENTS[0].lastSessionSummary}\n\nObjective: Patient is engaged.\n\nAssessment: Symptoms stable.\n\nPlan: Continue current regimen.`);
  const [qaFlags, setQaFlags] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleReset = () => {
    setPatients(DUMMY_PATIENTS);
    setActivePatient(DUMMY_PATIENTS[0]);
    // Pre-fill with a realistic template based on history
    setNoteDraft(`Subjective: ${DUMMY_PATIENTS[0].lastSessionSummary}\n\nObjective: Patient is engaged.\n\nAssessment: Symptoms stable.\n\nPlan: Continue current regimen.`);
    setQaFlags([]);
    setLastSaved(null);
  };

  const handlePatientSelect = (p: typeof DUMMY_PATIENTS[0]) => {
    setActivePatient(p);
    setNoteDraft(`Subjective: ${p.lastSessionSummary}\n\nObjective: \n\nAssessment: \n\nPlan: `);
    setQaFlags([]);
    setLastSaved(null);
  };

  const handleSaveNote = () => {
    // Simulated QA Logic as per AC10
    const flags = [];
    if (noteDraft.length < 50) flags.push("Note too brief (<50 words)");
    if (!noteDraft.toLowerCase().includes("risk")) flags.push("Missing Risk Assessment keyword");
    
    // Simulate copy paste error (checking if other patient names exist in text)
    const otherNames = patients.filter(p => p.id !== activePatient.id).map(p => p.name.split(' ')[0]);
    otherNames.forEach(name => {
      if (noteDraft.includes(name)) flags.push(`Possible Name Error: Found "${name}"`);
    });

    setQaFlags(flags);
    if (flags.length === 0) {
      setLastSaved(new Date().toLocaleTimeString());
    }
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-100px)] rounded-xl border-4 border-dashed border-mans-300 relative">
      
      {/* Sandbox Banner */}
      <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-center text-xs font-bold py-1 uppercase tracking-widest z-10">
        Practice Mode • Sandbox Environment • Data resets on reload
      </div>

      <div className="flex h-full pt-6">
        {/* Patient List */}
        <div className="w-1/3 border-r border-gray-300 bg-white p-4 h-[600px] overflow-y-auto rounded-l-lg">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-700">Dummy Patients</h3>
             <button onClick={handleReset} className="text-xs flex items-center text-mans-600 hover:text-mans-800 bg-gray-100 px-2 py-1 rounded">
               <RotateCcw className="w-3 h-3 mr-1" /> Reset All Data
             </button>
           </div>
           
           <div className="space-y-2">
             {patients.map(p => (
               <div 
                 key={p.id}
                 onClick={() => handlePatientSelect(p)}
                 className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                   activePatient.id === p.id ? 'bg-mans-50 border-mans-400' : 'bg-white border-gray-200 hover:bg-gray-50'
                 }`}
               >
                 <div className="flex justify-between items-start">
                   <p className="font-bold text-sm text-gray-800">{p.name}</p>
                   {p.riskLevel === 'High' && <Flag className="w-4 h-4 text-red-500" />}
                 </div>
                 <p className="text-xs text-gray-500 mt-1">{p.diagnosis}</p>
               </div>
             ))}
           </div>
        </div>

        {/* Patient Detail / Workspace */}
        <div className="w-2/3 bg-gray-50 p-6 h-[600px] overflow-y-auto rounded-r-lg">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">{activePatient.name}</h2>
                 <p className="text-sm text-gray-500">{activePatient.age} yrs • {activePatient.diagnosis}</p>
               </div>
               <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                 activePatient.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 
                 activePatient.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                 'bg-red-100 text-red-800'
               }`}>
                 Risk: {activePatient.riskLevel}
               </div>
             </div>

             <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-6">
               <p className="text-xs font-bold text-gray-400 uppercase mb-1">Last Session ({activePatient.lastSessionDate})</p>
               <p className="text-sm text-gray-700 italic">"{activePatient.lastSessionSummary}"</p>
             </div>

             <div className="mb-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">New Session Note (Practice Area)</label>
               <textarea
                 value={noteDraft}
                 onChange={(e) => setNoteDraft(e.target.value)}
                 className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mans-200 focus:border-mans-500 text-sm"
                 placeholder="Type your session notes here. Remember: >50 words, include risk assessment..."
               />
             </div>

             {/* QA Feedback Area */}
             <div className="flex justify-between items-center mt-4">
               <button 
                 onClick={handleSaveNote}
                 className="bg-mans-600 hover:bg-mans-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
               >
                 Simulate Save & QA
               </button>
               
               {lastSaved && (
                 <div className="flex flex-col items-end">
                   <span className="text-green-600 text-sm flex items-center font-medium">
                     <CheckCircle className="w-4 h-4 mr-1" /> QA Approved
                   </span>
                   <span className="text-xs text-gray-400">Practice completed. Ready for certification.</span>
                 </div>
               )}
             </div>

             {qaFlags.length > 0 && (
               <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                 <h4 className="text-red-800 font-bold text-sm flex items-center mb-2">
                   <AlertTriangle className="w-4 h-4 mr-2" /> QA Flags Detected
                 </h4>
                 <ul className="list-disc list-inside text-sm text-red-700">
                   {qaFlags.map((flag, idx) => (
                     <li key={idx}>{flag}</li>
                   ))}
                 </ul>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
