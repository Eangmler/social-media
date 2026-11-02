"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Key,
  CheckCircle2,
  AlertCircle,
  Save,
  ExternalLink,
  Cloud,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { AppSettings } from "@/lib/types";

export function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>({
    apifyToken: "",
    aiProvider: "openai",
    openaiApiKey: "",
    geminiApiKey: "",
    metaAppId: "",
    metaAppSecret: "",
    metaAccessToken: "",
    metaPageId: "",
    instagramAccountId: "",
    metaWebhookVerifyToken: "viralsaas_meta_verify_token",
    tiktokAppId: "",
    tiktokAppSecret: "",
    tiktokAccessToken: "",
    tiktokOpenId: "",
    tiktokWebhookVerifyToken: "viralsaas_tiktok_verify_token",
    dmTriggerKeyword: "LINK",
    dmResponseTemplate: "",
    dmTargetUrl: "",
    kvRestApiUrl: "",
    kvRestApiToken: "",
    vercelAuthToken: "",
    vercelProjectId: "",
    vercelTeamId: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Credentials saved and synced directly to backend storage & API engines!",
        });
        fetchSettings();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to update settings." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AppSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Backend Dynamic Sync Enabled</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" /> API Connections & Credentials Portal
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Add or edit your API keys directly in this portal. Any updates save and synchronize immediately with your
          backend dual scraper, AI synthesis engine, publishers, and webhook listeners.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Apify Web Scraper */}
        <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Key className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">1. Apify Layer (Dual-Platform Scraper)</h2>
            </div>
            <a
              href="https://console.apify.com/settings/integrations"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Get Token <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Apify Personal API Token
            </label>
            <input
              type="password"
              placeholder="apify_api_..."
              value={settings.apifyToken || ""}
              onChange={(e) => updateField("apifyToken", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Section 2: AI Intelligence */}
        <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur space-y-4">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-semibold text-white">2. AI Hook & Content Engine (OpenAI / Gemini)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Active AI Provider
              </label>
              <select
                value={settings.aiProvider}
                onChange={(e) => updateField("aiProvider", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Pro)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={settings.openaiApiKey || ""}
                onChange={(e) => updateField("openaiApiKey", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={settings.geminiApiKey || ""}
                onChange={(e) => updateField("geminiApiKey", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Meta Graph API (Instagram) */}
        <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Key className="w-5 h-5 text-pink-400" />
              <h2 className="text-base font-semibold text-white">3. Meta Graph API (Instagram Reels & Webhooks)</h2>
            </div>
            <a
              href="https://developers.facebook.com/apps"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              Meta App Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Instagram Business Account ID
              </label>
              <input
                type="text"
                placeholder="e.g. 17841400000000000"
                value={settings.instagramAccountId || ""}
                onChange={(e) => updateField("instagramAccountId", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Meta App ID
              </label>
              <input
                type="text"
                placeholder="Your Meta App ID"
                value={settings.metaAppId || ""}
                onChange={(e) => updateField("metaAppId", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Meta Long-Lived Access Token (User or System User Token)
            </label>
            <input
              type="password"
              placeholder="EAAB..."
              value={settings.metaAccessToken || ""}
              onChange={(e) => updateField("metaAccessToken", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Meta App Secret
              </label>
              <input
                type="password"
                placeholder="App secret for signature verification"
                value={settings.metaAppSecret || ""}
                onChange={(e) => updateField("metaAppSecret", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Meta Webhook Verify Token
              </label>
              <input
                type="text"
                value={settings.metaWebhookVerifyToken || ""}
                onChange={(e) => updateField("metaWebhookVerifyToken", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: TikTok Business & Content Posting API */}
        <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Key className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">4. TikTok Content Posting API</h2>
            </div>
            <a
              href="https://developers.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              TikTok Developers <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                TikTok App ID
              </label>
              <input
                type="text"
                placeholder="TikTok App ID"
                value={settings.tiktokAppId || ""}
                onChange={(e) => updateField("tiktokAppId", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                TikTok Open ID (Creator Identifier)
              </label>
              <input
                type="text"
                placeholder="TikTok Open ID"
                value={settings.tiktokOpenId || ""}
                onChange={(e) => updateField("tiktokOpenId", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              TikTok Creator / User Access Token
            </label>
            <input
              type="password"
              placeholder="act.xxxxxxx"
              value={settings.tiktokAccessToken || ""}
              onChange={(e) => updateField("tiktokAccessToken", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Section 5: Optional Vercel Direct Sync */}
        <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur space-y-4">
          <div className="flex items-center space-x-2.5">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-semibold text-white">5. Optional: Vercel Direct Project Auto-Sync</h2>
              <p className="text-xs text-slate-400">
                Supply your Vercel Token and Project ID so every change made in this portal pushes directly to your Vercel
                Project Environment Variables via Vercel's REST API.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Vercel Personal Access Token
              </label>
              <input
                type="password"
                placeholder="Create at vercel.com/account/tokens"
                value={settings.vercelAuthToken || ""}
                onChange={(e) => updateField("vercelAuthToken", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Vercel Project ID / Slug
              </label>
              <input
                type="text"
                placeholder="e.g. prj_xxxxxxx or social-media"
                value={settings.vercelProjectId || ""}
                onChange={(e) => updateField("vercelProjectId", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Synchronizing to Backend..." : "Save & Sync to Backend"}</span>
        </button>
      </form>
    </div>
  );
}
