"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Sparkles,
  Copy,
  Check,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { ContentConcept } from "@/lib/types";
import { NavTab } from "./Navbar";

interface ContentCalendarViewProps {
  onSendToPublisher?: (concept: ContentConcept) => void;
  onNavigate?: (tab: NavTab) => void;
}

export function ContentCalendarView({ onSendToPublisher, onNavigate }: ContentCalendarViewProps) {
  const [concepts, setConcepts] = useState<ContentConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/calendar");
      const data = await res.json();
      setConcepts(data.calendar || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleCopyHook = (id: string, hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = async (id: string, status: ContentConcept["status"]) => {
    try {
      await fetch("/api/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchCalendar();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f1f1f] flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-[#0b57d0]" /> AI-Synthesized Weekly Content Calendar
          </h1>
          <p className="text-sm text-[#444746] mt-1">
            Weekly 5-day content roadmap synthesized from competitor signals. Engineered for high retention and comment conversions.
          </p>
        </div>
        <button
          onClick={fetchCalendar}
          className="px-5 py-2.5 rounded-full border border-[#727775] text-[#1f1f1f] hover:bg-[#f0f4f9] text-xs font-semibold transition"
        >
          Refresh Concepts
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#727775]">
          <div className="w-8 h-8 border-2 border-[#0b57d0] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Synthesizing calendar concepts...</p>
        </div>
      ) : concepts.length === 0 ? (
        <div className="p-16 text-center border border-[#e1e3e1] rounded-[32px] bg-white shadow-sm max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1f1f1f]">No Content Concepts Generated Yet</h3>
          <p className="text-sm text-[#444746] mt-2 mb-6">
            Run the Dual-Platform Scraper to crawl your competitor accounts. The AI engine will immediately craft your
            5-day retention-tested concepts.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate("competitors")}
              className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-sm shadow-sm transition"
            >
              Go to Scraper Tab
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e8f0fe] text-[#0b57d0]">
                      {concept.dayOfWeek}
                    </span>
                    <span className="text-[11px] font-medium text-[#727775] flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-[#727775]" /> {concept.recommendedPostTimeGMT} GMT
                    </span>
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#727775]">
                    {concept.targetPlatform}
                  </span>
                </div>

                {/* Angle & Viral Pattern */}
                <div>
                  <div className="text-xs font-bold text-[#9333ea] uppercase tracking-wider mb-1">
                    {concept.angle}
                  </div>
                  <div className="text-xs text-[#444746] flex items-center gap-1.5 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-[#137333] flex-shrink-0" />
                    <span>Pattern: {concept.viralPattern}</span>
                  </div>
                </div>

                {/* Hook Box */}
                <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e9eef6]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#727775] mb-1.5 flex items-center justify-between">
                    <span>The 2-Second Hook</span>
                    <button
                      onClick={() => handleCopyHook(concept.id, concept.hook)}
                      className="text-[#0b57d0] hover:text-[#0842a0] transition flex items-center gap-1 text-[11px] font-semibold"
                    >
                      {copiedId === concept.id ? (
                        <Check className="w-3.5 h-3.5 text-[#137333]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === concept.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-sm font-bold text-[#1f1f1f] italic leading-snug">
                    "{concept.hook}"
                  </p>
                </div>

                {/* Script Body Outline */}
                <div>
                  <div className="text-[11px] font-bold text-[#444746] uppercase tracking-wider mb-1.5">
                    Retention Structure
                  </div>
                  <p className="text-xs text-[#444746] whitespace-pre-line leading-relaxed bg-[#f0f4f9] p-3 rounded-xl">
                    {concept.bodyOutline}
                  </p>
                </div>

                {/* Call to action */}
                <div className="p-3 rounded-xl bg-[#e6f4ea] text-xs text-[#137333] font-medium leading-relaxed">
                  <span className="font-bold">Call To Action: </span>
                  {concept.callToAction}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-[#f1f3f4] bg-[#f8fafd] flex items-center justify-between gap-2">
                <select
                  value={concept.status}
                  onChange={(e) => handleUpdateStatus(concept.id, e.target.value as any)}
                  className="bg-white border border-[#e1e3e1] rounded-full px-3 py-1.5 text-xs text-[#1f1f1f] font-medium focus:outline-none focus:border-[#0b57d0]"
                >
                  <option value="ready_to_record">Ready to Record</option>
                  <option value="ready_to_publish">Ready to Publish</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                <button
                  onClick={() => {
                    if (onSendToPublisher) onSendToPublisher(concept);
                    if (onNavigate) onNavigate("publisher");
                  }}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-sm transition"
                >
                  <span>Publish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
