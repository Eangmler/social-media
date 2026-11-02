"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareCode, Save, Copy, Check, Radio, CheckCircle2, AlertCircle } from "lucide-react";
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

  const previewMessage = responseTemplate.replace(/\{\{link\}\}/gi, targetUrl || "https://yourbrand.com/link");

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f1f1f] flex items-center gap-2.5">
          <MessageSquareCode className="w-7 h-7 text-[#0b57d0]" /> Real-Time Comment-to-DM Automation
        </h1>
        <p className="text-sm text-[#444746] mt-1">
          When a viewer comments your trigger keyword on any Instagram Reel or TikTok video, the webhook automatically sends
          your link and message to their Direct Messages.
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
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Webhook Endpoints Helper Card */}
      <div className="p-7 rounded-[28px] bg-gradient-to-br from-[#e8f0fe] to-[#f3f6fc] border border-[#d3e3fd]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2">
          <Radio className="w-4 h-4 text-[#34a853] animate-pulse" />
          <span>Webhook Endpoints for Meta & TikTok</span>
        </div>
        <p className="text-xs text-[#444746] mb-4">
          Add these callback URLs into your Meta for Developers App (Webhooks &gt; Instagram) and TikTok Developer Portal:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#e1e3e1] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#727775]">Instagram Webhook URL</span>
              <p className="text-xs font-mono text-[#1f1f1f] truncate max-w-xs">{igWebhookUrl}</p>
            </div>
            <button
              onClick={() => copyToClipboard(igWebhookUrl, "igWebhook")}
              className="p-2 rounded-full border border-[#e1e3e1] text-[#444746] hover:bg-[#f0f4f9]"
            >
              {copiedField === "igWebhook" ? <Check className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#e1e3e1] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#727775]">Instagram Verify Token</span>
              <p className="text-xs font-mono text-[#1f1f1f] truncate max-w-xs">
                {settings?.metaWebhookVerifyToken || "viralsaas_meta_verify_token"}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(settings?.metaWebhookVerifyToken || "viralsaas_meta_verify_token", "igToken")}
              className="p-2 rounded-full border border-[#e1e3e1] text-[#444746] hover:bg-[#f0f4f9]"
            >
              {copiedField === "igToken" ? <Check className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Funnel Configuration Form */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Trigger Keyword (Case-Insensitive)
              </label>
              <input
                type="text"
                required
                value={triggerKeyword}
                onChange={(e) => setTriggerKeyword(e.target.value)}
                placeholder="e.g. LINK"
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] font-mono uppercase tracking-wider focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
              <p className="text-[11px] text-[#727775] mt-1 pl-2">
                Any comment containing this keyword triggers the automated direct message.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
                Destination Link (Replaces <code className="text-[#0b57d0]">{"{{link}}"}</code>)
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://kisseh.com/thinkoutloud"
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              Automated Direct Message Template
            </label>
            <textarea
              rows={4}
              required
              value={responseTemplate}
              onChange={(e) => setResponseTemplate(e.target.value)}
              placeholder="Hey! Thanks for watching. Here is the link you requested: {{link}}"
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-2xl p-4 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd] leading-relaxed"
            />
          </div>

          {/* Real-Time Preview Styled Like Google Messages */}
          <div className="p-5 rounded-2xl bg-[#f0f4f9] border border-[#e1e3e1]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#727775] block mb-2">
              Viewer Direct Message Preview
            </span>
            <div className="max-w-md p-3.5 rounded-2xl bg-white border border-[#e1e3e1] text-xs text-[#1f1f1f] shadow-sm leading-relaxed">
              {previewMessage || "Enter a template above to preview."}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-sm shadow-sm hover:shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Funnel..." : "Save DM Automation Settings"}</span>
          </button>
        </form>
      </div>

      {/* Recent Comment & DM Log */}
      <div className="p-8 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm">
        <h2 className="text-base font-bold text-[#1f1f1f] mb-4">Live Delivery History ({logs.length})</h2>
        {logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#727775]">
            No comment-to-DM triggers recorded yet. Once subscribed, comment events will stream here live.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e9eef6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#1f1f1f]">@{log.senderUsername || log.senderId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white border border-[#e1e3e1] text-[#444746]">
                      {log.platform}
                    </span>
                    <span className="text-[10px] text-[#727775]">
                      Keyword: <span className="text-[#0b57d0] font-semibold">{log.matchedKeyword}</span>
                    </span>
                  </div>
                  <p className="text-[#444746]">Comment: "{log.commentText}"</p>
                  <p className="text-[11px] text-[#137333] font-medium">Sent: "{log.sentMessage}"</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      log.status === "sent" ? "bg-[#e6f4ea] text-[#137333]" : "bg-[#fce8e6] text-[#c5221f]"
                    }`}
                  >
                    {log.status}
                  </span>
                  <p className="text-[10px] text-[#727775] mt-1">
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
