import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { FloorReading } from "../types";
import { ELECTRICITY_RATE, FIXED_CHARGE } from "../types";

interface DashboardProps {
  floorReadings: FloorReading[];
  mainReading: number;
  previousMonthReading: number;
  netBill: number;
}

export function Dashboard({
  floorReadings,
  mainReading,
  previousMonthReading,
  // netBill,
}: DashboardProps) {
  // Calculate real-time data for the charts
  const chartData = useMemo(() => {
    const difference = mainReading - previousMonthReading;
    const firstFloorReading =
      floorReadings.find((floor) => floor.id === "1")?.reading || 0;
    const groundFloorReading = difference - firstFloorReading;

    return [
      {
        month: "Current Month",
        usage: difference,
        firstFloorUsage: firstFloorReading,
        groundFloorUsage: groundFloorReading,
        firstFloorBill: firstFloorReading * ELECTRICITY_RATE + FIXED_CHARGE,
        groundFloorBill: groundFloorReading * ELECTRICITY_RATE + FIXED_CHARGE,
      },
    ];
  }, [floorReadings, mainReading, previousMonthReading]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">Dashboard</h2>

      {/* Monthly Usage Line Chart */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Monthly Usage (Units)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="usage"
              name="Total Usage"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="firstFloorUsage"
              name="First Floor Usage"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="groundFloorUsage"
              name="Ground Floor Usage"
              stroke="#ff7300"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Bill Bar Chart */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Monthly Bill (₹)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="firstFloorBill"
              name="First Floor Bill"
              fill="#8884d8"
            />
            <Bar
              dataKey="groundFloorBill"
              name="Ground Floor Bill"
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
