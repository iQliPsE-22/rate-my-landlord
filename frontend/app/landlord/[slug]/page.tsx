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
      <div className="p-6 sm:p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Score Badge */}
          <div
            className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center ${getScoreBg(score)}`}
          >
            <span className={`text-3xl font-bold tabular-nums ${getScoreColor(score)}`}>
              {score > 0 ? score.toFixed(1) : "—"}
            </span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(score) ? "text-amber-500" : "text-zinc-300"}`}
                  fill={s <= Math.round(score) ? "currentColor" : "none"}
                  strokeWidth={s <= Math.round(score) ? 0 : 2}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900">{landlord.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {landlord.city}
              </span>
              {landlord.pincodes.length > 0 && (
                <span className="text-zinc-400">{landlord.pincodes.join(", ")}</span>
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
            className="flex-shrink-0 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
          >
            Add Your Review
          </Link>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-100">
          {(Object.entries(landlord.aggregate_score) as [string, number][])
            .filter(([key]) => key !== "overall")
            .map(([key, val]) => (
              <div key={key} className="text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">
                  {RATING_LABELS[key as keyof RatingAxes]}
                </p>
                <p className={`text-2xl font-black tabular-nums ${getScoreColor(val)}`}>
                  {val > 0 ? val.toFixed(1) : "—"}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Red Flag Summary */}
      {Object.values(landlord.red_flag_counts).some((c) => c > 0) && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl mb-8 shadow-sm">
          <h3 className="text-sm font-bold text-rose-600 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <TrendingDown className="w-4 h-4" />
            Red Flags Reported
          </h3>
          <RedFlagTags readonly counts={landlord.red_flag_counts} />
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 mb-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-zinc-400" />
          Tenant Reviews
          <span className="text-lg font-medium text-zinc-500">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <MessageSquare className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No reviews yet</h3>
            <p className="text-zinc-500 font-medium">Be the first to review this landlord.</p>
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
