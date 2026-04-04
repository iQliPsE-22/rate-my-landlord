"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import StarRating from "@/components/StarRating";
import RedFlagTags from "@/components/RedFlagTags";
import { CITIES, RATING_LABELS } from "@/types";
import type { RatingAxes, RedFlagId } from "@/types";

const STEPS = ["Landlord Info", "Ratings", "Red Flags", "Review & Submit"];

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [landlordName, setLandlordName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [tenancyPeriod, setTenancyPeriod] = useState("");
  const [ratings, setRatings] = useState<RatingAxes>({
    deposit_return: 0,
    maintenance: 0,
    behaviour: 0,
    rent_fairness: 0,
  });
  const [redFlags, setRedFlags] = useState<RedFlagId[]>([]);
  const [text, setText] = useState("");

  const canProceed = () => {
    if (step === 0) return landlordName.trim() && city;
    if (step === 1)
      return Object.values(ratings).every((v) => v > 0);
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlord_name: landlordName,
          city,
          pincode,
          tenancy_period: tenancyPeriod,
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

      // Redirect to landlord profile
      router.push(`/landlord/${data.slug}`);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Rate Your Landlord</h1>
      <p className="text-zinc-600 mb-8 font-medium">
        Anonymous. No account needed. Takes under 2 minutes.
      </p>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${i < step ? "bg-violet-600 text-white" : ""}
                  ${i === step ? "bg-violet-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]" : ""}
                  ${i > step ? "bg-zinc-100 text-zinc-400 border border-zinc-200" : ""}
                `}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:inline font-semibold ${i <= step ? "text-zinc-900" : "text-zinc-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8 bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
        {/* Step 0: Landlord Info */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">
                Landlord Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="e.g. Rakesh Sharma"
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-[3px] focus:ring-violet-500/20 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">
                City <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 outline-none focus:border-violet-500 focus:bg-white focus:ring-[3px] focus:ring-violet-500/20 transition-all cursor-pointer shadow-sm"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">
                  Pincode <span className="text-zinc-400 font-medium">(optional)</span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 110092"
                  maxLength={6}
                  className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-[3px] focus:ring-violet-500/20 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">
                  Tenancy Period <span className="text-zinc-400 font-medium">(optional)</span>
                </label>
                <input
                  type="text"
                  value={tenancyPeriod}
                  onChange={(e) => setTenancyPeriod(e.target.value)}
                  placeholder="e.g. 2022-2024"
                  className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-[3px] focus:ring-violet-500/20 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Ratings */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-zinc-600 text-sm mb-4 font-medium">
              Rate your landlord on each of these. Be honest — it helps the next tenant.
            </p>
            {(Object.keys(ratings) as (keyof RatingAxes)[]).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 border border-zinc-200"
              >
                <span className="text-zinc-900 font-bold">{RATING_LABELS[key]}</span>
                <StarRating
                  value={ratings[key]}
                  onChange={(val) => setRatings({ ...ratings, [key]: val })}
                  size="lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Red Flags */}
        {step === 2 && (
          <div className="space-y-5">
            <p className="text-zinc-600 text-sm mb-2 font-medium">
              Select any red flags that apply. Skip if none.
            </p>
            <RedFlagTags selected={redFlags} onChange={setRedFlags} />
          </div>
        )}

        {/* Step 3: Text Review + Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">
                Your Review <span className="text-zinc-400 font-medium">(optional but encouraged)</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What should the next tenant know? Share your experience..."
                rows={5}
                className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-[3px] focus:ring-violet-500/20 transition-all resize-none shadow-sm"
              />
            </div>

            {/* Summary */}
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <h4 className="text-sm font-extrabold text-zinc-900 uppercase tracking-widest">Review Summary</h4>
              <div className="text-sm text-zinc-600 space-y-2 font-medium">
                <p>
                  <span className="text-zinc-500">Landlord:</span>{" "}
                  <span className="text-zinc-900 font-bold">{landlordName}</span>
                </p>
                <p>
                  <span className="text-zinc-500">City:</span>{" "}
                  <span className="text-zinc-900 font-bold">{city}</span>
                  {pincode && <span className="text-zinc-500 font-normal"> ({pincode})</span>}
                </p>
                <p>
                  <span className="text-zinc-500">Overall:</span>{" "}
                  <span className="text-amber-500 font-black">
                    {(Object.values(ratings).reduce((a, b) => a + b, 0) / 4).toFixed(1)} / 5
                  </span>
                </p>
                {redFlags.length > 0 && (
                  <p>
                    <span className="text-zinc-500">Red flags:</span>{" "}
                    <span className="text-rose-600 font-bold">{redFlags.length} selected</span>
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="text-rose-500 text-sm font-bold">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(124,58,237,0.25)] disabled:opacity-40 disabled:hover:shadow-none"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-black text-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(24,24,27,0.25)] disabled:opacity-60"
          >
            {submitting ? (
              <>
                Submitting...
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </>
            ) : (
              <>
                Submit Review
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
