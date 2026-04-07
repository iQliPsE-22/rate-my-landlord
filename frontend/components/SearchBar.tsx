"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/types";

interface SearchBarProps {
  defaultQuery?: string;
  defaultCity?: string;
  compact?: boolean;
}

export default function SearchBar({ defaultQuery = "", defaultCity = "", compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [city, setCity] = useState(defaultCity || "all");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (city && city !== "all") params.set("city", city);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`
        flex flex-col sm:flex-row gap-3 sm:gap-0
        ${compact ? "" : "p-1.5 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-sm"}
      `}>
        
        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search landlord by name..."
            className={`w-full font-medium ${compact ? "h-12" : "border-0 shadow-none focus-visible:ring-0 h-[56px] text-base bg-transparent px-4"}`}
          />
        </div>
        
        <div className={`sm:w-48 ${!compact && "border-t sm:border-t-0 sm:border-l border-[var(--border)]"}`}>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className={`w-full font-medium cursor-pointer ${compact ? "h-12" : "border-0 shadow-none focus:ring-0 h-[56px] text-base bg-transparent px-4"}`}>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className={`font-bold transition-opacity hover:opacity-90 ${compact ? "w-full sm:w-auto h-12" : "w-full sm:w-auto h-[56px] px-8 text-base bg-[var(--text)] text-[var(--card)] rounded-md ml-0 sm:ml-2"}`}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
