import React, { useEffect, useState } from 'react';
import { theme } from './theme';

export const PaymentSuccess: React.FC = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

    useEffect(() => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1] || '';
        setParams(new URLSearchParams(queryString));
    }, []);

    const txnId = params.get('txnId') || 'TXN_' + Math.floor(Math.random() * 1000000);
    const isDemo = params.get('demo') === '1';
    const returnUrl = params.get('returnUrl');

    useEffect(() => {
        if (!isDemo) {
            const timer = setTimeout(() => {
                handleContinue();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isDemo, returnUrl]);

    const handleContinue = () => {
        if (returnUrl) {
            // Append success=true to returnUrl
            const separator = returnUrl.includes('?') ? '&' : '?';
            window.location.hash = `${returnUrl}${separator}success=true&txnId=${txnId}`;
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
            background: 'rgba(34, 197, 94, 0.1)',
            border: `2px solid ${theme.colors.success}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: theme.colors.success, marginBottom: '24px'
        },
        title: {
            fontSize: '20px', fontWeight: 'bold', marginBottom: '8px',
            fontFamily: theme.fonts.heading,
            color: theme.colors.text
        },
        subtitle: {
            fontSize: '13px', color: theme.colors.textSecondary, marginBottom: '30px', textAlign: 'center',
            lineHeight: '1.5'
        },
        receiptCard: {
            background: theme.colors.cardBg,
            border: `1px solid ${theme.colors.cardBorder}`,
            borderRadius: theme.borderRadius.card,
            padding: '16px',
            width: '100%',
            marginBottom: '24px',
            boxShadow: theme.colors.cardShadow
        },
        receiptLabel: { fontSize: '10px', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
        row: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' },
        rowLabel: { color: theme.colors.textSecondary },
        rowValue: { fontWeight: '600', color: theme.colors.text },
        totalRow: {
            display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px',
            borderTop: `1px dashed ${theme.colors.cardBorder}`, fontSize: '12px'
        },
        statusValue: { color: theme.colors.success, fontWeight: 'bold' },
        btn: {
            width: '100%', padding: '14px', borderRadius: theme.borderRadius.button,
            background: theme.colors.success, border: 'none',
            color: '#fff', fontWeight: 'bold', fontSize: '14px',
            cursor: 'pointer', marginBottom: '16px',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
        },
        footer: { fontSize: '11px', color: theme.colors.textSecondary, textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');`}</style>

            <div style={styles.phoneFrame}>
                <div style={styles.iconCircle}>✓</div>

                <div style={styles.title}>Welcome to Premium!</div>
                <div style={styles.subtitle}>Your journey to better mental health just leveled up</div>

                <div style={styles.receiptCard}>
                    <div style={styles.receiptLabel}>RECEIPT</div>

                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Plan</span>
                        <span style={styles.rowValue}>Annual Premium</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Amount</span>
                        <span style={styles.rowValue}>₹2,999</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Payment</span>
                        <span style={styles.rowValue}>UPI • ****6789</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Valid Until</span>
                        <span style={styles.rowValue}>14 Feb 2027</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.rowLabel}>Transaction</span>
                        <span style={{ ...styles.rowValue, fontSize: '10px', fontFamily: 'monospace' }}>
                            {txnId || 'TXN_Pending'}
                        </span>
                    </div>

                    <div style={styles.totalRow}>
                        <span style={styles.rowLabel}>Status</span>
                        <span style={styles.statusValue}>✓ CONFIRMED</span>
                    </div>
                </div>

                <button style={styles.btn} onClick={handleContinue}>
                    Continue to Premium →
                </button>

                <div style={styles.footer}>
                    {isDemo ? 'Demo mode: staying on this page.' : 'Auto-returning...'}
                </div>
            </div>
        </div>
    );
};
