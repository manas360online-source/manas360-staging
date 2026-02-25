
import React, { useState } from 'react';
import { shopService } from '../utils/shopService';

export const ShopCheckout: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    address1: '', address2: '', city: '', state: '', pincode: '',
    shippingMethod: 'standard'
  });
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const totals = shopService.calculateTotals();
  const shippingCost = formData.shippingMethod === 'express' ? 100 : totals.shipping;
  const finalTotal = totals.total - totals.shipping + shippingCost;

  const handlePincode = (val: string) => {
    setFormData({...formData, pincode: val});
    if (val.length === 6) setPincodeStatus('valid');
    else if (val.length > 0 && val.length !== 6) setPincodeStatus('invalid');
    else setPincodeStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeStatus === 'valid') {
      window.location.hash = `#/payment-demo?total=${finalTotal.toFixed(2)}`;
    } else {
      alert("Please enter a valid 6-digit pincode.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] pt-24 pb-12 px-6 transition-colors">
      <div className="max-w-[800px] mx-auto">
        <button onClick={() => window.location.hash = '#/cart'} className="mb-8 text-[#0A3A78] dark:text-sky-400 font-bold">← Back to Cart</button>
        
        <h1 className="font-serif text-3xl font-bold text-[#0A3A78] dark:text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Contact */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[#1A1A1A] dark:text-white">Contact Info</h3>
              <div className="space-y-4">
                <input required type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="email" placeholder="Email" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input required type="tel" placeholder="Phone" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[#1A1A1A] dark:text-white">Delivery Address</h3>
              <div className="space-y-4">
                <input required type="text" placeholder="Address Line 1" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.address1} onChange={e => setFormData({...formData, address1: e.target.value})} />
                <input type="text" placeholder="Address Line 2 (Optional)" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.address2} onChange={e => setFormData({...formData, address2: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="City" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  <input required type="text" placeholder="State" className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                </div>
                <div className="relative">
                  <input required type="text" placeholder="Pincode (6 digits)" maxLength={6} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1FA2DE]" value={formData.pincode} onChange={e => handlePincode(e.target.value)} />
                  {pincodeStatus === 'valid' && <span className="absolute right-3 top-3 text-green-600 text-sm font-bold">✓ Serviceable</span>}
                  {pincodeStatus === 'invalid' && <span className="absolute right-3 top-3 text-red-500 text-sm font-bold">Invalid</span>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[#1A1A1A] dark:text-white">Shipping Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.shippingMethod === 'standard' ? 'border-[#1FA2DE] bg-blue-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" value="standard" checked={formData.shippingMethod === 'standard'} onChange={e => setFormData({...formData, shippingMethod: e.target.value})} />
                    <div>
                      <span className="block font-bold text-[#1A1A1A] dark:text-white">Standard Delivery</span>
                      <span className="text-sm text-slate-500">5-7 Business Days</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.shippingMethod === 'express' ? 'border-[#1FA2DE] bg-blue-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" value="express" checked={formData.shippingMethod === 'express'} onChange={e => setFormData({...formData, shippingMethod: e.target.value})} />
                    <div>
                      <span className="block font-bold text-[#1A1A1A] dark:text-white">Express Delivery</span>
                      <span className="text-sm text-slate-500">2-3 Business Days</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">₹100</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-[320px]">
            <div className="bg-white dark:bg-[#111827] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-lg sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-[#0A3A78] dark:text-white">Payment Details</h3>
              <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹{totals.discount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{shippingCost}</span></div>
                <div className="flex justify-between"><span>GST</span><span>₹{totals.gst.toFixed(2)}</span></div>
              </div>
              <div className="border-t pt-4 mb-6 flex justify-between font-bold text-lg text-[#1FA2DE]">
                <span>Payable</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              <button type="submit" className="w-full py-4 rounded-full bg-[#0A3157] text-white font-bold hover:bg-[#124A85] shadow-xl transition-all">Proceed to Payment</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
