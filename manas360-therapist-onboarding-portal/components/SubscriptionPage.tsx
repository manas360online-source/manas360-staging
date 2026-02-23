import React from 'react';
import {
    ChevronRight,
    ArrowLeft,
    Smartphone,
    Lock,
    Layout,
    ShieldCheck,
    CreditCard,
    Zap,
    History,
    FileText,
    BarChart3,
    IndianRupee,
    Briefcase,
    CheckCircle
} from 'lucide-react';

interface SubscriptionPageProps {
    onNext: () => void;
    onPrev: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onNext, onPrev }) => {
    const [view, setView] = React.useState<'info' | 'plan-selection' | 'payment-gateway' | 'success'>('info');
    const [selectedPlan, setSelectedPlan] = React.useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);

    const plans = [
        { id: 1, price: 99, duration: '1 Month', originalPrice: 120, tag: 'Basic' },
        { id: 2, price: 199, duration: '2 Months', originalPrice: 240, tag: 'Most Popular' },
        { id: 3, price: 290, duration: '3 Months (Quarterly)', originalPrice: 360, tag: 'Best Value' },
    ];

    const paymentMethods = [
        { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: Smartphone },
        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
        { id: 'netbanking', name: 'Netbanking', icon: Layout },
    ];

    const handleAction = () => {
        if (view === 'info') setView('plan-selection');
        else if (view === 'plan-selection' && selectedPlan) setView('payment-gateway');
        else if (view === 'payment-gateway' && paymentMethod) {
            // Simulate processing
            setTimeout(() => setView('success'), 800);
        }
        else if (view === 'success') onNext();
    };

    const handleBack = () => {
        if (view === 'info') onPrev();
        else if (view === 'plan-selection') setView('info');
        else if (view === 'payment-gateway') setView('plan-selection');
        else if (view === 'success') setView('payment-gateway');
    };

    // --- RENDER HELPERS ---

    const renderInfoView = () => (
        <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Side: Desktop Content */}
            <div className="flex-1 space-y-10">
                <div>
                    <div className="flex items-center gap-2 text-[#0C7C8A] font-bold text-xs mb-6 uppercase tracking-wider">
                        <span className="w-5 h-[2px] bg-[#0C7C8A]"></span>
                        Subscribe · Step 4 of 18
                    </div>
                    <h1 className="text-5xl font-bold text-[#1A2332] font-serif mb-6">
                        Platform Subscription — ₹290/Q
                    </h1>
                    <p className="text-[#718096] text-lg leading-relaxed max-w-2xl font-medium">
                        All providers pay ₹99/month (₹290 quarterly) for platform access. Includes: <br />
                        profile listing, dashboard, templates, analytics.
                    </p>
                </div>

                <div className="space-y-5">
                    {/* Feature Cards */}
                    {[
                        { icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50", title: "Platform Fee: ₹290/Q", desc: "Base access: verified listing, patient dashboard, CBT templates, session management tools, analytics." },
                        { icon: Layout, color: "text-blue-600", bg: "bg-blue-50", title: "What's Included", desc: "Profile in search results, patient reviews, calendar integration, prescription generator, progress tracking." },
                        { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50", title: "Revenue Split: 60/40", desc: "Provider keeps 60% of session fees. MANAS360 retains 40% for platform, marketing, tech, support." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-5 items-center hover:border-[#0C7C8A] transition-all group max-w-2xl">
                            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-[#1A2332] text-base">{item.title}</h3>
                                <p className="text-[#718096] text-[13px] mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#f0ece2] p-4 rounded-xl border border-[#e5e0d3] flex gap-3 items-start max-w-2xl">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#718096] leading-relaxed">
                        <span className="font-bold text-[#1A2332]">UX Note:</span> Platform fee is separate from lead plans. Provider must subscribe to platform BEFORE buying lead plans.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-6">
                    <button onClick={handleBack} className="flex items-center gap-2 px-10 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-[#718096] hover:bg-white transition-all shadow-sm">← Back</button>
                    <button onClick={handleAction} className="bg-[#0C7C8A] text-white px-12 py-3.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">Next Step →</button>
                </div>
            </div>

            {/* Mobile Mockup */}
            <div className="w-full lg:w-[400px] flex justify-center sticky top-8">
                <div className="relative w-[340px] h-[680px] bg-[#111] rounded-[3.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[10px] border-[#222]">
                    <div className="w-full h-full bg-[#fdfaf5] rounded-[2.8rem] overflow-hidden flex flex-col relative">
                        <div className="h-7 w-full flex justify-between items-center px-8 pt-2">
                            <span className="text-[11px] font-bold">9:41</span>
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div><div className="w-2.5 h-2.5 rounded-full bg-black/10"></div></div>
                        </div>
                        <div className="p-4 px-6 flex justify-between items-center">
                            <button className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Platform Access</button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 pb-28 scrollbar-hide">
                            <div className="text-center mb-8 mt-4">
                                <div className="inline-flex items-center justify-center gap-1.5 text-[#D946EF] font-bold uppercase text-[10px] mb-3 tracking-widest bg-[#FDF2F8] px-3 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-[#D946EF]"></div>Platform Access</div>
                                <h2 className="text-5xl font-black text-[#1A2332] tracking-tight">₹99<span className="text-base font-bold text-gray-400">/month</span></h2>
                                <p className="text-[12px] text-gray-400 mt-2 font-medium">Billed quarterly · ₹290 for 3 months</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: FileText, color: "text-orange-500", bg: "bg-orange-50", title: "Verified Profile Listing", desc: "Appear in patient search with verified badge" },
                                    { icon: Layout, color: "text-blue-500", bg: "bg-blue-50", title: "Provider Dashboard", desc: "Sessions, earnings, ratings, patient progress" },
                                    { icon: History, color: "text-purple-500", bg: "bg-purple-50", title: "CBT/DBT Templates", desc: "Session worksheets, assessment tools, homework" },
                                    { icon: ShieldCheck, color: "text-red-500", bg: "bg-red-50", title: "Prescription Generator", desc: "Digital prescriptions, compliant format, PDF export" },
                                    { icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50", title: "Analytics & Insights", desc: "Session trends, patient outcomes, earning reports" }
                                ].map((item, id) => (
                                    <div key={id} className="p-4 rounded-2xl bg-white border border-gray-100 flex gap-4 items-center shadow-sm">
                                        <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}><item.icon className={`w-5 h-5 ${item.color}`} /></div>
                                        <div><h4 className="text-[12px] font-bold text-[#1A2332]">{item.title}</h4><p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute bottom-8 left-0 right-0 px-6">
                            <button onClick={handleAction} className="w-full bg-[#0C7C8A] text-white py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-95 transition-all">Subscribe ₹290 for 3 months →</button>
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#111] rounded-b-[1.5rem] flex justify-center items-end pb-1.5"><div className="w-10 h-1 rounded-full bg-white/10"></div></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPlanSelection = () => (
        <div className="max-w-4xl mx-auto space-y-10 py-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-[#1A2332] font-serif">Select Your Subscription Plan</h2>
                <p className="text-[#718096] text-lg font-medium">Choose a duration that works best for your clinical practice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative p-10 rounded-[2.5rem] border-2 transition-all cursor-pointer hover:shadow-2xl group flex flex-col items-center text-center
                            ${selectedPlan === plan.id ? 'border-[#0C7C8A] bg-white shadow-xl scale-[1.02]' : 'border-gray-100 bg-white shadow-sm'}`}
                    >
                        {plan.tag && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0C7C8A] text-white text-[10px] font-bold px-6 py-1.5 rounded-full shadow-lg uppercase tracking-widest z-10">
                                {plan.tag}
                            </span>
                        )}
                        <span className="text-gray-300 text-sm font-bold line-through mb-1">₹{plan.originalPrice}</span>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-5xl font-black text-[#1A2332]">₹{plan.price}</span>
                            <span className="text-gray-400 font-bold text-sm">total</span>
                        </div>
                        <h3 className={`text-xl font-bold mb-8 ${selectedPlan === plan.id ? 'text-[#0C7C8A]' : 'text-gray-800'}`}>{plan.duration}</h3>

                        <div className="mt-auto flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-100 group-hover:border-[#0C7C8A] transition-colors">
                            <div className={`w-4 h-4 rounded-full transition-all ${selectedPlan === plan.id ? 'bg-[#0C7C8A]' : 'bg-transparent'}`}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-8 pt-10">
                <button onClick={handleBack} className="text-[#718096] font-bold hover:text-[#1A2332] transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Overview
                </button>
                <button
                    onClick={handleAction}
                    disabled={!selectedPlan}
                    className="bg-[#0C7C8A] text-white px-20 py-4.5 rounded-2xl font-black text-lg hover:brightness-95 transition-all shadow-[0_20px_40px_-10px_rgba(12,124,138,0.3)] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95"
                >
                    Proceed to Pay →
                </button>
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
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount to Pay</div>
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
                                    <span className={`font-bold text-lg block ${paymentMethod === method.id ? 'text-[#064E5C]' : 'text-gray-600'}`}>
                                        {method.name}
                                    </span>
                                    {paymentMethod === method.id && <span className="text-[10px] text-[#0C7C8A] font-bold uppercase tracking-tight">Active Selection</span>}
                                </div>
                                {paymentMethod === method.id && (
                                    <div className="ml-auto w-6 h-6 bg-[#0C7C8A] rounded-full flex items-center justify-center shadow-md">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 space-y-5">
                    <button
                        onClick={handleAction}
                        disabled={!paymentMethod}
                        className="w-full bg-[#1A2332] text-white py-6 rounded-2xl font-black text-xl hover:bg-[#0C7C8A] transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 transform active:scale-[0.98]"
                    >
                        <ShieldCheck className="w-7 h-7" />
                        Pay Now Securely
                    </button>
                    <p className="text-[11px] text-gray-400 text-center uppercase tracking-widest font-bold flex items-center justify-center gap-2 pt-4">
                        <Lock className="w-3 h-3" /> 256-bit SSL Secure Encryption
                    </p>
                </div>
            </div>
            <button onClick={handleBack} className="w-full text-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                ← Return to Plan Selection
            </button>
        </div>
    );

    const renderSuccessView = () => (
        <div className="max-w-2xl mx-auto py-24 text-center space-y-10 animate-fadeUp">
            <div className="relative">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10">
                    <CheckCircle className="w-14 h-14 text-emerald-600" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-50 rounded-full animate-ping opacity-20"></div>
            </div>

            <div className="space-y-4">
                <h2 className="text-5xl font-bold text-[#1A2332] font-serif">Payment Successful!</h2>
                <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
                <p className="text-[#718096] text-xl leading-relaxed max-w-lg mx-auto font-medium">
                    Welcome to the platform. Your subscription is active and your professional tools are unlocked.
                </p>
            </div>

            <button
                onClick={handleAction}
                className="bg-[#0C7C8A] text-white px-24 py-5.5 rounded-[2rem] font-black text-2xl hover:brightness-95 transition-all shadow-[0_25px_50px_-12px_rgba(12,124,138,0.5)] flex items-center justify-center gap-4 mx-auto mt-16 group active:scale-95"
            >
                Start Onboarding Journey
                <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCF7] w-full animate-fadeUp relative font-sans selection:bg-[#0C7C8A]/10">
            <div className="max-w-[1400px] mx-auto px-8 py-16">
                {view === 'info' && renderInfoView()}
                {view === 'plan-selection' && renderPlanSelection()}
                {view === 'payment-gateway' && renderPaymentGateway()}
                {view === 'success' && renderSuccessView()}
            </div>
        </div>
    );
};

export default SubscriptionPage;
