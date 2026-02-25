/**
 * ════════════════════════════════════════════════════════════════════════════
 * SUBSCRIPTION CONTEXT - FEATURE GATING & PLAN MANAGEMENT
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Provides:
 * - Current subscription status
 * - Feature access checks (hasFeature)
 * - Plan limits and quotas
 * - Subscription refresh methods
 * 
 * Usage:
 *   import { useSubscription } from '@/contexts/SubscriptionContext';
 *   
 *   const { subscription, hasFeature, isActive } = useSubscription();
 *   
 *   if (hasFeature('themed_rooms')) {
 *     // Render premium content
 *   }
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../../utils/apiClient-unified';
import { useAuth } from './AuthContext';

// ════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  features: string[];
  limits?: {
    [key: string]: number;
  };
}

interface SubscriptionContextValue {
  subscription: Subscription | null;
  isActive: boolean;
  isLoading: boolean;
  hasFeature: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
}

// ════════════════════════════════════════════════════════════════════════════
// Context
// ════════════════════════════════════════════════════════════════════════════

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

// ════════════════════════════════════════════════════════════════════════════
// Provider Component
// ════════════════════════════════════════════════════════════════════════════

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------------------
  // Fetch subscription when authenticated
  // --------------------------------------------------------
  const refreshSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.subscriptions.getCurrent();
      setSubscription(response.data.subscription);
    } catch (error: any) {
      // 404 means no active subscription - this is valid state
      if (error?.response?.status === 404) {
        setSubscription(null);
      } else {
        console.error('[SubscriptionContext] Failed to fetch subscription:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  // --------------------------------------------------------
  // Feature check helper
  // --------------------------------------------------------
  const hasFeature = useCallback((feature: string): boolean => {
    if (!subscription || subscription.status !== 'active') {
      return false;
    }
    return subscription.features?.includes(feature) ?? false;
  }, [subscription]);

  // --------------------------------------------------------
  // Derived state
  // --------------------------------------------------------
  const isActive = subscription?.status === 'active';

  const value: SubscriptionContextValue = {
    subscription,
    isActive,
    isLoading,
    hasFeature,
    refreshSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export default SubscriptionContext;
