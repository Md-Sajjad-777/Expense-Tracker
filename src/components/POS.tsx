/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calculator, 
  User, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import { Customer, Product, Order } from '../lib/models';

interface POSProps {
  customers: Customer[];
  products: Product[];
  onPlaceOrder: (customerId: string, productId: string, quantity: number, paidAmount: number) => Order;
  onNavigate: (tab: string) => void;
}

export default function POS({
  customers,
  products,
  onPlaceOrder,
  onNavigate
}: POSProps) {
  // POS Checkout forms state
  const [selectedCustId, setSelectedCustId] = useState('');
  const [selectedProdId, setSelectedProdId] = useState('');
  const [sellQty, setSellQty] = useState(1);
  const [paidAmt, setPaidAmt] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Auto-complete filters states
  const [custSearch, setCustSearch] = useState('');
  const [prodSearch, setProdSearch] = useState('');
  const [showCustDropdown, setShowCustDropdown] = useState(false);
  const [showProdDropdown, setShowProdDropdown] = useState(false);

  // Matching selections
  const selectedProduct = products.find(p => p.id === selectedProdId);
  const selectedCustomer = customers.find(c => c.id === selectedCustId);

  // Computations
  const unitPrice = selectedProduct?.price || 0;
  const grossTotal = unitPrice * sellQty;
  const remainingDue = Math.max(0, grossTotal - paidAmt);

  // Filter lists based on incremental search text
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(custSearch.toLowerCase()) || 
    c.id.toLowerCase().includes(custSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
    p.id.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustId(c.id);
    setCustSearch(c.name);
    setShowCustDropdown(false);
  };

  const handleSelectProduct = (p: Product) => {
    setSelectedProdId(p.id);
    setProdSearch(p.name);
    setPaidAmt(0); // reset paid to default the standard pricing
    setSellQty(p.quantity > 0 ? 1 : 0);
    setShowProdDropdown(false);
    setErrorMsg('');
  };

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedCustId) throw new Error("অনুগ্রহ করে একজন নিবন্ধিত কাস্টমার নির্বাচন করুন।");
      if (!selectedProdId) throw new Error("অনুগ্রহ করে একটি সঠিক ক্যাটালগ পণ্য নির্বাচন করুন।");
      if (sellQty <= 0) throw new Error("বিক্রয়ের সংখ্যা অবশ্যই ১ বা তার বেশি হতে হবে।");
      if (!selectedProduct) throw new Error("পণ্যের তথ্য রেফারেন্স ব্যর্থ হয়েছে।");
      
      if (selectedProduct.quantity < sellQty) {
        throw new Error(`পর্যাপ্ত স্টক নেই: মাত্র ${selectedProduct.quantity}টি পণ্য বাকি আছে।`);
      }

      // Execute transaction cascade
      const placed = onPlaceOrder(selectedCustId, selectedProdId, sellQty, paidAmt);
      
      // Seed details
      setSuccessOrder(placed);
      setErrorMsg('');

      // Hard reset POS register state elements
      setSelectedCustId('');
      setSelectedProdId('');
      setCustSearch('');
      setProdSearch('');
      setSellQty(1);
      setPaidAmt(0);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleResetRegister = () => {
    setSelectedCustId('');
    setSelectedProdId('');
    setCustSearch('');
    setProdSearch('');
    setSellQty(1);
    setPaidAmt(0);
    setSuccessOrder(null);
    setErrorMsg('');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 overflow-y-auto md:overflow-hidden bg-slate-50 font-sans">
      
      {/* LEFT PANEL: DIRECT POS TRANSACTIONS CONTROLLER */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 flex flex-col overflow-y-auto space-y-4 shadow-sm">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Calculator className="text-blue-600" size={18} />
            <span className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">সক্রিয় ক্যাশ রেজিস্টার (POS)</span>
          </div>
          <button 
            type="button"
            onClick={handleResetRegister}
            className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-sans hover:bg-slate-100 px-2 py-1 rounded cursor-pointer"
          >
            <RefreshCw size={11} className="animate-hover-spin" />
            <span>রেজিস্টার রিসেট</span>
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-700 text-xs flex items-center space-x-2 font-sans font-semibold">
            <AlertTriangle className="shrink-0 text-rose-600 animate-pulse" size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successOrder && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-emerald-800 text-xs flex flex-col space-y-2 font-sans animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              <span className="font-bold uppercase text-emerald-950">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</span>
            </div>
            <p className="text-[11px] text-slate-600">
              ইনভয়েস নম্বর <span className="text-blue-600 font-bold font-mono">{successOrder.id}</span> সফলভাবে ডাটাবেজে নথিবদ্ধ হয়েছে এবং স্টক আপডেট সম্পন্ন হয়েছে।
            </p>
            <div className="flex space-x-2 pt-1 font-semibold">
              <button 
                onClick={() => setSuccessOrder(null)}
                className="bg-emerald-600 hover:bg-emerald-750 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer"
              >
                সতর্কবার্তা সরান
              </button>
              <button 
                onClick={() => onNavigate('transactions')}
                className="text-blue-600 hover:underline text-[10px] font-bold self-center cursor-pointer"
              >
                লেনদেনের বিবরণ দেখুন ➔
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitSale} className="space-y-4">
          
          {/* A. Customer Select Auto-complete UI */}
          <div className="relative">
            <label className="block text-[10px] font-extrabold text-slate-505 uppercase mb-1 flex items-center justify-between font-sans">
              <span>বিল কাস্টমার রেকর্ড *</span>
              <button 
                type="button" 
                onClick={() => onNavigate('customers')}
                className="text-blue-600 hover:underline flex items-center cursor-pointer"
              >
                <Plus size={10} className="mr-0.5" /> নতুন কাস্টমার নিবন্ধন
              </button>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="কাস্টমারের নাম বা আইডি লিখুন..."
                value={custSearch}
                onFocus={() => setShowCustDropdown(true)}
                onChange={(e) => {
                  setCustSearch(e.target.value);
                  setSelectedCustId('');
                  setShowCustDropdown(true);
                }}
                className="w-full bg-slate-50 text-slate-800 pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              />
            </div>

            {/* Dropdown matched rows */}
            {showCustDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl max-h-40 overflow-y-auto z-50 py-1 text-xs">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomer(c)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between border-b border-slate-100 text-slate-700 font-sans cursor-pointer"
                    >
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-blue-605 font-bold font-mono">{c.id}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-slate-400 font-sans">মিল পাওয়া যায়নি। কাস্টমার রেজিস্টার থেকে যোগ করুন।</div>
                )}
              </div>
            )}
          </div>

          {/* B. Product Select Auto-complete UI */}
          <div className="relative">
            <label className="block text-[10px] font-extrabold text-slate-505 uppercase mb-1 font-sans">পণ্য নির্বাচন করুন *</label>
            <div className="relative">
              <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="পণ্যের নাম বা আইডি কোড লিখুন..."
                value={prodSearch}
                onFocus={() => setShowProdDropdown(true)}
                onChange={(e) => {
                  setProdSearch(e.target.value);
                  setSelectedProdId('');
                  setShowProdDropdown(true);
                }}
                className="w-full bg-slate-50 text-slate-800 pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              />
            </div>

            {/* Dropdown product lists */}
            {showProdDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl max-h-40 overflow-y-auto z-50 py-1 text-xs">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      disabled={p.quantity === 0}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between border-b border-slate-100 cursor-pointer ${p.quantity === 0 ? 'bg-slate-50 opacity-40 cursor-not-allowed' : 'hover:bg-blue-50 text-slate-705'}`}
                    >
                      <div className="flex flex-col font-sans">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="text-[10px] text-slate-500">উপলব্ধ: {p.quantity}টি</span>
                      </div>
                      <span className="text-[11px] text-blue-600 font-bold font-mono">৳{p.price.toFixed(2)}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-slate-400 font-sans">কোনো পণ্য পাওয়া যায়নি।</div>
                )}
              </div>
            )}
          </div>

          {/* C. Stock checks & Quantity input */}
          {selectedProduct && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-sans">
              <div>
                <p className="text-slate-600 font-medium">উপলব্ধ স্টক: <span className="font-bold text-slate-900">{selectedProduct.quantity}টি</span></p>
                <p className="text-slate-505 text-[10px] mt-0.5">খুচরা ইউনিট মূল্য: <span className="font-bold text-blue-600 font-mono">৳{selectedProduct.price.toFixed(2)}</span></p>
              </div>
              {selectedProduct.quantity <= 5 && (
                <span className="flex items-center text-amber-700 text-[10px] bg-amber-50 px-2.5 py-0.5 border border-amber-200 rounded-lg font-bold">
                  <AlertTriangle size={11} className="mr-1 text-amber-600" />
                  <span>স্টক কম রয়েছে</span>
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-550 uppercase mb-1 font-sans">বিক্রয়ের সংখ্যা *</label>
              <input 
                type="number"
                min="1"
                required
                disabled={!selectedProdId}
                max={selectedProduct?.quantity || 999}
                value={sellQty}
                onChange={(e) => setSellQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Set Payment Deposited Amount */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-550 uppercase mb-1 flex justify-between font-sans">
                <span>পরিশোধিত অর্থের পরিমাণ *</span>
                <button
                  type="button"
                  onClick={() => setPaidAmt(grossTotal)}
                  className="text-[9px] text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  [সম্পূর্ণ পরিশোধ]
                </button>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs select-none">৳</span>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  max={grossTotal}
                  required
                  disabled={!selectedProdId}
                  value={paidAmt}
                  onChange={(e) => setPaidAmt(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-50 pl-7 pr-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={!selectedCustId || !selectedProdId || sellQty <= 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg py-2.5 text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 uppercase tracking-wider cursor-pointer mt-2"
          >
            <span>নিবন্ধন সম্পন্ন করুন</span>
          </button>
        </form>

      </div>      {/* RIGHT PANEL: LIVE ORDER INVOICE TICKET PREVIEWER */}
      <div className="w-full md:w-80 bg-slate-100 border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm font-sans">
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center space-x-2">
            <ShoppingBag className="text-slate-600" size={16} />
            <h3 className="text-xs font-bold text-slate-850 tracking-wider uppercase">সক্রিয় ইনভয়েস প্রিভিউ</h3>
          </div>          {/* Ticket Body details */}
          {selectedCustId && selectedProdId ? (
            <div className="space-y-4 font-mono text-xs text-slate-705 font-sans">
              
              <div className="bg-white border border-slate-200 p-3 rounded-lg space-y-2 leading-relaxed shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">চেকআউট বিবরণ</p>
                <div className="flex justify-between font-sans">
                  <span className="text-slate-500 text-[11px]">কাস্টমার বিল:</span>
                  <span className="font-extrabold text-slate-900">{selectedCustomer?.name}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span className="text-slate-500 text-[11px]">কাস্টমার কোড:</span>
                  <span className="font-bold text-slate-800">{selectedCustomer?.id}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span className="text-slate-500 text-[11px]">ট্যাক্স আইডি:</span>
                  <span className="text-slate-550">TX-{selectedCustomer?.id}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-lg space-y-2 leading-relaxed shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">পণ্যের বিভাজন</p>
                <div className="flex justify-between font-sans">
                  <span className="text-slate-505 text-[11px]">নির্বাচিত পণ্য:</span>
                  <span className="font-extrabold text-slate-900 max-w-[120px] truncate block text-right">{selectedProduct?.name}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span className="text-slate-500 text-[11px]">ইউনিট মূল্য:</span>
                  <span className="font-bold text-slate-800">৳{unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span className="text-slate-500 text-[11px]">মোট পরিমাণ:</span>
                  <span className="font-extrabold text-slate-800">× {sellQty}টি</span>
                </div>
              </div>

              {/* Aggregated sums */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 font-sans shadow-sm">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>মোট ইনভয়েস পরিমাণ:</span>
                  <span className="text-blue-600 font-mono text-sm">৳{grossTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold text-xs border-b border-slate-105 pb-2">
                  <span className="text-slate-550">পরিশোধিত অর্থের পরিমাণ:</span>
                  <span className="font-mono">-৳{paidAmt.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between pt-1 font-extrabold ${remainingDue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  <span>বকেয়া পাওনা:</span>
                  <span className="text-sm font-mono">৳{remainingDue.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Alert Badge */}
              <div className="text-center pt-2 font-sans">
                {remainingDue === 0 ? (
                  <span className="inline-block bg-emerald-50 text-emerald-750 border border-emerald-205 rounded-lg font-bold text-[10px] px-3.5 py-1 uppercase tracking-widest leading-none">
                    ★★★ নগদ বিক্রয় সম্পূর্ণ পরিশোধিত ★★★
                  </span>
                ) : (
                  <span className="inline-block bg-rose-50 text-rose-700 border border-rose-205 rounded-lg font-bold text-[10px] px-3.5 py-1 uppercase tracking-widest animate-pulse leading-none">
                    ⚠️ সতর্কতা: বকেয়া হিসাব সক্রিয়
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center space-y-1.5 p-4 border border-dashed border-slate-300 bg-white rounded-lg text-slate-400 select-none shadow-sm">
              <ShoppingBag size={24} className="text-slate-300" />
              <p className="uppercase text-[9px] tracking-wider font-mono">ইনভয়েস প্রিভিউ নিষ্ক্রিয়।</p>
              <p className="text-[10px] font-sans">একটি সক্রিয় ইনভয়েস টিকিট প্রিভিউ দেখতে উপরে নিবন্ধিত কাস্টমার এবং পণ্য সিলেক্ট করুন।</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-205 text-[10px] text-slate-450 font-sans font-bold leading-normal text-center select-none uppercase">
          এন্টারপ্রাইজ ইআরপি পিഓএস v1.4
        </div>
      </div>
    </div>
  );
}
