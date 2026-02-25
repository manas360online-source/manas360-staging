
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, PlusCircle, Volume2, MessageSquare, AudioLines, Loader2, Headset, Languages, MicOff, Trash2, Power, X, Check } from 'lucide-react';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import PremiumModal from './components/PremiumModal';
import CrisisPanel from './components/CrisisPanel';
import TrainingPortal from './components/TrainingPortal';
import HistoryPortal from './components/HistoryPortal';
import HomeView from './components/HomeView';
import ARView from './components/ARView';
import CrisisDashboard from './components/CrisisDashboard';
import { Role, Message, UserProfile, AIResponse, TherapistProfile, MessageStatus } from './types';
import { generateEmotionalSupportResponseStream, generateSpeech } from './services/gemini';
import {
  getTextHistory,
  saveTextHistory,
  getVoiceHistory,
  saveVoiceHistory,
  getUserProfile,
  saveUserProfile,
  getTherapistProfile,
  saveTherapistProfile,
  checkTextLimit,
  checkVoiceLimit
} from './utils/storage';
import { FREE_TIER_LIMIT, VOICE_TIER_LIMIT_SECONDS, WELCOME_MESSAGE, SUPPORTED_LANGUAGES, LOCALIZED_UI, SYSTEM_INSTRUCTION } from './constants';
import { playRawPcm } from './utils/audio';

type ViewType = 'home' | 'chat' | 'training' | 'compliance' | 'history' | 'ar-mode' | 'crisis-dashboard';

interface MeeraAppProps {
  onBack?: () => void;
}

const App: React.FC<MeeraAppProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewType>('home');
  const [chatSubMode, setChatSubMode] = useState<'text' | 'voice'>('text');
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [voiceMessages, setVoiceMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSTTActive, setIsSTTActive] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [transcript, setTranscript] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile>(getTherapistProfile());
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [selectedLang, setSelectedLang] = useState(userProfile.preferredLanguage || 'en-IN');
  const [voiceEnabled, setVoiceEnabled] = useState(userProfile.voiceEnabled);

  const t = LOCALIZED_UI[selectedLang] || LOCALIZED_UI['en-IN'];

  // Initial load
  useEffect(() => {
    const textH = getTextHistory();
    const voiceH = getVoiceHistory();

    if (textH.length === 0) setTextMessages([{ ...WELCOME_MESSAGE, content: t.welcome, timestamp: Date.now() }]);
    else setTextMessages(textH);

    if (voiceH.length === 0) setVoiceMessages([{ ...WELCOME_MESSAGE, content: t.welcome, timestamp: Date.now() }]);
    else setVoiceMessages(voiceH);
  }, []);

  // Update welcome message when language changes
  useEffect(() => {
    const updateWelcome = (msgs: Message[]) => msgs.map(m =>
      m.id === 'welcome-msg' ? { ...m, content: t.welcome } : m
    );

    setTextMessages(prev => updateWelcome(prev));
    setVoiceMessages(prev => updateWelcome(prev));
  }, [selectedLang]);

  useEffect(() => {
    if (textMessages.length > 0) saveTextHistory(textMessages);
  }, [textMessages]);

  useEffect(() => {
    if (voiceMessages.length > 0) saveVoiceHistory(voiceMessages);
  }, [voiceMessages]);

  const activeMessages = chatSubMode === 'text' ? textMessages : voiceMessages;

  const remainingTexts = Math.max(0, FREE_TIER_LIMIT - userProfile.dailyMessageCount);
  const remainingVoice = Math.max(0, VOICE_TIER_LIMIT_SECONDS - userProfile.totalVoiceSecondsUsed);
  const remainingDisplay = chatSubMode === 'text'
    ? `${remainingTexts} chats left`
    : `${remainingVoice}s voice left`;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition && !(window as any).webkitSpeechRecognition) {
      setIsBrowserSupported(false);
    } else {
      const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new Recognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLang;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          else interimTranscript += event.results[i][0].transcript;
        }
        const fullTranscript = finalTranscript + interimTranscript;
        if (chatSubMode === 'text') setInputValue(fullTranscript);
        else setTranscript(fullTranscript);
      };
      recognitionRef.current.onend = () => { if (!isRecording) setIsSTTActive(false); };
    }
  }, [selectedLang, chatSubMode]);

  useEffect(() => {
    if (view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, isLoading, view]);

  const startRecording = async () => {
    if (!isBrowserSupported) return;
    if (!checkVoiceLimit(userProfile)) { setShowPremiumModal(true); return; }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const userVoiceMsg: Message = {
            id: Date.now().toString(),
            role: Role.USER,
            content: transcript || t.voiceNote,
            timestamp: Date.now(),
            status: 'sending',
            voiceUrl: audioUrl,
            voiceDuration: voiceDuration
          };
          setVoiceMessages(prev => [...prev, userVoiceMsg]);
          processAIResponse(userVoiceMsg.content, true, base64Audio, voiceDuration);
        };
      };

      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      setIsRecording(true);
      setTranscript('');
      setVoiceDuration(0);

      timerRef.current = window.setInterval(() => {
        setVoiceDuration(prev => {
          const totalAfterThisSecond = userProfile.totalVoiceSecondsUsed + prev + 1;
          if (totalAfterThisSecond >= VOICE_TIER_LIMIT_SECONDS) {
            stopRecording();
            setShowPremiumModal(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.stop();
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTranscript('');
      setVoiceDuration(0);
    }
  };

  const incrementVoiceDuration = (duration: number) => {
    setUserProfile(prev => {
      const updated = { ...prev, totalVoiceSecondsUsed: prev.totalVoiceSecondsUsed + duration };
      saveUserProfile(updated);
      return updated;
    });
  };

  const incrementTextCount = () => {
    setUserProfile(prev => {
      const updated = { ...prev, dailyMessageCount: prev.dailyMessageCount + 1 };
      saveUserProfile(updated);
      return updated;
    });
  };

  const suggestions = [
    "How can I manage stress?",
    "Tell me a relaxation technique",
    "How to handle anxiety?",
    "Tips for better sleep",
    "Signs of emotional burnout"
  ];

  const handleSendMessage = async (customValue?: string) => {
    const val = customValue || inputValue;
    if (!val.trim()) return;
    if (!checkTextLimit(userProfile)) { setShowPremiumModal(true); return; }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: val,
      timestamp: Date.now(),
      status: 'sending'
    };

    setTextMessages(prev => [...prev, newMessage]);
    setInputValue('');
    processAIResponse(newMessage.content, false);
  };

  const processAIResponse = async (text: string, isVoiceSession: boolean, audioBase64?: string, duration: number = 0) => {
    setIsLoading(true);
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = { id: botMessageId, role: Role.MODEL, content: "", timestamp: Date.now(), status: 'sending' };

    const updateMessages = (prev: Message[]) => {
      const updated = prev.map(m => m.status === 'sending' ? { ...m, status: 'sent' as MessageStatus } : m);
      return [...updated, initialBotMessage];
    };

    if (isVoiceSession) setVoiceMessages(updateMessages);
    else setTextMessages(updateMessages);

    try {
      const aiResponse: AIResponse = await generateEmotionalSupportResponseStream(
        isVoiceSession ? voiceMessages.slice(-10) : textMessages.slice(-10),
        text,
        (streamedText) => {
          const streamUpdate = (prev: Message[]) => prev.map((m): Message => m.id === botMessageId ? { ...m, content: streamedText } : m);
          if (isVoiceSession) setVoiceMessages(streamUpdate);
          else setTextMessages(streamUpdate);
        },
        audioBase64,
        selectedLang
      );

      let finalVoice: string | undefined;
      if (isVoiceSession && voiceEnabled) {
        finalVoice = await generateSpeech(aiResponse.text);
        if (finalVoice) playRawPcm(finalVoice);
      }

      const finalUpdate = (prev: Message[]) => prev.map((m): Message => m.id === botMessageId ? {
        ...m,
        content: aiResponse.text,
        sentiment: aiResponse.sentiment,
        isCrisis: aiResponse.isCrisis,
        suggestedResources: aiResponse.suggestedResources,
        voiceBase64: finalVoice,
        status: 'sent' as MessageStatus
      } : m);

      if (isVoiceSession) setVoiceMessages(finalUpdate);
      else setTextMessages(finalUpdate);

      if (aiResponse.isCrisis) setShowCrisisResources(true);
      if (isVoiceSession) incrementVoiceDuration(duration);
      else incrementTextCount();
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = useCallback(() => {
    const modeName = chatSubMode === 'text' ? 'Text' : 'Voice';
    if (window.confirm(`Clear all ${modeName} history?`)) {
      const resetMsg: Message = { ...WELCOME_MESSAGE, content: t.welcome, timestamp: Date.now() };
      if (chatSubMode === 'text') { setTextMessages([resetMsg]); saveTextHistory([resetMsg]); }
      else { setVoiceMessages([resetMsg]); saveVoiceHistory([resetMsg]); }
    }
  }, [chatSubMode, t.welcome]);

  return (
    <div className="flex flex-col h-screen bg-[#f0f7ff] font-sans text-slate-900 overflow-hidden">
      <ChatHeader
        isPremium={userProfile.isPremium}
        onUpgrade={() => setShowPremiumModal(true)}
        remainingInfo={remainingDisplay}
        view={view}
        onViewChange={setView}
        onClearChat={clearHistory}
        usageLabel={t.usageRemaining}
        upgradeLabel={t.upgrade}
        onBack={onBack}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {view === 'home' && (
          <HomeView onSelectMode={(mode) => setView(mode)} userName="Guest" />
        )}

        {view === 'ar-mode' && (
          <ARView onClose={() => setView('home')} />
        )}

        {view === 'crisis-dashboard' && (
          <CrisisDashboard
            onBack={() => setView('home')}
            mitraChat={{
              messages: textMessages,
              onSendMessage: (text) => handleSendMessage(text),
              isLoading: isLoading
            }}
          />
        )}

        {view === 'chat' && (
          <div className="flex-1 flex flex-col min-w-0 bg-white md:m-4 md:rounded-[2rem] shadow-xl shadow-blue-100 overflow-hidden border border-blue-50 animate-in fade-in slide-in-from-right-5 duration-500">
            <div className="flex flex-col border-b border-slate-50 p-2">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setChatSubMode('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${chatSubMode === 'text' ? 'bg-blue-50 text-[#1068eb]' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <MessageSquare size={16} /> {t.textMode}
                </button>
                <button
                  onClick={() => setChatSubMode('voice')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${chatSubMode === 'voice' ? 'bg-blue-50 text-[#1068eb]' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <AudioLines size={16} /> {t.voiceMode}
                </button>
              </div>

              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <Languages size={14} className="text-slate-300 ml-2" />
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); saveUserProfile({ ...userProfile, preferredLanguage: lang.code }); }}
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap border ${selectedLang === lang.code ? 'bg-[#1068eb] text-white border-[#1068eb]' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { setVoiceEnabled(!voiceEnabled); saveUserProfile({ ...userProfile, voiceEnabled: !voiceEnabled }); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-[10px] font-bold text-[#1068eb] transition-all hover:bg-blue-100"
                >
                  {voiceEnabled ? <Volume2 size={14} /> : <MicOff size={14} />}
                  {voiceEnabled ? t.voiceOn : t.voiceOff}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
              {activeMessages.map(msg => <MessageBubble key={msg.id} message={msg} mode={chatSubMode} />)}

              {isLoading && (
                <div className="flex justify-start animate-message-bot">
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-slate-100">
                    <Loader2 size={16} className="animate-spin text-[#1068eb]" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.thinking}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {activeMessages.length < 5 && chatSubMode === 'text' && (
              <div className="px-4 py-2 bg-white flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50">
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="flex-shrink-0 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1068eb] text-[11px] font-bold rounded-full border border-blue-100 transition-all whitespace-nowrap active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-white border-t border-slate-50">
              {chatSubMode === 'text' ? (
                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                  <div className="flex-1 relative bg-slate-100 rounded-[1.5rem] border border-slate-200 focus-within:border-[#1068eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder={t.placeholder}
                      className="w-full bg-transparent border-none focus:ring-0 py-3 px-5 text-sm resize-none max-h-32 min-h-[48px]"
                      rows={1}
                    />
                    <button
                      onClick={() => { if (isSTTActive) { recognitionRef.current?.stop(); setIsSTTActive(false); } else { recognitionRef.current?.start(); setIsSTTActive(true); } }}
                      className={`absolute right-3 bottom-2.5 p-1.5 rounded-full transition-colors ${isSTTActive ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-200'}`}
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                  <button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isLoading} className="w-12 h-12 bg-[#1068eb] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-[#0d56c4] disabled:bg-slate-200 transition-all active:scale-95">
                    <Send size={20} />
                  </button>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto flex flex-col items-center py-2">
                  {isRecording ? (
                    <div className="w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25" />
                          <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl relative z-10">
                            <Headset size={36} />
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{t.recording}</p>
                          <div className="flex items-end gap-1.5 mb-2">
                            <p className="text-3xl font-mono font-black text-slate-800 tracking-tighter">0:{voiceDuration.toString().padStart(2, '0')}</p>
                            <div className="flex gap-1 items-end h-6 pb-1">
                              <div className="waveform-bar" style={{ animationDelay: '0s' }} />
                              <div className="waveform-bar" style={{ animationDelay: '0.2s' }} />
                              <div className="waveform-bar" style={{ animationDelay: '0.4s' }} />
                              <div className="waveform-bar" style={{ animationDelay: '0.1s' }} />
                              <div className="waveform-bar" style={{ animationDelay: '0.3s' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {transcript && (
                        <div className="w-full max-w-md px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.preview}</p>
                          <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{transcript}"</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button
                          onClick={discardRecording}
                          className="bg-slate-100 text-slate-500 px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-slate-200 transition-all"
                        >
                          <X size={16} />
                          {t.discard}
                        </button>
                        <button
                          onClick={stopRecording}
                          className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 shadow-xl transition-all active:scale-95"
                        >
                          <Check size={16} />
                          {t.finishSend}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={startRecording} className="group flex flex-col items-center gap-4 py-4">
                      <div className="w-28 h-28 bg-blue-50 rounded-[3rem] flex items-center justify-center text-[#1068eb] border border-blue-100 shadow-sm group-hover:scale-110 group-active:scale-95 transition-all">
                        <div className="w-20 h-20 bg-[#1068eb] rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-200">
                          <Mic size={36} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">{t.tapToSpeak}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{t.privateSpace}</p>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'training' && (
          <TrainingPortal profile={therapistProfile} onUpdateProfile={(p) => { setTherapistProfile(p); saveTherapistProfile(p); }} />
        )}

        {view === 'history' && (
          <HistoryPortal
            textMessages={textMessages}
            voiceMessages={voiceMessages}
            mode={chatSubMode}
            onModeChange={setChatSubMode}
          />
        )}
      </main>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} onUpgrade={() => { const p = { ...userProfile, isPremium: true }; setUserProfile(p); saveUserProfile(p); setShowPremiumModal(false); }} />
    </div>
  );
};

export default App;
