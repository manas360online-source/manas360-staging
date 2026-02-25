import React, { useEffect, useState } from 'react';
import { theme } from './theme';

export const PaymentFailure: React.FC = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

    useEffect(() => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1] || '';
        setParams(new URLSearchParams(queryString));
    }, []);

    const txnId = params.get('txnId') || 'TXN_REF_MISSING';
    const errorMsg = params.get('error') || 'Bank declined';
    const returnUrl = params.get('returnUrl');

    const planName = params.get('planName') || '';
    const price = params.get('price') || '';

    const handleRetry = () => {
        // If we have context, go back to method selection
        if (planName || price) {
            const url = `#/payment-method?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}&returnUrl=${encodeURIComponent(returnUrl || '')}`;
            window.location.hash = url;
        }
        // Fallback to returnUrl mostly for legacy behavior, but prefer restarting flow
        else if (returnUrl) {
            window.location.hash = returnUrl;
        } else {
            window.location.hash = '#/';
        }
    };

    const styles: Record<string, React.CSSProperties> = {
        container: {
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh',
            background: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.fonts.main,
            padding: '20px'
        },
        phoneFrame: {
            width: '100%', maxWidth: '320px',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        },
        iconCircle: {
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: `2px solid ${theme.colors.error}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: theme.colors.error, marginBottom: '24px'
        },
        title: {
            fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: theme.colors.error,
            fontFamily: theme.fonts.heading
        },
        subtitle: {
            fontSize: '13px', color: theme.colors.textSecondary, marginBottom: '30px', textAlign: 'center',
            lineHeight: '1.5'
        },
        detailCard: {
            background: theme.colors.cardBg,
            border: `1px solid ${theme.colors.cardBorder}`,
            borderRadius: theme.borderRadius.card,
            padding: '16px',
            width: '100%',
            marginBottom: '24px',
            boxShadow: theme.colors.cardShadow
        },
        label: { fontSize: '10px', color: theme.colors.textSecondary, textTransform: 'uppercase', marginBottom: '12px' },
        row: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' },
        rowLabel: { color: theme.colors.textSecondary },
        rowValue: { fontWeight: '600', color: theme.colors.text },

        btnRetry: {
            width: '100%', padding: '14px', borderRadius: theme.borderRadius.button,
            background: theme.colors.primaryGradient, border: 'none',
            color: '#fff', fontWeight: 'bold', fontSize: '14px',
            cursor: 'pointer', marginBottom: '12px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
        },
        btnMethod: {
            width: '100%', padding: '14px', borderRadius: theme.borderRadius.button,
            background: 'transparent', border: `1px solid ${theme.colors.textSecondary}`,
            color: theme.colors.textSecondary, fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', marginBottom: '20px'
        },
        footer: { fontSize: '10px', color: theme.colors.textSecondary, textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');`}</style>

            <div style={styles.phoneFrame}>
                <div style={styles.iconCircle}>✕</div>

                <div style={styles.title}>Payment Unsuccessful</div>
                <div style={styles.subtitle}>Don't worry — no amount was deducted</div>

                <div style={styles.detailCard}>
                    <div style={styles.label}>DETAILS</div>

                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Error</span>
                        <span style={{ ...styles.rowValue, color: theme.colors.error }}>{errorMsg}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Ref</span>
                        <span style={{ ...styles.rowValue, fontSize: '10px', fontFamily: 'monospace' }}>
                            {txnId}
                        </span>
                    </div>
                </div>

                <button style={styles.btnRetry} onClick={handleRetry}>
                    🔄 Try Again
                </button>

                <button style={styles.btnMethod} onClick={handleRetry}>
                    Try Different Method
                </button>

                <div style={styles.footer}>
                    Need help? support@manas360.in
                </div>
            </div>
        </div>
    );
};
