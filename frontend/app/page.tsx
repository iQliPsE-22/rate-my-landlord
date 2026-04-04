import Link from "next/link";
import { Shield, Search, Star, AlertTriangle, ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pt-32 sm:pb-32">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            100% Anonymous. No Login Required.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Know your landlord
            <br />
            <span className="text-gradient">before you sign</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
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
              className="group flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              Had a bad experience? Write a review
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-center text-2xl font-bold text-white mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: <Star className="w-7 h-7 text-amber-400" />,
              title: "Rate your landlord",
              desc: "Score them on deposit return, maintenance, behaviour, and rent fairness. Add red flag tags if they deserve it.",
            },
            {
              icon: <Search className="w-7 h-7 text-teal-400" />,
              title: "Search before you sign",
              desc: "Entering a new rental? Search the landlord's name and city. Read what past tenants experienced.",
            },
            {
              icon: <AlertTriangle className="w-7 h-7 text-red-400" />,
              title: "Protect the next tenant",
              desc: "Every review you leave makes the rental market a little more transparent for the next person.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-slate-700/30">
          <h2 className="text-2xl font-bold text-white mb-3">
            Had a landlord nightmare?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Your anonymous review could save someone from the same experience. It takes less than 2 minutes.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25"
          >
            Write a Review
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
