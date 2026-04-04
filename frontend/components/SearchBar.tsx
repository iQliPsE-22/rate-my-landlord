"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  defaultQuery?: string;
  defaultCity?: string;
  compact?: boolean;
}

export default function SearchBar({ defaultQuery = "", defaultCity = "", compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [city, setCity] = useState(defaultCity);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`w-full ${compact ? "max-w-2xl" : "max-w-3xl"}`}>
      <div className={`
        flex flex-col sm:flex-row gap-3
        ${compact ? "" : "p-2 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/20"}
      `}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Landlord name..."
            className={`
              w-full pl-12 pr-4 bg-slate-900/80 text-white placeholder-slate-500
              border border-slate-700/50 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20
              outline-none transition-all duration-200
              ${compact ? "h-11 rounded-xl text-sm" : "h-14 rounded-xl text-base"}
            `}
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`
            bg-slate-900/80 text-white border border-slate-700/50
            focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20
            outline-none transition-all duration-200 cursor-pointer
            ${compact ? "h-11 rounded-xl text-sm px-3 sm:w-40" : "h-14 rounded-xl text-base px-4 sm:w-48"}
          `}
        >
          <option value="">All Cities</option>
          <option value="Delhi NCR">Delhi NCR</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Lucknow">Lucknow</option>
          <option value="Indore">Indore</option>
          <option value="Kochi">Kochi</option>
          <option value="Goa">Goa</option>
        </select>
        <button
          type="submit"
          className={`
            bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold
            rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25
            active:scale-[0.98]
            ${compact ? "h-11 px-6 text-sm" : "h-14 px-8 text-base"}
          `}
        >
          Search
        </button>
      </div>
    </form>
  );
}
