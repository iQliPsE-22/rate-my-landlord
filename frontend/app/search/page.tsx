"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Search, Loader2 } from "lucide-react";
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Search Landlords</h1>
      <p className="text-zinc-600 mb-8 font-medium">Find tenant reviews for any landlord in India.</p>

      {/* Search */}
      <div className="mb-10">
        <SearchBar defaultQuery={q} defaultCity={city} compact />
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      )}

      {!loading && searched && landlords.length === 0 && (
        <div className="text-center py-20 bg-white border border-zinc-200 rounded-3xl shadow-sm mt-8">
          <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No landlords found</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto font-medium">
            {q
              ? `No results for "${q}". Be the first to review this landlord.`
              : "Try searching by landlord name or city."}
          </p>
          {q && (
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
            >
              Review this landlord
            </Link>
          )}
        </div>
      )}

      {!loading && landlords.length > 0 && (
        <div>
          <p className="text-sm font-medium text-zinc-500 mb-4 px-2">
            {landlords.length} {landlords.length === 1 ? "result" : "results"}
            {q ? ` for "${q}"` : ""}
          </p>
          <div className="grid gap-4">
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
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
