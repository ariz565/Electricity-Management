import React, { useState, useCallback, useMemo, useRef } from "react";
import { Download } from "lucide-react";
// import { Dashboard } from "./components/Dashboard"; // Import the Dashboard component
import { useEffect } from "react";
import { ReadingInput } from "./components/ReadingInput";
import { BillSummary } from "./components/BillSummary";
import type { FloorReading, BillCalculation } from "./types";
import { ELECTRICITY_RATE, FIXED_CHARGE } from "./types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add or remove the `dark` class from the HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [mainReading, setMainReading] = useState<number>(0);
  const [netBill, setNetBill] = useState<number>(0);
  const [previousMonthReading, setPreviousMonthReading] = useState<number>(0);
  const [floorReadings, setFloorReadings] = useState<FloorReading[]>([
    { id: "1", name: "First Floor", reading: 0 },
    { id: "2", name: "Ground Floor", reading: 0 },
  ]);

  const invoiceRef = useRef<HTMLDivElement>(null); // Ref for the invoice template

  const handleFloorReadingChange = useCallback((id: string, value: number) => {
    setFloorReadings((prev) =>
      prev.map((floor) =>
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
          remainingBill,
        };
      } else {
        const firstFloorBill =
          floorReadings[0].reading * ELECTRICITY_RATE + FIXED_CHARGE;
        return {
          floorId: floor.id,
          floorName: floor.name,
          reading: floor.reading,
          billAmount: netBill - firstFloorBill,
          remainingBill: 0,
        };
      }
    });
  }, [floorReadings, netBill]);

  // Filter out Ground Floor for the invoice
  const invoiceCalculations = useMemo<BillCalculation[]>(() => {
    return floorReadings
      .filter((_, index) => index === 0)
      .map((floor) => {
        const billAmount = floor.reading * ELECTRICITY_RATE + FIXED_CHARGE;
        const remainingBill = netBill - billAmount;
        return {
          floorId: floor.id,
          floorName: floor.name,
          reading: floor.reading,
          billAmount,
          remainingBill,
        };
      });
  }, [floorReadings, netBill]);

  // Function to download invoice as an image
  const downloadInvoiceAsImage = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `invoice-${new Date().toISOString()}.png`;
      link.click();
    }
  };

  // Function to download invoice as a PDF
  const downloadInvoiceAsPdf = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${new Date().toISOString()}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-primary text-primary-foreground"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      {/* Rest of your app */}
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Electricity Bill Manager for Renters
          </h1>
          <p className="mt-2 text-muted-foreground">
            Efficiently manage and calculate electricity bills for multiple
            floors
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <ReadingInput
            mainReading={mainReading}
            netBill={netBill}
            previousMonthReading={previousMonthReading}
            floorReadings={floorReadings}
            onMainReadingChange={setMainReading}
            onNetBillChange={setNetBill}
            onPreviousMonthReadingChange={setPreviousMonthReading}
            onFloorReadingChange={handleFloorReadingChange}
          />

          {mainReading > 0 && netBill > 0 && (
            <>
              {/* Bill Summary (Includes Ground Floor) */}
              <BillSummary calculations={calculations} />

              {/* Dashboard with Visualizations */}
              {/* <Dashboard
                floorReadings={floorReadings}
                mainReading={mainReading}
                previousMonthReading={previousMonthReading}
                netBill={netBill}
              /> */}

              {/* Invoice Template (Excludes Ground Floor) */}
              <div
                ref={invoiceRef}
                className="p-8 bg-white shadow-lg rounded-lg border border-gray-200"
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Invoice</h2>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Invoice #: {Math.floor(Math.random() * 1000)}
                    </p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">From</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Main Street, City, Country
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">To</h3>
                    <p className="text-sm text-muted-foreground">
                      456 Floor Street, City, Country
                    </p>
                  </div>
                </div>

                {/* Meter Readings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Meter Readings
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Main Reading: {mainReading}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Previous Month Reading: {previousMonthReading}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Difference: {mainReading - previousMonthReading}
                    </p>
                  </div>
                </div>

                {/* Bill Breakdown (Excludes Ground Floor) */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Bill Breakdown
                  </h3>
                  <div className="space-y-4">
                    {invoiceCalculations.map((calc) => (
                      <div
                        key={calc.floorId}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <p className="text-sm text-muted-foreground">
                          {calc.floorName}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          ₹{calc.billAmount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Bill (Only First Floor) */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-primary">Total</p>
                    <p className="text-lg font-bold text-primary">
                      ₹{invoiceCalculations[0]?.billAmount.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={downloadInvoiceAsImage}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as Image
                </button>
                <button
                  onClick={downloadInvoiceAsPdf}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-600/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
