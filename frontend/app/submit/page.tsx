"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/types";
import type { RatingAxes, RedFlagId } from "@/types";

const RED_FLAGS: { id: RedFlagId; label: string }[] = [
  { id: "unannounced_visits", label: "Unannounced Visits" },
  { id: "deposit_withheld", label: "Deposit Disputes" },
  { id: "refused_repairs", label: "Late Repairs" },
  { id: "harassment", label: "Harassment" },
  { id: "fake_deductions", label: "Fake Deductions" },
];

export default function SubmitPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [landlordName, setLandlordName] = useState("");
  const [city, setCity] = useState("");
  const [ratings, setRatings] = useState<RatingAxes>({
    deposit_return: 0,
    maintenance: 0,
    behaviour: 0,
    rent_fairness: 0,
  });
  const [redFlags, setRedFlags] = useState<RedFlagId[]>([]);
  const [text, setText] = useState("");

  const handleRatingChange = (key: keyof RatingAxes, val: number) => {
    setRatings(prev => ({ ...prev, [key]: val }));
  };

  const toggleRedFlag = (id: RedFlagId) => {
    setRedFlags(prev => prev.includes(id) ? prev.filter((flag) => flag !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landlordName || !city || Object.values(ratings).some(r => r === 0)) {
        setError("Please fill out landlord name, city, and provide all 4 ratings.");
        return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlord_name: landlordName,
          city,
          pincode: "",
          tenancy_period: "",
          ratings,
          red_flags: redFlags,
          text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/landlord/${data.slug}`);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (key: keyof RatingAxes, label: string) => {
    return (
        <div className="flex items-center justify-between">
            <span className="font-medium text-on-surface">{label}</span>
            <div className="flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        onClick={() => handleRatingChange(key, star)}
                        className={`material-symbols-outlined cursor-pointer hover:scale-110 transition-transform ${ratings[key] >= star ? 'star-filled' : ''}`}
                    >
                        star
                    </span>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="px-6 max-w-[800px] mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center">
            <h1 className="font-headline font-bold text-5xl text-on-surface tracking-tighter mb-4">Share Your Experience</h1>
            <p className="text-on-surface-variant text-lg max-w-md mx-auto">Help the community by providing an honest, anonymous review of your recent tenancy.</p>
        </header>

        {/* Review Form Card */}
        <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-10 shadow-[0px_24px_48px_-12px_rgba(19,27,46,0.08)]">
            <form className="space-y-10" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold font-headline text-on-surface-variant uppercase tracking-wider">Landlord or Agency Name *</label>
                        <input 
                            className="w-full h-14 px-4 bg-surface-container-low outline-none rounded-lg focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/50" 
                            placeholder="e.g. Skyline Properties Ltd." 
                            type="text" 
                            value={landlordName}
                            onChange={(e) => setLandlordName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold font-headline text-on-surface-variant uppercase tracking-wider">City *</label>
                        <select 
                            className="w-full h-14 px-4 bg-surface-container-low outline-none rounded-lg focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="">Select a city</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Ratings Grid */}
                <div className="pt-4 border-t border-outline-variant/20">
                    <h3 className="font-headline font-bold text-xl mb-6">Performance Metrics *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        {renderStars("deposit_return", "Security Deposit Return")}
                        {renderStars("maintenance", "Maintenance Speed")}
                        {renderStars("behaviour", "Professionalism")}
                        {renderStars("rent_fairness", "Value for Money")}
                    </div>
                </div>

                {/* Red Flag Tags */}
                <div className="pt-4 space-y-4">
                    <label className="block text-sm font-semibold font-headline text-on-surface-variant uppercase tracking-wider">Any Red Flags? (Select all that apply)</label>
                    <div className="flex flex-wrap gap-3">
                        {RED_FLAGS.map(flag => (
                            <button 
                                key={flag.id}
                                className={`px-5 py-2 rounded-full border transition-all font-medium text-sm ${redFlags.includes(flag.id) ? 'bg-error-container text-on-error-container border-transparent' : 'border-outline-variant/30 text-on-surface-variant hover:bg-error-container hover:text-on-error-container hover:border-transparent'}`} 
                                type="button"
                                onClick={() => toggleRedFlag(flag.id)}
                            >
                                {flag.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment Box */}
                <div className="pt-4 space-y-2">
                    <label className="block text-sm font-semibold font-headline text-on-surface-variant uppercase tracking-wider">Your Experience</label>
                    <textarea 
                        className="w-full p-4 bg-surface-container-low outline-none rounded-lg focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/50 resize-none" 
                        placeholder="Tell other renters what it's really like to live here..." 
                        rows={5}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-outline italic">Keep it professional and factual. Avoid personal details.</p>
                </div>

                {error && (
                    <div className="p-4 bg-error-container border border-error text-on-error-container font-bold text-sm rounded">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                    <button 
                        disabled={submitting}
                        className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 group" 
                        type="submit"
                    >
                        {submitting ? "Publishing..." : "Publish Review"}
                        {!submitting && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                </div>
            </form>
        </section>

        {/* Bottom Tip */}
        <div className="mt-8 flex items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-tertiary">verified_user</span>
            <span className="text-sm">Your review is encrypted and stays 100% anonymous.</span>
        </div>

        {/* Decorative Elements */}
        {/* We add fixed elements via globals style or simply inline divs that won't disrupt scroll */}
        <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}
