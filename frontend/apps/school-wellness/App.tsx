
import React, { useState } from 'react';
import { User, Role } from './types';
import { MOCK_USERS } from './constants';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import ChallengeManagement from './components/ChallengeManagement';
import CompanySettings from './components/CompanySettings';
import ReportsHistory from './components/ReportsHistory';
import SchoolOnboarding from './components/SchoolOnboarding';

const App: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [view, setView] = useState<'home' | 'students' | 'challenges' | 'settings' | 'reports'>('home');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [importedStudents, setImportedStudents] = useState<string[]>([]);

  const handleLogout = () => {
    setIsSetupComplete(false);
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleSetupComplete = (roster: string[]) => {
    setImportedStudents(roster);
    setIsSetupComplete(true);
  };

  if (!isSetupComplete) {
    return <SchoolOnboarding onComplete={handleSetupComplete} onBack={onBack} />;
  }

  const renderContent = () => {
    if (!currentUser) return null;
    switch (view) {
      case 'home': return <Dashboard user={currentUser} />;
      case 'students': return <StudentManagement students={importedStudents} />;
      case 'challenges': return <ChallengeManagement />;
      case 'settings': return <CompanySettings user={currentUser} />;
      case 'reports': return <ReportsHistory />;
      default: return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white/90 backdrop-blur-xl border-r border-slate-100 flex flex-col z-10 sticky top-0 md:h-screen shadow-lg">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-black text-[#1d7dfa] tracking-tighter uppercase italic leading-none">School</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 opacity-60">Admin Console</p>
        </div>

        <div className="px-8">
          <div className="h-px bg-slate-100 w-full" />
        </div>

        <nav className="flex-1 px-4 space-y-2 py-6">
          <NavItem active={view === 'home'} onClick={() => setView('home')} icon="🏫" label="Overview" />
          <NavItem active={view === 'students'} onClick={() => setView('students')} icon="🧑‍🎓" label="Students" />
          <NavItem active={view === 'challenges'} onClick={() => setView('challenges')} icon="📚" label="Curriculum" />
          <NavItem active={view === 'reports'} onClick={() => setView('reports')} icon="📊" label="Analytic Reports" />
          <NavItem active={view === 'settings'} onClick={() => setView('settings')} icon="⚙️" label="Config" />
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wide border border-slate-200 group shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span className="text-lg group-hover:-translate-x-0.5 transition-transform">🔙</span>
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wide active:scale-95 whitespace-nowrap"
          >
            <span className="text-lg">🔄</span>
            Reset Session
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-10 max-w-screen-2xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 ${active
        ? 'bg-[#1d7dfa] text-white font-bold shadow-md shadow-blue-500/20'
        : 'text-slate-400 hover:text-[#1d7dfa] hover:bg-blue-50/50 font-bold'
      }`}
  >
    <span className="text-xl shrink-0">{icon}</span>
    <span className="text-[12px] uppercase tracking-tight font-bold whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
  </button>
);

export default App;
