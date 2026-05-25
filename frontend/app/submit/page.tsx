"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, RED_FLAGS } from "@/types";
import type { RatingAxes, RedFlagId } from "@/types";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
            <span className="font-bold text-text-body">{label}</span>
            <div className="flex gap-1 text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => handleRatingChange(key, star)}
                        className={`material-symbols-outlined cursor-pointer hover:scale-110 transition-transform ${ratings[key] >= star ? 'star-filled' : 'opacity-40'}`}
                    >
                        star
                    </span>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="px-4 md:px-6 max-w-[800px] mx-auto pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Header Section */}
        <header className="mb-8 md:mb-12 text-center">
            <h1 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-text-heading tracking-tighter mb-3 md:mb-4">Share Your Experience</h1>
            <p className="text-text-body text-sm md:text-lg max-w-md mx-auto">Help the community by providing an honest, anonymous review of your recent tenancy.</p>
        </header>

        {/* Review Form Card */}
        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-xl md:rounded-2xl shadow-card overflow-hidden">
            <CardContent className="p-4 md:p-6 lg:p-10">
                <form className="space-y-10" onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-3 w-full">
                            <label className="block text-sm font-semibold font-headline text-text-body uppercase tracking-wider">Landlord or Agency Name *</label>
                            <Input
                                className="w-full h-14 px-4 bg-white/70 border-white/50 rounded-xl focus-visible:ring-accent/50 focus-visible:bg-white transition-all text-text-heading shadow-sm placeholder:text-slate-400 text-base"
                                placeholder="e.g. Skyline Properties Ltd."
                                type="text"
                                value={landlordName}
                                onChange={(e) => setLandlordName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-3 w-full">
                            <label className="block text-sm font-semibold font-headline text-text-body uppercase tracking-wider">City *</label>
                            <Select value={city} onValueChange={(val) => setCity(val || "")}>
                                <SelectTrigger className="w-full h-14 px-4 bg-white/70 border-white/50 rounded-xl focus:ring-accent/50 focus:bg-white transition-all text-text-heading shadow-sm text-base">
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/90 backdrop-blur-md border border-white/50 rounded-xl shadow-lg">
                                    {CITIES.map(c => (
                                        <SelectItem key={c} value={c} className="rounded-lg py-3 hover:bg-bg-subtle focus:bg-bg-subtle cursor-pointer">
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Ratings Grid */}
                    <div className="pt-4 border-t border-white/50">
                        <h3 className="font-headline font-bold text-lg md:text-xl mb-4 md:mb-6 text-text-heading">Performance Metrics *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-8 md:gap-x-12">
                            {renderStars("deposit_return", "Security Deposit Return")}
                            {renderStars("maintenance", "Maintenance Speed")}
                            {renderStars("behaviour", "Professionalism")}
                            {renderStars("rent_fairness", "Value for Money")}
                        </div>
                    </div>

                    {/* Red Flag Tags */}
                    <div className="pt-4 space-y-4">
                        <label className="block text-sm font-semibold font-headline text-text-body uppercase tracking-wider">Any Red Flags? (Select all that apply)</label>
                        <div className="flex flex-wrap gap-3">
                            {RED_FLAGS.map(flag => (
                                <Button
                                    key={flag.id}
                                    type="button"
                                    variant="ghost"
                                    className={`px-3 md:px-5 py-3 md:py-6 rounded-lg md:rounded-xl transition-all font-bold text-xs md:text-sm shadow-sm ${redFlags.includes(flag.id) ? 'bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 hover:text-rose-600' : 'bg-white/60 border border-white/50 text-text-body hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100'}`}
                                    onClick={() => toggleRedFlag(flag.id)}
                                >
                                    {flag.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Box */}
                    <div className="pt-4 space-y-3 border-t border-white/50 pt-8 mt-4">
                        <label className="block text-sm font-semibold font-headline text-text-body uppercase tracking-wider">Your Experience</label>
                        <Textarea
                            className="w-full p-4 bg-white/70 border-white/50 rounded-2xl focus-visible:ring-accent/50 focus-visible:bg-white transition-all text-text-heading shadow-sm placeholder:text-slate-400 resize-none min-h-[140px] text-base"
                            placeholder="Tell other renters what it's really like to live here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <p className="text-xs text-slate-400 font-medium">Keep it professional and factual. Avoid personal details.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 font-bold text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-6">
                        <Button
                            disabled={submitting}
                            type="submit"
                            className="w-full h-14 md:h-16 bg-accent text-white font-headline font-bold text-base md:text-lg rounded-xl md:rounded-2xl shadow-accent hover:shadow-accent-lg hover:bg-blue-400 transition-all flex items-center justify-center gap-2 group"
                        >
                            {submitting ? "Publishing..." : "Publish Review"}
                            {!submitting && <span className="text-xl rotate-0 group-hover:translate-x-1 transition-transform">→</span>}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        {/* Bottom Tip */}
        <div className="mt-8 flex items-center justify-center gap-2 text-text-muted">
            <span className="text-accent font-bold">✓</span>
            <span className="text-sm font-medium">Your review is encrypted and stays 100% anonymous.</span>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-1/4 -left-20 w-96 h-96 bg-bg-subtle rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-bg-surface rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}
