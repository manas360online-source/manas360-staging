import React, { useState, useEffect } from 'react';
import { FolderOpen, Copy, ClipboardPaste, ArrowRight, Clock, ClipboardList, Zap } from 'lucide-react';

const SessionNotesTraining = () => {
  const [step, setStep] = useState(0);
  const [clipboard, setClipboard] = useState('');
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [timeSaved, setTimeSaved] = useState(0);
  const [timer, setTimer] = useState(0); // in seconds
  const [timerActive, setTimerActive] = useState(false);

  const prevSessionData = {
    symptoms: "Patient reports persistent insomnia and racing thoughts at night. Anxiety scale 7/10.",
    medication: "Sertraline 50mg OD - Compliance Good.",
    homework: "Practice PMR twice daily.",
    plan: "Continue CBT for anxiety. Review sleep hygiene next week."
  };

  const quickPhrases = [
    "Patient alert and oriented x3.",
    "Denies suicidal/homicidal ideation.",
    "Affect is congruent with mood.",
    "Progress noted in coping skills."
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleCopy = (text: string) => {
    setClipboard(text);
    setClipboardHistory(prev => [text, ...prev].slice(0, 3)); // Keep last 3
    if (step === 1) setStep(2);
  };

  const handlePaste = () => {
    setCurrentNote(prev => prev + (prev ? '\n\n' : '') + clipboard);
    setTimeSaved(prev => prev + 4); // Simulate minutes saved
    setClipboard('');
    if (step === 2) {
      setStep(3);
      setTimerActive(false);
    }
  };

  const insertQuickPhrase = (phrase: string) => {
    setCurrentNote(prev => prev + (prev ? ' ' : '') + phrase);
  };

  const startSession = () => {
    setStep(1);
    setTimerActive(true);
  };

  const reset = () => {
    setStep(0);
    setClipboard('');
    setCurrentNote('');
    setTimeSaved(0);
    setTimer(0);
    setTimerActive(false);
    setClipboardHistory([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-inner flex flex-col h-[550px]">
      {/* Simulation Header */}
      <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase text-gray-500">Practice Mode</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Session #5</span>
        </div>
        <div className="flex items-center space-x-4">
           <div className={`font-mono text-sm font-bold flex items-center ${timerActive ? 'text-red-600 animate-pulse' : 'text-gray-500'}`}>
             <Clock className="w-4 h-4 mr-1" /> {formatTime(timer)}
           </div>
           <div className="flex items-center text-green-700 font-bold text-sm">
             <Zap className="w-4 h-4 mr-1" />
             Saved: {timeSaved}m
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
        {/* Left: Previous Session (Width 5) */}
        <div className="md:col-span-5 p-4 border-r border-gray-200 bg-gray-50 overflow-y-auto relative">
          <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center justify-between">
            <span>Previous Session (#4)</span>
            {step === 0 && (
              <button 
                onClick={startSession}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded flex items-center animate-pulse"
              >
                <FolderOpen className="w-3 h-3 mr-1" /> Load History
              </button>
            )}
          </h4>

          {step > 0 ? (
            <div className="space-y-4 transition-opacity duration-500 opacity-100">
              {Object.entries(prevSessionData).map(([key, val]) => (
                <div key={key} className="group relative bg-white p-3 rounded border border-gray-200 shadow-sm hover:border-indigo-300 transition-all">
                  <p className="text-xs text-gray-400 uppercase mb-1">{key}</p>
                  <p className="text-sm text-gray-800">{val}</p>
                  <button 
                    onClick={() => handleCopy(val)}
                    className="absolute top-2 right-2 p-1 bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy to Clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <FolderOpen className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">History not loaded</p>
             </div>
          )}
        </div>

        {/* Right: Current Session (Width 7) */}
        <div className="md:col-span-7 p-4 bg-white flex flex-col relative overflow-hidden">
          <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span>Current Session (#5)</span>
            {step === 2 && clipboard && (
              <button 
                onClick={handlePaste}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded flex items-center animate-bounce"
              >
                <ClipboardPaste className="w-3 h-3 mr-1" /> Paste Content
              </button>
            )}
          </h4>

          {/* Quick Insert Bar */}
          <div className="flex gap-2 mb-2 overflow-x-auto py-1">
             {quickPhrases.map((phrase, idx) => (
               <button 
                 key={idx}
                 onClick={() => insertQuickPhrase(phrase)}
                 className="flex-shrink-0 text-[10px] bg-gray-100 hover:bg-indigo-50 border border-gray-200 px-2 py-1 rounded text-gray-600 transition-colors"
               >
                 + {phrase.substring(0, 15)}...
               </button>
             ))}
          </div>

          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Notes appear here..."
            className="flex-1 w-full p-3 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 text-sm mb-4"
          />

          {/* Clipboard History & Success */}
          <div className="h-24 border-t border-gray-100 pt-2">
            {step === 3 ? (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-start h-full overflow-hidden">
                 <div className="bg-green-100 rounded-full p-1 mr-3 text-green-600">
                   <ArrowRight className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-green-800">Excellent!</p>
                   <p className="text-xs text-green-700">Finished in {timer}s! You saved ~4 minutes using reuse. Real notes take ~7 mins vs 20 mins manually.</p>
                   <button onClick={reset} className="text-xs underline text-green-800 mt-1">Try Again</button>
                 </div>
              </div>
            ) : (
              <div className="h-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center">
                  <ClipboardList className="w-3 h-3 mr-1" /> Clipboard History
                </p>
                <div className="space-y-1 overflow-y-auto max-h-16">
                  {clipboardHistory.length === 0 && <p className="text-xs text-gray-300 italic">Empty</p>}
                  {clipboardHistory.map((txt, i) => (
                    <div key={i} className="text-xs text-gray-500 truncate bg-gray-50 px-2 py-1 rounded">
                      {txt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Instructions Footer */}
      <div className="bg-gray-800 text-white p-2 text-xs flex justify-between items-center flex-shrink-0">
        <span>Step {step + 1} of 4: {
          step === 0 ? "Click 'Load History' to view previous session data." :
          step === 1 ? "Click Copy on any card. Try adding a Quick Phrase too!" :
          step === 2 ? "Click 'Paste Content' on the right." :
          "Review your note. Done!"
        }</span>
      </div>
    </div>
  );
};

export default SessionNotesTraining;