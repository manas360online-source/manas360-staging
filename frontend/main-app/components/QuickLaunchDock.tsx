
import React, { useState, useEffect, useRef } from 'react';
import './QuickLaunchDock.css';

export const QuickLaunchDock: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showBadge, setShowBadge] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show badge after delay
    const timer = setTimeout(() => {
      setShowBadge(true);
    }, 3000);

    // Hide hint after delay
    const hintTimer = setTimeout(() => {
      setShowHint(false);
    }, 6000);

    // Close panel on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      clearTimeout(hintTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openPanel = (feature: string) => {
    setShowHint(false);
    if (activePanel === feature) {
      closePanel();
    } else {
      setActivePanel(feature);
    }
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  const toggleDock = () => {
    setIsCollapsed(!isCollapsed);
  };

  const launchFeature = (feature: string) => {
    closePanel();

    // Simple visual feedback
    const btn = document.querySelector(`.dock-item[data-feature="${feature}"]`) as HTMLElement;
    if (btn) {
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 400);
    }

    // Routing Logic
    switch (feature) {
      case 'buddy':
      case 'vent':
      case 'meera':
        window.location.hash = '#/meera-chat';
        break;
      case 'voice':
      case 'assess':
        window.location.hash = '#/assessment';
        break;
      case 'garden':
        window.location.hash = '#/ar-themed-room';
        break;
      case 'sound':
        window.location.hash = '#/sound-therapy';
        break;
      default:
        console.log(`Launching ${feature}`);
    }
  };

  // Helper to adjust panel position on Desktop
  const getPanelStyle = (feature: string) => {
    if (window.innerWidth <= 768) return {}; // CSS handles mobile positioning

    // Find the item
    const item = document.querySelector(`.dock-item[data-feature="${feature}"]`);
    if (!item) return {};

    const rect = item.getBoundingClientRect();
    const panelHeight = 380;
    let top = rect.top + rect.height / 2 - panelHeight / 2;

    // Boundary check
    top = Math.max(20, Math.min(top, window.innerHeight - panelHeight - 20));

    return {
      top: `${top}px`,
      transform: 'translateX(0)' // Reset any existing transform from class
    };
  };

  return (
    <div className="quick-launch-wrapper">
      {/* PANEL OVERLAY */}
      <div
        className={`panel-overlay ${activePanel ? 'active' : ''}`}
        onClick={closePanel}
      ></div>

      {/* HINT */}
      {showHint && (
        <div className="dock-hint">
          ✨ Try tapping an icon — cool stuff awaits!
        </div>
      )}

      {/* THE DOCK */}
      <div className={`dock ${isCollapsed ? 'collapsed' : ''}`} id="dock">

        <div
          className={`dock-item buddy ${activePanel === 'buddy' ? 'active-item' : ''}`}
          onClick={() => openPanel('buddy')}
          data-feature="buddy"
        >
          <span className="badge" style={{ display: showBadge ? 'block' : 'none' }}></span>
          🐾
          <div className="dock-tooltip">
            Anytime Buddy
            <span className="tooltip-sub">Your 24/7 companion</span>
          </div>
        </div>

        <div
          className={`dock-item voice ${activePanel === 'voice' ? 'active-item' : ''}`}
          onClick={() => openPanel('voice')}
          data-feature="voice"
        >
          🎙️
          <div className="dock-tooltip">
            Voice Check-in
            <span className="tooltip-sub">3-min voice assessment</span>
          </div>
        </div>

        <div
          className={`dock-item assess ${activePanel === 'assess' ? 'active-item' : ''}`}
          onClick={() => openPanel('assess')}
          data-feature="assess"
        >
          📝
          <div className="dock-tooltip">
            Quick Screen
            <span className="tooltip-sub">PHQ-9 · GAD-7 text quiz</span>
          </div>
        </div>

        <div className="dock-sep"></div>

        <div
          className={`dock-item meera ${activePanel === 'meera' ? 'active-item' : ''}`}
          onClick={() => openPanel('meera')}
          data-feature="meera"
        >
          👩‍⚕️
          <div className="dock-tooltip">
            Dr Meera
            <span className="tooltip-sub">AI doctor on call</span>
          </div>
        </div>

        <div
          className={`dock-item vent ${activePanel === 'vent' ? 'active-item' : ''}`}
          onClick={() => openPanel('vent')}
          data-feature="vent"
        >
          😤
          <div className="dock-tooltip">
            VentBuddy
            <span className="tooltip-sub">Need to vent? I'm here</span>
          </div>
        </div>

        <div className="dock-sep"></div>

        <div
          className={`dock-item garden ${activePanel === 'garden' ? 'active-item' : ''}`}
          onClick={() => openPanel('garden')}
          data-feature="garden"
        >
          🦋
          <div className="dock-tooltip">
            AR Garden
            <span className="tooltip-sub">Your calm space</span>
          </div>
        </div>

        <div
          className={`dock-item sound ${activePanel === 'sound' ? 'active-item' : ''}`}
          onClick={() => openPanel('sound')}
          data-feature="sound"
        >
          🎵
          <div className="dock-tooltip">
            Sound Therapy
            <span className="tooltip-sub">Healing sounds · 130 tracks</span>
          </div>
        </div>

        <div className="dock-toggle" onClick={toggleDock} title="Collapse dock">
          ◀
        </div>
      </div>

      {/* FEATURE PANELS */}

      {/* Anytime Buddy */}
      <div
        className={`feature-panel panel-buddy ${activePanel === 'buddy' ? 'active' : ''}`}
        style={activePanel === 'buddy' ? getPanelStyle('buddy') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">🐾</div>
          <div className="panel-name">Anytime Buddy</div>
          <div className="panel-tagline">Your personal mental wellness companion. Not therapy — just someone who listens, learns your patterns, and grows with you.</div>
        </div>
        <div className="panel-features">
          <span className="chip">24/7 available</span>
          <span className="chip">Mood check-ins</span>
          <span className="chip">CBT exercises</span>
          <span className="chip">Crisis support</span>
          <span className="chip">Grows with you</span>
          <span className="chip">5 personalities</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('buddy')}>Start Chatting with Buddy 🐾</button>
          <span className="free-tag">Free with premium · Always private</span>
        </div>
      </div>

      {/* Voice Assessment */}
      <div
        className={`feature-panel panel-voice ${activePanel === 'voice' ? 'active' : ''}`}
        style={activePanel === 'voice' ? getPanelStyle('voice') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">🎙️</div>
          <div className="panel-name">Voice Check-in</div>
          <div className="panel-tagline">Answer 9 quick questions with your voice. Clinical PHQ-9 depression screening — no typing needed. Takes 3 minutes.</div>
        </div>
        <div className="panel-features">
          <span className="chip">Voice-only</span>
          <span className="chip">PHQ-9 clinical</span>
          <span className="chip">3 minutes</span>
          <span className="chip">5 languages</span>
          <span className="chip">Track progress</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('voice')}>Start Voice Assessment 🎙️</button>
          <span className="free-tag">Free · Works on any phone</span>
        </div>
      </div>

      {/* Text Assessment */}
      <div
        className={`feature-panel panel-assess ${activePanel === 'assess' ? 'active' : ''}`}
        style={activePanel === 'assess' ? getPanelStyle('assess') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">📝</div>
          <div className="panel-name">Quick Screen</div>
          <div className="panel-tagline">Not sure what you need? Take a 5-minute text-based assessment. Get your depression and anxiety scores instantly.</div>
        </div>
        <div className="panel-features">
          <span className="chip">PHQ-9 depression</span>
          <span className="chip">GAD-7 anxiety</span>
          <span className="chip">5 minutes</span>
          <span className="chip">Instant results</span>
          <span className="chip">Therapist match</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('assess')}>Take Assessment 📝</button>
          <span className="free-tag">Free · Completely confidential</span>
        </div>
      </div>

      {/* Dr Meera */}
      <div
        className={`feature-panel panel-meera ${activePanel === 'meera' ? 'active' : ''}`}
        style={activePanel === 'meera' ? getPanelStyle('meera') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">👩‍⚕️</div>
          <div className="panel-name">Dr Meera</div>
          <div className="panel-tagline">Your AI mental health doctor. Ask questions, get guidance, understand your symptoms — in your language. Available 24/7.</div>
        </div>
        <div className="panel-features">
          <span className="chip">AI-powered</span>
          <span className="chip">Hindi · Kannada · Tamil</span>
          <span className="chip">Voice or text</span>
          <span className="chip">Medication info</span>
          <span className="chip">Symptom checker</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('meera')}>Talk to Dr Meera 👩‍⚕️</button>
          <span className="free-tag">Premium feature · First chat free</span>
        </div>
      </div>

      {/* VentBuddy */}
      <div
        className={`feature-panel panel-vent ${activePanel === 'vent' ? 'active' : ''}`}
        style={activePanel === 'vent' ? getPanelStyle('vent') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">😤</div>
          <div className="panel-name">VentBuddy</div>
          <div className="panel-tagline">Angry? Frustrated? SCREAM at me. I can take it. Let it all out — I'll absorb your rage and help you process it.</div>
        </div>
        <div className="panel-features">
          <span className="chip">Rage-safe space</span>
          <span className="chip">Voice vent mode</span>
          <span className="chip">Emotion detection</span>
          <span className="chip">Intensity matching</span>
          <span className="chip">Cool-down path</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('vent')}>Let It Out 😤🔥</button>
          <span className="free-tag">Free · Your words stay private</span>
        </div>
      </div>

      {/* AR Garden */}
      <div
        className={`feature-panel panel-garden ${activePanel === 'garden' ? 'active' : ''}`}
        style={activePanel === 'garden' ? getPanelStyle('garden') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">🦋</div>
          <div className="panel-name">AR Butterfly Garden</div>
          <div className="panel-tagline">Watch your progress come alive. Every therapy session, every CBT exercise adds a butterfly to your personal garden.</div>
        </div>
        <div className="panel-features">
          <span className="chip">Augmented reality</span>
          <span className="chip">Progress visualization</span>
          <span className="chip">14 butterflies earned</span>
          <span className="chip">Share with therapist</span>
          <span className="chip">Calming immersion</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('garden')}>Open Your Garden 🦋</button>
          <span className="free-tag">Premium · AR requires camera access</span>
        </div>
      </div>

      {/* Sound Therapy */}
      <div
        className={`feature-panel panel-sound ${activePanel === 'sound' ? 'active' : ''}`}
        style={activePanel === 'sound' ? getPanelStyle('sound') : {}}
      >
        <div className="panel-hero">
          <div className="panel-icon">🎵</div>
          <div className="panel-name">Sound Therapy</div>
          <div className="panel-tagline">130+ curated healing tracks. Singing bowls, nature sounds, binaural beats, Indian ragas — for sleep, focus, and calm.</div>
        </div>
        <div className="panel-features">
          <span className="chip">130+ tracks</span>
          <span className="chip">Sleep sounds</span>
          <span className="chip">Indian ragas</span>
          <span className="chip">Binaural beats</span>
          <span className="chip">Singing bowls</span>
          <span className="chip">Offline ready</span>
        </div>
        <div className="panel-cta">
          <button onClick={() => launchFeature('sound')}>Start Listening 🎵</button>
          <span className="free-tag">10 free tracks · Unlimited with premium</span>
        </div>
      </div>

    </div>
  );
};
