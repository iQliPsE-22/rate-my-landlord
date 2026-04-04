"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSearch} className="w-full">
      <div className={`
        flex flex-col sm:flex-row gap-0 sm:gap-4
        ${compact ? "" : "p-1.5 border"}
      `}
      style={!compact ? { background: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" } : {}}>
        
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search landlord by name..."
            className={`w-full outline-none font-medium ${compact ? "border px-4" : "px-4"}`}
            style={{ 
              background: "transparent", 
              color: "var(--text)", 
              height: compact ? "48px" : "56px",
              ...(compact ? { borderColor: "var(--border)", borderRadius: "4px" } : {})
            }}
          />
        </div>
        
        <div className={`sm:w-48 ${!compact && "border-l"}`} style={{ borderColor: "var(--border)" }}>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full outline-none font-medium cursor-pointer ${compact ? "border px-3 mt-3 sm:mt-0" : "px-4"}`}
            style={{ 
              background: "transparent", 
              color: "var(--text)",
              height: compact ? "48px" : "56px",
              ...(compact ? { borderColor: "var(--border)", borderRadius: "4px" } : {})
            }}
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
        </div>

        <button
          type="submit"
          className={`font-bold transition-opacity hover:opacity-90 ${compact && "mt-3 sm:mt-0"}`}
          style={{ 
            background: "var(--text)", 
            color: "var(--card)",
            height: compact ? "48px" : "56px",
            padding: "0 32px",
            borderRadius: compact ? "4px" : "4px"
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
