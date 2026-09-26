"use client";

import React, { useState } from "react";
import { useFacility } from "@/context/FacilityContext";
import { formatNumber, formatRupiah } from "@/lib/utils";
import {
  Users2,
  DollarSign,
  TrendingUp,
  FileText,
  Building,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function TenantPage() {
  const { tenants, updateEscalationRate } = useFacility();
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]);

  const totalMonthlyIncome = tenants.reduce((acc, t) => acc + t.monthlyTotalRentIdr, 0);
  const totalAnnualProjected = totalMonthlyIncome * 12;

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="brutalist-card p-6 bg-[#1C1917] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
            <span className="w-2.5 h-2.5 bg-amber-500 inline-block animate-ping"></span>
            MANAJEMEN OKUPANSI & SEWA RUANG // GRADE-A TOWER
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
            COMMERCIAL TENANT LEASE ESCALATOR
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Total Tenant Korporat Terdaftar: <strong className="text-white">{tenants.length} Perusahaan</strong> // Total Luas Tersewa: 4,090 m²
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="border-2 border-stone-700 p-3 bg-stone-900 text-right">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">TOTAL PENDAPATAN BULANAN:</span>
            <span className="text-xl font-black text-amber-500">{formatRupiah(totalMonthlyIncome)}</span>
            <span className="text-[9px] text-stone-500 block">PROYEKSI TAHUNAN: {formatRupiah(totalAnnualProjected)}</span>
          </div>
        </div>
      </div>

      {/* Tenant Table & Interactive Escalator Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tenant Table (8 cols) */}
        <div className="lg:col-span-8 brutalist-card overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-stone-900 text-stone-300 border-b-2 border-stone-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3.5 border-r border-stone-800">SUITE / LT</th>
                <th className="p-3.5 border-r border-stone-800">NAMA PERUSAHAAN</th>
                <th className="p-3.5 border-r border-stone-800 text-right">LUAS (m²)</th>
                <th className="p-3.5 border-r border-stone-800 text-right">TARIF / m²</th>
                <th className="p-3.5 border-r border-stone-800 text-right">TOTAL SEWA / BLN</th>
                <th className="p-3.5 text-center">STATUS BAYAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {tenants.map((t) => {
                const isSelected = selectedTenant?.id === t.id;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTenant(t)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-500/10 text-white border-l-4 border-amber-500"
                        : "hover:bg-stone-800/60 text-stone-300"
                    }`}
                  >
                    <td className="p-3.5 font-bold text-amber-500 border-r border-stone-800">
                      {t.suiteNumber} (Lt. {t.floorLevel})
                    </td>
                    <td className="p-3.5 border-r border-stone-800">
                      <div className="font-bold text-white">{t.companyName}</div>
                      <div className="text-[10px] text-stone-500">{t.industry}</div>
                    </td>
                    <td className="p-3.5 text-right border-r border-stone-800 font-bold">
                      {formatNumber(t.rentableAreaSqm, 0)} m²
                    </td>
                    <td className="p-3.5 text-right border-r border-stone-800">
                      {formatRupiah(t.monthlyRentalRatePerSqmIdr)}
                    </td>
                    <td className="p-3.5 text-right border-r border-stone-800 font-bold text-white">
                      {formatRupiah(t.monthlyTotalRentIdr)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase border border-stone-950 ${
                          t.paymentStatus === "CURRENT_PAID"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                            : t.paymentStatus === "PENDING_INVOICE"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500"
                            : "bg-red-500/20 text-red-400 border-red-500"
                        }`}
                      >
                        {t.paymentStatus.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Escalator Calculation Panel (4 cols) */}
        <div className="lg:col-span-4 brutalist-card p-6 bg-[#1C1917] space-y-4">
          <div className="border-b-2 border-stone-800 pb-3">
            <h3 className="font-bold text-sm uppercase text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              KALKULATOR ESKALASI SEWA TAHUNAN
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Simulasi kenaikan nilai kontrak berkala per tahun.
            </p>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-700 space-y-1">
            <span className="text-[10px] text-stone-400 block font-bold">TENANT TERPILIH:</span>
            <div className="text-sm font-black text-white">{selectedTenant.companyName}</div>
            <div className="text-[10px] text-stone-400">
              Masa Kontrak: {selectedTenant.leaseStartDate} s/d {selectedTenant.leaseExpiryDate}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>RATE ESKALASI TAHUNAN:</span>
              <span className="text-amber-500 text-sm font-black">
                {selectedTenant.annualEscalationRatePct}% PER TAHUN
              </span>
            </div>

            <input
              type="range"
              min="3.0"
              max="15.0"
              step="0.5"
              value={selectedTenant.annualEscalationRatePct}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                updateEscalationRate(selectedTenant.id, val);
                setSelectedTenant({ ...selectedTenant, annualEscalationRatePct: val });
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>3.0% (Inflasi Rendah)</span>
              <span>8.0% (Standar CBD)</span>
              <span>15.0% (Maksimal)</span>
            </div>
          </div>

          {/* Projected Year 2 & Year 3 */}
          <div className="p-4 bg-stone-900 border border-stone-700 space-y-2 text-xs">
            <div className="font-bold text-stone-300 text-[11px] border-b border-stone-800 pb-1">
              PROYEKSI SEWA TAHUN BERIKUTNYA:
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Tahun ke-1 (Sekarang):</span>
              <span className="font-bold text-white">{formatRupiah(selectedTenant.monthlyTotalRentIdr)}/bln</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Tahun ke-2 (+{selectedTenant.annualEscalationRatePct}%):</span>
              <span className="font-bold text-amber-400">
                {formatRupiah(selectedTenant.monthlyTotalRentIdr * (1 + selectedTenant.annualEscalationRatePct / 100))}/bln
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Tahun ke-3:</span>
              <span className="font-bold text-amber-500">
                {formatRupiah(selectedTenant.monthlyTotalRentIdr * Math.pow(1 + selectedTenant.annualEscalationRatePct / 100, 2))}/bln
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              confetti({ particleCount: 30, spread: 50 });
              alert(`Eskalasi sewa ${selectedTenant.companyName} diperbarui ke ${selectedTenant.annualEscalationRatePct}%!`);
            }}
            className="brutalist-btn w-full py-3 bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider hover:bg-white"
          >
            SIMPAN KLAUSUL ESKALASI KONTRAK
          </button>
        </div>
      </div>
    </div>
  );
}
