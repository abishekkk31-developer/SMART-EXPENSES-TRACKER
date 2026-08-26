'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Wallet, ArrowUpRight, ArrowDownLeft, ArrowDownRight,
  TrendingUp, ShieldCheck, BarChart3, Download, PlusCircle, Search, 
  Trash2, Sun, Moon, Camera, Users, CreditCard, Wifi, AlertTriangle, 
  Repeat, Layers, Check, Copy, X, Bot, Loader2, Receipt, Coffee,
  ShoppingCart, Smartphone, Tv, Car, Activity, Box, Compass, Zap, Tag
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', title: 'Apple Store NYC', amount: 1299.00, type: 'expense', category: 'Gadgets', date: '2026-08-25', time: '14:32', account: 'Platinum Card', status: 'completed', notes: 'MacBook M3 Pro upgrade' },
  { id: 'tx-2', title: 'Stripe Payout: SaaS Client', amount: 4850.00, type: 'income', category: 'Income', date: '2026-08-24', time: '09:15', account: 'Main Checking', status: 'completed', notes: 'Monthly retainer invoice #1084' },
  { id: 'tx-3', title: 'Whole Foods Market', amount: 142.30, type: 'expense', category: 'Groceries', date: '2026-08-23', time: '18:40', account: 'Apple Pay', status: 'completed', notes: 'Organic weekly groceries' },
  { id: 'tx-4', title: 'Netflix & Spotify Bundle', amount: 34.99, type: 'expense', category: 'Entertainment', date: '2026-08-22', time: '04:00', account: 'Platinum Card', status: 'completed', notes: 'Recurring auto-charge' },
  { id: 'tx-5', title: 'Uber Black Ride', amount: 58.75, type: 'expense', category: 'Transport', date: '2026-08-21', time: '22:10', account: 'Apple Pay', status: 'completed', notes: 'Airport pickup' },
  { id: 'tx-6', title: 'Equinox Gym Membership', amount: 260.00, type: 'expense', category: 'Health', date: '2026-08-19', time: '08:00', account: 'Main Checking', status: 'completed', notes: 'Monthly health club pass' },
  { id: 'tx-7', title: 'Figma Pro Annual', amount: 144.00, type: 'expense', category: 'Subscriptions', date: '2026-08-18', time: '11:20', account: 'Platinum Card', status: 'completed', notes: 'Design software workspace' },
  { id: 'tx-8', title: 'Dividend Yield: VOO ETF', amount: 312.40, type: 'income', category: 'Investments', date: '2026-08-15', time: '16:00', account: 'Investment Vault', status: 'completed', notes: 'Q3 Vanguard dividend' }
];

const CATEGORIES = [
  { name: 'Food & Dining', color: '#f59e0b', budget: 600, spent: 412 },
  { name: 'Groceries', color: '#10b981', budget: 500, spent: 342 },
  { name: 'Gadgets', color: '#6366f1', budget: 1500, spent: 1299 },
  { name: 'Entertainment', color: '#ec4899', budget: 200, spent: 185 },
  { name: 'Transport', color: '#06b6d4', budget: 350, spent: 220 },
  { name: 'Health', color: '#8b5cf6', budget: 300, spent: 260 },
  { name: 'Subscriptions', color: '#f97316', budget: 250, spent: 178 },
  { name: 'Travel', color: '#14b8a6', budget: 1200, spent: 890 },
  { name: 'Income', color: '#10b981', budget: 0, spent: 0 },
  { name: 'Investments', color: '#3b82f6', budget: 0, spent: 0 },
];

const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  INR: { symbol: '₹', rate: 86.5, label: 'INR (₹)' },
  JPY: { symbol: '¥', rate: 154.0, label: 'JPY (¥)' },
};

export default function SmartExpenseTracker() {
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart_expenses_txs');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    }
    return INITIAL_TRANSACTIONS;
  });

  const [theme, setTheme] = useState('dark');
  const [currency, setCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    account: 'Platinum Card', notes: ''
  });

  const [splitAmount, setSplitAmount] = useState('180');
  const [splitPeople, setSplitPeople] = useState('4');
  const [splitTip, setSplitTip] = useState('15');
  const [copiedSplit, setCopiedSplit] = useState(false);

  const [scanState, setScanState] = useState('idle');
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_expenses_txs', JSON.stringify(transactions));
    }
  }, [transactions]);

  const curr = CURRENCIES[currency] || CURRENCIES.USD;
  const formatMoney = (amountInUSD) => {
    const converted = amountInUSD * curr.rate;
    return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const metrics = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else expenses += Number(t.amount);
    });
    const balance = income - expenses + 22400;
    const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : '0.0';
    const dailySafeSpend = Math.max(0, ((income * 0.7 - expenses) / 10)).toFixed(0);
    return { income, expenses, balance, savingsRate, dailySafeSpend };
  }, [transactions]);

  const categoryStats = useMemo(() => {
    const stats = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      stats[t.category] = (stats[t.category] || 0) + Number(t.amount);
    });
    return stats;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedFilter === 'all' || t.type === selectedFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, selectedFilter, categoryFilter, sortBy]);

  const handleAiQuickAdd = () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    setAiFeedback(null);

    setTimeout(() => {
      const text = aiPrompt.toLowerCase();
      let amount = 25.00;
      const amountMatch = text.match(/\$?(\d+(\.\d{1,2})?)/);
      if (amountMatch) amount = parseFloat(amountMatch[1]);

      let type = text.includes('received') || text.includes('salary') || text.includes('income') || text.includes('freelance') ? 'income' : 'expense';
      let category = 'Food & Dining';

      if (type === 'income') category = 'Income';
      else if (text.includes('grocery') || text.includes('market') || text.includes('trader joe')) category = 'Groceries';
      else if (text.includes('uber') || text.includes('flight') || text.includes('gas')) category = 'Transport';
      else if (text.includes('netflix') || text.includes('spotify') || text.includes('movie')) category = 'Entertainment';
      else if (text.includes('apple') || text.includes('laptop') || text.includes('iphone')) category = 'Gadgets';
      else if (text.includes('hotel') || text.includes('airbnb') || text.includes('trip')) category = 'Travel';
      else if (text.includes('gym') || text.includes('doctor')) category = 'Health';

      let title = aiPrompt.replace(/(spent|paid|bought|received|at|for|\$?\d+(\.\d{1,2})?|yesterday|today|on)/gi, '').trim();
      title = title ? title.charAt(0).toUpperCase() + title.slice(1) : (type === 'income' ? 'Direct Deposit' : 'Card Expense');
      if (title.length > 30) title = title.substring(0, 30);

      const newTx = {
        id: 'tx-' + Date.now(),
        title,
        amount,
        type,
        category,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        account: type === 'income' ? 'Main Checking' : 'Platinum Card',
        status: 'completed',
        notes: `AI Auto-parsed: "${aiPrompt}"`
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsAiProcessing(false);
      setAiFeedback({ msg: `✨ Logged: ${type === 'income' ? '+' : '-'}$${amount} for "${title}" (${category})` });
      setAiPrompt('');
      setTimeout(() => setAiFeedback(null), 5000);
    }, 750);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const newTx = {
      id: 'tx-' + Date.now(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      account: formData.account,
      status: 'completed',
      notes: formData.notes
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsAddModalOpen(false);
    setFormData({
      title: '', amount: '', type: 'expense', category: 'Food & Dining',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      account: 'Platinum Card', notes: ''
    });
  };

  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Type', 'Category', 'Amount', 'Currency', 'Date', 'Time', 'Account', 'Notes'];
    const rows = transactions.map(t => [
      t.id, `"${t.title.replace(/"/g, '""')}"`, t.type, t.category, t.amount, currency, t.date, t.time, t.account, `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `SmartExpense_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCategoryIcon = (category, isIncome) => {
    if (isIncome) return <ArrowDownLeft className="w-4 h-4" />;
    switch (category) {
      case 'Food & Dining': return <Coffee className="w-4 h-4" />;
      case 'Groceries': return <ShoppingCart className="w-4 h-4" />;
      case 'Gadgets': return <Smartphone className="w-4 h-4" />;
      case 'Entertainment': return <Tv className="w-4 h-4" />;
      case 'Transport': return <Car className="w-4 h-4" />;
      case 'Health': return <Activity className="w-4 h-4" />;
      case 'Subscriptions': return <Box className="w-4 h-4" />;
      case 'Travel': return <Compass className="w-4 h-4" />;
      case 'Investments': return <TrendingUp className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090b10] text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans antialiased transition-colors duration-300`}>
      
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b ${theme === 'dark' ? 'bg-[#0d1117]/80 border-slate-800/80' : 'bg-white/80 border-slate-200/80'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0d1117]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  SmartExpense
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI OS 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Financial Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map(code => (
                <option key={code} value={code}>{CURRENCIES[code].label}</option>
              ))}
            </select>

            <button
              onClick={() => setIsSplitModalOpen(true)}
              title="Split Bill Calculator"
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setIsScanModalOpen(true); setScanState('idle'); setScannedData(null); }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium text-xs transition"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Receipt</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Record</span>
            </button>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-yellow-400 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* NLP Natural Language Input */}
        <section className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-5 border border-indigo-500/20 shadow-xl space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Smart AI Quick Logger
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-mono">NLP Engine</span>
                </h3>
                <p className="text-xs text-slate-400">Type natural sentences to log transactions automatically</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiQuickAdd()}
                placeholder="e.g. 'Spent $68.50 at Trader Joe for groceries' or 'Received $1500 freelance payment'"
                className="w-full bg-[#0d1117] text-sm text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-700/80 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAiQuickAdd}
                disabled={isAiProcessing || !aiPrompt.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 shrink-0 disabled:opacity-50"
              >
                {isAiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isAiProcessing ? "Parsing..." : "Auto-Log"}</span>
              </button>
            </div>
          </div>

          {aiFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <span className="font-semibold">{aiFeedback.msg}</span>
              <button onClick={() => setAiFeedback(null)} className="text-emerald-400 hover:text-white">
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Net Worth</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {formatMoney(metrics.balance)}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.8%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Monthly Inflow</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {formatMoney(metrics.income)}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Active payroll & clients
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Expenses</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 tracking-tight">
              {formatMoney(metrics.expenses)}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> -4.2%
              </span>
              <span className="text-slate-400">Under budget ceiling</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Daily Safe Budget</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-300 tracking-tight">
              {formatMoney(metrics.dailySafeSpend)}<span className="text-xs text-slate-400 font-sans">/day</span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">
                {metrics.savingsRate}%
              </span>
              <span className="text-slate-400">Target savings rate</span>
            </div>
          </div>
        </section>

        {/* Analytics & Virtual Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Spending Velocity & Category Spread
                </h3>
                <p className="text-xs text-slate-400">Live budget consumption by category</p>
              </div>
              <button 
                onClick={exportCSV}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {CATEGORIES.filter(c => c.spent > 0).slice(0, 5).map((cat, idx) => {
                const actualSpent = categoryStats[cat.name] || cat.spent;
                const percent = Math.min(100, Math.round((actualSpent / (cat.budget || 1000)) * 100));
                const isOver = percent >= 95;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        <span className="font-semibold text-slate-200">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-300">{formatMoney(actualSpent)}</span>
                        <span className="text-slate-500">/ {formatMoney(cat.budget)}</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${isOver ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                          {percent}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-rose-500' : ''}`}
                        style={{ width: `${percent}%`, backgroundColor: isOver ? undefined : cat.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Titanium Virtual Card & AI Insights */}
          <div className="space-y-6">
            <div className="relative h-48 rounded-2xl p-6 text-white overflow-hidden shadow-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 border border-indigo-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold tracking-widest uppercase">Smart Titanium Vault</span>
                </div>
                <Wifi className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 tracking-wider">AVAILABLE BALANCE</div>
                <div className="text-2xl font-extrabold font-mono tracking-wider">{formatMoney(metrics.balance)}</div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>•••• •••• •••• 9428</span>
                <span className="font-bold tracking-wider">08/29</span>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  AI Live Financial Insights
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  3 Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#0d1117]/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Dining Trend Warning</span>
                  </div>
                  <p className="text-slate-400">
                    You spent 28% more on Food & Dining compared to last week. Consider eating in this weekend.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d1117]/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Savings Forecast</span>
                  </div>
                  <p className="text-slate-400">
                    At this pace, you will reach your $5,000 Tokyo Travel goal 12 days ahead of schedule!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Master Ledger */}
        <section className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Transaction Ledger
              </h3>
              <p className="text-xs text-slate-400">Real-time audit log of all financial interactions</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0d1117] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
                />
              </div>

              <div className="flex rounded-xl bg-[#0d1117] p-1 border border-slate-800 text-xs">
                {['all', 'expense', 'income'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedFilter(t)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                      selectedFilter === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0d1117] text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0d1117] text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0d1117]/90 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Account / Method</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No transactions found matching filter
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {renderCategoryIcon(tx.category, isIncome)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-100">{tx.title}</span>
                              {tx.notes && (
                                <p className="text-[11px] text-slate-500 truncate max-w-xs">{tx.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 border border-slate-700/80 text-slate-300">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                            <span>{tx.account || 'Primary Card'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          <div>{tx.date}</div>
                          <div className="text-[10px] text-slate-500">{tx.time}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`font-mono font-bold text-sm ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">Record Transaction</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border ${
                    formData.type === 'expense'
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-400'
                      : 'bg-[#0d1117] border-slate-800 text-slate-400'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Expense (-)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border ${
                    formData.type === 'income'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                      : 'bg-[#0d1117] border-slate-800 text-slate-400'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Income (+)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Title / Merchant</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple Store NYC"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0d1117] px-3.5 py-2.5 rounded-xl border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Amount ({curr.symbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#0d1117] px-3.5 py-2.5 rounded-xl border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0d1117] px-3.5 py-2.5 rounded-xl border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Account / Card</label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    className="w-full bg-[#0d1117] px-3.5 py-2.5 rounded-xl border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Platinum Card">Platinum Card (•••• 9428)</option>
                    <option value="Main Checking">Main Checking (•••• 1024)</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Investment Vault">Investment Vault</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OCR Scanner Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">AI Receipt Scanner</h3>
              <button onClick={() => setIsScanModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {scanState === 'idle' && (
              <div className="space-y-4 text-center py-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="text-xs text-slate-400">Simulate neural OCR extraction on physical receipts</p>
                <button
                  onClick={() => {
                    setScanState('scanning');
                    setTimeout(() => {
                      setScannedData({
                        merchant: 'Blue Bottle Coffee Roastery',
                        total: 42.80,
                        date: new Date().toISOString().split('T')[0],
                        items: [
                          { name: 'Single Origin Espresso', price: 6.50 },
                          { name: 'Oat Milk Flat White', price: 7.50 },
                          { name: 'Avocado Tartine', price: 16.00 },
                          { name: 'Almond Croissant', price: 9.00 }
                        ],
                        category: 'Food & Dining',
                        account: 'Apple Pay'
                      });
                      setScanState('extracted');
                    }, 1800);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25"
                >
                  Simulate Camera Scan
                </button>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="space-y-4 text-center py-8">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-emerald-400">Running Neural OCR Extraction...</h4>
              </div>
            )}

            {scanState === 'extracted' && scannedData && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0d1117] border border-emerald-500/40 space-y-3 text-xs">
                  <div className="text-base font-extrabold text-white">{scannedData.merchant}</div>
                  <div className="divide-y divide-slate-800">
                    {scannedData.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between text-slate-300">
                        <span>{item.name}</span>
                        <span className="font-mono font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold text-white">
                    <span>Total Extracted</span>
                    <span className="font-mono text-emerald-400">${scannedData.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    onClick={() => {
                      const newTx = {
                        id: 'tx-scan-' + Date.now(),
                        title: scannedData.merchant,
                        amount: scannedData.total,
                        type: 'expense',
                        category: scannedData.category,
                        date: scannedData.date,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        account: scannedData.account,
                        status: 'completed',
                        notes: `OCR scan: ${scannedData.items.map(i => i.name).join(', ')}`
                      };
                      setTransactions(prev => [newTx, ...prev]);
                      setIsScanModalOpen(false);
                      setScanState('idle');
                      setScannedData(null);
                    }} 
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Add to Ledger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Split Bill Modal */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">Split Bill & Tip</h3>
              <button onClick={() => setIsSplitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Total Bill Amount ($)</label>
                <input
                  type="number"
                  value={splitAmount}
                  onChange={(e) => setSplitAmount(e.target.value)}
                  className="w-full bg-[#0d1117] px-3.5 py-2.5 rounded-xl border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Number of People: {splitPeople}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={splitPeople}
                  onChange={(e) => setSplitPeople(e.target.value)}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Tip Percentage</label>
                <div className="grid grid-cols-4 gap-2">
                  {['0', '10', '15', '20'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSplitTip(t)}
                      className={`py-2 rounded-xl font-bold border ${splitTip === t ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-[#0d1117] border-slate-800 text-slate-400'}`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const bill = parseFloat(splitAmount) || 0;
                const people = parseInt(splitPeople) || 1;
                const tipVal = bill * ((parseFloat(splitTip) || 0) / 100);
                const grandTotal = bill + tipVal;
                const perPerson = grandTotal / people;

                return (
                  <div className="p-4 rounded-xl bg-[#0d1117] border border-indigo-500/30 text-center space-y-1">
                    <div className="text-xs text-slate-400 uppercase">Each Person Pays</div>
                    <div className="text-3xl font-extrabold font-mono text-indigo-400">
                      ${perPerson.toFixed(2)}
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  const bill = parseFloat(splitAmount) || 0;
                  const people = parseInt(splitPeople) || 1;
                  const tipVal = bill * ((parseFloat(splitTip) || 0) / 100);
                  const perPerson = (bill + tipVal) / people;
                  navigator.clipboard.writeText(`Dinner bill: $${(bill+tipVal).toFixed(2)}. ${people} people = $${perPerson.toFixed(2)} each. 💸`);
                  setCopiedSplit(true);
                  setTimeout(() => setCopiedSplit(false), 3000);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                {copiedSplit ? "Copied Share Message!" : "Copy Split Share Text"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}