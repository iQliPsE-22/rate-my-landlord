"use client";

import Link from "next/link";
import { ArrowRight, Radar, Siren, Ghost, Building2, MapPin, Shield, Star, AlertTriangle } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

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



  return (
    <div className="flex flex-col relative overflow-hidden" ref={containerRef}>


      {/* ─── HERO: Search-first, no fluff ─── */}



      <section className="relative w-screen z-10 px-4 pt-10 py-16 ">


        <div className="absolute top-0 inset-0 -z-1">
          <Image src="/section1.svg" alt="bg image" width={1024} height={786} className="w-full bg-top" />
        </div>


        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-5xl mx-auto"
        >


          {/* Minimal context line */}
          <motion.p variants={fadeIn} className="text-xs md:text-sm font-bold tracking-widest uppercase text-accent mb-4 md:mb-6">
            Anonymous · Free · India-wide
          </motion.p>

          {/* Direct headline — not a slogan, a utility statement */}
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-4 md:mb-6 text-text-heading max-w-3xl">
            Check your landlord
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            before you sign.
          </motion.h1>

          <motion.p variants={fadeIn} className="text-base md:text-lg lg:text-xl text-text-body mb-8 md:mb-10 max-w-xl leading-relaxed">
            Search by name, phone number, or address. Read what past tenants actually experienced.
          </motion.p>

          {/* Search bar — THE hero element */}
          <motion.div variants={fadeIn} className="mb-8 md:mb-12 w-full max-w-2xl">
            <SearchBar />
          </motion.div>

          {/* Real numbers, not marketing fluff */}
          <motion.div variants={fadeIn} className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-3 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span><strong className="text-text-heading">100%</strong> anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span><strong className="text-text-heading">12</strong> cities covered</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <span><strong className="text-text-heading">6</strong> red flag categories</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── LIVE FEED: Recent reviews ticker ─── */}
      <section className="relative z-10 py-6 md:py-8 border-y border-border-subtle/40 bg-white/30 backdrop-blur-sm overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-xs md:text-xs font-bold uppercase tracking-widest text-accent mb-4 md:mb-5">Recent from the community</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{review.city}</span>
                  <span className={`text-xs font-black ${review.rating >= 3 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-text-body leading-snug line-clamp-2 text-sm">
                  &ldquo;{review.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Cities Marquee ─── */}
      <section className="relative z-10 py-6 md:py-10 border-b border-border-subtle/30 bg-white/20 overflow-hidden">
        <div className="flex w-max marquee-group hover:[animation-play-state:paused]">
          {[1, 2, 3, 4, 5].map((set) => (
            <div key={set} className="flex items-center gap-8 md:gap-12 px-4 md:px-6">
              {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'].map((city, idx) => (
                <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-base md:text-xl font-bold text-blue-600 whitespace-nowrap">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
                  {city}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS: 3-step strip ─── */}
      <section className="relative z-10 py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-10 md:mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-text-heading">
              Three steps. Two minutes.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
                className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-6 md:p-8 group hover:bg-white/70 transition-all"
              >
                <div className="flex items-center gap-3 mb-4 md:mb-5">
                  <span className="text-3xl md:text-4xl text-blue-100 group-hover:text-blue-300 transition-colors">{item.step}</span>
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text-heading mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm md:text-base text-text-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURES ─── */}
      <section className="relative z-10 py-16 md:py-24 px-4 md:px-6 bg-dot-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-20 space-y-3 md:space-y-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-text-heading max-w-lg">
              Built for tenants, not landlords.
            </h2>
            <p className="text-base md:text-lg text-text-body max-w-md">
              Every feature exists because a tenant needed it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[280px]">
            {/* Feature 1 — Wide */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/40 shadow-card md:rounded-2xl p-6 md:p-10 flex flex-col justify-between overflow-hidden group relative rounded-2xl"
            >
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-300/30 rounded-full blur-3xl -mr-16 md:-mr-20 -mt-16 md:-mt-20 transition-transform duration-700 group-hover:scale-150"></div>
              <div className="relative z-10">
                <Radar className="w-8 h-8 md:w-10 md:h-10 text-accent mb-4 md:mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-heading tracking-tight">Instant lookup</h3>
                <p className="text-sm md:text-base text-text-body max-w-md leading-relaxed">
                  Search by name, phone, or exact address. Fuzzy matching finds the right profile even with typos.
                </p>
              </div>
              <Link href="/search?q=" className="relative z-10 flex items-center gap-2 mt-6 md:mt-8 text-accent font-bold text-xs md:text-sm tracking-widest uppercase hover:underline">
                Browse Registry <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Feature 2 — Tall */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:row-span-2 bg-linear-to-b from-blue-100 to-white/40 backdrop-blur-xl border border-white/40 shadow-card rounded-2xl md:rounded-2xl p-6 md:p-10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <Siren className="w-8 h-8 md:w-10 md:h-10 text-rose-400 mb-4 md:mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-heading tracking-tight">Red flag detection</h3>
                <p className="text-sm md:text-base text-text-body mb-6 md:mb-10">
                  Automatically tags severe patterns across reviews.
                </p>
                <div className="space-y-2 md:space-y-3">
                  {['Deposit withholding', 'Illegal lockouts', 'Unannounced entry', 'Severe neglect'].map((flag, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm font-bold bg-white rounded-lg p-2.5 md:p-3 shadow-sm border border-blue-100">
                      <Ghost className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400 flex-shrink-0" />
                      <span className="text-text-heading">{flag}</span>
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
              className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-card rounded-2xl md:rounded-2xl p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Building2 className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-4 md:mb-6 transition-transform duration-500 group-hover:-translate-y-1" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-text-heading tracking-tight">Property ratings</h3>
                <p className="text-sm md:text-base text-text-body leading-relaxed">
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
              className="bg-accent border border-white/20 shadow-accent rounded-2xl md:rounded-2xl p-6 md:p-10 flex flex-col justify-between"
            >
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3 md:mb-4 leading-tight">
                Had a landlord?<br />Leave a review.
              </h3>
              <p className="text-blue-50 text-sm md:text-base mb-6 md:mb-8 opacity-90">
                Takes 2 minutes. Stays anonymous forever.
              </p>
              <Link href="/submit" className="glass-panel text-center text-text-heading py-3 md:py-4 rounded-xl font-bold hover:bg-white transition-colors text-sm md:text-base">
                Write a Review
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div >
  );
}
