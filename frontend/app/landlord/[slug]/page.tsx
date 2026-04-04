"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getScoreColor, getScoreBg, formatDate } from "@/lib/utils";
import type { ILandlord, IReview } from "@/types";
import { RATING_LABELS, RED_FLAGS } from "@/types";
import ReviewItem from "@/components/ReviewItem";

export default function LandlordPage() {
  const params = useParams();
  const [landlord, setLandlord] = useState<ILandlord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/landlords/${params.slug}`);
        const data = await res.json();
        if (data.landlord) {
          setLandlord(data.landlord);
        }
      } catch (err) {
        console.error("Failed to fetch landlord");
      } finally {
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="py-32 text-center font-bold" style={{ color: "var(--text-muted)" }}>
        Loading registry file...
      </div>
    );
  }

  if (!landlord) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--text)" }}>Landlord Not Found</h1>
        <p className="font-medium mb-8" style={{ color: "var(--text-secondary)" }}>We couldn't find a record matching this profile.</p>
        <Link href="/search?q=" className="font-bold underline underline-offset-4" style={{ color: "var(--accent)" }}>
          Return to directory
        </Link>
      </div>
    );
  }

  const score = landlord.aggregate_score.overall;
  const isUnrated = score === 0;

  // Compute Red Flags distribution
  const flagCounts = Object.entries(landlord.red_flag_counts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([id, count]) => ({
      flag: RED_FLAGS.find((f) => f.id === id)!,
      count,
    }));

  return (
    <div>
      {/* Header — Editorial Dossier Style */}
      <header className="border-b pt-16 pb-12" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border" style={{ borderColor: "var(--border)", background: "var(--card)", borderRadius: "2px" }}>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
                  Subject Profile
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
                  ID: {landlord.slug.split("-")[1] || "01"}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4" style={{ color: "var(--text)" }}>
                {landlord.name}
              </h1>
              
              <div className="flex items-center gap-4 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--text)" }}></span>
                  {landlord.city}
                </div>
                {landlord.pincodes.length > 0 && (
                  <>
                    <span className="opacity-30">/</span>
                    <span style={{ color: "var(--text-muted)" }}>{landlord.pincodes.join(", ")}</span>
                  </>
                )}
                <span className="opacity-30">/</span>
                <span style={{ color: "var(--text-muted)" }}>
                  {landlord.review_count} {landlord.review_count === 1 ? "File" : "Files"}
                </span>
              </div>
            </div>

            <div className={`p-8 text-center flex-shrink-0 ${getScoreBg(score)}`} style={{ minWidth: "160px", borderRadius: "4px" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>Aggregate Rating</div>
              <div className={`text-6xl sm:text-7xl font-black accent-number leading-none ${getScoreColor(score)}`}>
                {isUnrated ? "—" : score.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-16">
          
          {/* Main Feed (Reviews) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "var(--text)" }}>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Tenant Testimonies</h2>
            </div>
            
            {landlord.reviews.length === 0 ? (
              <div className="p-8 border text-center" style={{ borderColor: "var(--border)", background: "var(--card)", borderRadius: "4px" }}>
                <p className="font-medium" style={{ color: "var(--text-secondary)" }}>No reviews filed yet.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {landlord.reviews.map((review) => (
                  <ReviewItem key={(review as any)._id || Math.random()} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Metrics */}
          <div className="space-y-12">
            
            <Link
              href="/submit"
              className="block w-full text-center py-4 font-bold transition-all border border-transparent hover:border-black"
              style={{ background: "var(--text)", color: "var(--card)", borderRadius: "4px" }}
            >
              File a Review
            </Link>

            {/* Sub-scores */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--text-secondary)" }}>Assessment Breakdown</h3>
              <div className="space-y-5">
                {(Object.entries(landlord.aggregate_score) as [keyof typeof RATING_LABELS, number][]).map(([key, val]) => {
                  if (key === "overall") return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span style={{ color: "var(--text)" }}>{RATING_LABELS[key]}</span>
                        <span className={`accent-number ${getScoreColor(val)}`}>{val > 0 ? val.toFixed(1) : "—"}</span>
                      </div>
                      <div className="w-full h-1.5 overflow-hidden" style={{ background: "var(--border)", borderRadius: "1px" }}>
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${(val / 5) * 100}%`, background: "var(--text)" }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Flags */}
            {flagCounts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--danger)" }}>Violations Reported</h3>
                <div className="space-y-3">
                  {flagCounts.map(({ flag, count }) => (
                    <div key={flag.id} className="flex justify-between items-center p-4 border" style={{ borderColor: "var(--danger)", background: "rgba(220,38,38,0.02)", borderRadius: "4px" }}>
                      <span className="font-bold text-sm" style={{ color: "var(--danger)" }}>
                        {flag.emoji} {flag.label}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-black" style={{ background: "var(--danger)", color: "white", borderRadius: "2px" }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
