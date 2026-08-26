import React from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Financial Reports & Audit</h1>
          <p className="text-xs text-slate-400">Visual breakdowns and tax-deductible expense tracking</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold">
          <Download className="w-4 h-4" /> Download Annual PDF
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Inflow (YTD)</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">$54,820.00</div>
          <div className="text-xs text-emerald-400 mt-2">+24% vs last year</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Outflow (YTD)</div>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">$18,450.00</div>
          <div className="text-xs text-slate-400 mt-2">66.4% savings rate</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Estimated Tax Deductions</div>
          <div className="text-3xl font-extrabold font-mono text-indigo-400 mt-2">$3,410.00</div>
          <div className="text-xs text-indigo-300 mt-2">14 eligible business receipts</div>
        </div>
      </div>

      {/* Monthly Bar Breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Cash Flow Comparison (2026)</h3>
        
        <div className="space-y-4">
          {[
            { month: 'August', income: 5160, expense: 1939 },
            { month: 'July', income: 4800, expense: 2200 },
            { month: 'June', income: 4500, expense: 1800 },
            { month: 'May', income: 5200, expense: 2400 },
          ].map((m, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>{m.month}</span>
                <span className="font-mono text-emerald-400">+${m.income} <span className="text-slate-500">|</span> <span className="text-rose-400">-${m.expense}</span></span>
              </div>
              <div className="w-full h-4 bg-[#0d1117] rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(m.income / 7000) * 100}%` }}></div>
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(m.expense / 7000) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}