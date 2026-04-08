import Link from "next/link";
import { getScoreColor } from "@/lib/utils";
import type { ILandlord } from "@/types";
import { RED_FLAGS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

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
    <Link href={`/landlord/${landlord.slug}`} className="block group">
      <Card className="transition-colors duration-200 border-white/50 group-hover:border-[#abc4ff] bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(31,56,100,0.06)]">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 pt-6 sm:pb-8 sm:pt-8 w-full border-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold tracking-tight text-[#2d3748]">
                {landlord.name}
              </h3>
              {landlord.review_count > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#edf2fb] text-[#4a5568] border border-[#e2eafc] rounded-md">
                  {landlord.review_count} {landlord.review_count === 1 ? "Review" : "Reviews"}
                </span>
              )}
            </div>
            
            <div className="text-sm font-medium flex items-center gap-2 mb-4 text-[#718096]">
              <span className="text-base text-[#abc4ff]">📍</span> {landlord.city}
              {landlord.pincodes.length > 0 && (
                <>
                  <span>·</span>
                  <span className="text-slate-400">{landlord.pincodes.join(", ")}</span>
                </>
              )}
            </div>

            {topFlags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topFlags.map(([id]) => {
                  const flag = RED_FLAGS.find((f) => f.id === id);
                  return (
                    <span key={id} className="text-xs font-bold px-2 py-1 rounded-md bg-rose-50 text-rose-500 border border-rose-100">
                      {flag?.emoji} {flag?.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 text-center px-6 py-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-[#abc4ff]">Rating</div>
            <div className={`text-4xl font-black ${getScoreColor(score)}`}>
              {score > 0 ? score.toFixed(1) : "—"}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
