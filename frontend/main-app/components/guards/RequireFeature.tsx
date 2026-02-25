/**
 * ════════════════════════════════════════════════════════════════════════════
 * REQUIRE FEATURE - SUBSCRIPTION FEATURE GATING
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Wrapper component that enforces subscription feature access control.
 * 
 * Usage:
 *   <RequireFeature feature="themed_rooms">
 *     <ThemedRoomsPlayer />
 *   </RequireFeature>
 * 
 * Features:
 * - Shows loading spinner while subscription loads
 * - Shows upgrade prompt if feature not available
 * - Renders children only if user has active subscription with feature
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { ReactNode } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

// ════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════

interface RequireFeatureProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
}

// ════════════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════════════

export const RequireFeature: React.FC<RequireFeatureProps> = ({ 
  children, 
  feature, 
  fallback 
}) => {
  const { hasFeature, isLoading } = useSubscription();

  // Show loading spinner while checking subscription
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription...</p>
        </div>
      </div>
    );
  }

  // Feature not available - show upgrade prompt
  if (!hasFeature(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            This feature requires an active subscription. Upgrade your plan to unlock access.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.hash = '#/plans'}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md"
            >
              View Plans
            </button>
            <button
              onClick={() => window.location.hash = '#/'}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feature available - render children
  return <>{children}</>;
};

export default RequireFeature;
