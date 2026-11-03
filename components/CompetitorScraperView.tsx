"use client";

import React, { useState, useEffect } from "react";
import { Users2, Plus, Trash2, Power, Play, CheckCircle2, AlertCircle, ExternalLink, Sparkles, Settings } from "lucide-react";
import { CompetitorTarget, SocialPlatform } from "@/lib/types";
import { getClientVault } from "@/lib/auth";

interface CompetitorScraperViewProps {
  onNavigate?: (tab: any) => void;
}

export function CompetitorScraperView({ onNavigate }: CompetitorScraperViewProps) {
  const [competitors, setCompetitors] = useState<CompetitorTarget[]>([]);
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [handle, setHandle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRunningScrape, setIsRunningScrape] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/competitors");
      const data = await res.json();
      setCompetitors(data.competitors || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, handle, category }),
      });
      const data = await res.json();
      if (res.ok) {
        setHandle("");
        setCategory("");
        setMessage({ type: "success", text: `Added @${data.competitor.handle} to active surveillance.` });
        fetchCompetitors();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await fetch(`/api/competitors?id=${id}`, { method: "PATCH" });
      fetchCompetitors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/competitors?id=${id}`, { method: "DELETE" });
      fetchCompetitors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerScrape = async () => {
    try {
      setIsRunningScrape(true);
      setMessage(null);
      const vault = getClientVault();

      const res = await fetch("/api/cron/scrape-and-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-vault": JSON.stringify(vault),
        },
        body: JSON.stringify({ vault }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `Dual-platform scrape complete! Analyzed ${data.stats?.postsAnalyzed} posts and generated ${data.stats?.conceptsGenerated} concepts in the Content Calendar tab.`,
        });
      } else {
        setMessage({ type: "error", text: data.error || "Scrape failed" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsRunningScrape(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f1f1f] flex items-center gap-2.5">
            <Users2 className="w-7 h-7 text-[#0b57d0]" /> Dual-Platform Competitor Intelligence
          </h1>
          <p className="text-sm text-[#444746] mt-1">
            Track top-performing creators across Instagram and TikTok. The Apify SDK extracts transcripts, engagement velocity,
            and audience comments to identify what resonates.
          </p>
        </div>
        <button
          onClick={handleTriggerScrape}
          disabled={isRunningScrape || competitors.filter((c) => c.active).length === 0}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-sm shadow-sm hover:shadow transition disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunningScrape ? "animate-spin" : "fill-current"}`} />
          <span>{isRunningScrape ? "Scraping & Synthesizing..." : "Run Dual Scraper Now"}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-start space-x-3 text-sm ${
            message.type === "success"
              ? "bg-[#e6f4ea] border-[#ceead6] text-[#137333]"
              : "bg-[#fce8e6] border-[#fad2cf] text-[#c5221f]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-medium">{message.text}</span>
            {message.type === "error" && onNavigate && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => onNavigate("settings")}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-[#c5221f] border border-[#fad2cf] text-xs font-bold hover:bg-[#fad2cf] transition cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Go to Settings & APIs to enter your Apify & Gemini keys</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Competitor Form Card */}
      <div className="p-7 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm">
        <h2 className="text-base font-bold text-[#1f1f1f] mb-4">Add Competitor Account to Track</h2>
        <form onSubmit={handleAddCompetitor} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">Handle / Username</label>
            <input
              type="text"
              placeholder="e.g. danmartell"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] placeholder:text-[#727775] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">Niche / Category</label>
            <input
              type="text"
              placeholder="e.g. SaaS Founders, Mindset"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] placeholder:text-[#727775] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-sm shadow-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Target</span>
            </button>
          </div>
        </form>
      </div>

      {/* Competitors List */}
      <div className="p-7 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm">
        <h2 className="text-base font-bold text-[#1f1f1f] mb-4">Active Monitoring Targets ({competitors.length})</h2>

        {competitors.length === 0 ? (
          <div className="py-12 text-center text-[#727775] text-sm">
            No competitor profiles added yet. Add a username above to start tracking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#f1f3f4] text-xs uppercase tracking-wider text-[#727775]">
                  <th className="pb-3 font-semibold">Platform</th>
                  <th className="pb-3 font-semibold">Account Handle</th>
                  <th className="pb-3 font-semibold">Niche / Category</th>
                  <th className="pb-3 font-semibold">Surveillance</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                {competitors.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8fafd] transition">
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          c.platform === "instagram"
                            ? "bg-[#fce8e6] text-[#c5221f]"
                            : "bg-[#e8f0fe] text-[#0b57d0]"
                        }`}
                      >
                        {c.platform}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#1f1f1f]">@{c.handle}</span>
                        <a
                          href={c.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#727775] hover:text-[#0b57d0]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 text-[#444746]">{c.category || "General"}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center text-xs font-semibold ${
                          c.active ? "text-[#137333]" : "text-[#727775]"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            c.active ? "bg-[#34a853]" : "bg-[#c4c7c5]"
                          }`}
                        />
                        {c.active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggle(c.id)}
                        className="p-2 rounded-full border border-[#e1e3e1] text-[#444746] hover:text-[#1f1f1f] hover:bg-[#f0f4f9]"
                        title={c.active ? "Pause" : "Resume"}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 rounded-full border border-[#e1e3e1] text-[#444746] hover:text-[#c5221f] hover:bg-[#fce8e6]"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
