"use client";

import React, { useState } from "react";
import { Send, Video, CheckCircle2, AlertCircle, Loader2, Link2, Instagram } from "lucide-react";
import { ContentConcept, SocialPlatform } from "@/lib/types";
import { getClientVault } from "@/lib/auth";

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
      setResult({ type: "error", message: "Please provide both video URL and caption." });
      return;
    }

    try {
      setPublishing(true);
      setResult(null);
      setStatusStep(platform === "instagram" ? "Creating Instagram Reel container..." : "Initiating TikTok video publish...");

      const endpoint = platform === "instagram" ? "/api/publish/instagram" : "/api/publish/tiktok";

      const vault = getClientVault();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          hook,
          caption,
          vault,
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
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f1f1f] flex items-center gap-2.5">
          <Send className="w-7 h-7 text-[#0b57d0]" /> Multi-Platform Publishing Layer
        </h1>
        <p className="text-sm text-[#444746] mt-1">
          Deploy finished .mp4 videos directly to Instagram Reels (via Meta Graph API Container Flow) and TikTok (via TikTok Content Posting API).
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 text-sm ${
            result.type === "success"
              ? "bg-[#e6f4ea] border-[#ceead6] text-[#137333]"
              : "bg-[#fce8e6] border-[#fad2cf] text-[#c5221f]"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <div>
            <p className="font-semibold">{result.message}</p>
            {result.id && <p className="text-xs text-[#727775] mt-0.5">Post ID: {result.id}</p>}
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm">
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Platform Selector Pills */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-3">
              Destination Platform
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPlatform("instagram")}
                className={`p-4 rounded-2xl border flex items-center justify-center space-x-3 transition font-semibold text-sm ${
                  platform === "instagram"
                    ? "bg-[#fce8e6] border-[#f28b82] text-[#c5221f] shadow-sm"
                    : "border-[#e1e3e1] bg-[#f8fafd] text-[#444746] hover:bg-white"
                }`}
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram Reels</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform("tiktok")}
                className={`p-4 rounded-2xl border flex items-center justify-center space-x-3 transition font-semibold text-sm ${
                  platform === "tiktok"
                    ? "bg-[#e8f0fe] border-[#aecbfa] text-[#0b57d0] shadow-sm"
                    : "border-[#e1e3e1] bg-[#f8fafd] text-[#444746] hover:bg-white"
                }`}
              >
                <Video className="w-5 h-5" />
                <span>TikTok Video</span>
              </button>
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              Public .mp4 Video URL (Google Drive, Cloud Storage, or Vercel Blob)
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-[#727775] absolute left-4 top-3.5" />
              <input
                type="url"
                required
                placeholder="https://storage.googleapis.com/your-bucket/reel.mp4 or direct download link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
            </div>
            <p className="text-[11px] text-[#727775] mt-1.5 pl-2">
              * Must be publicly accessible over HTTPS so Meta and TikTok can download and encode the video.
            </p>
          </div>

          {/* Selected Hook */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              2-Second Opening Hook
            </label>
            <input
              type="text"
              placeholder="e.g. Discipline in one area of your life quietly spills over into everything else."
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2.5 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              Caption & Call-To-Action
            </label>
            <textarea
              rows={6}
              required
              placeholder="Write your complete caption with CTA trigger word and hashtags..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-2xl p-4 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd] leading-relaxed"
            />
          </div>

          {/* Progress Indicator */}
          {statusStep && (
            <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#ceead6] flex items-center space-x-3 text-xs text-[#0b57d0] font-medium">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>{statusStep}</span>
            </div>
          )}

          {/* Submit Pill Button */}
          <button
            type="submit"
            disabled={publishing}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-sm shadow-sm hover:shadow transition disabled:opacity-50"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Video...</span>
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
