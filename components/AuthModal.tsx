"use client";

import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, UserCheck, ArrowRight, Sparkles, Key } from "lucide-react";
import { setAuthSession } from "@/lib/auth";
import { AuthSession } from "@/lib/types";

interface AuthModalProps {
  onSuccess: (session: AuthSession) => void;
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"admin" | "tester">("admin");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check URL query parameters for 1-click login link: ?access=test-alpha or ?admin=admin123
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const accessCode = params.get("access") || params.get("code");
      const adminCode = params.get("admin");

      if (accessCode) {
        handleAutoLogin(accessCode);
      } else if (adminCode) {
        handleAutoLogin(adminCode);
      }
    }
  }, []);

  const handleAutoLogin = async (code: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setAuthSession(data.user);
        onSuccess(data.user);
      }
    } catch (e) {
      // Ignore auto-login error, fallback to manual form
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setAuthSession(data.user);
        onSuccess(data.user);
      } else {
        setError(data.error || "Invalid passcode.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f1f1f]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] border border-[#e1e3e1] shadow-2xl max-w-md w-full p-8 sm:p-10 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Google 4-Color Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
          </div>
          <h1 className="text-3xl font-black text-[#1f1f1f] tracking-tight lowercase">meye</h1>
          <p className="text-xs text-[#727775] lowercase">
            your social media assistant • sign in as admin or enter tester passcode
          </p>
        </div>

        {/* Tab Selector Pills */}
        <div className="bg-[#f1f3f4] p-1 rounded-full flex text-xs font-semibold text-[#444746]">
          <button
            type="button"
            onClick={() => {
              setTab("admin");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-full transition flex items-center justify-center space-x-1.5 ${
              tab === "admin"
                ? "bg-white text-[#1f1f1f] shadow-sm font-bold"
                : "hover:text-[#1f1f1f]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0b57d0]" />
            <span>Admin Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("tester");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-full transition flex items-center justify-center space-x-1.5 ${
              tab === "tester"
                ? "bg-white text-[#1f1f1f] shadow-sm font-bold"
                : "hover:text-[#1f1f1f]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#34a853]" />
            <span>Tester Access</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#444746] uppercase tracking-wider mb-2">
              {tab === "admin" ? "Admin Password" : "Tester Access Passcode"}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder={tab === "admin" ? "Enter admin password (e.g. admin123)" : "e.g. test-alpha"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-3 text-sm text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
              />
              <Key className="w-4 h-4 text-[#727775] absolute right-4 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-[#fce8e6] border border-[#fad2cf] text-[#c5221f] text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-semibold shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : tab === "admin" ? "Sign In as Admin" : "Enter Tester Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Helper Note */}
        <div className="text-center pt-2 border-t border-[#f1f3f4]">
          {tab === "admin" ? (
            <p className="text-[11px] text-[#727775]">
              Default admin password: <code className="bg-[#f1f3f4] px-1.5 py-0.5 rounded text-[#1f1f1f] font-mono">admin123</code>. You can customize this in Settings.
            </p>
          ) : (
            <p className="text-[11px] text-[#727775]">
              Pre-configured test codes: <code className="bg-[#f1f3f4] px-1 py-0.5 rounded text-[#1f1f1f] font-mono">test-alpha</code>, <code className="bg-[#f1f3f4] px-1 py-0.5 rounded text-[#1f1f1f] font-mono">test-beta</code>, <code className="bg-[#f1f3f4] px-1 py-0.5 rounded text-[#1f1f1f] font-mono">test-gamma</code>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
