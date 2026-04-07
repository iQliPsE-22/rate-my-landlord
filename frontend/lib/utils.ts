import { clsx, type ClassValue } from "clsx"
import type { RatingAxes } from "@/types"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, '')}-${Math.random().toString(36).substring(2, 6)}`;
}

export function calculateAggregateScore(ratings: RatingAxes): number {
  const values = Object.values(ratings);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function getScoreColor(score: number): string {
  if (score === 0) return "text-[var(--text-muted)]";
  if (score >= 4) return "text-green-600";
  if (score >= 2.5) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBg(score: number): string {
  if (score === 0) return "bg-gray-100";
  if (score >= 4) return "bg-green-100";
  if (score >= 2.5) return "bg-yellow-100";
  return "bg-red-100";
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
