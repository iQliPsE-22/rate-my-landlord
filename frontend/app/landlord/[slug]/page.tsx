import { notFound } from "next/navigation";
import { Star, MapPin, MessageSquare, Calendar, TrendingDown, TrendingUp } from "lucide-react";
import ReviewItem from "@/components/ReviewItem";
import RedFlagTags from "@/components/RedFlagTags";
import Link from "next/link";
import { getScoreColor, getScoreBg, formatDate } from "@/lib/utils";
import { RATING_LABELS, type ILandlord, type IReview, type RatingAxes } from "@/types";

async function getLandlordData(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/landlords/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<{ landlord: ILandlord; reviews: IReview[] }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getLandlordData(slug);
  if (!data) return { title: "Landlord Not Found" };

  const { landlord } = data;
  return {
    title: `${landlord.name} Landlord Reviews — ${landlord.city} | Rate My Landlord India`,
    description: `Read ${landlord.review_count} tenant reviews for ${landlord.name} in ${landlord.city}. Overall rating: ${landlord.aggregate_score.overall}/5.`,
  };
}

export default async function LandlordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getLandlordData(slug);
  if (!data) notFound();

  const { landlord, reviews } = data;
  const score = landlord.aggregate_score.overall;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Landlord Header Card */}
      <div className="p-6 sm:p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Score Badge */}
          <div
            className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center ${getScoreBg(score)}`}
          >
            <span className={`text-3xl font-bold tabular-nums ${getScoreColor(score)}`}>
              {score > 0 ? score.toFixed(1) : "—"}
            </span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(score) ? "text-amber-400" : "text-slate-600"}`}
                  fill={s <= Math.round(score) ? "currentColor" : "none"}
                  strokeWidth={s <= Math.round(score) ? 0 : 1.5}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{landlord.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {landlord.city}
              </span>
              {landlord.pincodes.length > 0 && (
                <span className="text-slate-500">{landlord.pincodes.join(", ")}</span>
              )}
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> {landlord.review_count}{" "}
                {landlord.review_count === 1 ? "review" : "reviews"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Since {formatDate(landlord.created_at)}
              </span>
            </div>
          </div>

          {/* Review CTA */}
          <Link
            href="/submit"
            className="flex-shrink-0 text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25"
          >
            Add Your Review
          </Link>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/30">
          {(Object.entries(landlord.aggregate_score) as [string, number][])
            .filter(([key]) => key !== "overall")
            .map(([key, val]) => (
              <div key={key} className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  {RATING_LABELS[key as keyof RatingAxes]}
                </p>
                <p className={`text-xl font-bold tabular-nums ${getScoreColor(val)}`}>
                  {val > 0 ? val.toFixed(1) : "—"}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Red Flag Summary */}
      {Object.values(landlord.red_flag_counts).some((c) => c > 0) && (
        <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl mb-8">
          <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Red Flags Reported
          </h3>
          <RedFlagTags readonly counts={landlord.red_flag_counts} />
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          Tenant Reviews
          <span className="text-sm font-normal text-slate-500">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-slate-700/20">
            <p className="text-slate-400">No reviews yet. Be the first to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
