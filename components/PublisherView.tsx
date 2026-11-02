"use client";

import React, { useState } from "react";
import { Send, Video, Sparkles, CheckCircle2, AlertCircle, Loader2, Link2, Instagram } from "lucide-react";
import { ContentConcept, SocialPlatform } from "@/lib/types";

interface PublisherViewProps {
  prefilledConcept?: ContentConcept | null;
}

export function PublisherView({ prefilledConcept }: PublisherViewProps) {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [videoUrl, setVideoUrl] = useState("");
  const [hook, setHook] = useState(prefilledConcept?.hook || "");
  const [caption, setCaption] = useState(prefilledConcept?.caption || "");
  const [publishing, setPublishing] = useState(false);
  const [statusStep, setStatusStep] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; id?: string } | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !caption) {
      setResult({ type: "error", message: "Please enter both video URL and caption." });
      return;
    }

    try {
      setPublishing(true);
      setResult(null);
      setStatusStep(platform === "instagram" ? "Creating Instagram Reel media container..." : "Initiating TikTok video publish...");

      const endpoint = platform === "instagram" ? "/api/publish/instagram" : "/api/publish/tiktok";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          hook,
          caption,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({
          type: "success",
          message:
            platform === "instagram"
              ? `Reel successfully published to Instagram! Media ID: ${data.mediaId}`
              : `Video successfully queued for TikTok publication! Publish ID: ${data.publishId}`,
          id: data.mediaId || data.publishId,
        });
      } else {
        setResult({ type: "error", message: data.error || "Failed to publish." });
      }
    } catch (err: any) {
      setResult({ type: "error", message: err.message });
    } finally {
      setPublishing(false);
      setStatusStep(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Send className="w-6 h-6 text-indigo-400" /> Multi-Platform Publishing Layer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Route your finished .mp4 videos directly to Instagram Reels (via Meta Graph API Container Flow) and TikTok (via Content Posting API).
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-sm ${
            result.type === "success"
              ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/30 border-red-800/80 text-red-300"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{result.message}</p>
            {result.id && <p className="text-xs text-slate-400 mt-0.5">Post Identifier: {result.id}</p>}
          </div>
        </div>
      )}

      {/* Main Publishing Form */}
      <div className="p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur">
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Target Destination
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPlatform("instagram")}
                className={`p-4 rounded-xl border flex items-center justify-center space-x-3 transition font-medium text-sm ${
                  platform === "instagram"
                    ? "bg-pink-950/40 border-pink-500/80 text-pink-300 shadow-md shadow-pink-500/10"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram Reels</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform("tiktok")}
                className={`p-4 rounded-xl border flex items-center justify-center space-x-3 transition font-medium text-sm ${
                  platform === "tiktok"
                    ? "bg-cyan-950/40 border-cyan-500/80 text-cyan-300 shadow-md shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Video className="w-5 h-5" />
                <span>TikTok Video</span>
              </button>
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Public .mp4 Video URL (Google Drive, Cloud Storage, or Vercel Blob)
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="url"
                required
                placeholder="https://storage.googleapis.com/your-bucket/reel.mp4 or direct download link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              * The video must be accessible over HTTPS so Meta and TikTok can download and encode the file.
            </p>
          </div>

          {/* Selected Hook */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Selected 2-Second Hook
            </label>
            <input
              type="text"
              placeholder="e.g. Discipline in one area of your life quietly spills over into everything else."
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Caption & Call To Action
            </label>
            <textarea
              rows={6}
              required
              placeholder="Enter full caption, line breaks, CTA keyword trigger, and hashtags..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Progress Indicator */}
          {statusStep && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-900/60 flex items-center space-x-3 text-xs text-indigo-300">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400 flex-shrink-0" />
              <span>{statusStep}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={publishing}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing & Publishing Video...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish to {platform === "instagram" ? "Instagram Reels" : "TikTok"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
