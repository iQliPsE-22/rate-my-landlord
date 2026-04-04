"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import LandlordCard from "@/components/LandlordCard";
import Link from "next/link";
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
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: "var(--text)" }}>Registry</h1>
      <p className="text-lg font-medium mb-12" style={{ color: "var(--text-secondary)" }}>Search the database of landlord reviews across India.</p>

      {/* Search */}
      <div className="mb-12">
        <SearchBar defaultQuery={q} defaultCity={city} compact />
      </div>

      {/* Results */}
      {loading && (
        <div className="py-20 text-center font-bold" style={{ color: "var(--text-muted)" }}>
          Searching the database...
        </div>
      )}

      {!loading && searched && landlords.length === 0 && (
        <div className="p-12 border text-center" style={{ borderColor: "var(--border)", background: "var(--card)", borderRadius: "4px" }}>
          <div className="text-4xl font-black accent-number mb-6" style={{ opacity: 0.2 }}>0</div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>No records found</h3>
          <p className="font-medium mb-10 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            {q
              ? `We don't have any reviews for "${q}" yet. Silence protects bad landlords.`
              : "Try searching by landlord name or city."}
          </p>
          {q && (
            <Link
              href="/submit"
              className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-sm transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--text)", color: "var(--card)" }}
            >
              Add the first review
            </Link>
          )}
        </div>
      )}

      {!loading && landlords.length > 0 && (
        <div>
          <div className="flex items-end justify-between border-b pb-4 mb-8" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Results</h2>
            <p className="text-sm font-bold uppercase tracking-widest accent-number">
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
        <div className="py-32 text-center font-bold" style={{ color: "var(--text-muted)" }}>
          Loading...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
