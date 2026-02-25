import React from 'react';
import { Button } from '../components/Button';
import { IndianRupee, Activity, Calendar, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PsychiatristDashboard: React.FC = () => {
  const { patients, psychiatristWallet, acceptReferral, setCurrentUser } = useApp();
  
  // Filter: Direct bookings to Psych OR Referred patients
  const myPatients = patients.filter(p => 
      (p.bookedDoctorRole === 'Psychiatrist' && p.isBooked) || 
      (p.referralStatus !== 'None')
  );

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
             <div>
                <h1 className="font-serif text-2xl font-bold text-slate-800">Dr. Mahantesh Patil</h1>
                <p className="text-slate-500 text-sm font-medium">Psychiatrist • Advanced Clinical Specialist</p>
             </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
                title="Total Income" 
                value={`₹${psychiatristWallet.toLocaleString()}`} 
                subtext="From Sessions" 
                icon={<IndianRupee size={20} className="text-green-600" />} 
                color="bg-green-50" 
            />
            <StatCard 
                title="Active Patients" 
                value={myPatients.length} 
                subtext="Total Case Load" 
                icon={<Activity size={20} className="text-blue-600" />} 
                color="bg-blue-50" 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Incoming Cases */}
            <div className="col-span-full bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-serif font-bold text-lg text-slate-800 mb-4">Incoming Cases</h3>
                
                <div className="space-y-3">
                    {myPatients.length === 0 && (
                        <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-sm">
                            No pending referrals or direct bookings.
                        </div>
                    )}

                    {myPatients.map(patient => {
                        // Determine State
                        const isPsychiatristBooked = patient.bookedDoctorRole === 'Psychiatrist' && patient.isBooked;
                        const isReferral = patient.referralStatus !== 'None';
                        const isReferralAccepted = patient.referralStatus === 'Accepted';
                        
                        return (
                            <div key={patient.id} className="group relative bg-slate-50 rounded-xl p-4 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300">
                                {/* Status Line */}
                                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${patient.phq9Score >= 15 ? 'bg-red-500' : 'bg-[#1d74f5]'}`}></div>
                                
                                <div className="pl-4 flex flex-col gap-3">
                                    {/* Top Section: Name, Number, Source */}
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

                                        <div className="flex items-center gap-8 px-2">
                                             <div className="flex flex-col items-end md:items-start">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Source</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {isReferral ? 'Dr. Sanky' : 'Direct Booking'}
                                                    </span>
                                                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                        {isReferral ? 'Referral' : 'Portal'}
                                                    </span>
                                                </div>
                                             </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Schedule & Actions */}
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                         {/* Date Pill - ONLY shows date if booked */}
                                         <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 w-full md:w-auto">
                                             <Calendar size={16} className={isPsychiatristBooked ? "text-[#1d74f5]" : "text-slate-400"} />
                                             <div className="flex flex-col">
                                                 <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-0.5">
                                                    {isPsychiatristBooked ? 'Appointment' : 'Status'}
                                                 </span>
                                                 <span className="text-sm font-bold text-slate-800 leading-none">
                                                    {isPsychiatristBooked 
                                                        ? `${patient.bookingDate}, ${patient.bookingTime}` 
                                                        : (isReferralAccepted ? 'Request Sent' : 'Pending Schedule')
                                                    }
                                                 </span>
                                             </div>
                                         </div>

                                         <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                             <div className="text-right">
                                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">PHQ-9</span>
                                                 <span className={`text-lg font-bold ${patient.phq9Score >= 15 ? 'text-red-600' : 'text-blue-700'}`}>{patient.phq9Score}</span>
                                             </div>

                                             <Button 
                                                variant={isPsychiatristBooked ? "outline" : (isReferralAccepted ? "secondary" : "primary")}
                                                className={`px-4 py-2 h-auto text-xs font-bold rounded-lg ${isPsychiatristBooked ? "bg-white border-blue-200" : (isReferralAccepted ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed" : "bg-[#1d74f5] text-white")}`}
                                                onClick={() => {
                                                    // ONE-TIME ACTION: Only if not booked and not already accepted
                                                    if (!isPsychiatristBooked && !isReferralAccepted) {
                                                        acceptReferral(patient.id);
                                                        // Sets the active user so the Patient Dashboard shows this specific patient when visited manually.
                                                        setCurrentUser(patient.id); 
                                                    }
                                                }}
                                                disabled={isReferralAccepted && !isPsychiatristBooked} // Disable if accepted but not booked yet (waiting for patient)
                                             >
                                                 {isPsychiatristBooked ? 'View Session' : (isReferralAccepted ? 'Request Sent' : 'Accept & Request')}
                                             </Button>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
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