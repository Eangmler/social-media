"use client";

import React, { useState } from "react";
import { Navbar, NavTab } from "@/components/Navbar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { CompetitorScraperView } from "@/components/CompetitorScraperView";
import { ContentCalendarView } from "@/components/ContentCalendarView";
import { PublisherView } from "@/components/PublisherView";
import { DmAutomationView } from "@/components/DmAutomationView";
import { SettingsView } from "@/components/SettingsView";
import { ContentConcept } from "@/lib/types";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [selectedConcept, setSelectedConcept] = useState<ContentConcept | null>(null);
  const [isTriggeringScrape, setIsTriggeringScrape] = useState(false);

  const handleSendToPublisher = (concept: ContentConcept) => {
    setSelectedConcept(concept);
    setCurrentTab("publisher");
  };

  const handleTriggerScrape = async () => {
    try {
      setIsTriggeringScrape(true);
      await fetch("/api/cron/scrape-and-generate", { method: "POST" });
      if (currentTab !== "calendar") {
        setCurrentTab("calendar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggeringScrape(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col">
      {/* Google Store Style Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onTriggerScrape={handleTriggerScrape}
        isTriggering={isTriggeringScrape}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentTab === "dashboard" && <DashboardOverview onNavigate={setCurrentTab} />}
        {currentTab === "competitors" && <CompetitorScraperView />}
        {currentTab === "calendar" && (
          <ContentCalendarView onSendToPublisher={handleSendToPublisher} onNavigate={setCurrentTab} />
        )}
        {currentTab === "publisher" && <PublisherView prefilledConcept={selectedConcept} />}
        {currentTab === "dm-automation" && <DmAutomationView />}
        {currentTab === "settings" && <SettingsView />}
      </main>

      {/* Google Store Style Minimal Footer */}
      <footer className="border-t border-[#e1e3e1] bg-white py-8 text-xs text-[#727775]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            <span className="font-medium text-[#1f1f1f]">ViralPulse AI Engine</span>
            <span>•</span>
            <span>Autonomous Short-Form Video Operations</span>
          </div>
          <p>© 2026 ViralPulse. Built with Google Store Material 3 Design Language.</p>
        </div>
      </footer>
    </div>
  );
}
