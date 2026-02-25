
import React, { useState, useEffect } from 'react';
import { storageService, DemoSubscription } from '../utils/storageService';
import { jsPDF } from 'jspdf';
import { formatCurrency } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

interface BillingHistoryPageProps {
  context?: 'general' | 'sound' | 'ar';
}

export const BillingHistoryPage: React.FC<BillingHistoryPageProps> = ({ context = 'general' }) => {
  const { i18n } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<DemoSubscription[]>([]);
  const [autoRenewal, setAutoRenewal] = useState(true);

  useEffect(() => {
    const allSubs = storageService.getSubscriptions();
    if (context === 'sound') {
      // Filter for Sound Therapy plans only
      setSubscriptions(allSubs.filter(sub => sub.category === 'Sound Therapy'));
    } else if (context === 'ar') {
      // Filter for AR plans
      setSubscriptions(allSubs.filter(sub => sub.category === 'AR Themed Room'));
    } else {
      setSubscriptions(allSubs);
    }
  }, [context]);

  const handleBack = () => {
    if (context === 'sound') {
      // Return to Sound Pricing Page
      window.location.hash = `#/${i18n.language}/sound-therapy/plans`;
    } else if (context === 'ar') {
      // Return to AR Pricing Page
      window.location.hash = `#/${i18n.language}/ar-themed-room/plans`;
    } else {
      // Return to Main Subscribe Page
      window.location.hash = `#/${i18n.language}/subscribe`;
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    storageService.updateSubscriptionStatus(id, newStatus as 'Active' | 'Deactivated');
    // Refresh list based on context
    const allSubs = storageService.getSubscriptions();
    if (context === 'sound') {
      setSubscriptions(allSubs.filter(sub => sub.category === 'Sound Therapy'));
    } else if (context === 'ar') {
      setSubscriptions(allSubs.filter(sub => sub.category === 'AR Themed Room'));
    } else {
      setSubscriptions(allSubs);
    }
  };

  const downloadInvoice = (sub: DemoSubscription) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(10, 58, 120);
    doc.text('MANAS360 Invoice', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice ID: ${sub.id}`, 20, 40);
    doc.text(`Date: ${sub.date}`, 20, 50);
    doc.text(`Payment Status: Paid`, 20, 60); 
    
    doc.text(`Billed To:`, 20, 80);
    doc.text(`Valued Customer`, 20, 86);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 100, 190, 100);
    doc.setFont(undefined, 'bold');
    doc.text('Description', 20, 110);
    doc.text('Amount', 150, 110);
    doc.setFont(undefined, 'normal');
    doc.line(20, 115, 190, 115);

    const displayPrice = formatCurrency(sub.price.replace(/[^\d.]/g, ''));

    doc.text(`${sub.category} - ${sub.planName}`, 20, 125);
    doc.text(displayPrice, 150, 125);

    doc.line(20, 135, 190, 135);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 120, 145);
    doc.text(displayPrice, 150, 145);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Manas360 for your wellness journey.', 20, 160);

    doc.save(`Invoice_${sub.planName.replace(/\s+/g, '_')}_${sub.date}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F3F9FF] to-white dark:from-[#030712] dark:to-[#020617] p-4 md:p-8 animate-fade-in transition-colors duration-500 overflow-x-hidden">
      
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full relative flex items-center justify-center mb-8 md:mb-10">
          <button 
            onClick={handleBack} 
            className="absolute left-0 flex items-center gap-1 md:gap-2 text-[#0A3A78] dark:text-white font-medium text-[0.9rem] md:text-[1.1rem] hover:opacity-75 transition-all z-20"
          >
            <span className="text-xl md:text-2xl">←</span> <span className="hidden sm:inline">Back</span>
          </button>
          
          <h1 className="font-serif text-[1.75rem] sm:text-[2.2rem] md:text-[3.2rem] font-bold text-[#0A3A78] dark:text-white text-center transition-colors px-12 md:px-20 leading-tight z-10">
            {context === 'sound' ? 'Sound Therapy History' : context === 'ar' ? 'AR Room History' : 'Billing / Subscription History'}
          </h1>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 z-20">
            {/* Auto Renewal Removed from here to prevent overlap */}
            <div className="select-none pointer-events-none drop-shadow-sm">
              <span className="text-[28px] leading-none">🧿</span>
            </div>
          </div>
        </div>

        {/* Auto Renewal Toggle - Centered Below Title */}
        <div className="w-full mb-10 flex justify-center">
            <div className="bg-white dark:bg-[#111827] px-6 py-4 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-8 min-w-[300px]">
                <div className="text-left">
                  <p className="text-[#0A3A78] dark:text-white font-bold text-sm leading-tight">Auto-Renewal</p>
                  <p className="text-slate-400 dark:text-slate-500 text-[0.75rem] font-medium mt-0.5">Renew plans automatically</p>
                </div>
                <button 
                  onClick={() => setAutoRenewal(!autoRenewal)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center flex-shrink-0 ${autoRenewal ? 'bg-[#10B981]' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${autoRenewal ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>
        </div>

        <div className="w-full bg-white dark:bg-[#111827] rounded-[32px] md:rounded-[40px] p-4 sm:p-6 md:p-12 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 transition-all overflow-hidden">
          
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
              <div className="text-5xl md:text-6xl mb-4 md:mb-6">📄</div>
              <p className="text-lg md:text-xl text-slate-500 dark:text-white font-medium">No subscription records found.</p>
              <p className="text-sm md:text-base text-slate-400 dark:text-slate-400 mt-2">
                {context === 'sound' ? 'Your sound therapy plan history will appear here.' : context === 'ar' ? 'Your AR themed room plan history will appear here.' : 'Any demo subscriptions you make will appear here.'}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="py-5 px-4 text-[#64748B] dark:text-white font-bold uppercase text-[0.7rem] tracking-[0.1em]">Plan Category</th>
                      <th className="py-5 px-4 text-[#64748B] dark:text-white font-bold uppercase text-[0.7rem] tracking-[0.1em]">Plan Name</th>
                      <th className="py-5 px-4 text-[#64748B] dark:text-white font-bold uppercase text-[0.7rem] tracking-[0.1em]">Price</th>
                      <th className="py-5 px-4 text-[#64748B] dark:text-white font-bold uppercase text-[0.7rem] tracking-[0.1em]">Subscribed On</th>
                      <th className="py-5 px-4 text-[#64748B] dark:text-white font-bold uppercase text-[0.7rem] tracking-[0.1em]">Invoice</th>
                      <th className="py-5 px-4 text-[#64748B] dark:text-white font-bold uppercase text-[0.7rem] tracking-[0.1em] text-right">
                        Status <span className="normal-case font-normal text-slate-400 ml-1 opacity-70">(Tap to toggle)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                        <td className="py-6 px-4 text-slate-500 dark:!text-white font-medium text-[0.95rem] transition-colors">
                          {sub.category}
                        </td>
                        <td className="py-6 px-4 font-bold text-[#1e293b] dark:!text-white text-[1rem] transition-colors">
                          {sub.planName}
                        </td>
                        <td className="py-6 px-4 text-slate-600 dark:!text-white font-medium transition-colors">
                          {formatCurrency(sub.price.replace(/[^\d.]/g, ''))}
                        </td>
                        <td className="py-6 px-4 text-slate-500 dark:!text-white text-[0.9rem] transition-colors">
                          {sub.date}
                        </td>
                        <td className="py-6 px-4">
                          <button 
                            onClick={() => downloadInvoice(sub)}
                            className="flex items-center gap-2 text-[#0A3A78] dark:text-sky-400 font-bold text-sm hover:underline hover:text-[#1E59FF] transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Invoice
                          </button>
                        </td>
                        <td className="py-6 px-4 flex justify-end">
                          <button 
                            onClick={() => handleToggleStatus(sub.id, sub.status)}
                            className={`
                              min-w-[140px] flex items-center justify-between px-5 py-2.5 rounded-full text-white font-bold text-[0.9rem] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95
                              ${sub.status === 'Active' 
                                ? 'bg-[#34D399] hover:bg-[#10B981] shadow-emerald-200 dark:shadow-none' 
                                : 'bg-[#F87171] hover:bg-[#EF4444] shadow-red-200 dark:shadow-none'
                              }
                            `}
                          >
                            <span>{sub.status}</span>
                            <span className="text-xl leading-none opacity-80">›</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-6">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[0.65rem] font-bold text-slate-400 dark:!text-white uppercase tracking-widest mb-1">Plan Category</p>
                        <p className="text-[0.9rem] text-slate-600 dark:!text-white font-medium">{sub.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[0.65rem] font-bold text-slate-400 dark:!text-white uppercase tracking-widest mb-1">Plan Name</p>
                        <p className="text-[0.95rem] text-[#1e293b] dark:!text-white font-bold">{sub.planName}</p>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-bold text-slate-400 dark:!text-white uppercase tracking-widest mb-1">Price</p>
                        <p className="text-[0.9rem] text-slate-600 dark:!text-white font-medium">{formatCurrency(sub.price.replace(/[^\d.]/g, ''))}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[0.65rem] font-bold text-slate-400 dark:!text-white uppercase tracking-widest mb-1">Subscribed On</p>
                        <p className="text-[0.85rem] text-slate-500 dark:!text-white">{sub.date}</p>
                      </div>
                      
                      <div className="col-span-2 border-t border-slate-200/50 dark:border-slate-700/50 mt-1 pt-2 flex items-center justify-between">
                        <button 
                            onClick={() => downloadInvoice(sub)}
                            className="flex items-center gap-2 text-[#0A3A78] dark:text-sky-400 font-bold text-sm hover:underline"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Invoice PDF
                        </button>
                      </div>

                      <div className="col-span-2 flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                         <p className="text-[0.65rem] font-bold text-slate-400 dark:!text-white uppercase tracking-widest">
                          Status <span className="opacity-70 normal-case font-normal">(Toggle)</span>
                        </p>
                        <button 
                          onClick={() => handleToggleStatus(sub.id, sub.status)}
                          className={`
                            inline-flex items-center justify-between gap-2 px-5 py-2 rounded-full text-white font-bold text-[0.8rem] transition-all shadow-md active:scale-95
                            ${sub.status === 'Active' 
                              ? 'bg-[#34D399] hover:bg-[#10B981]' 
                              : 'bg-[#F87171] hover:bg-[#EF4444]'
                            }
                          `}
                        >
                          <span>{sub.status}</span>
                          <span className="text-lg leading-none opacity-80">›</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
