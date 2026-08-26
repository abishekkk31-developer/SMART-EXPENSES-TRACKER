import React, { useState } from 'react';
import { PieChart, Plus, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'Food & Dining', allocated: 600, spent: 412, color: '#f59e0b' },
  { id: 'b-2', category: 'Groceries', allocated: 500, spent: 342, color: '#10b981' },
  { id: 'b-3', category: 'Gadgets & Tech', allocated: 1500, spent: 1299, color: '#6366f1' },
  { id: 'b-4', category: 'Entertainment', allocated: 200, spent: 185, color: '#ec4899' },
  { id: 'b-5', category: 'Transport', allocated: 350, spent: 220, color: '#06b6d4' },
  { id: 'b-6', category: 'Travel & Vacations', allocated: 1200, spent: 890, color: '#14b8a6' }
];

export default function Budget() {
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Monthly Budgets</h1>
          <p className="text-xs text-slate-400">Set spending ceilings and prevent overspending</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25">
          <Plus className="w-4 h-4" /> Create Category Budget
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs uppercase text-slate-400 font-bold mb-1">Total Allocated</div>
          <div className="text-3xl font-extrabold font-mono text-white">${totalAllocated.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs uppercase text-slate-400 font-bold mb-1">Total Spent</div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">${totalSpent.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs uppercase text-slate-400 font-bold mb-1">Remaining Buffer</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">${(totalAllocated - totalSpent).toLocaleString()}</div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(b => {
          const percent = Math.min(100, Math.round((b.spent / b.allocated) * 100));
          const isWarning = percent >= 85;

          return (
            <div key={b.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }}></span>
                  <h3 className="text-sm font-bold text-white">{b.category}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isWarning ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                  {percent}%
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Spent: ${b.spent}</span>
                  <span className="text-slate-200">Limit: ${b.allocated}</span>
                </div>
                <div className="w-full h-3 bg-[#0d1117] rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ width: `${percent}%`, backgroundColor: isWarning ? '#f43f5e' : b.color }}
                  ></div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span>Remaining: ${b.allocated - b.spent}</span>
                {isWarning ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Near Limit
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Safe
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}