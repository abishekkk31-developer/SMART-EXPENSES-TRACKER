import React from 'react';
import { User, Shield, CreditCard, Mail, Phone, Lock } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-white">Account Profile</h1>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-2xl font-extrabold text-white">
            AB
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Abhi</h2>
            <p className="text-xs text-slate-400">abhi@example.com</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Tier 1 Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1">
            <span className="text-slate-500">Connected Card</span>
            <p className="font-mono text-slate-200 font-bold">Titanium Vault (•••• 9428)</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1">
            <span className="text-slate-500">Default Currency</span>
            <p className="font-mono text-slate-200 font-bold">USD - US Dollar ($)</p>
          </div>
        </div>
      </div>
    </div>
  );
}