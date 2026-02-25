
const axios = require('axios');

const API_URL = 'http://localhost:5002/api/v1/payment';

async function testPayment() {
    console.log("🚀 Starting Payment Test...");
    console.log("------------------------------------------------");

    try {
        // 1. Initiate Payment
        console.log("1️⃣ Initiating Payment...");
        const response = await axios.post(`${API_URL}/create`, {
            user_id: "test_user_001",
            plan_id: "premium_monthly",
            source: "test_script",
            amount: 29900
        });

        const { success, payment_url, transaction_id } = response.data;

        if (success) {
            console.log("✅ Payment Initiated Successfully!");
            console.log(`🆔 Transaction ID: ${transaction_id}`);
            console.log(`🔗 Payment URL: ${payment_url}`);

            if (payment_url.includes('localhost')) {
                console.log("\n⚠️ NOTE: You received a LOCALHOST URL.");
                console.log("This means the backend used a FALLBACK (Mock) because it could not reach PhonePe Sandbox.");
                console.log("You can simply open this URL to verify the 'Success' flow in your frontend.");
            } else {
                console.log("\n🌍 NOTE: You received a REAL PhonePe Sandbox URL.");
                console.log("Please open this URL in your browser to complete the payment test.");
                console.log("------------------------------------------------");
                console.log("🧪 TEST CREDENTIALS (SANDBOX):");
                console.log("   - Method: UPI");
                console.log("   - VPA for Success: success@ybl");
                console.log("   - VPA for Failure: failure@ybl");
                console.log("------------------------------------------------");
            }
        } else {
            console.error("❌ Payment Initiation Failed:", response.data);
        }

    } catch (error) {
        if (error.response) {
            console.error("❌ Server Error:", error.response.status, error.response.data);
        } else {
            console.error("❌ Network/Client Error:", error.message);
        }
    }
}

testPayment();
