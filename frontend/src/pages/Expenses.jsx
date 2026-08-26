import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, Search, Download, Trash2, Camera, ArrowUpRight, 
  ArrowDownLeft, Filter, Tag, Coffee, ShoppingCart, Smartphone, 
  Tv, Car, Activity, Box, Compass, Zap 
} from 'lucide-react';

const INITIAL_EXPENSES = [
  { id: 'tx-1', title: 'Apple Store NYC', amount: 1299.00, type: 'expense', category: 'Gadgets', date: '2026-08-25', time: '14:32', account: 'Platinum Card', notes: 'MacBook M3 Pro upgrade' },
  { id: 'tx-2', title: 'Stripe SaaS Retainer', amount: 4850.00, type: 'income', category: 'Income', date: '2026-08-24', time: '09:15', account: 'Main Checking', notes: 'Retainer invoice #1084' },
  { id: 'tx-3', title: 'Whole Foods Market', amount: 142.30, type: 'expense', category: 'Groceries', date: '2026-08-23', time: '18:40', account: 'Apple Pay', notes: 'Organic weekly groceries' },
  { id: 'tx-4', title: 'Netflix & Spotify Bundle', amount: 34.99, type: 'expense', category: 'Entertainment', date: '2026-08-22', time: '04:00', account: 'Platinum Card', notes: 'Recurring auto-charge' },
  { id: 'tx-5', title: 'Uber Black Ride', amount: 58.75, type: 'expense', category: 'Transport', date: '2026-08-21', time: '22:10', account: 'Apple Pay', notes: 'Airport pickup' },
  { id: 'tx-6', title: 'Equinox Health Club', amount: 260.00, type: 'expense', category: 'Health', date: '2026-08-19', time: '08:00', account: 'Main Checking', notes: 'Monthly gym membership' },
  { id: 'tx-7', title: 'Airbnb Tokyo Trip', amount: 890.00, type: 'expense', category: 'Travel', date: '2026-08-15', time: '15:30', account: 'Platinum Card', notes: 'Shibuya penthouse' }
];

export default function Expenses() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = useMemo(() => {
    return expenses.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchType = filterType === 'all' || item.type === filterType;
      const matchCat = filterCat === 'all' || item.category === filterCat;
      return matchSearch && matchType && matchCat;
    });
  }, [expenses, searchQuery, filterType, filterCat]);

  const handleDelete = (id) => setExpenses(prev => prev.filter(x => x.id !== id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Expense Ledger</h1>
          <p className="text-xs text-slate-400">Track and manage all transactions and cash flows</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const headers = ['ID,Title,Type,Category,Amount,Date,Account\n'];
              const rows = expenses.map(e => `${e.id},"${e.title}",${e.type},${e.category},${e.amount},${e.date},${e.account}`);
              const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'expenses_export.csv';
              a.click();
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by merchant, note, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] text-xs text-slate-100 pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0d1117] p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'expense', 'income'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg capitalize font-semibold ${filterType === t ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-[#0d1117] text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Groceries">Groceries</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transport">Transport</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0d1117] text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Merchant / Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Account</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(item => {
              const isIncome = item.type === 'income';
              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-4 font-bold text-slate-100">
                    {item.title}
                    {item.notes && <p className="text-[11px] font-normal text-slate-500">{item.notes}</p>}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{item.account}</td>
                  <td className="py-4 px-4 font-mono text-slate-400">{item.date} {item.time}</td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm">
                    <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                      {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}