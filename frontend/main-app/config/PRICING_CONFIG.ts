/**
 * MANAS360 PRICING CONFIGURATION
 * ================================
 * Single source of truth for all subscription pricing across the platform
 * IMPORTANT: These prices MUST match backend's PLAN_PRICING in paymentRoutes.js
 * 
 * Last Updated: 24 February 2026
 */

export interface PlanFeature {
  text: string;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  displayName: string;
  amount: number;        // In paise (₹299 = 29900 paise)
  displayPrice: string;  // Formatted for display
  period: string;        // 'month' | 'year' | 'lifetime' | 'session'
  duration: number;      // Days (-1 for lifetime/one-time)
  type: 'recurring' | 'one_time';
  category: 'patient' | 'therapist' | 'corporate' | 'guru' | 'platform';
  features: PlanFeature[];
  popular?: boolean;
  discount?: string;
  savings?: string;
  badge?: string;
}

/**
 * BACKEND PLAN IDS (DO NOT CHANGE - Must match backend)
 * These are the exact plan_id values used in the database
 */
export const BACKEND_PLAN_IDS = {
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly',
  ANYTIME_BUDDY_LIFETIME: 'anytimebuddy_lifetime',
  TRACK_SINGLE: 'track_single',
} as const;

/**
 * PRICING PLANS
 * All prices match backend/src/routes/paymentRoutes.js PLAN_PRICING
 */
export const PRICING_PLANS: Record<string, PricingPlan> = {
  
  // ==================== PLATFORM PLANS ====================
  
  [BACKEND_PLAN_IDS.PREMIUM_MONTHLY]: {
    id: BACKEND_PLAN_IDS.PREMIUM_MONTHLY,
    name: 'Premium Monthly',
    displayName: 'Premium',
    amount: 29900,  // ₹299
    displayPrice: '₹299',
    period: 'month',
    duration: 30,
    type: 'recurring',
    category: 'platform',
    popular: false,
    features: [
      { text: 'All platform features' },
      { text: 'Unlimited AI chatbot access' },
      { text: 'Priority therapist matching' },
      { text: 'Ad-free experience' },
      { text: 'Advanced analytics dashboard' },
      { text: 'Daily mood tracking' },
      { text: 'Sleep & wellness monitoring' },
    ],
  },

  [BACKEND_PLAN_IDS.PREMIUM_YEARLY]: {
    id: BACKEND_PLAN_IDS.PREMIUM_YEARLY,
    name: 'Premium Yearly',
    displayName: 'Premium Annual',
    amount: 299900, // ₹2,999
    displayPrice: '₹2,999',
    period: 'year',
    duration: 365,
    type: 'recurring',
    category: 'platform',
    popular: true,
    discount: '17% OFF',
    savings: 'Save ₹589',
    badge: 'Best Value',
    features: [
      { text: 'All platform features' },
      { text: 'Unlimited AI chatbot access' },
      { text: 'Priority therapist matching' },
      { text: 'Ad-free experience' },
      { text: 'Advanced analytics dashboard' },
      { text: 'Daily mood tracking' },
      { text: 'Sleep & wellness monitoring' },
      { text: 'Save ₹589 vs monthly', highlight: true },
      { text: '17% discount', highlight: true },
    ],
  },

  [BACKEND_PLAN_IDS.ANYTIME_BUDDY_LIFETIME]: {
    id: BACKEND_PLAN_IDS.ANYTIME_BUDDY_LIFETIME,
    name: 'Anytime Buddy Lifetime',
    displayName: 'Anytime Buddy',
    amount: 999900, // ₹9,999
    displayPrice: '₹9,999',
    period: 'lifetime',
    duration: -1,
    type: 'one_time',
    category: 'guru',
    badge: 'Lifetime Access',
    features: [
      { text: '24/7 AI Buddy access', highlight: true },
      { text: 'Unlimited conversations' },
      { text: 'Advanced mood chatbot' },
      { text: 'Crisis intervention support' },
      { text: 'Lifetime updates & features', highlight: true },
      { text: 'One-time payment - No recurring fees' },
    ],
  },

  [BACKEND_PLAN_IDS.TRACK_SINGLE]: {
    id: BACKEND_PLAN_IDS.TRACK_SINGLE,
    name: 'Single Session Track',
    displayName: 'Single Track',
    amount: 3000,   // ₹30
    displayPrice: '₹30',
    period: 'session',
    duration: -1,
    type: 'one_time',
    category: 'patient',
    features: [
      { text: 'Single therapy session' },
      { text: 'Pay per use - no commitment' },
      { text: 'Full session recording' },
      { text: 'Post-session analytics' },
    ],
  },
};

/**
 * PATIENT PLANS
 * These map to specific subscription options for patients
 */
export const PATIENT_PLANS = {
  
  // Free Tier (No payment required)
  HEALER: {
    id: 'healer_free',
    name: 'Healer',
    displayName: 'Healer',
    amount: 0,
    displayPrice: 'Free',
    period: 'forever',
    duration: -1,
    type: 'one_time' as const,
    category: 'patient' as const,
    sessionPrice: '₹499/session',
    features: [
      { text: 'AI-powered assessment' },
      { text: 'Access to therapist directory' },
      { text: 'Pay per session: ₹499/session' },
      { text: 'IVR Bot (Dr. Arya) - limited' },
      { text: 'Couple therapy: ₹1,499/session' },
      { text: 'Performance tracker' },
      { text: 'Manas360 coach review' },
      { text: 'Daily audio practices' },
    ],
    note: 'No monthly subscription – pay per session only',
  },

  // Maps to Premium Monthly (₹299/month)
  BUDDY: {
    id: BACKEND_PLAN_IDS.PREMIUM_MONTHLY,
    name: 'Buddy',
    displayName: 'Buddy',
    amount: 29900,
    displayPrice: '₹299',
    period: 'month',
    duration: 30,
    type: 'recurring' as const,
    category: 'patient' as const,
    sessionPrice: '₹699/session',
    popular: true,
    badge: 'Most Popular',
    features: [
      { text: 'AI-powered assessment' },
      { text: 'Therapist sessions: ₹699/session' },
      { text: 'Performance tracker' },
      { text: 'Daily practices with Dr. Maya AR' },
      { text: 'AR/VR on smartphone (4G/5G)' },
      { text: 'AnytimeBUDDY - 24/7 AI assistant', highlight: true },
      { text: 'Talk2Buddy - Digital human access' },
      { text: 'Dr. Manu - Mood chatbot', highlight: true },
      { text: 'Aatman Engineering preview' },
      { text: 'Couple therapy: ₹1,499/session' },
    ],
    note: 'Recommended for most users',
  },

  // Maps to Premium Yearly (₹2,999/year)
  GURU: {
    id: BACKEND_PLAN_IDS.PREMIUM_YEARLY,
    name: 'Guru',
    displayName: 'Guru',
    amount: 299900,
    displayPrice: '₹2,999',
    period: 'year',
    duration: 365,
    type: 'recurring' as const,
    category: 'patient' as const,
    sessionPrice: '₹999/session',
    badge: 'Best Value',
    discount: 'Save ₹589',
    features: [
      { text: 'AI-powered assessment' },
      { text: 'Therapist sessions: ₹999/session' },
      { text: 'Daily practices with Dr. Maya AR' },
      { text: 'Crisis Predictor - AI Avatar', highlight: true },
      { text: 'NLP & Behavioral Science', highlight: true },
      { text: 'Quantum Meditation' },
      { text: 'Right Diet & SleepWell' },
      { text: 'Digital Detox program' },
      { text: 'Aatman Engineering - Full access', highlight: true },
      { text: 'Reiki Coaching' },
      { text: 'Couple therapy: ₹1,499/session' },
    ],
    note: 'All features unlocked - Best for committed users',
  },
};

/**
 * THERAPIST PLANS
 */
export const THERAPIST_PLANS = {
  // TODO: Define therapist-specific plans
  // These would involve revenue sharing models
};

/**
 * CORPORATE PLANS
 */
export const CORPORATE_PLANS = {
  // TODO: Define corporate/enterprise plans
  // Volume-based pricing for organizations
};

/**
 * HELPER FUNCTIONS
 */

/**
 * Get plan by ID (checks both PRICING_PLANS and named plans)
 */
export function getPlanById(planId: string): PricingPlan | null {
  // Check main pricing plans first
  if (PRICING_PLANS[planId]) {
    return PRICING_PLANS[planId];
  }
  
  // Check patient plans
  const patientPlan = Object.values(PATIENT_PLANS).find(p => p.id === planId);
  if (patientPlan) {
    return patientPlan as PricingPlan;
  }
  
  return null;
}

/**
 * Format amount in paise to rupees display
 */
export function formatPrice(amountInPaise: number): string {
  const rupees = amountInPaise / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Calculate savings between two plans
 */
export function calculateSavings(yearlyAmount: number, monthlyAmount: number): string {
  const monthlyCost = (monthlyAmount / 100) * 12;
  const yearlyCost = yearlyAmount / 100;
  const savings = monthlyCost - yearlyCost;
  return `₹${Math.round(savings).toLocaleString('en-IN')}`;
}

/**
 * Get all plans for a specific category
 */
export function getPlansByCategory(category: PricingPlan['category']): PricingPlan[] {
  return Object.values(PRICING_PLANS).filter(plan => plan.category === category);
}

/**
 * Validate plan exists in backend
 */
export function isValidBackendPlanId(planId: string): boolean {
  return Object.values(BACKEND_PLAN_IDS).includes(planId as any);
}

/**
 * CONSTANTS
 */
export const PAYMENT_SOURCES = {
  PATIENT_PLANS: 'patient_plans_page',
  THERAPIST_PLANS: 'therapist_plans_page',
  CORPORATE_PLANS: 'corporate_plans_page',
  GURU_PLANS: 'guru_plans_page',
  PREMIUM_HUB: 'premium_hub',
  WELLNESS_SUBSCRIPTION: 'wellness_subscription',
  HOME_PAGE_CTA: 'home_page_cta',
  PROFILE_SETUP: 'profile_setup',
} as const;

export default PRICING_PLANS;
