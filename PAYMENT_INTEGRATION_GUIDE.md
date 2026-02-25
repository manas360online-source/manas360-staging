# 💳 MANAS360 Payment Integration Guide for Developers

## Quick Start

To add payment functionality to any component in MANAS360, follow these simple steps:

### 1. Import the Payment Integration

```typescript
import { initiatePayment, PAYMENT_SOURCES, BACKEND_PLAN_IDS } from '@/utils/paymentIntegration';
import { PRICING_PLANS } from '@/config/PRICING_CONFIG';
```

### 2. Add Payment Handler

```typescript
const handlePayment = async () => {
  await initiatePayment({
    planId: BACKEND_PLAN_IDS.PREMIUM_MONTHLY,  // or any plan ID
    source: PAYMENT_SOURCES.YOUR_PAGE,
    onSuccess: (receipt) => {
      console.log('Payment successful!', receipt);
      // Show success message or navigate
    },
    onFailure: (error) => {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error.message}`);
    },
  });
};
```

### 3. Add Button to Your Component

```tsx
<button onClick={handlePayment} className="subscribe-btn">
  Subscribe for {PRICING_PLANS.premium_monthly.displayPrice}/month
</button>
```

That's it! ✅

---

## Complete Example: Adding Subscription to a New Page

```tsx
import React, { useState } from 'react';
import { initiatePayment, PAYMENT_SOURCES, BACKEND_PLAN_IDS } from '../utils/paymentIntegration';
import { PRICING_PLANS, PATIENT_PLANS } from '../config/PRICING_CONFIG';

export const MyNewSubscriptionPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (isProcessing) return; // Prevent double-clicks
    setIsProcessing(true);

    try {
      await initiatePayment({
        planId,
        source: PAYMENT_SOURCES.PATIENT_PLANS, // or your custom source
        metadata: {
          pageType: 'custom_page',
          userRole: 'patient',
        },
        onSuccess: (receipt) => {
          setIsProcessing(false);
          console.log('Payment successful!', receipt);
          // Navigate to success page or show modal
          window.location.hash = '#/payment-success';
        },
        onFailure: (error) => {
          setIsProcessing(false);
          alert(`Payment failed: ${error.message}`);
        },
        onCancel: () => {
          setIsProcessing(false);
          console.log('User canceled payment');
        },
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="subscription-page">
      <h1>Choose Your Plan</h1>
      
      {/* Monthly Plan */}
      <div className="plan-card">
        <h2>{PRICING_PLANS.premium_monthly.displayName}</h2>
        <p className="price">{PRICING_PLANS.premium_monthly.displayPrice}/month</p>
        <ul>
          {PRICING_PLANS.premium_monthly.features.map((feature, i) => (
            <li key={i}>{feature.text}</li>
          ))}
        </ul>
        <button 
          onClick={() => handleSubscribe(BACKEND_PLAN_IDS.PREMIUM_MONTHLY)}
          disabled={isProcessing}
          className="subscribe-btn"
        >
          {isProcessing ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>

      {/* Yearly Plan */}
      <div className="plan-card popular">
        <div className="badge">{PRICING_PLANS.premium_yearly.badge}</div>
        <h2>{PRICING_PLANS.premium_yearly.displayName}</h2>
        <p className="price">{PRICING_PLANS.premium_yearly.displayPrice}/year</p>
        <p className="discount">{PRICING_PLANS.premium_yearly.savings}</p>
        <ul>
          {PRICING_PLANS.premium_yearly.features.map((feature, i) => (
            <li key={i}>{feature.text}</li>
          ))}
        </ul>
        <button 
          onClick={() => handleSubscribe(BACKEND_PLAN_IDS.PREMIUM_YEARLY)}
          disabled={isProcessing}
          className="subscribe-btn"
        >
          {isProcessing ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
};
```

---

## Available Plans

### Backend Plan IDs (Always use these!)

```typescript
BACKEND_PLAN_IDS = {
  PREMIUM_MONTHLY: 'premium_monthly',          // ₹299/month
  PREMIUM_YEARLY: 'premium_yearly',            // ₹2,999/year
  ANYTIME_BUDDY_LIFETIME: 'anytimebuddy_lifetime', // ₹9,999 one-time
  TRACK_SINGLE: 'track_single',                // ₹30 per session
}
```

### Patient Plans (Branded names)

```typescript
PATIENT_PLANS = {
  HEALER: { id: 'healer_free', price: 'Free' },      // Free tier
  BUDDY: { id: 'premium_monthly', price: '₹299' },   // Monthly subscription
  GURU: { id: 'premium_yearly', price: '₹2,999' },   // Yearly subscription
}
```

---

## Payment Sources

Define where the payment was initiated for analytics tracking:

```typescript
PAYMENT_SOURCES = {
  PATIENT_PLANS: 'patient_plans_page',
  THERAPIST_PLANS: 'therapist_plans_page',
  CORPORATE_PLANS: 'corporate_plans_page',
  GURU_PLANS: 'guru_plans_page',
  PREMIUM_HUB: 'premium_hub',
  WELLNESS_SUBSCRIPTION: 'wellness_subscription',
  HOME_PAGE_CTA: 'home_page_cta',
  PROFILE_SETUP: 'profile_setup',
}
```

To add your own:
1. Add to `PAYMENT_SOURCES` in `PRICING_CONFIG.ts`
2. Use it when calling `initiatePayment()`

---

## API Reference

### `initiatePayment(config)`

Main function to start a payment flow.

**Parameters:**

```typescript
interface PaymentConfig {
  planId: string;                    // Required: Plan ID from BACKEND_PLAN_IDS
  source: string;                    // Required: Source identifier (for analytics)
  metadata?: Record<string, any>;    // Optional: Extra data to store
  onSuccess?: (receipt) => void;     // Optional: Success callback
  onFailure?: (error) => void;       // Optional: Failure callback
  onCancel?: () => void;             // Optional: Cancel callback
}
```

**Returns:** `Promise<void>`

**Example:**

```typescript
await initiatePayment({
  planId: 'premium_monthly',
  source: 'my_custom_page',
  metadata: { userType: 'patient', campaign: 'holiday2026' },
  onSuccess: (receipt) => console.log('Success!', receipt),
  onFailure: (error) => alert(error.message),
});
```

---

## Payment Receipt Structure

When payment succeeds, you receive a receipt object:

```typescript
interface PaymentReceipt {
  transactionId: string;      // Unique transaction ID
  planId: string;             // Plan that was purchased
  amount: number;             // Amount paid (in paise)
  subscriptionEnd?: string;   // ISO date when subscription expires
  paymentMethod?: string;     // 'UPI', 'Card', etc.
}
```

---

## Backend Integration

### How Payment Works Behind the Scenes

1. **Frontend calls `initiatePayment()`**
   - Sends POST to `/api/payments/initiate`
   - Backend creates payment record in database
   - Backend calls PhonePe API to create payment

2. **PhonePe redirects user**
   - User completes payment on PhonePe
   - PhonePe redirects back to your app

3. **Webhook updates database**
   - PhonePe sends webhook to `/api/payments/webhook`
   - Backend verifies payment status
   - Backend updates `payments` and `subscriptions` tables

4. **User sees success**
   - Frontend shows payment success page
   - User's account is upgraded to premium

### Database Tables

**payments table:**
```sql
transaction_id | user_id | plan_id | amount | status | created_at
```

**subscriptions table:**
```sql
user_id | plan_id | status | starts_at | ends_at | auto_renew
```

**settlements table:** (for therapist revenue sharing)
```sql
payment_id | total_amount | platform_share | provider_share | settled_at
```

---

## Common Patterns

### 1. Free Trial → Premium Upgrade

```typescript
const handleUpgradeToPremium = async () => {
  const hasFreeTrial = localStorage.getItem('hasFreeTrial');
  
  if (!hasFreeTrial) {
    // Offer free trial first
    setShowFreeTrial(true);
  } else {
    // Direct to payment
    await initiatePayment({
      planId: BACKEND_PLAN_IDS.PREMIUM_MONTHLY,
      source: 'upgrade_prompt',
    });
  }
};
```

### 2. Checking Subscription Status

```typescript
import { checkSubscriptionStatus } from '@/utils/paymentIntegration';

const checkAccess = async () => {
  const { hasSubscription, planId, expiresAt } = await checkSubscriptionStatus();
  
  if (hasSubscription) {
    console.log(`User has ${planId} until ${expiresAt}`);
    // Allow access
  } else {
    // Show paywall
    setShowPaywall(true);
  }
};
```

### 3. Multiple Plan Selection

```typescript
const AVAILABLE_PLANS = [
  BACKEND_PLAN_IDS.PREMIUM_MONTHLY,
  BACKEND_PLAN_IDS.PREMIUM_YEARLY,
  BACKEND_PLAN_IDS.ANYTIME_BUDDY_LIFETIME,
];

return (
  <div className="plans-grid">
    {AVAILABLE_PLANS.map(planId => {
      const plan = PRICING_PLANS[planId];
      return (
        <PlanCard
          key={planId}
          title={plan.displayName}
          price={plan.displayPrice}
          features={plan.features}
          onSubscribe={() => handleSubscribe(planId)}
        />
      );
    })}
  </div>
);
```

---

## Best Practices

### ✅ DO:

1. **Always use `BACKEND_PLAN_IDS`** - Never hardcode plan IDs
2. **Prevent double-clicks** - Use `isProcessing` state
3. **Handle all callbacks** - onSuccess, onFailure, onCancel
4. **Show loading states** - Buttons should show "Processing..."
5. **Log analytics** - Track conversion funnels
6. **Use pricing from `PRICING_CONFIG`** - Single source of truth
7. **Test with real payments** - Use PhonePe sandbox mode

### ❌ DON'T:

1. **Don't hardcode prices** - `<span>₹299</span>` ❌
2. **Don't create new plan IDs** - Must match backend
3. **Don't skip error handling** - Users need feedback
4. **Don't allow multiple clicks** - Can cause duplicate charges
5. **Don't bypass payment system** - Always use `initiatePayment()`
6. **Don't forget metadata** - Helps with debugging
7. **Don't ignore webhooks** - Backend handles state updates

---

## Troubleshooting

### Payment Not Initiating

**Problem:** Nothing happens when clicking subscribe button

**Solutions:**
- Check browser console for errors
- Verify `planId` is valid (use `BACKEND_PLAN_IDS`)
- Ensure user is authenticated (has `userId` and `authToken`)
- Check network tab for API errors

### Wrong Price Showing

**Problem:** Frontend shows ₹199 but backend charges ₹299

**Solution:**
- Always import from `PRICING_CONFIG`
- Never hardcode prices in components
- Use `PRICING_PLANS[planId].displayPrice`

### Payment Success But Subscription Not Active

**Problem:** Payment completed but user doesn't have premium access

**Solutions:**
- Check webhook is configured correctly
- Verify PhonePe callback URL is set
- Check backend logs for webhook errors
- Manually verify in `subscriptions` table

### Duplicate Payments

**Problem:** User charged twice

**Solution:**
- Use `isProcessing` state to disable button
- Check backend deduplication logic
- Use `transaction_id` to prevent duplicates

---

## Testing

### Test Mode Setup

1. Use PhonePe sandbox credentials in `.env`:
```bash
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=test_salt_key_123
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=SANDBOX
```

2. Test cards:
- **Success:** 4242 4242 4242 4242
- **Failure:** 4000 0000 0000 0002

### Manual Testing Checklist

- [ ] Click subscribe button
- [ ] Loading state shows
- [ ] Redirect to PhonePe
- [ ] Complete payment
- [ ] Redirect back to app
- [ ] Success modal appears
- [ ] Check database: `subscriptions` table updated
- [ ] User has premium access
- [ ] Email confirmation sent (if configured)

---

## Examples in Codebase

### Working Examples:
1. ✅ **PaymentGatewayLanding** - `frontend/main-app/components/payment-gateway/PaymentGatewayLanding.tsx`
2. ✅ **PatientPlansPage** - `frontend/main-app/components/PatientPlansPage.tsx` (After fix)
3. ✅ **WellnessSubscription** - `frontend/main-app/components/WellnessSubscription.tsx` (After fix)

### Broken Examples (Don't copy these):
1. ❌ **Old PatientPlansPage** - Used fake `#/payment-landing` redirect
2. ❌ **Old WellnessSubscription** - Had fake ₹99 plan

---

## FAQs

**Q: Can I create custom pricing?**  
A: No. All plans must be defined in backend `PLAN_PRICING` first, then added to `PRICING_CONFIG.ts`.

**Q: How do I add a new plan?**  
A: 
1. Add to backend `/routes/paymentRoutes.js` `PLAN_PRICING`
2. Add to `frontend/main-app/config/PRICING_CONFIG.ts`
3. Use the new plan ID in your component

**Q: Can I offer discounts?**  
A: Yes, but apply discounts in backend logic. Frontend should display original price and discount separately.

**Q: How do refunds work?**  
A: Contact backend team. Refunds are manual via PhonePe dashboard.

**Q: Can users change plans?**  
A: Yes, implement upgrade/downgrade by calling `initiatePayment()` with new `planId`.

**Q: Revenue sharing with therapists?**  
A: Automatic! 60/40 split tracked in `settlements` table.

---

## Support

**Got questions?**
- Check `SUBSCRIPTION_ISSUES_FOUND.md` for known issues
- Review `COMPLETE_SYSTEM_ARCHITECTURE.md` for system overview
- Ask in #payments Slack channel
- Email: dev-support@manas360.com

**Report bugs:**
- Create GitHub issue with label `payment-bug`
- Include: browser, steps to reproduce, error logs
- Tag with priority (P0 = payment failure, P1 = UX issue)

---

**Last Updated:** 24 February 2026  
**Version:** 1.0  
**Maintained by:** MANAS360 Payments Team

---

## Changelog

### v1.0 (24 Feb 2026)
- ✅ Created centralized `PRICING_CONFIG.ts`
- ✅ Fixed `PatientPlansPage` pricing mismatch
- ✅ Fixed `WellnessSubscription` fake ₹99 plan
- ✅ Added `paymentIntegration.ts` utility
- ✅ Integrated `PremiumHub` into main App
- ✅ Created this developer guide
