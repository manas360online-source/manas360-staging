import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-300 mb-6">Authenticated workspace for MANAS360 users.</p>
        <div className="rounded-xl bg-slate-800/80 p-4 mb-6 text-sm">
          <p><span className="text-slate-400">User:</span> {user?.email || 'Unknown'}</p>
          <p><span className="text-slate-400">Role:</span> {user?.role || 'user'}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            Back to Landing
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
