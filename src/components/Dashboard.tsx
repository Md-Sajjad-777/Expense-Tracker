/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Customer, Product, Order, Expense, FinancialSummaryReport } from '../lib/models';

interface DashboardProps {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  onNavigate: (tab: string) => void;
  onPayDue: (orderId: string) => void;
}

export default function Dashboard({
  customers,
  products,
  orders,
  expenses,
  onNavigate,
  onPayDue
}: DashboardProps) {
  
  // 1. Calculate financials using polymorphic FinancialSummaryReport
  const financialReport = new FinancialSummaryReport();
  const summary = financialReport.generate({ customers, products, orders, expenses });

  // 2. Alert notifications: Low Stock & Payments Overdue
  const lowStockProducts = products.filter(p => p.quantity <= 5);
  const outstandingDueOrders = orders.filter(o => o.dueAmount > 0);

  // 3. Assemble charts monthly timelines
  // Group orders by date (Last 7 days or weeks for interactive lines)
  const salesByDate: Record<string, { dateStr: string; amount: number; cost: number; profit: number }> = {};
  
  // Let's seed date columns cleanly based on existing orders
  orders.forEach(o => {
    const dStr = o.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (!salesByDate[dStr]) {
      salesByDate[dStr] = { dateStr: dStr, amount: 0, cost: 0, profit: 0 };
    }
    salesByDate[dStr].amount += o.totalAmount;
    salesByDate[dStr].cost += o.quantity * o.costPerUnit;
    salesByDate[dStr].profit += o.profit;
  });

  const chartTimelineData = Object.values(salesByDate).slice(-7); // last 7 unique days of sales

  // Expense distribution category charts
  const expenseSummaryByCategory: Record<string, number> = {};
  expenses.forEach(e => {
    expenseSummaryByCategory[e.category] = (expenseSummaryByCategory[e.category] || 0) + e.amount;
  });

  const expensePieData = Object.entries(expenseSummaryByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const PIE_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#a855f7'];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Activity className="text-blue-600 animate-pulse" size={20} />
            <span>অপারেশনাল ড্যাশবোর্ড কনসোল</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            রিয়েল-টাইম আর্থিক সারসংক্ষেপ, কাস্টমার ট্রেন্ড এবং প্রশাসনিক বিজ্ঞপ্তি প্যানেল।
          </p>
        </div>
        <div className="text-xs bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-2 font-mono text-blue-600">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>মুনাফা হিসাবের সমীকরণ: মোট বিক্রি - উৎপাদন খরচ - ব্যবসায়িক খরচ</span>
        </div>
      </div>

      {/* 4 Critical KPI Grid Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Gross Sales */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">মোট বিক্রয়ের পরিমাণ</p>
            <p className="text-2xl font-black text-slate-900">৳{summary.totalSales.toFixed(2)}</p>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 font-semibold mt-1">
              <TrendingUp size={11} />
              <span>মূল লেনদেন প্রবাহ</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <DollarSign size={20} />
          </div>
        </div>

        {/* KPI 2: Total Outstanding Receivables / Due */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">বকেয়া পাওনা (DUE)</p>
            <p className={`text-2xl font-black ${summary.totalDue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              ৳{summary.totalDue.toFixed(2)}
            </p>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              মোট <span className="font-bold text-slate-700">{outstandingDueOrders.length}টি</span> বকেয়া ইনভয়েস থেকে
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle size={20} />
          </div>
        </div>

        {/* KPI 3: Global Customer Base */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">নিবন্ধিত কাস্টমার</p>
            <p className="text-2xl font-black text-slate-900">{customers.length}</p>
            <button 
              onClick={() => onNavigate('customers')}
              className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-0.5 mt-1 font-semibold cursor-pointer"
            >
              <span>ডিরেক্টরি পরিচালনা</span>
              <ArrowRight size={10} />
            </button>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
            <Users size={20} />
          </div>
        </div>

        {/* KPI 4: Financial Net Profit */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">নীট ব্যবসার লাভ</p>
            <p className={`text-2xl font-black ${summary.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ৳{summary.netProfit.toFixed(2)}
            </p>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              ব্যবসায়িক খরচ <span className="font-bold text-slate-700">৳{summary.totalExpenses.toFixed(2)}</span> বাদে
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Percent size={20} />
          </div>
        </div>
      </div>

      {/* Interactive Charts Matrix Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-255 rounded-xl p-5 flex flex-col h-80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
            সাম্প্রতিক বিক্রয় কর্মক্ষমতা টাইমলাইন
          </h3>
          <p className="text-[10px] text-slate-500 font-sans mb-4">মোট বিক্রয় (৳) এবং নীট লভ্যাংশের দৈনিক গ্রাফ</p>
          <div className="flex-1 w-full text-xs font-sans">
            {chartTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dateStr" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                    labelClassName="text-slate-800 font-semibold font-sans"
                  />
                  <Legend />
                  <Bar dataKey="amount" name="মোট রাজস্ব (বিক্রি)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="নীট মুনাফা" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                কোনো অর্ডার নেই। পয়েন্ট অব সেল (POS) ট্যাব থেকে বিক্রি শুরু করুন।
              </div>
            )}
          </div>
        </div>

        {/* Expenses Distribution Category-wise Pie Chart */}
        <div className="bg-white border border-slate-255 rounded-xl p-5 flex flex-col h-80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
            ব্যবসায়িক খরচের বিবরণ
          </h3>
          <p className="text-[10px] text-slate-505 font-sans mb-4">খরচের ক্যাটাগরি ভিত্তিক চিত্র (৳)</p>
          <div className="flex-1 w-full text-xs font-sans relative flex items-center justify-center">
            {expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                    labelClassName="text-slate-800 font-semibold font-sans"
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-450 uppercase text-center text-[10px] tracking-wider font-mono">
                খরচের কোনো রেকর্ড নেই। খরচের বিবরণ নতুন যোগ করুন!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Notification Feed Alert Drawer (Bonus Overdue payments + Low stock alerts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center space-x-2">
              <Package className="text-amber-500" size={15} />
              <span>কম পণ্য স্টক সতর্কতা</span>
            </h3>
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-mono px-2.5 py-0.5 rounded-full font-bold">
              {lowStockProducts.length}টি সতর্কবার্তা
            </span>
          </div>

          <div className="flex-1 max-h-56 overflow-y-auto space-y-2.5 custom-scrollbar text-xs">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">প্রোডাক্ট আইডি: {p.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${p.quantity === 0 ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
                      মাত্র {p.quantity}টি বাকি
                    </span>
                    <button 
                      onClick={() => onNavigate('inventory')}
                      className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline block mt-1 font-semibold cursor-pointer"
                    >
                      স্টক বাড়ান ➔
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                🚀 চমৎকার! সকল পণ্যের পর্যাপ্ত স্টক আছে।
              </div>
            )}
          </div>
        </div>

        {/* Due Payments Notification (With instant payback trigger) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center space-x-2">
              <AlertTriangle className="text-rose-500 animate-pulse" size={15} />
              <span>বকেয়া পাওনা সতর্কবার্তা লেজার</span>
            </h3>
            <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 font-mono px-2.5 py-0.5 rounded-full font-bold">
              {outstandingDueOrders.length}টি বকেয়া
            </span>
          </div>

          <div className="flex-1 max-h-56 overflow-y-auto space-y-2.5 custom-scrollbar text-xs border border-transparent">
            {outstandingDueOrders.length > 0 ? (
              outstandingDueOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{o.customerName}</span>
                      <span className="text-[10px] font-bold text-blue-600 font-mono">ইনভয়েস: {o.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">ক্রয়: {o.quantity}টি × {o.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-600 font-mono">৳{o.dueAmount.toFixed(2)} বকেয়া</p>
                    <button 
                      onClick={() => onPayDue(o.id)}
                      className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline mt-1 cursor-pointer font-sans"
                    >
                      বকেয়া পরিশোধ ➔
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                ⭐ অসাধারণ! কারো কোনো বকেয়া নেই।
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
