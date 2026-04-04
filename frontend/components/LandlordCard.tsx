import Link from "next/link";
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
      className="block p-6 sm:p-8 border bg-white group transition-colors duration-200"
      style={{ borderColor: "var(--border)", borderRadius: "4px" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--text-muted)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
              {landlord.name}
            </h3>
            {landlord.review_count > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider" style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "2px" }}>
                {landlord.review_count} {landlord.review_count === 1 ? "Review" : "Reviews"}
              </span>
            )}
          </div>
          
          <div className="text-sm font-medium flex items-center gap-2 mb-4" style={{ color: "var(--text-secondary)" }}>
            <span className="text-base">📍</span> {landlord.city}
            {landlord.pincodes.length > 0 && (
              <>
                <span>·</span>
                <span style={{ color: "var(--text-muted)" }}>{landlord.pincodes.join(", ")}</span>
              </>
            )}
          </div>

          {topFlags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topFlags.map(([id]) => {
                const flag = RED_FLAGS.find((f) => f.id === id);
                return (
                  <span key={id} className="text-xs font-bold px-2 py-1 rounded-sm" style={{ background: "var(--accent-surface)", color: "var(--accent)", border: "1px solid rgba(194,65,12,0.15)" }}>
                    {flag?.emoji} {flag?.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 text-center px-6 py-4 rounded-sm border" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>Rating</div>
          <div className={`text-4xl font-black accent-number ${getScoreColor(score)}`}>
            {score > 0 ? score.toFixed(1) : "—"}
          </div>
        </div>
      </div>
    </Link>
  );
}
