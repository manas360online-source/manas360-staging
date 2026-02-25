import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { HowItWorks } from './components/HowItWorks';
import { Testimonial } from './components/Testimonial';
import { FinalCTA } from './components/FinalCTA';
import { CrisisBanner } from './components/CrisisBanner';
import { Assessment } from './components/Assessment';
import { ResultsPage } from './components/ResultsPage';
import { CrisisPage } from './components/CrisisPage';
import { HomePage } from './components/HomePage';
import { OnboardingName } from './components/OnboardingName';
import { OnboardingEmail } from './components/OnboardingEmail';
import { AssessmentDashboard } from './components/AssessmentDashboard';
import { TherapistDashboard } from './components/TherapistDashboard';
import { SessionBuilder } from './components/SessionBuilder';
import { SessionRunner } from './components/SessionRunner';
import { SessionResultsView } from './components/SessionResultsView';
import { SubscribePage } from './components/SubscribePage';
import { PatientPlansPage } from './components/PatientPlansPage';
import { TherapistPlansPage } from './components/TherapistPlansPage';
import { CorporatePlansPage } from './components/CorporatePlansPage';
import { GuruPlansPage } from './components/GuruPlansPage';
import { BillingHistoryPage } from './components/BillingHistoryPage';
import { StreaksJourney } from './components/StreaksJourney';
import { SoundTherapyLanding } from './components/SoundTherapyLanding';
import { SoundPricingPage } from './components/SoundPricingPage';
import { SoundCategoryPage } from './components/SoundCategoryPage';
import { DeveloperApiResourcesPage } from './components/DeveloperApiResourcesPage';
import { CancellationRefundPolicy } from './components/CancellationRefundPolicy';
import { ARThemedRoomLanding } from './components/ARThemedRoomLanding';
import { ARPlansPage } from './components/ARPlansPage';
import { ARThemePlayer } from './components/ARThemePlayer';
import { ARRealRoomPlayer } from './components/ARRealRoomplayer';
import { FreeToolsPage } from './components/FreeToolsPage';
import { QuickLaunchDock } from './components/QuickLaunchDock';
import { DigitalPetHub } from './components/DigitalPetHub';
import { UniversalAuthPage } from './pages/UniversalAuthPage';

import { ProfileSetup } from './components/ProfileSetup';
import { WellnessSubscription } from './components/WellnessSubscription';
import TherapistRegistrationFlow from '../apps/therapist-registration-flow/TherapistRegistrationFlow';
import TherapistOnboardingApp from '../apps/therapist-onboarding/App';
import { PaymentOutcomeChoice } from './components/payment-gateway/PaymentOutcomeChoice';
import { PaymentSuccess } from './components/payment-gateway/PaymentSuccess';
import { PaymentFailure } from './components/payment-gateway/PaymentFailure';
import { PaymentGatewayLanding } from './components/payment-gateway/PaymentGatewayLanding';
import { PaymentMethodSelection } from './components/payment-gateway/PaymentMethodSelection';
import { Session } from './types';
import { storageService } from './utils/storageService';

import CBTApp from '../apps/cbt-session-engine/CBTApp';
import MeeraApp from '../apps/meera-ai-chatbot/MeeraApp';
import GroupSessionsApp from '../apps/group-sessions/App';
import CertificationPlatform from '../apps/certification-platform/CertificationApp';
import SchoolWellnessApp from '../apps/school-wellness/App';
import CorporateWellnessApp from '../apps/corporate-wellness/App';
import MatchingApp from '../apps/patient-matching/App';
import SingleMeetingJitsi from '../apps/single-meeting-jitsi/App';

import { AnalyticsDashboard } from './admin/pages/AnalyticsDashboard';
import { AdminLogin } from './admin/pages/AdminLogin';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { RequireFeature } from './components/guards/RequireFeature';
// import './admin/index.css'; // Keep disabled to avoid global style conflicts


export type ViewState =
  | 'landing'
  | 'auth'
  | 'assessment'
  | 'results'
  | 'crisis'
  | 'home'
  | 'onboarding-name'
  | 'onboarding-email'
  | 'full-assessment'
  | 'run-assessment'
  | 'therapist-dashboard'
  | 'session-builder'
  | 'session-preview'
  | 'session-results'
  | 'subscribe'
  | 'subscribe-patients'
  | 'subscribe-therapists'
  | 'subscribe-corporate'
  | 'subscribe-guru'
  | 'billing'
  | 'streaks-journey'
  | 'sound-therapy'
  | 'sound-therapy-plans'
  | 'sound-therapy-category'
  | 'sound-billing'
  | 'developer-api-resources'
  | 'cancellation-refund-policy'
  | 'ar-themed-room'
  | 'ar-plans'
  | 'ar-billing'
  | 'ar-player'
  | 'ar-real-room'
  | 'free-tools'

  | 'profile-setup'
  | 'wellness-subscription'
  | 'therapist-matching'
  | 'therapist-registration-flow'
  | 'therapist-onboarding'
  | 'cbt-sessions'
  | 'meera-chat'
  | 'group-sessions'
  | 'payment-choice'
  | 'payment-success'
  | 'payment-failure'
  | 'payment-landing'

  | 'payment-method'
  | 'certification-platform'
  | 'school-wellness'

  | 'corporate-wellness'
  | 'video-session'
  | 'digital-pet'
  | 'admin-login'
  | 'admin-dashboard'


type AssessmentData = Record<string, unknown> | null;
type UserData = { firstName?: string } & Record<string, unknown>;
type HistoryRecord = { sessionTitle?: string; sessionId?: string; answers?: unknown } & Record<string, unknown>;

const VIEW_MAP: Record<string, ViewState> = {
  auth: 'auth',
  login: 'auth',
  assessment: 'assessment',
  results: 'results',
  crisis: 'crisis',
  home: 'home',
  'onboarding/name': 'onboarding-name',
  'onboarding/email': 'onboarding-email',
  'full-assessment': 'full-assessment',
  'assessment/run': 'run-assessment',
  'assessment/view': 'session-results',
  therapist: 'therapist-dashboard',
  'therapist/builder': 'session-builder',
  'therapist/preview': 'session-preview',
  subscribe: 'subscribe',
  'subscribe/patients': 'subscribe-patients',
  'subscribe/therapists': 'subscribe-therapists',
  'subscribe/corporate': 'subscribe-corporate',
  'subscribe/guru': 'subscribe-guru',
  billing: 'billing',
  streaks: 'streaks-journey',
  'sound-therapy': 'sound-therapy',
  'sound-therapy-plans': 'sound-therapy-plans',
  'sound-therapy-category': 'sound-therapy-category',
  'sound-billing': 'sound-billing',
  'ar-themed-room': 'ar-themed-room',
  'ar-plans': 'ar-plans',
  'ar-billing': 'ar-billing',
  'ar-player': 'ar-player',
  'ar-real-room': 'ar-real-room',
  'developer-api-resources': 'developer-api-resources',
  'cancellation-refund-policy': 'cancellation-refund-policy',
  'free-tools': 'free-tools',

  'profile-setup': 'profile-setup',
  'wellness-subscription': 'wellness-subscription',
  'therapist-matching': 'therapist-matching',
  'therapist-onboarding': 'therapist-onboarding',
  'cbt-sessions': 'cbt-sessions',
  'meera-chat': 'meera-chat',
  'group-sessions': 'group-sessions',
  'payment-choice': 'payment-choice',
  'payment-success': 'payment-success',
  'payment-failure': 'payment-failure',
  'payment-landing': 'payment-landing',

  'payment-method': 'payment-method',
  'certification-platform': 'certification-platform',
  'school-wellness': 'school-wellness',
  'corporate-wellness': 'corporate-wellness',
  'video-session': 'video-session',
  'digital-pet': 'digital-pet',
  'admin/login': 'admin-login',

  'admin-dashboard': 'admin-dashboard',
};

const PREFIX_VIEWS: Array<{ prefix: string; view: ViewState }> = [
  { prefix: 'therapist-registration-flow', view: 'therapist-registration-flow' },
  { prefix: 'therapist-onboarding', view: 'therapist-onboarding' },
  { prefix: 'certification-platform', view: 'certification-platform' },
  { prefix: 'school-wellness', view: 'school-wellness' },
  { prefix: 'corporate-wellness', view: 'corporate-wellness' }
];

const resolveViewFromPath = (viewPath: string): ViewState => {
  for (const entry of PREFIX_VIEWS) {
    if (viewPath.startsWith(entry.prefix)) {
      return entry.view;
    }
  }
  return VIEW_MAP[viewPath] ?? 'landing';
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [currentSoundCategory, setCurrentSoundCategory] = useState<string>('');
  const [currentARThemeId, setCurrentARThemeId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(null);
  const [userData, setUserData] = useState<UserData>({});

  const [editingSession, setEditingSession] = useState<Session | undefined>(undefined);
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined);
  const [viewingHistoryRecord, setViewingHistoryRecord] = useState<HistoryRecord | null>(null);

  // Helper to get base path with current language
  const getPath = useCallback((view: string) => `#/${i18n.language}/${view}`, [i18n.language]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const transitionDelayMs = 300;
      const currentLang = i18n.language || 'en';

      // Regex to parse #/lang/view
      const match = hash.match(/^#\/([a-z]{2})\/(.*)$/);

      if (match) {
        const lang = match[1];
        const view = match[2];

        // Sync i18n language if URL differs
        if (lang !== i18n.language) {
          i18n.changeLanguage(lang);
        }

        setIsTransitioning(true);
        setTimeout(() => {
          const normalizedView = view.split('?')[0];

          if (normalizedView.startsWith('sound-therapy/plans')) {
            setCurrentView('sound-therapy-plans');
          } else if (normalizedView.startsWith('sound-therapy/billing')) {
            setCurrentView('sound-billing');
          } else if (normalizedView.startsWith('sound-therapy/')) {
            const category = normalizedView.split('/')[1] || '';
            setCurrentSoundCategory(category);
            setCurrentView('sound-therapy-category');
          } else if (normalizedView.startsWith('ar-themed-room/plans')) {
            setCurrentView('ar-plans');
          } else if (normalizedView.startsWith('ar-themed-room/billing')) {
            setCurrentView('ar-billing');
          } else if (normalizedView.startsWith('ar-themed-room/real-ar')) {
            setCurrentView('ar-real-room');
          } else if (normalizedView.startsWith('ar-themed-room/player/')) {
            const themeId = normalizedView.split('/')[2] || '';
            setCurrentARThemeId(themeId);
            setCurrentView('ar-player');
          } else if (normalizedView.startsWith('ar-themed-room')) {
            setCurrentView('ar-themed-room');
          } else if (normalizedView.startsWith('therapist-onboarding')) {
            setCurrentView('therapist-onboarding');
          } else if (normalizedView.startsWith('therapist-matching')) {
            setCurrentView('therapist-matching');
          } else if (normalizedView.startsWith('group-sessions')) {
            setCurrentView('group-sessions');
          } else if (normalizedView.startsWith('payment-choice')) {
            setCurrentView('payment-choice');
          } else if (normalizedView.startsWith('payment-landing')) {
            setCurrentView('payment-landing');
          } else if (normalizedView.startsWith('payment-method')) {
            setCurrentView('payment-method');
          } else if (normalizedView.startsWith('payment-success')) {
            setCurrentView('payment-success');
          } else if (normalizedView.startsWith('payment-failure')) {
            setCurrentView('payment-failure');
          } else if (normalizedView.startsWith('admin-dashboard')) {
            setCurrentView('admin-dashboard');

          } else {
            setCurrentView(resolveViewFromPath(normalizedView));
          }

          setIsTransitioning(false);
          window.scrollTo(0, 0);
        }, transitionDelayMs);
      } else {
        // Handle routes without lang prefix if any, or redirect defaults
        // Handle root case
        if (hash === '' || hash === '#/') {
          window.location.hash = `#/${currentLang}/landing`;
        } else {
          // Try to preserve view if it looks like a legacy route
          const legacyView = hash.replace('#/', '');
          if (legacyView) {
            window.location.hash = `#/${currentLang}/${legacyView}`;
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [i18n]);

  useEffect(() => {
    if (currentView !== 'landing') return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentView]);

  const navigate = useCallback((view: string) => {
    window.location.hash = getPath(view);
  }, [getPath]);

  const handleStartAssessment = useCallback(() => {
    navigate('auth');
  }, [navigate]);

  const handleAssessmentSubmit = useCallback((data: AssessmentData, isCritical: boolean) => {
    setAssessmentData(data);
    if (isCritical) {
      navigate('crisis');
    } else {
      navigate('results');
    }
  }, [navigate]);

  const handleUpdateUser = useCallback((data: UserData) => {
    setUserData((previous) => ({ ...previous, ...data }));
  }, []);

  const handleStartSession = useCallback((session: Session) => {
    setActiveSession(session);
    navigate('assessment/run');
  }, [navigate]);

  const handleSessionComplete = useCallback((answers: unknown) => {
    if (activeSession) {
      storageService.saveHistory({
        sessionTitle: activeSession.title,
        sessionId: activeSession.id,
        answers: answers
      });
    }
    navigate('full-assessment');
  }, [activeSession, navigate]);

  const handleViewHistory = useCallback((record: HistoryRecord) => {
    setViewingHistoryRecord(record);
    navigate('assessment/view');
  }, [navigate]);

  const handleCreateSession = useCallback(() => {
    setEditingSession(undefined);
    navigate('therapist/builder');
  }, [navigate]);

  const handleEditSession = useCallback((session: Session) => {
    setEditingSession(session);
    navigate('therapist/builder');
  }, [navigate]);

  const handlePreviewSession = useCallback((session: Session) => {
    setActiveSession(session);
    navigate('therapist/preview');
  }, [navigate]);

  const handleFloatingCloudClick = useCallback(() => {
    navigate('free-tools');
  }, [navigate]);

  const handleFloatingCloudKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFloatingCloudClick();
    }
  }, [handleFloatingCloudClick]);

  return (
    <div
      className={`
        relative min-h-screen font-sans 
        text-wellness-slate dark:text-slate-100
        bg-wellness-bg dark:bg-[#030712]
        transition-colors duration-500 ease-in-out
        ${isTransitioning ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* FLOATING CLOUD CTA (PERSISTENT IN APP, VISIBLE ONLY ON HOME) */}
      <div
        className={`fixed top-48 md:top-32 right-0 md:right-0 lg:right-0 z-[2500] cursor-pointer group flex flex-col items-center animate-float transition-opacity duration-300 ${(currentView === 'home') ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleFloatingCloudClick}
        onKeyDown={handleFloatingCloudKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Open free tools"
        style={{ animationDuration: '6s' }}
      >
        <div className="relative w-[130px] md:w-[170px] lg:w-[370px] hover:scale-105 transition-transform duration-500 filter drop-shadow-2xl">
          <img
            src="/images/floating-cloud.png"
            alt="Start Free"
            loading="eager"
            className="w-full h-auto object-contain opacity-100 brightness-110 contrast-125 relative z-10"
          />
          {/* Text Overlay on Cloud */}
          <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full pt-2 z-20">
            {/* Added 'force-cloud-text' class to prevent white text in dark mode */}
            <p className="font-serif font-bold text-[#0A3A78] force-cloud-text text-[0.8rem] md:text-[0.9rem] lg:text-[2.2rem] leading-[1.1] tracking-tight drop-shadow-md whitespace-nowrap lg:whitespace-normal">
              Click to<br />Start Free
            </p>
          </div>

          {/* Shiny Blowing Thunder Effect */}
          <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 z-0 flex justify-center">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 md:w-8 md:h-8 lg:w-20 lg:h-20 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.9)] animate-pulse"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {/* Glow effect backing */}
              <div className="absolute inset-0 bg-sky-400 blur-xl opacity-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {currentView === 'landing' && (
        <>
          <QuickLaunchDock />

          <div
            className="landing relative w-full transition-colors duration-500 overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2560&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'scroll',
            }}
          >
            <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-700 backdrop-brightness-100 dark:backdrop-brightness-[0.3]"></div>
            <div className="absolute inset-0 bg-[#E0F2FE]/30 dark:bg-slate-950/70 mix-blend-overlay dark:mix-blend-normal pointer-events-none z-[1] transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB]/40 via-[#E0F2FE]/40 to-[#FDFCF8] dark:from-slate-950/90 dark:via-slate-900/50 dark:to-[#030712] pointer-events-none z-[2] transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/80 to-transparent dark:from-[#030712] dark:via-[#030712]/95 transition-all duration-500 z-10"></div>
            <BackgroundParticles />

            <Header
              onLoginClick={() => navigate('auth')}
            />
            <div className="landing-content relative z-20 w-full max-w-[1400px] mx-auto px-4 py-4 pb-32 md:pb-48">
              <Hero onStartClick={handleStartAssessment} />
            </div>
          </div>

          <main className="relative z-30 flex flex-col gap-32 w-full max-w-[1280px] mx-auto px-6 -mt-24 pb-24">
            <div className="reveal"><TrustBar /></div>
            <div className="reveal"><HowItWorks /></div>
            <div className="reveal"><Testimonial /></div>
            <FinalCTA onStartClick={handleStartAssessment} />
          </main>
          <CrisisBanner />
        </>
      )}

      {currentView === 'auth' && (
        <UniversalAuthPage
          onSuccess={(role, user) => {
            const roleRoutes: Record<string, string> = {
              patient: 'profile-setup',
              therapist: 'therapist-onboarding',
              corporate: 'corporate-wellness',
              education: 'school-wellness',
              healthcare: 'home',
              insurance: 'home',
              government: 'home'
            };
            handleUpdateUser(user);
            navigate(roleRoutes[role] || 'home');
          }}
          onAdminLoginClick={() => navigate('admin/login')}
        />
      )}

      {currentView === 'assessment' && <Assessment onSubmit={handleAssessmentSubmit} />}
      {currentView === 'results' && <ResultsPage data={assessmentData} />}
      {currentView === 'full-assessment' && <AssessmentDashboard onStartSession={handleStartSession} onViewHistory={handleViewHistory} onBack={() => navigate('results')} />}
      {currentView === 'run-assessment' && activeSession && <SessionRunner session={activeSession} onComplete={handleSessionComplete} onExit={() => navigate('full-assessment')} />}
      {currentView === 'session-results' && viewingHistoryRecord && <SessionResultsView historyRecord={viewingHistoryRecord} onBack={() => navigate('full-assessment')} />}
      {currentView === 'crisis' && <CrisisPage />}
      {currentView === 'home' && <HomePage />}
      {currentView === 'onboarding-name' && <OnboardingName onNext={(data) => { handleUpdateUser(data); navigate('onboarding/email'); }} />}
      {currentView === 'onboarding-email' && <OnboardingEmail userName={userData.firstName} />}
      {currentView === 'therapist-dashboard' && <TherapistDashboard onCreate={handleCreateSession} onEdit={handleEditSession} onPreview={handlePreviewSession} />}
      {currentView === 'session-builder' && <SessionBuilder initialSession={editingSession} onSave={() => navigate('therapist')} onCancel={() => navigate('therapist')} />}
      {currentView === 'session-preview' && activeSession && <SessionRunner session={activeSession} onExit={() => navigate('therapist')} onComplete={() => { alert('Preview Complete!'); navigate('therapist'); }} />}
      {currentView === 'subscribe' && <SubscribePage />}
      {currentView === 'subscribe-patients' && <PatientPlansPage />}
      {currentView === 'subscribe-therapists' && <TherapistPlansPage />}
      {currentView === 'subscribe-corporate' && <CorporatePlansPage />}
      {currentView === 'subscribe-guru' && <GuruPlansPage />}
      {currentView === 'billing' && <BillingHistoryPage context="general" />}
      {currentView === 'streaks-journey' && <StreaksJourney />}
      {currentView === 'sound-therapy' && <SoundTherapyLanding />}
      {currentView === 'sound-therapy-plans' && <SoundPricingPage />}
      {currentView === 'sound-therapy-category' && <SoundCategoryPage category={currentSoundCategory} />}
      {currentView === 'sound-billing' && <BillingHistoryPage context="sound" />}
      {currentView === 'developer-api-resources' && <DeveloperApiResourcesPage />}
      {currentView === 'cancellation-refund-policy' && <CancellationRefundPolicy />}
      {currentView === 'ar-themed-room' && <ARThemedRoomLanding />}
      {currentView === 'ar-plans' && <ARPlansPage />}
      {currentView === 'ar-billing' && <BillingHistoryPage context="ar" />}
      {currentView === 'ar-player' && <ARThemePlayer themeId={currentARThemeId} />}
      {currentView === 'ar-real-room' && <ARRealRoomPlayer />}
      {currentView === 'free-tools' && <FreeToolsPage />}

      {currentView === 'profile-setup' && <ProfileSetup />}
      {currentView === 'wellness-subscription' && <WellnessSubscription />}
      {currentView === 'therapist-registration-flow' && <TherapistRegistrationFlow onBack={() => navigate('landing')} />}
      {currentView === 'therapist-onboarding' && <TherapistOnboardingApp onBack={() => navigate('landing')} />}
      {currentView === 'therapist-matching' && <MatchingApp basename={`/${i18n.language}/therapist-matching`} />}
      {currentView === 'cbt-sessions' && <CBTApp onBack={() => navigate('home')} />}
      {currentView === 'meera-chat' && <MeeraApp onBack={() => navigate('home')} />}
      {currentView === 'group-sessions' && <GroupSessionsApp onBack={() => navigate('home')} />}
      {currentView === 'payment-choice' && <PaymentOutcomeChoice />}
      {currentView === 'payment-landing' && <PaymentGatewayLanding />}
      {currentView === 'payment-method' && <PaymentMethodSelection />}
      {currentView === 'payment-success' && <PaymentSuccess />}

      {currentView === 'payment-failure' && <PaymentFailure />}
      {currentView === 'certification-platform' && <CertificationPlatform basePath={`/${i18n.language}/certification-platform`} />}
      {currentView === 'school-wellness' && <SchoolWellnessApp onBack={() => navigate('home')} />}
      {currentView === 'corporate-wellness' && <CorporateWellnessApp onBack={() => navigate('home')} />}
      {currentView === 'video-session' && <SingleMeetingJitsi onBack={() => navigate('therapist-matching/patient')} onHome={() => navigate('home')} />}
      {currentView === 'digital-pet' && <DigitalPetHub onBack={() => navigate('home')} />}
      {currentView === 'admin-login' && <AdminLogin onNavigate={navigate} onLoginSuccess={() => navigate('admin-dashboard')} />}

      {currentView === 'admin-dashboard' && (
        <ProtectedRoute allowedRoles={['admin']}>
          <AnalyticsDashboard />
        </ProtectedRoute>
      )}

    </div>
  );
};

export default App;