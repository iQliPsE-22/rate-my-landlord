import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 4) return "text-green-600";
  if (score >= 3) return "text-yellow-600";
  if (score >= 2) return "text-orange-600";
  if (score >= 1) return "text-red-600";
  return "text-gray-400";
}

export function formatDate(dateInput: string | Date): string {
  return new Date(dateInput).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function generateSlug(name: string, city: string, pincode?: string): string {
  const base = `${name} ${city} ${pincode || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  return `${base}-${Math.floor(Math.random() * 1000)}`;
}

export function calculateAggregateScore(reviews: any[]) {
  if (!reviews || reviews.length === 0) {
    return { overall: 0, deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 };
  }
  const totals = { deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 };
  for (const r of reviews) {
    totals.deposit_return += r.ratings.deposit_return;
    totals.maintenance += r.ratings.maintenance;
    totals.behaviour += r.ratings.behaviour;
    totals.rent_fairness += r.ratings.rent_fairness;
  }
  const count = reviews.length;
  const avg = {
    deposit_return: totals.deposit_return / count,
    maintenance: totals.maintenance / count,
    behaviour: totals.behaviour / count,
    rent_fairness: totals.rent_fairness / count,
  };
  const overall = (avg.deposit_return + avg.maintenance + avg.behaviour + avg.rent_fairness) / 4;
  return { ...avg, overall };
}
