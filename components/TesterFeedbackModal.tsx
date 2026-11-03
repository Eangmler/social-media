"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Star, X, CheckCircle2, Sparkles } from "lucide-react";
import { AuthSession } from "@/lib/types";

interface TesterFeedbackModalProps {
  session: AuthSession;
}

export function TesterFeedbackModal({ session }: TesterFeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<"Scraper" | "AI Calendar" | "Publisher" | "DM Automation" | "General">("General");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testerName: session.name,
          rating,
          category,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
          setComment("");
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white shadow-xl hover:shadow-2xl transition flex items-center space-x-2 text-xs font-semibold cursor-pointer border border-white/20"
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span>Submit Review / Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#1f1f1f]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-[#e1e3e1] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-[#f1f3f4] text-[#727775]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#e8f0fe] text-[#0b57d0] text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Tester Feedback</span>
              </div>
              <h2 className="text-xl font-bold text-[#1f1f1f]">Leave a Review / Report</h2>
              <p className="text-xs text-[#727775]">
                Signed in as <strong className="text-[#1f1f1f]">{session.name}</strong>. Your feedback is sent directly to the Admin.
              </p>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#34a853] mx-auto animate-bounce" />
                <h3 className="text-sm font-bold text-[#1f1f1f]">Thank you for your feedback!</h3>
                <p className="text-xs text-[#727775]">Your review has been synchronized with the admin dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-[#444746] mb-1.5">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? "text-[#fbbc04] fill-current" : "text-[#e1e3e1]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#727775] ml-2 font-medium">{rating} of 5</span>
                  </div>
                </div>

                {/* Category Pill Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#444746] mb-1.5">Feature Area</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(["General", "Scraper", "AI Calendar", "Publisher", "DM Automation"] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs transition ${
                          category === cat
                            ? "bg-[#0b57d0] text-white font-semibold"
                            : "bg-[#f1f3f4] text-[#444746] hover:bg-[#e1e3e1]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#444746] mb-1.5">
                    What worked well? What felt slow or needs fixing?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter your detailed review or bug description..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#f8fafd] border border-[#e1e3e1] rounded-2xl p-3 text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#d3e3fd]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
