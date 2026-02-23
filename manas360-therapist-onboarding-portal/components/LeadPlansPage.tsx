import React from 'react';
import {
    ArrowLeft,
    ChevronRight,
    Zap,
    History,
    FileText,
    ShieldCheck,
    IndianRupee,
    Flame,
    Smartphone,
    Layout,
    CheckCircle,
    Star,
    Lock,
    CreditCard,
    Users,
    Clock,
    User,
    Video,
    Mic,
    MoreHorizontal,
    Calendar,
    Settings
} from 'lucide-react';

interface LeadPlansPageProps {
    onNext: () => void;
    onPrev: () => void;
}

interface Lead {
    id: string;
    name: string;
    gender: string;
    age: number;
    status: 'HOT' | 'WARM' | 'COLD';
    timeLeft?: string;
    scores: {
        phq9: number;
        gad7: number;
    };
    severity: string;
    languages: string[];
    sessionType: 'Video' | 'Audio' | 'Chat';
    timePreference: string;
    fee: number;
    brief?: {
        concern: string;
        previousTherapy: string;
        medications: string;
        emergencyContact: string;
    };
}

const LeadPlansPage: React.FC<LeadPlansPageProps> = ({ onNext, onPrev }) => {
    const [view, setView] = React.useState<'selection' | 'payment-gateway' | 'success' | 'leads-selection' | 'confirm-session'>('selection');
    const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);
    const [acceptedLeads, setAcceptedLeads] = React.useState<string[]>([]);
    const [passedLeads, setPassedLeads] = React.useState<string[]>([]);
    const [calAdded, setCalAdded] = React.useState<string[]>([]);
    const [testActive, setTestActive] = React.useState(false);

    const plans = [
        {
            id: 'basic',
            title: 'Basic',
            price: 99,
            leads: '3 leads/wk',
            desc: 'Mix of Hot/Warm/Cold. Good for part-time providers starting out.',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            borderColor: 'border-orange-100',
            mobileColor: 'text-orange-600',
            mobileBg: 'bg-orange-50'
        },
        {
            id: 'standard',
            title: 'Standard',
            price: 199,
            leads: '6 leads/wk',
            desc: 'Higher proportion of Hot leads. Best value for growing practices.',
            icon: Zap,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            borderColor: 'border-amber-100',
            mobileColor: 'text-amber-600',
            mobileBg: 'bg-amber-50'
        },
        {
            id: 'premium',
            title: 'Premium',
            price: 299,
            leads: '7 leads/wk',
            desc: 'Priority Hot leads. Fastest match. Recommended for full-time providers.',
            icon: Star,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100',
            mobileColor: 'text-blue-600',
            mobileBg: 'bg-blue-50'
        }
    ];

    const leads: Lead[] = [
        {
            id: 'l1',
            name: 'Ravi K.',
            gender: 'Male',
            age: 28,
            status: 'HOT',
            timeLeft: '2h left',
            scores: { phq9: 16, gad7: 12 },
            severity: 'Moderate-Severe',
            languages: ['English', 'Kannada'],
            sessionType: 'Video',
            timePreference: 'Fri 6 PM',
            fee: 699,
            brief: {
                concern: 'Work anxiety, insomnia',
                previousTherapy: 'None',
                medications: 'None',
                emergencyContact: 'Provided ✓'
            }
        },
        {
            id: 'l2',
            name: 'Meera S.',
            gender: 'Female',
            age: 34,
            status: 'HOT',
            timeLeft: '1h left',
            scores: { phq9: 11, gad7: 9 },
            severity: 'Moderate',
            languages: ['Hindi'],
            sessionType: 'Audio',
            timePreference: 'Sat 10 AM',
            fee: 699,
            brief: {
                concern: 'Relationship stress',
                previousTherapy: '3 sessions in 2022',
                medications: 'None',
                emergencyContact: 'Provided ✓'
            }
        },
        {
            id: 'l3',
            name: 'Arjun P.',
            gender: 'Male',
            age: 22,
            status: 'WARM',
            scores: { phq9: 8, gad7: 0 },
            severity: 'Mild',
            languages: ['English'],
            sessionType: 'Video',
            timePreference: 'Flexible timing',
            fee: 0
        },
        {
            id: 'l4',
            name: 'Preethi L.',
            gender: 'Female',
            age: 41,
            status: 'COLD',
            scores: { phq9: 0, gad7: 0 },
            severity: 'Not yet assessed',
            languages: ['Tamil'],
            sessionType: 'Chat',
            timePreference: 'Browsing',
            fee: 0
        }
    ];

    const paymentMethods = [
        { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: Smartphone },
        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
        { id: 'netbanking', name: 'Netbanking', icon: Layout },
    ];

    const handleAction = () => {
        if (view === 'selection') {
            if (selectedPlan) setView('payment-gateway');
        } else if (view === 'payment-gateway') {
            if (paymentMethod) {
                setTimeout(() => setView('success'), 800);
            }
        } else if (view === 'success') {
            setView('leads-selection');
        } else if (view === 'leads-selection') {
            setView('confirm-session');
        } else if (view === 'confirm-session') {
            onNext();
        }
    };

    const handleBack = () => {
        if (view === 'selection') onPrev();
        else if (view === 'payment-gateway') setView('selection');
        else if (view === 'success') setView('payment-gateway');
        else if (view === 'leads-selection') setView('success');
        else if (view === 'confirm-session') setView('leads-selection');
    };

    const renderPlanSelection = () => (
        <div className="flex flex-col lg:flex-row gap-16 items-start animate-fadeUp">
            <div className="flex-1 space-y-10">
                <div>
                    <div className="flex items-center gap-2 text-[#E53E3E] font-bold text-xs mb-6 uppercase tracking-wider">
                        <span className="w-5 h-[2px] bg-[#E53E3E]"></span>
                        Leads · Step 6 of 18
                    </div>
                    <h1 className="text-5xl font-bold text-[#1A2332] font-serif mb-6">
                        Choose Lead Plan — Leads Per Week
                    </h1>
                    <p className="text-[#718096] text-lg leading-relaxed max-w-2xl font-medium">
                        Lead plans determine how many patient leads you receive weekly. Pricing varies by provider type.
                    </p>
                </div>

                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`bg-white p-6 rounded-2xl border-2 shadow-sm flex gap-6 items-center transition-all cursor-pointer group max-w-3xl
                                ${selectedPlan === plan.id ? 'border-[#0C7C8A] ring-4 ring-[#0C7C8A]/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className={`w-12 h-12 rounded-xl ${plan.bg} flex items-center justify-center shrink-0`}>
                                <plan.icon className={`w-6 h-6 ${plan.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="font-bold text-[#1A2332] text-lg">{plan.title}: ₹{plan.price}/m · {plan.leads}</h3>
                                </div>
                                <p className="text-[#718096] text-sm mt-0.5">{plan.desc}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                ${selectedPlan === plan.id ? 'border-[#0C7C8A] bg-[#0C7C8A]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                                {selectedPlan === plan.id && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                        </div>
                    ))}

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-center max-w-3xl">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                            <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#D69E2E]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#B794F4]"></div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[#1A2332] text-lg">Lead Types: Hot / Warm / Cold</h3>
                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#718096]">
                                    <div className="w-2 h-2 rounded-full bg-[#E53E3E]"></div> Hot: Paid, assessed, ready now.
                                </div>
                                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#718096]">
                                    <div className="w-2 h-2 rounded-full bg-[#D69E2E]"></div> Warm: Assessed, browsing.
                                </div>
                                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#718096]">
                                    <div className="w-2 h-2 rounded-full bg-[#B794F4]"></div> Cold: Signed up, not yet assessed.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f0ece2] p-5 rounded-2xl border border-[#e5e0d3] flex gap-4 items-start max-w-3xl">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#718096] leading-relaxed">
                        <span className="font-bold text-[#1A2332]">UX Note:</span> Show ROI calculator: "At 7 leads/week × 60% conversion × ₹699/session = ₹~21K/month after MANAS360 fee." Make the math obvious.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-6">
                    <button onClick={handleBack} className="flex items-center gap-2 px-10 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-[#718096] hover:bg-white transition-all shadow-sm">← Previous</button>
                    <button onClick={handleAction} disabled={!selectedPlan} className="bg-[#0C7C8A] text-white px-12 py-3.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">Next Step →</button>
                </div>
            </div>

            <div className="w-full lg:w-[400px] flex justify-center sticky top-8">
                <div className="relative w-[340px] h-[680px] bg-[#111] rounded-[3.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[10px] border-[#222]">
                    <div className="w-full h-full bg-[#fdfaf5] rounded-[2.8rem] overflow-hidden flex flex-col relative">
                        <div className="h-7 w-full flex justify-between items-center px-8 pt-2">
                            <span className="text-[11px] font-bold">9:41</span>
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div></div>
                        </div>
                        <div className="p-4 px-6 flex justify-between items-center">
                            <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"><ArrowLeft className="w-3 h-3" /> Choose Lead Plan</button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 pb-6 scrollbar-hide">
                            <div className="mb-4">
                                <div className="flex items-center gap-1.5 text-[#D946EF] font-bold uppercase text-[9px] mb-2 tracking-widest pl-1">
                                    <Smartphone className="w-3 h-3" /> Psychologist Lead Plans
                                </div>
                            </div>
                            <div className="space-y-4">
                                {plans.map((plan) => (
                                    <div key={plan.id} className={`p-5 rounded-2xl border-2 bg-white transition-all ${selectedPlan === plan.id ? 'border-[#0C7C8A]' : 'border-gray-50 shadow-sm'}`} onClick={() => setSelectedPlan(plan.id)}>
                                        <span className={`text-[8px] font-bold px-3 py-0.5 rounded-full uppercase tracking-tighter ${plan.mobileBg} ${plan.mobileColor}`}>{plan.id === 'standard' ? 'Popular' : plan.title}</span>
                                        <h4 className="text-[13px] font-bold text-[#1A2332] mt-2">{plan.leads}</h4>
                                        <div className={`text-[18px] font-black mt-1 ${plan.mobileColor}`}>₹{plan.price}/m <span className="text-gray-300 font-bold">· {plan.leads}</span></div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-[9px] text-gray-400 font-medium">Mix of</span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]"></div> Hot,
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D69E2E]"></div> Warm,
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#B794F4]"></div> Cold leads
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="bg-[#f0f9ff] p-4 rounded-xl border border-[#bae6fd] text-center">
                                    <p className="text-[9px] font-bold text-[#0369a1] uppercase flex items-center justify-center gap-1 tracking-tighter">
                                        <Flame className="w-2.5 h-2.5" /> Earning Potential (Premium)
                                    </p>
                                    <p className="text-[8px] text-[#0ea5e9] mt-1 font-medium italic">
                                        7 leads × 60% convert × ₹699 × 4 weeks = <br />
                                        <span className="font-bold">₹~11,800/mo</span> (your 60%)
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#111] rounded-b-[1.5rem] flex justify-center items-end pb-1.5"><div className="w-10 h-1 rounded-full bg-white/10"></div></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLeadsSelection = () => (
        <div className="flex flex-col lg:flex-row gap-16 items-start animate-fadeUp">
            {/* Left Side: Desktop Content */}
            <div className="flex-1 space-y-10">
                <div>
                    <div className="flex items-center gap-2 text-[#E53E3E] font-bold text-[10px] mb-6 uppercase tracking-[0.2em]">
                        📝 Leads · Step 7 of 18
                    </div>
                    <h1 className="text-5xl font-bold text-[#1A2332] font-serif mb-6 leading-tight">
                        Check & Select Leads — Hot / Warm / Cold
                    </h1>
                    <p className="text-[#4A5568] text-[17px] leading-relaxed max-w-2xl font-medium opacity-80">
                        Provider sees incoming leads categorized by temperature. Can accept or pass. Hot leads have highest conversion.
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        { title: 'Hot Lead', desc: 'Patient has: paid, completed assessment, selected time slot, ready to start. 80%+ conversion rate.', icon: 'bg-[#E53E3E]' },
                        { title: 'Warm Lead', desc: 'Patient has: completed assessment, browsing providers. May need a nudge. 40-60% conversion.', icon: 'bg-[#F6AD55]' },
                        { title: 'Cold Lead', desc: 'Patient has: signed up, not yet assessed. Needs nurturing via AI chatbot/content. 15-25% conversion.', icon: 'bg-[#B794F4]' },
                        { title: 'Response Window', desc: 'Hot leads: 2-hour response window. Warm: 24 hours. Cold: 48 hours. Unresponded leads go to next provider.', icon: 'bg-[#FFF5F5]', iconContent: '⏰' }
                    ].map((card, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-center max-w-3xl">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${card.iconContent ? card.icon : 'bg-white border border-gray-100'}`}>
                                {card.iconContent ? <span className="text-2xl">{card.iconContent}</span> : (
                                    <div className={`w-5 h-5 rounded-full ${card.icon} shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`}></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-[#1A2332] text-xl">{card.title}</h3>
                                <p className="text-[#718096] text-[15px] mt-0.5 leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-[#FBE9D0] flex gap-4 items-start max-w-3xl">
                    <span className="text-lg">💡</span>
                    <p className="text-[13px] text-[#718096] leading-relaxed">
                        <span className="font-bold text-[#1A2332]">UX Note:</span> Lead cards must show: assessment severity, preferred language, time preference, session type. Provider decides with full context.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-6">
                    <button onClick={handleBack} className="flex items-center gap-2 px-10 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-[#A0AEC0] hover:bg-white transition-all shadow-sm">← Previous</button>
                    <button onClick={() => setView('confirm-session')} className="bg-white border-2 border-[#0C7C8A] text-[#0C7C8A] px-10 py-3.5 rounded-xl font-bold hover:bg-[#0C7C8A]/5 transition-all shadow-sm flex items-center gap-2">My Leads</button>
                    <button onClick={handleAction} disabled={acceptedLeads.length === 0} className="bg-[#0C7C8A] text-white px-12 py-3.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50">Next Step →</button>
                </div>
            </div>

            {/* Right Side: Mobile Mockup */}
            <div className="w-full lg:w-[400px] flex justify-center sticky top-8">
                <div className="relative w-[320px] h-[660px] bg-[#111] rounded-[3.5xl] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[10px] border-[#222]">
                    <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col relative text-[#1A2332]">
                        <div className="h-7 w-full flex justify-between items-center px-8 pt-2">
                            <span className="text-[11px] font-bold">9:41</span>
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div></div>
                        </div>
                        <div className="px-5 pt-4 flex justify-between items-center">
                            <button className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A2332]"><ArrowLeft className="w-4 h-4" /> My Leads</button>
                            <span className="text-[10px] text-gray-400 font-bold">This Week: {6 + acceptedLeads.length}</span>
                        </div>
                        <div className="flex gap-2 px-5 py-3 border-b border-gray-50 flex-nowrap overflow-x-auto scrollbar-hide">
                            <button className="bg-[#FED7D7] text-[#E53E3E] text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]"></div> Hot (2)</button>
                            <button className="bg-[#FEF3C7] text-[#D69E2E] text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-[#D69E2E]"></div> Warm (3)</button>
                            <button className="bg-[#E9D8FD] text-[#805AD5] text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-[#805AD5]"></div> Cold (1)</button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide bg-[#FDFCF7]">
                            {leads.filter(l => !passedLeads.includes(l.id)).map(lead => (
                                <div key={lead.id} className={`p-4 rounded-2xl border transition-all shadow-sm relative overflow-hidden bg-white
                                    ${lead.status === 'HOT' ? 'border-[#E53E3E]' : lead.status === 'WARM' ? 'border-[#D69E2E]/20' : 'border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-2 pl-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${lead.status === 'HOT' ? 'bg-[#E53E3E]' : lead.status === 'WARM' ? 'bg-[#D69E2E]' : 'bg-[#A0AEC0]'}`}></div>
                                            <span className="text-[13px] font-bold">{lead.name} · {lead.gender}, {lead.age}</span>
                                        </div>
                                        {lead.status === 'HOT' && <span className="text-[8px] font-black text-[#E53E3E] bg-[#FFF5F5] px-2 py-0.5 rounded-full uppercase border border-[#FED7D7]">HOT · {lead.timeLeft}</span>}
                                        {lead.status === 'WARM' && <span className="text-[8px] font-black text-[#D69E2E] bg-[#FFFBEB] px-2 py-0.5 rounded-full uppercase border border-[#FEF3C7]">WARM</span>}
                                        {lead.status === 'COLD' && <span className="text-[8px] font-black text-[#718096] bg-[#F7FAFC] px-2 py-0.5 rounded-full uppercase border border-[#E2E8F0]">COLD</span>}
                                    </div>
                                    <div className="pl-4 space-y-1">
                                        <div className="text-[10px] text-gray-500 font-medium">PHQ-9: {lead.scores.phq9} ({lead.severity}) · GAD-7: {lead.scores.gad7}</div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium"><Users className="w-3 h-3 text-gray-300" /> {lead.languages.join(', ')} · {lead.sessionType === 'Video' ? <Video className="w-3 h-3 text-gray-300" /> : <Mic className="w-3 h-3 text-gray-300" />} {lead.sessionType} · {lead.timePreference}</div>
                                        {lead.fee > 0 && <div className="text-[10px] font-bold text-[#D69E2E] flex items-center gap-1 mt-1">🔥 Paid ₹{lead.fee}</div>}
                                    </div>
                                    {!acceptedLeads.includes(lead.id) && (
                                        <div className="flex gap-2 mt-4 pl-4">
                                            <button onClick={() => setAcceptedLeads([...acceptedLeads, lead.id])} className="flex-1 bg-[#008F5D] text-white py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm">Accept ✓</button>
                                            <button onClick={() => setPassedLeads([...passedLeads, lead.id])} className="flex-1 bg-white text-gray-500 py-2 rounded-xl text-[11px] font-bold border border-gray-100 hover:bg-gray-50 transition-colors">Pass →</button>
                                        </div>
                                    )}
                                    {acceptedLeads.includes(lead.id) && (
                                        <div className="mt-4 pl-4 bg-[#F0FFF4] text-[#38A169] py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-[#C6F6D5]">Accepted ✓</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Footer Button */}
                        <div className="px-4 py-4 border-t border-gray-50 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={() => setView('confirm-session')}
                                className="w-full bg-[#0C7C8A] text-white py-4 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
                            >
                                My Lead {acceptedLeads.length > 0 && `(${acceptedLeads.length})`} →
                            </button>
                        </div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#111] rounded-b-[1.5rem] flex justify-center items-end pb-1.5"><div className="w-10 h-1 rounded-full bg-white/10"></div></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderConfirmSession = () => (
        <div className="flex flex-col lg:flex-row gap-16 items-start animate-fadeUp">
            <div className="flex-1 space-y-10">
                <div>
                    <div className="flex items-center gap-2 text-[#38A169] bg-[#E6FFFA] w-fit px-3 py-1 rounded-md font-bold text-[10px] mb-6 uppercase tracking-wider border border-[#B2F5EA]">
                        <CheckCircle className="w-3 h-3" /> Confirm · Step 8 of 18
                    </div>
                    <h1 className="text-5xl font-bold text-[#1A2332] font-serif mb-6 leading-tight">
                        Confirm the Session — Accept Lead
                    </h1>
                    <p className="text-[#4A5568] text-[17px] leading-relaxed max-w-2xl font-medium opacity-80">
                        Provider accepts lead, confirms slot. Patient is notified. Calendar event created for both parties.
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        { title: 'Accept & Confirm', desc: 'Provider taps "Accept" → Patient receives push + SMS → Both get calendar invite with video link.', iconContent: '✅', iconColor: 'bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]' },
                        { title: 'Pre-Session Brief', desc: 'Provider receives: assessment scores, patient preferences, language, presenting concern summary.', iconContent: '📋', iconColor: 'bg-[#EBF4FF] text-[#3182CE] border-[#BEE3F8]' },
                        { title: 'Session Link Generated', desc: 'Agora/Whereby encrypted link created. Both parties can test audio/video 15 min before session.', iconContent: '🔗', iconColor: 'bg-[#FAF5FF] text-[#805AD5] border-[#E9D8FD]' }
                    ].map((card, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-center max-w-3xl">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${card.iconColor}`}>
                                <span className="text-2xl">{card.iconContent}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-[#1A2332] text-xl">{card.title}</h3>
                                <p className="text-[#718096] text-[15px] mt-0.5 leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#f7f8f9] p-5 rounded-2xl border border-gray-100 flex gap-4 items-start max-w-3xl">
                    <span className="text-lg">💡</span>
                    <p className="text-[13px] text-[#718096] leading-relaxed">
                        <span className="font-bold text-[#1A2332]">UX Note:</span> Confirmation must be instant. No delay between provider accept and patient notification. Real-time webhooks.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-6">
                    <button onClick={handleBack} className="flex items-center gap-2 px-10 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-[#718096] hover:bg-white transition-all shadow-sm">← Previous</button>
                    <button onClick={handleAction} className="bg-[#0C7C8A] text-white px-12 py-3.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">Next Step →</button>
                </div>
            </div>

            {/* Right Side: Mobile Mockup */}
            <div className="w-full lg:w-[400px] flex justify-center sticky top-8">
                <div className="relative w-[320px] h-[660px] bg-[#111] rounded-[3.5xl] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[10px] border-[#222]">
                    <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col relative text-[#1A2332]">
                        <div className="h-7 w-full flex justify-between items-center px-8 pt-2">
                            <span className="text-[11px] font-bold">9:41</span>
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div></div>
                        </div>
                        <div className="px-5 pt-4">
                            <button onClick={handleBack} className="flex items-center gap-1.5 text-[12px] font-bold text-[#1A2332]"><ArrowLeft className="w-4 h-4" /> Session Confirmed</button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide bg-[#FDFCF7]">
                            {leads.filter(l => acceptedLeads.includes(l.id)).map(lead => (
                                <div key={lead.id} className="space-y-4">
                                    <div className="bg-[#E6FFFA] border border-[#B2F5EA] p-6 rounded-[1.5rem] text-center space-y-2">
                                        <div className="w-10 h-10 bg-[#38A169] rounded-xl flex items-center justify-center mx-auto shadow-sm">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#2F855A] font-black text-lg leading-tight">Lead Accepted!</h4>
                                            <p className="text-[#38A169] text-xs font-bold opacity-80 mt-1">Patient has been notified</p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-100 p-5 rounded-[1.5rem] shadow-sm space-y-3">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <User className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <span className="font-bold text-[14px]">{lead.name} · {lead.gender}, {lead.age}</span>
                                        </div>
                                        <div className="space-y-2.5 pl-1">
                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-400">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Fri, 21 Feb · 6:00 PM
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-400">
                                                <Video className="w-3.5 h-3.5 text-indigo-400" /> Video Session · 45 min
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-400">
                                                <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> English + Kannada
                                            </div>
                                            <div className="text-[11px] font-bold text-gray-400 pt-1">
                                                PHQ-9: {lead.scores.phq9} · GAD-7: {lead.scores.gad7}
                                            </div>
                                        </div>
                                    </div>

                                    {lead.brief && (
                                        <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-5 rounded-[1.5rem] shadow-sm space-y-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-[#D69E2E]" />
                                                <span className="font-bold text-[13px] text-[#92400E]">Pre-Session Brief</span>
                                            </div>
                                            <div className="space-y-1.5 pl-1">
                                                <div className="text-[11px] text-[#92400E] font-medium leading-relaxed">
                                                    <span className="opacity-70">Presenting concern:</span> {lead.brief.concern}
                                                </div>
                                                <div className="text-[11px] text-[#92400E] font-medium">
                                                    <span className="opacity-70">Previous therapy:</span> {lead.brief.previousTherapy}
                                                </div>
                                                <div className="text-[11px] text-[#92400E] font-medium">
                                                    <span className="opacity-70">Medications:</span> {lead.brief.medications}
                                                </div>
                                                <div className="text-[11px] text-[#92400E] font-medium">
                                                    <span className="opacity-70">Emergency contact:</span> {lead.brief.emergencyContact}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-2">
                                        <button
                                            onClick={() => setCalAdded([...calAdded, lead.id])}
                                            className={`w-full py-3.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all border
                                                ${calAdded.includes(lead.id) ? 'bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]' : 'bg-white text-gray-700 border-gray-100 shadow-sm hover:shadow-md'}`}
                                        >
                                            <Calendar className={`w-3.5 h-3.5 ${calAdded.includes(lead.id) ? 'text-[#38A169]' : 'text-blue-500'}`} /> {calAdded.includes(lead.id) ? 'Added to Calendar ✓' : 'Add to Calendar'}
                                        </button>
                                        <button
                                            onClick={() => setTestActive(!testActive)}
                                            className={`w-full py-3.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all border
                                                ${testActive ? 'bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]' : 'bg-white text-gray-700 border-gray-100 shadow-sm hover:shadow-md'}`}
                                        >
                                            <Settings className={`w-3.5 h-3.5 ${testActive ? 'text-[#38A169]' : 'text-indigo-500'}`} /> {testActive ? 'Equipment Verified ✓' : 'Test Audio/Video'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#111] rounded-b-[1.5rem] flex justify-center items-end pb-1.5"><div className="w-10 h-1 rounded-full bg-white/10"></div></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPaymentGateway = () => (
        <div className="max-w-2xl mx-auto py-12 space-y-8 animate-fadeUp">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-12 space-y-10">
                <div className="flex justify-between items-center border-b border-gray-50 pb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[#1A2332]">Payment Gateway</h2>
                        <p className="text-sm text-gray-400 font-medium mt-1">Select and process your payment method</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plan Amount</div>
                        <div className="text-4xl font-black text-[#0C7C8A]">₹{plans.find(p => p.id === selectedPlan)?.price}</div>
                    </div>
                </div>
                <div className="space-y-6">
                    <label className="text-xs font-bold text-[#1A2332] uppercase tracking-widest pl-1">Payment Options</label>
                    <div className="grid gap-5">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg
                            ${paymentMethod === method.id ? 'border-[#0C7C8A] bg-[#0C7C8A]/5 shadow-inner' : 'border-gray-50 bg-gray-50/30'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                            ${paymentMethod === method.id ? 'bg-[#0C7C8A] text-white rotate-3 scale-110' : 'bg-white text-gray-400 shadow-sm'}`}>
                                    <method.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <span className={`font-bold text-lg block ${paymentMethod === method.id ? 'text-[#064E5C]' : 'text-gray-600'}`}>{method.name}</span>
                                    {paymentMethod === method.id && <span className="text-[10px] text-[#0C7C8A] font-bold uppercase tracking-tight">Active Selection</span>}
                                </div>
                                {paymentMethod === method.id && <div className="ml-auto w-6 h-6 bg-[#0C7C8A] rounded-full flex items-center justify-center shadow-md"><CheckCircle className="w-4 h-4 text-white" /></div>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-6 space-y-5">
                    <button onClick={handleAction} disabled={!paymentMethod} className="w-full bg-[#1A2332] text-white py-6 rounded-2xl font-black text-xl hover:bg-[#0C7C8A] transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 transform active:scale-[0.98]">
                        <ShieldCheck className="w-7 h-7" /> Pay Now Securely
                    </button>
                    <p className="text-[11px] text-gray-400 text-center uppercase tracking-widest font-bold flex items-center justify-center gap-2 pt-4"><Lock className="w-3 h-3" /> 256-bit SSL Secure Encryption</p>
                </div>
            </div>
            <button onClick={handleBack} className="w-full text-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">← Return to Plan Selection</button>
        </div>
    );

    const renderSuccessView = () => (
        <div className="max-w-2xl mx-auto py-24 text-center space-y-10 animate-fadeUp">
            <div className="relative">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10"><CheckCircle className="w-14 h-14 text-emerald-600" /></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-50 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="space-y-4">
                <h2 className="text-5xl font-bold text-[#1A2332] font-serif">Plan Activated!</h2>
                <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
                <p className="text-[#718096] text-xl leading-relaxed max-w-lg mx-auto font-medium">Your lead plan is now active. You will start receiving matching patient leads shortly.</p>
            </div>
            <button onClick={handleAction} className="bg-[#0C7C8A] text-white px-24 py-5.5 rounded-[2rem] font-black text-2xl hover:brightness-95 transition-all shadow-[0_25px_50px_-12px_rgba(12,124,138,0.5)] flex items-center justify-center gap-4 mx-auto mt-16 group active:scale-95">Continue Onboarding <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" /></button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCF7] w-full animate-fadeUp relative font-sans selection:bg-[#0C7C8A]/10">
            <div className="max-w-[1400px] mx-auto px-8 py-16">
                {view === 'selection' && renderPlanSelection()}
                {view === 'payment-gateway' && renderPaymentGateway()}
                {view === 'success' && renderSuccessView()}
                {view === 'leads-selection' && renderLeadsSelection()}
                {view === 'confirm-session' && renderConfirmSession()}
            </div>
        </div>
    );
};

export default LeadPlansPage;
