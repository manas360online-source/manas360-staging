import React, { useState } from 'react';

interface UserManagementProps {
  users: string[];
}

const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Workforce Directory</h1>
          <p className="text-slate-400 font-medium uppercase text-[11px] tracking-wider mt-1">Personnel Registry • Status Management</p>
        </div>
        <div className="relative group min-w-[320px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="Search roster..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="brand-input pl-10 h-11"
          />
        </div>
      </header>

      <div className="brand-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Identity</th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider text-center">Pulse</th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider text-center">Sync</th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider text-right">Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-[#1d7dfa] font-semibold text-xs border border-slate-100 transition-colors">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm tracking-tight">{user.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{user.department}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.wellnessScore > 8 ? 'bg-emerald-500' : user.wellnessScore > 7 ? 'bg-[#1d7dfa]' : 'bg-amber-500'}`}></span>
                        <span className="text-sm font-semibold text-slate-800">{user.wellnessScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-600">{user.engagement}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        user.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors font-semibold text-[11px] uppercase tracking-wider">
                        Profile →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-slate-400 font-medium uppercase text-[11px] tracking-wider">No matching registry entries</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Registry Total" value={users.length.toString()} icon="📊" />
        <SummaryCard title="Global Pulse" value="7.8/10" icon="💓" />
        <SummaryCard title="Live Sync" value="Stable" icon="⚡" />
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="brand-card p-6 transition-all hover:translate-y-[-2px]">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{title}</p>
      <span className="text-xl">{icon}</span>
    </div>
    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</h2>
  </div>
);

export default UserManagement;