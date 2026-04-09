"use client";

import Link from "next/link";
import { ArrowRight, Radar, Siren, Ghost, Building2, MapPin, Shield, Star, AlertTriangle } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Simulated real review snippets for social proof
const recentReviews = [
  { text: "Withheld ₹45,000 deposit for 3 months after move-out. No receipts.", city: "Bengaluru", rating: 1.2 },
  { text: "Fixed the plumbing same day I reported it. Fair rent increases.", city: "Pune", rating: 4.3 },
  { text: "Entered flat without notice 4 times. Ignored written complaints.", city: "Mumbai", rating: 1.0 },
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col relative overflow-hidden" ref={containerRef}>
      
      {/* Background Orbs */}
      <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full glow-orb-1 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full glow-orb-2 blur-3xl mix-blend-multiply"></div>
      </motion.div>

      {/* ─── HERO: Search-first, no fluff ─── */}
      <section className="relative z-10 px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 max-w-5xl mx-auto w-full">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="w-full"
        >
          {/* Minimal context line */}
          <motion.p variants={fadeIn} className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#abc4ff] mb-4 sm:mb-6">
            Anonymous · Free · India-wide
          </motion.p>

          {/* Direct headline — not a slogan, a utility statement */}
          <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 text-[#2d3748] max-w-3xl">
            Check your landlord
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            before you sign.
          </motion.h1>

          <motion.p variants={fadeIn} className="text-base sm:text-lg md:text-xl text-[#4a5568] mb-8 sm:mb-10 max-w-xl leading-relaxed">
            Search by name, phone number, or address. Read what past tenants actually experienced.
          </motion.p>

          {/* Search bar — THE hero element */}
          <motion.div variants={fadeIn} className="mb-8 sm:mb-12 w-full max-w-2xl">
            <SearchBar />
          </motion.div>

          {/* Real numbers, not marketing fluff */}
          <motion.div variants={fadeIn} className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-3 text-sm text-[#718096]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#abc4ff]" />
              <span><strong className="text-[#2d3748]">100%</strong> anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#abc4ff]" />
              <span><strong className="text-[#2d3748]">12</strong> cities covered</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#abc4ff]" />
              <span><strong className="text-[#2d3748]">6</strong> red flag categories</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── LIVE FEED: Recent reviews ticker ─── */}
      <section className="relative z-10 py-6 sm:py-8 border-y border-[#d7e3fc]/40 bg-white/30 backdrop-blur-sm overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#abc4ff] mb-4 sm:mb-5">Recent from the community</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {recentReviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl p-4 text-sm group hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">{review.city}</span>
                  <span className={`text-xs font-black ${review.rating >= 3 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-[#4a5568] leading-snug line-clamp-2 text-[13px]">
                  &ldquo;{review.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Cities Marquee ─── */}
      <section className="relative z-10 py-6 sm:py-10 border-b border-[#d7e3fc]/30 bg-white/20 overflow-hidden">
        <div className="flex w-max marquee-group hover:[animation-play-state:paused]">
          {[1, 2, 3, 4, 5].map((set) => (
            <div key={set} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6">
              {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'].map((city, idx) => (
                <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl font-bold text-[#7b9ad8] whitespace-nowrap">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                  {city}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS: 3-step strip ─── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-10 sm:mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#abc4ff] mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2d3748]">
              Three steps. Two minutes.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: "01", title: "Search", desc: "Type the landlord's name, phone, or property address.", icon: Radar },
              { step: "02", title: "Read", desc: "See ratings, red flags, and written experiences from past tenants.", icon: Star },
              { step: "03", title: "Decide", desc: "Sign the lease with confidence — or walk away informed.", icon: Shield },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 group hover:bg-white/70 transition-all"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <span className="text-3xl sm:text-4xl font-black text-[#e2eafc] group-hover:text-[#c1d3fe] transition-colors">{item.step}</span>
                  <item.icon className="w-5 h-5 text-[#abc4ff]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2d3748] mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURES ─── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-dot-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12 sm:mb-20 space-y-3 sm:space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2d3748] max-w-lg">
              Built for tenants, not landlords.
            </h2>
            <p className="text-base sm:text-lg text-[#4a5568] max-w-md">
              Every feature exists because a tenant needed it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-auto md:auto-rows-[280px]">
            {/* Feature 1 — Wide */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,56,100,0.06)] rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between overflow-hidden group relative"
            >
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#c1d3fe]/30 rounded-full blur-3xl -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 transition-transform duration-700 group-hover:scale-150"></div>
              <div className="relative z-10">
                <Radar className="w-8 h-8 sm:w-10 sm:h-10 text-[#abc4ff] mb-4 sm:mb-6" />
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#2d3748] tracking-tight">Instant lookup</h3>
                <p className="text-sm sm:text-base text-[#4a5568] max-w-md leading-relaxed">
                  Search by name, phone, or exact address. Fuzzy matching finds the right profile even with typos.
                </p>
              </div>
              <Link href="/search?q=" className="relative z-10 flex items-center gap-2 mt-6 sm:mt-8 text-[#abc4ff] font-bold text-xs sm:text-sm tracking-widest uppercase hover:underline">
                Browse Registry <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Feature 2 — Tall */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:row-span-2 bg-gradient-to-b from-[#e2eafc] to-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,56,100,0.06)] rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <Siren className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 mb-4 sm:mb-6" />
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#2d3748] tracking-tight">Red flag detection</h3>
                <p className="text-sm sm:text-base text-[#4a5568] mb-6 sm:mb-10">
                  Automatically tags severe patterns across reviews.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {['Deposit withholding', 'Illegal lockouts', 'Unannounced entry', 'Severe neglect'].map((flag, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold bg-white rounded-lg p-2.5 sm:p-3 shadow-sm border border-[#e2eafc]">
                      <Ghost className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 flex-shrink-0" />
                      <span className="text-[#2d3748]">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,56,100,0.06)] rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#b6ccfe] mb-4 sm:mb-6 transition-transform duration-500 group-hover:-translate-y-1" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#2d3748] tracking-tight">Property ratings</h3>
                <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed">
                  Rate maintenance, deposit return, behaviour, and rent fairness independently.
                </p>
              </div>
            </motion.div>

            {/* CTA Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#abc4ff] border border-white/20 shadow-[0_8px_32px_rgba(171,196,255,0.4)] rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between"
            >
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 sm:mb-4 leading-tight">
                Had a landlord?<br/>Leave a review.
              </h3>
              <p className="text-blue-50 text-sm sm:text-base mb-6 sm:mb-8 opacity-90">
                Takes 2 minutes. Stays anonymous forever.
              </p>
              <Link href="/submit" className="glass-panel text-center text-[#2d3748] py-3 sm:py-4 rounded-xl font-bold hover:bg-white transition-colors text-sm sm:text-base">
                Write a Review
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
