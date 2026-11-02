"use client";

import React, { useState, useEffect } from "react";
import { Users2, Plus, Trash2, Power, Play, CheckCircle2, AlertCircle, ExternalLink, Globe } from "lucide-react";
import { CompetitorTarget, SocialPlatform } from "@/lib/types";

export function CompetitorScraperView() {
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
        setMessage({ type: "success", text: `Added @${data.competitor.handle} to active targets.` });
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
      const res = await fetch("/api/cron/scrape-and-generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `Dual-platform scrape complete! Analyzed ${data.stats?.postsAnalyzed} posts and generated ${data.stats?.conceptsGenerated} fresh concepts in the Content Calendar tab.`,
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
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-indigo-400" /> Dual-Platform Competitor Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure competitor targets. The Apify SDK extracts transcripts, engagement velocity, and comment reactions
            from Instagram (`apify/instagram-post-scraper`) and TikTok (`clockworks/tiktok-scraper`).
          </p>
        </div>
        <button
          onClick={handleTriggerScrape}
          disabled={isRunningScrape || competitors.filter((c) => c.active).length === 0}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunningScrape ? "animate-spin" : "fill-current"}`} />
          <span>{isRunningScrape ? "Scraping & Synthesizing..." : "Run Dual Scraper Now"}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/30 border-red-800/80 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add New Competitor Form */}
      <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
        <h2 className="text-base font-semibold text-white mb-4">Add Target Account to Monitor</h2>
        <form onSubmit={handleAddCompetitor} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Handle / Username</label>
            <input
              type="text"
              placeholder="e.g. danmartell or @danmartell"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Niche / Category</label>
            <input
              type="text"
              placeholder="e.g. SaaS Founders, Mindset"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Target</span>
            </button>
          </div>
        </form>
      </div>

      {/* Competitors List */}
      <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
        <h2 className="text-base font-semibold text-white mb-4">Active Monitoring Targets ({competitors.length})</h2>

        {competitors.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No competitor profiles added yet. Add a username above to start tracking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Platform</th>
                  <th className="pb-3 font-semibold">Account Handle</th>
                  <th className="pb-3 font-semibold">Niche / Category</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {competitors.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/30 transition">
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          c.platform === "instagram"
                            ? "bg-pink-950/70 text-pink-300 border border-pink-800/60"
                            : "bg-cyan-950/70 text-cyan-300 border border-cyan-800/60"
                        }`}
                      >
                        {c.platform}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">@{c.handle}</span>
                        <a
                          href={c.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400">{c.category || "General"}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center text-xs font-medium ${
                          c.active ? "text-emerald-400" : "text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            c.active ? "bg-emerald-400" : "bg-slate-600"
                          }`}
                        />
                        {c.active ? "Active Monitor" : "Paused"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggle(c.id)}
                        className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                        title={c.active ? "Pause Scrape" : "Resume Scrape"}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Target"
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
