/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  Trash2, 
  X,
  AlertCircle,
  Tag,
  Briefcase,
  Layers
} from 'lucide-react';
import { Expense } from '../lib/models';

interface ExpensesProps {
  expenses: Expense[];
  onAdd: (category: string, description: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export default function Expenses({
  expenses,
  onAdd,
  onDelete
}: ExpensesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [category, setCategory] = useState('Rent');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  const EXPENSE_CATEGORIES = [
    { id: 'Rent', label: 'ভাড়া (Rent)' },
    { id: 'Salary', label: 'বেতন (Salary)' },
    { id: 'Utilities', label: 'ইউটিলিটি বিল (Utilities)' },
    { id: 'Marketing', label: 'মার্কেটিং (Marketing)' },
    { id: 'Insurance', label: 'বীমা (Insurance)' },
    { id: 'Office Supplies', label: 'অফিস সাপ্লাই (Office Supplies)' },
    { id: 'Others', label: 'অন্যান্য (Others)' }
  ];

  const categoryMapByValue: Record<string, string> = {
    'Rent': 'ভাড়া (Rent)',
    'Salary': 'বেতন (Salary)',
    'Utilities': 'ইউটিলিটি বিল (Utilities)',
    'Marketing': 'মার্কেটিং (Marketing)',
    'Insurance': 'বীমা (Insurance)',
    'Office Supplies': 'অফিস সাপ্লাই (Office Supplies)',
    'Others': 'অন্যান্য (Others)'
  };

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpentVal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleOpenAdd = () => {
    setCategory('Rent');
    setDescription('');
    setAmount(0);
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleTriggerAdd = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!category) throw new Error("অনুগ্রহ করে খরচের হিসাবের ক্যাটাগরি উল্লেখ করুন।");
      if (amount <= 0) throw new Error("খরচের পরিমাণ অবশ্যই শূন্যের চেয়ে বেশি হতে হবে।");
      
      onAdd(category, description, amount);
      setShowAddModal(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTriggerDelete = (id: string) => {
    if (window.confirm(`আপনি কি এই খরচের হিসাবভুক্ত এন্ট্রি '${id}' মুছে ফেলতে চান? এটি পুনরায় মোট হিসাব গণনা করবে।`)) {
      onDelete(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-50 font-sans">
      
      {/* 1. Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-t-xl border-x border-t border-slate-200 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-blue-600">
            <Briefcase size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
              ব্যবসায়িক খরচের খতিয়ান কলামসমূহ
            </h2>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              পরিচালন ব্যয়, সাধারণ ক্যাটাগরি, ইউটিলিটি বিল এবং বেতনের হিসাব ট্র্যাকিং প্যানেল।
            </p>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold flex items-center justify-center space-x-1.5 self-start sm:self-center cursor-pointer transition shadow-sm"
        >
          <Plus size={14} />
          <span>নতুন খরচ যোগ করুন</span>
        </button>
      </div>

      {/* 2. Advanced aggregated visual score box */}
      <div className="bg-white border-x border-slate-200 px-4 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text"
            placeholder="খরচের বিবরণ বা ক্যাটাগরি লিখে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-805 pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-550 transition-all"
          />
        </div>
        <div className="bg-blue-50 border border-blue-105 rounded-lg p-2 flex items-center space-x-3 text-right max-w-xs shrink-0 select-none">
          <div className="font-sans text-xs font-semibold">
            <span className="text-slate-505 block text-[9px] uppercase font-extrabold">মোট অনিষ্পন্ন পরিচালন ব্যয়</span>
            <span className="text-blue-600 font-black text-sm font-mono">৳{totalSpentVal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 4. Table view registry rows */}
      <div className="flex-1 bg-white border-x border-b border-slate-200 rounded-b-xl overflow-y-auto shadow-sm">
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-slate-750 font-sans min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 text-center">খরচ আইডি</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">খরচের খতিয়ান বিবরণ</th>
                  <th className="py-3 px-4 text-right">মোট খরচ (৳)</th>
                  <th className="py-3 px-4 text-center">খরচের তারিখ</th>
                  <th className="py-3 px-4 text-right">প্রশাসনিক অপশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(e => (
                  <tr 
                    key={e.id} 
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors select-text"
                  >
                    <td className="py-3 px-4 text-center font-mono text-blue-600 font-bold">{e.id}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-205 text-slate-700">
                        <Tag size={10} className="text-blue-500" />
                        <span>{categoryMapByValue[e.category] || e.category}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 select-text pr-10">{e.description || 'সাধারণ ব্যবসায়িক খরচ।'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">৳{e.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-400 font-semibold font-bold">
                      {e.date.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleTriggerDelete(e.id)}
                        className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition inline-flex items-center cursor-pointer"
                        title="খরচ মুছে ফেলুন"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center space-y-2 text-slate-400 bg-white select-none">
            <Layers className="text-slate-300" size={32} />
            <p className="uppercase text-[9px] tracking-wider font-mono font-bold">কোনো খরচের রেকর্ড পাওয়া যায়নি।</p>
          </div>
        )}
      </div>

      {/* RECORD NEW EXPENSE FLOW MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 z-[1000] p-4 animate-fadeIn select-none backdrop-blur-xs">
          <form 
            onSubmit={handleTriggerAdd}
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-700 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center uppercase font-sans">
                <span className="mr-2 text-blue-600 font-bold" size={16}>৳</span> নতুন খরচের হিসাব লিপিবদ্ধকরণ
              </h3>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 p-2 text-rose-700 font-sans font-medium text-[10px] rounded-lg">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3.5">
              
              {/* Category Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 font-sans uppercase mb-1">খরচের অ্যাকাউন্ট ক্যাটাগরি *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Amount Inputs */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 font-sans uppercase mb-1">খরচের মোট মূল্য (৳) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs select-none">৳</span>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 pl-7 pr-3 py-1.5 text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono select-text"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 font-sans uppercase mb-1">খরচের বিস্তারিত নোট বা মেমো</label>
                <textarea 
                  placeholder="ভাড়া চুক্তি, ইউটিলিটি বিল, ইত্যাদির বিস্তারিত বিবরণ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

            </div>

            <div className="flex space-x-2 pt-2 justify-end text-xs font-bold">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-4 py-2 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition shadow-sm cursor-pointer"
              >
                খরচ জমা করুন
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
