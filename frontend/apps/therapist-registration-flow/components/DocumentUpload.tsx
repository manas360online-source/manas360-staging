
import React, { useRef } from 'react';
import { UploadedFiles } from '../types';
import { FileText, Award, Camera, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  files: UploadedFiles;
  setFiles: React.Dispatch<React.SetStateAction<UploadedFiles>>;
  onNext: () => void;
  onBack: () => void;
}

const DocumentUpload: React.FC<Props> = ({ files, setFiles, onNext, onBack }) => {
  const degreeInput = useRef<HTMLInputElement>(null);
  const rciInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  const handleFileChange = (key: keyof UploadedFiles, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-12">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-[#1D75FF] transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-[#1D3A63]">Credential Upload</h1>
            <p className="text-slate-400 mt-1 font-medium">Please provide clear copies of your documents to begin verification.</p>
          </div>
        </div>
        <div className="hidden lg:flex gap-2">
          <div className="bg-[#EDF5FF] text-[#1D75FF] px-4 py-2 rounded-full text-xs font-bold border border-[#D0E4FF]">VERIFICATION PHASE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Degree Certificate */}
        <div className="bg-[#EDF5FF]/50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-8 border border-[#D0E4FF]/30 flex flex-col items-center text-center group">
          <div className={`p-6 rounded-3xl mb-6 transition-colors ${files.degree ? 'bg-blue-100' : 'bg-white shadow-sm'}`}>
            <FileText size={48} className={files.degree ? 'text-[#1D75FF]' : 'text-slate-300'} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Degree Certificate</h3>
          <p className="text-slate-400 text-sm mb-8">Bachelor's, Master's or PhD degree.</p>

          <input type="file" ref={degreeInput} className="hidden" onChange={(e) => handleFileChange('degree', e)} accept=".pdf,.jpg,.jpeg,.png" />

          <button
            onClick={() => degreeInput.current?.click()}
            className={`w-full py-4 rounded-2xl font-bold transition-all border ${files.degree ? 'bg-blue-50 text-[#1D75FF] border-blue-100' : 'bg-white border-slate-200 text-slate-600 hover:border-[#1D75FF]'
              }`}
          >
            {files.degree ? 'Update File' : 'Upload PDF/JPG'}
          </button>
          {files.degree && <p className="mt-3 text-[10px] font-bold text-[#1D75FF] uppercase truncate w-full px-4">{files.degree.name}</p>}
        </div>

        {/* RCI Registration */}
        <div className="bg-[#EDF5FF]/50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-8 border border-[#D0E4FF]/30 flex flex-col items-center text-center group">
          <div className={`p-6 rounded-3xl mb-6 transition-colors ${files.rci ? 'bg-blue-100' : 'bg-white shadow-sm'}`}>
            <Award size={48} className={files.rci ? 'text-[#1D75FF]' : 'text-slate-300'} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">RCI/NMC Reg.</h3>
          <p className="text-slate-400 text-sm mb-8">Valid Council registration certificate.</p>

          <input type="file" ref={rciInput} className="hidden" onChange={(e) => handleFileChange('rci', e)} accept=".pdf,.jpg,.jpeg,.png" />

          <button
            onClick={() => rciInput.current?.click()}
            className={`w-full py-4 rounded-2xl font-bold transition-all border ${files.rci ? 'bg-blue-50 text-[#1D75FF] border-blue-100' : 'bg-white border-slate-200 text-slate-600 hover:border-[#1D75FF]'
              }`}
          >
            {files.rci ? 'Update File' : 'Upload PDF/JPG'}
          </button>
          {files.rci && <p className="mt-3 text-[10px] font-bold text-[#1D75FF] uppercase truncate w-full px-4">{files.rci.name}</p>}
        </div>

        {/* Photo */}
        <div className="bg-[#EDF5FF]/50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-8 border border-[#D0E4FF]/30 flex flex-col items-center text-center group">
          <div className={`p-6 rounded-3xl mb-6 transition-colors ${files.photo ? 'bg-blue-100' : 'bg-white shadow-sm'}`}>
            <Camera size={48} className={files.photo ? 'text-[#1D75FF]' : 'text-slate-300'} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Profile Photo</h3>
          <p className="text-slate-400 text-sm mb-8">Professional headshot for your profile.</p>

          <input type="file" ref={photoInput} className="hidden" onChange={(e) => handleFileChange('photo', e)} accept="image/*" />

          <button
            onClick={() => photoInput.current?.click()}
            className={`w-full py-4 rounded-2xl font-bold transition-all border ${files.photo ? 'bg-blue-50 text-[#1D75FF] border-blue-100' : 'bg-white border-slate-200 text-slate-600 hover:border-[#1D75FF]'
              }`}
          >
            {files.photo ? 'Change Photo' : 'Upload Image'}
          </button>
          {files.photo && <p className="mt-3 text-[10px] font-bold text-[#1D75FF] uppercase truncate w-full px-4">{files.photo.name}</p>}
        </div>
      </div>

      <div className="pt-10 border-t border-[#D0E4FF]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-[#1D75FF] font-bold bg-[#EDF5FF] px-6 py-3 rounded-2xl">
          <CheckCircle2 size={20} />
          <span>HIPAA-compliant secure storage enabled.</span>
        </div>
        <button
          onClick={onNext}
          disabled={!files.degree || !files.rci || !files.photo}
          className={`px-16 font-black py-5 rounded-full transition-all shadow-xl text-lg uppercase tracking-wider ${files.degree && files.rci && files.photo
            ? 'bg-[#1D75FF] hover:bg-[#1D75FF]/90 text-white shadow-blue-500/20 active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
          Submit for Final Verification →
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;
