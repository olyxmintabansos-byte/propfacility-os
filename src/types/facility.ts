export interface ChillerUnit {
  id: string;
  name: string;
  refrigerant: string;
  chilledWaterTempSupplyC: number;
  chilledWaterTempReturnC: number;
  flowRateLps: number;
  coolingCapacityKw: number;
  powerDrawKw: number;
  copEfficiency: number;
  status: "ONLINE_OPTIMAL" | "PEAK_DEMAND" | "STANDBY_READY" | "MAINTENANCE_REQUIRED";
}

export interface ElevatorBank {
  id: string;
  liftCode: string;
  zone: "LOW_RISE (GF-15)" | "HIGH_RISE (16-45)" | "SERVICE_LIFT";
  currentFloor: number;
  direction: "UP" | "DOWN" | "IDLE";
  loadWeightKg: number;
  maxCapacityKg: number;
  doorStatus: "CLOSED" | "OPEN" | "TRANSIT";
}

export interface TenantLease {
  id: string;
  companyName: string;
  industry: string;
  floorLevel: number;
  suiteNumber: string;
  rentableAreaSqm: number;
  monthlyRentalRatePerSqmIdr: number;
  monthlyTotalRentIdr: number;
  annualEscalationRatePct: number;
  leaseStartDate: string;
  leaseExpiryDate: string;
  paymentStatus: "CURRENT_PAID" | "PENDING_INVOICE" | "OVERDUE_NOTICE";
}

export interface BuildingFacilityKpi {
  totalOccupancyRatePct: number;
  totalLeasedAreaSqm: number;
  totalBuildingAreaSqm: number;
  dailyChillerEnergyKwh: number;
  elevatorTripsToday: number;
  overallBasHealthScore: number;
}