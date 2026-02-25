
import React, { useState } from 'react';
import WaitingRoom from './components/WaitingRoom';
import VideoRoom from './components/VideoRoom';
import PatientPortal from './components/PatientPortal';
import VRSessionLauncher from './components/VRSessionLauncher';
import SessionStickyBar from './components/SessionStickyBar';
import { User, UserRole, Session, ViewState, SessionStatus, VRAccessTier } from './types';

interface AppProps {
  onBack?: () => void;
}

const App: React.FC<AppProps> = ({ onBack }) => {
  // Application is now strictly for Patients
  const [userRole] = useState<UserRole>(UserRole.PATIENT);

  const [patientUser] = useState<User>({
    id: 'pt-1',
    name: 'Anonymous User',
    role: UserRole.PATIENT,
    avatar: 'https://picsum.photos/seed/patient/200'
  });

  const currentUser = patientUser;

  // Static sessions representing joinable events for the patient
  const [sessions] = useState<Session[]>([
    {
      id: 'sess-123',
      patientName: 'Anonymous User',
      therapistName: 'Dr. Emily Chen',
      startTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      durationMinutes: 45,
      status: SessionStatus.SCHEDULED,
      isEncrypted: true,
      notes: "CBT Session #4"
    }
  ]);

  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const handleJoinSession = (session: Session) => {
    setActiveSession(session);
    if (session.isVR) {
      setCurrentView('VR_LAUNCHER');
    } else {
      setCurrentView('VIDEO_ROOM');
    }
  };

  const handleLaunchVR = (tier: VRAccessTier) => {
    if (activeSession) {
      setActiveSession({ ...activeSession, vrTier: tier });
      setCurrentView('VIDEO_ROOM');
    }
  };

  return (
    <div className="font-sans text-slate-900 min-h-screen bg-[#f8fbff] relative">
      {/* Global Session Indicator */}
      <SessionStickyBar />

      {currentView === 'DASHBOARD' && (
        <PatientPortal
          onJoinRoom={handleJoinSession}
          sessions={sessions}
          onBack={onBack}
        />
      )}

      {currentView === 'VR_LAUNCHER' && activeSession && (
        <VRSessionLauncher
          session={activeSession}
          currentUser={currentUser}
          onLaunch={handleLaunchVR}
          onBack={() => setCurrentView('DASHBOARD')}
        />
      )}

      {currentView === 'WAITING_ROOM' && activeSession && (
        <WaitingRoom
          session={activeSession}
          isTherapist={false}
          onAdmit={() => setCurrentView('VIDEO_ROOM')}
        />
      )}

      {currentView === 'VIDEO_ROOM' && activeSession && (
        <VideoRoom
          session={activeSession}
          currentUser={currentUser}
          onLeave={() => setCurrentView('FEEDBACK')}
        />
      )}

      {currentView === 'FEEDBACK' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-900/10 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-lg w-full text-center border border-white">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic text-[#1a2b4b]">Safe Logout</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-loose">Session ended. Connection severed. Metadata purged.</p>
            <button
              onClick={() => setCurrentView('DASHBOARD')}
              className="mt-8 w-full py-5 bg-[#0066ff] text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
            >
              Return to Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
