"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ArrowRight, Siren, Radar, Tent, MapPinHouse, ShieldAlert, Gavel, Scale, Biohazard, Ghost, Menu, X } from "lucide-react";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setMobileOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const searchMenu = [
    { url: "/search?q=", title: "Landlord Registry", description: "Search reviews of local property owners.", icon: <Radar size={20} className="text-[#abc4ff]" /> },
    { url: "/search?q=", title: "Property Intel", description: "Analyze zipcodes for maintenance red flags.", icon: <MapPinHouse size={20} className="text-[#abc4ff]"/> },
  ];

  const resourcesMenu = [
    { title: "Tenant Rights", description: "Legal boundaries landlords can't cross.", icon: <Scale size={20} className="text-[#b6ccfe]"/> },
    { title: "Deposit Defense", description: "Get your security deposit back.", icon: <ShieldAlert size={20} className="text-[#b6ccfe]"/> },
    { title: "Severe Violations", description: "Identify illegal entries & lease-breakers.", icon: <Siren size={20} className="text-[#b6ccfe]"/> },
  ];

  const flagsMenu = [
    { title: "Slumlord Behavior", description: "Patterns of harassment and neglect.", icon: <Ghost size={20} className="text-[#abc4ff]"/> },
    { title: "Health Hazards", description: "Black mold, pest, toxic environments.", icon: <Biohazard size={20} className="text-[#abc4ff]"/> },
    { title: "Illegal Evictions", description: "Lockout alerts and falsified notices.", icon: <Gavel size={20} className="text-[#abc4ff]"/> },
  ];

  const mobileLinks = [
    { label: "Search Registry", href: "/search?q=", icon: <Radar size={18} className="text-[#abc4ff]" /> },
    { label: "File a Report", href: "/submit", icon: <ArrowRight size={18} className="text-[#abc4ff]" /> },
    { label: "About Us", href: "/about", icon: <Tent size={18} className="text-[#abc4ff]" /> },
  ];

  return (
    <>
      <div
        className={`fixed w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] xl:w-[95%] flex flex-row items-center justify-between top-2 sm:top-4 left-[50%] translate-x-[-50%] z-50 px-3 sm:px-4 lg:px-6 py-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(31,56,100,0.08)] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <Link href="/" className="font-bold text-lg sm:text-xl tracking-tight text-[#2d3748] flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2">
          <Tent className="text-[#abc4ff] fill-[#e2eafc]" size={24} />
          <span className="hidden sm:inline">RentersGuard</span>
          <span className="sm:hidden">RG</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="hidden lg:flex">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-[#2d3748] hover:text-[#abc4ff] hover:bg-black/5 font-medium">
                Search & Intel
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/30 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-[1.25rem] shadow-[0_12px_40px_rgba(31,56,100,0.15)] mt-2">
                  {searchMenu.map((item, idx) => (
                    <Link href={item.url || "#"} key={idx} className="flex flex-row items-center gap-4 text-[#4a5568] hover:text-[#2d3748] cursor-pointer group p-3 hover:bg-white/30 rounded-xl transition-all">
                      <span className="bg-white/20 backdrop-blur-md group-hover:bg-white/40 transition-colors p-3 rounded-xl shadow-sm border border-white/30">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-[#2d3748] text-[15px] mb-0.5 font-bold">{item.title}</h4>
                        <p className="text-xs text-[#718096] leading-relaxed">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-[#2d3748] hover:text-[#abc4ff] hover:bg-black/5 font-medium">
                Legal Defense
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/30 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-[1.25rem] shadow-[0_12px_40px_rgba(31,56,100,0.15)] mt-2">
                  {resourcesMenu.map((item, idx) => (
                    <div key={idx} className="flex flex-row items-center gap-4 text-[#4a5568] hover:text-[#2d3748] cursor-pointer group p-3 hover:bg-white/30 rounded-xl transition-all">
                      <span className="bg-white/20 backdrop-blur-md group-hover:bg-white/40 transition-colors p-3 rounded-xl shadow-sm border border-white/30">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-[#2d3748] text-[15px] mb-0.5 font-bold">{item.title}</h4>
                        <p className="text-xs text-[#718096] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-[#2d3748] hover:text-[#abc4ff] hover:bg-black/5 font-medium">
                Red Flags DB
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/30 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-[1.25rem] shadow-[0_12px_40px_rgba(31,56,100,0.15)] mt-2">
                  {flagsMenu.map((item, idx) => (
                    <div key={idx} className="flex flex-row items-center gap-4 text-[#4a5568] hover:text-[#2d3748] cursor-pointer group p-3 hover:bg-white/30 rounded-xl transition-all">
                      <span className="bg-white/20 backdrop-blur-md group-hover:bg-white/40 transition-colors p-3 rounded-xl shadow-sm border border-white/30">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-[#2d3748] text-[15px] mb-0.5 font-bold">{item.title}</h4>
                        <p className="text-xs text-[#718096] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem className="h-9 w-max px-4 py-2 text-sm font-bold text-[#4a5568] hover:text-[#2d3748] cursor-pointer transition-colors">
              <Link href="/about">About Us</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop CTA */}
          <Link
            href="/submit"
            className="hidden md:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#abc4ff] hover:bg-[#b6ccfe] text-white text-sm font-bold shadow-[0_4px_12px_rgba(171,196,255,0.4)] transition-all"
          >
            File a Report
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/40 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} className="text-[#2d3748]" /> : <Menu size={22} className="text-[#2d3748]" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          
          {/* Drawer */}
          <div className="absolute top-16 left-2 right-2 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-[0_16px_48px_rgba(31,56,100,0.12)] p-4 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
            {mobileLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#2d3748] font-semibold text-base hover:bg-[#edf2fb] transition-colors active:bg-[#e2eafc]"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            
            <div className="pt-2 border-t border-[#e2eafc] mt-2">
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#abc4ff] text-white font-bold text-base shadow-sm active:bg-[#b6ccfe]"
              >
                File a Report
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
