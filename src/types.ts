export interface FloorReading {
  id: string;
  name: string;
  reading: number;
}

export interface BillCalculation {
  floorId: string;
  floorName: string;
  reading: number;
  billAmount: number;
  remainingBill: number;
}

export const ELECTRICITY_RATE = 8;
export const FIXED_CHARGE = 250;