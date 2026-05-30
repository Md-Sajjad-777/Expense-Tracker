/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Phone, 
  X,
  AlertCircle,
  Database
} from 'lucide-react';
import { Customer } from '../lib/models';

interface CustomersProps {
  customers: Customer[];
  onAdd: (name: string, phone: string, address: string) => void;
  onUpdate: (id: string, name: string, phone: string, address: string) => void;
  onDelete: (id: string) => void;
}

export default function Customers({
  customers,
  onAdd,
  onUpdate,
  onDelete
}: CustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCust, setEditingCust] = useState<Customer | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setAddress('');
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCust(c);
    setName(c.name);
    setPhone(c.phone);
    setAddress(c.address);
    setErrorMsg('');
  };

  const handleTriggerAdd = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim()) throw new Error("কাস্টমারের নাম আবশ্যক।");
      if (!phone.trim()) throw new Error("ফোন নম্বর আবশ্যক।");
      
      onAdd(name, phone, address);
      setShowAddModal(false);
      setName('');
      setPhone('');
      setAddress('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTriggerUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingCust) return;
      if (!name.trim()) throw new Error("কাস্টমারের নাম আবশ্যক।");
      if (!phone.trim()) throw new Error("ফোন নম্বর আবশ্যক।");

      onUpdate(editingCust.id, name, phone, address);
      setEditingCust(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTriggerDelete = (id: string) => {
    if (window.confirm(`আপনি কি কাস্টমার '${id}' স্থায়ীভাবে মুছে ফেলতে চান? এটি ডাটাবেজের নিখুঁত নিরাপত্তা যাচাই করবে।`)) {
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
      
      {/* 1. Header Toolbar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-t-xl border-x border-t border-slate-200 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 text-blue-600">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
              কাস্টমার রেজিস্ট্রি ডিরেক্টরি
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
              নতুন কাস্টমার যুক্ত, তথ্য আপডেট এবং কাস্টমার তালিকা সরাসরি পরিচালনা।
            </p>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-1.5 self-start sm:self-center cursor-pointer transition-colors shadow-sm"
        >
          <UserPlus size={14} />
          <span>নতুন কাস্টমার যুক্ত করুন</span>
        </button>
      </div>

      {/* 2. Operations Alert Message Bar */}
      {errorMsg && (
        <div className="bg-rose-50 border-x border-rose-200 px-4 py-2 text-xs flex items-center space-x-2 text-rose-750 shrink-0 select-text font-medium text-rose-700">
          <AlertCircle size={14} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Filter Table Search Input */}
      <div className="bg-slate-50 border-x border-slate-205 px-4 py-3 shrink-0 flex items-center gap-2 border-b border-slate-200/50">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text"
            placeholder="কাস্টমার আইডি, নাম বা ফোন নম্বর দিয়ে কাস্টমার খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <span className="text-[10px] font-mono text-slate-500 ml-auto">
          মিল পাওয়া গেছে: {filteredCustomers.length} জন কাস্টমার
        </span>
      </div>

      {/* 4. Core Customers Grid Table */}
      <div className="flex-1 bg-white border-x border-b border-slate-202 rounded-b-xl overflow-y-auto shadow-sm">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-slate-650 min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider font-sans">
                  <th className="py-3 px-4 text-center">কাস্টমার আইডি</th>
                  <th className="py-3 px-4">সম্পূর্ণ নাম</th>
                  <th className="py-3 px-4">ফোন নম্বর</th>
                  <th className="py-3 px-4 hidden md:table-cell">ঠিকানা / অবস্থান</th>
                  <th className="py-3 px-4 hidden xl:table-cell">নিবন্ধনের তারিখ</th>
                  <th className="py-3 px-4 text-right">প্রশাসনিক অপশনসমূহ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => (
                  <tr 
                    key={c.id} 
                    className="border-b border-slate-100 hover:bg-slate-55/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-mono text-blue-600 font-bold">{c.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-sans select-text flex items-center space-x-1.5">
                      <Phone className="text-slate-400 shrink-0" size={11} />
                      <span>{c.phone}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell max-w-xs truncate text-slate-550 font-sans select-text">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="text-slate-400 shrink-0" size={11} />
                        <span className="truncate">{c.address || 'নেই'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell text-slate-400 font-mono text-[10px]">
                      {c.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button 
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-slate-800 transition-colors cursor-pointer inline-flex items-center"
                        title="Update Customer Details"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleTriggerDelete(c.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-450 hover:text-rose-605 transition-colors cursor-pointer inline-flex items-center"
                        title="Delete Customer"
                      >
                        <Trash2 size={12} className="text-slate-400 hover:text-rose-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
            <div className="p-4 text-center text-slate-400 py-12">
              <Users className="mx-auto text-slate-300 mb-2 animate-bounce" size={32} />
              <p className="uppercase text-[10px] tracking-wider font-mono">ডাটাবেজে কোনো তথ্য মিল পাওয়া যায়নি।</p>
            </div>
        )}
      </div>

      {/* CREATE CUSTOMER MODAL */}
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
                <UserPlus className="mr-2 text-blue-650" size={16} /> নতুন কাস্টমার রেকর্ড তৈরি করুন
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">কাস্টমারের সম্পূর্ণ নাম *</label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: আবির রহমান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">যোগাযোগের ফোন নম্বর *</label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: ০১৮XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">বর্তমান/ব্যবসায়িক ঠিকানা</label>
                <textarea 
                  placeholder="রাস্তা নম্বর, এলাকা এবং জেলা..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                রেকর্ড সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE CUSTOMER DETAILS MODAL */}
      {editingCust && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[999] p-4 animate-fadeIn">
          <form 
            onSubmit={handleTriggerUpdate}
            className="bg-white border border-slate-205 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-800 relative space-y-4"
          >
            <button 
              type="button"
              onClick={() => setEditingCust(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-blue-650 flex items-center uppercase">
                <Edit2 className="mr-2 text-blue-500" size={14} /> কাস্টমারের তথ্য পরিবর্তন: {editingCust.id}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">নাম পরিবর্তন করুন *</label>
                <input 
                  type="text"
                  required
                  placeholder="আবির রহমান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ফোন নম্বর পরিবর্তন করুন *</label>
                <input 
                  type="text"
                  required
                  placeholder="০১৮XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ঠিকানা পরিবর্তন করুন</label>
                <textarea 
                  placeholder="নতুন ঠিকানা বিবরণ..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 px-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2 justify-end text-xs font-bold">
              <button 
                type="button"
                onClick={() => setEditingCust(null)}
                className="bg-slate-100 hover:bg-slate-205 text-slate-705 rounded-lg px-4 py-2 transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition-colors cursor-pointer"
              >
                তথ্য আপডেট করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
