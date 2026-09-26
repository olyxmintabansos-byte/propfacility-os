"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useFacility } from "@/context/FacilityContext";
import { LeaseAgreement } from "@/types/facility";
import {
  FileCheck2,
  Printer,
  Stamp,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  FileSignature,
  QrCode,
  CheckCircle2,
} from "lucide-react";

export default function SpsmPage() {
  const {
    agreements,
    activeAgreementNumber,
    setActiveAgreementNumber,
    updateAgreement,
    toggleStampDuty,
    toggleBmApproval,
  } = useFacility();

  const activeDoc =
    agreements.find((a) => a.spsmNumber === activeAgreementNumber) || agreements[0];

  const [editRate, setEditRate] = useState<number>(activeDoc?.baseRentRatePerSqmIdr || 320000);
  const [editServiceCharge, setEditServiceCharge] = useState<number>(
    activeDoc?.serviceChargeRatePerSqmIdr || 95000
  );
  const [editDuration, setEditDuration] = useState<number>(
    activeDoc?.leaseDurationMonths || 60
  );
  const [editEscalation, setEditEscalation] = useState<number>(
    activeDoc?.annualEscalationPct || 7.5
  );

  const handleSelectAgreement = (num: string) => {
    setActiveAgreementNumber(num);
    const selected = agreements.find((a) => a.spsmNumber === num);
    if (selected) {
      setEditRate(selected.baseRentRatePerSqmIdr);
      setEditServiceCharge(selected.serviceChargeRatePerSqmIdr);
      setEditDuration(selected.leaseDurationMonths);
      setEditEscalation(selected.annualEscalationPct);
    }
  };

  const handleApplyTermChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoc) return;
    updateAgreement({
      ...activeDoc,
      baseRentRatePerSqmIdr: Number(editRate),
      serviceChargeRatePerSqmIdr: Number(editServiceCharge),
      leaseDurationMonths: Number(editDuration),
      annualEscalationPct: Number(editEscalation),
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Calculations
  const area = activeDoc?.rentableAreaSqm || 1000;
  const monthlyRent = area * (activeDoc?.baseRentRatePerSqmIdr || 320000);
  const monthlyService = area * (activeDoc?.serviceChargeRatePerSqmIdr || 95000);
  const annualTotalBase = monthlyRent * 12;
  const annualTotalService = monthlyService * 12;
  const securityDepositTotal = monthlyRent * (activeDoc?.securityDepositMonths || 3);
  const grandTotalPerYear = annualTotalBase + annualTotalService;

  const isStamped = activeDoc?.stampDutyStatus === "TERPASANG_METERAI_ELEKTRONIK";
  const isApproved = activeDoc?.bmApprovalStatus === "DISAHKAN_DIREKSI_BM";

  return (
    <div className="min-h-screen bg-[#141211] text-stone-100 font-mono pb-20 selection:bg-amber-500 selection:text-stone-950">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Toolbar (Hidden on Print) */}
        <section className="print:hidden border-4 border-stone-800 bg-[#1C1917] p-6 shadow-[6px_6px_0px_#000] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500 text-stone-950 px-2.5 py-1 text-xs font-black uppercase tracking-wider border-2 border-stone-950 mb-3">
                <FileCheck2 className="w-4 h-4" />
                SURAT PERJANJIAN SEWA MENYEWA (SPSM) // LEGAL DOKUMEN RESMI A4
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                GENERATOR KONTRAK SEWA KOMERSIAL BERSTEMPEL & E-METERAI
              </h2>
              <p className="text-xs text-stone-400 mt-2 max-w-3xl leading-relaxed">
                Penyusunan otomatis naskah perjanjian hukum sewa ruang perkantoran komersial Grade-A Menara Graha Cakrawala dengan pengesahan digital Building Management Division.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider border-2 border-stone-950 shadow-[4px_4px_0px_#000] hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                CETAK / EKSPOR PDF RESMI A4
              </button>
            </div>
          </div>

          {/* Document Switcher & Interactive State Toggles */}
          <div className="pt-4 border-t-2 border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-stone-400 font-bold uppercase">PILIH DOKUMEN TENANT:</span>
              {agreements.map((a) => (
                <button
                  key={a.spsmNumber}
                  onClick={() => handleSelectAgreement(a.spsmNumber)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                    activeDoc.spsmNumber === a.spsmNumber
                      ? "bg-amber-500 text-stone-950 border-stone-950 shadow-[2px_2px_0px_#000]"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
                  }`}
                >
                  {a.tenantName.substring(0, 22)}...
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => toggleStampDuty(activeDoc.spsmNumber)}
                className={`px-4 py-2 text-xs font-black uppercase border-2 border-stone-950 shadow-[3px_3px_0px_#000] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] transition-all ${
                  isStamped
                    ? "bg-green-600 hover:bg-green-500 text-stone-950"
                    : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                }`}
              >
                <Stamp className="w-3.5 h-3.5" />
                {isStamped ? "✓ E-METERAI TERPASANG" : "+ BUBURKAN E-METERAI 10000"}
              </button>

              <button
                onClick={() => toggleBmApproval(activeDoc.spsmNumber)}
                className={`px-4 py-2 text-xs font-black uppercase border-2 border-stone-950 shadow-[3px_3px_0px_#000] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] transition-all ${
                  isApproved
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isApproved ? "✓ SAH BERSTEMPEL BM" : "VALIDASI STEMPEL DIREKSI"}
              </button>
            </div>
          </div>
        </section>

        {/* Realtime Clause Customizer (Hidden on Print) */}
        <section className="print:hidden bg-[#1C1917] border-2 border-stone-800 p-5 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-3 text-xs text-amber-500 font-bold uppercase">
            <DollarSign className="w-4 h-4" />
            <span>KALKULASI KLAUSUL FINANSIAL REALTIME (AUTO-SYNC KE SURAT KONTRAK)</span>
          </div>

          <form onSubmit={handleApplyTermChanges} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-stone-400 uppercase font-bold mb-1">HARGA SEWA DASAR (PER M² / BULAN):</label>
              <input
                type="number"
                value={editRate}
                onChange={(e) => setEditRate(Number(e.target.value))}
                className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase font-bold mb-1">SERVICE CHARGE (PER M² / BULAN):</label>
              <input
                type="number"
                value={editServiceCharge}
                onChange={(e) => setEditServiceCharge(Number(e.target.value))}
                className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase font-bold mb-1">DURASI KONTRAK (BULAN):</label>
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(Number(e.target.value))}
                className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 border-2 border-stone-700 hover:border-amber-500 font-black uppercase tracking-wider"
              >
                PERBARUI KLAUSUL SURAT
              </button>
            </div>
          </form>
        </section>

        {/* DOCUMENT A4 PAPER CONTAINER */}
        <section className="flex justify-center">
          <div className="w-full max-w-[840px] bg-[#FAF8F5] text-stone-900 border-4 border-stone-900 shadow-[10px_10px_0px_#000] p-8 sm:p-14 font-mono relative print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white">
            {/* Top Official Letterhead */}
            <div className="border-b-4 border-stone-900 pb-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-stone-900 stroke-[2.5]" />
                    <span className="text-base sm:text-lg font-black tracking-tight uppercase">
                      PT GRAHA CAKRAWALA PROPERTINDO
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-widest">
                    BUILDING MANAGEMENT & COMMERCIAL LEASING DIVISION
                  </p>
                  <p className="text-[10px] text-stone-600 leading-tight">
                    Menara Graha Cakrawala Lantai Basement 1, Jl. Jenderal Sudirman Kav. 52-53, SCBD, Jakarta Selatan 12190
                    <br />
                    Telp: (021) 5299-8800 (Hunting) | Fax: (021) 5299-8801 | Email: legal.leasing@grahacakrawala.co.id
                  </p>
                </div>

                <div className="text-right">
                  <div className="border-2 border-stone-900 px-3 py-1 bg-stone-200 text-[10px] font-black uppercase inline-block">
                    DOKUMEN ASLI KONTRAK
                  </div>
                  <p className="text-[10px] text-stone-600 mt-1 font-bold">KODE REG: MGC-LGL-{activeDoc.tenantId}</p>
                </div>
              </div>
            </div>

            {/* Document Title Header */}
            <div className="text-center my-6 space-y-1">
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight border-b-2 border-stone-900 inline-block pb-1">
                SURAT PERJANJIAN SEWA MENYEWA RUANG KANTOR
              </h3>
              <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                NOMOR: {activeDoc.spsmNumber}
              </p>
            </div>

            {/* Preamble */}
            <div className="text-xs leading-relaxed text-stone-800 space-y-4 my-6">
              <p>
                Pada hari ini, tanggal <span className="font-bold underline">{activeDoc.signDate}</span>, bertempat di Jakarta Selatan, telah ditandatangani perjanjian sewa menyewa ruang komersial gedung bertingkat tinggi oleh dan antara para pihak:
              </p>

              <div className="bg-stone-100 border-2 border-stone-300 p-4 space-y-3 text-[11px]">
                <div>
                  <span className="font-bold block text-stone-950">1. PIHAK PERTAMA (PENGELOLA / PEMBERI SEWA):</span>
                  <p className="text-stone-700 pl-4 mt-0.5">
                    <strong>PT GRAHA CAKRAWALA PROPERTINDO</strong>, berkedudukan di Jakarta Selatan, dalam hal ini diwakili secara sah oleh <strong>{activeDoc.bmApprovedBy}</strong>, bertindak dalam jabatannya selaku Pengelola Gedung Menara Graha Cakrawala.
                  </p>
                </div>

                <div>
                  <span className="font-bold block text-stone-950">2. PIHAK KEDUA (PENYEWA / TENANT):</span>
                  <p className="text-stone-700 pl-4 mt-0.5">
                    <strong>{activeDoc.tenantName}</strong>, berkedudukan hukum di <strong>{activeDoc.companyAddress}</strong>, dalam hal ini diwakili secara sah oleh <strong>{activeDoc.directorName}</strong> selaku <strong>{activeDoc.directorTitle}</strong>.
                  </p>
                </div>
              </div>

              <p className="italic text-[11px] text-stone-600">
                Pihak Pertama dan Pihak Kedua sepakat untuk saling mengikatkan diri dalam Perjanjian Sewa Menyewa Ruang Kantor dengan syarat dan ketentuan pasal-pasal sebagai berikut:
              </p>
            </div>

            {/* Articles (Pasal-Pasal) */}
            <div className="space-y-6 text-xs text-stone-900">
              {/* Pasal 1 */}
              <div className="space-y-1.5 border-t border-stone-300 pt-3">
                <h4 className="font-black uppercase tracking-wide">PASAL 1 — OBJEK SEWA & SPESIFIKASI RUANGAN</h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  1. Pihak Pertama setuju menyewakan kepada Pihak Kedua dan Pihak Kedua setuju menyewa dari Pihak Pertama unit ruang kantor komersial yang terletak di:
                </p>
                <div className="pl-4 grid grid-cols-2 gap-2 text-[11px] bg-stone-100 p-2.5 border border-stone-300">
                  <div><strong>Gedung:</strong> Menara Graha Cakrawala</div>
                  <div><strong>Lokasi Unit:</strong> {activeDoc.suiteLocation}</div>
                  <div><strong>Tingkat Lantai:</strong> Lantai {activeDoc.floorLevel} (Zona {activeDoc.floorLevel > 15 ? "High-Rise" : "Low-Rise"})</div>
                  <div><strong>Luas Sewa Efektif:</strong> <span className="font-black text-amber-900">{area.toLocaleString("id-ID")} m² (Semi-Gross)</span></div>
                </div>
              </div>

              {/* Pasal 2 */}
              <div className="space-y-1.5 border-t border-stone-300 pt-3">
                <h4 className="font-black uppercase tracking-wide">PASAL 2 — JANGKA WAKTU SEWA (LEASE TENURE)</h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  1. Sewa menyewa ini disepakati untuk jangka waktu <strong>{activeDoc.leaseDurationMonths} ({Math.round(activeDoc.leaseDurationMonths / 12)} Tahun)</strong>, terhitung sejak Tanggal Mulai Sewa (Commencement Date) <strong>{activeDoc.commencementDate}</strong> dan berakhir pada Tanggal Berakhir Sewa <strong>{activeDoc.expirationDate}</strong>.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  2. Opsi perpanjangan sewa wajib diajukan oleh Pihak Kedua secara tertulis selambat-lambatnya 6 (enam) bulan kalender sebelum masa sewa berakhir.
                </p>
              </div>

              {/* Pasal 3 */}
              <div className="space-y-1.5 border-t border-stone-300 pt-3">
                <h4 className="font-black uppercase tracking-wide">PASAL 3 — HARGA SEWA, SERVICE CHARGE & ESKALASI</h4>
                <div className="text-[11px] space-y-1 text-stone-700">
                  <p>1. <strong>Tarif Sewa Pokok (Base Rent):</strong> Rp {activeDoc.baseRentRatePerSqmIdr.toLocaleString("id-ID")} / m² / bulan (di luar PPN 11%).</p>
                  <p>2. <strong>Tarif Pemeliharaan Gedung (Service Charge):</strong> Rp {activeDoc.serviceChargeRatePerSqmIdr.toLocaleString("id-ID")} / m² / bulan, mencakup pendingin udara (chiller) jam kerja standar 07.30 - 18.00 WIB, keamanan 24 jam, pemeliharaan lift, dan kebersihan area publik.</p>
                  <p>3. <strong>Tingkat Eskalasi Tahunan:</strong> Disepakati sebesar <strong>{activeDoc.annualEscalationPct}%</strong> terhitung sejak tahun kedua sewa.</p>
                </div>

                {/* Financial Summary Table */}
                <div className="mt-2 border-2 border-stone-800 bg-stone-50 overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-stone-200 border-b border-stone-400 font-black">
                      <tr>
                        <th className="p-2">KOMPONEN BIAYA</th>
                        <th className="p-2">PERHITUNGAN (LUAS × TARIF)</th>
                        <th className="p-2 text-right">TOTAL BULANAN</th>
                        <th className="p-2 text-right">TOTAL TAHUNAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300 font-mono">
                      <tr>
                        <td className="p-2 font-bold">Base Rental Ruangan</td>
                        <td className="p-2">{area} m² × Rp {activeDoc.baseRentRatePerSqmIdr.toLocaleString("id-ID")}</td>
                        <td className="p-2 text-right">Rp {monthlyRent.toLocaleString("id-ID")}</td>
                        <td className="p-2 text-right font-bold">Rp {annualTotalBase.toLocaleString("id-ID")}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Service Charge Gedung</td>
                        <td className="p-2">{area} m² × Rp {activeDoc.serviceChargeRatePerSqmIdr.toLocaleString("id-ID")}</td>
                        <td className="p-2 text-right">Rp {monthlyService.toLocaleString("id-ID")}</td>
                        <td className="p-2 text-right font-bold">Rp {annualTotalService.toLocaleString("id-ID")}</td>
                      </tr>
                      <tr className="bg-stone-200/80 font-black">
                        <td colSpan={3} className="p-2 text-right uppercase">TOTAL BIAYA KOMITMEN TAHUNAN (TAHUN PERTAMA):</td>
                        <td className="p-2 text-right text-stone-950 font-black">Rp {grandTotalPerYear.toLocaleString("id-ID")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pasal 4 */}
              <div className="space-y-1.5 border-t border-stone-300 pt-3">
                <h4 className="font-black uppercase tracking-wide">PASAL 4 — JAMINAN SEWA & DEPOSIT UTILITAS</h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  1. Pihak Kedua wajib menyetorkan Jaminan Sewa (Security Deposit) sebesar <strong>3 (tiga) bulan sewa pokok</strong> senilai <strong>Rp {securityDepositTotal.toLocaleString("id-ID")}</strong> beserta Jaminan Utilitas sebesar <strong>Rp {activeDoc.utilityDepositIdr.toLocaleString("id-ID")}</strong> sebelum serah terima kunci unit.
                </p>
              </div>
            </div>

            {/* DUAL SIGNATURE BLOCK & DIGITAL STAMP SECTION */}
            <div className="mt-12 pt-6 border-t-4 border-stone-900">
              <div className="grid grid-cols-2 gap-8 text-xs">
                {/* PIHAK PERTAMA */}
                <div className="flex flex-col justify-between h-48 border-2 border-dashed border-stone-400 p-4 bg-stone-50/50 relative overflow-hidden">
                  <div>
                    <span className="font-bold block uppercase text-stone-900">PIHAK PERTAMA</span>
                    <span className="text-[10px] text-stone-600 block">PT GRAHA CAKRAWALA PROPERTINDO</span>
                  </div>

                  {/* Stamp Graphic */}
                  {isApproved && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85 rotate-[-12deg]">
                      <div className="border-4 border-red-700 text-red-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-tighter text-center border-double">
                        <div className="text-[9px] tracking-widest">★ PT GRAHA CAKRAWALA PROPERTINDO ★</div>
                        <div className="text-base font-black">SAH DIVERIFIKASI</div>
                        <div className="text-[8px]">BUILDING MANAGEMENT DIVISION</div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-stone-900 pt-1 text-center">
                    <p className="font-black text-stone-950 underline">{activeDoc.bmApprovedBy.split("(")[0]}</p>
                    <p className="text-[9px] text-stone-600 font-bold uppercase">General Manager Building Management</p>
                  </div>
                </div>

                {/* PIHAK KEDUA */}
                <div className="flex flex-col justify-between h-48 border-2 border-dashed border-stone-400 p-4 bg-stone-50/50 relative overflow-hidden">
                  <div>
                    <span className="font-bold block uppercase text-stone-900">PIHAK KEDUA</span>
                    <span className="text-[10px] text-stone-600 block">{activeDoc.tenantName}</span>
                  </div>

                  {/* E-Meterai Graphic */}
                  {isStamped && (
                    <div className="absolute right-4 top-12 border-2 border-blue-800 bg-blue-50 text-blue-900 p-2 shadow-sm flex items-center gap-2 rotate-[4deg]">
                      <QrCode className="w-8 h-8 text-blue-900 stroke-[1.5]" />
                      <div className="text-left text-[8px] leading-tight font-black uppercase">
                        <div>METERAI ELEKTRONIK</div>
                        <div className="text-[10px] text-blue-700 font-black">10000</div>
                        <div>TGL: {activeDoc.signDate}</div>
                        <div className="text-[6px] text-stone-500">KEMENKEU DITJEN PAJAK</div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-stone-900 pt-1 text-center">
                    <p className="font-black text-stone-950 underline">{activeDoc.directorName}</p>
                    <p className="text-[9px] text-stone-600 font-bold uppercase">{activeDoc.directorTitle}</p>
                  </div>
                </div>
              </div>

              {/* Footer validation bar */}
              <div className="mt-8 pt-3 border-t border-stone-300 flex items-center justify-between text-[9px] text-stone-500 uppercase">
                <span>Dokumen ini dicetak melalui sistem PropFacility OS Titan #27</span>
                <span className="font-bold text-stone-800">
                  STATUS HUKUM: {isApproved && isStamped ? "TERIKAT SECARA SAH & MENGIKAT" : "DRAFT PENELAAHAN HUKUM"}
                </span>
                <span>Halaman 1 dari 1 (Dokumen Sah)</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
