import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, Clock, CheckCircle, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');

  // Mock Data for Charts
  const completionData = [
    { name: 'Mod 1', completed: 98 },
    { name: 'Mod 2', completed: 92 },
    { name: 'Mod 3', completed: 88 },
    { name: 'Mod 4', completed: 85 },
    { name: 'Mod 5', completed: 82 },
    { name: 'Mod 6', completed: 78 },
    { name: 'Mod 7', completed: 95 },
  ];

  const quizData = [
    { name: 'Pass (1st Try)', value: 65 },
    { name: 'Pass (Retake)', value: 25 },
    { name: 'In Progress', value: 10 },
  ];

  const COLORS = ['#48BB78', '#667EEA', '#ED8936'];

  const handleExport = () => {
    // Simulated CSV Export
    const csvContent = "data:text/csv;charset=utf-8,Module,Completion Rate\nMod 1,98%\nMod 2,92%\nMod 3,88%";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "training_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Training Analytics (Admin)</h1>
        <div className="flex gap-2">
          <div className="relative">
             <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
             <select 
               value={timeFilter}
               onChange={(e) => setTimeFilter(e.target.value)}
               className="bg-white border border-gray-300 text-gray-700 py-2 pl-9 pr-4 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-mans-500 focus:outline-none"
             >
               <option>Last 30 Days</option>
               <option>Last Quarter</option>
               <option>Year to Date</option>
             </select>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Therapists</h3>
            <Users className="w-5 h-5 text-mans-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">142</p>
          <p className="text-xs text-green-500 mt-1">+12 this week</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg Completion Time</h3>
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">3.8 hrs</p>
          <p className="text-xs text-green-500 mt-1">Target: 4 hrs (On Track)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Certification Rate</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">90%</p>
          <p className="text-xs text-gray-400 mt-1">128 Certified</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Video Engagement</h3>
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">76%</p>
          <p className="text-xs text-red-500 mt-1">Below Target (80%)</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Module Completion */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6">Completion by Module (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F7FAFC' }} />
                <Bar dataKey="completed" fill="#667EEA" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6">Quiz Performance</h3>
          <div className="h-64 flex">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quizData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {quizData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Improvement Areas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Most Failed Quiz Questions (Improvement Needed)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3">Question ID</th>
                <th className="p-3">Topic</th>
                <th className="p-3">Failure Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-mono text-xs">Q-01</td>
                <td className="p-3">5 Whys Purpose</td>
                <td className="p-3 text-red-500 font-bold">12%</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">Q-03</td>
                <td className="p-3">Common Mistakes</td>
                <td className="p-3 text-red-500 font-bold">38%</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">Q-04</td>
                <td className="p-3">When to Avoid</td>
                <td className="p-3 text-orange-500 font-bold">25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;