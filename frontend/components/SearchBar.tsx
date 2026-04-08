"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { CITIES, ILandlord } from "@/types";
import { Search, MapPin, Phone, Hash } from "lucide-react";

interface SearchBarProps {
  defaultQuery?: string;
  defaultCity?: string;
  compact?: boolean;
}

export default function SearchBar({
  defaultQuery = "",
  defaultCity = "",
  compact = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [city, setCity] = useState(defaultCity || "all");
  const [suggestions, setSuggestions] = useState<Partial<ILandlord>[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/landlords/autocomplete?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setSuggestions(data.landlords || []);
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);

    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (city && city !== "all") params.set("city", city);
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (slug: string) => {
    setShowSuggestions(false);
    router.push(`/landlord/${slug}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSearch} className="w-full">
        <div
          className={`
          flex flex-col sm:flex-row gap-3 sm:gap-0
          ${compact ? "" : "p-1.5 bg-white/70 backdrop-blur-xl border border-white/50 rounded-xl shadow-[0_8px_32px_rgba(31,56,100,0.06)] transition-shadow focus-within:shadow-[0_12px_40px_rgba(171,196,255,0.4)]"}
        `}
        >
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 opacity-40 z-10" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (query.length >= 2) setShowSuggestions(true);
              }}
              placeholder="Search by name, phone, address or pincode..."
              className={`w-full font-medium pl-12 pr-4 ${compact ? "h-12 border border-[#d7e3fc] bg-white/60 focus:bg-white rounded-md" : "border-0 shadow-none focus-visible:ring-0 h-[56px] text-base bg-transparent text-[#2d3748]"}`}
            />
          </div>

          <div
            className={`sm:w-48 ${!compact && "border-t sm:border-t-0 sm:border-l border-[#d7e3fc]/50"}`}
          >
            <Select value={city} onValueChange={(val) => setCity(val || "all")}>
              <SelectTrigger
                className={`w-full font-medium cursor-pointer ${compact ? "h-12 border border-[#d7e3fc] bg-white/60 focus:bg-white rounded-md text-[#4a5568]" : "border-0 shadow-none focus:ring-0 h-[56px] text-base bg-transparent px-4 text-[#4a5568]"}`}
              >
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className={`font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${compact ? "w-full sm:w-auto h-12 bg-[#abc4ff] text-white hover:bg-[#b6ccfe]" : "w-full sm:w-auto h-[56px] px-8 text-base bg-[#abc4ff] text-white hover:bg-[#b6ccfe] rounded-lg ml-0 sm:ml-2"}`}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showSuggestions && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/80 backdrop-blur-3xl border border-white/60 rounded-xl shadow-[0_12px_40px_rgba(31,56,100,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <Command className="bg-transparent" shouldFilter={false}>
            <CommandList className="max-h-[350px]">
              {isSearching && suggestions.length === 0 ? (
                <CommandEmpty className="p-4 text-center text-sm font-medium text-[#718096]">
                  Searching...
                </CommandEmpty>
              ) : suggestions.length > 0 ? (
                <CommandGroup>
                  {suggestions.map((landlord, i) => (
                    <CommandItem
                      key={i}
                      onSelect={() => handleSuggestionClick(landlord.slug!)}
                      className="w-full text-left px-5 py-3 hover:bg-white transition-colors flex flex-col gap-1 border-b border-[#e2eafc]/50 last:border-0 cursor-pointer data-[selected=true]:bg-[#edf2fb]"
                    >
                      <div className="font-bold text-[#2d3748] text-base">
                        {landlord.name}
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-[#718096]">
                        <span className="flex items-center gap-1.5 bg-white/50 px-2 py-0.5 rounded border border-[#d7e3fc]/30">
                          <MapPin className="w-3.5 h-3.5 text-[#abc4ff]" /> {landlord.city}
                        </span>
                        {landlord.phone_number && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-[#abc4ff]" /> {landlord.phone_number}
                          </span>
                        )}
                        {landlord.address && (
                          <span className="flex items-center gap-1.5">
                            <Hash className="w-3 h-3 text-[#abc4ff]" />{" "}
                            {landlord.address.substring(0, 30)}
                            {landlord.address.length > 30 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="p-5 text-center flex flex-col gap-2 bg-transparent">
                  <span className="text-sm font-bold text-[#4a5568]">
                    No matched landlords found.
                  </span>
                  <Button
                    onClick={handleSearch}
                    variant="link"
                    className="font-bold h-auto p-0 text-[#abc4ff] hover:text-[#b6ccfe]"
                  >
                    Search instead to add a new review &rarr;
                  </Button>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
