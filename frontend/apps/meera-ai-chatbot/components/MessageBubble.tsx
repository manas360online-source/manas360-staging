
import React, { useRef, useState, useEffect } from 'react';
import { Role, Message } from '../types';
import { Play, Pause, AlertTriangle, ExternalLink, FileText, PlayCircle, Phone, Check, CheckCheck, Volume2, FastForward, Rewind } from 'lucide-react';
import { generateSpeech } from '../services/gemini';
import { decodeBase64, pcmToWav } from '../utils/audio';

interface MessageBubbleProps {
  message: Message;
  mode: 'text' | 'voice';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, mode }) => {
  const isBot = message.role === Role.MODEL;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [wavUrl, setWavUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (message.voiceBase64 && !wavUrl) {
      const bytes = decodeBase64(message.voiceBase64);
      const blob = pcmToWav(bytes, 24000);
      const url = URL.createObjectURL(blob);
      setWavUrl(url);
    }
  }, [message.voiceBase64]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const audioSrc = message.voiceUrl || wavUrl;

  return (
    <div className={`flex w-full mb-2 ${isBot ? 'justify-start animate-message-bot' : 'justify-end animate-message-user'}`}>
      <div className={`relative max-w-[85%] md:max-w-[70%] px-3 py-2 shadow-sm transition-all ${
        isBot ? 'bg-white text-slate-800 rounded-lg rounded-tl-none ml-1' : 'bg-[#dcf8c6] text-slate-800 rounded-lg rounded-tr-none mr-1'
      }`}>
        <div className={`absolute top-0 w-2 h-2 ${isBot ? '-left-2' : '-right-2'}`}>
          <svg viewBox="0 0 8 13" preserveAspectRatio="none" className="w-full h-full">
            <path d={isBot ? "M8 0 L0 0 L8 13 Z" : "M0 0 L8 0 L0 13 Z"} fill={isBot ? "white" : "#dcf8c6"} />
          </svg>
        </div>

        {message.isCrisis && (
          <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 text-[11px] font-bold">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>Crisis Protocol Activated: National Helplines Advised.</span>
          </div>
        )}

        {/* VOICE MODE PLAYER */}
        {mode === 'voice' && audioSrc && (
          <div className="flex flex-col gap-2 min-w-[240px] bg-slate-50/50 rounded-xl p-3 mb-2 border border-slate-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => skip(-5)}
                className="p-1.5 text-slate-400 hover:text-[#1068eb] transition-colors"
                title="Rewind 5s"
              >
                <Rewind size={18} />
              </button>
              
              <button 
                onClick={toggleAudio} 
                className="w-10 h-10 bg-[#1068eb] shadow-md rounded-full flex items-center justify-center text-white hover:bg-[#0d56c4] transition-colors"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>

              <button 
                onClick={() => skip(5)}
                className="p-1.5 text-slate-400 hover:text-[#1068eb] transition-colors"
                title="Fast Forward 5s"
              >
                <FastForward size={18} />
              </button>

              <div className="flex-1">
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
                   <div 
                    className="absolute inset-y-0 left-0 bg-[#1068eb] transition-all duration-100" 
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                   />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400">{formatTime(currentTime)}</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
              {isBot ? 'Bot Voice Note' : 'Your Voice Note'}
            </p>

            <audio 
              ref={audioRef} 
              src={audioSrc} 
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onTimeUpdate}
              onEnded={() => setIsPlaying(false)} 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden" 
            />
          </div>
        )}

        <div className={mode === 'voice' ? 'opacity-70 italic text-[13px]' : ''}>
          <p className="text-[14.5px] leading-[19px] whitespace-pre-wrap pr-10">{message.content}</p>
        </div>

        {isBot && message.suggestedResources && message.suggestedResources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
            {message.suggestedResources.map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">
                {res.type === 'video' ? <PlayCircle size={14} /> : res.type === 'contact' ? <Phone size={14} /> : <FileText size={14} />}
                <span className="truncate">{res.title}</span>
              </a>
            ))}
          </div>
        )}

        <div className="absolute bottom-1 right-2 flex items-center gap-1">
          <span className="text-[10px] text-slate-400">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isBot && (
            <div className="flex items-center">
              {message.status === 'read' ? <CheckCheck size={12} className="text-[#1068eb]" /> : <Check size={12} className="text-slate-400" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
