
import React from 'react';
import {
    X,
    Award,
    QrCode,
    Printer,
    Linkedin,
    Share2
} from 'lucide-react';
import { Certificate } from './NLPTypes';

interface CertificateModalProps {
    cert: Certificate;
    onClose: () => void;
}

const NLPCertificateModal: React.FC<CertificateModalProps> = ({ cert, onClose }) => {
    const shareOnLinkedIn = () => {
        // Since we don't have a real route, we'll just share the main domain or a dummy
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500 no-print">
            <div className="max-w-4xl w-full bg-white rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
                <button onClick={onClose} className="absolute top-8 right-8 z-10 w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white transition-all shadow-lg">
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="overflow-y-auto p-12 md:p-20 custom-scrollbar">
                    <div id="certificate-print-area" className="relative border-[16px] border-blue-50 p-16 rounded-[3.5rem] text-center shadow-inner overflow-hidden bg-white">
                        <div className="mb-12 relative">
                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl bg-[#0066FF] shadow-blue-200`}>
                                <Award className="text-white w-12 h-12" />
                            </div>
                            <h1 className="font-serif text-5xl font-bold text-slate-900 mb-2">Completion Record</h1>
                            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Registry Gateway Phase</p>
                        </div>

                        <div className="my-16">
                            <h2 className="text-6xl font-serif font-bold text-slate-800 mb-8">{cert.studentName}</h2>
                            <p className="text-slate-500 font-medium italic mb-8">has verified foundational mastery in</p>
                            <h3 className={`text-4xl font-bold font-serif uppercase tracking-tight text-blue-700`}>{cert.moduleTitle}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-16 mt-20 text-center border-t border-stone-50 pt-16">
                            <div>
                                <div className="font-serif text-2xl text-slate-800 italic border-b-2 border-stone-100 pb-2 mb-2">Institutional Lead</div>
                                <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Registry Oversight</p>
                            </div>
                            <div>
                                <div className="font-mono text-xl text-slate-800 border-b-2 border-stone-100 pb-2 mb-2 uppercase">{cert.issueDate}</div>
                                <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Indexing Date</p>
                            </div>
                        </div>

                        <div className="mt-20 flex flex-col items-center">
                            <div className="w-24 h-24 p-3 border-2 border-stone-100 rounded-[2rem] bg-slate-50 mb-4">
                                <QrCode className="w-full h-full text-[#0066FF]" />
                            </div>
                            <p className="text-[9px] font-bold text-[#0066FF] font-mono tracking-tighter">VERIFICATION ID: {cert.id}</p>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <button onClick={handlePrint} className="bg-slate-900 text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center shadow-2xl">
                            <Printer className="w-5 h-5 mr-3" /> Save to PDF
                        </button>
                        <button onClick={shareOnLinkedIn} className="bg-[#0077B5] text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#00669c] transition-all flex items-center justify-center shadow-2xl">
                            <Linkedin className="w-5 h-5 mr-3 fill-current" /> LinkedIn
                        </button>
                        <button className="bg-white text-slate-700 border-2 border-stone-100 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-stone-50 transition-all flex items-center justify-center">
                            <Share2 className="w-5 h-5 mr-3" /> Share Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NLPCertificateModal;
