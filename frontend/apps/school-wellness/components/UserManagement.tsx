
import React, { useState } from 'react';

interface UserManagementProps {
  users: string[];
}

const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Generate mock data for the imported users
  const userDetails = users.map((name, index) => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'Product', 'HR', 'Support'];
    const scores = [8.2, 7.5, 9.1, 6.8, 8.5, 7.2, 8.8, 5.9];
    const statuses = ['Active', 'Active', 'Inactive', 'Active', 'Pending'];
    
    return {
      id: `emp-${index}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@globaltech.com`,
      department: departments[index % departments.length],
      wellnessScore: scores[index % scores.length],
      engagement: `${Math.floor(Math.random() * 40 + 60)}%`,
      status: statuses[index % statuses.length],
      lastActive: `${Math.floor(Math.random() * 24)}h ago`
    };
  });

  const filteredUsers = userDetails.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Workforce Directory</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Manage & Monitor Employee Wellbeing</p>
        </div>
        <div className="relative group min-w-[320px]">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name, email or department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-full font-bold text-xs uppercase tracking-widest text-slate-700 focus:border-[#1d7dfa] outline-none shadow-xl shadow-blue-500/5 transition-all"
          />
        </div>
      </header>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Employee</th>
                <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Department</th>
                <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">Wellness Score</th>
                <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">Engagement</th>
                <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#1d7dfa] font-black group-hover:bg-white transition-colors border border-slate-100">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight">{user.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 lowercase tracking-widest">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.department}</span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.wellnessScore > 8 ? 'bg-emerald-400' : user.wellnessScore > 7 ? 'bg-[#1d7dfa]' : 'bg-amber-400'}`}></span>
                        <span className="text-lg font-black text-slate-900">{user.wellnessScore}</span>
                        <span className="text-[10px] text-slate-300">/10</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="text-sm font-black text-slate-900">{user.engagement}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        user.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="text-slate-300 hover:text-[#1d7dfa] transition-colors font-black text-[10px] uppercase tracking-widest">
                        Analysis →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-6 grayscale opacity-20">👤</span>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching personnel found in directory</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <SummaryCard title="Workforce Strength" value={users.length.toString()} sub="Total Registered" icon="📊" />
        <SummaryCard title="Avg Unit Pulse" value="7.8/10" sub="System-wide Avg" icon="💓" />
        <SummaryCard title="Sync Latency" value="2.4ms" sub="Real-time Health" icon="⚡" />
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; value: string; sub: string; icon: string }> = ({ title, value, sub, icon }) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5 transition-all hover:shadow-2xl hover:-translate-y-1">
    <div className="flex items-center justify-between mb-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h2>
    <p className="text-[10px] font-bold text-[#1d7dfa] uppercase tracking-widest mt-2">{sub}</p>
  </div>
);

export default UserManagement;
