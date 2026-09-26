"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ChillerUnit,
  ElevatorBank,
  TenantLease,
  BuildingFacilityKpi,
} from "@/types/facility";

interface FacilityContextType {
  chillers: ChillerUnit[];
  elevators: ElevatorBank[];
  tenants: TenantLease[];
  kpis: BuildingFacilityKpi;
  toggleChiller: (chillerId: string) => void;
  cycleElevator: (elevatorId: string) => void;
  updateEscalationRate: (tenantId: string, newRate: number) => void;
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

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export function FacilityProvider({ children }: { children: React.ReactNode }) {
  const [chillers, setChillers] = useState<ChillerUnit[]>(INITIAL_CHILLERS);
  const [elevators, setElevators] = useState<ElevatorBank[]>(INITIAL_ELEVATORS);
  const [tenants, setTenants] = useState<TenantLease[]>(INITIAL_TENANTS);

  useEffect(() => {
    try {
      const savedChillers = localStorage.getItem("propfacility_chillers");
      const savedLifts = localStorage.getItem("propfacility_elevators");
      const savedTenants = localStorage.getItem("propfacility_tenants");
      if (savedChillers) setChillers(JSON.parse(savedChillers));
      if (savedLifts) setElevators(JSON.parse(savedLifts));
      if (savedTenants) setTenants(JSON.parse(savedTenants));
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("propfacility_chillers", JSON.stringify(chillers));
      localStorage.setItem("propfacility_elevators", JSON.stringify(elevators));
      localStorage.setItem("propfacility_tenants", JSON.stringify(tenants));
    } catch {
      // ignore
    }
  }, [chillers, elevators, tenants]);

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

  const resetFacilityData = () => {
    setChillers(INITIAL_CHILLERS);
    setElevators(INITIAL_ELEVATORS);
    setTenants(INITIAL_TENANTS);
    localStorage.removeItem("propfacility_chillers");
    localStorage.removeItem("propfacility_elevators");
    localStorage.removeItem("propfacility_tenants");
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
        kpis,
        toggleChiller,
        cycleElevator,
        updateEscalationRate,
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