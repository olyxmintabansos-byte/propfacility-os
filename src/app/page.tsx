"use client";

import React from "react";
import { useFacility } from "@/context/FacilityContext";
import { formatNumber, formatRupiah } from "@/lib/utils";
import {
  Thermometer,
  Zap,
  Power,
  ArrowUp,
  ArrowDown,
  Circle,
  Activity,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function BasDashboardPage() {
  const { chillers, elevators, kpis, toggleChiller, cycleElevator } = useFacility();

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="brutalist-card p-6 bg-[#1C1917] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
            <span className="w-2.5 h-2.5 bg-amber-500 inline-block animate-pulse"></span>
            BUILDING AUTOMATION SYSTEM (BAS) TELEMETRY // REAL-TIME 4 SEC LOOP
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
            CENTRAL CHILLER PLANT & ELEVATOR SHAFT MONITOR
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Gedung: Menara Graha Cakrawala // 45 Lantai // Status Operasional: <strong className="text-emerald-400">99.8% NORMAL</strong>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="border-2 border-stone-700 p-3 bg-stone-900 text-center">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">TOTAL TRIP ELEVATOR:</span>
            <span className="text-xl font-black text-amber-500">{kpis.elevatorTripsToday}</span>
            <span className="text-[9px] text-stone-500 block">SIKLUS HARI INI</span>
          </div>

          <div className="border-2 border-stone-700 p-3 bg-stone-900 text-center">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">COP EFISIENSI RATA2:</span>
            <span className="text-xl font-black text-emerald-400">6.08 COP</span>
            <span className="text-[9px] text-stone-500 block">STANDARD ASHRAE</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chiller Plant (7 cols) & Elevator Shafts (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chiller Units */}
        <div className="lg:col-span-7 space-y-4">
          <div className="brutalist-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-white">
              <Thermometer className="w-4 h-4 text-amber-500" />
              STATUS UNIT CHILLER PENDINGIN UTAMA ({chillers.length} UNIT)
            </div>
          </div>

          <div className="space-y-4">
            {chillers.map((c) => {
              const isOnline = c.status === "ONLINE_OPTIMAL";
              const tempDelta = Math.round((c.chilledWaterTempReturnC - c.chilledWaterTempSupplyC) * 10) / 10;

              return (
                <div
                  key={c.id}
                  className="brutalist-card p-5 bg-[#1C1917] space-y-4 relative"
                >
                  <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 text-xs">
                    <div>
                      <span className="font-black text-white">{c.name}</span>
                      <span className="text-stone-500 text-[11px] block mt-0.5">
                        Refrigerant: {c.refrigerant} // Kapasitas: {c.coolingCapacityKw} kW
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        toggleChiller(c.id);
                        confetti({ particleCount: 20, spread: 40 });
                      }}
                      className={`brutalist-btn px-3 py-1.5 font-black text-[10px] uppercase flex items-center gap-1.5 ${
                        isOnline
                          ? "bg-emerald-500 text-stone-950"
                          : "bg-stone-700 text-stone-300"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {isOnline ? "ONLINE" : "STANDBY"}
                    </button>
                  </div>

                  {/* Chiller Gauges */}
                  <div className="grid grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-2 border border-stone-700 bg-stone-900/60">
                      <span className="text-[9px] text-stone-400 block font-bold">TEMP SUPPLY:</span>
                      <span className="text-base font-black text-cyan-400">{c.chilledWaterTempSupplyC}°C</span>
                    </div>

                    <div className="p-2 border border-stone-700 bg-stone-900/60">
                      <span className="text-[9px] text-stone-400 block font-bold">TEMP RETURN:</span>
                      <span className="text-base font-black text-amber-400">{c.chilledWaterTempReturnC}°C</span>
                    </div>

                    <div className="p-2 border border-stone-700 bg-stone-900/60">
                      <span className="text-[9px] text-stone-400 block font-bold">DELTA TEMP (ΔT):</span>
                      <span className="text-base font-black text-white">{tempDelta}°C</span>
                    </div>

                    <div className="p-2 border border-stone-700 bg-stone-900/60">
                      <span className="text-[9px] text-stone-400 block font-bold">DAYA LISTRIK:</span>
                      <span className="text-base font-black text-yellow-400">{c.powerDrawKw} kW</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-stone-400">
                    <span>Flow Rate Air: <strong>{c.flowRateLps} L/s</strong></span>
                    <span>Efisiensi: <strong className="text-emerald-400">{c.copEfficiency} COP</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Elevator Shafts Real-time Movement */}
        <div className="lg:col-span-5 space-y-4">
          <div className="brutalist-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-white">
              <Activity className="w-4 h-4 text-amber-500" />
              STATUS SHAFT LIFT & POSISI LANTAI
            </div>
            <span className="text-[10px] text-stone-400 animate-pulse">4S AUTO-TICK</span>
          </div>

          <div className="space-y-3">
            {elevators.map((l) => {
              const loadPct = Math.round((l.loadWeightKg / l.maxCapacityKg) * 100);

              return (
                <div
                  key={l.id}
                  className="brutalist-card p-4 bg-[#1C1917] space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-xs">
                    <div>
                      <span className="font-black text-white">{l.liftCode}</span>
                      <span className="text-[10px] text-stone-400 block">{l.zone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-stone-950 flex items-center gap-1 ${
                          l.direction === "UP"
                            ? "bg-amber-500 text-stone-950"
                            : l.direction === "DOWN"
                            ? "bg-cyan-500 text-stone-950"
                            : "bg-stone-700 text-stone-300"
                        }`}
                      >
                        {l.direction === "UP" ? <ArrowUp className="w-3 h-3" /> : l.direction === "DOWN" ? <ArrowDown className="w-3 h-3" /> : null}
                        {l.direction}
                      </span>

                      <button
                        onClick={() => cycleElevator(l.id)}
                        className="brutalist-btn px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] uppercase font-bold"
                      >
                        {l.doorStatus === "OPEN" ? "PINTU BUKA" : "PINTU TUTUP"}
                      </button>
                    </div>
                  </div>

                  {/* Floor Display */}
                  <div className="flex items-center justify-between bg-stone-900 border border-stone-700 p-3">
                    <span className="text-[11px] text-stone-400">POSISI LANTAI SEKARANG:</span>
                    <span className="text-2xl font-black text-amber-500 tracking-wider">
                      LANTAI {String(l.currentFloor).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Load progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>Beban Kabin: {l.loadWeightKg} kg ({loadPct}%)</span>
                      <span>Maks: {l.maxCapacityKg} kg</span>
                    </div>
                    <div className="w-full bg-stone-900 h-2 border border-stone-700">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(loadPct, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
