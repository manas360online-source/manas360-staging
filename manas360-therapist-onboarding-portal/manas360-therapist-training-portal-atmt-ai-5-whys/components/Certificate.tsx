import React, { useRef, useState } from 'react';
import { User } from '../types';
import { Download, Share2, Loader2, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = ({ user }: { user: User }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#0B1C2D' // Match primary background
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`MANS360_Certificate_${user.id}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to download PDF. Please try again or use the browser print option.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 print:py-0">
      
      {/* Certificate Container */}
      <div 
        ref={certificateRef}
        className="relative w-full max-w-5xl aspect-video bg-[#0B1C2D] overflow-hidden shadow-2xl print:shadow-none print:w-full print:h-screen text-white"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #102A43 0%, #0B1C2D 100%)'
        }}
      >
        {/* --- DECORATIVE ELEMENTS --- */}
        
        {/* Top-Left Corner Curve (Gold) */}
        <div className="absolute top-0 left-0 w-[40%] h-[40%] pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
             <path d="M0 0 L100 0 C 60 40 20 20 0 100 Z" fill="#D4AF37" />
             <path d="M0 0 L90 0 C 50 35 15 15 0 90 Z" fill="#B8962E" opacity="0.5" />
           </svg>
        </div>

        {/* Top-Right Curve (Blue accent) */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0 0 L100 0 L100 100 C 60 60 80 20 0 0 Z" fill="#0B1C2D" />
              <path d="M20 0 L100 0 L100 80 C 70 50 50 20 20 0 Z" fill="#4F6D8A" opacity="0.3" />
           </svg>
        </div>

        {/* Bottom-Right Complex Wave (Blue & Gold) */}
        <div className="absolute bottom-0 right-0 w-[60%] h-[60%] pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
             {/* Deep Blue Wave */}
             <path d="M0 100 L100 100 L100 0 C 60 50 40 80 0 100" fill="#4F6D8A" opacity="0.2" />
             {/* Soft Steel Blue Wave */}
             <path d="M20 100 L100 100 L100 20 C 70 60 50 90 20 100" fill="#6B8BA4" opacity="0.2" />
             {/* Thin Gold Line Accent */}
             <path d="M0 100 C 50 80 80 40 100 0" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.5" />
           </svg>
        </div>

        {/* Bottom-Left Decoration (Gold Accent) */}
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0 100 L60 100 C 30 70 10 40 0 0 Z" fill="#D4AF37" opacity="0.8" />
              <path d="M0 100 L40 100 C 20 80 5 50 0 20 Z" fill="#F1D88A" opacity="1" />
           </svg>
        </div>

        {/* --- GOLD SEAL (RIGHT SIDE) --- */}
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-20">
           <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Ribbon Tails */}
              <div className="absolute -bottom-10 w-full flex justify-center space-x-8">
                 <div className="w-12 h-20 bg-[#D4AF37] transform -rotate-12 origin-top" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)'}}></div>
                 <div className="w-12 h-20 bg-[#B8962E] transform rotate-12 origin-top" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)'}}></div>
              </div>
              
              {/* Outer Starburst */}
              <div className="w-full h-full bg-gradient-to-br from-[#F1D88A] via-[#D4AF37] to-[#B8962E] rounded-full flex items-center justify-center shadow-lg"
                   style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}>
              </div>
              
              {/* Inner Circle */}
              <div className="absolute w-[70%] h-[70%] bg-gradient-to-tl from-[#D4AF37] to-[#F1D88A] rounded-full flex items-center justify-center shadow-inner border border-[#B8962E]">
                 <div className="w-[90%] h-[90%] border border-[#B8962E] rounded-full flex items-center justify-center">
                    <div className="w-[90%] h-[90%] bg-gradient-to-br from-[#B8962E] to-[#D4AF37] rounded-full flex items-center justify-center">
                        <div className="text-center">
                           <div className="text-[#0B1C2D] font-bold text-[8px] uppercase tracking-wider">Official</div>
                           <div className="text-[#0B1C2D] font-bold text-2xl">SEAL</div>
                           <div className="text-[#0B1C2D] font-bold text-[8px] uppercase tracking-wider">Verified</div>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- QR CODE (TOP RIGHT) --- */}
        <div className="absolute top-8 right-8 z-30 bg-white p-1 rounded shadow-md">
           <QrCode className="w-12 h-12 text-[#0B1C2D]" />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 w-full h-full flex flex-col items-center pt-16 px-20">
           
           {/* Title */}
           <div className="text-center mb-10">
              <h1 className="font-serif text-[#D4AF37] text-5xl font-bold tracking-widest uppercase mb-2 drop-shadow-sm">
                 Certificate
              </h1>
              <h2 className="font-serif text-[#D4AF37] text-2xl tracking-[0.3em] uppercase">
                 Of Completion
              </h2>
           </div>

           {/* Intro */}
           <p className="text-[#E6ECF2] font-sans text-lg tracking-wide mb-4">
              This is to certify that
           </p>

           {/* Name */}
           <div className="relative mb-6">
              <h3 className="font-script text-white text-7xl px-8 py-2 relative z-10 drop-shadow-md">
                 {user.name}
              </h3>
              {/* Subtle underline */}
              <div className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60"></div>
           </div>

           {/* Description Body */}
           <div className="text-center max-w-2xl">
              <p className="text-[#E6ECF2] text-lg font-light leading-relaxed">
                 has successfully completed the course and awarded by<br/>
                 <span className="font-semibold text-white">Manas360 Mental Wellness Pvt. Ltd.</span>, as
              </p>
           </div>

           {/* Certification Title */}
           <div className="mt-8 mb-auto">
              <h4 className="text-[#D4AF37] text-xl font-serif font-bold tracking-[0.15em] uppercase border-y border-[#D4AF37] border-opacity-30 py-2 px-10">
                 MANAS360 Certified Therapist
              </h4>
           </div>

           {/* Footer */}
           <div className="w-full flex justify-between items-end pb-12 px-8">
              {/* Left: ID */}
              <div className="text-left">
                 <p className="text-[#D4AF37] font-sans text-sm font-bold mb-1">Certification ID :</p>
                 <p className="text-[#C9D6E2] font-mono text-sm tracking-wider">{user.certificateId || 'PENDING'}</p>
              </div>

              {/* Right: Signature */}
              <div className="text-center pr-20">
                 {/* Simulated Signature */}
                 <div className="font-script text-4xl text-[#E6ECF2] mb-1 transform -rotate-6 ml-4">
                    Howard Ong
                 </div>
                 <div className="border-t border-[#D4AF37] border-opacity-50 pt-2 w-64">
                    <p className="text-[#E6ECF2] font-serif font-bold tracking-wide uppercase text-sm">Howard Ong</p>
                    <p className="text-[#C9D6E2] text-xs font-sans mt-0.5">Chair, Clinical Advisory Board</p>
                 </div>
              </div>
           </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 print:hidden">
        <button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="flex items-center px-8 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-[#0B1C2D] font-bold rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isDownloading ? 'Generating...' : 'Download Certificate'}
        </button>
        <button className="flex items-center px-8 py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded-full hover:bg-[#D4AF37] hover:text-[#0B1C2D] transition-colors">
          <Share2 className="w-5 h-5 mr-2" /> Share
        </button>
      </div>

    </div>
  );
};

export default Certificate;