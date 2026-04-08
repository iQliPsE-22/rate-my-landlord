"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import LandlordCard from "@/components/LandlordCard";
import Link from "next/link";
import { SearchX, FilePlus } from "lucide-react";
import type { ILandlord } from "@/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const [landlords, setLandlords] = useState<ILandlord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!q && !city) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (city) params.set("city", city);
        const res = await fetch(`/api/landlords?${params.toString()}`);
        const data = await res.json();
        setLandlords(data.landlords || []);
      } catch {
        setLandlords([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    };

    fetchResults();
  }, [q, city]);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-16 sm:pb-24 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-[#2d3748]">Registry</h1>
        <p className="text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed text-[#4a5568]">
          Search the database of landlord reviews across India by name, phone, address, or city.
        </p>
      </div>

      {/* Search */}
      <div className="mb-16">
        <SearchBar defaultQuery={q} defaultCity={city} compact />
      </div>

      {/* Results */}
      {loading && (
        <div className="space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-white/50 rounded-[2rem] bg-white/60 animate-pulse flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="h-8 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
              </div>
              <div className="h-20 w-32 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && landlords.length === 0 && (
        <div className="py-20 px-8 border border-white/50 text-center bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(31,56,100,0.06)]">
          <div className="flex justify-center mb-6">
             <SearchX className="w-16 h-16 text-[#abc4ff] opacity-50" />
          </div>
          <h3 className="text-3xl font-bold mb-4 text-[#2d3748]">No records found</h3>
          <p className="text-lg font-medium mb-12 max-w-md mx-auto leading-relaxed text-[#4a5568]">
            {q
              ? `We don't have any reviews for "${q}" yet. Silence protects bad landlords.`
              : "Try searching by landlord name, address, or city."}
          </p>
          {q && (
            <Link
              href={`/submit?q=${encodeURIComponent(q)}`}
              className="inline-flex items-center gap-3 justify-center font-bold px-8 py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-[0_4px_12px_rgba(171,196,255,0.4)] bg-[#abc4ff] text-white hover:bg-[#b6ccfe]"
            >
              <FilePlus className="w-5 h-5" /> Be the first to add a review
            </Link>
          )}
        </div>
      )}

      {!loading && landlords.length > 0 && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="flex items-end justify-between border-b pb-6 mb-8 border-slate-200">
            <h2 className="text-2xl font-bold text-[#2d3748]">Results</h2>
            <p className="text-sm font-bold uppercase tracking-widest py-1 px-3 bg-[#edf2fb] rounded-full text-[#abc4ff]">
              {landlords.length} {landlords.length === 1 ? "Match" : "Matches"}
            </p>
          </div>
          <div className="grid gap-6">
            {landlords.map((landlord) => (
              <LandlordCard key={landlord._id} landlord={landlord} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center">
          <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--text)] rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
