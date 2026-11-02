"use client";

import React from "react";
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  Send,
  MessageSquareCode,
  Settings,
  Sparkles,
  Radio,
} from "lucide-react";

export type NavTab = "dashboard" | "competitors" | "calendar" | "publisher" | "dm-automation" | "settings";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "competitors", label: "Dual Scraper (Apify)", icon: Users2 },
    { id: "calendar", label: "AI Content Calendar", icon: CalendarDays },
    { id: "publisher", label: "Publishing Layer", icon: Send },
    { id: "dm-automation", label: "DM Automation", icon: MessageSquareCode },
    { id: "settings", label: "API Credentials", icon: Settings },
  ] as const;

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ViralPulse AI
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">IG & TikTok Autonomous SaaS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 m-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Cron Status</span>
          <span className="flex items-center text-[11px] text-emerald-400 font-medium">
            <Radio className="w-3 h-3 mr-1 animate-pulse" /> Active
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Runs Mondays at 09:00 GMT. Syncs Apify competitor signals and updates calendar concepts.
        </p>
      </div>
    </aside>
  );
}
