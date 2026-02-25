import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, Activity, ShieldCheck, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f0f6ff] to-white">
      {/* Header */}
      <header className="px-6 py-6 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <button
          onClick={() => window.location.hash = '#/results'}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1d74f5] transition-colors group px-3 py-2 rounded-xl hover:bg-blue-50"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-serif font-bold text-lg">Back</span>
        </button>

        <div className="flex gap-4">
          <button onClick={() => navigate('/psychologist')} className="text-sm md:text-base font-bold text-slate-600 hover:text-[#1d74f5] px-4 py-2 rounded-xl hover:bg-blue-50 transition-all">
            Provider Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 md:py-20 max-w-5xl mx-auto w-full">

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Foundation Therapy meets <br className="hidden md:block" />
          <span className="text-[#1d74f5]">Advanced Clinical Care</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl leading-relaxed font-light">
          The gap-bridging platform where <span className="font-semibold text-slate-800">Psychologists</span> build the foundation and <span className="font-semibold text-slate-800">Psychiatrists</span> handle the complexity.
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full justify-center max-w-lg md:max-w-none">
          <Button onClick={() => navigate('/assessment/start')} className="text-lg px-10 py-4 shadow-xl shadow-blue-300/50 transition-all hover:scale-105 hover:-translate-y-1">
            Get Started
          </Button>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24 text-left w-full">
          {/* Card 1 */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-5 md:mb-6">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl mb-3 text-slate-800">Psychologists</h3>
            <p className="text-slate-500 text-base leading-relaxed">The "Foundation Builders". First responders and gateway to care. Earn competitive income plus referral bonuses.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-2 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-5 md:mb-6">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <h3 className="font-serif font-bold text-xl md:text-2xl mb-3 text-slate-800">Psychiatrists</h3>
              <p className="text-slate-500 text-base leading-relaxed">The "Advanced Specialists". Handling complex cases and medication management. No time wasted on basic intake.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-5 md:mb-6">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl mb-3 text-slate-800">Patients</h3>
            <p className="text-slate-500 text-base leading-relaxed">Get the best of both worlds. Seamless transition between therapy and medical care without repeating your story.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm md:text-base">
        <p>Aham Brahmasmi 🕉️ 💚</p>
      </footer>
    </div>
  );
};