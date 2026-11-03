"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Star,
  MessageSquare,
  Shield,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { TesterAccount, TesterReview } from "@/lib/types";

export function TesterManagementView() {
  const [testers, setTesters] = useState<TesterAccount[]>([]);
  const [reviews, setReviews] = useState<TesterReview[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Tester Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTesters = async () => {
    try {
      const res = await fetch("/api/testers");
      const data = await res.json();
      if (data.testers) setTesters(data.testers);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTesters();
    fetchReviews();
  }, []);

  const handleCopyLink = (passcode: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}?access=${encodeURIComponent(passcode)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddTester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !passcode) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/testers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, passcode, notes }),
      });
      if (res.ok) {
        setName("");
        setPasscode("");
        setNotes("");
        setShowAddForm(false);
        fetchTesters();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (tester: TesterAccount) => {
    try {
      await fetch("/api/testers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tester.id, updates: { active: !tester.active } }),
      });
      fetchTesters();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this tester?")) return;
    try {
      await fetch(`/api/testers?id=${id}`, { method: "DELETE" });
      fetchTesters();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#e8f0fe] text-[#0b57d0] text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Multi-Tester Feedback Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1f1f1f]">
            Tester Portals & Feedback
          </h1>
          <p className="text-sm text-[#444746] mt-1">
            Share dedicated access links with your 3 initial testers (or add more). Testers can test the workflow and submit reviews.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-sm transition self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? "Cancel" : "+ Add New Tester"}</span>
        </button>
      </div>

      {/* Add Tester Card */}
      {showAddForm && (
        <form
          onSubmit={handleAddTester}
          className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#0b57d0]/30 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="text-sm font-bold text-[#1f1f1f] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#0b57d0]" />
            <span>Create New Tester Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444746] mb-1">Tester Name / Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Tester 4 (Marketing)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2 text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] mb-1">Passcode / Access Code</label>
              <input
                type="text"
                required
                placeholder="e.g. test-delta"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2 text-xs text-[#1f1f1f] font-mono focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444746] mb-1">Testing Focus / Notes</label>
              <input
                type="text"
                placeholder="e.g. Testing TikTok video uploads"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-full px-4 py-2 text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-full bg-[#0b57d0] text-white text-xs font-semibold hover:bg-[#0842a0] transition"
          >
            {isSubmitting ? "Creating..." : "Save Tester"}
          </button>
        </form>
      )}

      {/* Testers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testers.map((t) => (
          <div
            key={t.id}
            className={`p-6 rounded-[28px] bg-white border transition shadow-sm flex flex-col justify-between ${
              t.active ? "border-[#e1e3e1]" : "border-[#e1e3e1] opacity-60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f3f4] text-[#1f1f1f]">
                  {t.name}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    t.active ? "bg-[#e6f4ea] text-[#137333]" : "bg-[#fce8e6] text-[#c5221f]"
                  }`}
                >
                  {t.active ? "Active" : "Disabled"}
                </span>
              </div>

              <div>
                <p className="text-xs text-[#727775]">Access Passcode:</p>
                <p className="text-sm font-mono font-bold text-[#0b57d0] bg-[#f8fafd] px-3 py-1.5 rounded-xl border border-[#e1e3e1] mt-1 select-all">
                  {t.passcode}
                </p>
              </div>

              {t.notes && <p className="text-xs text-[#444746] italic">"{t.notes}"</p>}
            </div>

            <div className="pt-4 border-t border-[#f1f3f4] mt-4 space-y-2">
              <button
                onClick={() => handleCopyLink(t.passcode, t.id)}
                className="w-full py-2 px-3 rounded-full bg-[#e8f0fe] hover:bg-[#d3e3fd] text-[#0b57d0] text-xs font-semibold transition flex items-center justify-center space-x-1.5"
              >
                {copiedId === t.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#137333]" />
                    <span className="text-[#137333]">1-Click Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy 1-Click Access Link</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#727775]">
                <button
                  onClick={() => handleToggle(t)}
                  className="hover:text-[#1f1f1f] flex items-center space-x-1"
                >
                  {t.active ? <ToggleRight className="w-4 h-4 text-[#34a853]" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{t.active ? "Deactivate" : "Activate"}</span>
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="hover:text-[#c5221f] text-[#727775] flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tester Reviews / Feedback Section */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#e1e3e1] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#fef7e0] text-[#b06000] flex items-center justify-center">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f]">Tester Reviews & Feedback</h2>
              <p className="text-xs text-[#727775]">
                Real-time reviews and bug reports submitted directly from tester sessions.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f1f3f4] text-[#444746]">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <MessageSquare className="w-8 h-8 text-[#727775] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#1f1f1f]">No tester reviews submitted yet</p>
            <p className="text-xs text-[#727775] max-w-sm mx-auto">
              Share the access links above with your testers. When they submit feedback via their portal, it appears here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#f8fafd] border border-[#e1e3e1] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#1f1f1f]">{rev.testerName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#0b57d0] font-semibold">
                      {rev.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? "text-[#fbbc04] fill-current" : "text-[#e1e3e1]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#1f1f1f] leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-[#727775]">{new Date(rev.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
