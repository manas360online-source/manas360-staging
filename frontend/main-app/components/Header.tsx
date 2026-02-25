import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// ─── DESIGN SYSTEM ───
const C = {
  ocean: "#0C7C8A",
  oceanDeep: "#064E5C",
  oceanLight: "#E0F4F7",
  sky: "#2196F3",
  gold: "#D4A017",
  goldLight: "#FDF6E3",
  dark: "#1A2332",
  darkSoft: "#2D3748",
  white: "#FFFFFF",
  gray: "#718096",
  grayLight: "#EDF2F7",
  grayBg: "#F7FAFC",
  rose: "#E53E6B",
  green: "#38A169",
  purple: "#7C3AED",
  orange: "#DD6B20",
  teal: "#0D9488",
};

const SUPPORT_NUMBER = "+08069409284";
const SUPPORT_TEL = `tel:${SUPPORT_NUMBER}`;

// ─── INTENT LANES ───
const INTENT_LANES = [
  {
    id: "seeking_help",
    label: "I Need Support",
    icon: "💚",
    color: C.green,
    tagline: "Start your healing journey",
    items: [
      { id: "checkin", label: "Quick Check-In", desc: "60-sec mood assessment", icon: "🩺", badge: "Free", href: "assessment" },
      { id: "therapist", label: "Find a Therapist", desc: "Psychologists & counselors", icon: "🧠", href: "subscribe/patients" },
      { id: "psychiatrist", label: "See a Psychiatrist", desc: "Medication & diagnosis", icon: "⚕️", href: "subscribe/patients" },
      { id: "specialist", label: "Specialized Care", desc: "OCD, PTSD, addiction, child", icon: "🎯", href: "subscribe/patients" },
      { id: "group", label: "Group Sessions", desc: "Peer support from ₹99", icon: "👥", badge: "₹99", href: "group-sessions" },
      { id: "crisis", label: "Crisis Support", desc: "Immediate 24/7 help", icon: "🆘", color: C.rose, href: "crisis" },
    ],
  },
  {
    id: "ai_tools",
    label: "AI & Self-Help",
    icon: "🤖",
    color: C.purple,
    tagline: "24/7 digital support tools",
    items: [
      { id: "ar_themed_room", label: "AI | AR | Themed Room", desc: "Immersive visual sanctuary", icon: "🌈", href: "ar-themed-room", badge: "New" },
      { id: "dr_meera", label: "Dr. Meera AI", desc: "AR therapy guide", icon: "👩\u200d⚕️", badge: "AI", href: "meera-chat" },
      { id: "anytime_buddy", label: "Anytime Buddy", desc: "Chat companion, any hour", icon: "🫂", href: "home" },
      { id: "vent_buddy", label: "Vent Buddy", desc: "Safe space to express", icon: "💭", href: "home" },
      { id: "ivr", label: "Call & Talk", desc: "Voice IVR in 7 languages", icon: "📞", href: SUPPORT_TEL },
      { id: "sound", label: "Sound Therapy", desc: "Sleep, calm, focus", icon: "🎵", href: "sound-therapy" },
      { id: "mood", label: "Mood Tracker", desc: "Daily wellness log", icon: "📊", href: "streaks" },
      { id: "digital_pet", label: "Digital Pet", desc: "Adopt a virtual companion", icon: "🐾", href: "digital-pet" },
    ],
  },
  {
    id: "relationships",
    label: "For Relationships",
    icon: "❤️",
    color: C.rose,
    tagline: "Couples, parents & families",
    items: [
      { id: "couples", label: "Find a Spark — Couples", desc: "Reignite your connection", icon: "💑", href: "subscribe/patients" },
      { id: "parent", label: "Concerned Parent", desc: "Help for your child", icon: "👨\u200d👧", href: "subscribe/patients" },
      { id: "family_plan", label: "Family Plan", desc: "Care for 2-5 members", icon: "👨\u200d👩\u200d👧\u200d👦", badge: "₹499+", href: "subscribe/patients" },
      { id: "teen", label: "Teen & Student", desc: "Age-appropriate support", icon: "🎓", badge: "50% off", href: "subscribe/patients" },
    ],
  },
  {
    id: "professional",
    label: "For Professionals",
    icon: "🏢",
    color: C.sky,
    tagline: "Organizations & partners",
    items: [
      { id: "corporate", label: "Corporate Wellness", desc: "Employee mental health", icon: "🏢", href: "corporate-wellness" },
      { id: "education", label: "Education Partner", desc: "School & college programs", icon: "🏫", href: "school-wellness" },
      { id: "healthcare", label: "Healthcare Partner", desc: "Hospital & clinic integration", icon: "🏥", href: "subscribe/corporate" },
      { id: "insurance", label: "Insurance Partner", desc: "Claims & coverage", icon: "🛡️", href: "subscribe/corporate" },
      { id: "govt", label: "Government Agency", desc: "Tele-MANAS & ASHA", icon: "🏛️", href: "subscribe/corporate" },
    ],
  },
  {
    id: "grow",
    label: "Learn & Grow",
    icon: "🌱",
    color: C.gold,
    tagline: "Certifications, training & shop",
    items: [
      { id: "certify", label: "Certification Hub", desc: "CBT, NLP, 5Whys training", icon: "🏆", badge: "Pro", href: "certification-platform" },
      { id: "join_therapist", label: "Join as Therapist", desc: "Earn ₹50K-2L/month", icon: "👨\u200d⚕️", href: "subscribe/therapists" },
      { id: "library", label: "Psychoeducation", desc: "Free articles & videos", icon: "📚", badge: "Free", href: "home" },
      { id: "retreats", label: "Wellness Retreats", desc: "Rishikesh, Coorg, Goa", icon: "🏔️", href: "home" },
      { id: "shop", label: "Wellness Shop", desc: "Journals, tools, merch", icon: "🛍️", href: "home" },
    ],
  },
];

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

const SEARCH_SUGGESTIONS = [
  "I feel anxious", "couples therapy", "psychiatrist near me",
  "CBT certification", "corporate wellness", "student discount",
  "can't sleep", "grief counseling", "child psychologist",
  "insurance coverage", "group session", "Hindi therapist",
];

// --- MEGA MENU PANEL ---
function MegaMenu({ lane, onClose, onItemClick }: { lane: any, onClose: () => void, onItemClick: (item: any) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: C.white,
        borderRadius: "0 0 16px 16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        padding: "20px 24px",
        zIndex: 200,
        animation: "slideDown 0.2s ease",
        borderTop: `3px solid ${lane.color}`,
      }}
      className="dark:bg-[#1A2332] dark:border-t-0 dark:border-b dark:border-slate-700"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{lane.icon}</span>
        <div>
          <div className="text-[#1A2332] dark:text-white" style={{ fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
            {lane.label}
          </div>
          <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
            {lane.tagline}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 8,
        }}
      >
        {lane.items.map((item: any) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick(item);
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: "transparent",
              border: "1px solid transparent",
            }}
            className="hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <span style={{ fontSize: 22, lineHeight: 1.2, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="text-[#1A2332] dark:text-white" style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      background: `${lane.color}18`,
                      color: lane.color,
                      padding: "1px 6px",
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, marginTop: 1 }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SMART SEARCH BAR ---
function SmartSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const filtered = query.length > 0
    ? SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_SUGGESTIONS.slice(0, 6);

  const allItems = INTENT_LANES.flatMap((l) => l.items.map((i) => ({ ...i, lane: l })));
  const matchedItems = query.length > 1
    ? allItems.filter(
      (i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.desc.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  const handleNavigate = (view: string) => {
    window.location.hash = `#/${i18n.language}/${view}`;
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        justifyContent: "center",
        paddingTop: 80,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
      className="backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: 16,
          width: "90%",
          maxWidth: 600,
          maxHeight: "70vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          animation: "slideDown 0.2s ease",
        }}
        className="bg-white dark:bg-[#1A2332]"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${C.grayLight}` }} className="dark:border-slate-700">
          <span style={{ fontSize: 18, color: C.gray }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for? Try 'couples therapy'..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              background: "transparent",
            }}
            className="text-[#1A2332] dark:text-white placeholder:text-slate-400"
          />
          <span
            onClick={onClose}
            style={{ fontSize: 12, color: C.gray, cursor: "pointer", padding: "2px 8px", background: C.grayLight, borderRadius: 6, fontFamily: "'DM Sans', sans-serif" }}
            className="dark:bg-slate-700 dark:text-slate-300"
          >
            ESC
          </span>
        </div>

        <div style={{ padding: "12px 18px", maxHeight: "55vh", overflowY: "auto" }}>
          {matchedItems.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
                Matching Services
              </div>
              {matchedItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleNavigate(item.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  className="hover:bg-[#F7FAFC] dark:hover:bg-slate-800"
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div className="text-[#1A2332] dark:text-white" style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                      {item.label}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
                      {item.desc} — {item.lane.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontSize: 10, fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
            {query ? "Suggestions" : "People often search for"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {filtered.map((s, i) => (
              <div
                key={i}
                onClick={() => setQuery(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                }}
                className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#E0F4F7] hover:border-[#0C7C8A] dark:hover:bg-slate-800"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- LOGIN DROPDOWN ---
function LoginDropdown({ isOpen, onClose, onLoginClick }: { isOpen: boolean, onClose: () => void, onLoginClick: (role?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  if (!isOpen) return null;

  const loginOptions = [
    { id: 'patient', label: "Patient Login", icon: "🧑", desc: "Individual account", color: C.green },
    {
      id: 'therapist',
      label: (
        <span className="block leading-tight">
          Psychiatrist | Psychologist<br />Therapist Login
        </span>
      ),
      icon: "👨\u200d⚕️",
      desc: "Provider portal",
      color: C.ocean
    },
    { id: 'corporate', label: "Corporate Login", icon: "🏢", desc: "SSO / admin portal", color: C.sky },
    { id: 'education', label: "Education Login", icon: "🏫", desc: "School / college admin", color: C.purple },
    { id: 'healthcare', label: "Healthcare Login", icon: "🏥", desc: "Clinic / hospital", color: C.teal },
    { id: 'insurance', label: "Insurance Login", icon: "🛡️", desc: "Partner portal", color: C.gold },
    { id: 'govt', label: "Government Login", icon: "🏛️", desc: "Tele-MANAS / ASHA", color: C.orange },
    { id: 'admin', label: "Admin Login", icon: "🔐", desc: "System administration", color: C.rose },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        borderRadius: 12,
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        padding: "8px",
        width: 280,
        zIndex: 150,
        animation: "slideDown 0.2s ease",
      }}
      className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-700"
    >
      {loginOptions.map((opt, i) => (
        <div
          key={i}
          onClick={() => { onLoginClick(opt.id); onClose(); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          className="hover:bg-[#F7FAFC] dark:hover:bg-slate-800"
        >
          <span style={{ fontSize: 18 }}>{opt.icon}</span>
          <div>
            <div className="text-[#1A2332] dark:text-white" style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
              {opt.label}
            </div>
            <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>
              {opt.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SUBSCRIPTION RIBBON ---
function SubRibbon({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
  if (!isVisible) return null;
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${C.oceanDeep}, ${C.ocean})`,
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "'DM Sans', sans-serif",
        animation: "slideDown 0.3s ease",
      }}
      className="relative z-[101]"
    >
      <span className="text-white text-[10px] md:text-xs">
        🎁 <strong>Free for World Mental Health Day</strong> — Premium access for 30 days, no card needed
      </span>
      <span
        onClick={() => window.location.hash = '#/subscribe'}
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.gold,
          background: `${C.gold}25`,
          padding: "2px 10px",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        CLAIM FREE →
      </span>
      <span onClick={onClose} style={{ color: `${C.white}80`, cursor: "pointer", fontSize: 14, marginLeft: 4 }}>×</span>
    </div>
  );
}

// --- TICKER DATA ---
const RAW_MESSAGES = [
  { icon: "🩺", text: "<strong>Psychiatrists</strong> — Setup your online clinic in <em>10 minutes</em>" },
  { icon: "🧠", text: "<strong>Psychologists</strong> — Your next 50 patients are waiting" },
  { icon: "💼", text: "Earn <strong>₹50K–2L/month</strong> with flexible hours" },
  { icon: "🎓", text: "Fresh graduates? Get <strong>mentored + certified + matched</strong> with patients" },
  { icon: "📞", text: "<strong>Zero investment</strong> — We handle tech, billing, scheduling" },
  { icon: "🌍", text: "Serve patients across <em>India & NRI markets</em> from your home" },
  { icon: "⚕️", text: "<strong>Therapists</strong> — Stop waiting for walk-ins. Get <em>matched daily</em>" },
  { icon: "🏆", text: "Get <strong>CBT/NLP certified</strong> free when you join" },
];

const getStripItems = () => {
  const items: any[] = [];
  const stats = [
    { num: '500+', label: 'therapists onboard' },
    { num: '₹2L+', label: 'top earner/month' },
    { num: '10 min', label: 'to setup clinic' },
    { num: '4.8★', label: 'therapist rating' },
  ];

  RAW_MESSAGES.forEach((msg, i) => {
    items.push({ type: 'msg', ...msg });
    if ((i + 1) % 4 === 0 && i < RAW_MESSAGES.length - 1) {
      items.push({ type: 'cta' });
    }
    if ((i + 1) % 6 === 0) {
      const stat = stats[Math.floor(i / 6) % stats.length];
      items.push({ type: 'stat', ...stat });
    }
  });
  return items;
};

const STRIP_DATA = getStripItems();

// --- MAIN HEADER COMPONENT ---
interface HeaderProps {
  onLoginClick?: (role?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { i18n } = useTranslation();
  const [activeLane, setActiveLane] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const handleItemClick = useCallback((item: any) => {
    if (!item.href) return;
    if (typeof item.href === 'string' && item.href.startsWith('tel:')) {
      window.location.href = item.href;
      return;
    }
    window.location.hash = `#/${i18n.language}/${item.href}`;
  }, [i18n.language]);

  const changeLanguage = (code: string) => {
    const currentHash = window.location.hash;
    const match = currentHash.match(/^#\/([a-z]{2})\/(.*)$/);
    if (match) {
      window.location.hash = `#/${code}/${match[2]}`;
    } else {
      window.location.hash = `#/${code}/landing`;
    }
  };

  const parseHtml = (html: string) => <span dangerouslySetInnerHTML={{ __html: html }} />;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 45s linear infinite; width: max-content; }
        .animate-marquee:hover { animation-play-state: paused; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .strip-text strong { color: #D4A017; font-weight: 700; }
        .strip-text em { color: #5CE0D2; font-style: normal; font-weight: 600; }
        .gentle-pulse { animation: gentlePulse 2s ease infinite; }
        @keyframes gentlePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .call-support-btn {
          background: linear-gradient(135deg, #0C7C8A, #0D9488);
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(12, 124, 138, 0.25);
        }
        .call-support-btn:hover {
          transform: translateY(-1px) scale(1.03);
        }
      `}</style>

      {/* TIER 0: Ribbon */}
      <SubRibbon isVisible={ribbonVisible} onClose={() => setRibbonVisible(false)} />

      {/* TIER 1: Brand Bar - Extended width for covering corners */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          width: "100%", // Explicitly span full width
        }}
        className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800"
      >
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 24px" }} className="xl:max-w-[1600px]">
          {/* Row 1 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            {/* Brand & Langs */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="cursor-pointer" onClick={() => window.location.hash = `#/${i18n.language}/landing`} style={{ fontSize: 24, fontWeight: 800, color: C.oceanDeep, fontFamily: "'DM Sans', sans-serif", letterSpacing: -0.5 }}>
                <span className="text-[#064E5C] dark:text-white">MANAS</span><span style={{ color: C.gold }}>360</span>
              </span>
              <div className="hidden md:flex gap-2 ml-4">
                {LANGUAGES.map((l) => (
                  <span
                    key={l.code}
                    onClick={() => changeLanguage(l.code)}
                    className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer transition-all border ${i18n.language === l.code ? 'bg-[#0C7C8A] text-white border-[#0C7C8A]' : 'bg-transparent text-slate-500 border-slate-200 hover:border-[#0C7C8A] dark:text-slate-400 dark:border-slate-700'}`}
                    style={{ fontWeight: i18n.language === l.code ? 700 : 500 }}
                  >
                    {l.native}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Search */}
              <div
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer min-w-[200px] hover:border-[#0C7C8A] transition-colors"
              >
                <span style={{ fontSize: 13, color: C.gray }}>🔍</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">Search or ask anything...</span>
                <span className="text-[9px] text-slate-400 bg-white dark:bg-slate-700 px-1 rounded ml-auto border border-slate-200 dark:border-slate-600">⌘K</span>
              </div>

              {/* Subscribe */}
              <div
                onClick={() => window.location.hash = `#/${i18n.language}/subscribe`}
                style={{
                  background: `linear-gradient(135deg, ${C.ocean}, ${C.oceanDeep})`,
                  padding: "7px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}
                className="text-white hover:scale-105 active:scale-95 shadow-sm"
              >
                Subscribe
              </div>

              {/* Login */}
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => onLoginClick?.()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-[#1A2332] dark:text-white hover:border-[#0C7C8A] transition-colors bg-white dark:bg-slate-800"
                >
                  Create | Login
                </div>
              </div>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <div className="select-none pointer-events-none text-xl leading-none">🧿</div>
            </div>
          </div>

          {/* Row 2: Intent Lanes Wrapper - Positioning Context for MegaMenu */}
          <div
            style={{ position: "relative" }}
            onMouseLeave={() => setActiveLane(null)}
          >
            {/* Scrollable Lanes Container - Removed position relative to avoid trapping absolute child */}
            <div
              ref={navRef}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                paddingBottom: 6,
              }}
              className="overflow-x-auto no-scrollbar"
            >
              {INTENT_LANES.map((lane) => {
                const isActive = activeLane === lane.id;
                return (
                  <div
                    key={lane.id}
                    onMouseEnter={() => setActiveLane(lane.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: isActive ? `${lane.color}10` : "transparent",
                      borderBottom: isActive ? `2px solid ${lane.color}` : "2px solid transparent",
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{lane.icon}</span>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? lane.color : undefined,
                      }}
                      className="text-slate-700 dark:text-slate-300"
                    >
                      {lane.label}
                    </span>
                  </div>
                );
              })}

              {/* Quick Access */}
              <div className="ml-auto hidden lg:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-full p-1 pl-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Access:</span>
                {[
                  { icon: "📞", label: "IVR", tip: "Call & Talk", href: SUPPORT_TEL },
                  { icon: "👩\u200d⚕️", label: "Dr. Meera", tip: "AI Therapy", href: "meera-chat" },
                  { icon: "🫂", label: "Buddy", tip: "24/7 Chat", href: "home" },
                ].map((q, i) => (
                  <div
                    key={i}
                    title={q.tip}
                    onClick={() => handleItemClick(q)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white dark:bg-slate-700 shadow-sm cursor-pointer text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform"
                  >
                    <span>{q.icon}</span> {q.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Mega Menu - Moved OUTSIDE overflow container, but inside relative wrapper */}
            {activeLane && (
              <MegaMenu
                lane={INTENT_LANES.find((l) => l.id === activeLane)}
                onClose={() => setActiveLane(null)}
                onItemClick={handleItemClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* TIER 3: Therapist Magnet Strip (Ticker) */}
      <div className="relative bg-[#1A2332] text-white overflow-hidden border-t border-white/10 z-40 h-[36px] flex items-center bg-gradient-to-r from-[#1A2332] via-[#0C3547] to-[#1A2332]">
        <div className="flex items-center flex-1 overflow-hidden relative h-full">
          <div className="flex items-center animate-marquee whitespace-nowrap h-full">
            {[0, 1].map((loopKey) => (
              <React.Fragment key={loopKey}>
                {STRIP_DATA.map((item, idx) => (
                  <React.Fragment key={`${loopKey}-${idx}`}>
                    {item.type === 'msg' && (
                      <div className="flex items-center gap-2 px-6 h-full border-r border-white/5 opacity-90 hover:opacity-100 transition-opacity cursor-pointer hover:bg-white/5">
                        <span className="text-sm">{item.icon}</span>
                        <span className="strip-text text-[11px] font-medium tracking-wide text-white/80 font-sans">
                          {parseHtml(item.text)}
                        </span>
                      </div>
                    )}
                    <span className="text-[#5CE0D2]/40 text-[10px] px-2">✦</span>
                    {item.type === 'cta' && (
                      <>
                        <div className="flex items-center gap-2 px-6 h-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5CE0D2] gentle-pulse"></span>
                          <button
                            className="text-[9px] font-bold text-[#1A2332] bg-[#D4A017] px-3 py-0.5 rounded-[12px] hover:bg-[#E8B82A] hover:scale-105 transition-all tracking-wide"
                            onClick={() => window.location.hash = `#/${i18n.language}/subscribe/therapists`}
                          >
                            JOIN NOW
                          </button>
                        </div>
                        <span className="text-[#5CE0D2]/40 text-[10px] px-2">✦</span>
                      </>
                    )}
                    {item.type === 'stat' && (
                      <>
                        <div className="flex items-center gap-2 px-5 h-full">
                          <span className="text-[11px] font-extrabold text-[#5CE0D2] font-sans">{item.num}</span>
                          <span className="text-[9px] text-white/50 font-sans uppercase tracking-wide">{item.label}</span>
                        </div>
                        <span className="text-[#5CE0D2]/40 text-[10px] px-2">✦</span>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Social Dock */}
        <div className="flex items-center gap-2 px-4 h-full relative z-50 bg-gradient-to-r from-transparent via-[#1A2332] to-[#1A2332]">
          <div className="w-px h-4 bg-white/10 mr-2 hidden md:block"></div>

          <a href="https://instagram.com/MANAS360India" target="_blank" className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#E1306C]/20 transition-all hover:-translate-y-0.5 group" title="Instagram">
            <svg className="w-3.5 h-3.5 fill-white/60 group-hover:fill-[#E1306C] transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>

          <a href="https://linkedin.com/company/manas360" target="_blank" className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#0A66C2]/20 transition-all hover:-translate-y-0.5 group" title="LinkedIn">
            <svg className="w-3.5 h-3.5 fill-white/60 group-hover:fill-[#0A66C2] transition-colors" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>

          <a href="https://youtube.com/@MANAS360" target="_blank" className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#FF0000]/20 transition-all hover:-translate-y-0.5 group" title="YouTube">
            <svg className="w-3.5 h-3.5 fill-white/60 group-hover:fill-[#FF0000] transition-colors" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
          </a>

          <a href="https://facebook.com/MANAS360" target="_blank" className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#1877F2]/20 transition-all hover:-translate-y-0.5 group" title="Facebook">
            <svg className="w-3.5 h-3.5 fill-white/60 group-hover:fill-[#1877F2] transition-colors" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>

          <a href="https://wa.me/919XXXXXXXXX" target="_blank" className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#25D366]/20 transition-all hover:-translate-y-0.5 group" title="WhatsApp">
            <svg className="w-3.5 h-3.5 fill-white/60 group-hover:fill-[#25D366] transition-colors" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          </a>

          <a href="https://x.com/MANAS360India" target="_blank" className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 transition-all hover:-translate-y-0.5 group" title="X (Twitter)">
            <svg className="w-3.5 h-3.5 fill-white/60 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
        </div>
      </div>

      <SmartSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};