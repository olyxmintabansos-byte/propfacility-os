"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFacility } from "@/context/FacilityContext";
import {
  Building2,
  Gauge,
  Users2,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { kpis, resetFacilityData } = useFacility();

  const navLinks = [
    { href: "/", label: "BAS CHILLER & ELEVATOR", icon: Gauge },
    { href: "/tenant", label: "TENANT LEASE MATRIX", icon: Users2 },
  ];

  return (
    <header className="border-b-4 border-stone-900 bg-[#1C1917] text-stone-100 sticky top-0 z-50 shadow-none font-mono">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl border-2 border-stone-950 shadow-[3px_3px_0px_#000]">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
                PROPFACILITY <span className="text-amber-500">OS</span>
              </h1>
              <span className="bg-stone-800 text-stone-300 text-[10px] font-mono border border-stone-600 px-2 py-0.5 uppercase tracking-widest">
                TITAN #27 // RAW BRUTALISM
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono tracking-tight uppercase">
              MENARA GRAHA CAKRAWALA // 45 LANTAI COMMERCIAL GRADE-A
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 border-l-2 border-stone-700 pl-6 text-xs">
          <div>
            <span className="text-stone-400 block text-[9px] uppercase font-bold">TINGKAT OKUPANSI:</span>
            <span className="font-black text-amber-400">{kpis.totalOccupancyRatePct}% TERSEWA</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[9px] uppercase font-bold">BEBAN CHILLER:</span>
            <span className="font-black text-white flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {kpis.dailyChillerEnergyKwh} kWh
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-2 border-stone-950 active:translate-x-[2px] active:translate-y-[2px] ${
                  isActive
                    ? "bg-amber-500 text-stone-950 shadow-[3px_3px_0px_#000]"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white shadow-[3px_3px_0px_#000]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              if (confirm("Reset seluruh data gedung ke parameter awal?")) {
                resetFacilityData();
              }
            }}
            title="Reset Data Gedung"
            className="p-2.5 border-2 border-stone-950 bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}