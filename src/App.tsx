import React, { useState, useCallback, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { ReadingInput } from './components/ReadingInput';
import { BillSummary } from './components/BillSummary';
import type { FloorReading, BillCalculation } from './types';
import { ELECTRICITY_RATE, FIXED_CHARGE } from './types';

function App() {
  const [mainReading, setMainReading] = useState<number>(0);
  const [netBill, setNetBill] = useState<number>(0);
  const [floorReadings, setFloorReadings] = useState<FloorReading[]>([
    { id: '1', name: 'First Floor', reading: 0 },
    { id: '2', name: 'Ground Floor', reading: 0 },
  ]);

  const handleFloorReadingChange = useCallback((id: string, value: number) => {
    setFloorReadings(prev =>
      prev.map(floor =>
        floor.id === id ? { ...floor, reading: value } : floor
      )
    );
  }, []);

  const calculations = useMemo<BillCalculation[]>(() => {
    return floorReadings.map((floor, index) => {
      if (index === 0) {
        const billAmount = floor.reading * ELECTRICITY_RATE + FIXED_CHARGE;
        const remainingBill = netBill - billAmount;
        return {
          floorId: floor.id,
          floorName: floor.name,
          reading: floor.reading,
          billAmount,
          remainingBill
        };
      } else {
        const firstFloorBill = floorReadings[0].reading * ELECTRICITY_RATE + FIXED_CHARGE;
        return {
          floorId: floor.id,
          floorName: floor.name,
          reading: floor.reading,
          billAmount: netBill - firstFloorBill,
          remainingBill: 0
        };
      }
    });
  }, [floorReadings, netBill]);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">
            Electricity Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Efficiently manage and calculate electricity bills for multiple floors
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <ReadingInput
            mainReading={mainReading}
            netBill={netBill}
            floorReadings={floorReadings}
            onMainReadingChange={setMainReading}
            onNetBillChange={setNetBill}
            onFloorReadingChange={handleFloorReadingChange}
          />

          {mainReading > 0 && netBill > 0 && (
            <BillSummary calculations={calculations} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;