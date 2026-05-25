"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RED_FLAGS, RATING_LABELS } from "@/types";
import type { ILandlord, IReview, AggregateScore } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          data.landlord.reviews = data.reviews || [];
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
      <div className="py-32 text-center font-headline animate-pulse text-outline">
        Searching directory...
      </div>
    );
  }

  if (!landlord) {
    return (
      <div className="py-32 text-center max-w-md mx-auto pt-40">
        <h1 className="text-3xl font-headline font-bold mb-4 text-text-heading">Record Not Found</h1>
        <p className="font-body mb-8 text-text-body">We couldn't find a landlord record matching this designation in our directory.</p>
        <Link href="/search?q=" className="bg-accent hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-headline font-semibold">
          Return to directory
        </Link>
      </div>
    );
  }

  const overallScore = landlord.aggregate_score.overall;
  const isUnrated = overallScore === 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-primary">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`material-symbols-outlined ${rating >= star ? 'star-filled' : ''}`}
            style={{ fontVariationSettings: rating >= star ? "'FILL' 1" : "" }}
          >
            star
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto pt-6 md:pt-8 pb-16 md:pb-32">
      {/* Header Section */}
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex gap-2 text-xs font-label uppercase tracking-widest text-text-muted mb-3 md:mb-4">
              <Link href="/" className="hover:text-accent cursor-pointer">Directory</Link>
              <span>/</span>
              <span className="text-text-body font-semibold">{landlord.city || "Unknown City"}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-text-heading tracking-tighter leading-none">Landlord Profile</h1>
          </div>
          <div className="hidden lg:flex gap-4">
            <Link href="/submit" className="flex items-center gap-2 px-5 py-6 bg-white/70 backdrop-blur-xl border border-white/50 text-text-body hover:text-text-heading font-headline font-bold rounded-xl hover:bg-white transition-all shadow-card">
              <span className="material-symbols-outlined text-xl text-accent">rate_review</span>
              <span>Rate this Landlord</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

        {/* Left Column: Detailed Landlord Profile */}
        <section className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 shadow-card">

            <div className="flex items-start gap-6 mb-10">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-bg-subtle border border-blue-100 flex items-center justify-center shadow-sm text-4xl text-accent font-headline font-bold uppercase overflow-hidden">
                  {landlord.name.charAt(0)}
                </div>
                {!isUnrated && (
                  <div className="absolute -bottom-3 -right-3 bg-accent border border-white/50 text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-headline font-bold text-base md:text-lg shadow-accent">
                    {overallScore.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="pt-2">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-text-heading leading-tight mb-2">{landlord.name}</h2>
                <p className="text-text-muted font-medium mb-3">{landlord.review_count} {landlord.review_count === 1 ? 'Review' : 'Reviews'}</p>
                <div className="flex flex-wrap gap-2">
                  {overallScore >= 4.0 && (
                    <span className="bg-bg-subtle text-text-body border border-blue-100 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Top Rated</span>
                  )}
                  {overallScore < 2.5 && overallScore > 0 && (
                    <span className="bg-rose-50 border border-rose-100 text-rose-500 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">High Risk</span>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {(Object.keys(RATING_LABELS) as (keyof AggregateScore)[]).map((key) => {
                if (key === 'overall') return null;
                const score = landlord.aggregate_score[key as keyof AggregateScore] || 0;
                const percentage = isUnrated ? 0 : (score / 5) * 100;

                return (
                  <div key={key} className="bg-white/50 border border-white/60 p-4 md:p-5 rounded-2xl shadow-sm">
                    <span className="text-text-body text-xs md:text-xs font-label uppercase tracking-widest block mb-2">{RATING_LABELS[key as keyof typeof RATING_LABELS]}</span>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:flex-1 h-1.5 bg-bg-subtle rounded-full overflow-hidden border border-border-subtle/30">
                        <div className="h-full bg-accent" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="font-headline font-bold text-sm text-text-heading">{isUnrated ? '—' : score.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 md:space-y-4">
              <Link href="/submit" className="w-full bg-accent text-white hover:bg-blue-400 h-14 md:h-16 rounded-xl font-headline font-bold text-base md:text-lg shadow-accent transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined">rate_review</span>
                Write Review
              </Link>
              <Button variant="outline" className="w-full bg-white/70 border border-white/50 text-text-body h-14 md:h-16 rounded-xl font-headline font-bold text-base md:text-lg hover:bg-white transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-xl">share</span> Share Profile
              </Button>
            </div>
          </div>

          <div className="mt-8 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 md:p-8">
            <h3 className="font-headline font-bold text-xl mb-4 text-text-heading">Area Coverage</h3>
            <div className="h-32 md:h-48 rounded-2xl bg-bg-subtle overflow-hidden flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-6xl text-accent/40">map</span>
            </div>
            <p className="text-text-body text-sm leading-relaxed">
              Properties documented in <span className="font-bold text-text-heading">{landlord.city}</span>.
              {landlord.pincodes && landlord.pincodes.length > 0 && ` Associated pincodes: ${landlord.pincodes.join(", ")}.`}
            </p>
          </div>
        </section>

        {/* Right Column: Testimonials & Reviews */}
        <section className="lg:col-span-7 space-y-4 md:space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-headline font-bold text-text-heading">Tenant Testimonials</h3>
            <span className="text-text-body text-sm font-label font-medium bg-bg-subtle px-3 py-1 rounded-lg">Sorted by Recent</span>
          </div>

          {!landlord.reviews || landlord.reviews.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-12 text-center shadow-card">
              <span className="material-symbols-outlined text-5xl text-accent/50 mb-4 block">speaker_notes_off</span>
              <p className="text-lg text-text-body font-medium mb-4">No narrative reviews submitted yet.</p>
              <Link href="/submit" className="text-accent font-headline font-bold hover:underline">Be the first to review</Link>
            </div>
          ) : (
            <>
              {landlord.reviews.map((review: IReview) => {
                const reviewOverall = (review.ratings.deposit_return + review.ratings.maintenance + review.ratings.behaviour + review.ratings.rent_fairness) / 4;
                const reviewFlag = review.red_flags.length > 0 ? RED_FLAGS.find(f => f.id === review.red_flags[0]) : null;

                return (
                  <Card key={review._id} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-card hover:bg-white/80 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4 md:gap-0">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-bg-subtle flex items-center justify-center font-headline font-bold text-accent">
                            A
                          </div>
                          <div>
                            <h4 className="font-headline font-bold text-text-heading">Anonymous Tenant</h4>
                            <p className="text-xs md:text-xs text-text-muted font-label uppercase tracking-widest mt-1">
                              {review.tenancy_period || new Date(review.created_at).getFullYear()} • {review.pincode || review.city}
                            </p>
                          </div>
                        </div>
                        <div className="self-start">
                          {renderStars(reviewOverall)}
                        </div>
                      </div>

                      <p className="text-text-body font-body leading-relaxed mb-6 text-base md:text-lg whitespace-pre-wrap">
                        {review.text || <span className="italic opacity-60">"No detailed text provided, only scored metrics."</span>}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {review.is_verified_tenant && (
                          <span className="bg-accent/20 text-accent px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span> Verified Tenancy
                          </span>
                        )}
                        {reviewFlag && (
                          <span className="bg-rose-50 border border-rose-100 text-rose-500 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">warning</span> {reviewFlag.label}
                          </span>
                        )}
                        {review.red_flags.length > 1 && (
                          <span className="bg-white border border-border-subtle text-text-body px-3 py-1.5 rounded-xl text-xs font-bold">
                            +{review.red_flags.length - 1} more issues
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}

        </section>
      </div>
    </div>
  );
}
