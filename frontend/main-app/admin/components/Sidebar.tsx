import React from 'react';

interface SidebarProps {
    activeSection: string;
    onNavigate: (section: string) => void;
    adminUser?: {
        name?: string;
        email?: string;
    } | null;
    onSignOut?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, adminUser, onSignOut }) => {
    const menuItems = [
        {
            id: 'dashboard', label: 'Dashboard', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            )
        },
        {
            id: 'outcomes', label: 'Outcomes', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            )
        },
        {
            id: 'therapists', label: 'Therapists', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            )
        },
        {
            id: 'sessions', label: 'Sessions', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            )
        },
        {
            id: 'journal', label: 'Clinical Journal', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            )
        },
        {
            id: 'admin_users', label: 'User Management', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            )
        },
        {
            id: 'admin_subs', label: 'Subscriptions', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            )
        },
        {
            id: 'user_behavior', label: 'User Behavior', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            )
        },
        {
            id: 'settings', label: 'Settings', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M9 12a3 3 0 100-6 3 3 0 000 6z" />
            )
        },
    ];

    return (
        <aside
            className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0 border-r border-calm-lightBlue/20 shadow-sm"
            style={{ backgroundColor: 'white' }}
        >
            <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
                {/* Logo */}
                <div className="mb-8 flex items-center px-2 py-2">
                    <span className="self-center whitespace-nowrap text-xl font-semibold" style={{ color: 'var(--calm-blue)' }}>MANAS360</span>
                </div>

                {/* Nav Links */}
                <ul className="space-y-2 font-medium">
                    <li>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex w-full items-center rounded-xl p-2 text-calm-text/70 hover:bg-calm-lavender/30 transition-colors mb-4 border border-dashed border-calm-lightBlue/30"
                            style={{ color: 'var(--calm-blue)' }}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="ml-3 font-semibold">App Home</span>
                        </button>
                    </li>
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`flex w-full items-center rounded-xl p-2 transition-colors ${activeSection === item.id
                                    ? 'bg-calm-lavender text-calm-blue'
                                    : 'text-calm-text/70 hover:bg-calm-lavender/30 hover:text-calm-blue'
                                    }`}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {item.icon}
                                </svg>
                                <span className="ml-3">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 px-2">
                    <button
                        onClick={() => {
                            if (onSignOut) {
                                onSignOut();
                                return;
                            }
                            window.location.hash = '#/en/admin/login';
                        }}
                        className="flex w-full items-center rounded-xl p-2 transition-colors text-calm-blue hover:bg-calm-lavender/30 border border-calm-blue/20"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="ml-3 font-medium">Sign Out</span>
                    </button>
                </div>
                {/* Bottom Profile */}
                <div className="mt-auto border-t border-calm-lightBlue/20 pt-4">
                    <a href="#" className="flex items-center rounded-xl p-2 text-calm-text/70 hover:bg-calm-lavender/30 hover:text-calm-blue">
                        <div
                            className="h-8 w-8 rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: 'var(--calm-lavender)', color: 'var(--calm-blue)' }}
                        >
                            {(adminUser?.name || 'Admin').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 text-left">
                            <p className="text-sm font-medium" style={{ color: 'var(--calm-text)' }}>{adminUser?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500">{adminUser?.email || 'No email available'}</p>
                        </div>
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
