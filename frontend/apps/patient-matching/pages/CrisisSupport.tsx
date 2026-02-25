import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Phone, ArrowLeft } from 'lucide-react';

export const CrisisSupport: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-md w-full border-2 border-red-100">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone size={32} />
                </div>
                <h1 className="font-serif text-3xl font-bold text-slate-800 mb-4">Immediate Help</h1>
                <p className="text-slate-600 mb-8">
                    Our crisis team is available 24/7. <br/> Please call the number below immediately.
                </p>
                <a href="tel:108" className="block w-full bg-red-600 text-white font-bold py-4 rounded-xl text-xl mb-4 hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                    Call 108
                </a>
                 <Button fullWidth variant="outline" onClick={() => navigate('/select-psychiatrist')}>
                    Schedule Psychiatrist Instead
                 </Button>
            </div>
        </div>
    );
};