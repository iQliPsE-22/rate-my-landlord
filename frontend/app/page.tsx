import Link from "next/link";
import { Shield, Search, Star, AlertTriangle, ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-sm font-semibold mb-8 shadow-sm">
            <Shield className="w-4 h-4" />
            100% Anonymous. No Login Required.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
            Know your landlord
            <br />
            <span className="text-gradient">before you sign</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Search tenant reviews for any landlord in India. Or share your own experience to protect the next tenant.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex justify-center">
            <SearchBar />
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/submit"
              className="group flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
            >
              Had a bad experience? Write a review
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-center text-3xl font-extrabold text-zinc-900 mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: <Star className="w-7 h-7 text-amber-500" />,
              title: "Rate your landlord",
              desc: "Score them on deposit return, maintenance, behaviour, and rent fairness. Add red flag tags if they deserve it.",
            },
            {
              icon: <Search className="w-7 h-7 text-violet-500" />,
              title: "Search before you sign",
              desc: "Entering a new rental? Search the landlord's name and city. Read what past tenants experienced.",
            },
            {
              icon: <AlertTriangle className="w-7 h-7 text-rose-500" />,
              title: "Protect the next tenant",
              desc: "Every review you leave makes the rental market a little more transparent for the next person.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white border border-zinc-200 hover:border-violet-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
              <p className="text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center p-12 rounded-3xl bg-white border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 p-32 bg-violet-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">
              Had a landlord nightmare?
            </h2>
            <p className="text-zinc-600 mb-8 max-w-lg mx-auto font-medium text-lg">
              Your anonymous review could save someone from the same experience. It takes less than 2 minutes.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_8px_20px_rgba(24,24,27,0.2)]"
            >
              Write a Review
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
