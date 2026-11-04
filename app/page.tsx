"use client";

import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "@/components/Navbar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { CompetitorScraperView } from "@/components/CompetitorScraperView";
import { ContentCalendarView } from "@/components/ContentCalendarView";
import { PublisherView } from "@/components/PublisherView";
import { DmAutomationView } from "@/components/DmAutomationView";
import { SettingsView } from "@/components/SettingsView";
import { TesterManagementView } from "@/components/TesterManagementView";
import { AuthModal } from "@/components/AuthModal";
import { TesterFeedbackModal } from "@/components/TesterFeedbackModal";
import { ContentConcept, AuthSession } from "@/lib/types";
import { getAuthSession, clearAuthSession, getClientVault } from "@/lib/auth";

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [selectedConcept, setSelectedConcept] = useState<ContentConcept | null>(null);
  const [isTriggeringScrape, setIsTriggeringScrape] = useState(false);

  useEffect(() => {
    const existing = getAuthSession();
    if (existing) {
      setSession(existing);
    }
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
    setCurrentTab("dashboard");
  };

  const handleSendToPublisher = (concept: ContentConcept) => {
    setSelectedConcept(concept);
    setCurrentTab("publisher");
  };

  const handleTriggerScrape = async () => {
    try {
      setIsTriggeringScrape(true);
      const vault = getClientVault();
      await fetch("/api/cron/scrape-and-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vault }),
      });
      if (currentTab !== "calendar") {
        setCurrentTab("calendar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggeringScrape(false);
    }
  };

  // If not logged in, show the Google Store Auth Gate
  if (authChecked && !session) {
    return <AuthModal onSuccess={(newSession) => setSession(newSession)} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col">
      {/* Google Store Style Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onTriggerScrape={handleTriggerScrape}
        isTriggering={isTriggeringScrape}
        session={session}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentTab === "dashboard" && <DashboardOverview onNavigate={setCurrentTab} />}
        {currentTab === "competitors" && <CompetitorScraperView onNavigate={setCurrentTab} />}
        {currentTab === "calendar" && (
          <ContentCalendarView onSendToPublisher={handleSendToPublisher} onNavigate={setCurrentTab} />
        )}
        {currentTab === "publisher" && <PublisherView prefilledConcept={selectedConcept} />}
        {currentTab === "dm-automation" && <DmAutomationView />}
        {currentTab === "testers" && session?.role === "admin" && <TesterManagementView />}
        {currentTab === "settings" && session?.role === "admin" && <SettingsView />}
      </main>

      {/* Tester Floating Feedback Widget */}
      {session && session.role === "tester" && <TesterFeedbackModal session={session} />}

      {/* Google Store Style Minimal Footer */}
      <footer className="border-t border-[#e1e3e1] bg-white py-8 text-xs text-[#727775]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            <span className="font-bold text-[#1f1f1f] lowercase">meye</span>
            <span>•</span>
            <span className="lowercase">your social media assistant</span>
          </div>
          <p>© 2026 meye.</p>
        </div>
      </footer>
    </div>
  );
}
