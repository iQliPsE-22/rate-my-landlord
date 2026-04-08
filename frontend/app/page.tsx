"use client";

import Link from "next/link";
import { ArrowRight, Radar, MapPinHouse, Siren, Search, Ghost, Building2, MapPin } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 } // removed ease: 'string' to resolve TS error
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

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
      
      {/* Background Abstract Orbs - Ethereal Palette */}
      <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full glow-orb-1 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full glow-orb-2 blur-3xl mix-blend-multiply"></div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-32 max-w-6xl mx-auto w-full flex flex-col justify-start items-center text-center mt-8">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeIn} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#abc4ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#abc4ff]"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-[#4a5568]">
                100% Anonymous Platform
              </span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-6xl sm:text-8xl font-black tracking-tighter leading-[1.05] mb-8 text-[#2d3748]">
            Trust takes years.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#abc4ff] to-[#b6ccfe]">
              Reviews take minutes.
            </span>
          </motion.h1>

          <motion.p variants={fadeIn} className="text-xl sm:text-2xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto text-[#4a5568] text-balance">
            Don't sign a lease blindly. Search verified tenant experiences across India to uncover hidden red flags before you move in.
          </motion.p>

          <motion.div variants={fadeIn} className="mb-10 w-full max-w-2xl mx-auto">
            <div className="bg-white/50 backdrop-blur-xl p-2 rounded-2xl border border-white/60 shadow-[0_12px_40px_rgba(171,196,255,0.4)]">
              <SearchBar />
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#edf2fb] bg-[#e2eafc] flex items-center justify-center overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&scale=120`} alt="Avatar" className="w-10 h-10 opacity-90" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-[#edf2fb] bg-[#abc4ff] flex items-center justify-center text-white text-xs font-bold z-10 shadow-sm">
                10k+
              </div>
            </div>
            <p className="text-sm font-medium text-[#4a5568] text-left leading-tight">
              Tenants protected from <br/><span className="text-[#2d3748] font-bold">toxic landlords</span> this month.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Infinite Marquee - Cities */}
      <section className="relative z-10 py-10 border-y border-[#d7e3fc]/50 bg-white/40 backdrop-blur-md overflow-hidden">
        <div className="flex w-max marquee-group hover:[animation-play-state:paused]">
          {[1, 2, 3, 4, 5].map((set) => (
            <div key={set} className="flex items-center gap-12 px-6">
              {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map((city, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xl font-bold text-[#b6ccfe] mix-blend-multiply">
                  <MapPin className="w-5 h-5 opacity-60" />
                  {city}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Modern Bento Grid - Ethereal Colors */}
      <section className="relative z-10 py-32 px-6 bg-dot-pattern">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20 space-y-4"
          >
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-[#2d3748] max-w-2xl">
              The ultimate tenant defense mechanism.
            </h2>
            <p className="text-xl font-medium text-[#4a5568] max-w-xl">
              A meticulously structured database designed to expose patterns of bad behavior before you pay the deposit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            {/* Bento Box 1 - Large */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,56,100,0.06)] rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden group relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c1d3fe]/40 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
              <div className="relative z-10">
                <Radar className="w-12 h-12 text-[#abc4ff] mb-6 drop-shadow-sm" />
                <h3 className="text-3xl font-bold mb-4 text-[#2d3748] tracking-tight">Investigate Instantly</h3>
                <p className="text-lg font-medium text-[#4a5568] max-w-md">
                  Search by pan, name, or exact address. Our intelligent matching ensures you find the exact landlord profile within seconds, cutting through noise.
                </p>
              </div>
              <Link href="/search?q=" className="relative z-10 flex items-center gap-2 mt-8 text-[#abc4ff] font-bold text-sm tracking-widest uppercase hover:underline">
                Browse Registry <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Bento Box 2 - Tall */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:row-span-2 bg-gradient-to-b from-[#e2eafc] to-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,56,100,0.06)] rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <Siren className="w-12 h-12 text-rose-400 mb-6 drop-shadow-sm" />
                <h3 className="text-3xl font-bold mb-4 text-[#2d3748] tracking-tight">Spot Red Flags</h3>
                <p className="text-lg font-medium text-[#4a5568] mb-12">
                  Our algorithm automatically detects and highlights severe infractions.
                </p>
                <div className="space-y-3">
                  {['Deposit Withholding', 'Illegal Lockouts', 'Unannounced Entry', 'Severe Neglect'].map((flag, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-bold text-[#c1d3fe] bg-white rounded-lg p-3 shadow-sm border border-[#e2eafc]">
                      <Ghost className="w-4 h-4 text-rose-400" />
                      <span className="text-[#2d3748]">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bento Box 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,56,100,0.06)] rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Building2 className="w-12 h-12 text-[#b6ccfe] mb-6 drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-2" />
                <h3 className="text-2xl font-bold mb-3 text-[#2d3748] tracking-tight">Property Deep Dives</h3>
                <p className="text-[#4a5568] font-medium leading-relaxed">
                  Rate conditions independently from landlords to map out neglected buildings.
                </p>
              </div>
            </motion.div>

            {/* Bento Box 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#abc4ff] border border-white/20 shadow-[0_8px_32px_rgba(171,196,255,0.4)] rounded-[2rem] p-10 flex flex-col justify-between"
            >
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4 leading-tight">
                Help the next tenant out.
              </h3>
              <p className="text-blue-50 font-medium mb-8 opacity-90">
                Submit an anonymous review in less than 2 minutes.
              </p>
              <Link href="/submit" className="glass-panel text-center text-[#2d3748] py-4 rounded-xl font-bold hover:bg-white transition-colors">
                Start a Report
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
