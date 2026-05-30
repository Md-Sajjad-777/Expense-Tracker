/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Trash2, 
  CreditCard,
  X,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  Printer
} from 'lucide-react';
import { Order } from '../lib/models';

interface TransactionsProps {
  orders: Order[];
  onDeleteOrder: (orderId: string) => void;
  onRecordPayment: (orderId: string, amount: number) => void;
  onSelectInvoice: (order: Order) => void;
}

export default function Transactions({
  orders,
  onDeleteOrder,
  onRecordPayment,
  onSelectInvoice
}: TransactionsProps) {
  // Filters State elements
  const [searchQuery, setSearchQuery] = useState('');
  const [chronologyFilter, setChronologyFilter] = useState('ALL'); // ALL, DAILY, MONTHLY, YEARLY
  const [complianceFilter, setComplianceFilter] = useState('ALL'); // ALL, PAID, DUE
  const [errorMsg, setErrorMsg] = useState('');

  // Payment deposition dialog state
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [additionalPaymentAmount, setAdditionalPaymentAmount] = useState(0);

  const today = new Date();

  // 1. Process Multi-stage Multi-dimensional Custom Searches and chronological filters
  const filteredOrders = orders.filter(o => {
    // Stage A: Search matcher
    const matchQuery = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchQuery) return false;

    // Stage B: Chronological matching
    const oDate = new Date(o.date);
    if (chronologyFilter === 'DAILY') {
      const isToday = 
        oDate.getDate() === today.getDate() &&
        oDate.getMonth() === today.getMonth() &&
        oDate.getFullYear() === today.getFullYear();
      if (!isToday) return false;
    } else if (chronologyFilter === 'MONTHLY') {
      const isThisMonth = 
        oDate.getMonth() === today.getMonth() &&
        oDate.getFullYear() === today.getFullYear();
      if (!isThisMonth) return false;
    } else if (chronologyFilter === 'YEARLY') {
      const isThisYear = oDate.getFullYear() === today.getFullYear();
      if (!isThisYear) return false;
    }

    // Stage C: Paid / Due compliance matching
    if (complianceFilter === 'PAID') {
      return o.dueAmount === 0;
    } else if (complianceFilter === 'DUE') {
      return o.dueAmount > 0;
    }

    return true;
  });

  const handleOpenPaymentDialog = (o: Order) => {
    setPayingOrder(o);
    setAdditionalPaymentAmount(o.dueAmount); // default to remaining due balance
    setErrorMsg('');
  };

  const handleTriggerPaymentDeposition = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!payingOrder) return;
      if (additionalPaymentAmount < 0) throw new Error("পরিশোধিত অর্থ শূন্য বা ঋণাত্মক হতে পারবে না।");
      if (additionalPaymentAmount > payingOrder.dueAmount) {
        throw new Error(`পরিশোধের সীমা অতিক্রম করেছে: বকেয়া পাওনা ৳${payingOrder.dueAmount.toFixed(2)} এর বেশি নেওয়া সম্ভব নয়।`);
      }

      onRecordPayment(payingOrder.id, additionalPaymentAmount);
      setPayingOrder(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTriggerDeleteSale = (id: string) => {
    if (window.confirm(`আপনি কি এই অর্ডার ইনভয়েস '${id}' বাতিল করতে চান? এটি স্টক পুনরায় ক্যাটালগে ফেরত পাঠাবে।`)) {
      try {
        onDeleteOrder(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : String(err));
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-50 font-sans">
      
      {/* 1. Module Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-t-xl border-x border-t border-slate-200 shrink-0 shadow-sm select-none">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-blue-600">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
              বিক্রয় ও ইনভয়েস সাধারণ খতিয়ান
            </h2>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              পণ্য বিক্রির রসিদ, নগদ পরিশোধ, বকেয়া এবং লেনদেনের তারিখভিত্তিক তালিকা প্যানেল।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Advanced Multi-stage Filters Control Bar */}
      <div className="bg-white border-x border-slate-205 border-slate-205 border-slate-200 p-4 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200 select-none shadow-sm">
        
        {/* A. Search matching input */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase">লেনদেন তালিকা অনুসন্ধান</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input 
              type="text"
              placeholder="কাস্টমারের নাম, কোড বা ইনভয়েস নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-850 text-slate-800 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-320 border-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-450 font-medium"
            />
          </div>
        </div>

        {/* B. Date Chronology Filters */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase">নির্দিষ্ট সময়সীমা</label>
          <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-202 border-slate-200 text-[11px] font-semibold text-slate-600">
            {[
              { id: 'ALL', label: 'সব লেনদেন' },
              { id: 'DAILY', label: 'আজ' },
              { id: 'MONTHLY', label: 'এই মাস' },
              { id: 'YEARLY', label: 'এই বছর' }
            ].map(period => (
              <button
                key={period.id}
                onClick={() => setChronologyFilter(period.id)}
                className={`flex-1 py-1 px-1 rounded-md transition uppercase text-center text-[10px] cursor-pointer ${chronologyFilter === period.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-200 hover:text-slate-805'}`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* C. Paid / Due compliance filters */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase">পরিশোধের অবস্থা</label>
          <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-202 border-slate-200 text-[11px] font-semibold text-slate-650">
            {[
              { id: 'ALL', label: 'সব অবস্থা' },
              { id: 'PAID', label: 'পরিশোধিত' },
              { id: 'DUE', label: 'বকেয়া' }
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setComplianceFilter(status.id)}
                className={`flex-1 py-1 px-1.5 rounded-md transition uppercase text-center text-[10px] cursor-pointer ${complianceFilter === status.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-200 hover:text-slate-805'}`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Real Table data logs */}
      <div className="flex-1 bg-white border-x border-b border-slate-200 rounded-b-xl overflow-y-auto shadow-sm select-none">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-slate-700 select-text min-w-[780px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 text-center">অর্ডার আইডি</th>
                  <th className="py-3 px-4">ক্রেতা / কাস্টমার</th>
                  <th className="py-3 px-4">পণ্যের বিবরণ</th>
                  <th className="py-3 px-4 text-center">পরিমাণ</th>
                  <th className="py-3 px-4 text-right">মোট মূল্য (৳)</th>
                  <th className="py-3 px-4 text-right font-sans font-bold">নগদ পরিশোধ (৳)</th>
                  <th className="py-3 px-4 text-right">বকেয়া পাওনা (৳)</th>
                  <th className="py-3 px-4 text-center">ইনভয়েস তারিখ</th>
                  <th className="py-3 px-4 text-center font-sans font-bold">অবস্থা</th>
                  <th className="py-3 px-4 text-right">প্রশাসনিক অপশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr 
                    key={o.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-mono text-blue-600 font-bold">{o.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{o.customerName}</td>
                    <td className="py-3 px-4 text-slate-650 text-slate-600 max-w-[140px] truncate">{o.productName}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-550 text-slate-500">{o.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-800">৳{o.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">৳{o.paidAmount.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right font-mono font-extrabold ${o.dueAmount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      ৳{o.dueAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-500">
                      {new Date(o.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      {o.dueAmount === 0 ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-50 border border-emerald-250 border-emerald-100 text-emerald-700 font-bold uppercase leading-none">
                          <CheckCircle size={10} />
                          <span>পরিশোধিত</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[10px] bg-rose-50 border border-rose-100 text-rose-700 font-bold uppercase leading-none animate-pulse">
                          <Clock size={10} />
                          <span>বকেয়া</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 font-sans">
                      {/* Print ticket action btn */}
                      <button 
                        onClick={() => onSelectInvoice(o)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition inline-flex items-center cursor-pointer"
                        title="রসিদ প্রিন্ট করুন"
                      >
                        <Printer size={13} />
                      </button>
   
                      {/* Settle due cash btn */}
                      {o.dueAmount > 0 && (
                        <button 
                          onClick={() => handleOpenPaymentDialog(o)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-600 transition inline-flex items-center cursor-pointer"
                          title="বকেয়া পরিশোধ সম্পন্ন করুন"
                        >
                          <CreditCard size={13} />
                        </button>
                      )}
   
                      {/* Cancel order cascade */}
                      <button 
                        onClick={() => handleTriggerDeleteSale(o.id)}
                        className="p-1 hover:bg-rose-50 rounded text-slate-500 hover:text-rose-600 transition inline-flex items-center cursor-pointer"
                        title="লেনদেন বাতিল করুন এবং স্টক পুনরুদ্ধার করুন"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center space-y-2 text-slate-455 select-none">
            <FileText className="text-slate-305 text-slate-350" size={32} />
            <p className="uppercase text-[9px] tracking-wider font-semibold font-sans">কোনো লেনদেন রেকর্ড পাওয়া যায়নি।</p>
          </div>
        )}
      </div>

      {/* RE-ENTRY RECORD ADDITIONAL DUE SETTLEMENT PAYMENT MODAL */}
      {payingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs z-[999] p-4 animate-fadeIn select-none">
          <form 
            onSubmit={handleTriggerPaymentDeposition}
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-lg p-6 text-slate-705 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setPayingOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 hover:text-slate-600 transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center uppercase font-sans">
                <CreditCard className="mr-2 text-blue-600" size={15} /> বকেয়া পরিশোধ সম্পন্ন করুন
              </h3>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 p-2.5 text-rose-700 text-[10px] rounded-lg font-semibold font-sans">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2.5 text-xs leading-normal bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
              <p>🧾 <span className="text-slate-505 font-bold">ইনভয়েস:</span> <strong className="text-slate-800 font-extrabold font-mono">{payingOrder.id}</strong></p>
              <p>👤 <span className="text-slate-505 font-bold">কাস্টমার:</span> <strong className="text-slate-800 font-bold">{payingOrder.customerName}</strong></p>
              <p>৳ <span className="text-slate-505 font-bold">বর্তমান বকেয়া পাওনা:</span> <strong className="text-rose-600 font-extrabold font-mono">৳{payingOrder.dueAmount.toFixed(2)}</strong></p>
            </div>

            <div className="font-sans">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">নতুন নগদ জমার পরিমাণ *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs select-none">৳</span>
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={payingOrder.dueAmount}
                  required
                  value={additionalPaymentAmount}
                  onChange={(e) => setAdditionalPaymentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-50 pl-7 pr-3 py-2 text-xs text-slate-850 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 select-text font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2 justify-end text-xs font-bold font-sans">
              <button 
                type="button"
                onClick={() => setPayingOrder(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-4 py-2 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition cursor-pointer"
              >
                জমা নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
