"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import StarRating from "@/components/StarRating";
import RedFlagTags from "@/components/RedFlagTags";
import { CITIES, RATING_LABELS } from "@/types";
import type { RatingAxes, RedFlagId } from "@/types";

const STEPS = ["Property Details", "Assessments", "Violations", "Verification"];

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
    if (step === 1) return Object.values(ratings).every((v) => v > 0);
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

      router.push(`/landlord/${data.slug}`);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 sm:py-20">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: "var(--text)" }}>Submit Report</h1>
        <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
          Your identity is protected. Your experience becomes public record.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-12 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-bold uppercase tracking-widest accent-number mb-2">Step 0{step + 1} / 0{STEPS.length}</p>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{STEPS[step]}</h2>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {/* Step 0: Landlord Info */}
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
                Landlord Full Name <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="e.g. Rakesh Sharma"
                className="w-full px-4 border font-medium outline-none transition-colors"
                style={{ height: "56px", background: "var(--card)", borderColor: "var(--border)", color: "var(--text)", borderRadius: "4px" }}
                onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
                City <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 border font-medium outline-none transition-colors cursor-pointer"
                style={{ height: "56px", background: "var(--card)", borderColor: "var(--border)", color: "var(--text)", borderRadius: "4px" }}
                onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
                  Pincode <span style={{ opacity: 0.5 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 110092"
                  maxLength={6}
                  className="w-full px-4 border font-medium outline-none transition-colors"
                  style={{ height: "56px", background: "var(--card)", borderColor: "var(--border)", color: "var(--text)", borderRadius: "4px" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
                  Tenancy Period <span style={{ opacity: 0.5 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={tenancyPeriod}
                  onChange={(e) => setTenancyPeriod(e.target.value)}
                  placeholder="e.g. 2022-2024"
                  className="w-full px-4 border font-medium outline-none transition-colors"
                  style={{ height: "56px", background: "var(--card)", borderColor: "var(--border)", color: "var(--text)", borderRadius: "4px" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Ratings */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="font-medium mb-8" style={{ color: "var(--text-secondary)" }}>
              Rate the landlord strictly on facts. A rating of 1 implies extreme negligence.
            </p>
            {(Object.keys(ratings) as (keyof RatingAxes)[]).map((key) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border bg-white" style={{ borderColor: "var(--border)", borderRadius: "4px" }}>
                <span className="font-bold mb-4 sm:mb-0" style={{ color: "var(--text)" }}>{RATING_LABELS[key]}</span>
                <StarRating value={ratings[key]} onChange={(val) => setRatings({ ...ratings, [key]: val })} size="lg" />
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Red Flags */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="font-medium mb-8" style={{ color: "var(--text-secondary)" }}>
              Select all major violations committed by this landlord. These are serious allegations.
            </p>
            <RedFlagTags selected={redFlags} onChange={setRedFlags} />
          </div>
        )}

        {/* Step 3: Text Review + Submit */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
                Written Testimony <span style={{ opacity: 0.5 }}>(highly recommended)</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Detail your experience objectively. Stick to the facts."
                rows={6}
                className="w-full p-4 border font-medium outline-none transition-colors resize-none"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)", borderRadius: "4px", lineHeight: "1.6" }}
                onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div className="p-6 border bg-white" style={{ borderColor: "var(--border)", borderRadius: "4px" }}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>Submission Record</h4>
              <div className="text-sm font-medium space-y-3" style={{ color: "var(--text-secondary)" }}>
                <div className="flex justify-between">
                  <span>Subject:</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{landlordName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{city} {pincode && `(${pincode})`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aggregate Score:</span>
                  <span className="font-black accent-number">{(Object.values(ratings).reduce((a, b) => a + b, 0) / 4).toFixed(1)} / 5.0</span>
                </div>
                {redFlags.length > 0 && (
                  <div className="flex justify-between">
                    <span>Violations logged:</span>
                    <span className="font-bold" style={{ color: "var(--danger)" }}>{redFlags.length} flags</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-bold text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-12 gap-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 font-bold transition-opacity disabled:opacity-0"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 font-bold transition-all disabled:opacity-50"
            style={{ background: "var(--text)", color: "var(--card)", borderRadius: "4px" }}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 font-bold transition-all disabled:opacity-50"
            style={{ background: "var(--accent)", color: "white", borderRadius: "4px" }}
          >
            {submitting ? "Processing..." : "Publish Report"}
            {!submitting && <Send className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
