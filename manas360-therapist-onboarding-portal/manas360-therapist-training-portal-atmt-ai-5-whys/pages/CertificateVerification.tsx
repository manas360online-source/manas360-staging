
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Calendar, 
  Award, 
  CheckCircle, 
  ExternalLink, 
  ArrowLeft,
  FileText,
  BadgeCheck,
  Globe,
  Share2
} from 'lucide-react';

const CertificateVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API verification call to the global registry
    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 1200);
    return () => clearTimeout(timer);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-100 rounded-[2rem]"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-[2rem] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="w-8 h-8 text-emerald-600/30" />
            </div>
          </div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Querying Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-[10px] font-black text-stone-300 hover:text-emerald-600 transition-all mb-10 uppercase tracking-[0.3em] group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Platform
        </Link>

        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-white relative">
          <div className="bg-slate-900 p-16 text-center text-white relative">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
            <div className="w-24 h-24 bg-emerald-600/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
              <BadgeCheck className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4 tracking-tight">Credential Verified</h1>
            <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest bg-emerald-400/10 px-6 py-2 rounded-full inline-block border border-emerald-400/20">
              ID: {token?.toUpperCase().slice(0, 16)}
            </p>
          </div>
          
          <div className="p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="flex items-start space-x-5">
                 <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100">
                   <User className="w-6 h-6 text-slate-400" />
                 </div>
                 <div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Practitioner</span>
                   <span className="text-xl font-bold text-slate-800">Alex Johnson</span>
                 </div>
               </div>

               <div className="flex items-start space-x-5">
                 <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100">
                   <Award className="w-6 h-6 text-slate-400" />
                 </div>
                 <div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Certification Track</span>
                   <span className="text-xl font-bold text-slate-800 font-serif">Master NLP Framework</span>
                 </div>
               </div>

               <div className="flex items-start space-x-5">
                 <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100">
                   <Calendar className="w-6 h-6 text-slate-400" />
                 </div>
                 <div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Authorization Date</span>
                   <span className="text-xl font-bold text-slate-800">Jan 24, 2025</span>
                 </div>
               </div>

               <div className="flex items-start space-x-5">
                 <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100">
                   <Globe className="w-6 h-6 text-slate-400" />
                 </div>
                 <div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Registry Status</span>
                   <span className="text-xl font-bold text-emerald-600 flex items-center">
                     Active <CheckCircle className="w-4 h-4 ml-2" />
                   </span>
                 </div>
               </div>
            </div>

            <div className="pt-10 border-t border-stone-100">
              <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 mb-10 text-center">
                <p className="text-sm font-bold text-emerald-800 leading-relaxed max-w-lg mx-auto">
                  "This credential confirms that the practitioner has successfully completed the rigorous clinical assessments required by the NLP Orientation Institute."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center shadow-2xl shadow-slate-200">
                  Registry Profile <ExternalLink className="ml-3 w-4 h-4" />
                </button>
                <button className="w-full py-5 bg-white text-slate-700 border-2 border-stone-100 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-stone-50 transition-all flex items-center justify-center group">
                  <FileText className="w-4 h-4 mr-3 text-stone-300 group-hover:text-slate-900 transition-colors" /> Official Copy
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-stone-50 py-6 px-16 border-t border-stone-100 flex justify-between items-center">
             <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.2em]">Verified Registry v4.2.0</span>
             </div>
             <button className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:underline flex items-center">
                Report Discrepancy <Share2 className="w-3 h-3 ml-2" />
             </button>
          </div>
        </div>
        
        <div className="mt-16 text-center space-y-4">
           <p className="text-stone-300 font-black text-[10px] uppercase tracking-[0.5em]">Global Standards in Neuro-Linguistic Programming</p>
           <div className="flex justify-center space-x-12 opacity-30 grayscale pointer-events-none">
              <span className="font-serif text-xl font-bold">Standard Certification</span>
              <span className="font-serif text-xl font-bold">NLP GLOBAL Registry</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
