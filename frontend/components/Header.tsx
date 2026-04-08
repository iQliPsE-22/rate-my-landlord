"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ArrowRight, Siren, Radar, Tent, MapPinHouse, ShieldAlert, Gavel, Scale, Biohazard, Ghost } from "lucide-react";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Hide
      } else {
        setIsVisible(true); // Show
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const searchMenu = [
    { url: "/search?q=", title: "Landlord Registry", description: "Search 500+ unredacted reviews of local property owners.", icon: <Radar size={22} className="text-[#abc4ff]" /> },
    { url: "/search?q=", title: "Property Intel", description: "Analyze zipcodes for severe maintenance red flags.", icon: <MapPinHouse size={22} className="text-[#abc4ff]"/> },
  ];

  const resourcesMenu = [
    { title: "Tenant Rights", description: "Legal boundaries your landlord isn't allowed to cross.", icon: <Scale size={22} className="text-[#b6ccfe]"/> },
    { title: "Deposit Defense", description: "Tactics for getting your security deposit back.", icon: <ShieldAlert size={22} className="text-[#b6ccfe]"/> },
    { title: "Severe Violations", description: "Identify illegal entries and immediate lease-breakers.", icon: <Siren size={22} className="text-[#b6ccfe]"/> },
  ];

  const flagsMenu = [
    { title: "Slumlord Behavior", description: "Patterns of harassment and neglect.", icon: <Ghost size={22} className="text-[#abc4ff]"/> },
    { title: "Health Hazards", description: "Documented black mold, pest, and toxic environments.", icon: <Biohazard size={22} className="text-[#abc4ff]"/> },
    { title: "Illegal Evictions", description: "Lockout alerts and falsified notices.", icon: <Gavel size={22} className="text-[#abc4ff]"/> },
  ];

  return (
    <div
      className={`fixed w-full xl:w-[95%] flex flex-row items-center justify-between top-4 left-[50%] translate-x-[-50%] z-50 px-4 lg:px-6 p-2 lg:p-3 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(31,56,100,0.06)] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-[150%]"
      }`}
    >
      <Link href="/" className="font-bold text-xl tracking-tight text-[#2d3748] flex items-center gap-2 pl-2">
        <Tent className="text-[#abc4ff] fill-[#e2eafc]" size={28} />
        RentersGuard
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="hidden lg:flex">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#2d3748] hover:text-[#abc4ff] hover:bg-black/5 font-medium">
              Search & Intel
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-2 border-0 bg-transparent shadow-none">
              <div className="bg-white/70 backdrop-blur-3xl border border-white/50 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-[1.25rem] shadow-[0_12px_40px_rgba(31,56,100,0.1)] mt-2">
                {searchMenu.map((item, idx) => (
                  <Link href={item.url || "#"} key={idx} className="flex flex-row items-center gap-4 text-[#4a5568] hover:text-[#2d3748] cursor-pointer group p-3 hover:bg-white/60 rounded-xl transition-all">
                    <span className="bg-[#edf2fb] group-hover:bg-[#e2eafc] transition-colors p-3 rounded-xl shadow-sm border border-white/40">
                      {item.icon}
                    </span>
                    <div>
                      <h1 className="text-[#2d3748] text-[15px] mb-0.5 font-bold">{item.title}</h1>
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
              <div className="bg-white/70 backdrop-blur-3xl border border-white/50 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-[1.25rem] shadow-[0_12px_40px_rgba(31,56,100,0.1)] mt-2">
                {resourcesMenu.map((item, idx) => (
                  <div key={idx} className="flex flex-row items-center gap-4 text-[#4a5568] hover:text-[#2d3748] cursor-pointer group p-3 hover:bg-white/60 rounded-xl transition-all">
                    <span className="bg-[#edf2fb] group-hover:bg-[#e2eafc] transition-colors p-3 rounded-xl shadow-sm border border-white/40">
                      {item.icon}
                    </span>
                    <div>
                      <h1 className="text-[#2d3748] text-[15px] mb-0.5 font-bold">{item.title}</h1>
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
              <div className="bg-white/70 backdrop-blur-3xl border border-white/50 text-sm p-4 flex flex-col gap-2 min-w-[350px] rounded-[1.25rem] shadow-[0_12px_40px_rgba(31,56,100,0.1)] mt-2">
                {flagsMenu.map((item, idx) => (
                  <div key={idx} className="flex flex-row items-center gap-4 text-[#4a5568] hover:text-[#2d3748] cursor-pointer group p-3 hover:bg-white/60 rounded-xl transition-all">
                    <span className="bg-[#edf2fb] group-hover:bg-[#e2eafc] transition-colors p-3 rounded-xl shadow-sm border border-white/40">
                      {item.icon}
                    </span>
                    <div>
                      <h1 className="text-[#2d3748] text-[15px] mb-0.5 font-bold">{item.title}</h1>
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

      <div className="flex items-center gap-3">
        <Link
          href="/submit"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#abc4ff] hover:bg-[#b6ccfe] text-white text-sm font-bold shadow-[0_4px_12px_rgba(171,196,255,0.4)] transition-all drop-shadow-sm"
        >
          File a Report
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Header;
