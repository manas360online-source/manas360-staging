/**
 * MANAS360 Payment Integration
 * Wrapper to integrate payment gateway functionality into main app
 * 
 * Uses unified API client for all backend communication.
 * 
 * Usage:
 * import { initiatePayment } from '@/utils/paymentIntegration';
 * await initiatePayment({ planId: 'premium_monthly', source: 'patient_plans' });
 */

import { api } from '../../utils/apiClient-unified';
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
    // Call backend using unified API client
    const response = await api.payments.create(planId);
    const data = response.data;

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
    const response = await api.subscriptions.getCurrent();
    const subscription = response.data.subscription;

    return {
      hasSubscription: Boolean(subscription && subscription.status === 'active'),
      planId: subscription?.plan_id || subscription?.planId,
      expiresAt: subscription?.ends_at || subscription?.endDate,
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
