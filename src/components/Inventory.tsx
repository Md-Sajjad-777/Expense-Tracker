/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  AlertCircle,
  TrendingUp,
  CircleAlert
} from 'lucide-react';
import { Product } from '../lib/models';

interface InventoryProps {
  products: Product[];
  onAdd: (name: string, quantity: number, price: number, cost: number) => void;
  onUpdate: (id: string, name: string, quantity: number, price: number, cost: number) => void;
  onDelete: (id: string) => void;
}

export default function Inventory({
  products,
  onAdd,
  onUpdate,
  onDelete
}: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setQuantity(0);
    setPrice(0);
    setCost(0);
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProd(p);
    setName(p.name);
    setQuantity(p.quantity);
    setPrice(p.price);
    setCost(p.cost);
    setErrorMsg('');
  };

  const handleTriggerAdd = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim()) throw new Error("পণ্যের নাম আবশ্যক।");
      if (quantity < 0) throw new Error("প্রাথমিক স্টক পরিমাণ ঋণাত্মক হতে পারবে না।");
      if (price < 0) throw new Error("বিক্রয় মূল্য ঋণাত্মক হতে পারবে না।");
      if (cost < 0) throw new Error("উৎপাদন/ক্রয় খরচ ঋণাত্মক হতে পারবে না।");

      onAdd(name, quantity, price, cost);
      setShowAddModal(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTriggerUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingProd) return;
      if (!name.trim()) throw new Error("পণ্যের নাম আবশ্যক।");
      if (quantity < 0) throw new Error("স্টক পরিমাণ ঋণাত্মক হতে পারবে না।");
      if (price < 0) throw new Error("বিক্রয় মূল্য ঋণাত্মক হতে পারবে না।");
      if (cost < 0) throw new Error("উৎপাদন/ক্রয় খরচ ঋণাত্মক হতে পারবে না।");

      onUpdate(editingProd.id, name, quantity, price, cost);
      setEditingProd(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTriggerDelete = (id: string) => {
    if (window.confirm(`আপনি কি পণ্য '${id}' স্থায়ীভাবে মুছে ফেলতে চান? এটি ডাটাবেজের নিখুঁত নিরাপত্তা যাচাই করবে।`)) {
      try {
        onDelete(id);
        setErrorMsg('');
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : String(err));
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-50 font-sans">
      
      {/* 1. Header Toolbar Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-t-xl border-x border-t border-slate-202 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-xl border border-blue-105 text-blue-600">
            <Package size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
              পণ্য স্টক এবং ক্যাটালগ তালিকা
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
              পণ্য স্টক স্তর, লভ্যাংশ এবং মূল্য নির্ধারণের সমীকরণ সরাসরি পরিচালনা করুন।
            </p>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-1.5 self-start sm:self-center cursor-pointer transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* 2. Operations Alert Message Bar */}
      {errorMsg && (
        <div className="bg-rose-50 border-x border-rose-200 px-4 py-2 text-xs flex items-center space-x-2 text-rose-750 shrink-0 select-text font-medium text-rose-700">
          <AlertCircle size={14} className="text-rose-605" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Search Bar and Status count */}
      <div className="bg-slate-50 border-x border-slate-202 px-4 py-3 shrink-0 flex items-center gap-2 border-b border-slate-200/55">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={14} />
          <input 
            type="text"
            placeholder="কোড বা পণ্যের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <span className="text-[10px] font-mono text-slate-500 ml-auto">
          তালিকাভুক্ত পণ্য: {filteredProducts.length}টি
        </span>
      </div>

      {/* 4. Core Catalog Grid Table */}
      <div className="flex-1 bg-white border-x border-b border-slate-202 rounded-b-xl overflow-y-auto shadow-sm">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-slate-650 min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider font-sans">
                  <th className="py-3 px-4 text-center">পণ্যের আইডি</th>
                  <th className="py-3 px-4">পণ্যের বিবরণ</th>
                  <th className="py-3 px-4 text-center">স্টক (পরিমাণ)</th>
                  <th className="py-3 px-4 text-right">ইউনিট খরচ (৳)</th>
                  <th className="py-3 px-4 text-right">বিক্রয় মূল্য (৳)</th>
                  <th className="py-3 px-4 text-center">লভ্যাংশ হার</th>
                  <th className="py-3 px-4 text-center">স্টক অবস্থা</th>
                  <th className="py-3 px-4 text-right">প্রশাসনিক অপশনসমূহ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const markup = p.cost > 0 ? ((p.price - p.cost) / p.cost) * 100 : 0;
                  
                  // Determine stock alerts level (Standard requirement #3 & #9)
                  let badgeClass = "bg-emerald-50 border border-emerald-250 text-emerald-700 font-bold";
                  let badgeLabel = "পর্যাপ্ত স্টক";
                  if (p.quantity === 0) {
                    badgeClass = "bg-rose-50 border border-rose-200 text-rose-705 font-bold animate-pulse";
                    badgeLabel = "স্টক শেষ";
                  } else if (p.quantity <= 5) {
                    badgeClass = "bg-amber-50 border border-amber-200 text-amber-705 font-bold";
                    badgeLabel = "কম স্টক";
                  }

                  return (
                    <tr 
                      key={p.id} 
                      className="border-b border-slate-100 hover:bg-slate-55/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono text-blue-600 font-bold">{p.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">{p.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">৳{p.cost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-600 font-bold">৳{p.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600 text-[11px]">
                        <div className="flex items-center justify-center space-x-1.5">
                          <TrendingUp size={11} className="text-emerald-600" />
                          <span className="font-semibold text-slate-650">+{markup.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${badgeClass}`}>
                          {badgeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-slate-800 transition-colors cursor-pointer inline-flex items-center"
                          title="Edit Details"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => handleTriggerDelete(p.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-450 hover:text-rose-605 transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Product"
                        >
                          <Trash2 size={12} className="text-slate-400 hover:text-rose-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
            <div className="p-4 text-center text-slate-400 py-12">
              <Package className="mx-auto text-slate-300 mb-2 animate-bounce" size={32} />
              <p className="uppercase text-[10px] tracking-wider font-mono">কোনো পণ্য নিবন্ধিত পাওয়া যায়নি।</p>
            </div>
        )}
      </div>

      {/* CREATE PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[999] p-4 animate-fadeIn">
          <form 
            onSubmit={handleTriggerAdd}
            className="bg-white border border-slate-205 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-800 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center uppercase">
                <Plus className="mr-2 text-blue-650" size={16} /> ক্যাটালগে নতুন পণ্য যোগ করুন
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">পণ্যের নাম *</label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: ওয়্যারলেস মাউস"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">স্টক পরিমাণ *</label>
                  <input 
                     type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ইউনিট খরচ (৳) *</label>
                  <input 
                     type="number"
                    step="0.01"
                    min="0"
                    required
                    value={cost}
                    onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input 
                     type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 justify-end text-xs font-semibold">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-100 hover:bg-slate-205 text-slate-700 rounded-lg px-4 py-2 transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition-colors shadow-sm cursor-pointer"
              >
                পণ্য সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE PRODUCT DETAILS MODAL */}
      {editingProd && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[999] p-4 animate-fadeIn">
          <form 
            onSubmit={handleTriggerUpdate}
            className="bg-white border border-slate-205 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-800 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setEditingProd(null)}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-650 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-blue-650 flex items-center uppercase">
                <Edit2 className="mr-2 text-blue-500" size={14} /> পণ্যের তথ্য পরিবর্তন: {editingProd.id}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">পণ্যের নাম *</label>
                <input 
                  type="text"
                  required
                  placeholder="পণ্যের নাম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">বর্তমান স্টক *</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ইউনিট খরচ (৳)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={cost}
                    onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">বিক্রয় মূল্য (৳)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 justify-end text-xs font-bold">
              <button 
                type="button"
                onClick={() => setEditingProd(null)}
                className="bg-slate-100 hover:bg-slate-205 text-slate-700 rounded-lg px-4 py-2 transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition-colors cursor-pointer shadow-sm"
              >
                পরিবর্তন নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
