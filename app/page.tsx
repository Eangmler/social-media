"use client";

import React, { useState } from "react";
import { Sidebar, NavTab } from "@/components/Sidebar";
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

  const handleSendToPublisher = (concept: ContentConcept) => {
    setSelectedConcept(concept);
    setCurrentTab("publisher");
  };

  return (
    <div className="flex min-h-screen bg-[#090d16]">
      {/* Fixed Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {currentTab === "dashboard" && <DashboardOverview onNavigate={setCurrentTab} />}
        {currentTab === "competitors" && <CompetitorScraperView />}
        {currentTab === "calendar" && (
          <ContentCalendarView onSendToPublisher={handleSendToPublisher} onNavigate={setCurrentTab} />
        )}
        {currentTab === "publisher" && <PublisherView prefilledConcept={selectedConcept} />}
        {currentTab === "dm-automation" && <DmAutomationView />}
        {currentTab === "settings" && <SettingsView />}
      </main>
    </div>
  );
}
