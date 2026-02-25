import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Calendar, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DoctorSelectionProps {
    role: 'Psychologist' | 'Psychiatrist';
}

export const DoctorSelection: React.FC<DoctorSelectionProps> = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { currentUserId, patients, confirmBooking } = useApp();
    const [view, setView] = useState<'card' | 'booking'>('card');

    // Date & Time State
    const [selectedFullDate, setSelectedFullDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isManualTime, setIsManualTime] = useState(false);

    // Confirmation State
    const [confirmName] = useState(patients.find(p => p.id === currentUserId)?.name || 'Guest');
    const [confirmPhone] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Doctor Data Configuration
    const doctor = role === 'Psychologist' ? {
        name: 'Dr. Sanky',
        role: 'Psychologist',
        focus: 'Foundation Therapy, CBT Skills, Weekly Support',
        price: 1499,
        icon: '👩‍⚕️'
    } : {
        name: 'Dr. Mahantesh Totanagouda Patil',
        role: 'Psychiatrist',
        focus: 'Medication Management, Complex Review',
        price: 2499,
        icon: '👨‍⚕️'
    };

    const getMockDates = () => {
        const today = new Date();
        return Array.from({ length: 4 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return {
                day: d.toLocaleString('en-US', { weekday: 'short' }), // Mon
                date: d.getDate(), // 20
                fullDate: d,
                isToday: i === 0
            };
        });
    };

    const mockDates = getMockDates();
    const times = ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'];

    // Handle Return from Payment
    useEffect(() => {
        const success = searchParams.get('success');
        const dateParam = searchParams.get('date');
        const timeParam = searchParams.get('time');

        if (success === 'true' && dateParam && timeParam) {
            // Restore State
            setView('booking');

            // Restore Date (Attempt to parse or fallback to today)
            const restoredDate = new Date(dateParam);
            if (!isNaN(restoredDate.getTime())) {
                setSelectedFullDate(restoredDate);
            }

            // Restore Time
            setSelectedTime(timeParam);

            // Confirm Booking (Idempotency check recommended in real app, but here simplistic)
            // Check if we haven't already shown popup to avoid double booking on strict re-renders?
            // Ideally we'd remove query params after processing, but for now:
            confirmBooking(
                currentUserId,
                doctor.name,
                role,
                restoredDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                timeParam,
                doctor.price,
                confirmPhone || '+91 99999 99999'
            );

            setShowSuccessPopup(true);
        }
    }, [searchParams]); // Depend on searchParams

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.toDateString() === d2.toDateString();
    };

    const handleDateClick = (fullDate: Date) => {
        setSelectedFullDate(fullDate);
    };

    const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.valueAsDate) {
            setSelectedFullDate(e.target.valueAsDate);
        }
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' }).toUpperCase();
    };

    const handlePayment = () => {
        const dateString = selectedFullDate.toISOString(); // Use ISO for reliable parsing on return

        // Construct Return URL
        // Use window.location.hash to get the full path including language and app prefix (e.g., /en/therapist-matching/select-psychologist)
        // location.pathname only gives the path relative to the sub-router (e.g., /select-psychologist), which leads to 404/landing in the root router on return.
        const currentFullHash = window.location.hash.slice(1); // Remove '#'
        const [pathPart] = currentFullHash.split('?');

        const returnUrl = `${pathPart}?date=${encodeURIComponent(dateString)}&time=${encodeURIComponent(selectedTime || '')}`;

        // Navigate to Payment Gateway
        // Format: #/payment-landing?planName=...&price=...&returnUrl=...
        const planName = `${doctor.role} Consultation`;
        const price = `₹${doctor.price}`;

        const paymentUrl = `#/payment-landing?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}&returnUrl=${encodeURIComponent(returnUrl)}`;

        window.location.hash = paymentUrl;
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        navigate('/patient');
    };

    const isCustomDate = !mockDates.some(d => isSameDay(d.fullDate, selectedFullDate));
    const containerClass = "w-full max-w-lg bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-blue-50";

    // VIEW 1: DOCTOR CARD
    if (view === 'card') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#f0f6ff]">
                <div className={`${containerClass} text-center`}>
                    <div className="w-24 h-24 bg-blue-100 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-5xl shadow-inner">
                        {doctor.icon}
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 mb-2 leading-tight">{doctor.name}</h2>
                    <p className="text-[#1d74f5] font-bold uppercase tracking-wider text-xs mb-6">{doctor.role}</p>
                    <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                        <p className="text-slate-600 text-base leading-relaxed font-medium">Focus: {doctor.focus}</p>
                    </div>
                    <Button fullWidth onClick={() => setView('booking')} className="text-lg py-4 rounded-2xl">
                        Book Session
                    </Button>
                </div>
            </div>
        );
    }

    // VIEW 2: BOOKING CALENDAR
    if (view === 'booking') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#f0f6ff]">
                <div className={containerClass}>
                    <button onClick={() => setView('card')} className="text-slate-400 hover:text-[#1d74f5] flex items-center gap-2 mb-6 transition-colors">
                        <ArrowLeft size={20} /> <span className="font-bold text-base">Back</span>
                    </button>

                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl text-[#1d74f5]"><Calendar size={24} /></div>
                        Select Slot
                    </h2>

                    {/* Date Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {getMonthName(selectedFullDate)}
                            </p>

                            {/* Manual Date Picker */}
                            <div className="relative">
                                <div className="text-[#1d74f5] hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer bg-blue-50/50">
                                    <span>Full Month</span>
                                    <Calendar size={14} />
                                </div>
                                <input
                                    type="date"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleManualDateChange}
                                    title="Select Date"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                            {mockDates.map((d, i) => {
                                const selected = isSameDay(d.fullDate, selectedFullDate);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateClick(d.fullDate)}
                                        className={`min-w-[4.5rem] flex-1 p-3 rounded-2xl flex flex-col items-center transition-all border-2 ${selected
                                            ? 'bg-[#1d74f5] text-white shadow-xl shadow-blue-300 scale-105 border-[#1d74f5]'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span className={`text-[10px] font-bold uppercase mb-1 ${selected ? 'text-blue-100' : 'text-slate-400'}`}>{d.day}</span>
                                        <span className="text-xl font-bold">{d.date}</span>
                                    </button>
                                );
                            })}

                            {isCustomDate && (
                                <button
                                    className="min-w-[4.5rem] flex-1 p-3 rounded-2xl flex flex-col items-center bg-[#1d74f5] text-white shadow-xl shadow-blue-300 scale-105 border-2 border-[#1d74f5]"
                                >
                                    <span className="text-[10px] font-bold uppercase mb-1 text-blue-100">{selectedFullDate.toLocaleString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-xl font-bold">{selectedFullDate.getDate()}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Time Section */}
                    <div className="mb-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Times</p>

                        {!isManualTime ? (
                            <div className="grid grid-cols-2 gap-3">
                                {times.map((t, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedTime(t)}
                                        className={`p-3 rounded-xl text-base font-bold border-2 transition-all ${t === selectedTime
                                            ? 'border-[#1d74f5] text-[#1d74f5] bg-blue-50 shadow-lg'
                                            : 'border-slate-200 text-slate-600 hover:border-blue-300'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Select Time</label>
                                <input
                                    type="time"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1d74f5] outline-none text-lg font-bold text-slate-800"
                                    onChange={(e) => {
                                        if (!e.target.value) return;
                                        const [hours, minutes] = e.target.value.split(':');
                                        const h = parseInt(hours);
                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                        const h12 = h % 12 || 12;
                                        setSelectedTime(`${h12}:${minutes} ${ampm}`);
                                    }}
                                />
                            </div>
                        )}

                        <button
                            onClick={() => { setIsManualTime(!isManualTime); setSelectedTime(null); }}
                            className="mt-4 text-sm text-[#1d74f5] font-bold flex items-center gap-1 hover:underline p-1"
                        >
                            {isManualTime ? 'Back to slots' : 'Set time manually'} <ChevronRight size={16} />
                        </button>
                    </div>

                    <Button fullWidth onClick={handlePayment} disabled={!selectedTime} className="text-lg py-4 shadow-xl shadow-blue-200">
                        Pay ₹{doctor.price}
                    </Button>
                </div>

                {/* SUCCESS POPUP */}
                {showSuccessPopup && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 px-4">
                        <div className="bg-white p-8 rounded-[3rem] w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 shadow-inner">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-3">Booking Successful</h3>
                            <p className="text-slate-500 text-base mb-8 leading-relaxed">Session confirmed with<br /><span className="font-bold text-slate-800">{doctor.name}</span>.</p>
                            <Button fullWidth onClick={handlePopupClose} className="text-lg py-4">OK</Button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return null;
};