
import React, { useState, useEffect } from 'react';
import { shopService, Order } from '../utils/shopService';

export const ShopOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(shopService.getOrders());
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] pt-24 pb-12 px-6 transition-colors">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#0A3A78] dark:text-white">My Orders</h1>
          <button onClick={() => window.location.hash = '#/shop'} className="text-[#1FA2DE] font-bold hover:underline">Continue Shopping</button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-[#111827] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Order ID</span>
                    <span className="font-mono font-bold text-[#1A1A1A] dark:text-white">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Date</span>
                    <span className="font-medium text-[#1A1A1A] dark:text-white">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Total</span>
                    <span className="font-bold text-[#1FA2DE]">₹{order.total.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Processing' ? 'bg-blue-50 text-blue-600' : order.status === 'Shipped' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <p className="text-xs text-slate-400">Tracking: <span className="font-mono text-slate-600 dark:text-slate-300">{order.tracking}</span></p>
                  <button className="text-sm font-bold text-[#0A3A78] dark:text-sky-400 hover:underline">Track Shipment</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
