import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  LayoutDashboard,
  Users,
  CheckCircle,
  Menu,
  X,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import TrainingGuide from './components/TrainingGuide';
import Sandbox from './components/Sandbox';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminAnalytics';
import Certificate from './components/Certificate';
import CourseDashboard from './components/CourseDashboard';
import { User } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'training' | 'sandbox' | 'quiz' | 'admin' | 'certificate'>('training');
  const [activeView, setActiveView] = useState<'dashboard' | 'course_content'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulated User State
  const [user, setUser] = useState<User>({
    id: 'th_001',
    name: 'Dr. Therapist',
    role: 'therapist',
    isCertified: false,
    progress: {
      module1: 0,
      module2: 0,
      module3: 0,
      module4: 0,
      module5: 0,
      module6: 0,
      module7: 0,
      quizPassed: false,
      quizAttempts: 0,
    }
  });

  const updateModuleProgress = (moduleId: keyof User['progress'], value: number) => {
    setUser(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [moduleId]: Math.max(prev.progress[moduleId] as number, value) // Only increase progress
      }
    }));
  };

  const handleCertification = () => {
    setUser(prev => ({
      ...prev,
      isCertified: true,
      certificationDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      certificateId: 'CERT-2025-' + Math.floor(1000 + Math.random() * 9000), // Unique ID
      progress: { ...prev.progress, quizPassed: true }
    }));
    setActiveTab('certificate');
  };

  const handleCourseSelect = (courseId: string) => {
    if (courseId === '5whys') {
      setActiveView('course_content');
    }
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
  };

  const NavItem = ({ id, label, icon: Icon, locked = false }: { id: string, label: string, icon: any, locked?: boolean }) => (
    <button
      onClick={() => {
        if (!locked) {
          setActiveTab(id as any);
          setActiveView('dashboard'); // Reset view when switching tabs
          setMobileMenuOpen(false);
        }
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
        ${activeTab === id
          ? 'bg-mans-100 text-mans-800'
          : 'text-gray-600 hover:bg-gray-50'
        }
        ${locked ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
      {locked && <ShieldAlert className="w-4 h-4 ml-auto text-gray-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-calm-bg font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          {/* Branding removed */}
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar Navigation - Only visible in course content view */}
        {activeView === 'course_content' && (
          <nav className={`
            fixed lg:static inset-0 z-40 bg-white border-r border-gray-200 w-64 transform transition-transform duration-200 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* ... Sidebar Content ... */}
            <div className="p-6">

              <div className="mb-8">
                <div className="px-4 py-3 bg-indigo-50 rounded-lg mb-4">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Status</p>
                  <div className="flex items-center">
                    {user.isCertified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-green-700">Certified</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-sm font-medium text-orange-700">In Training</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <NavItem id="training" label="Training Guide" icon={BookOpen} />
                <NavItem id="sandbox" label="Practice Sandbox" icon={LayoutDashboard} />
                <NavItem id="quiz" label="Certification Quiz" icon={GraduationCap} />

                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">My Career</p>
                </div>

                <NavItem
                  id="certificate"
                  label="My Certificate"
                  icon={Award}
                  locked={!user.isCertified}
                />

                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
                </div>

                <NavItem id="admin" label="Analytics" icon={Users} />
              </div>
            </div>

            {/* User Profile Snippet */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-mans-200 flex items-center justify-center text-mans-700 font-bold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate w-32">{user.name}</p>
                  <p className="text-xs text-gray-500">Therapist ID: {user.id}</p>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-calm-bg">
          {!user.isCertified && activeTab !== 'quiz' && activeTab !== 'training' && activeTab !== 'sandbox' && activeTab !== 'admin' && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 m-6 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldAlert className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-700">
                    <span className="font-bold">Account Access Restricted.</span> Complete the training and pass the certification quiz to unlock full platform features, patient bookings, and earnings dashboard.
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => setActiveTab('training')}
                      className="text-sm font-medium text-orange-700 hover:text-orange-600 underline"
                    >
                      Go to Training Guide &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {activeTab === 'training' && activeView === 'dashboard' && (
              <CourseDashboard user={user} onSelectCourse={handleCourseSelect} />
            )}
            {activeTab === 'training' && activeView === 'course_content' && (
              <TrainingGuide user={user} onUpdateProgress={updateModuleProgress} onBack={handleBackToDashboard} />
            )}
            {activeTab === 'sandbox' && <Sandbox isCertified={user.isCertified} />}
            {activeTab === 'quiz' && <Quiz user={user} onPass={handleCertification} />}
            {activeTab === 'certificate' && <Certificate user={user} />}
            {activeTab === 'admin' && <AdminDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;