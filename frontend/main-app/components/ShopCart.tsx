
import React, { useState, useEffect } from 'react';
import { shopService, CartItem } from '../utils/shopService';

export const ShopCart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, shipping: 0, gst: 0, total: 0 });

  const refreshCart = () => {
    setCart(shopService.getCart());
    setTotals(shopService.calculateTotals());
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener('cart-updated', refreshCart);
    return () => window.removeEventListener('cart-updated', refreshCart);
  }, []);

  const updateQty = (id: string, newQty: number) => {
    shopService.updateQuantity(id, newQty);
  };

  const removeItem = (id: string) => {
    shopService.removeFromCart(id);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] pt-32 pb-12 px-6 flex flex-col items-center justify-center text-center transition-colors">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="font-serif text-3xl text-[#0A3A78] dark:text-white mb-4">Your cart is empty</h2>
        <button onClick={() => window.location.hash = '#/shop'} className="px-8 py-3 rounded-full bg-[#1FA2DE] text-white font-bold">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] pt-24 pb-12 px-6 transition-colors">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="font-serif text-3xl font-bold text-[#0A3A78] dark:text-white mb-8">Shopping Cart ({cart.length})</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Items */}
          <div className="flex-1 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 md:gap-6 bg-white dark:bg-[#111827] p-4 md:p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-24 h-24 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] dark:text-white text-lg leading-tight mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-500">{item.category}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500">×</button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 gap-3">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="font-bold text-[#0A3A78] dark:text-sky-400">−</button>
                      <span className="font-bold text-sm dark:text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="font-bold text-[#0A3A78] dark:text-sky-400">+</button>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg dark:text-white">₹{item.price * item.quantity}</span>
                      {item.quantity >= 2 && <p className="text-[10px] text-green-600 font-bold">Bulk discount applied at checkout</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white dark:bg-[#111827] p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-lg sticky top-24">
              <h3 className="font-serif text-xl font-bold text-[#0A3A78] dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount</span>
                    <span className="font-bold">- ₹{totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${totals.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{totals.gst.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-[#0A3A78] dark:text-white">Total</span>
                  <span className="font-bold text-2xl text-[#1FA2DE] dark:text-sky-400">₹{totals.total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.hash = '#/checkout'}
                className="w-full py-4 rounded-full bg-[#0A3157] text-white font-bold hover:bg-[#124A85] shadow-xl transition-all active:scale-95"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-center text-slate-400 mt-4">Secure checkout powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
