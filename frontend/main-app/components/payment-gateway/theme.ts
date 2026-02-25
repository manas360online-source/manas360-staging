export const theme = {
    colors: {
        background: '#f8fafc', // Very light slate/blueish grey (Calm-like)
        text: '#1e293b',       // Slate 800
        textSecondary: '#64748b', // Slate 500
        primary: '#3b82f6',    // Blue 500
        primaryGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', // Calm blue gradient
        secondary: '#8b5cf6',  // Violet
        cardBg: '#ffffff',
        cardBorder: 'rgba(226, 232, 240, 0.8)', // Slate 200
        cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cardHoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        success: '#10b981',    // Emerald 500
        error: '#ef4444',      // Red 500
        warning: '#f59e0b',    // Amber 500
        iconBg: '#eff6ff',     // Blue 50
    },
    fonts: {
        main: "'DM Sans', sans-serif",
        heading: "'Playfair Display', serif", // Calm uses a nice serif for headings sometimes
    },
    borderRadius: {
        card: '16px',
        button: '12px',
        icon: '12px',
    },
    transitions: {
        default: 'all 0.3s ease',
    }
};
