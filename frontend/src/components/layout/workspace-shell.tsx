"use client";

import Link from "next/link";
import { Bell, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/context/auth-context";

export function WorkspaceShell({
  children,
  roleLabel,
}: {
  children: React.ReactNode;
  roleLabel: string;
}) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <Brand />
        <div className="mt-10">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          <Link href={`/dashboard/${roleLabel.toLowerCase()}`} className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-800">
            <LayoutDashboard size={18} /> Overview
          </Link>
        </div>
        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <p className="truncate text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
          <p className="mt-1 text-xs text-slate-500">{roleLabel}</p>
          <button onClick={signOut} className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-700">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:ml-64 lg:px-8">
        <button aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden text-sm font-medium text-slate-500 sm:block">Hawassa University <span className="mx-1.5 text-slate-300">/</span> IoT Campus</div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
            <Bell size={18} />
          </button>
          <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-10 bg-slate-900/20 lg:hidden" onClick={() => setMenuOpen(false)}>
          <nav className="h-full w-72 bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <Brand />
            <Link href={`/dashboard/${roleLabel.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="mt-10 flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-800">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <button onClick={signOut} className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-600"><LogOut size={16} /> Sign out</button>
          </nav>
        </div>
      )}
      <main className="px-4 py-7 sm:px-6 lg:ml-64 lg:px-8">{children}</main>
    </div>
  );
}
