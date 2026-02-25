import { Certification, PaymentPlan } from '../CertificationTypes';

export const createEnrollment = async (certification: Certification, plan: PaymentPlan) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response
    return {
        enrollmentId: `ENR-${Math.floor(Math.random() * 10000)}`,
        amountDue: plan.type === 'full' ? certification.price_inr : plan.amount,
        currency: 'INR',
        status: 'created'
    };
};

export const verifyPayment = async (enrollmentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
        return {
            status: 'success',
            transactionId: `TXN-${Date.now()}`,
            courseAccessUrl: `/my-certifications`
        };
    } else {
        throw new Error("Payment verification failed");
    }
};