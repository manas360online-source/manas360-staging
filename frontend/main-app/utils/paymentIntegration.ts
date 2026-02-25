/**
 * MANAS360 Payment Integration
 * Wrapper to integrate payment gateway functionality into main app
 * 
 * This provides a direct connection to the payment gateway system
 * without duplicating code.
 * 
 * Usage:
 * import { initiatePayment } from '@/utils/paymentIntegration';
 * await initiatePayment({ planId: 'premium_monthly', source: 'patient_plans' });
 */

import { BACKEND_PLAN_IDS, PAYMENT_SOURCES } from '../config/PRICING_CONFIG';

export interface PaymentConfig {
  planId: string;
  source: string;
  metadata?: Record<string, any>;
  onSuccess?: (receipt: any) => void;
  onFailure?: (error: any) => void;
  onCancel?: () => void;
}

export interface PaymentReceipt {
  transactionId: string;
  planId: string;
  amount: number;
  subscriptionEnd?: string;
  paymentMethod?: string;
}

/**
 * Initialize payment flow using the backend payment API
 * This creates a payment transaction and redirects to PhonePe/payment gateway
 */
export async function initiatePayment(config: PaymentConfig): Promise<void> {
  const {
    planId,
    source,
    metadata = {},
    onSuccess,
    onFailure,
    onCancel,
  } = config;

  try {
    // Get user auth (you may need to add proper auth implementation)
    const userId = localStorage.getItem('userId') || 'demo-user';
    const authToken = localStorage.getItem('authToken');

    // Call backend to initiate payment
    const response = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        userId,
        planId,
        source,
        metadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment initiation failed');
    }

    // If backend returns redirect URL (for PhonePe), redirect to it
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }

    // If instant success (for dev mode or free plans)
    if (data.status === 'SUCCESS') {
      const receipt: PaymentReceipt = {
        transactionId: data.transactionId || data.transaction_id,
        planId: data.plan_id || planId,
        amount: data.amount || 0,
        subscriptionEnd: data.subscription_end,
        paymentMethod: data.payment_method,
      };
      
      if (onSuccess) {
        onSuccess(receipt);
      } else {
        // Default success handling - navigate to success page
        navigateToPaymentSuccess(receipt);
      }
    }

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    
    if (onFailure) {
      onFailure(error);
    } else {
      // Default error handling
      alert(`Payment failed: ${error.message}`);
    }
  }
}

/**
 * Navigate to payment success page with receipt data
 */
function navigateToPaymentSuccess(receipt: PaymentReceipt): void {
  const params = new URLSearchParams({
    status: 'success',
    transactionId: receipt.transactionId,
    planId: receipt.planId,
    amount: receipt.amount.toString(),
    ...(receipt.subscriptionEnd && { subscriptionEnd: receipt.subscriptionEnd }),
  });

  window.location.hash = `#/payment-success?${params.toString()}`;
}

/**
 * Navigate to payment failure page
 */
function navigateToPaymentFailure(error: string): void {
  const params = new URLSearchParams({
    status: 'failure',
    error,
  });

  window.location.hash = `#/payment-failure?${params.toString()}`;
}

/**
 * Check if user has active subscription
 */
export async function checkSubscriptionStatus(): Promise<{
  hasSubscription: boolean;
  planId?: string;
  expiresAt?: string;
}> {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return { hasSubscription: false };
    }

    const response = await fetch(`/api/subscriptions/status?userId=${userId}`);
    const data = await response.json();

    return {
      hasSubscription: data.hasSubscription || false,
      planId: data.planId,
      expiresAt: data.expiresAt,
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { hasSubscription: false };
  }
}

/**
 * For components that need the payment modal UI
 * This is a temporary bridge until we have a global payment modal
 */
export function showPaymentModal(config: PaymentConfig): void {
  // For now, directly initiate payment
  // In future, this could show a modal first
  initiatePayment(config);
}

/**
 * Export constants for easy access
 */
export { BACKEND_PLAN_IDS, PAYMENT_SOURCES };
