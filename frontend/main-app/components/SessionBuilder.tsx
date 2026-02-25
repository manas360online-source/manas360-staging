
import React, { useState } from 'react';
import { Session, Question, Option, QuestionType } from '../types';
import { storageService } from '../utils/storageService';

interface SessionBuilderProps {
  initialSession?: Session;
  onSave: () => void;
  onCancel: () => void;
}

export const SessionBuilder: React.FC<SessionBuilderProps> = ({ initialSession, onSave, onCancel }) => {
  const [session, setSession] = useState<Session>(initialSession || {
    id: `session_${Date.now()}`,
    title: 'New Session',
    description: '',
    version: 1,
    questions: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const addQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: 'New Question',
      type: 'multiple-choice',
      options: [
        { id: `opt_${Date.now()}_1`, label: 'Option 1' },
        { id: `opt_${Date.now()}_2`, label: 'Option 2' }
      ]
    };
    setSession({ ...session, questions: [...session.questions, newQ] });
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updatedQs = [...session.questions];
    updatedQs[index] = { ...updatedQs[index], ...updates };
    setSession({ ...session, questions: updatedQs });
  };

  const deleteQuestion = (index: number) => {
    const updatedQs = [...session.questions];
    updatedQs.splice(index, 1);
    setSession({ ...session, questions: updatedQs });
  };

  const updateOption = (qIndex: number, oIndex: number, updates: Partial<Option>) => {
    const questions = [...session.questions];
    const options = [...(questions[qIndex].options || [])];
    options[oIndex] = { ...options[oIndex], ...updates };
    questions[qIndex] = { ...questions[qIndex], options };
    setSession({ ...session, questions });
  };

  const addOption = (qIndex: number) => {
    const questions = [...session.questions];
    const options = [...(questions[qIndex].options || [])];
    options.push({ id: `opt_${Date.now()}`, label: 'New Option' });
    questions[qIndex] = { ...questions[qIndex], options };
    setSession({ ...session, questions });
  };

  const deleteOption = (qIndex: number, oIndex: number) => {
    const questions = [...session.questions];
    const options = [...(questions[qIndex].options || [])];
    options.splice(oIndex, 1);
    questions[qIndex] = { ...questions[qIndex], options };
    setSession({ ...session, questions });
  };

  const handleSave = () => {
    storageService.saveSession({
      ...session,
      updatedAt: Date.now(),
      version: session.version + 1
    });
    onSave();
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#0F172A] p-8 animate-fade-in pb-32 transition-colors duration-500 relative">
       
       {/* Absolute Top Right Icon */}
       <div className="absolute top-6 right-6 select-none pointer-events-none drop-shadow-sm z-50">
         <span className="text-[28px] leading-none">🧿</span>
       </div>

       <div className="max-w-4xl mx-auto">
         <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#FDFCF8] dark:bg-[#0F172A] z-10 py-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
           <h1 className="font-serif text-2xl font-bold text-[#0A3A78] dark:text-white transition-colors">Session Builder</h1>
           <div className="flex gap-4">
             <button onClick={onCancel} className="px-6 py-2 rounded-full text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
             <button onClick={handleSave} className="px-6 py-2 rounded-full bg-[#1FA2DE] dark:bg-sky-600 text-white font-bold shadow-md hover:bg-[#0A4E89] dark:hover:bg-sky-500 transition-colors">Save Session</button>
           </div>
         </div>

         <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm mb-8 transition-colors">
           <div className="grid gap-6">
             <div>
               <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 transition-colors">Session Title</label>
               <input 
                 type="text" 
                 value={session.title} 
                 onChange={e => setSession({...session, title: e.target.value})}
                 className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl font-serif text-xl bg-transparent text-[#1A1A1A] dark:text-white focus:border-[#1FA2DE] dark:focus:border-sky-500 focus:outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600"
                 placeholder="Enter session title..."
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 transition-colors">Description</label>
               <textarea 
                 value={session.description} 
                 onChange={e => setSession({...session, description: e.target.value})}
                 className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-[#1A1A1A] dark:text-white focus:border-[#1FA2DE] dark:focus:border-sky-500 focus:outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600"
                 rows={2}
                 placeholder="Briefly describe what this session is about..."
               />
             </div>
           </div>
         </div>

         <div className="space-y-6">
           {session.questions.map((q, qIndex) => (
             <div key={q.id} className="bg-white dark:bg-[#1E293B] p-6 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm relative group transition-colors">
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => deleteQuestion(qIndex)} className="text-red-500 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Delete</button>
               </div>
               
               <div className="flex gap-4 items-start mb-4">
                 <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold px-3 py-1 rounded-lg transition-colors">Q{qIndex + 1}</span>
                 <div className="flex-1">
                   <input 
                     type="text" 
                     value={q.text} 
                     onChange={e => updateQuestion(qIndex, { text: e.target.value })}
                     className="w-full font-serif text-lg border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#1FA2DE] dark:focus:border-sky-500 focus:outline-none bg-transparent text-[#1A1A1A] dark:text-white transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600"
                     placeholder="Enter question text..."
                   />
                 </div>
                 <select 
                   value={q.type}
                   onChange={e => updateQuestion(qIndex, { type: e.target.value as QuestionType })}
                   className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-colors"
                 >
                   <option value="multiple-choice">Multiple Choice</option>
                   <option value="text">Text Input</option>
                   <option value="slider">Slider</option>
                   <option value="checkbox">Checkbox</option>
                 </select>
               </div>
               
               {/* Question Options Logic */}
               {(q.type === 'multiple-choice' || q.type === 'checkbox') && (
                 <div className="pl-12 space-y-3">
                   {q.options?.map((opt, oIndex) => (
                     <div key={opt.id} className="flex gap-3 items-center">
                       <span className="text-slate-300 dark:text-slate-600">{q.type === 'checkbox' ? '□' : '○'}</span>
                       <input 
                         type="text" 
                         value={opt.label}
                         onChange={e => updateOption(qIndex, oIndex, { label: e.target.value })}
                         className="flex-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent text-[#1A1A1A] dark:text-white focus:border-[#1FA2DE] dark:focus:border-sky-500 focus:outline-none transition-colors"
                         placeholder="Option label"
                       />
                       
                       {q.type === 'multiple-choice' && (
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-400 dark:text-slate-500">Go to:</span>
                           <select 
                             value={opt.nextQuestionId || ''}
                             onChange={e => updateOption(qIndex, oIndex, { nextQuestionId: e.target.value })}
                             className="text-xs p-1 border border-slate-200 dark:border-slate-700 rounded bg-transparent text-[#1A1A1A] dark:text-white focus:outline-none transition-colors max-w-[120px]"
                           >
                             <option value="">Next Question</option>
                             <option value="end">End Session</option>
                             {session.questions.map(targetQ => (
                               targetQ.id !== q.id && (
                                 <option key={targetQ.id} value={targetQ.id}>Q: {targetQ.text.substring(0, 20)}...</option>
                               )
                             ))}
                           </select>
                         </div>
                       )}

                       <button onClick={() => deleteOption(qIndex, oIndex)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">×</button>
                     </div>
                   ))}
                   <button onClick={() => addOption(qIndex)} className="text-sm text-[#1FA2DE] dark:text-sky-400 font-bold mt-2 hover:underline">+ Add Option</button>
                 </div>
               )}

               {q.type === 'slider' && (
                 <div className="pl-12 grid grid-cols-3 gap-4 text-sm">
                   <div>
                     <label className="text-slate-500 dark:text-slate-400 block mb-1">Min Label</label>
                     <input type="text" value={q.minLabel || ''} onChange={e => updateQuestion(qIndex, { minLabel: e.target.value })} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-transparent text-[#1A1A1A] dark:text-white focus:border-[#1FA2DE] dark:focus:border-sky-500 focus:outline-none" placeholder="e.g. Low" />
                   </div>
                   <div>
                     <label className="text-slate-500 dark:text-slate-400 block mb-1">Max Label</label>
                     <input type="text" value={q.maxLabel || ''} onChange={e => updateQuestion(qIndex, { maxLabel: e.target.value })} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-transparent text-[#1A1A1A] dark:text-white focus:border-[#1FA2DE] dark:focus:border-sky-500 focus:outline-none" placeholder="e.g. High" />
                   </div>
                 </div>
               )}

             </div>
           ))}
         </div>

         <button onClick={addQuestion} className="w-full py-4 rounded-[24px] border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all mt-8">
           + Add Question
         </button>
       </div>
    </div>
  );
};
