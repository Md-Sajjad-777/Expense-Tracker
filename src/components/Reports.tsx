/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useRef } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Download, 
  Upload, 
  FileText, 
  BarChart, 
  History, 
  AlertCircle,
  Database,
  ArrowRight,
  ShieldAlert,
  Save,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { 
  Customer, 
  Product, 
  Order, 
  Expense, 
  FinancialSummaryReport, 
  CustomerAnalyticsReport, 
  InventoryReport 
} from '../lib/models';

interface ReportsProps {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPurge: () => void;
  onLoadSeeds: () => void;
}

export default function Reports({
  customers,
  products,
  orders,
  expenses,
  onBackup,
  onRestore,
  onPurge,
  onLoadSeeds
}: ReportsProps) {
  
  // 1. Polymorphic Report Instantiations (Strict OOP Polymorphism Requirement #10)
  const financialSummaryObj = new FinancialSummaryReport();
  const customerAnalyticsObj = new CustomerAnalyticsReport();
  const inventoryReportObj = new InventoryReport();

  const finance = financialSummaryObj.generate({ customers, products, orders, expenses });
  const clientAnalytics = customerAnalyticsObj.generate({ customers, products, orders, expenses });
  const catalogDemand = inventoryReportObj.generate({ customers, products, orders, expenses });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download client analytical summary in CSV/Excel simulation format
  const exportClientsToCSV = () => {
    const header = "কাস্টমার আইডি,নাম,ফোন নম্বর,মোট ক্রয়কৃত পণ্য,মোট মূল্য (৳),পরিশোধিত মূল্য (৳),বকেয়া পাওনা (৳)\n";
    const rows = clientAnalytics.map(c => 
      `"${c.id}","${c.name}","${c.phone}",${c.itemsCount},${c.totalSpent.toFixed(2)},${c.totalPaid.toFixed(2)},${c.totalDue.toFixed(2)}`
    ).join("\n");
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `গ্রাহক_খতিয়ান_রিপোর্ট_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stockStatusTranslations: Record<string, string> = {
    'Out of Stock': 'স্টক শেষ',
    'Low Stock': 'কম স্টক',
    'In Stock': 'পর্যাপ্ত স্টক'
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50 font-sans">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-white border border-slate-205 border-slate-200 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm select-none">
        <div className="space-y-1">
          <h2 className="text-sm font-extrabold tracking-wider uppercase text-slate-900 flex items-center space-x-2">
            <BarChart className="text-blue-600" size={18} />
            <span>বিশ্লেষণাত্মক রিপোর্ট ও ডাটাবেস কন্ট্রোল প্যানেল</span>
          </h2>
          <p className="text-xs text-slate-500">
            মোট লাভ/ক্ষতি, পরিচালন ব্যয়, ইনভেন্টরি টার্নওভার এবং ডাটাবেস ব্যাকআপ পরিচালনার প্যানেল।
          </p>
        </div>

        <button 
          onClick={exportClientsToCSV}
          className="bg-blue-600 hover:bg-blue-500 font-bold px-4 py-2 text-xs rounded-lg transition text-white flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <FileText size={13} />
          <span>কাস্টমার রিপোর্ট এক্সপোর্ট করুন (.CSV)</span>
        </button>
      </div>

      {/* 2. Complete Financial Summary Breakdown (Section 6 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* A. Business Sales & Margin Ledger */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>ব্যবসা লভ্যাংশ ও পরিচালন হিসাব বিবরণী</span>
            <span className="text-[10px] text-blue-600 font-sans font-bold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-105 border-blue-100 leading-none">খতিয়ান সারসংক্ষেপ</span>
          </h3>

          <div className="space-y-3 font-mono text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-505 font-bold font-sans">ক. সর্বমোট বিক্রয় আয়:</span>
              <span className="text-blue-600 font-extrabold text-sm">৳{finance.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">খ. পণ্যের ক্রয়মূল্য ব্যয়:</span>
              <span className="text-slate-800 font-medium">-৳{finance.totalSalesCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-blue-600">
              <span className="font-bold font-sans">গ. মোট মুনাফা:</span>
              <span className="font-extrabold">৳{finance.grossProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 text-rose-600">
              <span className="text-slate-500 font-sans">ঘ. পরিচালন ব্যয়:</span>
              <span className="font-medium">-৳{finance.totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-205 pt-2.5">
              <span className="text-slate-850 font-extrabold font-sans">ঙ. চূড়ান্ত নিট লাভ বা ক্ষতি:</span>
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg font-sans ${finance.netProfit >= 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-250 border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                ৳{finance.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* B. Receivables & Balances Ledger */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>অপরিশোধিত ও বকেয়া পাওনা হিসাব</span>
            <span className="text-[10px] text-rose-700 font-sans font-bold bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100 leading-none">তারল্য অবস্থা</span>
          </h3>

          <div className="space-y-3 font-mono text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">সর্বমোট অর্ডার বুকিং:</span>
              <span className="text-slate-800 font-bold">৳{finance.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-705 text-emerald-700">
              <span className="text-slate-505 font-sans">নগদ আদায়কৃত টাকা:</span>
              <span className="font-extrabold">৳{finance.totalPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-rose-600">
              <span className="font-bold text-slate-500 font-sans">মোট অপরিশোধিত বকেয়া:</span>
              <span className="text-sm font-extrabold">৳{finance.totalDue.toFixed(2)}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] font-sans font-semibold leading-relaxed border border-slate-200 text-slate-500">
              ⚡ বকেয়া আদায় সূচক: <span className="font-mono text-blue-600 font-bold">{finance.totalSales > 0 ? ((finance.totalPaid / finance.totalSales) * 100).toFixed(1) : 100}%</span> রসিদের পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।
            </div>
          </div>
        </div>
        {/* C. Database Portability Backup Options (Requirement #10 File Handling) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm select-none">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>স্থায়ী ব্যাকআপ ও ডাটাবেস ইউটিলিটি</span>
            <span className="text-[10px] text-indigo-650 text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md leading-none font-sans font-bold">লোকাল কম্পিউটার</span>
          </h3>
 
          <div className="space-y-3 text-xs leading-normal font-sans">
            
            {/* Download db JSON */}
            <button 
              onClick={onBackup}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-slate-705 text-slate-700 font-bold transition cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <Download size={13} className="text-blue-600" />
                <span>ডাটাবেস ব্যাকআপ ডাউনলোড করুন (.JSON)</span>
              </span>
              <ArrowRight size={10} className="text-slate-400" />
            </button>
 
            {/* Restore db JSON */}
            <div className="relative">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={onRestore}
                accept=".json"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-slate-705 text-slate-700 font-bold transition cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <Upload size={13} className="text-blue-600" />
                  <span>ব্যাকআপ ফাইল পুনরুদ্ধার করুন</span>
                </span>
                <ArrowRight size={10} className="text-slate-400" />
              </button>
            </div>

            {/* reset and purge settings */}
            <div className="flex gap-2">
              <button 
                onClick={onPurge}
                className="flex-1 text-[10px] bg-rose-50 hover:bg-rose-100 border border-rose-205 border-rose-200 text-rose-700 py-2.5 rounded-lg transition uppercase font-sans font-bold cursor-pointer"
              >
                সব তথ্য মুছুন
              </button>
              <button 
                onClick={onLoadSeeds}
                className="flex-1 text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 py-2.5 rounded-lg transition uppercase font-sans font-bold cursor-pointer"
              >
                ডেমো ডাটা লোড করুন
              </button>
            </div>
            
          </div>
        </div>
      </div>      {/* 3. Detailed Client analytical columns (Section 6 per customer report) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm select-none">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase flex items-center space-x-2">
            <Users className="text-blue-600" size={15} />
            <span>কাস্টমারভিত্তিক আর্থিক খতিয়ান তালিকা</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">ব্যক্তিগত কাস্টমারের মোট কেনাকাটার পরিমাণ, পরিশোধিত অর্থ এবং বকেয়া পাওনার হিসাব।</p>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-705">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-205 text-slate-700 font-sans font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">কাস্টমারের নাম</th>
                <th className="py-3 px-4 text-center">কাস্টমার আইডি</th>
                <th className="py-3 px-4 text-center">মোট অর্ডার</th>
                <th className="py-3 px-4 text-right">মোট কেনাকাটা (৳)</th>
                <th className="py-3 px-4 text-right">মোট পরিশোধ (৳)</th>
                <th className="py-3 px-4 text-right">বকেয়া পাওনা (৳)</th>
                <th className="py-3 px-4 text-center">অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {clientAnalytics.map(c => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800 select-text">{c.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-500">{c.id}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-500">{c.itemsCount}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">৳{c.totalSpent.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-605 text-emerald-600 font-bold">৳{c.totalPaid.toFixed(2)}</td>
                  <td className={`py-3 px-4 text-right font-mono font-extrabold ${c.totalDue > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    ৳{c.totalDue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    {c.totalDue === 0 ? (
                      <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-705 text-emerald-750 font-bold text-[9px] px-2.5 py-0.5 rounded-lg uppercase leading-none">
                        সম্পূর্ণ পরিশোধিত
                      </span>
                    ) : (
                      <span className="inline-block bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[9px] px-2.5 py-0.5 rounded-lg uppercase leading-none animate-pulse">
                        বকেয়া আছে
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>      {/* 4. Inventory Turnover Columns */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm select-none">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase flex items-center space-x-2">
            <Package className="text-blue-600" size={15} />
            <span>পণ্যের চাহিদা ও ইনভেন্টরি টার্নওভার বিবরণী</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">পণ্যের বিক্রয় চাহিদার হার এবং ওয়্যারহাউজের বর্তমান স্টক পরিমাণের অনুপাত।</p>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-705">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-205 text-slate-705 text-slate-700 font-sans font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">পণ্যের বিবরণ</th>
                <th className="py-3 px-4 text-center font-sans font-bold">পণ্য কোড/আইডি</th>
                <th className="py-3 px-4 text-center font-sans font-bold">ওয়্যারহাউজের স্টক সংখ্যা</th>
                <th className="py-3 px-4 text-center font-sans font-bold">বিক্রিত পরিমাণ</th>
                <th className="py-3 px-4 text-right font-sans font-bold">অর্জিত মোট রাজস্ব (৳)</th>
                <th className="py-3 px-4 text-center font-sans font-bold">স্টক অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {catalogDemand.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800 select-text">{p.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-500">{p.id}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">{p.currentStock}</td>
                  <td className="py-3 px-4 text-center font-sans text-blue-650 text-blue-600 font-bold">{p.unitsSold}টি</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600">৳{p.totalRevenue.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span className={`inline-block font-sans text-[9px] font-bold px-2.5 py-0.5 rounded-lg border uppercase ${
                      p.stockStatus === "Out of Stock" 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : p.stockStatus === 'Low Stock' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {stockStatusTranslations[p.stockStatus] || p.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
