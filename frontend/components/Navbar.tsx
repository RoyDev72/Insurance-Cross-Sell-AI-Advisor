'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Users, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { href: '/customers', label: 'Customer Portfolios', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/85 border-b border-slate-800 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-indigo-300 transition-all">
                  CrossSell AI Advisor
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  RULES + LLM
                </span>
              </Link>
              <p className="text-xs text-slate-400 hidden sm:block">
                3-Tier Architecture • Express.js API + Next.js UI + Supabase DB
              </p>
            </div>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-400">Express API (Port 5000)</span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="h-3 w-3 text-amber-400" /> WhatsApp AI
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
