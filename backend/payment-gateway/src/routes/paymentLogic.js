
// ─── SHARED: Process Successful Payment ───
// Called by BOTH /verify and /webhook for consistency
async function processSuccessfulPayment(payment, pgData) {
    const plan = PLAN_PRICING[payment.plan_id];
    const now = new Date();
    const endDate = plan.days === -1
        ? new Date('2099-12-31')
        : new Date(now.getTime() + plan.days * 86400000);

    // Use query wrapper instead of raw client for mock/demo safety
    try {
        await query('BEGIN');

        // Update payment
        await query(`
      UPDATE payments SET
        status = 'SUCCESS',
        phonepe_payment_id = $1,
        payment_method = $2,
        updated_at = NOW()
      WHERE transaction_id = $3
    `, [pgData.data?.transactionId,
        pgData.data?.paymentInstrument?.type || 'UPI',
        payment.transaction_id]);

        // Upsert subscription
        await query(`
      INSERT INTO subscriptions (user_id, plan_id, status,
        starts_at, ends_at, payment_transaction_id, auto_renew)
      VALUES ($1, $2, 'active', NOW(), $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        plan_id = $2, status = 'active',
        starts_at = NOW(), ends_at = $3,
        payment_transaction_id = $4,
        auto_renew = $5, updated_at = NOW()
    `, [payment.user_id, payment.plan_id,
            endDate, payment.transaction_id,
        plan.type === 'recurring']);

        // Upgrade user
        await query(`
      UPDATE users SET
        subscription_tier = 'premium',
        subscription_status = 'active',
        premium_ends_at = $1, updated_at = NOW()
      WHERE user_id = $2
    `, [endDate, payment.user_id]);

        // Revenue split (if therapist involved)
        if (payment.therapist_id) {
            const providerPaise = Math.round(plan.amount * 0.60);
            await query(`
        INSERT INTO settlements
          (transaction_id, therapist_id, total_amount,
           provider_share, platform_share, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
      `, [payment.transaction_id, payment.therapist_id,
            plan.amount, providerPaise,
            plan.amount - providerPaise]);
        }

        // Audit log
        await query(`
            INSERT INTO audit_log
            (user_id, action, details, created_at)
            VALUES ($1, 'payment_success', $2, NOW())
        `, [payment.user_id, JSON.stringify({
            transaction_id: payment.transaction_id, plan_id: payment.plan_id,
            amount: plan.amount, source: payment.source_screen,
        })]);

        await query('COMMIT');
    } catch (e) {
        await query('ROLLBACK');
        console.error("Process Payment DB Error", e);
        throw e;
    }
}
