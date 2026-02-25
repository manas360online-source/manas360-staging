
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  PlayCircle, 
  Star,
  Users,
  Globe,
  BadgeCheck,
  ArrowRight,
  Heart,
  Timer
} from 'lucide-react';
import { UserProgress, NLPModule } from '../types';
import { NLP_MODULES } from '../constants';

interface LandingPageProps {
  progress: UserProgress;
  onEnroll: (code: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ progress }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [location]);

  const handleModuleClick = (module: NLPModule) => {
    navigate(`/module/${module.code}`);
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const orientationModule = NLP_MODULES[0];

  return (
    <div className="pb-32 bg-[#F1F7FE]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-[#0066FF] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Star className="w-3 h-3 fill-[#0066FF]" /> 
             <span>Authorized Certification Platform</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-800 mb-8 tracking-tight leading-tight">
            Professional <br/> 
            <span className="text-[#0066FF] italic">Registry Access.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Begin your journey into clinical empathy. The authorized track for practitioners globally.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8">
            <button 
              onClick={() => handleModuleClick(orientationModule)}
              className="bg-[#0066FF] text-white px-10 py-6 rounded-full font-bold shadow-2xl shadow-blue-200/50 hover:bg-[#0052cc] transition-all flex items-center text-lg group"
            >
              Start Track <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Focus Entry */}
      <section className="max-w-4xl mx-auto px-6 mb-48">
        <div 
          onClick={() => handleModuleClick(orientationModule)}
          className={`group relative p-16 rounded-[4rem] border-2 transition-all cursor-pointer overflow-hidden flex flex-col bg-white border-white shadow-2xl shadow-slate-200/30 hover:shadow-blue-100 hover:-translate-y-2`}
        >
          <div className="absolute top-0 right-0 bg-[#0066FF] text-white px-8 py-3 rounded-bl-3xl text-[10px] font-black uppercase tracking-[0.2em] z-10">
            Entry Point
          </div>
          
          <div className="flex items-start justify-between mb-12">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all group-hover:rotate-6 duration-500 bg-[#0066FF] text-white shadow-lg shadow-blue-100`}>
              <PlayCircle className="w-10 h-10" />
            </div>
            <div className="text-right">
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0066FF] block mb-2">{orientationModule.code}</span>
              <span className="text-slate-400 font-bold">Standard Access</span>
            </div>
          </div>

          <h3 className="text-4xl font-serif font-bold text-slate-800 mb-6 leading-tight">{orientationModule.title}</h3>
          <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">{orientationModule.description}</p>
          
          <div className="pt-8 border-t border-stone-50 flex items-center justify-between">
             <span className="text-[12px] font-black text-[#0066FF] uppercase tracking-widest">
                Start Foundational Path
             </span>
             <div className="flex items-center text-slate-400">
               <Timer className="w-5 h-5 mr-2" />
               <span className="font-bold">~45 Minutes</span>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { label: 'Verified Graduates', val: '5,500+', icon: Users },
            { label: 'Global Registry', val: 'Active', icon: Globe },
            { label: 'Foundational Depth', val: 'Clinical', icon: Heart }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-12 rounded-[3rem] border border-stone-100 text-center shadow-sm hover:shadow-xl transition-all group">
              <stat.icon className="w-10 h-10 mx-auto mb-6 text-[#0066FF] group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-serif font-bold text-slate-800 mb-2">{stat.val}</div>
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Practitioner Registry Search */}
      <section className="max-w-4xl mx-auto px-6 mb-48">
        <div className="bg-white rounded-[4.5rem] p-16 md:p-24 border border-stone-100 shadow-2xl relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 w-full h-2 bg-[#0066FF]"></div>
           <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
             <BadgeCheck className="w-10 h-10 text-[#0066FF]" />
           </div>
           <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Verified Graduate Search</h2>
           <p className="text-slate-400 text-lg mb-12 font-medium">Verify completion of the mandatory track here.</p>
           
           <div className="relative max-w-xl mx-auto group">
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-40 py-8 bg-stone-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-full font-bold text-slate-800 outline-none transition-all"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Verify
              </button>
           </div>
           
           {searchQuery === progress.studentName && !isSearching && (
             <div className="mt-12 bg-blue-50 p-8 rounded-[3rem] border border-blue-100 flex items-center text-left animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 overflow-hidden mr-6 shadow-sm">
                   <img src={progress.profileImage} alt="Result" />
                </div>
                <div>
                   <h4 className="font-bold text-blue-900 text-lg">{progress.studentName}</h4>
                   <p className="text-blue-700 text-sm font-semibold">Credential Phase • Index {progress.userId}</p>
                </div>
                <div className="ml-auto">
                   <Link to={`/verify/${progress.userId}`} className="flex items-center text-[#0066FF] font-black text-[10px] uppercase tracking-widest hover:underline">
                      View Profile <ArrowRight className="w-4 h-4 ml-2" />
                   </Link>
                </div>
             </div>
           )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
