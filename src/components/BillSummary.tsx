import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import type { BillCalculation } from '../types';
import { Zap } from 'lucide-react';

interface BillSummaryProps {
  calculations: BillCalculation[];
}

export function BillSummary({ calculations }: BillSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Bill Summary</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calculations.map((calc) => (
            <div
              key={calc.floorId}
              className="rounded-lg border p-4 transition-all duration-200 hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-primary">{calc.floorName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Reading: {calc.reading} units
                  </p>
                  {calc.floorName === 'First Floor' ? (
                    <div className="mt-2 rounded-md bg-secondary/50 p-2 text-sm">
                      <p className="font-medium">Calculation Breakdown:</p>
                      <p className="text-muted-foreground">
                        ({calc.reading} × ₹8) + ₹250 = ₹{calc.billAmount.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 rounded-md bg-secondary/50 p-2 text-sm">
                      <p className="font-medium">Ground Floor Bill:</p>
                      <p className="text-muted-foreground">
                        Remaining Amount: ₹{calc.billAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="rounded-full bg-primary/10 px-3 py-1">
                    <span className="text-lg font-semibold text-primary">
                      ₹{calc.billAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}