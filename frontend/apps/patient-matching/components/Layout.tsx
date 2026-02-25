import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Brain, Stethoscope, User, LogOut } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isAssessment = location.pathname.includes('/assessment');
  const isBooking = location.pathname.includes('/select-');
  const isCrisis = location.pathname.includes('/crisis-support');

  // Hardcoded #f0f6ff ensures the light blue background is always visible
  if (isLanding || isAssessment || isBooking || isCrisis) {
    return <main className="min-h-screen bg-[#f0f6ff] font-sans text-slate-800">{children}</main>;
  }

  // Dashboard Navigation Logic
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#f0f6ff] flex font-sans text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="w-80 bg-white border-r border-blue-100 hidden md:flex flex-col fixed h-full z-20 shadow-lg">
        <div className="p-8 border-b border-blue-50">
          <div className="flex items-center gap-3 text-[#1d74f5] cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-blue-100 rounded-xl">
                <Heart className="fill-current w-8 h-8" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-slate-800">MANAS360</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          <NavItem 
            to="/psychologist" 
            icon={<Brain size={24} />} 
            label="Psychologist View" 
            active={isActive('/psychologist')}
            onClick={() => navigate('/psychologist')}
          />
          <NavItem 
            to="/psychiatrist" 
            icon={<Stethoscope size={24} />} 
            label="Psychiatrist View" 
            active={isActive('/psychiatrist')}
            onClick={() => navigate('/psychiatrist')}
          />
          <NavItem 
            to="/patient" 
            icon={<User size={24} />} 
            label="Patient View" 
            active={isActive('/patient')}
            onClick={() => navigate('/patient')}
          />
        </nav>

        <div className="p-6 border-t border-blue-50">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-4 px-6 py-4 text-base font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl w-full transition-colors"
          >
            <LogOut size={22} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Logo only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-blue-50 z-20 flex items-center px-4 justify-between shadow-sm">
          <div className="flex items-center gap-2 text-[#1d74f5]">
            <Heart className="fill-current w-6 h-6" />
            <span className="font-serif font-bold text-xl text-slate-800">MANAS360</span>
          </div>
          <button onClick={() => navigate('/')} className="p-2 text-slate-400">
              <LogOut size={20}/>
          </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-80 pt-20 pb-24 md:py-8 px-4 md:px-10 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 flex justify-around items-center p-2 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <MobileNavItem 
            icon={<Brain size={24} />} 
            label="Psych" 
            active={isActive('/psychologist')}
            onClick={() => navigate('/psychologist')}
          />
          <MobileNavItem 
            icon={<Stethoscope size={24} />} 
            label="MD" 
            active={isActive('/psychiatrist')}
            onClick={() => navigate('/psychiatrist')}
          />
           <MobileNavItem 
            icon={<User size={24} />} 
            label="Patient" 
            active={isActive('/patient')}
            onClick={() => navigate('/patient')}
          />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left ${
      active 
        ? 'bg-[#1d74f5] text-white shadow-lg shadow-blue-200' 
        : 'text-slate-600 hover:bg-blue-50 hover:text-[#1d74f5]'
    }`}
  >
    {icon}
    <span className="font-bold text-lg">{label}</span>
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl w-full gap-1 transition-colors ${
        active ? 'text-[#1d74f5] bg-blue-50' : 'text-slate-400'
      }`}
    >
        {icon}
        <span className="text-xs font-bold">{label}</span>
    </button>
);