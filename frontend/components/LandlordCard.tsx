import Link from "next/link";
import { Star, MessageSquare, AlertTriangle } from "lucide-react";
import { getScoreColor } from "@/lib/utils";
import type { ILandlord } from "@/types";
import { RED_FLAGS } from "@/types";

interface LandlordCardProps {
  landlord: ILandlord;
}

export default function LandlordCard({ landlord }: LandlordCardProps) {
  const score = landlord.aggregate_score.overall;
  const topFlags = Object.entries(landlord.red_flag_counts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Link
      href={`/landlord/${landlord.slug}`}
      className="group block p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl
        hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300
        hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
            {landlord.name}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">{landlord.city}</p>
          {landlord.pincodes.length > 0 && (
            <p className="text-xs text-slate-500 mt-0.5">{landlord.pincodes.join(", ")}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`text-2xl font-bold tabular-nums ${getScoreColor(score)}`}>
            {score > 0 ? score.toFixed(1) : "—"}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${s <= Math.round(score) ? "text-amber-400" : "text-slate-600"}`}
                fill={s <= Math.round(score) ? "currentColor" : "none"}
                strokeWidth={s <= Math.round(score) ? 0 : 1.5}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/30">
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <MessageSquare className="w-4 h-4" />
          <span>{landlord.review_count} {landlord.review_count === 1 ? "review" : "reviews"}</span>
        </div>
        {topFlags.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-red-400/80">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {topFlags.map(([id]) => {
                const flag = RED_FLAGS.find((f) => f.id === id);
                return flag?.emoji;
              }).join(" ")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
