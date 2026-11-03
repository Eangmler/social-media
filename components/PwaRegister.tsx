"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[PWA] Service Worker registered with scope:", reg.scope))
        .catch((err) => console.warn("[PWA] Service Worker registration failed:", err));
    }

    // 2. Listen for BeforeInstallPrompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm w-full bg-white rounded-3xl border border-[#d3e3fd] shadow-2xl p-4 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#1f1f1f]">Install ViralPulse App</p>
          <p className="text-[11px] text-[#727775]">Add to your Home Screen or Dock for 1-tap access.</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-sm transition"
        >
          Install
        </button>
        <button
          onClick={() => setShowInstallBanner(false)}
          className="p-1 rounded-full hover:bg-[#f1f3f4] text-[#727775]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
