// Replace utility functions completely
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
