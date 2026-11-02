"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareCode, Save, Copy, Check, ExternalLink, Radio, CheckCircle2, AlertCircle } from "lucide-react";
import { AppSettings, DmLog } from "@/lib/types";

export function DmAutomationView() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [triggerKeyword, setTriggerKeyword] = useState("LINK");
  const [responseTemplate, setResponseTemplate] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [logs, setLogs] = useState<DmLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/logs").then((r) => r.json()),
      ]);

      if (settingsRes.settings) {
        setSettings(settingsRes.settings);
        setTriggerKeyword(settingsRes.settings.dmTriggerKeyword || "LINK");
        setResponseTemplate(settingsRes.settings.dmResponseTemplate || "");
        setTargetUrl(settingsRes.settings.dmTargetUrl || "");
      }

      setLogs(logsRes.dmLogs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dmTriggerKeyword: triggerKeyword.toUpperCase().trim(),
          dmResponseTemplate: responseTemplate,
          dmTargetUrl: targetUrl,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "DM Automation funnel updated successfully!" });
        fetchData();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to update." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app";
  const igWebhookUrl = `${appUrl}/api/webhooks/instagram`;
  const ttWebhookUrl = `${appUrl}/api/webhooks/tiktok`;

  // Live preview message
  const previewMessage = responseTemplate.replace(/\{\{link\}\}/gi, targetUrl || "https://yourbrand.com/link");

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <MessageSquareCode className="w-6 h-6 text-emerald-400" /> Real-Time Comment-to-DM Automation
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          When a viewer comments your trigger keyword on any Instagram Reel or TikTok video, the webhook instantly delivers
          your link and message to their Direct Messages.
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

      {/* Webhook Endpoints Helper Card */}
      <div className="p-6 rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/30 to-purple-950/30 backdrop-blur">
        <h2 className="text-sm font-semibold text-indigo-300 flex items-center gap-2 mb-3">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Developer App Webhook Endpoints
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Paste these URLs into your Meta for Developers App (under Webhooks &gt; Instagram) and TikTok Developer Portal:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500">Instagram Webhook Callback URL</span>
              <p className="text-xs font-mono text-slate-300 truncate max-w-xs">{igWebhookUrl}</p>
            </div>
            <button
              onClick={() => copyToClipboard(igWebhookUrl, "igWebhook")}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
            >
              {copiedField === "igWebhook" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500">Instagram Verify Token</span>
              <p className="text-xs font-mono text-slate-300 truncate max-w-xs">
                {settings?.metaWebhookVerifyToken || "viralsaas_meta_verify_token"}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(settings?.metaWebhookVerifyToken || "viralsaas_meta_verify_token", "igToken")}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
            >
              {copiedField === "igToken" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Funnel Configuration Form */}
      <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Trigger Keyword (Case-Insensitive)
              </label>
              <input
                type="text"
                required
                value={triggerKeyword}
                onChange={(e) => setTriggerKeyword(e.target.value)}
                placeholder="e.g. LINK or WORK or SCRIPT"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Any comment containing this word will trigger the automatic DM response.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Destination Link (Replaces <code className="text-emerald-400">{"{{link}}"}</code>)
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://kisseh.com/thinkoutloud"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Automated Direct Message Response Template
            </label>
            <textarea
              rows={4}
              required
              value={responseTemplate}
              onChange={(e) => setResponseTemplate(e.target.value)}
              placeholder="Hey! Thanks for watching. Here is the link you requested: {{link}}"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Real-Time Message Preview */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Viewer Direct Message Preview
            </span>
            <p className="text-xs text-emerald-300 leading-relaxed font-mono">
              {previewMessage || "Enter a template above to preview."}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Funnel..." : "Save DM Automation Settings"}</span>
          </button>
        </form>
      </div>

      {/* Recent Comment & DM Log */}
      <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
        <h2 className="text-base font-semibold text-white mb-4">Live Delivery History ({logs.length})</h2>
        {logs.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No comment-to-DM triggers recorded yet. Once your webhook is subscribed, comments will populate here in real-time.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">@{log.senderUsername || log.senderId}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                      {log.platform}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Matched: <span className="text-emerald-400 font-semibold">{log.matchedKeyword}</span>
                    </span>
                  </div>
                  <p className="text-slate-400">Comment: "{log.commentText}"</p>
                  <p className="text-[11px] text-emerald-400">Sent DM: "{log.sentMessage}"</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                      log.status === "sent" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                    }`}
                  >
                    {log.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
