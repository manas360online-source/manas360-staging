import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const C = {
    teal: "#0C7C8A",
    tealDeep: "#064E5C",
    tealLight: "#E8F6F8",
    tealMist: "#F0FAFB",
    gold: "#C6930A",
    goldLight: "#FEF9EB",
    violet: "#7C3AED",
    violetLight: "#EDE9FE",
    violetDeep: "#5B21B6",
    rose: "#E11D48",
    roseLight: "#FFE4E6",
    green: "#059669",
    greenLight: "#D1FAE5",
    greenBg: "#ECFDF5",
    amber: "#D97706",
    amberLight: "#FEF3C7",
    sky: "#0284C7",
    skyLight: "#E0F2FE",
    pink: "#DB2777",
    pinkLight: "#FCE7F3",
    slate: "#1E293B",
    slate2: "#334155",
    slate3: "#475569",
    slate4: "#64748B",
    stone: "#94A3B8",
    stoneLight: "#CBD5E1",
    stoneLighter: "#E2E8F0",
    stoneBg: "#F8FAFC",
    white: "#FFF",
};

interface DigitalPetHubProps {
    onBack?: () => void;
}

export const DigitalPetHub: React.FC<DigitalPetHubProps> = ({ onBack }) => {
    const { i18n } = useTranslation();
    const [currentPet, setCurrentPet] = useState<{ name: string, emoji: string } | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [videoOverlayOpen, setVideoOverlayOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initializing' | 'verifying' | 'success'>('idle');

    const openPaymentModal = (name: string, emoji: string) => {
        setCurrentPet({ name, emoji });
        setPaymentModalOpen(true);
    };

    const closeModal = () => {
        setPaymentModalOpen(false);
        setPaymentStatus('idle');
    };

    const processPayment = () => {
        setPaymentStatus('initializing');
        setTimeout(() => {
            setPaymentStatus('verifying');
            setTimeout(() => {
                setPaymentStatus('success');
                setTimeout(() => {
                    closeModal();
                    let vUrl = '';
                    if (currentPet?.name === 'Guardian Dragon') {
                        vUrl = 'https://player.vimeo.com/video/1166597087';
                    } else if (['Golden Puppy', 'Wise Owl', 'Healing Elephant', 'Patience Turtle'].includes(currentPet?.name || '')) {
                        vUrl = 'https://player.vimeo.com/video/1166597659';
                    } else {
                        vUrl = 'https://player.vimeo.com/video/1058204128';
                    }
                    setVideoUrl(vUrl);
                    setVideoOverlayOpen(true);
                }, 1000);
            }, 1200);
        }, 800);
    };

    return (
        <div id="digital_pet_hub_root" style={{ fontFamily: "'Outfit', sans-serif", background: C.white, color: C.slate, lineHeight: 1.6 }}>
            <style>{`
        #digital_pet_hub_root h1, #digital_pet_hub_root h2, #digital_pet_hub_root h3, #digital_pet_hub_root h4 { font-family: 'Fraunces', serif !important; }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 15px rgba(124,58,237,.15); } 50% { box-shadow: 0 0 30px rgba(124,58,237,.25); } }
        #digital_pet_hub_root .btn-hover:hover { opacity: 0.9; transform: scale(1.02); }
        #digital_pet_hub_root .card-hover:hover { border-color: rgba(124,58,237,.3); box-shadow: 0 8px 30px rgba(124,58,237,.08); transform: translateY(-2px); }
      `}</style>

            {/* NAV */}
            <div style={{ padding: "12px 0", borderBottom: `1px solid ${C.stoneLighter}`, position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button
                                onClick={onBack}
                                style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${C.violet}`, background: "white", color: C.violet, fontWeight: 700, fontSize: 11, cursor: "pointer" }}
                            >
                                ← Back
                            </button>
                            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: C.tealDeep }}>
                                MANAS<em style={{ fontStyle: "normal", color: C.gold }}>360</em>
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: C.stone, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: C.slate3, fontWeight: 600 }}>Digital Pet Hub</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* HERO */}
            <div style={{ background: "linear-gradient(175deg,#F5F0FF 0%,#EDE9FE 40%,#FFF 100%)", padding: "48px 0 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
                        <div style={{ width: 280, height: 490, borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 40px rgba(124,58,237,.15)", border: "4px solid rgba(124,58,237,.2)", flexShrink: 0, background: "#000", position: "relative", animation: "glow 3s ease infinite" }}>
                            <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                                <source src="/DragonPitch-DigitalPet.mp4" type="video/mp4" />
                            </video>
                            <div style={{ position: "absolute", bottom: 15, left: 10, right: 10, textAlign: "center", background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "8px 12px", fontSize: 10, color: "white", fontWeight: 600, letterSpacing: ".5px", zIndex: 10 }}>
                                🎬 Avatar Pitch — "Your Digital Companion"
                            </div>
                        </div>

                        <div style={{ textAlign: "left", maxWidth: 480 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 16, fontSize: 10, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", background: C.violetLight, color: C.violet, marginBottom: 12 }}>
                                🐾 PT06 — Digital Pet Hub
                            </div>
                            <h1 style={{ fontSize: "clamp(32px,5vw,42px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 12, color: C.slate }}>
                                Your <span style={{ color: C.violet }}>Oxytocin</span> Engine — A Companion Who's Always Happy to See You
                            </h1>
                            <p style={{ fontSize: "14.5px", color: C.slate3, lineHeight: 1.65, marginBottom: 16 }}>
                                Science says your brain releases serotonin and oxytocin from connection — and it doesn't care if that connection has fur or pixels. It only cares if it's <em>felt</em>.
                            </p>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <button
                                    onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                                    style={{ padding: "10px 22px", borderRadius: 24, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: C.violet, color: "white" }}>
                                    🐾 Meet Your Pet
                                </button>
                                <button
                                    onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })}
                                    style={{ padding: "10px 22px", borderRadius: 24, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${C.violet}`, background: "white", color: C.violet }}>
                                    🧬 See the Science
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEUROCHEMISTRY SCIENCE */}
            <div id="science" style={{ background: C.white, padding: "32px 0", borderBottom: `1px solid ${C.stoneLighter}` }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 12, fontSize: 24 }}>🧬 The Neurochemistry Behind Digital Companionship</h2>
                    <p style={{ textAlign: "center", fontSize: "13.5px", color: C.slate3, maxWidth: 640, margin: "0 auto 28px", lineHeight: 1.6 }}>Every interaction with your digital pet triggers real brain chemistry. This isn't gaming — it's evidence-based emotional wellness.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        {[
                            { emoji: "💜", chem: "Oxytocin", desc: '"Love hormone" — released when your pet greets you, nuzzles, or responds to your care.', trigger: "Trigger: Pet greetings, nurturing" },
                            { emoji: "☀️", chem: "Serotonin", desc: '"Happy chemical" — boosted by daily routines, care rituals, and watching your pet thrive.', trigger: "Trigger: Daily check-ins, growth" },
                            { emoji: "⚡", chem: "Dopamine", desc: '"Reward chemical" — released when you unlock milestones, win mini-games, level up your pet.', trigger: "Trigger: Achievements, games" },
                            { emoji: "🧘", chem: "Endorphins", desc: '"Natural painkiller" — released during breathing exercises, meditation, and laughter with your pet.', trigger: "Trigger: Breathwork, play" },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: "center", padding: "18px 12px", borderRadius: 14, border: `1px solid ${C.stoneLighter}` }}>
                                <span style={{ fontSize: 32, marginBottom: 6, display: "block" }}>{s.emoji}</span>
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.violet, marginBottom: 2 }}>{s.chem}</div>
                                <div style={{ fontSize: "11.5px", color: C.slate4, lineHeight: 1.5 }}>{s.desc}</div>
                                <div style={{ fontSize: 10, fontWeight: 600, color: C.green, marginTop: 6, background: C.greenLight, display: "inline-block", padding: "2px 8px", borderRadius: 10 }}>{s.trigger}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DUAL ACCESS PATHWAYS */}
            <div style={{ padding: "32px 0", background: C.stoneBg }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 18, fontSize: 22 }}>🔀 Two Ways to Begin</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                        <div style={{ background: "white", borderRadius: 16, padding: 24, border: `1.5px solid ${C.stoneLighter}` }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 4 }}>Prescribed by Therapist / Psychiatrist</h3>
                            <p style={{ fontSize: "12.5px", color: C.slate4, lineHeight: 1.6, marginBottom: 10 }}>After a coaching session, your therapist prescribes a specific pet type based on your needs — loneliness, anxiety, habit building, or engagement therapy.</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {["Therapy Session", "→", "Rx: Digital Pet", "→", "Therapist picks species", "→", "Unlocked in your Hub"].map((step, i) => (
                                    <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 12, background: step === "→" ? "transparent" : C.violetLight, color: step === "→" ? C.stone : C.violet }}>{step}</span>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: "white", borderRadius: 16, padding: 24, border: `1.5px solid ${C.stoneLighter}` }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>🧭</div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 4 }}>Explore Independently</h3>
                            <p style={{ fontSize: "12.5px", color: C.slate4, lineHeight: 1.6, marginBottom: 10 }}>Browse the full pet catalog. Start free with an ambient companion, then upgrade to interactive or AI-powered pets as your journey deepens.</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {["PT06 Hub Landing", "→", "Watch Avatar Pitch", "→", "Choose Free Pet", "→", "Upgrade when ready"].map((step, i) => (
                                    <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 12, background: step === "→" ? "transparent" : C.violetLight, color: step === "→" ? C.stone : C.violet }}>{step}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PET CATALOG */}
            <div id="catalog" style={{ padding: "36px 0" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 24 }}>🐾 Pet Companion Catalog</h2>
                    <p style={{ textAlign: "center", fontSize: 13, color: C.slate4, maxWidth: 500, margin: "0 auto 24px" }}>Each species is designed for a specific therapeutic purpose.</p>

                    {/* TIER 1 */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Tier 1 — Ambient Companions</h2>
                            <span style={{ background: C.greenLight, color: C.green, padding: "4px 12px", borderRadius: 16, fontSize: 10, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase" }}>FREE</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                            {[
                                { name: "Koi Fish", emoji: "🐟", bg: "#DBEAFE", benefits: ["Anxiety", "Stress Relief"] },
                                { name: "Lotus Cat", emoji: "🐱", bg: "#D1FAE5", benefits: ["Grounding", "Mindfulness"] },
                                { name: "Cloud Sprite", emoji: "✨", bg: "#E0E7FF", benefits: ["Lightness"] },
                            ].map((p, i) => (
                                <div key={i} style={{ background: C.white, border: `1px solid ${C.stoneLighter}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                                    <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: p.bg }}>{p.emoji}</div>
                                    <div style={{ padding: "10px 14px 14px" }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 2 }}>{p.name}</div>
                                        {p.benefits.map((b, bi) => (
                                            <span key={bi} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, display: "inline-block", marginRight: 3, marginBottom: 3, background: C.skyLight, color: "#1D4ED8" }}>{b}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TIER 2 */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Tier 2 — Interactive Companions</h2>
                            <span style={{ background: C.violetLight, color: C.violet, padding: "4px 12px", borderRadius: 16, fontSize: 10, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase" }}>₹99/mo or ₹199 OWN</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                            {[
                                { name: "Golden Puppy", emoji: "🐕", bg: "#FEF3C7", benefit: "Joy" },
                                { name: "Wise Owl", emoji: "🦉", bg: "#E0F2FE", benefit: "Cognitive" },
                                { name: "Healing Elephant", emoji: "🐘", bg: "#D1FAE5", benefit: "Strength" },
                                { name: "Patience Turtle", emoji: "🐢", bg: "#FED7AA", benefit: "Patience" },
                            ].map((p, i) => (
                                <div key={i} onClick={() => openPaymentModal(p.name, p.emoji)} style={{ background: C.white, border: `1px solid ${C.stoneLighter}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                                    <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: p.bg }}>{p.emoji}</div>
                                    <div style={{ padding: "10px 14px 14px" }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 2 }}>{p.name}</div>
                                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, display: "inline-block", marginRight: 3, marginBottom: 3, background: C.violetLight, color: C.violet }}>{p.benefit}</span>
                                    </div>
                                    <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: C.violetLight, color: C.violet }}>₹99/mo</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TIER 3 */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Tier 3 — AI Companions</h2>
                            <span style={{ background: C.goldLight, color: C.gold, padding: "4px 12px", borderRadius: 16, fontSize: 10, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase" }}>₹299/mo</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                            {[
                                { name: "Phoenix Friend", emoji: "🦋", bg: "#FCE7F3", benefit: "Transformation" },
                                { name: "Guardian Dragon", emoji: "🐉", bg: "#EDE9FE", benefit: "Voice Chat" },
                                { name: "Wisdom Peacock", emoji: "🦚", bg: C.goldLight, benefit: "Vedic Wisdom" },
                            ].map((p, i) => (
                                <div key={i} onClick={() => openPaymentModal(p.name, p.emoji)} style={{ background: C.white, border: `1px solid ${C.violet}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                                    <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: p.bg }}>{p.emoji}</div>
                                    <div style={{ padding: "10px 14px 14px" }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 2 }}>{p.name}</div>
                                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, display: "inline-block", marginRight: 3, marginBottom: 3, background: C.violetLight, color: C.violet }}>{p.benefit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PRICING ARCHITECTURE */}
            <div id="pricing" style={{ padding: "36px 0", background: C.stoneBg }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 24 }}>💰 Pricing Architecture — Hybrid Model</h2>
                    <p style={{ textAlign: "center", fontSize: 13, color: C.slate4, maxWidth: 560, margin: "0 auto 22px" }}>Same proven model as Sound Therapy. Low barrier entry → à la carte exploration → subscription conversion.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
                        {/* STARTER */}
                        <div style={{ background: "white", borderRadius: 16, padding: 24, border: `1.5px solid ${C.stoneLighter}`, position: "relative" }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>🌱</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Starter</h3>
                            <div style={{ fontSize: 28, fontWeight: 800, color: C.violet, marginBottom: 2 }}>₹0 <span style={{ fontSize: 14, fontWeight: 400, color: C.slate3 }}>/forever</span></div>
                            <div style={{ fontSize: 11, color: C.stone, marginBottom: 12 }}>Try before you commit</div>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {["1 ambient pet", "2 environments", "View-only mode", "Basic mood check-in", "3 breathing exercises", "Therapist Rx pets always unlocked"].map((li, i) => (
                                    <li key={i} style={{ fontSize: 12, color: C.slate3, padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>• {li}</li>
                                ))}
                            </ul>
                            <button style={{ marginTop: 14, width: "100%", padding: 10, borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${C.violet}`, background: "white", color: C.violet }}>Get Started — Free</button>
                        </div>

                        {/* PER PET */}
                        <div style={{ background: "white", borderRadius: 16, padding: 24, border: `1.5px solid ${C.violet}`, position: "relative", boxShadow: "0 8px 28px rgba(124,58,237,.12)" }}>
                            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: C.violet, color: "white", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "3px 12px", borderRadius: 10 }}>BEST VALUE</div>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>🐾</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Per Pet</h3>
                            <div style={{ fontSize: 28, fontWeight: 800, color: C.violet, marginBottom: 2 }}>₹99-299 <span style={{ fontSize: 14, fontWeight: 400, color: C.slate3 }}>/mo</span></div>
                            <div style={{ fontSize: 11, color: C.stone, marginBottom: 12 }}>Or ₹199-499 own forever</div>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {["Any Tier 2 or 3 pet", "Full interactions + games", "Dedicated environment", "AR mode", "Progress tracking", "Therapist integration", "Offline mode for owned"].map((li, i) => (
                                    <li key={i} style={{ fontSize: 12, color: C.slate3, padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>• {li}</li>
                                ))}
                            </ul>
                            <button style={{ marginTop: 14, width: "100%", padding: 10, borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: C.violet, color: "white" }}>Choose Your Pet →</button>
                        </div>

                        {/* PET PARADISE */}
                        <div style={{ background: "white", borderRadius: 16, padding: 24, border: `1.5px solid ${C.stoneLighter}`, position: "relative" }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>👑</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Pet Paradise</h3>
                            <div style={{ fontSize: 28, fontWeight: 800, color: C.violet, marginBottom: 2 }}>₹299 <span style={{ fontSize: 14, fontWeight: 400, color: C.slate3 }}>/month</span></div>
                            <div style={{ fontSize: 11, color: C.stone, marginBottom: 12 }}>All 10 pets + all features</div>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {["All 10 pets unlocked", "All environments", "AI voice conversation", "Unlimited mini-games", "Evolves with you", "Family sharing", "Priority access", "Connects to MANAS360 Premium"].map((li, i) => (
                                    <li key={i} style={{ fontSize: 12, color: C.slate3, padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>• {li}</li>
                                ))}
                            </ul>
                            <button style={{ marginTop: 14, width: "100%", padding: 10, borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: C.violet, color: "white" }}>Upgrade to Paradise</button>
                        </div>
                    </div>

                    {/* Smart Upsell Logic */}
                    <div style={{ background: "white", border: `1px solid ${C.stoneLighter}`, borderRadius: 14, padding: 20 }}>
                        <h3 style={{ fontSize: 15, marginBottom: 10 }}>🧠 Smart Upsell Logic (Behavioral Economics)</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                            <div style={{ padding: 12, background: C.greenBg, borderRadius: 10 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 4 }}>Week 1-2: Anchoring</div>
                                <div style={{ fontSize: 11, color: C.slate3, lineHeight: 1.5 }}>Free pet creates attachment. User spends 5-10 min/day. Push notification: "Your Koi Fish missed you today! 🐟" → engagement starts.</div>
                            </div>
                            <div style={{ padding: 12, background: C.amberLight, borderRadius: 10 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, marginBottom: 4 }}>Week 3-4: Endowment Effect</div>
                                <div style={{ fontSize: 11, color: C.slate3, lineHeight: 1.5 }}>User's free pet "introduces" a Tier 2 friend. "Hey! My friend Golden Puppy wants to play! 🐕" → 72-hour trial → loss aversion kicks in.</div>
                            </div>
                            <div style={{ padding: 12, background: C.violetLight, borderRadius: 10 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.violet, marginBottom: 4 }}>Month 2: Decoy + Conversion</div>
                                <div style={{ fontSize: 11, color: C.slate3, lineHeight: 1.5 }}>If user bought 2+ pets (₹198+) → show: "Unlock ALL 10 pets for ₹299." Decoy makes Paradise look like a steal.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OXYTOCIN SCHEDULE */}
            <div style={{ padding: "36px 0" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 22 }}>⏰ A Day With Your Digital Pet — The Oxytocin Schedule</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 700, margin: "0 auto" }}>
                        {[
                            { time: "7:00 AM", emoji: "☀️", h: "Morning Greeting", p: "Pet wakes up with you. Happy animation + \"Good morning! How did you sleep?\" Mood check-in.", chem: "💜 Oxytocin + ☀️ Serotonin" },
                            { time: "7:15 AM", emoji: "📱", h: "Breathing Exercise Together", p: "Pet breathes with you. 4-7-8 breathing animation. Pet's belly rises and falls in sync.", chem: "🧘 Endorphins + 💜 Oxytocin" },
                            { time: "12:30 PM", emoji: "🐾", h: "Midday Check-in", p: "Push notification: \"Your puppy misses you! 🐕\" Open app → pet does happy dance → micro-game.", chem: "⚡ Dopamine + ☀️ Serotonin" },
                            { time: "5:00 PM", emoji: "🎮", h: "Mini-Game Session", p: "5-minute therapeutic game. Cognitive challenges (Owl), fetch (Puppy), or meditation (Cat).", chem: "⚡ Dopamine + 🧘 Endorphins" },
                            { time: "9:30 PM", emoji: "🌙", h: "Bedtime Wind-Down", p: "Pet yawns, curls up. Guided gratitude: \"What made you smile today?\" Pet falls asleep with you.", chem: "💜 Oxytocin + ☀️ Serotonin + 🧘 Endorphins" },
                            { time: "Weekly", emoji: "📊", h: "Wellness Report → Therapist Dashboard", p: "Mood trends, engagement time, breathing frequency sent to therapist. Rx loop closed.", chem: "📋 Therapeutic Integration" },
                        ].map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px", background: "white", border: `1px solid ${C.stoneLighter}`, borderRadius: 14, position: "relative" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.violet, minWidth: 60, paddingTop: 2 }}>{s.time}</div>
                                <div style={{ fontSize: 24, flexShrink: 0 }}>{s.emoji}</div>
                                <div>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 2 }}>{s.h}</h4>
                                    <p style={{ fontSize: "11.5px", color: C.slate4, lineHeight: 1.5 }}>{s.p}</p>
                                    <span style={{ fontSize: 10, fontWeight: 600, color: C.green, background: C.greenLight, padding: "2px 8px", borderRadius: 8, display: "inline-block", marginTop: 4 }}>{s.chem}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ENGAGEMENT LOOPS */}
            <div style={{ padding: "36px 0", background: "white" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 18, fontSize: 22 }}>🔄 Retention Loops — Why They Keep Coming Back</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                        {[
                            { h: "Pet Growth = User Growth", p: "Your pet visually evolves as YOU complete wellness activities. Skip a week? Pet looks sad. Consistent care? Pet glows.", m: "Retention driver: +35% DAU" },
                            { h: "Achievement System", p: "\"7-Day Streak\", \"First Breathing Exercise\". Each badge releases dopamine. Shareable to social media.", m: "Virality driver: 12% share rate" },
                            { h: "Social Pet Playdates", p: "Premium feature: Let your pet visit a friend's pet. Shared environments, cooperative mini-games.", m: "Network effect: +22% referrals" },
                            { h: "Seasonal + Festival Events", p: "Diwali: Pet gets rangoli decorations. Christmas: Snow environment. Limited-time content creates urgency.", m: "Re-engagement: 40% returns" },
                        ].map((l, i) => (
                            <div key={i} style={{ background: "white", border: `1px solid ${C.stoneLighter}`, borderRadius: 14, padding: 20 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.slate, marginBottom: 4 }}>{l.h}</h3>
                                <p style={{ fontSize: 12, color: C.slate4, lineHeight: 1.6 }}>{l.p}</p>
                                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: C.violet, background: C.violetLight, display: "inline-block", padding: "3px 10px", borderRadius: 10 }}>{l.m}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* REVENUE PROJECTIONS */}
            <div style={{ padding: "36px 0", background: C.stoneBg }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 18, fontSize: 22 }}>📊 Revenue Projection — Year 1</h2>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.stoneLighter}`, background: "white" }}>
                            <thead>
                                <tr style={{ background: C.violetLight }}>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", color: C.violet }}>Segment</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", color: C.violet }}>Users (Mo 12)</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", color: C.violet }}>ARPU</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", color: C.violet }}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { s: "Free Tier", u: "25,000", a: "₹0", r: "₹0 (funnel)" },
                                    { s: "À la carte", u: "4,500", a: "₹140/mo", r: "₹75.6 Lakh" },
                                    { s: "Pet Paradise", u: "2,200", a: "₹299/mo", r: "₹78.9 Lakh" },
                                    { s: "Rx-Prescribed", u: "1,800", a: "₹150/mo", r: "₹32.4 Lakh" },
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderTop: `1px solid ${C.stoneLighter}` }}>
                                        <td style={{ padding: "10px 14px", fontSize: "12.5px" }}>{row.s}</td>
                                        <td style={{ padding: "10px 14px", fontSize: "12.5px" }}>{row.u}</td>
                                        <td style={{ padding: "10px 14px", fontSize: "12.5px" }}>{row.a}</td>
                                        <td style={{ padding: "10px 14px", fontSize: "12.5px" }}>{row.r}</td>
                                    </tr>
                                ))}
                                <tr style={{ background: C.violetLight, fontWeight: 700, color: C.violet }}>
                                    <td colSpan={3} style={{ padding: "10px 14px" }}>TOTAL YEAR 1 EXPECTATION</td>
                                    <td style={{ padding: "10px 14px" }}>₹1.95 Crore</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div style={{ padding: "48px 0 24px", borderTop: `1px solid ${C.stoneLighter}`, textAlign: "center" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
                    <p style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: C.tealDeep, marginBottom: 8 }}>MANAS<em style={{ fontStyle: "normal", color: C.gold }}>360</em></p>
                    <p style={{ fontSize: 12, color: C.stone }}>Digital Pet Hub — Strategy & Product Architecture</p>
                    <p style={{ fontSize: 11, color: C.stone, marginTop: 12, fontStyle: "italic", maxWidth: 400, margin: "12px auto 0" }}>"Your brain doesn't care if connection has fur or pixels. It only cares if it's <em>felt</em>."</p>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {paymentModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
                    <div style={{ background: "white", width: "90%", maxWidth: 800, height: 500, borderRadius: 24, display: "flex", overflow: "hidden" }}>
                        <div style={{ flex: 1.2, background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: 120 }}>{currentPet?.emoji}</div>
                        </div>
                        <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ textAlign: "center", marginBottom: 20 }}>
                                <h2 style={{ fontSize: 24, color: C.slate }}>{currentPet?.name}</h2>
                                <p style={{ fontSize: 12, color: C.stone }}>Unlock Tier 2 Interactions</p>
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: C.violet, marginBottom: 16, textAlign: "center" }}>₹99</div>

                            <div style={{ marginBottom: 20 }}>
                                {['UPI Payment', 'Credit / Debit Card', 'Netbanking'].map((method, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: `1.5px solid ${C.stoneLighter}`, borderRadius: 12, marginBottom: 10, cursor: "pointer" }}>
                                        <div style={{ fontSize: 20 }}>{i === 0 ? '📱' : i === 1 ? '💳' : '🏦'}</div>
                                        <div className="pay-info">
                                            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{method}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={processPayment}
                                disabled={paymentStatus !== 'idle'}
                                style={{ height: 48, fontSize: 15, width: "100%", borderRadius: 24, border: "none", background: paymentStatus === 'success' ? C.green : C.violet, color: "white", fontWeight: 700, cursor: "pointer" }}
                            >
                                {paymentStatus === 'idle' ? 'Pay and Unlock ✨' :
                                    paymentStatus === 'initializing' ? 'Initializing...' :
                                        paymentStatus === 'verifying' ? 'Verifying...' : 'Success! ✨'}
                            </button>
                            <button
                                onClick={closeModal}
                                style={{ marginTop: 14, background: "none", border: "none", color: C.stone, cursor: "pointer", fontSize: 12 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIDEO OVERLAY */}
            {videoOverlayOpen && (
                <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div
                        onClick={() => setVideoOverlayOpen(false)}
                        style={{ position: "absolute", top: 30, right: 30, background: "white", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, cursor: "pointer", zIndex: 2001 }}
                    >
                        ✕
                    </div>
                    <iframe
                        src={`${videoUrl}?autoplay=1`}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        allow="autoplay; fullscreen; picture-in-picture"
                    ></iframe>
                </div>
            )}
        </div>
    );
};
