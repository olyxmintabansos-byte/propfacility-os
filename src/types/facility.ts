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

export interface WorkOrder {
  id: string;
  equipmentCode: string;
  equipmentCategory: "HVAC / CHILLER" | "VERTICAL TRANSPORT" | "ELECTRICAL / GENSET" | "PLUMBING & STP";
  priority: "CRITICAL_P1" | "HIGH_P2" | "MEDIUM_P3" | "ROUTINE_P4";
  title: string;
  description: string;
  assignedVendor: string;
  status: "OPEN_SCHEDULED" | "IN_PROGRESS" | "WAITING_PARTS" | "COMPLETED_VERIFIED";
  scheduledDate: string;
  slaHoursRemaining: number;
  costEstimateIdr: number;
}

export interface LeaseAgreement {
  spsmNumber: string;
  tenantId: string;
  tenantName: string;
  directorName: string;
  directorTitle: string;
  companyAddress: string;
  suiteLocation: string;
  floorLevel: number;
  rentableAreaSqm: number;
  baseRentRatePerSqmIdr: number;
  serviceChargeRatePerSqmIdr: number;
  leaseDurationMonths: number;
  commencementDate: string;
  expirationDate: string;
  securityDepositMonths: number;
  utilityDepositIdr: number;
  annualEscalationPct: number;
  stampDutyStatus: "TERPASANG_METERAI_ELEKTRONIK" | "BELUM_METERAI";
  bmApprovalStatus: "DISAHKAN_DIREKSI_BM" | "DRAFT_REVIEW";
  bmApprovedBy: string;
  signDate: string;
}

export interface BuildingFacilityKpi {
  totalOccupancyRatePct: number;
  totalLeasedAreaSqm: number;
  totalBuildingAreaSqm: number;
  dailyChillerEnergyKwh: number;
  elevatorTripsToday: number;
  overallBasHealthScore: number;
}