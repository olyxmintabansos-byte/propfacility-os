"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ChillerUnit,
  ElevatorBank,
  TenantLease,
  WorkOrder,
  LeaseAgreement,
  BuildingFacilityKpi,
} from "@/types/facility";

interface FacilityContextType {
  chillers: ChillerUnit[];
  elevators: ElevatorBank[];
  tenants: TenantLease[];
  workOrders: WorkOrder[];
  agreements: LeaseAgreement[];
  activeAgreementNumber: string;
  setActiveAgreementNumber: (num: string) => void;
  kpis: BuildingFacilityKpi;
  toggleChiller: (chillerId: string) => void;
  cycleElevator: (elevatorId: string) => void;
  updateEscalationRate: (tenantId: string, newRate: number) => void;
  updateWorkOrderStatus: (woId: string, newStatus: WorkOrder["status"]) => void;
  addWorkOrder: (wo: Omit<WorkOrder, "id">) => void;
  updateAgreement: (agreement: LeaseAgreement) => void;
  toggleStampDuty: (spsmNumber: string) => void;
  toggleBmApproval: (spsmNumber: string) => void;
  resetFacilityData: () => void;
}

const INITIAL_CHILLERS: ChillerUnit[] = [
  {
    id: "CH-01",
    name: "CENTRIFUGAL CHILLER 01 (BASELOAD)",
    refrigerant: "R-134a Eco",
    chilledWaterTempSupplyC: 6.8,
    chilledWaterTempReturnC: 12.2,
    flowRateLps: 185,
    coolingCapacityKw: 4200,
    powerDrawKw: 680,
    copEfficiency: 6.18,
    status: "ONLINE_OPTIMAL",
  },
  {
    id: "CH-02",
    name: "CENTRIFUGAL CHILLER 02 (PEAK LOADER)",
    refrigerant: "R-134a Eco",
    chilledWaterTempSupplyC: 7.1,
    chilledWaterTempReturnC: 12.8,
    flowRateLps: 172,
    coolingCapacityKw: 3850,
    powerDrawKw: 645,
    copEfficiency: 5.97,
    status: "ONLINE_OPTIMAL",
  },
  {
    id: "CH-03",
    name: "SCREW CHILLER 03 (NIGHT & SERVER POD)",
    refrigerant: "R-513A Low GWP",
    chilledWaterTempSupplyC: 7.0,
    chilledWaterTempReturnC: 11.5,
    flowRateLps: 92,
    coolingCapacityKw: 1850,
    powerDrawKw: 310,
    copEfficiency: 5.96,
    status: "STANDBY_READY",
  },
];

const INITIAL_ELEVATORS: ElevatorBank[] = [
  {
    id: "LIFT-A1",
    liftCode: "ELEVATOR A1 (PASSENGER)",
    zone: "HIGH_RISE (16-45)",
    currentFloor: 38,
    direction: "UP",
    loadWeightKg: 680,
    maxCapacityKg: 1600,
    doorStatus: "CLOSED",
  },
  {
    id: "LIFT-A2",
    liftCode: "ELEVATOR A2 (PASSENGER)",
    zone: "HIGH_RISE (16-45)",
    currentFloor: 21,
    direction: "DOWN",
    loadWeightKg: 920,
    maxCapacityKg: 1600,
    doorStatus: "CLOSED",
  },
  {
    id: "LIFT-B1",
    liftCode: "ELEVATOR B1 (PASSENGER)",
    zone: "LOW_RISE (GF-15)",
    currentFloor: 7,
    direction: "UP",
    loadWeightKg: 450,
    maxCapacityKg: 1600,
    doorStatus: "OPEN",
  },
  {
    id: "LIFT-SVC",
    liftCode: "SERVICE LIFT S1 (HEAVY FREIGHT)",
    zone: "SERVICE_LIFT",
    currentFloor: 1,
    direction: "IDLE",
    loadWeightKg: 120,
    maxCapacityKg: 2500,
    doorStatus: "CLOSED",
  },
];

const INITIAL_TENANTS: TenantLease[] = [
  {
    id: "TNT-01",
    companyName: "PT Standard FinTech Global",
    industry: "FINANCIAL SERVICES",
    floorLevel: 32,
    suiteNumber: "STE-3201",
    rentableAreaSqm: 1450,
    monthlyRentalRatePerSqmIdr: 320000,
    monthlyTotalRentIdr: 464000000,
    annualEscalationRatePct: 7.5,
    leaseStartDate: "01 Jan 2024",
    leaseExpiryDate: "31 Des 2028",
    paymentStatus: "CURRENT_PAID",
  },
  {
    id: "TNT-02",
    companyName: "McKinsey Legal & Partners Indonesia",
    industry: "CORPORATE LAW",
    floorLevel: 28,
    suiteNumber: "STE-2801",
    rentableAreaSqm: 1100,
    monthlyRentalRatePerSqmIdr: 310000,
    monthlyTotalRentIdr: 341000000,
    annualEscalationRatePct: 8.0,
    leaseStartDate: "15 Mar 2023",
    leaseExpiryDate: "14 Mar 2027",
    paymentStatus: "CURRENT_PAID",
  },
  {
    id: "TNT-03",
    companyName: "CloudScale Software APAC Pte Ltd",
    industry: "TECH & DATA CENTER",
    floorLevel: 22,
    suiteNumber: "STE-2204",
    rentableAreaSqm: 980,
    monthlyRentalRatePerSqmIdr: 295000,
    monthlyTotalRentIdr: 289100000,
    annualEscalationRatePct: 6.0,
    leaseStartDate: "01 Jul 2025",
    leaseExpiryDate: "30 Jun 2029",
    paymentStatus: "PENDING_INVOICE",
  },
  {
    id: "TNT-04",
    companyName: "Boutique Creative Agency Nexus",
    industry: "DIGITAL MARKETING",
    floorLevel: 11,
    suiteNumber: "STE-1102",
    rentableAreaSqm: 560,
    monthlyRentalRatePerSqmIdr: 260000,
    monthlyTotalRentIdr: 145600000,
    annualEscalationRatePct: 6.5,
    leaseStartDate: "01 Feb 2025",
    leaseExpiryDate: "31 Jan 2027",
    paymentStatus: "OVERDUE_NOTICE",
  },
];

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-2026-088",
    equipmentCode: "CH-01",
    equipmentCategory: "HVAC / CHILLER",
    priority: "CRITICAL_P1",
    title: "Condenser Tube Mechanical Descaling & Eddycurent Test",
    description: "Pembersihan kerak fouling kondensor unit chiller 01 dan pengujian non-destructive eddy current pada 480 tubes tembaga untuk mitigasi pitting korosi.",
    assignedVendor: "PT Daikin Airconditioning Engineering",
    status: "IN_PROGRESS",
    scheduledDate: "2026-09-28",
    slaHoursRemaining: 18,
    costEstimateIdr: 45000000,
  },
  {
    id: "WO-2026-089",
    equipmentCode: "LIFT-A2",
    equipmentCategory: "VERTICAL TRANSPORT",
    priority: "HIGH_P2",
    title: "Overspeed Governor Recalibration & Safety Brake Pad Replacement",
    description: "Kalibrasi sensor overspeed governor dan penggantian lining kampas rem hidrolik hoist machine elevator A2 pasca 150.000 siklus operasional.",
    assignedVendor: "PT Schindler Lift Indonesia Divisi High-Rise",
    status: "OPEN_SCHEDULED",
    scheduledDate: "2026-09-30",
    slaHoursRemaining: 44,
    costEstimateIdr: 32500000,
  },
  {
    id: "WO-2026-090",
    equipmentCode: "TRAFO-HV-02",
    equipmentCategory: "ELECTRICAL / GENSET",
    priority: "MEDIUM_P3",
    title: "Insulating Oil Dielectric Breakdown Test & Dissolved Gas Analysis (DGA)",
    description: "Sampling minyak trafo 20 kV / 2.500 kVA sisi gardu distribusi basement B2 guna verifikasi tegangan tembus > 50 kV/2.5mm dan screening gas hidrokarbon.",
    assignedVendor: "Laboratorium Pengujian PLN Enjiniring",
    status: "COMPLETED_VERIFIED",
    scheduledDate: "2026-09-22",
    slaHoursRemaining: 0,
    costEstimateIdr: 18000000,
  },
  {
    id: "WO-2026-091",
    equipmentCode: "STP-BLOWER-01",
    equipmentCategory: "PLUMBING & STP",
    priority: "ROUTINE_P4",
    title: "Aeration Roots Blower Bearing Greasing & Intake Air Filter Cleaning",
    description: "Perawatan berkala STP aerobik 600 m3/hari: pelumasan bearing suhu tinggi synthetic ISO VG 220 dan pembersihan filter hisap blower kompresi.",
    assignedVendor: "Internal Facility Mechanical Team MGC",
    status: "OPEN_SCHEDULED",
    scheduledDate: "2026-10-02",
    slaHoursRemaining: 120,
    costEstimateIdr: 4800000,
  },
  {
    id: "WO-2026-092",
    equipmentCode: "AHU-L32",
    equipmentCategory: "HVAC / CHILLER",
    priority: "HIGH_P2",
    title: "VAV Damper Actuator Replacement & Static Pressure Tuning",
    description: "Penggantian modul actuator Belimo 24V pada zona eksekutif lantai 32 dan penyeimbangan static pressure plenum ruang rapat utama.",
    assignedVendor: "PT Graha Mekanikal Solusindo",
    status: "WAITING_PARTS",
    scheduledDate: "2026-10-04",
    slaHoursRemaining: 72,
    costEstimateIdr: 14200000,
  },
];

const INITIAL_AGREEMENTS: LeaseAgreement[] = [
  {
    spsmNumber: "048/SPSM-MGC/III/2026",
    tenantId: "TNT-01",
    tenantName: "PT Standard FinTech Global",
    directorName: "Hendrawan Suryaputra, S.E., MBA",
    directorTitle: "Direktur Utama",
    companyAddress: "Gedung Menara Graha Cakrawala Lantai 32 Suite 3201, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    suiteLocation: "Lantai 32, Unit Seluruh Sayap Timur (Suite 3201)",
    floorLevel: 32,
    rentableAreaSqm: 1450,
    baseRentRatePerSqmIdr: 320000,
    serviceChargeRatePerSqmIdr: 95000,
    leaseDurationMonths: 60,
    commencementDate: "01 Januari 2024",
    expirationDate: "31 Desember 2028",
    securityDepositMonths: 3,
    utilityDepositIdr: 150000000,
    annualEscalationPct: 7.5,
    stampDutyStatus: "TERPASANG_METERAI_ELEKTRONIK",
    bmApprovalStatus: "DISAHKAN_DIREKSI_BM",
    bmApprovedBy: "Ir. Bambang Trihatmojo, M.Eng (General Manager Building)",
    signDate: "20 Desember 2023",
  },
  {
    spsmNumber: "072/SPSM-MGC/IX/2025",
    tenantId: "TNT-02",
    tenantName: "McKinsey Legal & Partners Indonesia",
    directorName: "Rachmat Budiman, S.H., LL.M.",
    directorTitle: "Managing Senior Partner",
    companyAddress: "Gedung Menara Graha Cakrawala Lantai 28 Suite 2801, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    suiteLocation: "Lantai 28, Penthouse Office Suite 2801",
    floorLevel: 28,
    rentableAreaSqm: 1100,
    baseRentRatePerSqmIdr: 310000,
    serviceChargeRatePerSqmIdr: 95000,
    leaseDurationMonths: 48,
    commencementDate: "15 Maret 2023",
    expirationDate: "14 Maret 2027",
    securityDepositMonths: 3,
    utilityDepositIdr: 120000000,
    annualEscalationPct: 8.0,
    stampDutyStatus: "TERPASANG_METERAI_ELEKTRONIK",
    bmApprovalStatus: "DISAHKAN_DIREKSI_BM",
    bmApprovedBy: "Ir. Bambang Trihatmojo, M.Eng (General Manager Building)",
    signDate: "01 Maret 2023",
  },
  {
    spsmNumber: "105/SPSM-MGC/VI/2025",
    tenantId: "TNT-03",
    tenantName: "CloudScale Software APAC Pte Ltd",
    directorName: "Alvin Tan Wei Liang",
    directorTitle: "Regional Managing Director",
    companyAddress: "Gedung Menara Graha Cakrawala Lantai 22 Suite 2204, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    suiteLocation: "Lantai 22, Server & Tech Wing Suite 2204",
    floorLevel: 22,
    rentableAreaSqm: 980,
    baseRentRatePerSqmIdr: 295000,
    serviceChargeRatePerSqmIdr: 95000,
    leaseDurationMonths: 48,
    commencementDate: "01 Juli 2025",
    expirationDate: "30 Juni 2029",
    securityDepositMonths: 3,
    utilityDepositIdr: 200000000,
    annualEscalationPct: 6.0,
    stampDutyStatus: "TERPASANG_METERAI_ELEKTRONIK",
    bmApprovalStatus: "DRAFT_REVIEW",
    bmApprovedBy: "Ir. Bambang Trihatmojo, M.Eng (General Manager Building)",
    signDate: "18 Juni 2025",
  },
];

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export function FacilityProvider({ children }: { children: React.ReactNode }) {
  const [chillers, setChillers] = useState<ChillerUnit[]>(INITIAL_CHILLERS);
  const [elevators, setElevators] = useState<ElevatorBank[]>(INITIAL_ELEVATORS);
  const [tenants, setTenants] = useState<TenantLease[]>(INITIAL_TENANTS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [agreements, setAgreements] = useState<LeaseAgreement[]>(INITIAL_AGREEMENTS);
  const [activeAgreementNumber, setActiveAgreementNumber] = useState<string>("048/SPSM-MGC/III/2026");

  useEffect(() => {
    try {
      const savedChillers = localStorage.getItem("propfacility_chillers");
      const savedLifts = localStorage.getItem("propfacility_elevators");
      const savedTenants = localStorage.getItem("propfacility_tenants");
      const savedWOs = localStorage.getItem("propfacility_workorders");
      const savedAgreements = localStorage.getItem("propfacility_agreements");

      if (savedChillers) setChillers(JSON.parse(savedChillers));
      if (savedLifts) setElevators(JSON.parse(savedLifts));
      if (savedTenants) setTenants(JSON.parse(savedTenants));
      if (savedWOs) setWorkOrders(JSON.parse(savedWOs));
      if (savedAgreements) setAgreements(JSON.parse(savedAgreements));
    } catch {
      // fallback to initial
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("propfacility_chillers", JSON.stringify(chillers));
      localStorage.setItem("propfacility_elevators", JSON.stringify(elevators));
      localStorage.setItem("propfacility_tenants", JSON.stringify(tenants));
      localStorage.setItem("propfacility_workorders", JSON.stringify(workOrders));
      localStorage.setItem("propfacility_agreements", JSON.stringify(agreements));
    } catch {
      // ignore
    }
  }, [chillers, elevators, tenants, workOrders, agreements]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElevators((prev) =>
        prev.map((l) => {
          if (l.direction === "IDLE") return l;
          let nextFloor = l.direction === "UP" ? l.currentFloor + 1 : l.currentFloor - 1;
          let nextDir = l.direction;
          if (nextFloor >= 45) {
            nextFloor = 45;
            nextDir = "DOWN";
          } else if (nextFloor <= 1) {
            nextFloor = 1;
            nextDir = "UP";
          }
          return {
            ...l,
            currentFloor: nextFloor,
            direction: nextDir,
          };
        })
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleChiller = (chillerId: string) => {
    setChillers((prev) =>
      prev.map((c) => {
        if (c.id !== chillerId) return c;
        const newStatus = c.status === "ONLINE_OPTIMAL" ? "STANDBY_READY" : "ONLINE_OPTIMAL";
        return { ...c, status: newStatus };
      })
    );
  };

  const cycleElevator = (elevatorId: string) => {
    setElevators((prev) =>
      prev.map((l) => {
        if (l.id !== elevatorId) return l;
        const nextDoor = l.doorStatus === "CLOSED" ? "OPEN" : "CLOSED";
        return { ...l, doorStatus: nextDoor };
      })
    );
  };

  const updateEscalationRate = (tenantId: string, newRate: number) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, annualEscalationRatePct: newRate } : t))
    );
  };

  const updateWorkOrderStatus = (woId: string, newStatus: WorkOrder["status"]) => {
    setWorkOrders((prev) =>
      prev.map((w) => (w.id === woId ? { ...w, status: newStatus } : w))
    );
  };

  const addWorkOrder = (wo: Omit<WorkOrder, "id">) => {
    const newId = `WO-2026-${String(workOrders.length + 90).padStart(3, "0")}`;
    const newRecord: WorkOrder = { ...wo, id: newId };
    setWorkOrders((prev) => [newRecord, ...prev]);
  };

  const updateAgreement = (updated: LeaseAgreement) => {
    setAgreements((prev) =>
      prev.map((a) => (a.spsmNumber === updated.spsmNumber ? updated : a))
    );
  };

  const toggleStampDuty = (spsmNumber: string) => {
    setAgreements((prev) =>
      prev.map((a) => {
        if (a.spsmNumber !== spsmNumber) return a;
        const next =
          a.stampDutyStatus === "TERPASANG_METERAI_ELEKTRONIK"
            ? "BELUM_METERAI"
            : "TERPASANG_METERAI_ELEKTRONIK";
        return { ...a, stampDutyStatus: next };
      })
    );
  };

  const toggleBmApproval = (spsmNumber: string) => {
    setAgreements((prev) =>
      prev.map((a) => {
        if (a.spsmNumber !== spsmNumber) return a;
        const next =
          a.bmApprovalStatus === "DISAHKAN_DIREKSI_BM"
            ? "DRAFT_REVIEW"
            : "DISAHKAN_DIREKSI_BM";
        return { ...a, bmApprovalStatus: next };
      })
    );
  };

  const resetFacilityData = () => {
    setChillers(INITIAL_CHILLERS);
    setElevators(INITIAL_ELEVATORS);
    setTenants(INITIAL_TENANTS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setAgreements(INITIAL_AGREEMENTS);
    setActiveAgreementNumber("048/SPSM-MGC/III/2026");
    localStorage.removeItem("propfacility_chillers");
    localStorage.removeItem("propfacility_elevators");
    localStorage.removeItem("propfacility_tenants");
    localStorage.removeItem("propfacility_workorders");
    localStorage.removeItem("propfacility_agreements");
  };

  const totalLeased = tenants.reduce((acc, t) => acc + t.rentableAreaSqm, 0);
  const totalBuildingArea = 48000;
  const occupancyPct = Math.round((totalLeased / totalBuildingArea) * 1000) / 10;

  const kpis: BuildingFacilityKpi = {
    totalOccupancyRatePct: occupancyPct,
    totalLeasedAreaSqm: totalLeased,
    totalBuildingAreaSqm: totalBuildingArea,
    dailyChillerEnergyKwh: 14850,
    elevatorTripsToday: 2840,
    overallBasHealthScore: 98.4,
  };

  return (
    <FacilityContext.Provider
      value={{
        chillers,
        elevators,
        tenants,
        workOrders,
        agreements,
        activeAgreementNumber,
        setActiveAgreementNumber,
        kpis,
        toggleChiller,
        cycleElevator,
        updateEscalationRate,
        updateWorkOrderStatus,
        addWorkOrder,
        updateAgreement,
        toggleStampDuty,
        toggleBmApproval,
        resetFacilityData,
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacility() {
  const context = useContext(FacilityContext);
  if (!context) {
    throw new Error("useFacility must be used within a FacilityProvider");
  }
  return context;
}