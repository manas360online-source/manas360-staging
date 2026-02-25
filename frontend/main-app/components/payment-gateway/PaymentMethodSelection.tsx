import React, { useEffect, useState } from 'react';
import { theme } from './theme';

interface Plan {
    id: string;
    name: string;
    price: number;
    label: string;
    savings?: string | null;
    popular?: boolean;
    duration?: number;
}

// Default standard plans from MANAS360Payment.js
const STANDARD_PLANS: Record<string, Plan> = {
    premium_monthly: {
        id: 'premium_monthly',
        name: 'Monthly Premium',
        price: 299,
        label: '₹299/mo',
        savings: null,
        popular: false,
    },
    premium_yearly: {
        id: 'premium_yearly',
        name: 'Annual Premium',
        price: 2999,
        label: '₹2,999/yr',
        savings: 'Save ₹589 (16%)',
        popular: true,
    }
};

export const PaymentMethodSelection: React.FC = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());
    const [selectedMethod, setSelectedMethod] = useState('UPI');
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [dynamicPlans, setDynamicPlans] = useState<Record<string, Plan>>(STANDARD_PLANS);

    useEffect(() => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(queryString);
        setParams(urlParams);

        const planName = urlParams.get('planName');
        const priceLabel = urlParams.get('price'); // e.g., "₹199/week"

        // If a specific plan is passed via URL, create a custom entry for it
        if (planName && priceLabel) {
            const customId = planName.toLowerCase().replace(/\s+/g, '_');
            // Try to parse number from price string (e.g. ₹29,999 -> 29999)
            const priceVal = parseInt(priceLabel.replace(/[^0-9]/g, '')) || 0;

            const customPlan: Plan = {
                id: customId,
                name: planName, // e.g. "CBT Practitioner (Installment)"
                price: priceVal,
                label: priceLabel, // e.g. "₹10,000/mo" or "₹29,999"
                savings: null,
                popular: true
            };

            // OVERRIDE standard plans - Show ONLY the custom one
            setDynamicPlans({
                [customId]: customPlan
            });
            setSelectedPlanId(customId);
        } else {
            // Default to standard if no param passed
            setDynamicPlans(STANDARD_PLANS);
            setSelectedPlanId('premium_yearly');
        }
    }, []);

    const returnUrl = params.get('returnUrl') || '';

    // Get currently selected plan object
    const currentPlan = dynamicPlans[selectedPlanId] || Object.values(dynamicPlans)[0];

    const methods = [
        { id: 'UPI', icon: '📱', label: 'UPI' },
        { id: 'CARD', icon: '💳', label: 'Card' },
        { id: 'NETBANK', icon: '🏦', label: 'NetBanking' },
        { id: 'WALLET', icon: '👛', label: 'Wallet' },
    ];

    const handleBack = () => {
        window.history.back();
    };

    const handlePay = () => {
        alert('Payment options are coming soon. Please check back shortly.');
    };

    const styles: Record<string, React.CSSProperties> = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflowY: 'auto', padding: '20px',
            backdropFilter: 'blur(4px)',
            zIndex: 9999
        },
        sheet: {
            width: '90%', maxWidth: '900px',
            background: theme.colors.cardBg,
            borderRadius: '24px',
            padding: '32px',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            fontFamily: theme.fonts.main,
            border: `1px solid ${theme.colors.cardBorder}`,
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        headerBar: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'
        },
        closeBtn: {
            background: 'none', border: 'none', color: theme.colors.textSecondary, fontSize: '24px', cursor: 'pointer', padding: '0'
        },
        restoreBtn: {
            background: 'none', border: 'none', color: theme.colors.warning, fontSize: '14px', fontWeight: '600', cursor: 'pointer'
        },
        heroSection: {
            textAlign: 'center', marginBottom: '24px'
        },
        crownIcon: {
            fontSize: '32px', marginBottom: '8px', display: 'block'
        },
        heroTitle: {
            fontSize: '22px', fontWeight: 'bold', color: theme.colors.text, marginBottom: '6px', letterSpacing: '-0.5px',
            fontFamily: theme.fonts.heading
        },
        heroSubtitle: {
            fontSize: '13px', color: theme.colors.textSecondary, fontWeight: '400'
        },
        planCard: {
            position: 'relative',
            background: theme.colors.background,
            borderRadius: '16px', padding: '16px 20px', marginBottom: '12px',
            cursor: 'pointer', border: '1px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: theme.transitions.default
        },
        planCardSelected: {
            background: '#fff',
            borderColor: theme.colors.warning,
            boxShadow: `0 0 0 1px ${theme.colors.warning}, ${theme.colors.cardShadow}`
        },
        radioOuter: {
            width: '20px', height: '20px', borderRadius: '50%',
            border: `2px solid ${theme.colors.textSecondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center'
        },
        radioSelected: {
            borderColor: theme.colors.warning, background: theme.colors.warning
        },
        popularBadge: {
            position: 'absolute', top: '-10px', right: '16px',
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            color: '#fff', fontSize: '10px', fontWeight: '800',
            padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px',
            textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
        },
        planName: { fontSize: '15px', fontWeight: '600', color: theme.colors.text, marginBottom: '4px' },
        planPrice: { fontSize: '18px', fontWeight: '700', color: theme.colors.text },
        savings: { fontSize: '12px', color: theme.colors.success, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' },

        sectionLabel: {
            fontSize: '11px', color: theme.colors.textSecondary, fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
            marginTop: '0px', marginBottom: '12px'
        },
        methodsGrid: {
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px'
        },
        methodBtn: {
            padding: '16px', borderRadius: '12px',
            background: theme.colors.background, border: '1px solid transparent',
            color: theme.colors.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: theme.transitions.default
        },
        methodSoon: {
            fontSize: '10px',
            fontWeight: '700',
            color: theme.colors.warning,
            marginLeft: '6px'
        },
        methodActive: {
            borderColor: theme.colors.primary, color: theme.colors.primary, background: '#fff',
            boxShadow: theme.colors.cardShadow,
            borderWidth: '1px' // Ensure visible border
        },
        ctaBtn: {
            width: '100%', padding: '18px',
            borderRadius: '14px', border: 'none',
            background: theme.colors.primaryGradient,
            color: '#fff', fontWeight: '800', fontSize: '16px',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            transform: 'translateY(0)', transition: 'transform 0.1s'
        },
        footer: {
            textAlign: 'center', marginTop: '16px', color: theme.colors.textSecondary, fontSize: '11px', fontWeight: '500',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
        }
    };

    return (
        <div style={styles.overlay}>
            <style>{`
                @keyframes slideUp { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
                
                @media (max-width: 768px) {
                    .payment-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                }
            `}</style>

            <div style={styles.sheet}>
                <div style={styles.headerBar}>
                    <button style={styles.closeBtn} onClick={handleBack}>✕</button>
                    <button style={styles.restoreBtn}>Restore</button>
                </div>

                <div style={styles.heroSection}>
                    <span style={styles.crownIcon}>👑</span>
                    <div style={styles.heroTitle}>Choose Payment Method</div>
                    <div style={styles.heroSubtitle}>Methods are listed below and currently marked as Coming Soon.</div>
                </div>

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }} className="payment-grid">
                    {/* Left Column: Plan Selection */}
                    <div>
                        <div style={styles.sectionLabel}>CHOOSE PLAN</div>

                        {Object.values(dynamicPlans).map((plan) => {
                            const isSelected = selectedPlanId === plan.id;
                            return (
                                <div
                                    key={plan.id}
                                    style={{ ...styles.planCard, ...(isSelected ? styles.planCardSelected : {}) }}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                >
                                    {/* Show "Current Selection" for the logic-selected one if it's the custom one, OR "Most Popular" for others if flagged */}
                                    {plan.id === selectedPlanId && plan.id !== 'premium_yearly' && plan.id !== 'premium_monthly' && (
                                        <div style={styles.popularBadge}>★ CURRENT SELECTION</div>
                                    )}
                                    {/* Fallback for standard popular plans if they aren't the custom one */}
                                    {plan.popular && plan.id === 'premium_yearly' && (
                                        <div style={styles.popularBadge}>★ MOST POPULAR</div>
                                    )}

                                    <div>
                                        <div style={styles.planName}>{plan.name}</div>
                                        <div style={{ ...styles.planPrice, color: isSelected ? theme.colors.warning : theme.colors.text }}>
                                            {plan.label}
                                        </div>
                                        {plan.savings && (
                                            <div style={styles.savings}>✓ {plan.savings}</div>
                                        )}
                                    </div>

                                    <div style={{ ...styles.radioOuter, ...(isSelected ? styles.radioSelected : {}) }}>
                                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Payment Methods */}
                    <div>
                        <div style={styles.sectionLabel}>PAY WITH</div>
                        <div style={styles.methodsGrid}>
                            {methods.map(m => (
                                <div
                                    key={m.id}
                                    style={{ ...styles.methodBtn, ...(selectedMethod === m.id ? styles.methodActive : {}) }}
                                    onClick={() => setSelectedMethod(m.id)}
                                >
                                    <span style={{ fontSize: '18px' }}>{m.icon}</span>
                                    {m.label}
                                    <span style={styles.methodSoon}>Coming Soon</span>
                                </div>
                            ))}
                        </div>

                        <button
                            style={styles.ctaBtn}
                            onClick={handlePay}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Payment Coming Soon
                        </button>

                        <div style={styles.footer}>
                            🚧 UPI, Card, NetBanking and Wallet are being enabled
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
