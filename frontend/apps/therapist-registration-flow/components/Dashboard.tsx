
import React from 'react';
import { ArrowLeft, LayoutDashboard, Users, Calendar, BarChart3, Clock, Settings, Bell, Star } from 'lucide-react';

interface Props {
  name: string;
  onNext: () => void;
  onBack: () => void;
  onViewPatients: () => void;
}

const Dashboard: React.FC<Props> = ({ name, onNext, onBack, onViewPatients }) => {
  return (
    <div className="w-full flex gap-8 items-stretch min-h-[70vh]">
      {/* Mini Sidebar Nav */}
      <div className="hidden lg:flex flex-col bg-white rounded-[2.5rem] p-6 shadow-xl border border-white w-24 items-center justify-between py-12">
        <div className="flex flex-col gap-8 items-center">
          <div className="bg-[#1D75FF] p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
            <LayoutDashboard size={24} />
          </div>
          <button onClick={onViewPatients} className="text-slate-300 hover:text-[#1D75FF] transition-colors">
            <Users size={24} />
          </button>
          <div className="text-slate-300 hover:text-[#1D75FF] transition-colors cursor-pointer">
            <Calendar size={24} />
          </div>
          <button onClick={onNext} className="text-slate-300 hover:text-[#1D75FF] transition-colors">
            <BarChart3 size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-6 items-center">
          <div className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
            <Bell size={24} />
          </div>
          <div className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
            <Settings size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {/* Header Bar */}
        <div className="bg-white rounded-[2.5rem] px-10 py-8 shadow-xl border border-white flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#EDF5FF] flex items-center justify-center text-[#1D75FF] font-black text-2xl">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#1D3A63]">Hello, {name}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Verified Mental Health Professional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right mr-4">
               <div className="flex items-center gap-1 justify-end">
                 <Star size={14} className="fill-amber-400 text-amber-400" />
                 <span className="font-black text-slate-800">4.9</span>
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Rating</p>
             </div>
             <button onClick={onBack} className="bg-[#EDF5FF] hover:bg-[#D0E4FF] p-4 rounded-2xl transition-all">
               <ArrowLeft size={24} className="text-[#1D75FF]" />
             </button>
          </div>
        </div>

        {/* Stats and Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Patients', value: '124', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Sessions Today', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Revenue (MTD)', value: '₹1.8L', icon: BarChart3, color: 'text-[#1D75FF]', bg: 'bg-[#EDF5FF]' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-lg border border-white flex items-center gap-5 group hover:-translate-y-1 transition-all">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={28} />
                  </div>
                  <div>
                    <span className="block text-3xl font-black text-slate-900">{stat.value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Snapshot */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white flex items-center justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-[#1D3A63]">Your Clinical Impact</h3>
                <p className="text-slate-400 max-w-sm">85% improvement rate across your patient directory this quarter.</p>
                <button onClick={onNext} className="text-[#1D75FF] font-black flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest">
                  Detailed Analytics <ArrowLeft className="rotate-180" size={18} />
                </button>
              </div>
              <div className="hidden md:flex items-end gap-2 h-32">
                 {[40, 70, 45, 90, 65, 80].map((h, i) => (
                   <div key={i} className="w-4 bg-blue-100 rounded-full flex flex-col justify-end overflow-hidden group">
                     <div className="w-full bg-[#1D75FF] rounded-full transition-all duration-1000 group-hover:bg-blue-600" style={{ height: `${h}%` }} />
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sessions Feed */}
          <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-white flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#1D3A63]">Upcoming</h3>
              <span className="bg-[#EDF5FF] text-[#1D75FF] px-3 py-1 rounded-full text-[10px] font-black uppercase">Next: 15 mins</span>
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                { name: 'Ravi Kumar', time: '4:00 PM', type: 'CBT Follow-up', color: 'bg-amber-400' },
                { name: 'Meera Singh', time: '5:30 PM', type: 'Initial Assessment', color: 'bg-[#1D75FF]' },
                { name: 'Sanya Iyer', time: '7:00 PM', type: 'Family Therapy', color: 'bg-emerald-400' },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#EDF5FF]/50 transition-colors border border-transparent hover:border-[#D0E4FF]/30 group cursor-pointer">
                  <div className={`w-1 bg-slate-100 h-10 rounded-full group-hover:${s.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-slate-800">{s.name}</span>
                       <span className="font-black text-[#1D3A63] text-sm">{s.time}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{s.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onViewPatients} className="mt-8 w-full py-4 bg-[#1D75FF] text-white font-black rounded-full hover:bg-blue-600 transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
              View All Patients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
