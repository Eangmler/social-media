"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  CalendarDays,
  Send,
  MessageSquareCode,
  ArrowRight,
  TrendingUp,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { NavTab } from "./Sidebar";

interface DashboardOverviewProps {
  onNavigate: (tab: NavTab) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    competitorsCount: 0,
    calendarCount: 0,
    publishedCount: 0,
    dmSentCount: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTriggeringCron, setIsTriggeringCron] = useState(false);
  const [cronMessage, setCronMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [compRes, calRes, logsRes] = await Promise.all([
        fetch("/api/competitors").then((r) => r.json()),
        fetch("/api/calendar").then((r) => r.json()),
        fetch("/api/logs").then((r) => r.json()),
      ]);

      const competitors = compRes.competitors || [];
      const calendar = calRes.calendar || [];
      const dmLogs = logsRes.dmLogs || [];
      const publishJobs = logsRes.publishJobs || [];

      setStats({
        competitorsCount: competitors.length,
        calendarCount: calendar.length,
        publishedCount: publishJobs.filter((j: any) => j.status === "published").length,
        dmSentCount: dmLogs.filter((l: any) => l.status === "sent").length,
      });

      setRecentLogs(dmLogs.slice(0, 5));
      setRecentJobs(publishJobs.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleManualCronRun = async () => {
    try {
      setIsTriggeringCron(true);
      setCronMessage(null);
      const res = await fetch("/api/cron/scrape-and-generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setCronMessage(`Success: Scraped ${data.stats?.postsAnalyzed || 0} posts & generated ${data.stats?.conceptsGenerated || 0} hooks!`);
        fetchDashboardData();
      } else {
        setCronMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setCronMessage(`Failed to trigger: ${err.message}`);
    } finally {
      setIsTriggeringCron(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Social Engine Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Automating your competitor scraping, hook synthesis, multi-platform publishing, and comment-to-DM conversions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleManualCronRun}
            disabled={isTriggeringCron}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isTriggeringCron ? "animate-spin" : "fill-current"}`} />
            <span>{isTriggeringCron ? "Scraping & Synthesizing..." : "Trigger Scrape Cycle Now"}</span>
          </button>
        </div>
      </div>

      {cronMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-sm ${
            cronMessage.startsWith("Success")
              ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/30 border-red-800/80 text-red-300"
          }`}
        >
          {cronMessage.startsWith("Success") ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{cronMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Competitors</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.competitorsCount}</span>
            <span className="text-xs text-slate-500">IG & TikTok</span>
          </div>
          <button
            onClick={() => onNavigate("competitors")}
            className="mt-3 text-xs text-pink-400 hover:text-pink-300 flex items-center font-medium"
          >
            Manage Accounts <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Content Concepts</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.calendarCount}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Ready
            </span>
          </div>
          <button
            onClick={() => onNavigate("calendar")}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 flex items-center font-medium"
          >
            View Calendar Hooks <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Videos Published</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.publishedCount}</span>
            <span className="text-xs text-slate-500">Reels & TikToks</span>
          </div>
          <button
            onClick={() => onNavigate("publisher")}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 flex items-center font-medium"
          >
            Open Publisher <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Automated DMs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquareCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.dmSentCount}</span>
            <span className="text-xs text-emerald-400 font-medium">Delivered</span>
          </div>
          <button
            onClick={() => onNavigate("dm-automation")}
            className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 flex items-center font-medium"
          >
            Configure Funnel <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent DM Conversions & Publishing Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time DM Conversions */}
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Live Comment-to-DM Stream</h2>
              <p className="text-xs text-slate-400">Triggered by viewers commenting your designated keyword.</p>
            </div>
            <button
              onClick={() => onNavigate("dm-automation")}
              className="text-xs font-medium text-slate-400 hover:text-white"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No comment triggers recorded yet. Webhooks are listening on <code className="text-indigo-400">/api/webhooks/instagram</code>.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/40 flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">@{log.senderUsername || log.senderId}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase bg-slate-800 text-slate-300">
                        {log.platform}
                      </span>
                    </div>
                    <p className="text-slate-400 italic">"{log.commentText}"</p>
                    <p className="text-[11px] text-emerald-400 truncate max-w-sm">
                      Sent: {log.sentMessage}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Publishing Queue & History */}
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Publishing Activity</h2>
              <p className="text-xs text-slate-400">Multi-platform video deployments to Instagram & TikTok.</p>
            </div>
            <button
              onClick={() => onNavigate("publisher")}
              className="text-xs font-medium text-slate-400 hover:text-white"
            >
              New Upload
            </button>
          </div>

          <div className="space-y-3">
            {recentJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No videos published yet. Head to the <span className="text-indigo-400 font-medium">Publishing Layer</span> to drop a video with an AI hook.
              </div>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/40 flex items-start justify-between text-xs"
                >
                  <div className="space-y-1 max-w-sm">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                        {job.platform}
                      </span>
                      <span className="font-semibold text-white truncate">{job.hook || "Video Reel"}</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1">{job.caption}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        job.status === "published"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : job.status === "processing"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}
                    >
                      {job.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
