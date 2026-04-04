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
    <div className="relative p-5 bg-slate-800/30 border border-slate-700/30 rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(review.created_at)}</span>
          </div>
          {review.tenancy_period && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs">
              Tenant: {review.tenancy_period}
            </span>
          )}
          {review.is_verified_tenant && (
            <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 text-xs font-medium border border-teal-500/20">
              ✓ Verified
            </span>
          )}
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="text-slate-500 hover:text-red-400 transition-colors p-1"
          title="Report this review"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {(Object.entries(review.ratings) as [keyof typeof RATING_LABELS, number][]).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <span className="text-sm text-slate-400">{RATING_LABELS[key]}</span>
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
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{review.text}</p>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 z-10">
          <div className="w-full max-w-sm">
            {reportSubmitted ? (
              <div className="text-center">
                <p className="text-teal-400 font-medium">✓ Report submitted</p>
                <p className="text-sm text-slate-400 mt-1">We&apos;ll review this shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Report Review</h4>
                  <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Why is this review problematic?"
                  className="w-full h-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500/50 resize-none"
                />
                <button
                  onClick={handleReport}
                  disabled={submitting || !reportReason.trim()}
                  className="w-full mt-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-40"
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
