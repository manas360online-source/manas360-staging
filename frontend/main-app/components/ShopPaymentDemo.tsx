
import React from 'react';
import { shopService } from '../utils/shopService';

export const ShopPaymentDemo: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const total = searchParams.get('total') || '0.00';

  const handleSuccess = () => {
    const orderId = shopService.placeOrder(shopService.getCart(), parseFloat(total));
    window.location.hash = `#/order-success?id=${orderId}`;
  };

  const handleFailure = () => {
    window.location.hash = '#/payment-failed';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-[#1E293B] max-w-md w-full rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-fade-in-up">
        <h2 className="font-bold text-xl text-[#0A3A78] dark:text-white mb-2">Razorpay Demo</h2>
        <p className="text-slate-500 mb-8">Simulating payment gateway...</p>
        
        <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-2xl mb-8">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-[#1FA2DE]">₹{total}</p>
        </div>

        <div className="space-y-4">
          <button onClick={handleSuccess} className="w-full py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-green-200">
            Simulate Success ✅
          </button>
          <button onClick={handleFailure} className="w-full py-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200">
            Simulate Failure ❌
          </button>
        </div>
        
        <button onClick={() => window.location.hash = '#/checkout'} className="mt-6 text-sm text-slate-400 hover:text-slate-600">Cancel Transaction</button>
      </div>
    </div>
  );
};
