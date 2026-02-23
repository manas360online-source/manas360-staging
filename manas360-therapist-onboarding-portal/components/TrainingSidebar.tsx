import React from 'react';
import {
    BookOpen,
    LayoutGrid,
    GraduationCap,
    Award,
    Users,
    RefreshCcw,
    ShieldCheck,
    Lock
} from 'lucide-react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    locked?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, locked, onClick }) => (
    <button
        onClick={onClick}
        disabled={locked}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active
            ? 'bg-[#EBF1FF] text-[#2563EB] font-bold'
            : locked
                ? 'text-gray-300 cursor-not-allowed opacity-60'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-[#2563EB]' : 'text-blue-500'}`} />
        <span className="text-sm">{label}</span>
        {locked && <Lock className="w-3.5 h-3.5 ml-auto text-gray-300" />}
    </button>
);

const TrainingSidebar: React.FC = () => {
    return (
        <div className="w-72 h-full bg-white border-r border-gray-100 flex flex-col p-6 space-y-8">
            {/* Logo and Branding at Top */}
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="text-[20px] font-extrabold text-[#1A2332]">
                    MANS360
                </div>
            </div>

            {/* Status Card */}
            <div className="bg-[#F0F4FF] rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">STATUS</span>
                <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-orange-400 animate-spin-slow" />
                    <span className="text-sm font-bold text-orange-600">In Training</span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex flex-col gap-1">
                <SidebarItem icon={BookOpen} label="Training Guide" active />
                <SidebarItem icon={LayoutGrid} label="Practice Sandbox" />
                <SidebarItem icon={GraduationCap} label="Certification Quiz" />
            </nav>

            {/* My Career Section */}
            <div className="space-y-2">
                <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MY CAREER</h4>
                <nav className="flex flex-col gap-1">
                    <SidebarItem icon={Award} label="My Certificate" locked />
                </nav>
            </div>

            {/* Admin Section */}
            <div className="space-y-2">
                <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ADMIN</h4>
                <nav className="flex flex-col gap-1">
                    <SidebarItem icon={Users} label="Analytics" />
                </nav>
            </div>
        </div>
    );
};

export default TrainingSidebar;
