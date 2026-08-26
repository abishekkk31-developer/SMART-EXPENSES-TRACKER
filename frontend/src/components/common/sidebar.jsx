import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  BarChart3, 
  User, 
  Settings, 
  Sparkles, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt, badge: 'Live' },
    { name: 'Budget', path: '/budget', icon: PieChart },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`sticky top-0 h-screen transition-all duration-300 z-30 flex flex-col justify-between border-r border-slate-800/80 bg-[#0d1117]/95 backdrop-blur-xl ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  SmartExpense
                </span>
                <span className="block text-[10px] text-emerald-400 font-mono font-semibold">
                  ● PRO AI ACTIVE
                </span>
              </div>
            )}
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition hidden md:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                {!collapsed && <span>{item.name}</span>}
                
                {!collapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Mini Card / Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              AB
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-bold text-slate-100 truncate">Abhi Account</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Premium Tier
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </aside>
  );
}