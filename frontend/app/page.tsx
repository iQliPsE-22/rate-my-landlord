import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero — Left Aligned, Editorial Style */}
      <section className="px-6 pt-24 pb-32 max-w-5xl mx-auto w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border" style={{ borderColor: "var(--border)", background: "var(--card)", borderRadius: "2px" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }}></span>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
              100% Anonymous Reviews
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8" style={{ color: "var(--text)" }}>
            Trust takes years.<br />
            Reviews take <span style={{ color: "var(--accent)" }}>minutes.</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium leading-relaxed mb-12 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Don't sign a lease blindly. Search verified tenant experiences across India to uncover hidden red flags before you move in.
          </p>

          <div className="mb-10 w-full max-w-xl">
            <SearchBar />
          </div>

          <p className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
            Had a nightmare landlord?
            <Link href="/submit" className="font-bold underline underline-offset-4 decoration-2" style={{ color: "var(--accent)", textDecorationColor: "var(--accent-surface)" }}>
              Warn the next tenant.
            </Link>
          </p>
        </div>
      </section>

      {/* How It Works — Numbered Editorial Steps */}
      <section className="py-24 border-t" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              The transparency standard.
            </h2>
            <Link href="/search?q=" className="text-sm font-bold flex items-center gap-1 group" style={{ color: "var(--accent)" }}>
              Browse all landlords
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-x-12 gap-y-16">
            <div>
              <div className="text-6xl font-black mb-6 accent-number">01</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Search Your Next Home</h3>
              <p className="font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Enter a landlord's name and city. Read unfiltered experiences about deposit retention, maintenance, and behavior.
              </p>
            </div>
            <div>
              <div className="text-6xl font-black mb-6 accent-number">02</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Spot The Red Flags</h3>
              <p className="font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Look for recurring patterns. Our red flag system highlights severe issues like harassment or illegal lockouts instantly.
              </p>
            </div>
            <div>
              <div className="text-6xl font-black mb-6 accent-number">03</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Protect The Community</h3>
              <p className="font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Moved out? Leave an anonymous review. It takes 2 minutes and could save someone from a year-long financial trap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA — Heavy, Confident */}
      <section className="py-32" style={{ background: "var(--text)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Silence protects bad landlords.
          </h2>
          <p className="text-xl font-medium mb-12" style={{ color: "var(--text-muted)" }}>
            Contribute to the largest database of rental experiences in India. Your identity is never exposed.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-none transition-transform hover:-translate-y-1"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Submit an Anonymous Review
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
