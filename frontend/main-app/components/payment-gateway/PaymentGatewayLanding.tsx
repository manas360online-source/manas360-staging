import React, { useEffect, useState } from 'react';
import { theme } from './theme';

export const PaymentGatewayLanding: React.FC = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

    useEffect(() => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1] || '';
        setParams(new URLSearchParams(queryString));
    }, []);

    const planName = params.get('planName') || '';
    const price = params.get('price') || '';
    const returnUrl = params.get('returnUrl') || '';

    const handleContinue = () => {
        // Redirect to Step 2: Method Selection
        const url = `#/payment-method?planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}&returnUrl=${encodeURIComponent(returnUrl)}`;
        window.location.hash = url;
    };

    const styles: Record<string, React.CSSProperties> = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily: theme.fonts.heading,
            padding: '20px'
        },
        card: {
            background: '#fff',
            maxWidth: '600px',
            width: '100%',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
        },
        title: {
            fontSize: '32px',
            color: '#0f172a',
            marginBottom: '10px',
            fontWeight: '700'
        },
        subtitle: {
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '40px',
            fontFamily: theme.fonts.main
        },
        innerCard: {
            background: '#fff',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            margin: '0 auto',
            border: '1px solid #f1f5f9'
        },
        gatewayTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '30px',
            fontFamily: theme.fonts.main
        },
        button: {
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s',
            fontFamily: theme.fonts.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        securedBy: {
            marginTop: '16px',
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: theme.fonts.main
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payment Gateway</h1>
            <p style={styles.subtitle}>Payment methods are being enabled. You can preview available options below.</p>

            <div style={styles.card}>
                <div style={styles.innerCard}>
                    <div style={styles.gatewayTitle}>
                        {planName ? `Upgrade to ${planName}` : 'MANAS360 Payment Gateway'}
                    </div>

                    <button
                        style={styles.button}
                        onClick={handleContinue}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span>🧾</span> {price ? `Continue for ${price}` : 'Continue to Payment Options'}
                    </button>

                    <div style={styles.securedBy}>All payment methods currently marked as Coming Soon</div>
                </div>
            </div>
        </div>
    );
};
