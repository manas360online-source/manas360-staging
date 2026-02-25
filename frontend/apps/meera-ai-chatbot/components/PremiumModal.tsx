
import React from 'react';
import { Check, X, ShieldCheck, Zap } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-[#f0f7ff] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-[#1068eb] p-8 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Unlock Meera Premium</h2>
          <p className="text-blue-100 text-sm">24/7 Unlimited Emotional Support & Advanced Coping Strategies</p>
        </div>

        <div className="p-8">
          <ul className="space-y-4 mb-8">
            {[
              "Unlimited daily conversations",
              "Advanced grounding techniques",
              "Personalized resource matching",
              "Priority AI response time",
              "Export chat history (Coming Soon)"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-5 h-5 bg-blue-100 text-[#1068eb] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <div className="bg-white rounded-2xl p-4 border border-blue-100 mb-8 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Monthly Plan</p>
                <p className="text-xs text-slate-500">Cancel anytime</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1068eb]">$9.99<span className="text-xs text-slate-400 font-normal">/mo</span></p>
              </div>
            </div>
          </div>

          <button
            onClick={onUpgrade}
            className="w-full bg-[#1068eb] hover:bg-[#0d56c4] text-white font-bold py-4 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap size={18} fill="currentColor" />
            Get Started Now
          </button>

          <p className="text-center text-[10px] text-slate-400 mt-4 px-6">
            Your support helps us keep the free tier available for those who need it most.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;