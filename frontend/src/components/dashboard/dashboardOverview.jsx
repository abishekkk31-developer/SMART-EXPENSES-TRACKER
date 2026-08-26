import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Wallet, ArrowUpRight, ArrowDownLeft, ArrowDownRight,
  TrendingUp, ShieldCheck, BarChart3, Download, PlusCircle, Search, 
  Trash2, Camera, Users, CreditCard, Wifi, AlertTriangle, Repeat, 
  Layers, Check, Copy, X, Bot, Loader2, Coffee, ShoppingCart, 
  Smartphone, Tv, Car, Activity, Box, Compass, Zap, Tag
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', title: 'Apple Store NYC', amount: 1299.00, type: 'expense', category: 'Gadgets', date: '2026-08-25', time: '14:32', account: 'Platinum Card', notes: 'MacBook M3 Pro upgrade' },
  { id: 'tx-2', title: 'Stripe SaaS Payout', amount: 4850.00, type: 'income', category: 'Income', date: '2026-08-24', time: '09:15', account: 'Main Checking', notes: 'Monthly retainer invoice #1084' },
  { id: 'tx-3', title: 'Whole Foods Market', amount: 142.30, type: 'expense', category: 'Groceries', date: '2026-08-23', time: '18:40', account: 'Apple Pay', notes: 'Organic weekly groceries' },
  { id: 'tx-4', title: 'Netflix & Spotify Bundle', amount: 34.99, type: 'expense', category: 'Entertainment', date: '2026-08-22', time: '04:00', account: 'Platinum Card', notes: 'Recurring auto-charge' },
  { id: 'tx-5', title: 'Uber Black Ride', amount: 58.75, type: 'expense', category: 'Transport', date: '2026-08-21', time: '22:10', account: 'Apple Pay', notes: 'Airport pickup' },
  { id: 'tx-6', title: 'Equinox Health Club', amount: 260.00, type: 'expense', category: 'Health', date: '2026-08-19', time: '08:00', account: 'Main Checking', notes: 'Monthly health membership' },
  { id: 'tx-7', title: 'Figma Pro Workspace', amount: 144.00, type: 'expense', category: 'Subscriptions', date: '2026-08-18', time: '11:20', account: 'Platinum Card', notes: 'Annual design seat' },
  { id: 'tx-8', title: 'VOO Dividend Yield', amount: 312.40, type: 'income', category: 'Investments', date: '2026-08-15', time: '16:00', account: 'Investment Vault', notes: 'Q3 Vanguard dividend' }
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
];

export default function DashboardOverview() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('smart_expenses_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Manual Form
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    account: 'Platinum Card', notes: ''
  });

  // Split Bill
  const [splitAmount, setSplitAmount] = useState('180');
  const [splitPeople, setSplitPeople] = useState('4');
  const [splitTip, setSplitTip] = useState('15');
  const [copiedSplit, setCopiedSplit] = useState(false);

  // Scan state
  const [scanState, setScanState] = useState('idle');
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    localStorage.setItem('smart_expenses_txs', JSON.stringify(transactions));
  }, [transactions]);

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedFilter === 'all' || t.type === selectedFilter;
      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCat;
    });
  }, [transactions, searchQuery, selectedFilter, categoryFilter]);

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
      else if (text.includes('grocery') || text.includes('whole food') || text.includes('trader joe')) category = 'Groceries';
      else if (text.includes('uber') || text.includes('flight') || text.includes('gas') || text.includes('taxi')) category = 'Transport';
      else if (text.includes('netflix') || text.includes('movie') || text.includes('game') || text.includes('spotify')) category = 'Entertainment';
      else if (text.includes('apple') || text.includes('laptop') || text.includes('iphone') || text.includes('gadget')) category = 'Gadgets';
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
        notes: `AI Auto-parsed: "${aiPrompt}"`
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsAiProcessing(false);
      setAiFeedback(`✨ Auto-logged: ${type === 'income' ? '+' : '-'}$${amount} for "${title}" (${category})`);
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
    const headers = ['ID', 'Title', 'Type', 'Category', 'Amount', 'Date', 'Time', 'Account', 'Notes'];
    const rows = transactions.map(t => [t.id, `"${t.title}"`, t.type, t.category, t.amount, t.date, t.time, t.account, `"${t.notes || ''}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `SmartExpenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">Autonomous AI Financial Intelligence</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSplitModalOpen(true)}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white"
            title="Split Bill"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setIsScanModalOpen(true); setScanState('idle'); setScannedData(null); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-semibold text-xs"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Receipt</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* AI NLP Command Bar */}
      <section className="glass-panel rounded-2xl p-4 sm:p-5 border border-indigo-500/20 shadow-xl space-y-3">
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
              className="w-full bg-[#0d1117] text-sm text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAiQuickAdd}
              disabled={isAiProcessing || !aiPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isAiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Auto-Log</span>
            </button>
          </div>
        </div>

        {aiFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span className="font-semibold">{aiFeedback}</span>
            <button onClick={() => setAiFeedback(null)} className="text-emerald-400 hover:text-white">
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Worth</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            ${metrics.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.8%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
            ${metrics.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Active payroll & clients
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Expenses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 tracking-tight">
            ${metrics.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> -4.2%
            </span>
            <span className="text-slate-400">Under budget ceiling</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Safe Budget</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-300 tracking-tight">
            ${metrics.dailySafeSpend}<span className="text-xs text-slate-400 font-sans">/day</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">
              {metrics.savingsRate}%
            </span>
            <span className="text-slate-400">Target savings rate</span>
          </div>
        </div>
      </section>

      {/* Analytics & Virtual Titanium Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Spending Velocity Breakdown */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Spending Velocity by Category
              </h3>
              <p className="text-xs text-slate-400">Live budget consumption</p>
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
            {CATEGORIES.map((cat, idx) => {
              const percent = Math.min(100, Math.round((cat.spent / cat.budget) * 100));
              const isOver = percent >= 95;

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      <span className="font-semibold text-slate-200">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-300">${cat.spent}</span>
                      <span className="text-slate-500">/ ${cat.budget}</span>
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
              <div className="text-2xl font-extrabold font-mono tracking-wider">${metrics.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>•••• •••• •••• 9428</span>
              <span className="font-bold tracking-wider">08/29</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Live Insights
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                2 Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#0d1117]/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Dining Trend Warning</span>
                </div>
                <p className="text-slate-400">
                  You spent 28% more on Food & Dining compared to last week.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0d1117]/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Savings Forecast</span>
                </div>
                <p className="text-slate-400">
                  You will reach your $5,000 Travel goal 12 days ahead of schedule!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Transactions Ledger */}
      <section className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400">Real-time ledger entries</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
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
                    selectedFilter === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0d1117]/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-100">{tx.title}</span>
                        {tx.notes && <p className="text-[11px] text-slate-500">{tx.notes}</p>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{tx.account}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{tx.date}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                      <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                        {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals: Add, Scan, Split */}
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
                  className={`py-2.5 rounded-xl font-bold border ${formData.type === 'expense' ? 'bg-rose-500/20 border-rose-500/60 text-rose-400' : 'bg-[#0d1117] border-slate-800 text-slate-400'}`}
                >
                  Expense (-)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`py-2.5 rounded-xl font-bold border ${formData.type === 'income' ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400' : 'bg-[#0d1117] border-slate-800 text-slate-400'}`}
                >
                  Income (+)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Merchant or Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0d1117] px-3.5 py-2 rounded-xl border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#0d1117] px-3.5 py-2 rounded-xl border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Split Modal */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Split Bill & Tip</h3>
              <button onClick={() => setIsSplitModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Total Bill ($)</label>
              <input type="number" value={splitAmount} onChange={(e) => setSplitAmount(e.target.value)} className="w-full bg-[#0d1117] px-3 py-2 rounded-xl border border-slate-700 text-white font-mono" />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Number of People: {splitPeople}</label>
              <input type="range" min="1" max="20" value={splitPeople} onChange={(e) => setSplitPeople(e.target.value)} className="w-full accent-indigo-500" />
            </div>
            {(() => {
              const bill = parseFloat(splitAmount) || 0;
              const people = parseInt(splitPeople) || 1;
              const perPerson = (bill * 1.15) / people;
              return (
                <div className="p-3 bg-[#0d1117] rounded-xl text-center">
                  <div className="text-slate-400">Each Person Pays (with 15% tip)</div>
                  <div className="text-2xl font-mono font-bold text-indigo-400">${perPerson.toFixed(2)}</div>
                </div>
              );
            })()}
            <button
              onClick={() => {
                const perPerson = ((parseFloat(splitAmount) || 0) * 1.15) / (parseInt(splitPeople) || 1);
                navigator.clipboard.writeText(`Hey! Our bill split is $${perPerson.toFixed(2)} each. 💸`);
                setCopiedSplit(true);
                setTimeout(() => setCopiedSplit(false), 3000);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
            >
              {copiedSplit ? "Copied!" : "Copy Share Message"}
            </button>
          </div>
        </div>
      )}

      {/* OCR Scan Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-emerald-500/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Receipt OCR Scan</h3>
              <button onClick={() => setIsScanModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            {scanState === 'idle' && (
              <div className="text-center py-6 space-y-3">
                <Camera className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-slate-400">Simulate instant receipt OCR extraction</p>
                <button
                  onClick={() => {
                    setScanState('scanning');
                    setTimeout(() => {
                      setScannedData({ merchant: 'Blue Bottle Coffee', total: 38.50 });
                      setScanState('extracted');
                    }, 1500);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Simulate Camera Scan
                </button>
              </div>
            )}
            {scanState === 'scanning' && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-emerald-400 font-bold mt-2">Extracting line items...</p>
              </div>
            )}
            {scanState === 'extracted' && scannedData && (
              <div className="space-y-3">
                <div className="p-3 bg-[#0d1117] rounded-xl border border-emerald-500/30">
                  <div className="font-bold text-white">{scannedData.merchant}</div>
                  <div className="text-emerald-400 font-mono font-bold text-lg">${scannedData.total}</div>
                </div>
                <button
                  onClick={() => {
                    setTransactions(prev => [{
                      id: 'tx-scan-' + Date.now(),
                      title: scannedData.merchant,
                      amount: scannedData.total,
                      type: 'expense',
                      category: 'Food & Dining',
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      account: 'Apple Pay',
                      notes: 'Auto OCR receipt scan'
                    }, ...prev]);
                    setIsScanModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Add to Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}