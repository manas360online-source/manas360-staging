
import React from 'react';
import { Shield, Sparkles, Heart, GraduationCap, MessageCircle, LayoutDashboard, Trash2, History, Home, ChevronLeft } from 'lucide-react';

interface ChatHeaderProps {
  isPremium: boolean;
  onUpgrade: () => void;
  remainingInfo: string;
  view: 'home' | 'chat' | 'training' | 'compliance' | 'history' | 'ar-mode' | 'crisis-dashboard';
  onViewChange: (view: any) => void;
  onClearChat?: () => void;
  usageLabel?: string;
  upgradeLabel?: string;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isPremium,
  onUpgrade,
  remainingInfo,
  view,
  onViewChange,
  onClearChat,
  usageLabel = "Usage Remaining",
  upgradeLabel = "UPGRADE",
  onBack
}) => {
  return (
    <header className="bg-white border-b border-blue-100 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-[#1068eb] hover:bg-blue-50 rounded-full transition-all"
            title="Back to Home"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <button
          onClick={() => onViewChange('home')}
          className="w-10 h-10 bg-[#1068eb] rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
        >
          <Heart size={20} fill="currentColor" />
        </button>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-800 text-sm">Meera</h1>
            <span className="text-[8px] font-bold text-[#1068eb] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">Wellness</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Safe Space AI</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <nav className="flex bg-slate-100 p-1 rounded-xl md:rounded-full overflow-x-auto no-scrollbar">
          <button
            onClick={() => onViewChange('home')}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg md:rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'home' ? 'bg-[#1068eb] shadow-md text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Home size={14} />
            Home
          </button>
          <button
            onClick={() => onViewChange('chat')}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg md:rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'chat' ? 'bg-[#1068eb] shadow-md text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MessageCircle size={14} />
            AI Meera
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg md:rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'history' ? 'bg-[#1068eb] shadow-md text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History size={14} />
            History
          </button>
          <button
            onClick={() => onViewChange('training')}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg md:rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${view === 'training' ? 'bg-[#1068eb] shadow-md text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <GraduationCap size={14} />
            Training
          </button>
        </nav>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-2">
          {view === 'chat' && (
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{usageLabel}</span>
              <span className="text-[10px] font-bold text-[#1068eb]">{isPremium ? 'Unlimited' : remainingInfo}</span>
            </div>
          )}

          {(view === 'chat' || view === 'history') && onClearChat && (
            <button
              onClick={onClearChat}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Clear Active Mode History"
            >
              <Trash2 size={18} />
            </button>
          )}

          {isPremium ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-[9px] font-bold border border-amber-200">
              <Sparkles size={10} />
              PREMIUM
            </div>
          ) : (
            <button
              onClick={onUpgrade}
              className="hidden sm:flex items-center gap-1.5 bg-[#1068eb] hover:bg-[#0d56c4] text-white px-4 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-md active:scale-95"
            >
              {upgradeLabel}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
