import React from 'react';
import { Settings, Bell, Shield, Moon, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-white">Preferences & Settings</h1>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 divide-y divide-slate-800 text-xs">
        <div className="py-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">Autonomous AI Expense Categorization</h4>
            <p className="text-slate-400">Automatically classify transactions from NLP prompts</p>
          </div>
          <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 cursor-pointer" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">Instant Spending Spike Alerts</h4>
            <p className="text-slate-400">Get notified when category spending exceeds 85% of budget</p>
          </div>
          <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 cursor-pointer" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">Clear Local Storage Cache</h4>
            <p className="text-slate-400">Reset sample transactions and local ledger state</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold hover:bg-rose-500/30"
          >
            Reset Ledger
          </button>
        </div>
      </div>
    </div>
  );
}