// Replace utility functions completely
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RatingAxes, AggregateScore, IReview } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | Date): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Editorial Light Mode Score Colors
 * We rely heavily on our terracotta accent and editorial black for emphasis, 
 * keeping dangerous states raw red, and safe states deep green.
 */
export function getScoreColor(score: number): string {
  if (score === 0) return "text-stone-400"; // unrated
  if (score >= 4) return "text-green-700"; // Excellent -> Deep green
  if (score >= 3) return "text-orange-600"; // OK -> Warm Orange
  if (score >= 2) return "text-red-600";    // Bad -> Red
  return "text-red-700";                    // Terrible -> Deep Red
}

/**
 * Background variants for scores using strict editorial hexes
 */
export function getScoreBg(score: number): string {
  if (score === 0) return "bg-stone-50 border-stone-200 border";
  if (score >= 4) return "bg-[#F0FDF4] border-[#BBF7D0] border"; // green-50, green-200
  if (score >= 3) return "bg-[#FFF7ED] border-[#FFEDD5] border"; // orange-50, orange-100
  if (score >= 2) return "bg-[#FEF2F2] border-[#FECACA] border"; // red-50, red-200
  return "bg-[#FEF2F2] border-[#FCA5A5] border";               // red-50, red-300
}

export function generateSlug(name: string, city: string, pincode?: string): string {
  const parts = [name, city];
  if (pincode) parts.push(pincode);
  const base = parts.join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base}-${Math.random().toString(36).substring(2, 6)}`;
}

export function calculateAggregateScore(reviews: IReview[]): AggregateScore {
  if (!reviews || reviews.length === 0) {
    return { overall: 0, deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 };
  }
  
  const axes = ["deposit_return", "maintenance", "behaviour", "rent_fairness"] as const;
  const totals = { deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 };
  
  for (const review of reviews) {
    for (const axis of axes) {
      if (review.ratings?.[axis]) {
        totals[axis] += review.ratings[axis];
      }
    }
  }

  const result: any = { overall: 0 };
  let overallSum = 0;
  for (const axis of axes) {
    const avg = totals[axis] / reviews.length;
    result[axis] = avg;
    overallSum += avg;
  }
  result.overall = overallSum / axes.length;
  
  return result as AggregateScore;
}
