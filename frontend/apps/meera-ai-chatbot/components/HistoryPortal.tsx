
import React from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { MessageSquare, AudioLines, Calendar, History } from 'lucide-react';

interface HistoryPortalProps {
  textMessages: Message[];
  voiceMessages: Message[];
  mode: 'text' | 'voice';
  onModeChange: (mode: 'text' | 'voice') => void;
}

const HistoryPortal: React.FC<HistoryPortalProps> = ({ textMessages, voiceMessages, mode, onModeChange }) => {
  const messages = mode === 'text' ? textMessages : voiceMessages;

  return (
    <div className="flex-1 bg-[#f0f7ff] overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-[#1068eb] text-white rounded-xl shadow-md">
                <History size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Saved History</h2>
            </div>
            <p className="text-slate-500 text-sm">Review your past emotional support interactions.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            <button 
              onClick={() => onModeChange('text')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'text' ? 'bg-[#1068eb] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <MessageSquare size={16} />
              Text Logs
            </button>
            <button 
              onClick={() => onModeChange('voice')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'voice' ? 'bg-[#1068eb] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <AudioLines size={16} />
              Voice Logs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100 border border-blue-50 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-400">
               <Calendar size={18} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Archived Sessions</span>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            {messages.length <= 1 ? (
              <div className="flex flex-col items-center justify-center py-24 opacity-40">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  {mode === 'text' ? <MessageSquare size={40} /> : <AudioLines size={40} />}
                </div>
                <p className="font-bold text-slate-500">No {mode} history found</p>
                <p className="text-xs text-slate-400">Start a chat to see your logs here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <MessageBubble key={msg.id} message={msg} mode={mode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPortal;
