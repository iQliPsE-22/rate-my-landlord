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
    { url: "/search?q=", title: "Landlord Registry", description: "Search reviews of local property owners.", icon: <Radar size={20} className="text-accent" /> },
    { url: "/search?q=", title: "Property Intel", description: "Analyze zipcodes for maintenance red flags.", icon: <MapPinHouse size={20} className="text-accent"/> },
  ];

  const resourcesMenu = [
    { title: "Tenant Rights", description: "Legal boundaries landlords can't cross.", icon: <Scale size={20} className="text-blue-400"/> },
    { title: "Deposit Defense", description: "Get your security deposit back.", icon: <ShieldAlert size={20} className="text-blue-400"/> },
    { title: "Severe Violations", description: "Identify illegal entries & lease-breakers.", icon: <Siren size={20} className="text-blue-400"/> },
  ];

  const flagsMenu = [
    { title: "Slumlord Behavior", description: "Patterns of harassment and neglect.", icon: <Ghost size={20} className="text-accent"/> },
    { title: "Health Hazards", description: "Black mold, pest, toxic environments.", icon: <Biohazard size={20} className="text-accent"/> },
    { title: "Illegal Evictions", description: "Lockout alerts and falsified notices.", icon: <Gavel size={20} className="text-accent"/> },
  ];

  const mobileLinks = [
    { label: "Search Registry", href: "/search?q=", icon: <Radar size={18} className="text-accent" /> },
    { label: "File a Report", href: "/submit", icon: <ArrowRight size={18} className="text-accent" /> },
    { label: "About Us", href: "/about", icon: <Tent size={18} className="text-accent" /> },
  ];

  return (
    <>
      <div
        className={`fixed w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] xl:w-[95%] flex flex-row items-center justify-between top-2 md:top-4 left-[50%] translate-x-[-50%] z-50 px-3 md:px-4 lg:px-6 py-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-card transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <Link href="/" className="font-bold text-lg md:text-xl tracking-tight text-text-heading flex items-center gap-1.5 md:gap-2 pl-1 md:pl-2">
          <Tent className="text-accent fill-blue-100" size={24} />
          <span className="hidden md:inline">RentersGuard</span>
          <span className="md:hidden">RG</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="hidden lg:flex">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-text-heading hover:text-accent hover:bg-black/5 font-medium">
                Search & Intel
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/30 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-xl shadow-menu mt-2">
                  {searchMenu.map((item, idx) => (
                    <Link href={item.url || "#"} key={idx} className="flex flex-row items-center gap-4 text-text-body hover:text-text-heading cursor-pointer group p-3 hover:bg-white/30 rounded-xl transition-all">
                      <span className="bg-white/20 backdrop-blur-md group-hover:bg-white/40 transition-colors p-3 rounded-xl shadow-sm border border-white/30">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-text-heading text-sm mb-0.5 font-bold">{item.title}</h4>
                        <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-text-heading hover:text-accent hover:bg-black/5 font-medium">
                Legal Defense
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/30 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-xl shadow-menu mt-2">
                  {resourcesMenu.map((item, idx) => (
                    <div key={idx} className="flex flex-row items-center gap-4 text-text-body hover:text-text-heading cursor-pointer group p-3 hover:bg-white/30 rounded-xl transition-all">
                      <span className="bg-white/20 backdrop-blur-md group-hover:bg-white/40 transition-colors p-3 rounded-xl shadow-sm border border-white/30">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-text-heading text-sm mb-0.5 font-bold">{item.title}</h4>
                        <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-text-heading hover:text-accent hover:bg-black/5 font-medium">
                Red Flags DB
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/30 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-xl shadow-menu mt-2">
                  {flagsMenu.map((item, idx) => (
                    <div key={idx} className="flex flex-row items-center gap-4 text-text-body hover:text-text-heading cursor-pointer group p-3 hover:bg-white/30 rounded-xl transition-all">
                      <span className="bg-white/20 backdrop-blur-md group-hover:bg-white/40 transition-colors p-3 rounded-xl shadow-sm border border-white/30">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-text-heading text-sm mb-0.5 font-bold">{item.title}</h4>
                        <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className="h-9 w-max px-4 py-2 text-sm font-bold text-text-body hover:text-text-heading cursor-pointer transition-colors">
              <Link href="/about">About Us</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop CTA */}
          <Link
            href="/submit"
            className="hidden md:flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-accent hover:bg-blue-400 text-white text-sm font-bold shadow-accent transition-all"
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
            {mobileOpen ? <X size={22} className="text-text-heading" /> : <Menu size={22} className="text-text-heading" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="absolute top-16 left-2 right-2 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-drawer p-4 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
            {mobileLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-text-heading font-semibold text-base hover:bg-bg-subtle transition-colors active:bg-bg-surface"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-blue-100 mt-2">
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-accent text-white font-bold text-base shadow-sm active:bg-blue-400"
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
