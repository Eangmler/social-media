"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  CalendarDays,
  Send,
  MessageSquareCode,
  ArrowRight,
  Sparkles,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Video,
  Instagram,
  Radio,
} from "lucide-react";
import { NavTab } from "./Navbar";
import { getClientVault } from "@/lib/auth";

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
      const vault = getClientVault();
      const res = await fetch("/api/cron/scrape-and-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vault }),
      });
      const data = await res.json();
      if (res.ok) {
        setCronMessage(`Success: Scraped ${data.stats?.postsAnalyzed || 0} posts & synthesized ${data.stats?.conceptsGenerated || 0} hooks!`);
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Google Store Style Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e8f0fe] via-[#f3f6fc] to-[#e7eef8] p-8 sm:p-12 border border-[#d3e3fd]">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#c2e7ff] text-[#0b57d0] text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
            <span className="lowercase">your social media assistant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1f1f1f] leading-[1.15]">
            Capture attention. <br />
            Publish with confidence.
          </h1>

          <p className="text-base text-[#444746] leading-relaxed">
            Continuously extract viral retention patterns from high-performing creators, generate psychological hooks, and
            automate multi-platform distribution and comment-to-DM conversions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleManualCronRun}
              disabled={isTriggeringCron}
              className="px-6 py-3 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-sm shadow-sm hover:shadow transition flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTriggeringCron ? "animate-spin" : ""}`} />
              <span>{isTriggeringCron ? "Scraping & Synthesizing..." : "Trigger Weekly Cycle"}</span>
            </button>

            <button
              onClick={() => onNavigate("publisher")}
              className="px-6 py-3 rounded-full bg-white hover:bg-[#f0f4f9] border border-[#727775] text-[#1f1f1f] font-medium text-sm transition"
            >
              Publish Video Reel
            </button>
          </div>
        </div>
      </div>

      {cronMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 text-sm ${
            cronMessage.startsWith("Success")
              ? "bg-[#e6f4ea] border-[#ceead6] text-[#137333]"
              : "bg-[#fce8e6] border-[#fad2cf] text-[#c5221f]"
          }`}
        >
          {cronMessage.startsWith("Success") ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{cronMessage}</span>
        </div>
      )}

      {/* Google Store Hardware-Style Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-6 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#444746] uppercase tracking-wider">Monitored Accounts</span>
            <div className="w-10 h-10 rounded-full bg-[#fce8e6] text-[#c5221f] flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#1f1f1f] tracking-tight">{stats.competitorsCount}</div>
          <p className="text-xs text-[#727775] mt-1">Active targets on IG & TikTok</p>
          <button
            onClick={() => onNavigate("competitors")}
            className="mt-4 inline-flex items-center text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0]"
          >
            <span>Manage accounts</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#444746] uppercase tracking-wider">Content Concepts</span>
            <div className="w-10 h-10 rounded-full bg-[#f3e8fd] text-[#9333ea] flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#1f1f1f] tracking-tight">{stats.calendarCount}</div>
          <p className="text-xs text-[#137333] font-medium mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> AI synthesized
          </p>
          <button
            onClick={() => onNavigate("calendar")}
            className="mt-4 inline-flex items-center text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0]"
          >
            <span>View 5-day calendar</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#444746] uppercase tracking-wider">Published Videos</span>
            <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#1f1f1f] tracking-tight">{stats.publishedCount}</div>
          <p className="text-xs text-[#727775] mt-1">Direct via Meta & TikTok</p>
          <button
            onClick={() => onNavigate("publisher")}
            className="mt-4 inline-flex items-center text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0]"
          >
            <span>Publish video</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#444746] uppercase tracking-wider">Automated DMs</span>
            <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
              <MessageSquareCode className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#1f1f1f] tracking-tight">{stats.dmSentCount}</div>
          <p className="text-xs text-[#137333] font-medium mt-1">Delivered via webhooks</p>
          <button
            onClick={() => onNavigate("dm-automation")}
            className="mt-4 inline-flex items-center text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0]"
          >
            <span>Configure funnel</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Real-Time Stream & Publishing Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time DM Conversions */}
        <div className="p-7 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f]">Live Comment-to-DM Stream</h2>
              <p className="text-xs text-[#727775]">Automatically triggered when viewers comment your keyword.</p>
            </div>
            <button
              onClick={() => onNavigate("dm-automation")}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#f0f4f9] text-[#1f1f1f] hover:bg-[#e1e3e1] transition"
            >
              View Funnel
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#727775]">
                No comments captured yet. Webhook listener active at <code className="text-[#0b57d0]">/api/webhooks/instagram</code>.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e9eef6] flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#1f1f1f]">@{log.senderUsername || log.senderId}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-white border border-[#e1e3e1] text-[#444746]">
                        {log.platform}
                      </span>
                    </div>
                    <p className="text-[#444746] italic">"{log.commentText}"</p>
                    <p className="text-[11px] text-[#137333] font-medium truncate max-w-sm">
                      Sent link: {log.sentMessage}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#727775] flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Publishing Activity */}
        <div className="p-7 rounded-[28px] bg-white border border-[#e1e3e1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f]">Recent Publishing Activity</h2>
              <p className="text-xs text-[#727775]">Videos routed to Instagram Reels and TikTok via APIs.</p>
            </div>
            <button
              onClick={() => onNavigate("publisher")}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#f0f4f9] text-[#1f1f1f] hover:bg-[#e1e3e1] transition"
            >
              Upload Reel
            </button>
          </div>

          <div className="space-y-3">
            {recentJobs.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#727775]">
                No videos published yet. Select a concept in the calendar or open the <span className="text-[#0b57d0] font-medium">Publishing Layer</span>.
              </div>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e9eef6] flex items-start justify-between text-xs"
                >
                  <div className="space-y-1 max-w-sm">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-[#e8f0fe] text-[#0b57d0]">
                        {job.platform}
                      </span>
                      <span className="font-bold text-[#1f1f1f] truncate">{job.hook || "Video Reel"}</span>
                    </div>
                    <p className="text-[#727775] line-clamp-1">{job.caption}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        job.status === "published"
                          ? "bg-[#e6f4ea] text-[#137333]"
                          : job.status === "processing"
                          ? "bg-[#fef7e0] text-[#b06000]"
                          : "bg-[#fce8e6] text-[#c5221f]"
                      }`}
                    >
                      {job.status}
                    </span>
                    <p className="text-[10px] text-[#727775] mt-1">
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
