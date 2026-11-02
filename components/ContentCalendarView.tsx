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
  Tag,
  Share2,
} from "lucide-react";
import { ContentConcept } from "@/lib/types";
import { NavTab } from "./Sidebar";

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
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-purple-400" /> AI-Generated Weekly Content Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Weekly synthesized short-form video concepts derived from real competitor signals. Designed for maximum retention,
            watch time, and comment conversions.
          </p>
        </div>
        <button
          onClick={fetchCalendar}
          className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white text-xs font-medium"
        >
          Refresh Concepts
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading AI content calendar...</p>
        </div>
      ) : concepts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white">No Content Concepts Generated Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-5">
            Run the Dual-Platform Scraper to crawl your competitor accounts. The LLM will automatically generate your 5-day
            retention-tested content plan.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate("competitors")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
            >
              Go to Scraper Tab
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept, index) => (
            <div
              key={concept.id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur flex flex-col justify-between overflow-hidden hover:border-slate-700 transition"
            >
              {/* Card Top */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
                      {concept.dayOfWeek}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-500" /> {concept.recommendedPostTimeGMT} GMT
                    </span>
                  </div>
                  <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-500">
                    {concept.targetPlatform}
                  </span>
                </div>

                {/* Angle & Viral Pattern */}
                <div>
                  <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1">
                    {concept.angle}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Pattern: {concept.viralPattern}</span>
                  </div>
                </div>

                {/* Hook (Hero) */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 relative group">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1 flex items-center justify-between">
                    <span>The 2-Second Hook</span>
                    <button
                      onClick={() => handleCopyHook(concept.id, concept.hook)}
                      className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                      title="Copy Hook"
                    >
                      {copiedId === concept.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === concept.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-100 italic leading-snug">
                    "{concept.hook}"
                  </p>
                </div>

                {/* Script Body Outline */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Retention Structure
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950/30 p-2.5 rounded-lg border border-slate-900">
                    {concept.bodyOutline}
                  </p>
                </div>

                {/* Call to action & Trigger keyword */}
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300">
                  <span className="font-semibold">Call To Action: </span>
                  {concept.callToAction}
                </div>
              </div>

              {/* Card Footer: Status & Actions */}
              <div className="p-4 border-t border-slate-800/60 bg-slate-950/50 flex items-center justify-between gap-2">
                <select
                  value={concept.status}
                  onChange={(e) => handleUpdateStatus(concept.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
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
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium transition"
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
