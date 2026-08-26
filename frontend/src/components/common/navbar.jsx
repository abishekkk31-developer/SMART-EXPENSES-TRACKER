import React, { useState } from 'react';
import { Search, Bell, Sparkles, Moon, Sun, Plus } from 'lucide-react';

export default function Navbar() {
  const [currency, setCurrency] = useState('USD');

  return (
    <header className="sticky top-0 z-20 h-20 border-b border-slate-800/80 bg-[#090b10]/80 backdrop-blur-xl px-6 flex items-center justify-between gap-4">
      
      {/* Search Input */}
      <div className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search transactions, budgets, insights (⌘K)..."
          className="w-full bg-[#0d1117] text-xs text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Currency Switcher */}
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="INR">INR (₹)</option>
        </select>

        {/* Notifications */}
        <button className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-500/40 p-0.5 bg-gradient-to-tr from-indigo-500 to-emerald-400">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="Profile"
            className="w-full h-full object-cover rounded-[10px]"
          />
        </div>

      </div>
    </header>
  );
}