import { getScoreColor, formatDate } from "@/lib/utils";
import type { IReview } from "@/types";
import { RATING_LABELS, RED_FLAGS } from "@/types";

interface ReviewItemProps {
  review: IReview;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const flags = review.red_flags.map((id) => RED_FLAGS.find((f) => f.id === id)).filter(Boolean);

  return (
    <div className="group pl-0 sm:pl-6 border-l-2 transition-colors duration-300" style={{ borderColor: "var(--border)" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--text)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
      
      {/* Meta Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase">
        <span className="bg-stone-900 text-white px-2 py-1 rounded-sm">
          Rating: {review.ratings.overall.toFixed(1)}
        </span>
        <span style={{ color: "var(--text-muted)" }}>
          {formatDate(review.createdAt!)}
        </span>
        {review.tenancy_period && (
          <>
            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
            <span style={{ color: "var(--text-secondary)" }}>Period: {review.tenancy_period}</span>
          </>
        )}
      </div>

      {/* Main Text Content */}
      <div className="mb-6">
        <p className="text-lg font-medium leading-relaxed" style={{ color: "var(--text)" }}>
          {review.text || <span className="italic text-stone-400">No written testimony provided.</span>}
        </p>
      </div>

      {/* Flags & Sub-ratings grid */}
      <div className="grid sm:grid-cols-2 gap-6 bg-stone-50 p-6 rounded-sm border border-stone-200">
        
        {/* Left: Ratings Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
          {(Object.entries(review.ratings) as [keyof typeof RATING_LABELS, number][]).map(([key, val]) => {
            if (key === "overall") return null;
            return (
              <div key={key} className="flex justify-between">
                <span className="text-stone-500 font-medium">{RATING_LABELS[key]}</span>
                <span className={`font-bold ${getScoreColor(val)}`}>{val}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Flags */}
        {flags.length > 0 && (
          <div className="border-t sm:border-t-0 sm:border-l border-stone-200 pt-4 sm:pt-0 sm:pl-6">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-red-600 mb-3">Reported Flags</h4>
            <div className="flex flex-wrap gap-2">
              {flags.map((flag) => (
                <span key={flag?.id} className="text-xs font-bold px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-sm inline-flex items-center gap-1">
                  {flag?.emoji} {flag?.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
