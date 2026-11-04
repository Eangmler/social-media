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
  Users,
  LogOut,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AuthSession } from "@/lib/types";

export type NavTab =
  | "dashboard"
  | "competitors"
  | "calendar"
  | "publisher"
  | "dm-automation"
  | "testers"
  | "settings";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onTriggerScrape?: () => void;
  isTriggering?: boolean;
  session?: AuthSession | null;
  onLogout?: () => void;
}

export function Navbar({
  currentTab,
  onSelectTab,
  onTriggerScrape,
  isTriggering,
  session,
  onLogout,
}: NavbarProps) {
  const isAdmin = session?.role === "admin";

  const allTabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, adminOnly: false },
    { id: "competitors", label: "Competitor Scraper", icon: Users2, adminOnly: false },
    { id: "calendar", label: "AI Content Calendar", icon: CalendarDays, adminOnly: false },
    { id: "publisher", label: "Publishing Layer", icon: Send, adminOnly: false },
    { id: "dm-automation", label: "DM Automation", icon: MessageSquareCode, adminOnly: false },
    { id: "testers", label: "Testers & Reviews", icon: Users, adminOnly: true },
    { id: "settings", label: "Settings & APIs", icon: Settings, adminOnly: true },
  ] as const;

  const visibleTabs = allTabs.filter((t) => (isAdmin ? true : !t.adminOnly));

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e1e3e1]">
      {/* Top Brand & Utility Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab("dashboard")}>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#1f1f1f] lowercase flex items-center gap-1.5">
            meye
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#0b57d0] lowercase">
              your social media assistant
            </span>
          </span>
        </div>

        {/* Right Utility & Status */}
        <div className="flex items-center space-x-3">
          {/* Active Cron Status Chip */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" />
            <span>Mon 09:00 GMT Cron Active</span>
          </div>

          {/* Quick Action Pill Button */}
          {onTriggerScrape && (
            <button
              onClick={onTriggerScrape}
              disabled={isTriggering}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isTriggering ? "animate-spin" : ""}`} />
              <span>{isTriggering ? "Scraping..." : "Run Scraper"}</span>
            </button>
          )}

          {/* User Badge & Logout */}
          {session && (
            <div className="flex items-center space-x-2 pl-2 border-l border-[#e1e3e1]">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f1f3f4] text-xs text-[#1f1f1f] font-medium">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0b57d0]" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-[#34a853]" />
                )}
                <span className="hidden sm:inline font-semibold">{session.name}</span>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-full hover:bg-[#f1f3f4] text-[#727775] hover:text-[#c5221f] transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Google Store Style Navigation Pills Bar */}
      <div className="border-t border-[#f1f3f4] bg-[#f8fafd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id as NavTab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-[#d3e3fd] text-[#041e49] shadow-sm font-semibold"
                      : "text-[#444746] hover:text-[#1f1f1f] hover:bg-[#e9eef6]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0b57d0]" : "text-[#727775]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
