
import React from 'react';

export const ShopOrderSuccess: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const id = searchParams.get('id');

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce text-4xl">🎉</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0A3A78] dark:text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">Thank you for your purchase. Your wellness journey continues.</p>
        
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-10 inline-block w-full">
          <p className="text-sm text-slate-400 uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-2xl font-mono font-bold text-[#1A1A1A] dark:text-white">{id || 'ORD-ERROR'}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => window.location.hash = '#/orders'} className="px-8 py-3 rounded-full bg-[#0A3157] text-white font-bold hover:bg-[#124A85] transition-all">View My Orders</button>
          <button onClick={() => window.location.hash = '#/shop'} className="px-8 py-3 rounded-full border-2 border-[#0A3157] text-[#0A3157] dark:border-white dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export const ShopPaymentFailed: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">⚠️</div>
        <h1 className="font-serif text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">We couldn't process your payment. Please try again.</p>
        
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <button onClick={() => window.history.back()} className="w-full py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all">Retry Payment</button>
          <button onClick={() => window.location.hash = '#/cart'} className="w-full py-3 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Go to Cart</button>
        </div>
      </div>
    </div>
  );
};
