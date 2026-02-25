
import React, { useState } from 'react';
import { VR_ENVIRONMENTS, GROUP_THEMES } from '../constants';
import { Session, SessionStatus } from '../types';

interface PatientPortalProps {
  onJoinRoom: (session: Session) => void;
  sessions: Session[];
  onBack?: () => void;
}

interface ExecutiveLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (packageType: 'VIRTUAL' | 'HOUSE') => void;
}

const ExecutiveLoungeModal: React.FC<ExecutiveLoungeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedPackage, setSelectedPackage] = useState<'VIRTUAL' | 'HOUSE' | null>(null);
  const [step, setStep] = useState<'SELECT' | 'PAYMENT_METHODS' | 'PAYMENT_FORM' | 'PROCESSING' | 'RESULT' | 'HOUSE_FORM'>('SELECT');
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'SUCCESS' | 'FAILURE' | null>(null);

  const [formData, setFormData] = useState({ date: '', time: '', address: '' });
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvv: '', upiId: '' });

  if (!isOpen) return null;

  const handleInitialAction = () => {
    if (selectedPackage === 'HOUSE') {
      setStep('HOUSE_FORM');
    } else if (selectedPackage === 'VIRTUAL') {
      setStep('PAYMENT_METHODS');
    }
  };

  const handleReset = () => {
    setStep('SELECT');
    setSelectedPackage(null);
    setSelectedMethod(null);
    setPaymentStatus(null);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PROCESSING');

    setTimeout(() => {
      const isSuccess = selectedMethod === 'CARD' ? !paymentData.cardNumber.startsWith('0') : !!paymentData.upiId;

      if (isSuccess) {
        setPaymentStatus('SUCCESS');
        setStep('RESULT');
        setTimeout(() => {
          onConfirm('VIRTUAL');
          onClose();
          handleReset();
        }, 2000);
      } else {
        setPaymentStatus('FAILURE');
        setStep('RESULT');
      }
    }, 2500);
  };

  const handleHouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`House visit request received for ${formData.date} at ${formData.time}.\nLocation: ${formData.address}`);
    onClose();
    handleReset();
  };

  const paymentMethods = [
    { id: 'UPI', label: 'UPI', icon: '📱' },
    { id: 'CARD', label: 'Card', icon: '💳' },
    { id: 'NETBANKING', label: 'NetBanking', icon: '🏦' },
    { id: 'WALLET', label: 'Wallet', icon: '👛' },
  ] as const;

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 relative animate-[scaleUp_0.3s_ease-out]">

        {step !== 'PROCESSING' && step !== 'RESULT' && (
          <button
            onClick={() => { onClose(); handleReset(); }}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100 z-20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

        <div className="p-8 md:p-10">
          {step === 'SELECT' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-[#fcfdff] rounded-[32px] p-6 mb-8 border border-slate-50 text-center">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.5em] mb-3">EXECUTIVE LOUNGE</p>
                <h2 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter italic mb-4 leading-tight">
                  Premium Virtual Therapy
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">🔥 Ambient Environment</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span>HD Video</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span>Whiteboard</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div
                  onClick={() => setSelectedPackage('VIRTUAL')}
                  className={`group bg-[#f8fbff] border-2 rounded-[24px] p-5 shadow-sm transition-all cursor-pointer flex flex-col ${selectedPackage === 'VIRTUAL' ? 'border-amber-500 shadow-amber-500/5' : 'border-white hover:border-amber-500/10'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl drop-shadow-sm">📹</span>
                      <h4 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tighter">Virtual Session</h4>
                    </div>
                    <span className="text-xl font-black text-[#1a2b4b] tracking-tighter">— ₹2,499</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Premium video, ambient space, post-session summary
                  </p>
                </div>

                <div
                  onClick={() => setSelectedPackage('HOUSE')}
                  className={`group bg-[#f8fbff] border-2 rounded-[24px] p-5 shadow-sm transition-all cursor-pointer flex flex-col ${selectedPackage === 'HOUSE' ? 'border-amber-500 shadow-amber-500/5' : 'border-white hover:border-amber-500/10'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl drop-shadow-sm">🏠</span>
                      <h4 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tighter">House Visit</h4>
                    </div>
                    <span className="text-xl font-black text-[#1a2b4b] tracking-tighter">— ₹4,999</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Therapist comes to you. Live tracking, safety protocols.
                  </p>
                </div>
              </div>

              <button
                onClick={handleInitialAction}
                disabled={!selectedPackage}
                className={`w-full py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${selectedPackage ? 'bg-[#1a2b4b] text-white shadow-xl hover:brightness-110 active:scale-[0.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                BOOK & PAY NOW →
              </button>
            </div>
          )}

          {step === 'PAYMENT_METHODS' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-emerald-100">💳</div>
                <h2 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic mb-1">Payment Options</h2>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Select your preferred method to pay ₹2,499</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-5 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${selectedMethod === method.id ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-[#f8fbff] border-white hover:border-emerald-500/20'}`}
                  >
                    <span className="text-3xl">{method.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#1a2b4b]">{method.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('SELECT')} className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-[16px] font-black text-[9px] uppercase tracking-widest">Back</button>
                <button
                  disabled={!selectedMethod}
                  onClick={() => setStep('PAYMENT_FORM')}
                  className={`flex-[2] py-4 rounded-[16px] font-black text-[9px] uppercase tracking-[0.3em] transition-all ${selectedMethod ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 'PAYMENT_FORM' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-[#1a2b4b] uppercase tracking-tighter italic mb-1">
                  {selectedMethod} Details
                </h2>
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">SECURE PAYMENT GATEWAY</p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {selectedMethod === 'CARD' ? (
                  <>
                    <input required placeholder="Card Number" className="w-full bg-[#f8fbff] border border-slate-100 rounded-[16px] px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={paymentData.cardNumber} onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required placeholder="MM/YY" className="w-full bg-[#f8fbff] border border-slate-100 rounded-[16px] px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={paymentData.expiry} onChange={e => setPaymentData({ ...paymentData, expiry: e.target.value })} />
                      <input required type="password" placeholder="CVV" className="w-full bg-[#f8fbff] border border-slate-100 rounded-[16px] px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={paymentData.cvv} onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value })} />
                    </div>
                  </>
                ) : (
                  <input required placeholder="UPI ID (user@bank)" className="w-full bg-[#f8fbff] border border-slate-100 rounded-[16px] px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={paymentData.upiId} onChange={e => setPaymentData({ ...paymentData, upiId: e.target.value })} />
                )}
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setStep('PAYMENT_METHODS')} className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-[16px] font-black text-[9px] uppercase tracking-widest">Back</button>
                  <button type="submit" className="flex-[2] bg-emerald-500 text-white py-4 rounded-[16px] font-black text-[9px] uppercase tracking-[0.3em] shadow-lg">Pay ₹2,499</button>
                </div>
              </form>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic">Verifying...</h2>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-[scaleUp_0.4s_ease-out]">
              <div className={`w-20 h-20 ${paymentStatus === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} rounded-full flex items-center justify-center mb-6 text-4xl shadow-lg`}>
                {paymentStatus === 'SUCCESS' ? '✓' : '✕'}
              </div>
              <h2 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter italic mb-2">
                {paymentStatus === 'SUCCESS' ? 'Confirmed' : 'Failed'}
              </h2>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                {paymentStatus === 'SUCCESS' ? 'REDIRECTING TO SESSION...' : 'PLEASE TRY ANOTHER METHOD'}
              </p>
            </div>
          )}

          <p className="text-center mt-10 text-[8px] font-black text-slate-300 uppercase tracking-widest">
            PCI-DSS COMPLIANT • HIPAA PROTECTED • 256-BIT SSL
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
};

const PatientPortal: React.FC<PatientPortalProps> = ({ onJoinRoom, sessions, onBack }) => {
  const [loungeOpen, setLoungeOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<Session | null>(null);

  const triggerLounge = (session: Session) => {
    setPendingSession(session);
    setLoungeOpen(true);
  };

  const handleLoungeConfirm = (packageType: 'VIRTUAL' | 'HOUSE') => {
    if (packageType === 'VIRTUAL' && pendingSession) {
      onJoinRoom(pendingSession);
    }
    setLoungeOpen(false);
  };

  const handleJoinGroup = (theme: any) => {
    const mockGroupSession: Session = {
      id: `group-join-${theme.slug}-${Date.now()}`,
      therapistName: 'Certified Moderator',
      startTime: new Date().toISOString(),
      durationMinutes: 60,
      status: SessionStatus.LIVE,
      isEncrypted: true,
      isGroup: true,
      theme: theme,
      currentParticipants: Math.floor(Math.random() * 12) + 5,
      maxParticipants: 25
    };
    triggerLounge(mockGroupSession);
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      console.log("Navigation: Returning to main site.");
    }
  };

  return (
    <div className="min-h-screen py-12 p-6 md:p-10 relative">
      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-[#1a2b4b] font-black text-[9px] uppercase tracking-widest group"
        >
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        <ExecutiveLoungeModal
          isOpen={loungeOpen}
          onClose={() => setLoungeOpen(false)}
          onConfirm={handleLoungeConfirm}
        />

        <section className="animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1 bg-slate-200/60"></div>
            <h2 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter italic whitespace-nowrap px-6">Group Sessions</h2>
            <div className="h-px flex-1 bg-slate-200/60"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GROUP_THEMES.map((theme) => (
              <div
                key={theme.id}
                className="group bg-white rounded-[32px] p-8 shadow-lg border border-white/40 flex flex-col items-center text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer relative overflow-hidden"
                onClick={() => handleJoinGroup(theme)}
              >
                <div className="relative mb-6">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-white text-[8px] font-black uppercase px-4 py-1 rounded-full border border-white/50 shadow-md whitespace-nowrap z-10"
                    style={{ backgroundColor: theme.color }}>
                    LIVE NOW
                  </div>
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform relative">
                    <span className="relative z-10 drop-shadow-md">{theme.emoji}</span>
                  </div>
                </div>

                {/* Group session name in Blue as requested */}
                <h3 className="text-lg font-black text-[#0066ff] uppercase tracking-tighter mb-2 transition-colors leading-tight">
                  {theme.name}
                </h3>

                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed mb-6 opacity-80 line-clamp-2">
                  {theme.description}
                </p>

                <div className="flex items-center gap-3 mt-auto">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.color }}></span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">TAP TO JOIN</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PatientPortal;
