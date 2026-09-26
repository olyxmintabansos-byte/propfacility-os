"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useFacility } from "@/context/FacilityContext";
import { WorkOrder } from "@/types/facility";
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PlusCircle,
  Building,
  Filter,
  ShieldAlert,
  HardHat,
  Search,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function MaintenancePage() {
  const { workOrders, updateWorkOrderStatus, addWorkOrder } = useFacility();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New WO Modal / inline form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEquipmentCode, setNewEquipmentCode] = useState("CH-02");
  const [newCategory, setNewCategory] = useState<WorkOrder["equipmentCategory"]>("HVAC / CHILLER");
  const [newPriority, setNewPriority] = useState<WorkOrder["priority"]>("HIGH_P2");
  const [newVendor, setNewVendor] = useState("Internal Facility Mechanical Team MGC");
  const [newCost, setNewCost] = useState(15000000);
  const [newDescription, setNewDescription] = useState("");

  const filteredOrders = workOrders.filter((wo) => {
    const matchCat = categoryFilter === "ALL" || wo.equipmentCategory === categoryFilter;
    const matchStatus = statusFilter === "ALL" || wo.status === statusFilter;
    const matchSearch =
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.assignedVendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addWorkOrder({
      equipmentCode: newEquipmentCode,
      equipmentCategory: newCategory,
      priority: newPriority,
      title: newTitle,
      description: newDescription || "Pemeriksaan rutin sesuai SOP manual fasilitas gedung.",
      assignedVendor: newVendor,
      status: "OPEN_SCHEDULED",
      scheduledDate: new Date().toISOString().split("T")[0],
      slaHoursRemaining: newPriority === "CRITICAL_P1" ? 12 : newPriority === "HIGH_P2" ? 36 : 72,
      costEstimateIdr: Number(newCost) || 5000000,
    });

    setNewTitle("");
    setNewDescription("");
    setShowAddForm(false);
  };

  const totalCostEstimate = workOrders.reduce((sum, wo) => sum + wo.costEstimateIdr, 0);
  const openWOCount = workOrders.filter((wo) => wo.status !== "COMPLETED_VERIFIED").length;
  const criticalCount = workOrders.filter((wo) => wo.priority === "CRITICAL_P1" && wo.status !== "COMPLETED_VERIFIED").length;

  return (
    <div className="min-h-screen bg-[#141211] text-stone-100 font-mono pb-20 selection:bg-amber-500 selection:text-stone-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Banner */}
        <section className="border-4 border-stone-800 bg-[#1C1917] p-6 shadow-[6px_6px_0px_#000] relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500 text-stone-950 px-2.5 py-1 text-xs font-black uppercase tracking-wider border-2 border-stone-950 mb-3">
                <Wrench className="w-4 h-4" />
                PREVENTIVE & CORRECTIVE MAINTENANCE WORK ORDERS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                JADWAL PEMELIHARAAN ALAT & LOG SERVIS MEKANIKAL
              </h2>
              <p className="text-xs text-stone-400 mt-2 max-w-3xl leading-relaxed">
                Manajemen Service Level Agreement (SLA) Chiller Centrifugal, Lift Kecepatan Tinggi 4 m/s, Gardu Trafo 20 kV, dan Sistem Pengolahan Limbah Cair STP Menara Graha Cakrawala.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider border-2 border-stone-950 shadow-[4px_4px_0px_#000] hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] transition-all self-start lg:self-auto"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              {showAddForm ? "TUTUP FORM WORK ORDER" : "+ BUAT WORK ORDER BARU"}
            </button>
          </div>
        </section>

        {/* Top Metric Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1F1C1A] border-2 border-stone-800 p-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="uppercase font-bold tracking-wider">TOTAL WORK ORDER AKTIF</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-3xl font-black text-white">{openWOCount} <span className="text-xs text-stone-400 font-normal">/ {workOrders.length} TIKET</span></div>
            <div className="mt-2 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {workOrders.length - openWOCount} TIKET TERVERIFIKASI SELESAI
            </div>
          </div>

          <div className="bg-[#1F1C1A] border-2 border-stone-800 p-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="uppercase font-bold tracking-wider">TIKET KRITIKAL P1</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-2 text-3xl font-black text-red-400">{criticalCount} <span className="text-xs text-stone-400 font-normal">TIKET BERJALAN</span></div>
            <div className="mt-2 text-[10px] text-red-400/80 font-bold uppercase tracking-wider">
              {criticalCount > 0 ? "RESPONS SEGERA < 12 JAM DIPERLUKAN" : "TIDAK ADA INSIDEN KRITIKAL"}
            </div>
          </div>

          <div className="bg-[#1F1C1A] border-2 border-stone-800 p-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="uppercase font-bold tracking-wider">ESTIMASI BIAYA BULANAN</span>
              <Building className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-black text-white">
              Rp {(totalCostEstimate / 1000000).toFixed(1)} <span className="text-xs text-stone-400 font-normal">JUTA</span>
            </div>
            <div className="mt-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
              ALOKASI SINKING FUND FACILITY
            </div>
          </div>

          <div className="bg-[#1F1C1A] border-2 border-stone-800 p-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span className="uppercase font-bold tracking-wider">SLA COMPLIANCE SCORE</span>
              <ShieldAlert className="w-4 h-4 text-green-500" />
            </div>
            <div className="mt-2 text-3xl font-black text-green-400">96.8%</div>
            <div className="mt-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
              TERHADAP STANDAR AUDIT ISO 55001
            </div>
          </div>
        </section>

        {/* Collapsible Form for New Work Order */}
        {showAddForm && (
          <section className="bg-[#1C1917] border-4 border-amber-500 p-6 shadow-[6px_6px_0px_#000] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-stone-800 pb-3">
              <HardHat className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-white uppercase">INPUT WORK ORDER MEKANIKAL & ELEKTRIKAL BARU</h3>
            </div>

            <form onSubmit={handleCreateWO} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">KODE PERALATAN / UNIT:</label>
                  <input
                    type="text"
                    value={newEquipmentCode}
                    onChange={(e) => setNewEquipmentCode(e.target.value)}
                    placeholder="Contoh: CH-02, LIFT-B1, GENSET-01"
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">KATEGORI SISTEM:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as WorkOrder["equipmentCategory"])}
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="HVAC / CHILLER">HVAC / CHILLER</option>
                    <option value="VERTICAL TRANSPORT">VERTICAL TRANSPORT</option>
                    <option value="ELECTRICAL / GENSET">ELECTRICAL / GENSET</option>
                    <option value="PLUMBING & STP">PLUMBING & STP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">PRIORITAS TIKET (SLA):</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as WorkOrder["priority"])}
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="CRITICAL_P1">CRITICAL P1 (Max 12 Jam)</option>
                    <option value="HIGH_P2">HIGH P2 (Max 36 Jam)</option>
                    <option value="MEDIUM_P3">MEDIUM P3 (Max 72 Jam)</option>
                    <option value="ROUTINE_P4">ROUTINE P4 (Max 7 Hari)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">JUDUL PEKERJAAN (WORK ORDER):</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Overhaul Bearing Chiller 02 & Kalibrasi Sensor Thermistor"
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">VENDOR REKANAN / PELAKSANA:</label>
                  <input
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="Contoh: PT Daikin Engineering / Tim Internal MGC"
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">ESTIMASI BIAYA MATERIAL & JASA (IDR):</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-bold mb-1">CATATAN SCOPE OF WORK / GEJALA KERUSAKAN:</label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Deskripsikan temuan inspeksi teknisi lapangan..."
                    className="w-full bg-[#141211] border-2 border-stone-700 px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border-2 border-stone-700 text-stone-400 hover:text-white uppercase font-bold tracking-wider"
                >
                  BATALKAN
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 text-stone-950 border-2 border-stone-950 font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:bg-amber-400"
                >
                  SIMPAN & TERBITKAN WORK ORDER
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Filter Controls Strip */}
        <section className="bg-[#1C1917] border-2 border-stone-800 p-4 shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-bold uppercase">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>KATEGORI:</span>
            </div>
            {["ALL", "HVAC / CHILLER", "VERTICAL TRANSPORT", "ELECTRICAL / GENSET", "PLUMBING & STP"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase border-2 transition-all ${
                  categoryFilter === cat
                    ? "bg-amber-500 text-stone-950 border-stone-950 shadow-[2px_2px_0px_#000]"
                    : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID, Unit, Vendor..."
                className="bg-[#141211] border-2 border-stone-700 pl-8 pr-3 py-1.5 text-xs text-white font-mono outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#141211] border-2 border-stone-700 px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-amber-500"
            >
              <option value="ALL">SEMUA STATUS</option>
              <option value="OPEN_SCHEDULED">TERJADWAL (OPEN)</option>
              <option value="IN_PROGRESS">SEDANG DIKERJAKAN</option>
              <option value="WAITING_PARTS">MENUNGGU SPAREPART</option>
              <option value="COMPLETED_VERIFIED">SELESAI TERVERIFIKASI</option>
            </select>
          </div>
        </section>

        {/* Work Order Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400 font-bold uppercase">
            <span>DAFTAR WORK ORDER ({filteredOrders.length} DITEMUKAN)</span>
            <span>KLIK TOMBOL STATUS UNTUK MEMPERBARUI PROGRES TEKNIS</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((wo) => {
              const isP1 = wo.priority === "CRITICAL_P1";
              const isP2 = wo.priority === "HIGH_P2";
              const isCompleted = wo.status === "COMPLETED_VERIFIED";

              return (
                <div
                  key={wo.id}
                  className={`border-4 bg-[#1C1917] p-5 shadow-[4px_4px_0px_#000] transition-all ${
                    isCompleted
                      ? "border-stone-800 opacity-75"
                      : isP1
                      ? "border-red-600 bg-red-950/20"
                      : isP2
                      ? "border-amber-500"
                      : "border-stone-800"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-stone-950 border border-stone-700 text-amber-400 px-2 py-0.5 text-xs font-black">
                          {wo.id}
                        </span>
                        <span className="bg-stone-800 border border-stone-700 text-stone-300 px-2 py-0.5 text-xs font-bold">
                          UNIT: {wo.equipmentCode}
                        </span>
                        <span className="bg-stone-800/80 border border-stone-700 text-stone-400 px-2 py-0.5 text-xs font-medium">
                          {wo.equipmentCategory}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-xs font-black uppercase border ${
                            wo.priority === "CRITICAL_P1"
                              ? "bg-red-600 text-white border-red-800"
                              : wo.priority === "HIGH_P2"
                              ? "bg-amber-500 text-stone-950 border-amber-700"
                              : "bg-stone-800 text-stone-300 border-stone-700"
                          }`}
                        >
                          {wo.priority.replace("_", " ")}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-xs font-bold uppercase border ${
                            wo.status === "COMPLETED_VERIFIED"
                              ? "bg-green-950 text-green-400 border-green-700"
                              : wo.status === "IN_PROGRESS"
                              ? "bg-amber-950 text-amber-400 border-amber-700 animate-pulse"
                              : wo.status === "WAITING_PARTS"
                              ? "bg-stone-900 text-amber-500 border-stone-700"
                              : "bg-stone-800 text-stone-300 border-stone-700"
                          }`}
                        >
                          STATUS: {wo.status.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-white uppercase">{wo.title}</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">{wo.description}</p>

                      <div className="flex flex-wrap items-center gap-6 pt-2 text-xs border-t border-stone-800/80 text-stone-400">
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase">VENDOR / REKANAN:</span>
                          <span className="font-bold text-stone-200">{wo.assignedVendor}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase">JADWAL TANGGAL:</span>
                          <span className="font-bold text-stone-200">{wo.scheduledDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase">SISA WAKTU SLA:</span>
                          <span className={`font-black flex items-center gap-1 ${wo.slaHoursRemaining <= 24 && !isCompleted ? "text-red-400" : "text-stone-300"}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {isCompleted ? "SELESAI ON-TIME" : `${wo.slaHoursRemaining} Jam`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase">ESTIMASI BIAYA:</span>
                          <span className="font-black text-amber-400">Rp {wo.costEstimateIdr.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick State Toggle Buttons */}
                    <div className="flex lg:flex-col items-center gap-2 self-end lg:self-center border-t lg:border-t-0 lg:border-l-2 border-stone-800 pt-3 lg:pt-0 lg:pl-4">
                      <span className="text-[10px] text-stone-500 uppercase font-bold hidden lg:block">UPDATE STATUS:</span>

                      {wo.status !== "IN_PROGRESS" && !isCompleted && (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.id, "IN_PROGRESS")}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-[10px] uppercase border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
                        >
                          KERJAKAN SEKARANG
                        </button>
                      )}

                      {wo.status !== "WAITING_PARTS" && !isCompleted && (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.id, "WAITING_PARTS")}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-[10px] uppercase border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
                        >
                          TUNGGU PART
                        </button>
                      )}

                      {!isCompleted ? (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.id, "COMPLETED_VERIFIED")}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-stone-950 font-black text-[10px] uppercase border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIKASI SELESAI
                        </button>
                      ) : (
                        <button
                          onClick={() => updateWorkOrderStatus(wo.id, "OPEN_SCHEDULED")}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 font-bold text-[10px] uppercase border-2 border-stone-950"
                        >
                          BUKA KEMBALI
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
