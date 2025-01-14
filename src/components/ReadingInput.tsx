import React from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardHeader, CardContent } from "./ui/card";
import type { FloorReading } from "../types";

interface ReadingInputProps {
  mainReading: number;
  netBill: number;
  floorReadings: FloorReading[];
  onMainReadingChange: (value: number) => void;
  onNetBillChange: (value: number) => void;
  onFloorReadingChange: (id: string, value: number) => void;
}

export function ReadingInput({
  mainReading,
  netBill,
  floorReadings,
  onMainReadingChange,
  onNetBillChange,
  onFloorReadingChange,
}: ReadingInputProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Meter Readings</h3>
        <p className="text-sm text-muted-foreground">
          Enter the meter readings and bill details below
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="main-reading">Main Meter Reading</Label>
            <Input
              id="main-reading"
              type="number"
              value={mainReading || ""}
              onChange={(e) => onMainReadingChange(Number(e.target.value))}
              placeholder="Enter main meter reading"
              className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="net-bill">Net Current Bill</Label>
            <Input
              id="net-bill"
              type="number"
              step="0.01"
              value={netBill || ""}
              onChange={(e) => onNetBillChange(Number(e.target.value))}
              placeholder="Enter net current bill"
              className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-4">
          {floorReadings.map((floor) => (
            <div key={floor.id} className="space-y-2">
              <Label htmlFor={`floor-${floor.id}`}>{floor.name} Reading</Label>
              <Input
                id={`floor-${floor.id}`}
                type="number"
                step="0.01"
                value={floor.reading || ""}
                onChange={(e) =>
                  onFloorReadingChange(floor.id, Number(e.target.value))
                }
                placeholder={`Enter ${floor.name.toLowerCase()} reading`}
                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
