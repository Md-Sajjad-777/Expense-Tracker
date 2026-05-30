/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calculator, 
  FileText, 
  Briefcase, 
  BarChart, 
  Unlock,
  Key,
  Database as DbIcon,
  UserCheck,
  Layout,
  Terminal,
  Clock,
  LogOut,
  Mail,
  User,
  Menu,
  X
} from 'lucide-react';

// Core Business Models & DB Manager
import { db } from './lib/Database';
import { Customer, Product, Order, Expense } from './lib/models';

// Desktop GUI Components
import WindowFrame from './components/WindowFrame';
import PhoenixLogo from './components/PhoenixLogo';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import POS from './components/POS';
import Transactions from './components/Transactions';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import InvoiceModal from './components/InvoiceModal';

export default function App() {
  // 1. Authentication System States
  const [registeredAdmins, setRegisteredAdmins] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('erp_registered_admins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('erp_logged_in') === 'true';
  });

  const [currentUsername, setCurrentUsername] = useState<string>(() => {
    return localStorage.getItem('erp_current_username') || 'প্রধান প্রশাসক';
  });

  const [currentRole, setCurrentRole] = useState('অ্যাডমিন');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle between 'login' and 'signup' based on whether admins are registered
  const [authView, setAuthView] = useState<'login' | 'signup'>(() => {
    const storedAdmins = localStorage.getItem('erp_registered_admins');
    if (storedAdmins) {
      try {
        const parsed = JSON.parse(storedAdmins);
        if (parsed && parsed.length > 0) {
          return 'login';
        }
      } catch {}
    }
    return 'signup';
  });

  // Login variables
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up variables
  const [signupNickname, setSignupNickname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // 2. Database Synchronization States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // 3. App navigation Tab Panels State
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, customers, inventory, pos, transactions, expenses, reports

  // Selected Invoice modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Ref for file loading
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with database layers
  const syncStateWithDB = () => {
    setCustomers(db.customers);
    setProducts(db.products);
    setOrders(db.orders);
    setExpenses(db.expenses);
  };

  useEffect(() => {
    syncStateWithDB();
  }, []);

  // 4. Admin Auth validation
  const handleAuthLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const idInput = loginId.trim().toLowerCase();
    const pwInput = loginPassword;

    if (!idInput || !pwInput) {
      setAuthError('অনুগ্রহ করে আপনার ডাকনাম/ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    // Verify against only currently registered admins
    const foundAdmin = registeredAdmins.find(
      (admin) =>
        admin.nickname.toLowerCase() === idInput || admin.email.toLowerCase() === idInput
    );

    if (foundAdmin && foundAdmin.password === pwInput) {
      setCurrentUsername(foundAdmin.nickname);
      setCurrentRole('অ্যাডমিন');
      localStorage.setItem('erp_logged_in', 'true');
      localStorage.setItem('erp_current_username', foundAdmin.nickname);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('অননুমোদিত: ভুল ডাকনাম/ইমেইল আইডি বা পাসওয়ার্ড। শুধুমাত্র নিবন্ধিত অ্যাকাউন্ট লগইন করতে পারবে।');
    }
  };

  // Sign Up Admin Handler
  const handleAdminSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const nickname = signupNickname.trim();
    const email = signupEmail.trim().toLowerCase();
    const password = signupPassword;
    const confirmPassword = signupConfirmPassword;

    if (!nickname || !email || !password || !confirmPassword) {
      setAuthError('অনুগ্রহ করে সকল তথ্য সঠিকভাবে প্রদান করুন।');
      return;
    }

    if (!email.includes('@')) {
      setAuthError('ভুল ইমেইল প্যাটার্ন: অনুগ্রহ করে একটি সঠিক ইমেইল আইডি প্রদান করুন।');
      return;
    }

    if (password.length < 4) {
      setAuthError('নিরাপত্তার স্বার্থে পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('পাসওয়ার্ড দুটি সমান হতে হবে। মিল পাওয়া যায়নি!');
      return;
    }

    // Check if nickname or email is already registered
    const exists = registeredAdmins.some(
      (admin) => admin.nickname.toLowerCase() === nickname.toLowerCase() || admin.email.toLowerCase() === email
    );

    if (exists) {
      setAuthError('এই ডাকনাম (Nickname) বা ইমেইল আইডি ইতিমধ্যে নিবন্ধিত রয়েছে!');
      return;
    }

    const newAdmin = { nickname, email, password };
    const updatedAdmins = [...registeredAdmins, newAdmin];
    setRegisteredAdmins(updatedAdmins);
    localStorage.setItem('erp_registered_admins', JSON.stringify(updatedAdmins));

    // Clear signup variables
    setSignupNickname('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');

    // Set success and log in automatically
    setAuthSuccess('অ্যাডমিন রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!');
    localStorage.setItem('erp_logged_in', 'true');
    localStorage.setItem('erp_current_username', nickname);
    setCurrentUsername(nickname);
    setIsAuthenticated(true);
    setAuthView('login');
  };

  // Quick-Login tester assistant
  const executeQuickLogin = () => {
    let admins = [...registeredAdmins];
    let activeAdmin = admins.find(a => a.nickname.toLowerCase() === 'admin' || a.email.toLowerCase() === 'admin@erp.com');
    
    if (!activeAdmin) {
      // Create user
      activeAdmin = {
        nickname: 'admin',
        email: 'admin@erp.com',
        password: 'password123'
      };
      admins.push(activeAdmin);
      setRegisteredAdmins(admins);
      localStorage.setItem('erp_registered_admins', JSON.stringify(admins));
    }

    setLoginId('admin');
    setLoginPassword('password123');
    setCurrentUsername(activeAdmin.nickname);
    setCurrentRole('অ্যাডমিন');
    localStorage.setItem('erp_logged_in', 'true');
    localStorage.setItem('erp_current_username', activeAdmin.nickname);
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('erp_logged_in');
    localStorage.removeItem('erp_current_username');
    setLoginId('');
    setLoginPassword('');
    setActiveTab('dashboard');
  };

  // --- CRUD WRAPPERS ---
  // A. CUSTOMER ACTION ledgers
  const addCustomerHandler = (name: string, phone: string, address: string) => {
    db.addCustomer(name, phone, address);
    syncStateWithDB();
  };

  const updateCustomerHandler = (id: string, name: string, phone: string, address: string) => {
    db.updateCustomer(id, name, phone, address);
    syncStateWithDB();
  };

  const deleteCustomerHandler = (id: string) => {
    db.deleteCustomer(id);
    syncStateWithDB();
  };

  // B. PRODUCTS ACTION catalog
  const addProductHandler = (name: string, quantity: number, price: number, cost: number) => {
    db.addProduct(name, quantity, price, cost);
    syncStateWithDB();
  };

  const updateProductHandler = (id: string, name: string, quantity: number, price: number, cost: number) => {
    db.updateProduct(id, name, quantity, price, cost);
    syncStateWithDB();
  };

  const deleteProductHandler = (id: string) => {
    db.deleteProduct(id);
    syncStateWithDB();
  };

  // C. SALES ORDER checkout execution
  const placeOrderHandler = (customerId: string, productId: string, quantity: number, paidAmount: number) => {
    const placedOrder = db.placeOrder(customerId, productId, quantity, paidAmount);
    syncStateWithDB();
    
    // Auto invoice loading modal (Bonus feature #11)
    setSelectedInvoiceOrder(placedOrder);
    return placedOrder;
  };

  const deleteOrderHandler = (orderId: string) => {
    db.deleteOrder(orderId);
    syncStateWithDB();
  };

  const recordPaymentHandler = (orderId: string, additionalAmount: number) => {
    db.recordPayment(orderId, additionalAmount);
    syncStateWithDB();
  };

  // D. BUSINESS EXPENSES
  const addExpenseHandler = (category: string, description: string, amount: number) => {
    db.addExpense(category, description, amount);
    syncStateWithDB();
  };

  const deleteExpenseHandler = (id: string) => {
    db.deleteExpense(id);
    syncStateWithDB();
  };

  // E. BACKUP RECOVERY CHANNELS (Section 10 File Handling Requirement)
  const triggerDatabaseBackupJSONDownload = () => {
    const dbBackupRawStr = db.generateBackup();
    const blob = new Blob([dbBackupRawStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", `ERP_SQLite_JSONBackup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    alert("সিস্টেমের সফল ব্যাকআপ সম্পন্ন হয়েছে: ব্যাকআপ ফাইলটি ডাউনলোড করা হয়েছে।");
  };

  const triggerDatabaseRestoreBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        db.restoreBackup(fileContent);
        syncStateWithDB();
        alert("ফাইল থেকে ডাটাবেজ সফলভাবে পুনরুদ্ধার করা হয়েছে।");
      } catch (err) {
        alert(err instanceof Error ? err.message : "ব্যাকআপ ফাইল লোড করতে সমস্যা হয়েছে...");
      }
    };
    fileReader.readAsText(file);
    // Overwrite target value for multiple selections
    e.target.value = '';
  };

  const triggerDatabaseIntegrityPurge = () => {
    if (window.confirm("জরুরী সতর্কতা: এটি সমস্ত কাস্টমার, প্রোডাক্ট ইনভয়েস এবং সমস্ত রেকর্ড সম্পূর্ণ মুছে ফেলবে। আপনি কি নিশ্চিত?")) {
      db.purgeAll();
      syncStateWithDB();
      alert("ইআরপি ডাটাবেজ সম্পূর্ণ মুছে ফেলা হয়েছে।");
    }
  };

  const handleNavToPayDue = (orderId: string) => {
    setActiveTab('transactions');
  };

  // Render Sidebar Navigation tabs details
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            customers={customers}
            products={products}
            orders={orders}
            expenses={expenses}
            onNavigate={(tag) => setActiveTab(tag)}
            onPayDue={handleNavToPayDue}
          />
        );
      case 'customers':
        return (
          <Customers 
            customers={customers}
            onAdd={addCustomerHandler}
            onUpdate={updateCustomerHandler}
            onDelete={deleteCustomerHandler}
          />
        );
      case 'inventory':
        return (
          <Inventory 
            products={products}
            onAdd={addProductHandler}
            onUpdate={updateProductHandler}
            onDelete={deleteProductHandler}
          />
        );
      case 'pos':
        return (
          <POS 
            customers={customers}
            products={products}
            onPlaceOrder={placeOrderHandler}
            onNavigate={(tag) => setActiveTab(tag)}
          />
        );
      case 'transactions':
        return (
          <Transactions 
            orders={orders}
            onDeleteOrder={deleteOrderHandler}
            onRecordPayment={recordPaymentHandler}
            onSelectInvoice={(orderObj) => setSelectedInvoiceOrder(orderObj)}
          />
        );
      case 'expenses':
        return (
          <Expenses 
            expenses={expenses}
            onAdd={(cat, desc, amt) => {
              addExpenseHandler(cat, desc, amt);
            }}
            onDelete={(id) => {
              deleteExpenseHandler(id);
            }}
          />
        );
      case 'reports':
        return (
          <Reports 
            customers={customers}
            products={products}
            orders={orders}
            expenses={expenses}
            onBackup={triggerDatabaseBackupJSONDownload}
            onRestore={triggerDatabaseRestoreBackupUpload}
            onPurge={triggerDatabaseIntegrityPurge}
            onLoadSeeds={() => {
              // Re-seed DB defaults
              localStorage.removeItem('sales_expense_db');
              // trigger refresh
              window.location.reload();
            }}
          />
        );
      default:
        return <div className="text-slate-500 uppercase font-mono p-6">কাজ চলছে...</div>;
    }
  };

  // 5. Secure Admin Login Screen if not authenticated
  if (!isAuthenticated) {
    const hasRegisteredAdmins = registeredAdmins.length > 0;

    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-slate-50 text-slate-800 select-none font-sans p-4 antialiased overflow-y-auto">
        <div className="bg-white border border-slate-200 max-w-md w-full p-8 rounded-xl shadow-xl relative space-y-6 flex flex-col justify-between my-auto">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <PhoenixLogo size={128} className="mb-2" />
            </div>
            <h2 className="text-slate-900 font-extrabold text-lg tracking-wider uppercase">সোহেল এন্ড সাহা এন্টারপ্রাইজ</h2>
            
            {authView === 'signup' ? (
              <div>
                <p className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">
                  অ্যাডমিন সাইন-আপ (রেজিস্ট্রেশন)
                </p>
                <p className="text-[10px] text-slate-400 mt-1">প্রথমবার ব্যবহারের জন্য একটি অ্যাডমিন অ্যাকাউন্ট নিবন্ধন করুন</p>
              </div>
            ) : (
              <div>
                <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                  প্রশাসনিক লগইন যাচাইকরণ
                </p>
                <p className="text-[10px] text-slate-400 mt-1">নিবন্ধিত ডাকনাম/ইমেইল এবং পাসওয়ার্ড প্রদান করুন</p>
              </div>
            )}
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-700 text-xs font-mono select-text leading-relaxed">
              ⚠️ <span className="font-semibold">{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-xs font-sans leading-relaxed">
              ✓ <span className="font-semibold">{authSuccess}</span>
            </div>
          )}

          {authView === 'signup' ? (
            /* Sign Up View */
            <form onSubmit={handleAdminSignup} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">অ্যাডমিন ডাকনাম (Nickname) *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="text"
                    required
                    placeholder="যেমন: yusuf"
                    value={signupNickname}
                    onChange={(e) => setSignupNickname(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">ইমেইল আইডি (Email ID) *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="email"
                    required
                    placeholder="যেমন: admin@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">নিরাপত্তা পাসওয়ার্ড *</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">পাসওয়ার্ড নিশ্চিত করুন *</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 font-bold text-white text-[11px] uppercase tracking-widest py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-1"
              >
                রেজিস্ট্রেশন সম্পন্ন এবং সাইন আপ করুন
              </button>
            </form>
          ) : (
            /* Login View */
            <form onSubmit={handleAuthLogin} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">ডাকনাম অথবা ইমেইল আইডি *</label>
                <div className="relative">
                  <Unlock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="text"
                    required
                    placeholder="যেমন: yusuf বা admin@gmail.com"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">নিরাপত্তা পাসওয়ার্ড *</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[11px] uppercase tracking-widest py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-1"
              >
                নিরাপত্তা শংসাপত্র পরীক্ষা করে লগইন করুন
              </button>
            </form>
          )}

          {/* Toggle login vs signup buttons layout */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs">
            {hasRegisteredAdmins ? (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500">
                  {authView === 'login' ? 'সিস্টেমে অ্যাডমিন অ্যাকাউন্ট ইতিমধ্যে নিবন্ধিত রয়েছে।' : 'আপনার যদি একটি বিদ্যমান অ্যাকাউন্ট থাকে:'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthView(authView === 'login' ? 'signup' : 'login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-blue-600 hover:text-blue-500 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  {authView === 'login' ? '± নতুন অ্যাডমিন অ্যাকাউন্ট রেজিস্ট্রেশন করুন' : '→ বিদ্যমান অ্যাকাউন্ট দিয়ে লগইন করুন'}
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-200 text-amber-800 text-[10px] leading-normal font-sans">
                💡 সিস্টেমে বর্তমানে কোনো অ্যাডমিন অ্যাকাউন্ট নিবন্ধিত নেই। প্রথমবার ব্যবহারের খতিয়ান তৈরি করতে উপরে আপনার উপযুক্ত <strong>ডাকনাম (Nickname)</strong>, <strong>ইমেইল আইডি</strong> এবং <strong>পাসওয়ার্ড</strong> দিয়ে প্রথম অ্যাডমিন অ্যাকাউন্টটি রেজিস্টার করুন।
              </div>
            )}
          </div>



        </div>
      </div>
    );
  }

  // 6. Primary Certified Desktop Workspace Panel
  const coreStats = {
    customersCount: customers.length,
    productsCount: products.length,
    ordersCount: orders.length,
    expensesCount: expenses.length
  };

  return (
    <WindowFrame
      userRole={currentRole}
      userName={currentUsername}
      databaseStats={coreStats}
      onLogout={handleLogout}
      onBackup={triggerDatabaseBackupJSONDownload}
      onRestore={() => fileInputRef.current?.click()}
    >
      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop for mobile navigation menu */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Workspace Menu sidebar Navigation */}
        <div className={`fixed inset-y-0 left-0 z-50 w-60 bg-slate-900 border-r border-slate-850 flex flex-col justify-between shrink-0 select-none text-slate-300 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="py-2 space-y-1">
            
            {/* Beautiful Phoenix Logo Brand Header */}
            <div className="px-4 py-3 border-b border-slate-800 mb-3 flex flex-col items-center text-center space-y-2 bg-slate-950/40 relative">
              {/* Close button for mobile inside drawer */}
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-lg md:hidden hover:bg-slate-800 cursor-pointer"
                title="ড্রয়ার বন্ধ করুন"
              >
                <X size={16} />
              </button>
              <PhoenixLogo size={68} />
              <div className="space-y-0.5">
                <span className="text-white text-[11px] font-bold tracking-wider block">সোহেল এন্ড সাহা এন্টারপ্রাইজ</span>
                <span className="text-[9px] font-mono tracking-wider uppercase text-slate-500 block">অ্যাডমিন ইআরপি প্যানেল</span>
              </div>
            </div>

            <div className="px-5 pb-2 flex items-center space-x-2 text-slate-400">
              <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 font-bold">আয় ব্যয় এবং লেনদেন</span>
            </div>

            {/* Nav List */}
            {[
              { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
              { id: 'pos', label: 'বিক্রয়', icon: Calculator },
              { id: 'transactions', label: 'লেনদেন দেখুন', icon: FileText },
              { id: 'customers', label: 'গ্রাহক সমূহ', icon: Users },
              { id: 'inventory', label: 'প্রোডাক্ট স্টক (ইনভেন্টরি)', icon: Package },
              { id: 'expenses', label: 'ব্যবসায়িক খরচ', icon: Briefcase },
              { id: 'reports', label: 'অডিট ও ব্যাকআপ', icon: BarChart }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold hover:bg-slate-800 text-left transition select-none cursor-pointer ${isActive ? 'bg-slate-800 text-white font-bold border-l-4 border-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
                >
                  <span className="flex items-center space-x-3">
                    <Icon size={14} className={isActive ? "text-blue-500" : "text-slate-500"} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats side info panel */}
          <div className="p-4 bg-slate-950/20 border-t border-slate-800 space-y-2 text-slate-400">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase select-none">
              <span>নিরাপত্তা রোল:</span>
              <span className="text-blue-400 font-bold">{currentRole}</span>
            </div>
            
            <div className="space-y-1 select-none">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-550 text-slate-400">মোট স্টক:</span>
                <span className="text-slate-200 font-semibold">{products.reduce((s, p) => s + p.quantity, 0)} টি পণ্য</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-550 text-slate-400">মোট অর্ডার:</span>
                <span className="text-slate-200 font-semibold">{orders.length} টি অর্ডার</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 rounded-lg py-2 text-[10px] font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={11} />
              <span>সিস্টেম লগআউট</span>
            </button>
          </div>
        </div>

        {/* Hidden File Backup input */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={triggerDatabaseRestoreBackupUpload}
          accept=".json"
          className="hidden"
        />

        {/* Workspace Display content area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          
          {/* Mobile responsive navigation top bar */}
          <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 text-white px-4 py-3 shrink-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center space-x-2 text-xs font-semibold select-none cursor-pointer text-slate-200 hover:text-white transition"
              title="মেনু টিপুন"
            >
              <Menu size={15} />
              <span>মেনু</span>
            </button>
            <div className="flex items-center space-x-2">
              <PhoenixLogo size={24} />
              <span className="text-xs font-extrabold tracking-wider bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-450 bg-clip-text text-transparent uppercase font-sans">
                সোহেল এন্ড সাহা
              </span>
            </div>
            {/* Transparent placeholder to balance layout */}
            <div className="w-8"></div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {renderTabContent()}
          </div>
        </div>

      </div>

      {/* Invoice modal visualizer overlay */}
      {selectedInvoiceOrder && (
        <InvoiceModal 
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </WindowFrame>
  );
}
