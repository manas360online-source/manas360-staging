import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const DeveloperApiResourcesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    window.location.hash = `#/${i18n.language}/home`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A1A1A] relative">
       
       {/* Simple Header */}
       <header className="w-full max-w-[1280px] mx-auto p-6 flex items-center justify-between">
          <button 
            onClick={handleBack} 
            className="text-[#0A3A78] font-bold text-lg flex items-center gap-2 hover:opacity-75 transition-opacity"
          >
             <span className="text-2xl">←</span> Back to Home
          </button>
          <div className="font-serif text-xl font-bold text-[#0A3A78] tracking-widest">MANAS360</div>
       </header>

       {/* Hero Section */}
       <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#0052CC] font-bold text-xs uppercase tracking-widest mb-6">
            For Developers
          </div>
          <h1 className="font-serif text-[2.8rem] md:text-[4rem] text-[#0A3A78] font-bold mb-6 leading-tight">
            Developer API Resources
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Integrate MANAS360 mental wellness services into your School or Corporate platform using our secure, scalable APIs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <button className="px-8 py-4 bg-[#0A3A78] text-white rounded-full font-bold shadow-lg hover:bg-[#082a5c] transition-all hover:-translate-y-1">
               View API Documentation
             </button>
             <button 
               onClick={() => document.getElementById('access-form')?.scrollIntoView({behavior: 'smooth'})} 
               className="px-8 py-4 bg-white border-2 border-[#0A3A78] text-[#0A3A78] rounded-full font-bold hover:bg-sky-50 transition-all"
             >
               Request API Access
             </button>
          </div>
       </section>

       {/* API Modules Grid */}
       <section className="py-20 px-6 bg-[#F0F9FF] border-y border-blue-50">
          <div className="max-w-[1200px] mx-auto">
             <h2 className="font-serif text-3xl font-bold text-[#0A3A78] mb-12 text-center">Available API Modules</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ApiCard 
                  icon="🔐"
                  title="Authentication API" 
                  desc="Secure login, token management, and SSO integration for your users." 
                  endpoint="POST /api/v1/auth/login" 
                />
                <ApiCard 
                  icon="👤"
                  title="Users & Profiles API" 
                  desc="Manage user accounts, preferences, and retrieve profile data securely." 
                  endpoint="GET /api/v1/users/{id}" 
                />
                <ApiCard 
                  icon="📅"
                  title="Appointments API" 
                  desc="Schedule, reschedule, and manage therapy sessions programmatically." 
                  endpoint="POST /api/v1/appointments" 
                />
                <ApiCard 
                  icon="📝"
                  title="Wellness Check-in API" 
                  desc="Submit daily mood data and retrieve wellness analysis results." 
                  endpoint="POST /api/v1/checkin" 
                />
                <ApiCard 
                  icon="📚"
                  title="Resources API" 
                  desc="Access our vast library of audio therapy, articles, and self-help tools." 
                  endpoint="GET /api/v1/resources" 
                />
                <ApiCard 
                  icon="📊"
                  title="Analytics API" 
                  desc="Get aggregated insights on organization health and engagement metrics." 
                  endpoint="GET /api/v1/analytics/report" 
                />
             </div>
          </div>
       </section>

       {/* How to Get Access */}
       <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
             <h2 className="font-serif text-3xl font-bold text-[#0A3A78] mb-16 text-center">How to Get Access</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>
                
                <Step 
                  number="1" 
                  title="Submit Request" 
                  desc="Fill out the form below with your organization details and use case." 
                />
                <Step 
                  number="2" 
                  title="Sandbox Credentials" 
                  desc="Receive test keys to integrate and test endpoints in our sandbox environment." 
                />
                <Step 
                  number="3" 
                  title="Production Access" 
                  desc="Go live with production keys after verification and final approval." 
                />
             </div>
          </div>
       </section>

       {/* Request Form */}
       <section id="access-form" className="py-24 px-6 bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-xl">
             <h2 className="font-serif text-3xl font-bold text-[#0A3A78] mb-8 text-center">Request API Access</h2>
             
             {formSubmitted ? (
                <div className="text-center py-10 animate-fade-in">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">✅</div>
                   <h3 className="text-2xl font-bold text-[#0A3A78] mb-2">Request Received!</h3>
                   <p className="text-slate-600 text-lg">Thank you for your interest. Our developer team will review your request and contact you shortly.</p>
                   <button 
                     onClick={() => setFormSubmitted(false)}
                     className="mt-8 text-[#0052CC] font-bold hover:underline"
                   >
                     Submit another request
                   </button>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1FA2DE] focus:ring-2 focus:ring-blue-100 transition-all" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                      <input required type="email" placeholder="john@company.com" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1FA2DE] focus:ring-2 focus:ring-blue-100 transition-all" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Organization Name</label>
                      <input required type="text" placeholder="School or Company Name" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1FA2DE] focus:ring-2 focus:ring-blue-100 transition-all" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Intended Use Case</label>
                      <textarea required rows={4} placeholder="Briefly describe how you plan to use the API..." className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1FA2DE] focus:ring-2 focus:ring-blue-100 transition-all resize-none"></textarea>
                   </div>
                   <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#0052CC] to-[#2684FF] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg">
                     Submit Request
                   </button>
                </form>
             )}
          </div>
       </section>

       {/* Simple Footer */}
       <footer className="py-12 text-center text-slate-400 text-sm bg-white border-t border-slate-100">
          <p>© 2024 Manas360 Wellness. Developer Resources.</p>
       </footer>
    </div>
  );
};

const ApiCard = ({ icon, title, desc, endpoint }: { icon: string, title: string, desc: string, endpoint: string }) => (
  <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
     <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</div>
     <h3 className="text-xl font-bold text-[#0A3A78] mb-3">{title}</h3>
     <p className="text-slate-500 mb-6 leading-relaxed text-sm h-10">{desc}</p>
     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:border-blue-100 transition-colors">
        <code className="text-xs text-slate-600 font-mono break-all">{endpoint}</code>
     </div>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center bg-white md:bg-transparent p-6 rounded-2xl md:p-0">
     <div className="w-16 h-16 rounded-full bg-white border-4 border-[#E0F2FE] text-[#0052CC] font-bold text-2xl flex items-center justify-center mb-6 shadow-sm z-10">
       {number}
     </div>
     <h3 className="text-xl font-bold text-[#0A3A78] mb-3">{title}</h3>
     <p className="text-slate-600 leading-relaxed max-w-xs">{desc}</p>
  </div>
);