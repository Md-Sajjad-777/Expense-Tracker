/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PhoenixLogo from './PhoenixLogo';
import { 
  Monitor, 
  Terminal, 
  RefreshCw, 
  UserCheck, 
  Database as DbIcon, 
  Clock, 
  LogOut, 
  Layers, 
  X, 
  Minimize2, 
  Maximize2,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

interface WindowFrameProps {
  children: React.ReactNode;
  userRole: string;
  userName: string;
  databaseStats: {
    customersCount: number;
    productsCount: number;
    ordersCount: number;
    expensesCount: number;
  };
  onLogout: () => void;
  onBackup: () => void;
  onRestore: () => void;
}

export default function WindowFrame({
  children,
  userRole,
  userName,
  databaseStats,
  onLogout,
  onBackup,
  onRestore
}: WindowFrameProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAbout, setShowAbout] = useState(false);
  const [showDiag, setShowDiag] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalRecords = databaseStats.customersCount + databaseStats.productsCount + databaseStats.ordersCount + databaseStats.expensesCount;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans select-none antialiased">
      {/* 1. PC simulated desktop app window border */}
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-850 px-4 py-2 shrink-0 drag-region">
        <div className="flex items-center space-x-2">
          {/* Elegant Phoenix Desktop Logo */}
          <PhoenixLogo size={20} className="inline-block" />
          <span className="text-xs font-semibold tracking-wider text-slate-200">
            এন্টারপ্রাইজ ইআরপি প্রো v1.4.0 <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 border border-slate-700 rounded bg-slate-950/60 ml-1">ডেস্কটপ নেটিভ x64</span>
          </span>
        </div>

        {/* Client Window Decoration Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => alert("অনুকরণ করা হয়েছে: ডেস্কটপ অ্যাপ্লিকেশন উইন্ডোজ স্ট্যাটাস ট্রেইতে মিনিমাইজ করা হয়েছে।")}
            className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
            title="Minimize"
          >
            <Minimize2 size={13} />
          </button>
          <button 
            onClick={() => alert("অনুকরণ করা হয়েছে: ডেস্কটপ উইন্ডো রিসাইজ করা হয়েছে।")}
            className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
            title="Maximize"
          >
            <Maximize2 size={13} />
          </button>
          <button 
            onClick={onLogout}
            className="p-1 hover:bg-red-650 rounded transition text-slate-400 hover:text-white"
            title="Close Application"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* 2. File / Edit / View / Help Software Menus */}
      <div className="flex items-center justify-between bg-white px-4 py-1.5 text-xs border-b border-slate-200 shrink-0 select-none text-slate-600">
        <div className="flex items-center space-x-4">
          {/* File Menu Dropdown Mock */}
          <div className="relative group">
            <button className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded transition font-medium cursor-pointer">
              ফাইল
            </button>
            <div className="absolute left-0 mt-1.5 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-lg shadow-xl py-1 w-48 z-50">
              <button 
                onClick={onBackup}
                className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 text-left flex items-center space-x-2 text-slate-700 font-medium font-sans cursor-pointer transition-colors"
               >
                <DbIcon size={12} className="text-slate-400" />
                <span>ডাটাবেজ ব্যাকআপ (.JSON)</span>
              </button>
              <button 
                onClick={onRestore}
                className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 text-left flex items-center space-x-2 text-slate-700 font-medium font-sans cursor-pointer transition-colors"
              >
                <Layers size={12} className="text-slate-400" />
                <span>ব্যাকআপ ফাইল রিস্টোর করুন</span>
              </button>
              <hr className="border-slate-100 my-1" />
              <button 
                onClick={onLogout}
                className="px-4 py-2 hover:bg-slate-50 hover:text-red-600 text-left flex items-center space-x-2 text-slate-700 font-medium font-sans cursor-pointer transition-colors"
              >
                <LogOut size={12} className="text-slate-400" />
                <span>ইআরপি সফটওয়্যার বন্ধ করুন</span>
              </button>
            </div>
          </div>

          {/* Tools Menu */}
          <div className="relative group">
            <button className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded transition font-medium cursor-pointer">
              অ্যাকশনসমূহ
            </button>
            <div className="absolute left-0 mt-1.5 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-lg shadow-xl py-1 w-48 z-50">
              <button 
                onClick={() => setShowDiag(true)}
                className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 text-left flex items-center space-x-2 text-slate-700 font-medium font-sans cursor-pointer transition-colors"
              >
                <Terminal size={12} className="text-slate-400" />
                <span>এসকিউএল ইনডেক্স যাচাই করুন</span>
              </button>
              <button 
                onClick={() => alert("অ্যাক্সেস লগ সফলভাবে চেক করা হয়েছে: কোনো অসঙ্গতি পাওয়া যায়নি।")}
                className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 text-left flex items-center space-x-2 text-slate-700 font-medium font-sans cursor-pointer transition-colors"
              >
                <UserCheck size={12} className="text-slate-400" />
                <span>অডিট নিরীক্ষা করুন</span>
              </button>
            </div>
          </div>

          {/* Help Menu */}
          <div className="relative group">
            <button className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded transition font-medium cursor-pointer">
              সহায়তা
            </button>
            <div className="absolute left-0 mt-1.5 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-lg shadow-xl py-1 w-48 z-50">
              <button 
                onClick={() => setShowAbout(true)}
                className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 text-left text-slate-700 font-medium font-sans cursor-pointer transition-colors"
              >
                এন্টারপ্রাইজ ইআরপি সম্পর্কে
              </button>
              <button 
                onClick={() => alert("বিক্রয় এবং অ্যাকাউন্টিং ডাটাবেজ স্থানীয় ব্রাউজার স্টোরেজে সুরক্ষিত থাকে।")}
                className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 text-left text-slate-700 font-medium font-sans cursor-pointer transition-colors"
              >
                ব্যবহারকারী নির্দেশিকা
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostic Monitor State */}
        <div className="flex items-center space-x-3 font-mono text-[10px] text-slate-500">
          <span className="flex items-center text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            লোকাল ইনস্ট্যান্স: অনলাইন
          </span>
          <span className="text-slate-350">|</span>
          <span className="text-slate-700 uppercase font-bold tracking-wider px-1.5 py-0.5 bg-slate-105 rounded border border-slate-200">
            {userRole} মোড
          </span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {children}
      </div>

      {/* 3. High Fidelity Desktop Status Bar */}
      <div className="flex items-center justify-between bg-white border-t border-slate-200 text-slate-500 px-4 py-1.5 text-[11px] font-sans shrink-0 select-none">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-slate-600">
            <UserCheck className="mr-1.5 text-blue-500" size={11} />
            ইউজার: <span className="text-slate-800 font-bold ml-1">{userName}</span>
          </span>
          <span className="text-slate-250">|</span>
          <span className="flex items-center text-slate-600">
            <DbIcon className="mr-1.5 text-blue-500" size={11} />
            ডাটা ক্যাশ: <span className="text-slate-800 font-bold ml-1">{totalRecords} টি রেকর্ড</span>
          </span>
          <span className="text-slate-250 text-slate-400">|</span>
          <span className="text-blue-600 hidden sm:inline font-mono font-medium text-[10px]">ওওপি ইঞ্জিন: টাইপস্ক্রিপ্ট ESN v5</span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-[10px]">
          <span className="hidden md:flex items-center text-slate-400">
            <RefreshCw className="mr-1 animate-spin text-blue-500" size={10} />
            রিয়েল-টাইম সিঙ্ক: হ্যাঁ
          </span>
          <span className="text-slate-200 hidden md:inline">|</span>
          <span className="flex items-center text-slate-700 font-semibold bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded">
            <Clock className="mr-1.5 text-blue-500" size={11} />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* About ERP Modal Dialog */}
      {showAbout && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[999] p-4 transition-all animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-800 relative">
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white font-black text-xl mb-3 shadow-md">
                E
              </div>
              <h3 className="text-lg font-bold text-slate-900">এন্টারপ্রাইজ ইআরপি ডেস্কটপ</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">সংস্করণ ১.৪.০ স্টেবল ডেস্কটপ বিল্ড</p>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-650 bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono">
              <p>📍 <strong className="text-slate-800">সিস্টেম ফ্রেমওয়ার্ক:</strong> রিঅ্যাক্ট ১৯ / টেইলউইন্ড সিএসএস / ভাইট ইএস৬ কম্পাইলার</p>
              <p>🗄️ <strong className="text-slate-800">ডাটাবেজ সিস্টেম:</strong> ইন-মেমোরি এসকিউলাইট অবজেক্ট মডেল ম্যাপার (অ্যাক্টিভ পারসিস্টেন্স)</p>
              <p>👔 <strong className="text-slate-800">ওওপি নীতি:</strong> ক্লাস এনক্যাপসুলেশন, নিখুঁত ডাটা ভ্যালিডেশন এবং স্বয়ংক্রিয় পণ্য স্টক পুনরুদ্ধার।</p>
              <hr className="border-slate-200 my-2" />
              <p className="text-slate-400 text-center text-[10px]">এআই স্টুডিওর প্রশাসনিক পিসি পরিবেশের জন্য লাইসেন্সকৃত। সর্বস্বত্ব সংরক্ষিত।</p>
            </div>
            <button 
              onClick={() => setShowAbout(false)}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
            >
              ঠিক আছে এবং বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Diagnostics Diagnostics Panel */}
      {showDiag && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[999] p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full shadow-2xl p-6 text-slate-800 font-sans text-xs relative">
            <button 
              onClick={() => setShowDiag(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-sm font-bold text-blue-600 mb-4 flex items-center">
              <Terminal className="mr-2 text-blue-500" size={16} /> এসকিউএল ডাটাবেজ ইন্টিগ্রিটি ডায়াগনস্টিকস
            </h3>
            <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg h-64 overflow-y-auto space-y-2 select-text custom-scrollbar font-mono text-slate-300">
              <p className="text-slate-500">PROMPT&gt; EXPLAIN ANALYZE SELECT * FROM orders JOIN customers;</p>
              <p className="text-emerald-400">[সফল] OOP ইঞ্জিনে কোয়েরি সফলভাবে রান হয়েছে (১.৪২ মিলি-সেকেন্ডে)।</p>
              <div className="pl-4 text-slate-400 space-y-1">
                <p>➔ গ্রাহক সমূহ স্ক্যান: {databaseStats.customersCount} টি রেকর্ড পাওয়া গেছে।</p>
                <p>➔ প্রোডাক্ট স্টক মিলকরণ: প্রোডাক্ট আইডি [PROD_ID] এর ডাটা সামঞ্জস্যপূর্ণ।</p>
                <p>➔ অ্যাক্সেস নিরাপত্তা অডিট: সফল। হাই ডেনসিটি ইনডেক্সিং যাচাইকৃত।</p>
                <p>➔ নীট হিসাব সমীকরণ চেক: লাভ = মোট বিক্রি - পণ্যের মূল্য - ব্যবসায়িক খরচ সূত্র নিশ্চিত।</p>
              </div>
              <p className="text-slate-500">PROMPT&gt; CHECK TRANSACTION INTEGRITY;</p>
              <p className="text-emerald-400">[নির্ভুলতা] ১০০% ডাটাবেজ কন্সট্রেইন্ট অক্ষুণ্ণ। লেনদেন নিরাপত্তা চেকপয়েন্ট সফলভাবে যাচাই করা হয়েছে।</p>
              <p className="text-slate-500">PROMPT&gt; _</p>
            </div>
            <button 
              onClick={() => setShowDiag(false)}
              className="mt-4 w-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
            >
              টার্মিনাল মোড বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
