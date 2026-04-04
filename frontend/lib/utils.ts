import type { RatingAxes, AggregateScore } from "@/types";

export function generateSlug(name: string, city: string, pincode?: string): string {
  const parts = [name, city, pincode].filter(Boolean);
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateOverallScore(ratings: RatingAxes): number {
  const values = Object.values(ratings);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

export function calculateAggregateScore(reviews: { ratings: RatingAxes }[]): AggregateScore {
  if (reviews.length === 0) {
    return { overall: 0, deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 };
  }

  const totals = { deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 };

  for (const review of reviews) {
    totals.deposit_return += review.ratings.deposit_return;
    totals.maintenance += review.ratings.maintenance;
    totals.behaviour += review.ratings.behaviour;
    totals.rent_fairness += review.ratings.rent_fairness;
  }

  const count = reviews.length;
  const axes: RatingAxes = {
    deposit_return: Math.round((totals.deposit_return / count) * 10) / 10,
    maintenance: Math.round((totals.maintenance / count) * 10) / 10,
    behaviour: Math.round((totals.behaviour / count) * 10) / 10,
    rent_fairness: Math.round((totals.rent_fairness / count) * 10) / 10,
  };

  return {
    ...axes,
    overall: calculateOverallScore(axes),
  };
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getScoreColor(score: number): string {
  if (score >= 4) return "text-emerald-600";
  if (score >= 3) return "text-amber-500";
  if (score >= 2) return "text-orange-500";
  return "text-rose-600";
}

export function getScoreBg(score: number): string {
  if (score >= 4) return "bg-emerald-50 border-emerald-100";
  if (score >= 3) return "bg-amber-50 border-amber-100";
  if (score >= 2) return "bg-orange-50 border-orange-100";
  return "bg-rose-50 border-rose-100";
}
