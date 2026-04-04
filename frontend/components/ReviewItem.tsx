"use client";

import { useState } from "react";
import { Flag, X, Clock } from "lucide-react";
import StarRating from "./StarRating";
import RedFlagTags from "./RedFlagTags";
import { formatDate } from "@/lib/utils";
import { RATING_LABELS } from "@/types";
import type { IReview } from "@/types";

interface ReviewItemProps {
  review: IReview;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: review._id, reason: reportReason }),
      });
      setReportSubmitted(true);
      setTimeout(() => setShowReportModal(false), 2000);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4" />
            <span>{formatDate(review.created_at)}</span>
          </div>
          {review.tenancy_period && (
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-semibold">
              Tenant: {review.tenancy_period}
            </span>
          )}
          {review.is_verified_tenant && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              ✓ Verified
            </span>
          )}
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
          title="Report this review"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {(Object.entries(review.ratings) as [keyof typeof RATING_LABELS, number][]).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-600">{RATING_LABELS[key]}</span>
            <StarRating value={val} readonly size="sm" />
          </div>
        ))}
      </div>

      {/* Red Flags */}
      {review.red_flags.length > 0 && (
        <div className="mb-4">
          <RedFlagTags selected={review.red_flags as any} readonly />
        </div>
      )}

      {/* Review Text */}
      {review.text && (
        <p className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">{review.text}</p>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center p-6 z-10">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-200">
            {reportSubmitted ? (
              <div className="text-center">
                <p className="text-emerald-600 font-bold mb-1">✓ Report submitted</p>
                <p className="text-sm text-zinc-500">We&apos;ll review this shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-zinc-900 font-bold">Report Review</h4>
                  <button onClick={() => setShowReportModal(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Why is this review problematic?"
                  className="w-full h-24 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/20 resize-none transition-all duration-200 shadow-sm"
                />
                <button
                  onClick={handleReport}
                  disabled={submitting || !reportReason.trim()}
                  className="w-full mt-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:hover:bg-rose-50 shadow-sm"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
