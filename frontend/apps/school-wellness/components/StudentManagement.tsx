
import React, { useState } from 'react';

interface StudentManagementProps {
  students: string[];
}

const StudentManagement: React.FC<StudentManagementProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const studentDetails = students.map((name, index) => {
    const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    const scores = [8.5, 7.2, 9.4, 6.1, 8.8, 7.5, 9.0, 7.8];
    
    return {
      id: `std-${index}`,
      name,
      grade: grades[index % grades.length],
      age: 14 + (index % 5),
      wellnessScore: scores[index % scores.length],
      status: index % 4 === 0 ? 'Review' : 'Active',
    };
  });

  const filtered = studentDetails.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Student Roster</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Institutional Records • Academic Year 2024-25</p>
        </div>
        <div className="relative group min-w-[320px]">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
          <input 
            type="text" 
            placeholder="Search student or class..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl font-bold text-[13px] text-slate-700 focus:border-[#1d7dfa] outline-none shadow-sm transition-all"
          />
        </div>
      </header>

      <div className="brand-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Age</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Grade</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-4.5 font-bold text-slate-900 text-sm">{s.name}</td>
                  <td className="px-8 py-4.5 font-bold text-slate-400 text-sm">{s.age}</td>
                  <td className="px-8 py-4.5 font-bold text-[#1d7dfa] text-[11px] uppercase tracking-wide">{s.grade}</td>
                  <td className="px-8 py-4.5 text-center">
                    <span className="font-black text-slate-800 text-base">{s.wellnessScore}</span>
                  </td>
                  <td className="px-8 py-4.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-8 py-4.5 text-right">
                    <button className="text-[11px] font-bold text-[#1d7dfa] hover:underline whitespace-nowrap">View Profile →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Enrollment" value={students.length.toString()} icon="🧑‍🎓" />
        <SummaryCard title="Avg Score" value="7.6/10" icon="📘" />
        <SummaryCard title="Compliance" value={`${Math.round((studentDetails.filter(s => s.status === 'Active').length / students.length) * 100)}%`} icon="🛡️" />
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="brand-card p-6 border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h2>
    </div>
    <span className="text-2xl opacity-60">{icon}</span>
  </div>
);

export default StudentManagement;
