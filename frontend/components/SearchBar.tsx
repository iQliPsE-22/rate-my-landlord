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
        ${compact ? "" : "p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"}
      `}>
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Landlord name..."
            className={`
              w-full pl-12 pr-4 bg-white text-zinc-900 placeholder-zinc-400
              border border-zinc-200 focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/20
              outline-none transition-all duration-200 shadow-sm
              ${compact ? "h-11 rounded-xl text-sm" : "h-14 rounded-xl text-base"}
            `}
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`
            bg-white text-zinc-900 border border-zinc-200
            focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/20
            outline-none transition-all duration-200 cursor-pointer shadow-sm
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
            bg-violet-600 hover:bg-violet-700 text-white font-semibold
            rounded-xl transition-all duration-200 hover:shadow-[0_4px_12px_rgba(124,58,237,0.25)]
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
