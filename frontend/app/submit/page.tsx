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
      <h1 className="text-3xl font-bold text-white mb-2">Rate Your Landlord</h1>
      <p className="text-slate-400 mb-8">
        Anonymous. No account needed. Takes under 2 minutes.
      </p>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${i < step ? "bg-teal-500 text-slate-950" : ""}
                  ${i === step ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30" : ""}
                  ${i > step ? "bg-slate-800 text-slate-500 border border-slate-700" : ""}
                `}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:inline ${i <= step ? "text-white" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl">
        {/* Step 0: Landlord Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Landlord Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="e.g. Rakesh Sharma"
                className="w-full h-12 px-4 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 px-4 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pincode <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 110092"
                  maxLength={6}
                  className="w-full h-12 px-4 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tenancy Period <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={tenancyPeriod}
                  onChange={(e) => setTenancyPeriod(e.target.value)}
                  placeholder="e.g. 2022-2024"
                  className="w-full h-12 px-4 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Ratings */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-slate-400 text-sm mb-2">
              Rate your landlord on each of these. Be honest — it helps the next tenant.
            </p>
            {(Object.keys(ratings) as (keyof RatingAxes)[]).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/30"
              >
                <span className="text-white font-medium">{RATING_LABELS[key]}</span>
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
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-2">
              Select any red flags that apply. Skip if none.
            </p>
            <RedFlagTags selected={redFlags} onChange={setRedFlags} />
          </div>
        )}

        {/* Step 3: Text Review + Submit */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Review <span className="text-slate-500">(optional but encouraged)</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What should the next tenant know? Share your experience..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
              />
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Review Summary</h4>
              <div className="text-sm text-slate-400 space-y-1">
                <p>
                  <span className="text-slate-500">Landlord:</span>{" "}
                  <span className="text-white">{landlordName}</span>
                </p>
                <p>
                  <span className="text-slate-500">City:</span>{" "}
                  <span className="text-white">{city}</span>
                  {pincode && <span className="text-slate-500"> ({pincode})</span>}
                </p>
                <p>
                  <span className="text-slate-500">Overall:</span>{" "}
                  <span className="text-amber-400 font-semibold">
                    {(Object.values(ratings).reduce((a, b) => a + b, 0) / 4).toFixed(1)} / 5
                  </span>
                </p>
                {redFlags.length > 0 && (
                  <p>
                    <span className="text-slate-500">Red flags:</span>{" "}
                    <span className="text-red-400">{redFlags.length} selected</span>
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-40 disabled:hover:shadow-none"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-60"
          >
            {submitting ? (
              <>
                Submitting...
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
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
