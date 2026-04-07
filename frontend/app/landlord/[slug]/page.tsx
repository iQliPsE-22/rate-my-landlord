"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RED_FLAGS, RATING_LABELS } from "@/types";
import type { ILandlord, IReview, AggregateScore } from "@/types";

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
      <div className="py-32 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-headline font-bold mb-4 text-on-surface">Record Not Found</h1>
        <p className="font-body mb-8 text-on-surface-variant">We couldn't find a landlord record matching this designation in our directory.</p>
        <Link href="/search?q=" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-headline font-semibold">
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
    <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex items-end justify-between">
          <div>
            <nav className="flex gap-2 text-xs font-label uppercase tracking-widest text-outline mb-4">
              <Link href="/" className="hover:text-primary cursor-pointer">Directory</Link>
              <span>/</span>
              <span className="text-on-surface-variant font-semibold">{landlord.city || "Unknown City"}</span>
            </nav>
            <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tighter leading-none">Landlord Profile</h1>
          </div>
          <div className="hidden lg:flex gap-4">
            <Link href="/submit" className="flex items-center gap-2 px-5 py-3 bg-surface-container-low text-primary font-headline font-bold rounded-xl hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-xl">rate_review</span>
              <span>Rate this Landlord</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Detailed Landlord Profile */}
        <section className="col-span-12 lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 shadow-[0px_24px_48px_-12px_rgba(19,27,46,0.06)]">
            
            <div className="flex items-start gap-6 mb-10">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-surface-container flex items-center justify-center shadow-xl text-4xl text-primary font-headline font-bold uppercase overflow-hidden">
                  {landlord.name.charAt(0)}
                </div>
                {!isUnrated && (
                  <div className="absolute -bottom-3 -right-3 bg-primary text-on-primary w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-headline font-bold text-base sm:text-lg shadow-lg">
                    {overallScore.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface leading-tight mb-2">{landlord.name}</h2>
                <p className="text-outline font-medium mb-3">{landlord.review_count} {landlord.review_count === 1 ? 'Review' : 'Reviews'}</p>
                <div className="flex flex-wrap gap-2">
                  {overallScore >= 4.0 && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Top Rated</span>
                  )}
                  {overallScore < 2.5 && overallScore > 0 && (
                    <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">High Risk</span>
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
                  <div key={key} className="bg-surface-container-low p-4 sm:p-5 rounded-2xl">
                    <span className="text-outline text-[10px] sm:text-xs font-label uppercase tracking-widest block mb-2">{RATING_LABELS[key as keyof typeof RATING_LABELS]}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <div className="w-full sm:flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="font-headline font-bold text-sm">{isUnrated ? '—' : score.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Link href="/submit" className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3 sm:py-4 rounded-2xl font-headline font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined">rate_review</span>
                Write Review
              </Link>
              <button className="w-full bg-surface-container-high text-primary py-3 sm:py-4 rounded-2xl font-headline font-bold text-base sm:text-lg hover:bg-surface-container-highest transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-xl">share</span> Share Profile
              </button>
            </div>
          </div>

          <div className="mt-8 bg-surface-container-low rounded-3xl p-6 sm:p-8">
            <h3 className="font-headline font-bold text-xl mb-4">Area Coverage</h3>
            <div className="h-32 sm:h-48 rounded-2xl bg-surface-container overflow-hidden flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-6xl text-outline/30">map</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Properties documented in <span className="font-bold text-on-surface">{landlord.city}</span>.
              {landlord.pincodes && landlord.pincodes.length > 0 && ` Associated pincodes: ${landlord.pincodes.join(", ")}.`}
            </p>
          </div>
        </section>

        {/* Right Column: Testimonials & Reviews */}
        <section className="col-span-12 lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-headline font-bold text-on-surface">Tenant Testimonials</h3>
            <span className="text-outline text-sm font-label font-medium bg-surface-container-low px-3 py-1 rounded-lg">Sorted by Recent</span>
          </div>

          {!landlord.reviews || landlord.reviews.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-[0px_12px_24px_-8px_rgba(19,27,46,0.04)]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">speaker_notes_off</span>
              <p className="text-lg text-on-surface-variant font-medium mb-4">No narrative reviews submitted yet.</p>
              <Link href="/submit" className="text-primary font-headline font-bold hover:underline">Be the first to review</Link>
            </div>
          ) : (
            <>
              {landlord.reviews.map((review: IReview) => {
                const reviewOverall = (review.ratings.deposit_return + review.ratings.maintenance + review.ratings.behaviour + review.ratings.rent_fairness) / 4;
                const reviewFlag = review.red_flags.length > 0 ? RED_FLAGS.find(f => f.id === review.red_flags[0]) : null;

                return (
                  <article key={review._id} className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-[0px_12px_24px_-8px_rgba(19,27,46,0.04)] hover:bg-surface-container-low transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4 sm:gap-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex items-center justify-center font-headline font-bold text-primary">
                          A
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-on-surface">Anonymous Tenant</h4>
                          <p className="text-[10px] sm:text-xs text-outline font-label uppercase tracking-widest mt-1">
                            {review.tenancy_period || new Date(review.created_at).getFullYear()} • {review.pincode || review.city} 
                          </p>
                        </div>
                      </div>
                      <div className="self-start">
                        {renderStars(reviewOverall)}
                      </div>
                    </div>
                    
                    <p className="text-on-surface-variant font-body leading-relaxed mb-6 text-base sm:text-lg whitespace-pre-wrap">
                      {review.text || <span className="italic opacity-60">"No detailed text provided, only scored metrics."</span>}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {review.is_verified_tenant && (
                        <span className="bg-tertiary-container/20 text-tertiary px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">verified</span> Verified Tenancy
                        </span>
                      )}
                      {reviewFlag && (
                        <span className="bg-error-container/20 text-error px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">warning</span> {reviewFlag.label}
                        </span>
                      )}
                      {review.red_flags.length > 1 && (
                        <span className="bg-surface-container text-on-surface px-3 py-1.5 rounded-xl text-xs font-bold">
                          +{review.red_flags.length - 1} more issues
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </>
          )}

        </section>
      </div>
    </div>
  );
}
