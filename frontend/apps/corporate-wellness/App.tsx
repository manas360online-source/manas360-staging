import React, { useState } from 'react';
import { User, Role } from './types';
import { MOCK_USERS } from './constants';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import ChallengeManagement from './components/ChallengeManagement';
import CompanySettings from './components/CompanySettings';
import ReportsHistory from './components/ReportsHistory';
import CorporateOnboarding from './components/CorporateOnboarding';

const App: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS.find(u => u.role === Role.HR_ADMIN) || null);
  const [view, setView] = useState<'home' | 'challenges' | 'users' | 'settings' | 'reports'>('home');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [importedUsers, setImportedUsers] = useState<string[]>([]);

  const handleLogout = () => {
    setIsSetupComplete(false);
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      setView('home');
    }
  };

  const handleSetupComplete = (roster: string[]) => {
    setImportedUsers(roster);
    setIsSetupComplete(true);
  };

  if (!isSetupComplete) {
    return <CorporateOnboarding onComplete={handleSetupComplete} onBack={handleGoBack} />;
  }

  const renderContent = () => {
    if (!currentUser) return null;
    switch (view) {
      case 'home': return <Dashboard user={currentUser} />;
      case 'users': return <UserManagement users={importedUsers} />;
      case 'challenges': return <ChallengeManagement onBack={handleGoBack} />;
      case 'settings': return <CompanySettings user={currentUser} />;
      case 'reports': return <ReportsHistory />;
      default: return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      <aside className="w-full md:w-60 bg-white border-r border-slate-200 flex flex-col z-10 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight leading-none">Console</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1.5">Admin Gateway</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 py-6">
          <NavItem active={view === 'home'} onClick={() => setView('home')} icon="🏠" label="Dashboard" />
          <NavItem active={view === 'users'} onClick={() => setView('users')} icon="👥" label="Directory" />
          <NavItem active={view === 'challenges'} onClick={() => setView('challenges')} icon="🏆" label="Programs" />
          <NavItem active={view === 'reports'} onClick={() => setView('reports')} icon="📄" label="Archives" />
          <NavItem active={view === 'settings'} onClick={() => setView('settings')} icon="⚙️" label="Setup" />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 py-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all font-medium text-xs border border-slate-200"
          >
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium text-xs"
          >
            Reset Session
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${active
      ? 'bg-blue-50 text-[#1d7dfa] font-semibold'
      : 'text-slate-500 hover:text-[#1d7dfa] hover:bg-slate-50 font-normal'
      }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[11px] uppercase tracking-wide font-medium">{label}</span>
  </button>
);

export default App;