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
  Sparkles,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { AppSettings } from "@/lib/types";
import {
  getClientVault,
  saveClientVault,
  mergeWithClientVault,
  getAuthSession,
} from "@/lib/auth";

export function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const vault = getClientVault();
    return {
      adminPassword: vault.adminPassword || "admin123",
      apifyToken: vault.apifyToken || "",
      aiProvider: vault.aiProvider || "openai",
      openaiApiKey: vault.openaiApiKey || "",
      geminiApiKey: vault.geminiApiKey || "",
      metaAppId: vault.metaAppId || "",
      metaAppSecret: vault.metaAppSecret || "",
      metaAccessToken: vault.metaAccessToken || "",
      metaPageId: vault.metaPageId || "",
      instagramAccountId: vault.instagramAccountId || "",
      metaWebhookVerifyToken: vault.metaWebhookVerifyToken || "viralsaas_meta_verify_token",
      tiktokAppId: vault.tiktokAppId || "",
      tiktokAppSecret: vault.tiktokAppSecret || "",
      tiktokAccessToken: vault.tiktokAccessToken || "",
      tiktokOpenId: vault.tiktokOpenId || "",
      tiktokWebhookVerifyToken: vault.tiktokWebhookVerifyToken || "viralsaas_tiktok_verify_token",
      dmTriggerKeyword: vault.dmTriggerKeyword || "LINK",
      dmResponseTemplate: vault.dmResponseTemplate || "",
      dmTargetUrl: vault.dmTargetUrl || "",
      kvRestApiUrl: vault.kvRestApiUrl || "",
      kvRestApiToken: vault.kvRestApiToken || "",
      vercelAuthToken: vault.vercelAuthToken || "",
      vercelProjectId: vault.vercelProjectId || "",
      vercelTeamId: vault.vercelTeamId || "",
    };
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      const session = getAuthSession();
      const headers: Record<string, string> = {};
      if (session?.token) {
        headers["Authorization"] = `Bearer ${session.token}`;
      }

      const res = await fetch("/api/settings", { headers });
      const data = await res.json();
      if (data.settings) {
        // Merge with local vault so keys never reset
        const merged = mergeWithClientVault(data.settings);
        setSettings(merged);
        saveClientVault(merged);
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

      // Save to client vault immediately so it never resets
      saveClientVault(settings);

      const session = getAuthSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.token) {
        headers["Authorization"] = `Bearer ${session.token}`;
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers,
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Credentials saved to encrypted vault & synchronized with backend engines!",
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
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs font-semibold mb-2">
          <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" />
          <span>Real-Time Backend Dynamic Sync Active</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f1f1f] flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#0b57d0]" /> API Connections & Credentials
        </h1>
        <p className="text-sm text-[#444746] mt-1">
          Add or update your API keys directly in this portal. Any updates save and synchronize immediately with your
          backend dual scraper, AI synthesis engine, publishers, and webhook listeners.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 text-sm ${
            message.type === "success"
              ? "bg-[#e6f4ea] border-[#ceead6] text-[#137333]"
              : "bg-[#fce8e6] border-[#fad2cf] text-[#c5221f]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 0: Master Admin Access & Vault Security */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-white to-[#f8fafd] border border-[#d3e3fd] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e1e3e1] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#d3e3fd] text-[#0b57d0] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1f1f1f]">Master Admin Passcode & Security</h2>
                <p className="text-xs text-[#727775]">
                  Controls access to this Admin Portal. Testers use their separate dedicated access codes.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#0b57d0] text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Protected</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              Admin Password (Default: admin123)
            </label>
            <input
              type="text"
              placeholder="Enter new admin passcode"
              value={settings.adminPassword || "admin123"}
              onChange={(e) => updateField("adminPassword", e.target.value)}
              className="w-full max-w-md bg-white border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
            <p className="text-xs text-[#727775] mt-1.5">
              Change this to protect your portal from unauthorized visitors.
            </p>
          </div>
        </div>

        {/* Section 1: Apify Web Scraper */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1f1f1f]">1. Apify Layer (Dual-Platform Scraper)</h2>
                <p className="text-xs text-[#727775]">Powers the Instagram & TikTok competitor extraction actors.</p>
              </div>
            </div>
            <a
              href="https://console.apify.com/settings/integrations"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0] flex items-center gap-1"
            >
              Get Token <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              Apify Personal API Token
            </label>
            <input
              type="password"
              placeholder="apify_api_..."
              value={settings.apifyToken || ""}
              onChange={(e) => updateField("apifyToken", e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
          </div>
        </div>

        {/* Section 2: AI Intelligence */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#f1f3f4] pb-4">
            <div className="w-10 h-10 rounded-full bg-[#f3e8fd] text-[#9333ea] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f]">2. AI Hook & Content Engine (OpenAI / Gemini)</h2>
              <p className="text-xs text-[#727775]">Analyzes transcripts and comments to generate 5-day content plans.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Active AI Provider
              </label>
              <select
                value={settings.aiProvider}
                onChange={(e) => updateField("aiProvider", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              >
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Pro)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={settings.openaiApiKey || ""}
                onChange={(e) => updateField("openaiApiKey", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={settings.geminiApiKey || ""}
                onChange={(e) => updateField("geminiApiKey", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Meta Graph API (Instagram) */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#fce8e6] text-[#c5221f] flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1f1f1f]">3. Meta Graph API (Instagram Reels & Webhooks)</h2>
                <p className="text-xs text-[#727775]">Publishes Reels and sends automated DM responses to comments.</p>
              </div>
            </div>
            <a
              href="https://developers.facebook.com/apps"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0] flex items-center gap-1"
            >
              Meta App Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Instagram Business Account ID
              </label>
              <input
                type="text"
                placeholder="e.g. 17841400000000000"
                value={settings.instagramAccountId || ""}
                onChange={(e) => updateField("instagramAccountId", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Meta App ID
              </label>
              <input
                type="text"
                placeholder="Meta App ID"
                value={settings.metaAppId || ""}
                onChange={(e) => updateField("metaAppId", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              Meta Long-Lived Access Token
            </label>
            <input
              type="password"
              placeholder="EAAB..."
              value={settings.metaAccessToken || ""}
              onChange={(e) => updateField("metaAccessToken", e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Meta App Secret
              </label>
              <input
                type="password"
                placeholder="App secret for signature verification"
                value={settings.metaAppSecret || ""}
                onChange={(e) => updateField("metaAppSecret", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Meta Webhook Verify Token
              </label>
              <input
                type="text"
                value={settings.metaWebhookVerifyToken || ""}
                onChange={(e) => updateField("metaWebhookVerifyToken", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: TikTok Business */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1f1f1f]">4. TikTok Content Posting API</h2>
                <p className="text-xs text-[#727775]">Directly publishes short-form videos to your TikTok profile.</p>
              </div>
            </div>
            <a
              href="https://developers.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#0b57d0] hover:text-[#0842a0] flex items-center gap-1"
            >
              TikTok Developers <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                TikTok App ID
              </label>
              <input
                type="text"
                placeholder="TikTok App ID"
                value={settings.tiktokAppId || ""}
                onChange={(e) => updateField("tiktokAppId", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                TikTok Open ID (Creator ID)
              </label>
              <input
                type="text"
                placeholder="TikTok Open ID"
                value={settings.tiktokOpenId || ""}
                onChange={(e) => updateField("tiktokOpenId", e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              TikTok Creator Access Token
            </label>
            <input
              type="password"
              placeholder="act.xxxxxxx"
              value={settings.tiktokAccessToken || ""}
              onChange={(e) => updateField("tiktokAccessToken", e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
          </div>
        </div>

        {/* Section 5: Optional Vercel Direct Auto-Sync */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-[#f8fafd] to-[#f0f4f9] border border-[#d3e3fd] space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#e1e3e1] pb-4">
            <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f]">5. Optional: Vercel Project Direct Auto-Sync</h2>
              <p className="text-xs text-[#727775]">
                Pushes changes made in this portal directly to your Vercel Project Environment Variables via Vercel's REST API.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Vercel Personal Access Token
              </label>
              <input
                type="password"
                placeholder="Create at vercel.com/account/tokens"
                value={settings.vercelAuthToken || ""}
                onChange={(e) => updateField("vercelAuthToken", e.target.value)}
                className="w-full bg-white border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Vercel Project ID / Slug
              </label>
              <input
                type="text"
                placeholder="e.g. social-media or prj_xxxx"
                value={settings.vercelProjectId || ""}
                onChange={(e) => updateField("vercelProjectId", e.target.value)}
                className="w-full bg-white border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-sm shadow-sm hover:shadow transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Synchronizing to Backend..." : "Save & Sync to Backend"}</span>
        </button>
      </form>
    </div>
  );
}
