import React, { useState } from 'react';
import { Patient } from '../types';
import { Button } from '../components/Button';
import { Activity, TrendingUp, IndianRupee, Check, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

export const PsychologistDashboard: React.FC = () => {
  const { patients, setReferral, psychologistWallet, referralWallet } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState(false);

  // Filter patients assigned to Dr. Sanky (Psychologist)
  const myPatients = patients.filter(p => p.assignedPsychologistId === 'psy1');

  // Filter active patients (exclude those who have been referred)
  const activePatientsCount = myPatients.filter(p => p.referralStatus === 'None').length;

  // Sort: Referred/Critical first
  const sortedPatients = [...myPatients].sort((a, b) => b.phq9Score - a.phq9Score);

  // Chart Data
  const REVENUE_DATA = [
    { name: 'Therapy', amount: psychologistWallet },
    { name: 'Referrals', amount: referralWallet },
  ];

  const [referralReason, setReferralReason] = useState({
    medsNeeded: false,
    notImproving: false,
    biological: false,
  });

  const handleReferralSubmit = () => {
    if (selectedPatient) {
        const reasons = [
            referralReason.medsNeeded ? 'Meds Needed' : '',
            referralReason.notImproving ? 'Not Improving' : '',
            referralReason.biological ? 'Biological Factors' : ''
        ].filter(Boolean).join(', ');

        setReferral(selectedPatient.id, reasons);
        
        setReferralModalOpen(false);
        setReferralSuccess(true);
        setTimeout(() => setReferralSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-800">Dr. Sanky</h1>
            <p className="text-slate-500 text-sm font-medium">Psychologist</p>
          </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
            title="Total Income" 
            value={`₹${psychologistWallet.toLocaleString()}`} 
            subtext="Sessions" 
            icon={<IndianRupee size={20} className="text-green-600" />} 
            color="bg-green-50" 
        />
        <StatCard 
            title="Referral Wallet" 
            value={`₹${referralWallet.toLocaleString()}`} 
            subtext="Bonuses" 
            icon={<TrendingUp size={20} className="text-purple-600" />} 
            color="bg-purple-50" 
        />
         <StatCard 
            title="Active Patients" 
            value={activePatientsCount} 
            subtext="Case Load" 
            icon={<Activity size={20} className="text-blue-600" />} 
            color="bg-blue-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-serif font-bold text-lg text-slate-800 mb-4">Patient Priority List</h2>
            <div className="space-y-3">
                {sortedPatients.length === 0 && (
                    <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-sm">
                        No active patients booked yet.
                    </div>
                )}
                {sortedPatients.map(patient => (
                    <div key={patient.id} className="group relative bg-slate-50 rounded-xl p-4 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300">
                        {/* Status Line */}
                        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${patient.phq9Score >= 15 ? 'bg-red-500' : 'bg-[#1d74f5]'}`}></div>
                        
                        <div className="pl-4 flex flex-col gap-3">
                            {/* Top Section: Details Side-by-Side */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm ${patient.phq9Score >= 15 ? 'bg-red-500' : 'bg-[#1d74f5]'}`}>
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-bold text-slate-900 text-lg leading-tight">{patient.name}</h4>
                                        <p className="font-mono text-xs font-medium text-slate-500">{patient.phoneNumber || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Date & Actions */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                 {/* Date Pill */}
                                 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 w-full md:w-auto">
                                     <Calendar size={16} className="text-[#1d74f5]" />
                                     <span className="text-sm font-bold text-slate-700 leading-none">
                                        {patient.bookingDate ? `${patient.bookingDate}` : 'Not Scheduled'}
                                     </span>
                                 </div>

                                 <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                     <div className="text-right">
                                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">PHQ-9</span>
                                         <span className={`text-lg font-bold ${patient.phq9Score >= 15 ? 'text-red-600' : 'text-blue-700'}`}>{patient.phq9Score}</span>
                                     </div>

                                     {patient.referralStatus !== 'None' ? (
                                         <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 flex items-center gap-1">
                                            <Check size={14} /> Referred
                                         </span>
                                     ) : (
                                        <Button 
                                            variant="outline" 
                                            className="px-4 py-2 h-auto text-xs bg-white hover:bg-[#1d74f5] hover:text-white border-blue-200 font-bold rounded-lg"
                                            onClick={() => { setSelectedPatient(patient); setReferralModalOpen(true); }}
                                        >
                                            Refer
                                        </Button>
                                     )}
                                 </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col">
            <h2 className="font-serif font-bold text-lg text-slate-800 mb-4">Income Sources</h2>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#64748b'}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Referral Modal */}
      {referralModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-serif font-bold text-xl text-slate-800">Refer to Psychiatrist</h3>
                        <p className="text-slate-500 text-sm">Patient: {selectedPatient.name}</p>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                        ₹100 Bonus
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <p className="font-semibold text-slate-700 text-xs">Reason for referral:</p>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-[#1d74f5]" checked={referralReason.medsNeeded} onChange={e => setReferralReason({...referralReason, medsNeeded: e.target.checked})} />
                        <span className="text-slate-700 text-sm">Medication evaluation needed</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-[#1d74f5]" checked={referralReason.notImproving} onChange={e => setReferralReason({...referralReason, notImproving: e.target.checked})} />
                        <span className="text-slate-700 text-sm">Symptoms not improving</span>
                    </label>
                     <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-[#1d74f5]" checked={referralReason.biological} onChange={e => setReferralReason({...referralReason, biological: e.target.checked})} />
                        <span className="text-slate-700 text-sm">Biological factors suspected</span>
                    </label>
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => setReferralModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1 py-2 text-sm" onClick={handleReferralSubmit}>Send Referral</Button>
                </div>
            </div>
        </div>
      )}

      {/* Success Notification */}
      {referralSuccess && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce z-50">
              <Check className="w-5 h-5" />
              <div>
                  <p className="font-bold text-sm">Referral Sent!</p>
                  <p className="text-[10px] opacity-90">₹100 added to wallet.</p>
              </div>
          </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon, color }: any) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">{title}</p>
            <h3 className="text-xl font-bold text-slate-800">{value}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
    </div>
);