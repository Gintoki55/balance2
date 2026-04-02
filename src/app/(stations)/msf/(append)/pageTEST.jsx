"use client";

import { useState, useEffect, useRef } from "react";
import {
  Thermometer,
  Beaker,
  Droplets,
  Gauge,
  FlaskConical,
  FlaskRound,
  Calculator,
  Flame,
  Sun,
  Moon,
  Info,
  LucideIcon,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// ─── Tooltip ──────────────────────────────────────────────────────
function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="tooltip-trigger">{children}</span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs bg-foreground text-white rounded-md whitespace-pre z-50 shadow-lg">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}

// ─── Format output value ──────────────────────────────────────────
function fmt(v: number): string {
  if (!Number.isFinite(v)) return "\u2014";
  if (v === 0) return "0.0000";
  const abs = Math.abs(v);
  if (abs < 1e-4 || abs >= 1e6) return v.toExponential(4);
  return v.toFixed(4);
}

// ─── localStorage persistence hook ────────────────────────────────
function usePersistentState<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if we have both default and last values
        if (parsed && typeof parsed === "object" && "last" in parsed) {
          return parsed.last;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
    return defaultValue;
  });

  const setPersistentState = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify({ default: defaultValue, last: newValue }));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }
      return newValue;
    });
  };

  return [state, setPersistentState];
}

// ─── InputRow / OutputRow ─────────────────────────────────────────
function InputRow({
  symbol, value, onChange, unit, symbolTip, unitTip,
}: {
  symbol: string; value: number; onChange: (v: number) => void;
  unit: string; symbolTip?: string; unitTip?: string;
}) {
  return (
    <div className="row-input">
      {symbolTip ? (
        <Tooltip content={symbolTip}><span className="symbol w-8">{symbol}</span></Tooltip>
      ) : (
        <span className="symbol w-8">{symbol}</span>
      )}
      <input
        type="number"
        step="any"
        className="input-field flex-1 min-w-0"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      {unitTip ? (
        <Tooltip content={unitTip}><span className="unit-label w-16 text-right">{unit}</span></Tooltip>
      ) : (
        <span className="unit-label w-16 text-right">{unit}</span>
      )}
    </div>
  );
}

function OutputRow({
  symbol, value, unit, symbolTip, unitTip,
}: {
  symbol: string; value: number; unit: string;
  symbolTip?: string; unitTip?: string;
}) {
  return (
    <div className="row-output">
      {symbolTip ? (
        <Tooltip content={symbolTip}><span className="symbol w-8 opacity-70">{symbol}</span></Tooltip>
      ) : (
        <span className="symbol w-8 opacity-70">{symbol}</span>
      )}
      <div className="output-field flex-1 min-w-0">{fmt(value)}</div>
      {unitTip ? (
        <Tooltip content={unitTip}><span className="unit-label w-16 text-right opacity-70">{unit}</span></Tooltip>
      ) : (
        <span className="unit-label w-16 text-right opacity-70">{unit}</span>
      )}
    </div>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <div className="section-header flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  EXPORT UTILITIES
// ═══════════════════════════════════════════════════════════════════

// Export data to PDF
function exportToPDF(title: string, data: { symbol: string; value: string; unit: string }[]) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  let y = 35;
  
  // Header
  doc.setFont("helvetica", "bold");
  doc.text("Symbol", 14, y);
  doc.text("Value", 60, y);
  doc.text("Unit", 100, y);
  y += 8;
  
  // Data rows
  doc.setFont("helvetica", "normal");
  data.forEach((row) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(row.symbol, 14, y);
    doc.text(row.value, 60, y);
    doc.text(row.unit, 100, y);
    y += 6;
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

// Export data to Excel
function exportToExcel(title: string, data: { symbol: string; value: string; unit: string }[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];
  
  XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}.xlsx`);
}

// Export buttons component with reset
function ExportButtons({ 
  title, 
  data, 
  onReset 
}: { 
  title: string; 
  data: { symbol: string; value: string; unit: string }[];
  onReset?: () => void;
}) {
  return (
    <div className="flex gap-2 mt-3 pt-2 border-t border-border/50">
      <button
        onClick={() => exportToPDF(title, data)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
      >
        <FileText className="w-3 h-3" />
        PDF
      </button>
      <button
        onClick={() => exportToExcel(title, data)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
      >
        <FileSpreadsheet className="w-3 h-3" />
        Excel
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors ml-auto"
        >
          <span className="w-3 h-3">↺</span>
          Reset
        </button>
      )}
    </div>
  );
}

// Simple reset button for converter tables (no export)
function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex justify-end mt-3 pt-2 border-t border-border/50">
      <button
        onClick={onReset}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
      >
        <span className="w-3 h-3">↺</span>
        Reset
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  UNIT CONVERTERS
// ═══════════════════════════════════════════════════════════════════

// ─── Temperature ──────────────────────────────────────────────────
function TempC() {
  const [v, set] = useState(0);
  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [°C]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={v} onChange={set} unit="°C" unitTip="Celsius" />
        <OutputRow symbol="T" value={v + 273.15} unit="K" unitTip="Kelvin" />
        <OutputRow symbol="T" value={32 + 1.8 * v} unit="°F" unitTip="Fahrenheit" />
        <OutputRow symbol="T" value={(273.15 + v) * 9 / 5} unit="°R" unitTip="Rankine" />
      </div>
    </div>
  );
}

function TempK() {
  const [v, set] = useState(273.15);
  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [K]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={v} onChange={set} unit="K" unitTip="Kelvin" />
        <OutputRow symbol="T" value={1.8 * v - 459.67} unit="°F" unitTip="Fahrenheit" />
        <OutputRow symbol="T" value={9 * v / 5} unit="°R" unitTip="Rankine" />
        <OutputRow symbol="T" value={v - 273.15} unit="°C" unitTip="Celsius" />
      </div>
    </div>
  );
}

function TempF() {
  const [v, set] = useState(32);
  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [°F]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={v} onChange={set} unit="°F" unitTip="Fahrenheit" />
        <OutputRow symbol="T" value={v + 459.67} unit="°R" unitTip="Rankine" />
        <OutputRow symbol="T" value={(v - 32) * 5 / 9} unit="°C" unitTip="Celsius" />
        <OutputRow symbol="T" value={(v + 459.67) * 5 / 9} unit="K" unitTip="Kelvin" />
      </div>
    </div>
  );
}

function TempR() {
  const [v, set] = useState(491.67);
  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [°R]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={v} onChange={set} unit="°R" unitTip="Rankine" />
        <OutputRow symbol="T" value={5 * v / 9 - 273.15} unit="°C" unitTip="Celsius" />
        <OutputRow symbol="T" value={5 * v / 9} unit="K" unitTip="Kelvin" />
        <OutputRow symbol="T" value={v - 459.67} unit="°F" unitTip="Fahrenheit" />
      </div>
    </div>
  );
}

// ─── Volume ───────────────────────────────────────────────────────
function VolM3() {
  const [v, set] = useState(1);
  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [M³]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={v} onChange={set} unit="M³" unitTip="Cubic meter" />
        <OutputRow symbol="V" value={35.3147 * v} unit="ft³" unitTip="Cubic foot" />
        <OutputRow symbol="V" value={220 * v} unit="IG" unitTip="Imperial gallon" />
        <OutputRow symbol="V" value={264.2 * v} unit="gl" unitTip="US gallon" />
      </div>
    </div>
  );
}

function VolFt3() {
  const [v, set] = useState(35.3147);
  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [ft³]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={v} onChange={set} unit="ft³" unitTip="Cubic foot" />
        <OutputRow symbol="V" value={(220 * v) / 35.3147} unit="IG" unitTip="Imperial gallon" />
        <OutputRow symbol="V" value={(264.2 * v) / 35.3147} unit="gl" unitTip="US gallon" />
        <OutputRow symbol="V" value={v / 35.3147} unit="M³" unitTip="Cubic meter" />
      </div>
    </div>
  );
}

function VolIG() {
  const [v, set] = useState(220);
  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [IG]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={v} onChange={set} unit="IG" unitTip="Imperial gallon" />
        <OutputRow symbol="V" value={(264.2 * v) / 220} unit="gl" unitTip="US gallon" />
        <OutputRow symbol="V" value={v / 220} unit="M³" unitTip="Cubic meter" />
        <OutputRow symbol="V" value={(35.3147 * v) / 220} unit="ft³" unitTip="Cubic foot" />
      </div>
    </div>
  );
}

function VolGl() {
  const [v, set] = useState(264.2);
  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [gl]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={v} onChange={set} unit="gl" unitTip="US gallon" />
        <OutputRow symbol="V" value={(35.3147 * v) / 264.2} unit="ft³" unitTip="Cubic foot" />
        <OutputRow symbol="V" value={v / 264.2} unit="M³" unitTip="Cubic meter" />
        <OutputRow symbol="V" value={(220 * v) / 264.2} unit="IG" unitTip="Imperial gallon" />
      </div>
    </div>
  );
}

// ─── Water Flow ───────────────────────────────────────────────────
function FlowMIGD() {
  const [v, set] = useState(1);
  const m3d = (1e6 * v) / 220;
  const th = (1e6 * v) / 5280;
  const kgs = (4545454 * v) / 86400;
  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [MIGD]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={v} onChange={set} unit="MIGD" unitTip="Million imperial gallons per day" />
        <OutputRow symbol="M" value={m3d} unit="m³/day" unitTip="Cubic meters per day" />
        <OutputRow symbol="M" value={th} unit="t/h" unitTip="Tonnes per hour" />
        <OutputRow symbol="M" value={kgs} unit="kg/s" unitTip="Kilograms per second" />
      </div>
    </div>
  );
}

function FlowM3Day() {
  const [v, set] = useState(4545.45);
  const th = v / 24;
  const kgs = (1000 * v) / 86400;
  const migd = (220 * v) / 1e6;
  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [m³/day]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={v} onChange={set} unit="m³/day" unitTip="Cubic meters per day" />
        <OutputRow symbol="M" value={th} unit="t/h" unitTip="Tonnes per hour" />
        <OutputRow symbol="M" value={kgs} unit="kg/s" unitTip="Kilograms per second" />
        <OutputRow symbol="M" value={migd} unit="MIGD" unitTip="Million imperial gallons per day" />
      </div>
    </div>
  );
}

function FlowTH() {
  const [v, set] = useState(189.39);
  const kgs = (1000 * v) / 3600;
  const migd = (5280 * v) / 1e6;
  const m3d = 24 * v;
  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [t/h]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={v} onChange={set} unit="t/h" unitTip="Tonnes per hour" />
        <OutputRow symbol="M" value={kgs} unit="kg/s" unitTip="Kilograms per second" />
        <OutputRow symbol="M" value={migd} unit="MIGD" unitTip="Million imperial gallons per day" />
        <OutputRow symbol="M" value={m3d} unit="m³/day" unitTip="Cubic meters per day" />
      </div>
    </div>
  );
}

function FlowKGS() {
  const [v, set] = useState(52.61);
  const migd = (86400 * v) / 4545454;
  const m3d = (86400 * v) / 1000;
  const th = (3600 * v) / 1000;
  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [kg/s]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={v} onChange={set} unit="kg/s" unitTip="Kilograms per second" />
        <OutputRow symbol="M" value={migd} unit="MIGD" unitTip="Million imperial gallons per day" />
        <OutputRow symbol="M" value={m3d} unit="m³/day" unitTip="Cubic meters per day" />
        <OutputRow symbol="M" value={th} unit="t/h" unitTip="Tonnes per hour" />
      </div>
    </div>
  );
}

// ─── Pressure ─────────────────────────────────────────────────────
function PressBar() {
  const [v, set] = useState(1);
  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [bar]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={v} onChange={set} unit="bar" unitTip="Bar" />
        <OutputRow symbol="P" value={100 * v} unit="kPa" unitTip="Kilopascal" />
        <OutputRow symbol="P" value={v / 10} unit="MPa" unitTip="Megapascal" />
        <OutputRow symbol="P" value={14.55 * v} unit="psi" unitTip="Pounds per square inch" />
      </div>
    </div>
  );
}

function PressKPa() {
  const [v, set] = useState(100);
  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [kPa]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={v} onChange={set} unit="kPa" unitTip="Kilopascal" />
        <OutputRow symbol="P" value={v / 1000} unit="MPa" unitTip="Megapascal" />
        <OutputRow symbol="P" value={0.1455 * v} unit="psi" unitTip="Pounds per square inch" />
        <OutputRow symbol="P" value={v / 100} unit="bar" unitTip="Bar" />
      </div>
    </div>
  );
}

function PressMPa() {
  const [v, set] = useState(0.1);
  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [MPa]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={v} onChange={set} unit="MPa" unitTip="Megapascal" />
        <OutputRow symbol="P" value={145.5 * v} unit="psi" unitTip="Pounds per square inch" />
        <OutputRow symbol="P" value={10 * v} unit="bar" unitTip="Bar" />
        <OutputRow symbol="P" value={1000 * v} unit="kPa" unitTip="Kilopascal" />
      </div>
    </div>
  );
}

function PressPsi() {
  const [v, set] = useState(14.55);
  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [psi]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={v} onChange={set} unit="psi" unitTip="Pounds per square inch" />
        <OutputRow symbol="P" value={v / 14.55} unit="bar" unitTip="Bar" />
        <OutputRow symbol="P" value={(100 * v) / 14.55} unit="kPa" unitTip="Kilopascal" />
        <OutputRow symbol="P" value={v / 145.5} unit="MPa" unitTip="Megapascal" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  RO PARAMETERS
// ═══════════════════════════════════════════════════════════════════

function ECConverter() {
  const [T, setT] = useState(30);
  const [EC, setEC] = useState(6000);
  const a = EC * (1 + 0.022 * (25 - T));
  const S =
    a *
    (0.5 +
      0.05 * (0.5 + (0.5 * Math.abs(a - 100)) / (a - 100.0001)) +
      0.1 * (0.5 + (0.5 * Math.abs(a - 1e3)) / (a - 1000.0001)) +
      0.05 * (0.5 + (0.5 * Math.abs(a - 4e4)) / (a - 40000.0001)) +
      0.05 * (0.5 + (0.5 * Math.abs(a - 6e4)) / (a - 60000.0001)));
  return (
    <div className="converter-card">
      <SectionHeader title="Electrical Conductivity Converter" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={T} onChange={setT} unit="°C" symbolTip="Water temperature" unitTip="Celsius" />
        <InputRow symbol="EC" value={EC} onChange={setEC} unit="µS/cm" symbolTip="Electrical conductivity" unitTip="MicroSiemens per centimeter" />
        <OutputRow symbol="S" value={S} unit="ppm" symbolTip="Salinity (TDS)" unitTip="Parts per million" />
      </div>
    </div>
  );
}

function SalinityConverter() {
  const [v, set] = useState(35000);
  return (
    <div className="converter-card">
      <SectionHeader title="Salinity Convertor" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="S" value={v} onChange={set} unit="ppm" symbolTip="Salinity" unitTip="Parts per million" />
        <OutputRow symbol="S" value={v / 1000} unit="g/l" symbolTip="Salinity" unitTip="Grams per liter" />
        <OutputRow symbol="S" value={v / 10000} unit="%" symbolTip="Salinity" unitTip="Percent" />
      </div>
    </div>
  );
}

function OsmoticPressure() {
  const [T, setT] = useState(30);
  const [S, setS] = useState(50);
  const pi = 0.00255 * (273 + T) * S;
  return (
    <div className="converter-card">
      <SectionHeader title="Osmotic Pressure" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={T} onChange={setT} unit="°C" symbolTip="Water temperature" unitTip="Celsius" />
        <InputRow symbol="S" value={S} onChange={setS} unit="g/l" symbolTip="Salinity" unitTip="Grams per liter" />
        <OutputRow symbol="π" value={pi} unit="bar" symbolTip="Osmotic pressure" unitTip="Bar" />
      </div>
    </div>
  );
}

function SaltRejection() {
  const [Sf, setSf] = useState(65);
  const [Sd, setSd] = useState(0.2);
  const SR = 100 * (Sf - Sd) / Sf;
  return (
    <div className="converter-card">
      <SectionHeader title="Salt Rejection" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
        <OutputRow symbol="SR" value={SR} unit="%" symbolTip="Salt rejection" unitTip="Percent" />
      </div>
    </div>
  );
}

function WaterRecovery() {
  const [S0, setS0] = useState(40);
  const [Sb, setSb] = useState(65);
  const [Sd, setSd] = useState(0.2);
  const WR = 100 * (Sb - S0) / (Sb - Sd);
  return (
    <div className="converter-card">
      <SectionHeader title="Water Recovery" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sb" value={Sb} onChange={setSb} unit="g/l" symbolTip="Brine salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
        <OutputRow symbol="WR" value={WR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
      </div>
    </div>
  );
}

function BrineSalinity() {
  const [WR, setWR] = useState(38.58);
  const [S0, setS0] = useState(40);
  const [Sd, setSd] = useState(0.2);
  const Sb = (100 * S0 - WR * Sd) / (100 - WR);
  return (
    <div className="converter-card">
      <SectionHeader title="Brine Salinity" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="WR" value={WR} onChange={setWR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
        <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
        <OutputRow symbol="Sb" value={Sb} unit="g/l" symbolTip="Brine salinity" unitTip="Grams per liter" />
      </div>
    </div>
  );
}

function WaterFluxGFD() {
  const [v, set] = useState(20);
  return (
    <div className="converter-card">
      <SectionHeader title="Water Flux Converter [gfd]" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="mj" value={v} onChange={set} unit="gfd" symbolTip="Water flux" unitTip="Gallons per square foot per day" />
        <OutputRow symbol="mj" value={(40.7266 * v) / 24} unit="lmh" symbolTip="Water flux" unitTip="Liters per square meter per hour" />
      </div>
    </div>
  );
}

function WaterFluxLMH() {
  const [v, set] = useState(33.94);
  return (
    <div className="converter-card">
      <SectionHeader title="Water Flux Converter [lmh]" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="mj" value={v} onChange={set} unit="lmh" symbolTip="Water flux" unitTip="Liters per square meter per hour" />
        <OutputRow symbol="mj" value={(24 * v) / 40.7266} unit="gfd" symbolTip="Water flux" unitTip="Gallons per square foot per day" />
      </div>
    </div>
  );
}

function WaterPermLMH() {
  const [v, set] = useState(0.962);
  return (
    <div className="converter-card">
      <SectionHeader title="Water Permeability [l/m².h.bar]" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="w" value={v} onChange={set} unit="l/m².h.bar" symbolTip="Water permeability" unitTip="Liters per square meter per hour per bar" />
        <OutputRow symbol="w" value={v / 3.6e6} unit="m/s.bar" symbolTip="Water permeability" unitTip="Meters per second per bar" />
      </div>
    </div>
  );
}

function WaterPermMS() {
  const [v, set] = useState(2.672e-7);
  return (
    <div className="converter-card">
      <SectionHeader title="Water Permeability [m/s.bar]" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="w" value={v} onChange={set} unit="m/s.bar" symbolTip="Water permeability" unitTip="Meters per second per bar" />
        <OutputRow symbol="w" value={v * 3.6e6} unit="l/m².h.bar" symbolTip="Water permeability" unitTip="Liters per square meter per hour per bar" />
      </div>
    </div>
  );
}

function SaltPermGMH() {
  const [v, set] = useState(0.0731);
  return (
    <div className="converter-card">
      <SectionHeader title="Salt Permeability [g/m².h.(g/l)]" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="x" value={v} onChange={set} unit="g/m².h.(g/l)" symbolTip="Salt permeability" unitTip="Grams per square meter per hour per g/l" />
        <OutputRow symbol="x" value={v / 3.6e6} unit="m/s" symbolTip="Salt permeability" unitTip="Meters per second" />
      </div>
    </div>
  );
}

function SaltPermMS() {
  const [v, set] = useState(2.03e-8);
  return (
    <div className="converter-card">
      <SectionHeader title="Salt Permeability [m/s]" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="x" value={v} onChange={set} unit="m/s" symbolTip="Salt permeability" unitTip="Meters per second" />
        <OutputRow symbol="x" value={v * 3.6e6} unit="g/m².h.(g/l)" symbolTip="Salt permeability" unitTip="Grams per square meter per hour per g/l" />
      </div>
    </div>
  );
}

// ─── RO Element Parameters (Pb given) ─────────────────────────────
function ROElementPbGiven() {
  const [A, setA] = useState(40.9);
  const [Pf, setPf] = useState(55);
  const [Pb, setPb] = useState(54.192);
  const [Md, setMd] = useState(1.2146);
  const [WR, setWR] = useState(8);
  const [Sf, setSf] = useState(32);
  const [Tf, setTf] = useState(25);
  const [SR, setSR] = useState(99.7);

  const resetToDefaults = () => {
    setA(40.9);
    setPf(55);
    setPb(54.192);
    setMd(1.2146);
    setWR(8);
    setSf(32);
    setTf(25);
    setSR(99.7);
  };

  const Mf = (100 * Md) / WR;
  const Sd = Sf * (1 - SR / 100);
  const Sb = (Mf * Sf - Md * Sd) / (Mf - Md);
  const dS = (0.5 * (Sf + Sb) - Sd) * Math.exp((Md / Mf) * 0.7);
  const dPi = 0.00255 * (273 + Tf) * dS;
  const dP = 0.5 * (Pf + Pb) - dPi;
  const TCF = 0.33 + 0.0247 * Tf + 336e-8 * Math.pow(Tf, 3);
  const w = (1e3 * Md) / (A * dP * TCF);
  const x = (Md * Sd * 1e3) / (A * dS * TCF);
  const PCF = (Pf - Pb) / (0.0085 * Math.pow(Mf - 0.5 * Md, 1.7));

  return (
    <div className="converter-card">
      <SectionHeader title="RO Element Parameters (Pb is given)" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="A" value={A} onChange={setA} unit="M²" symbolTip="Membrane area" unitTip="Square meters" />
        <InputRow symbol="Pf" value={Pf} onChange={setPf} unit="bar" symbolTip="Feed pressure" unitTip="Bar" />
        <InputRow symbol="Pb" value={Pb} onChange={setPb} unit="bar" symbolTip="Brine pressure" unitTip="Bar" />
        <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product flow rate" unitTip="Tonnes per hour" />
        <InputRow symbol="WR" value={WR} onChange={setWR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
        <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Tf" value={Tf} onChange={setTf} unit="°C" symbolTip="Feed temperature" unitTip="Celsius" />
        <InputRow symbol="SR" value={SR} onChange={setSR} unit="%" symbolTip="Salt rejection" unitTip="Percent" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="Mf" value={Mf} unit="t/h" symbolTip="Feed flow rate" unitTip="Tonnes per hour" />
          <OutputRow symbol="Sd" value={Sd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
          <OutputRow symbol="Sb" value={Sb} unit="g/l" symbolTip="Brine salinity" unitTip="Grams per liter" />
          <OutputRow symbol="ΔS" value={dS} unit="g/l" symbolTip="Mean membrane wall salinity" unitTip="Grams per liter" />
          <OutputRow symbol="Δπ" value={dPi} unit="bar" symbolTip="Mean osmotic pressure" unitTip="Bar" />
          <OutputRow symbol="ΔP" value={dP} unit="bar" symbolTip="Net driving pressure" unitTip="Bar" />
          <OutputRow symbol="TCF" value={TCF} unit="#" symbolTip="Temperature correction factor" unitTip="Dimensionless" />
          <OutputRow symbol="w" value={w} unit="l/m².h.bar" symbolTip="Water permeability" unitTip="Liters per square meter per hour per bar" />
          <OutputRow symbol="x" value={x} unit="g/m².h.(g/l)" symbolTip="Salt permeability" unitTip="Grams per square meter per hour per g/l" />
          <OutputRow symbol="PCF" value={PCF} unit="#" symbolTip="Pressure correction factor" unitTip="Dimensionless" />
        </div>
        <ExportButtons 
          title="RO Element Parameters (Pb Given)" 
          data={[
            { symbol: "A", value: fmt(A), unit: "M²" },
            { symbol: "Pf", value: fmt(Pf), unit: "bar" },
            { symbol: "Pb", value: fmt(Pb), unit: "bar" },
            { symbol: "Md", value: fmt(Md), unit: "t/h" },
            { symbol: "WR", value: fmt(WR), unit: "%" },
            { symbol: "Sf", value: fmt(Sf), unit: "g/l" },
            { symbol: "Tf", value: fmt(Tf), unit: "°C" },
            { symbol: "SR", value: fmt(SR), unit: "%" },
            { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
            { symbol: "Sd", value: fmt(Sd), unit: "g/l" },
            { symbol: "Sb", value: fmt(Sb), unit: "g/l" },
            { symbol: "ΔS", value: fmt(dS), unit: "g/l" },
            { symbol: "Δπ", value: fmt(dPi), unit: "bar" },
            { symbol: "ΔP", value: fmt(dP), unit: "bar" },
            { symbol: "TCF", value: fmt(TCF), unit: "#" },
            { symbol: "w", value: fmt(w), unit: "l/m².h.bar" },
            { symbol: "x", value: fmt(x), unit: "g/m².h.(g/l)" },
            { symbol: "PCF", value: fmt(PCF), unit: "#" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ─── RO Element Parameters (Pb correlated) ────────────────────────
function ROElementPbCorrelated() {
  const [A, setA] = useState(40.9);
  const [Pf, setPf] = useState(55);
  const [Md, setMd] = useState(1.2146);
  const [WR, setWR] = useState(8);
  const [Sf, setSf] = useState(32);
  const [Tf, setTf] = useState(25);
  const [SR, setSR] = useState(99.7);

  const resetToDefaults = () => {
    setA(40.9);
    setPf(55);
    setMd(1.2146);
    setWR(8);
    setSf(32);
    setTf(25);
    setSR(99.7);
  };

  const Mf = (100 * Md) / WR;
  const Sd = Sf * (1 - SR / 100);
  const Sb = (Mf * Sf - Md * Sd) / (Mf - Md);
  const dS = (0.5 * (Sf + Sb) - Sd) * Math.exp((Md / Mf) * 0.7);
  const dPi = 0.00255 * (273 + Tf) * dS;
  const Pb = Pf - 0.0085 * Math.pow(Mf - 0.5 * Md, 1.7);
  const dP = 0.5 * (Pf + Pb) - dPi;
  const TCF = 0.33 + 0.0247 * Tf + 336e-8 * Math.pow(Tf, 3);
  const w = (1e3 * Md) / (A * dP * TCF);
  const x = (Md * Sd * 1e3) / (A * dS * TCF);
  const PCF = (Pf - Pb) / (0.0085 * Math.pow(Mf - 0.5 * Md, 1.7));

  return (
    <div className="converter-card">
      <SectionHeader title="RO Element Parameters (Pb is correlated)" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="A" value={A} onChange={setA} unit="M²" symbolTip="Membrane area" unitTip="Square meters" />
        <InputRow symbol="Pf" value={Pf} onChange={setPf} unit="bar" symbolTip="Feed pressure" unitTip="Bar" />
        <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product flow rate" unitTip="Tonnes per hour" />
        <InputRow symbol="WR" value={WR} onChange={setWR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
        <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Tf" value={Tf} onChange={setTf} unit="°C" symbolTip="Feed temperature" unitTip="Celsius" />
        <InputRow symbol="SR" value={SR} onChange={setSR} unit="%" symbolTip="Salt rejection" unitTip="Percent" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="Mf" value={Mf} unit="t/h" symbolTip="Feed flow rate" unitTip="Tonnes per hour" />
          <OutputRow symbol="Sd" value={Sd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
          <OutputRow symbol="Sb" value={Sb} unit="g/l" symbolTip="Brine salinity" unitTip="Grams per liter" />
          <OutputRow symbol="ΔS" value={dS} unit="g/l" symbolTip="Mean membrane wall salinity" unitTip="Grams per liter" />
          <OutputRow symbol="Δπ" value={dPi} unit="bar" symbolTip="Mean osmotic pressure" unitTip="Bar" />
          <OutputRow symbol="Pb" value={Pb} unit="bar" symbolTip="Brine pressure (correlated)" unitTip="Bar" />
          <OutputRow symbol="ΔP" value={dP} unit="bar" symbolTip="Net driving pressure" unitTip="Bar" />
          <OutputRow symbol="TCF" value={TCF} unit="#" symbolTip="Temperature correction factor" unitTip="Dimensionless" />
          <OutputRow symbol="w" value={w} unit="l/m².h.bar" symbolTip="Water permeability" unitTip="Liters per square meter per hour per bar" />
          <OutputRow symbol="x" value={x} unit="g/m².h.(g/l)" symbolTip="Salt permeability" unitTip="Grams per square meter per hour per g/l" />
          <OutputRow symbol="PCF" value={PCF} unit="#" symbolTip="Pressure correction factor" unitTip="Dimensionless" />
        </div>
        <ExportButtons 
          title="RO Element Parameters (Pb Correlated)" 
          data={[
            { symbol: "A", value: fmt(A), unit: "M²" },
            { symbol: "Pf", value: fmt(Pf), unit: "bar" },
            { symbol: "Md", value: fmt(Md), unit: "t/h" },
            { symbol: "WR", value: fmt(WR), unit: "%" },
            { symbol: "Sf", value: fmt(Sf), unit: "g/l" },
            { symbol: "Tf", value: fmt(Tf), unit: "°C" },
            { symbol: "SR", value: fmt(SR), unit: "%" },
            { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
            { symbol: "Sd", value: fmt(Sd), unit: "g/l" },
            { symbol: "Sb", value: fmt(Sb), unit: "g/l" },
            { symbol: "ΔS", value: fmt(dS), unit: "g/l" },
            { symbol: "Δπ", value: fmt(dPi), unit: "bar" },
            { symbol: "Pb", value: fmt(Pb), unit: "bar" },
            { symbol: "ΔP", value: fmt(dP), unit: "bar" },
            { symbol: "TCF", value: fmt(TCF), unit: "#" },
            { symbol: "w", value: fmt(w), unit: "l/m².h.bar" },
            { symbol: "x", value: fmt(x), unit: "g/m².h.(g/l)" },
            { symbol: "PCF", value: fmt(PCF), unit: "#" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  WATER CHEMISTRY
// ═══════════════════════════════════════════════════════════════════

function PHConverter() {
  const [pH, setPH] = useState(7);
  const hPlus = Math.pow(10, -pH);
  const pOH = 14 - pH;
  const ohMinus = Math.pow(10, -pOH);
  return (
    <div className="converter-card">
      <SectionHeader title="pH ↔ H⁺ Concentration" icon={FlaskRound} />
      <div className="p-4 space-y-1">
        <InputRow symbol="pH" value={pH} onChange={setPH} unit="#" symbolTip="pH value (0–14 scale)" unitTip="Dimensionless" />
        <OutputRow symbol="[H⁺]" value={hPlus} unit="mol/L" symbolTip="Hydrogen ion concentration" unitTip="Moles per liter" />
        <OutputRow symbol="pOH" value={pOH} unit="#" symbolTip="Hydroxide exponent" unitTip="Dimensionless" />
        <OutputRow symbol="[OH⁻]" value={ohMinus} unit="mol/L" symbolTip="Hydroxide ion concentration" unitTip="Moles per liter" />
      </div>
    </div>
  );
}

const defaultIons = {
  // Cations
  Na: 10800, K: 390, Ca: 400, Mg: 1290, Ba: 0, Sr: 8, Fe: 0,
  Li: 0, NH4: 0, Mn: 0, Al: 0, Zn: 0, Cu: 0, Pb: 0, Ni: 0, Cr: 0,
  // Anions
  Cl: 19400, SO4: 2700, HCO3: 142, CO3: 0, NO3: 0, F: 1.3,
  NO2: 0, PO4: 0, Br: 67, I: 0, HS: 0, OH: 0,
  // Neutral
  SiO2: 1, B: 4.5, CO2: 0,
};

function WaterAnalysis() {
  const [ions, setIons] = usePersistentState("waterAnalysis.ions", defaultIons);
  const [pH, setPH] = usePersistentState("waterAnalysis.pH", 8.1);
  const [T, setT] = usePersistentState("waterAnalysis.T", 25);
  const [balanceMode, setBalanceMode] = usePersistentState<"none" | "adjustNa" | "adjustCl">("waterAnalysis.balanceMode", "none");

  const setIon = (key: string, val: number) => setIons(prev => ({ ...prev, [key]: val }));

  // Reset to default values
  const resetToDefaults = () => {
    setIons(defaultIons);
    setPH(8.1);
    setT(25);
    setBalanceMode("none");
  };

  // Equivalent weights (molar mass / valence)
  const EW: Record<string, number> = {
    Na: 22.990, K: 39.098, Ca: 20.039, Mg: 12.153, Ba: 68.664, Sr: 43.810, Fe: 27.923,
    Li: 6.941, NH4: 18.039, Mn: 27.470, Al: 8.994, Zn: 32.685, Cu: 31.773, Pb: 103.600, Ni: 29.345, Cr: 17.332,
    Cl: 35.453, SO4: 48.030, HCO3: 61.016, CO3: 30.004, NO3: 62.004, F: 18.998,
    NO2: 46.006, PO4: 31.656, Br: 79.904, I: 126.904, HS: 33.073, OH: 17.008,
  };

  const cationKeys = ["Na", "K", "Ca", "Mg", "Ba", "Sr", "Fe", "Li", "NH4", "Mn", "Al", "Zn", "Cu", "Pb", "Ni", "Cr"] as const;
  const anionKeys = ["Cl", "SO4", "HCO3", "CO3", "NO3", "F", "NO2", "PO4", "Br", "I", "HS", "OH"] as const;
  const neutralKeys = ["SiO2", "B", "CO2"] as const;

  const cationSymbols: Record<string, string> = {
    Na: "Na\u207A", K: "K\u207A", Ca: "Ca\u00B2\u207A", Mg: "Mg\u00B2\u207A", Ba: "Ba\u00B2\u207A", Sr: "Sr\u00B2\u207A", Fe: "Fe\u00B2\u207A",
    Li: "Li\u207A", NH4: "NH\u2084\u207A", Mn: "Mn\u00B2\u207A", Al: "Al\u00B3\u207A", Zn: "Zn\u00B2\u207A", Cu: "Cu\u00B2\u207A", Pb: "Pb\u00B2\u207A", Ni: "Ni\u00B2\u207A", Cr: "Cr\u00B3\u207A",
  };
  const anionSymbols: Record<string, string> = {
    Cl: "Cl\u207B", SO4: "SO\u2084\u00B2\u207B", HCO3: "HCO\u2083\u207B", CO3: "CO\u2083\u00B2\u207B", NO3: "NO\u2083\u207B", F: "F\u207B",
    NO2: "NO\u2082\u207B", PO4: "PO\u2084\u00B3\u207B", Br: "Br\u207B", I: "I\u207B", HS: "HS\u207B", OH: "OH\u207B",
  };
  const neutralSymbols: Record<string, string> = { SiO2: "SiO\u2082", B: "B", CO2: "CO\u2082" };

  const ionTips: Record<string, string> = {
    Na: "Sodium ion,\nmajor cation in seawater and brackish water",
    K: "Potassium ion,\nessential nutrient found in most water sources",
    Ca: "Calcium ion,\nprimary contributor to water hardness",
    Mg: "Magnesium ion,\nsecondary contributor to water hardness",
    Ba: "Barium ion,\ncauses scaling (BaSO\u2084) in RO systems",
    Sr: "Strontium ion,\ncauses scaling (SrSO\u2084) in RO concentrate",
    Fe: "Iron ion,\ncauses fouling and staining in water systems",
    Li: "Lithium ion,\nfound in geothermal and brine waters",
    NH4: "Ammonium ion,\nindicator of organic contamination or wastewater",
    Mn: "Manganese ion,\ncommon in groundwater,\ncauses staining",
    Al: "Aluminum ion,\nfound in acidic waters and after coagulation",
    Zn: "Zinc ion,\nfrom corrosion of galvanized pipes or industrial discharge",
    Cu: "Copper ion,\nfrom pipe corrosion or industrial sources",
    Pb: "Lead ion,\nfrom old pipes and solder,\ntoxic heavy metal",
    Ni: "Nickel ion,\nfrom industrial discharge or stainless steel corrosion",
    Cr: "Chromium ion,\nfrom industrial discharge,\nregulated contaminant",
    Cl: "Chloride ion,\nmajor anion in seawater and brackish water",
    SO4: "Sulfate ion,\ncauses scaling (CaSO\u2084) in RO systems",
    HCO3: "Bicarbonate ion,\nprimary component of alkalinity",
    CO3: "Carbonate ion,\npresent at high pH,\ncontributes to alkalinity and scaling",
    NO3: "Nitrate ion,\nfrom agricultural runoff and wastewater",
    F: "Fluoride ion,\nnaturally occurring,\nregulated in drinking water",
    NO2: "Nitrite ion,\nintermediate in nitrogen cycle,\nindicator of contamination",
    PO4: "Phosphate ion,\nfrom detergents,\nagriculture,\nand wastewater",
    Br: "Bromide ion,\nfound in seawater,\nforms disinfection byproducts",
    I: "Iodide ion,\nfound in brine and some groundwater sources",
    HS: "Hydrogen sulfide ion,\ncauses odor and corrosion,\nfrom anaerobic conditions",
    OH: "Hydroxide ion,\npresent at high pH,\ncontributes to alkalinity",
    SiO2: "Silica,\ncauses colloidal fouling and scaling in RO membranes",
    B: "Boron,\ndifficult to reject by RO membranes,\nregulated in irrigation water",
    CO2: "Dissolved carbon dioxide,\naffects pH and carbonate equilibrium",
  };

  // meq/L for each ion
  const meq = (key: string) => ions[key as keyof typeof ions] / EW[key];

  // Raw totals
  const rawCatTotal = cationKeys.reduce((s, k) => s + meq(k), 0);
  const rawAnTotal = anionKeys.reduce((s, k) => s + meq(k), 0);

  // Balanced values
  let usedNa = ions.Na;
  let usedCl = ions.Cl;
  if (balanceMode === "adjustNa") {
    const otherCatMeq = rawCatTotal - meq("Na");
    const adjustedNaMeq = rawAnTotal - otherCatMeq;
    usedNa = Math.max(0, adjustedNaMeq * EW.Na);
  } else if (balanceMode === "adjustCl") {
    const otherAnMeq = rawAnTotal - meq("Cl");
    const adjustedClMeq = rawCatTotal - otherAnMeq;
    usedCl = Math.max(0, adjustedClMeq * EW.Cl);
  }

  const getMeq = (key: string) => {
    if (key === "Na" && balanceMode === "adjustNa") return usedNa / EW.Na;
    if (key === "Cl" && balanceMode === "adjustCl") return usedCl / EW.Cl;
    return meq(key);
  };

  const getMg = (key: string) => {
    if (key === "Na" && balanceMode === "adjustNa") return usedNa;
    if (key === "Cl" && balanceMode === "adjustCl") return usedCl;
    return ions[key as keyof typeof ions];
  };

  const totalCat = cationKeys.reduce((s, k) => s + getMeq(k), 0);
  const totalAn = anionKeys.reduce((s, k) => s + getMeq(k), 0);

  const neutralTotal = neutralKeys.reduce((s, k) => s + ions[k as keyof typeof ions], 0);
  const tds = cationKeys.reduce((s, k) => s + getMg(k), 0) + anionKeys.reduce((s, k) => s + getMg(k), 0) + neutralTotal;
  const balanceErr = (totalCat + totalAn) > 0 ? ((totalCat - totalAn) / (totalCat + totalAn)) * 100 : 0;
  const absErr = Math.abs(balanceErr);

  const hardnessCaCO3 = (getMeq("Ca") + getMeq("Mg")) * 50.043;
  const alkCaCO3 = (getMeq("HCO3") + getMeq("CO3") + getMeq("OH")) * 50.043;
  const ionicStr = 2.5e-5 * tds;

  // LSI
  const lsiA = (Math.log10(Math.max(tds, 1)) - 1) / 10;
  const lsiB = -13.12 * Math.log10(T + 273) + 34.55;
  const caCaCO3 = getMeq("Ca") * 50.043;
  const lsiC = Math.log10(Math.max(caCaCO3, 1)) - 0.4;
  const lsiD = Math.log10(Math.max(alkCaCO3, 1));
  const pHs = (9.3 + lsiA + lsiB) - (lsiC + lsiD);
  const lsi = pH - pHs;

  const isBalanced = (key: string) =>
    (key === "Na" && balanceMode === "adjustNa") || (key === "Cl" && balanceMode === "adjustCl");

  const renderIonRow = (key: string, symbol: string) => (
    <tr key={key}>
      <td><Tooltip content={ionTips[key] || key}>{symbol}</Tooltip></td>
      <td>
        {isBalanced(key) ? (
          <span className="wa-output-cell block">{fmt(getMg(key))}</span>
        ) : (
          <input
            type="number"
            className="wa-input-cell"
            value={ions[key as keyof typeof ions]}
            onChange={e => setIon(key, parseFloat(e.target.value) || 0)}
          />
        )}
      </td>
      <td><span className="wa-output-cell block">{fmt(getMeq(key))}</span></td>
    </tr>
  );

  const renderNeutralRow = (key: string, symbol: string) => (
    <tr key={key}>
      <td><Tooltip content={ionTips[key] || key}>{symbol}</Tooltip></td>
      <td>
        <input
          type="number"
          className="wa-input-cell"
          value={ions[key as keyof typeof ions]}
          onChange={e => setIon(key, parseFloat(e.target.value) || 0)}
        />
      </td>
      <td><span className="wa-output-cell block text-muted-foreground">—</span></td>
    </tr>
  );

  return (
    <div className="converter-card">
      <SectionHeader title="Water Analysis" icon={FlaskRound} />
      <div className="p-4 space-y-4">
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">pH</span>
              <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={pH} step={0.1}
                onChange={e => setPH(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">T</span>
              <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={T}
                onChange={e => setT(parseFloat(e.target.value) || 0)} />
              <span className="text-[10px]">°C</span>
            </div>
          </div>
          <div className="wa-radio-group">
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Balance:</span>
            <label><input type="radio" name="balance" checked={balanceMode === "none"} onChange={() => setBalanceMode("none")} /> None</label>
            <label><input type="radio" name="balance" checked={balanceMode === "adjustNa"} onChange={() => setBalanceMode("adjustNa")} /> Adjust Na⁺</label>
            <label><input type="radio" name="balance" checked={balanceMode === "adjustCl"} onChange={() => setBalanceMode("adjustCl")} /> Adjust Cl⁻</label>
          </div>
        </div>

        {/* Ion table */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cations - Left */}
          <div>
            <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider">Cations</h3>
            <table className="wa-table">
              <thead>
                <tr><th>Ion</th><th>mg/l</th><th>meq/l</th></tr>
              </thead>
              <tbody>
                {cationKeys.map(k => renderIonRow(k, cationSymbols[k]))}
                <tr className="wa-subtotal">
                  <td>Total</td>
                  <td></td>
                  <td><span className="wa-output-cell block font-bold">{fmt(totalCat)}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Anions + Neutral species - Right */}
          <div>
            <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider">Anions</h3>
            <table className="wa-table">
              <thead>
                <tr><th>Ion</th><th>mg/l</th><th>meq/l</th></tr>
              </thead>
              <tbody>
                {anionKeys.map(k => renderIonRow(k, anionSymbols[k]))}
                <tr className="wa-subtotal">
                  <td>Total</td>
                  <td></td>
                  <td><span className="wa-output-cell block font-bold">{fmt(totalAn)}</span></td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider mt-4">Neutral Species</h3>
            <table className="wa-table">
              <thead>
                <tr><th>Species</th><th>mg/l</th><th>meq/l</th></tr>
              </thead>
              <tbody>
                {neutralKeys.map(k => renderNeutralRow(k, neutralSymbols[k]))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Summary</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div className="flex justify-between"><span>TDS</span><span className="font-mono font-semibold">{fmt(tds)} mg/l</span></div>
            <div className="flex justify-between"><span>Total Hardness (CaCO₃)</span><span className="font-mono font-semibold">{fmt(hardnessCaCO3)} mg/l</span></div>
            <div className="flex justify-between items-center">
              <span>Ion Balance Error</span>
              <span className="flex items-center gap-2">
                <span className="font-mono font-semibold">{fmt(balanceErr)}%</span>
                <span className={`wa-badge ${absErr < 2 ? "wa-badge-green" : absErr < 5 ? "wa-badge-yellow" : "wa-badge-red"}`}>
                  {absErr < 2 ? "Excellent" : absErr < 5 ? "Acceptable" : "Poor"}
                </span>
              </span>
            </div>
            <div className="flex justify-between"><span>Total Alkalinity (CaCO₃)</span><span className="font-mono font-semibold">{fmt(alkCaCO3)} mg/l</span></div>
            <div className="flex justify-between"><span>Ionic Strength</span><span className="font-mono font-semibold">{fmt(ionicStr)} mol/L</span></div>
          </div>
        </div>

        {/* LSI */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Langelier Saturation Index (LSI)</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div className="flex justify-between"><span>A (TDS factor)</span><span className="font-mono">{fmt(lsiA)}</span></div>
            <div className="flex justify-between"><span>B (Temperature factor)</span><span className="font-mono">{fmt(lsiB)}</span></div>
            <div className="flex justify-between"><span>C (Calcium factor)</span><span className="font-mono">{fmt(lsiC)}</span></div>
            <div className="flex justify-between"><span>D (Alkalinity factor)</span><span className="font-mono">{fmt(lsiD)}</span></div>
            <div className="flex justify-between"><span>pHs (Saturation pH)</span><span className="font-mono font-semibold">{fmt(pHs)}</span></div>
            <div className="flex justify-between items-center">
              <span>LSI</span>
              <span className="flex items-center gap-2">
                <span className="font-mono font-bold">{fmt(lsi)}</span>
                <span className={`wa-badge ${lsi > 0.5 ? "wa-badge-red" : lsi > -0.5 ? "wa-badge-green" : "wa-badge-blue"}`}>
                  {lsi > 0.5 ? "Scale-forming" : lsi > -0.5 ? "Balanced" : "Corrosive"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Pretreatment Selection - moved from Water Cost */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Pretreatment Selection</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span>SDI Factor</span>
              <span className="font-mono font-semibold">1.5</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Recommended PT</span>
              <span className="font-mono font-semibold">{tds > 35000 ? 'MF/UF' : 'Media'}</span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="Water Analysis" 
          data={[
            { symbol: "pH", value: fmt(pH), unit: "-" },
            { symbol: "T", value: fmt(T), unit: "°C" },
            { symbol: "TDS", value: fmt(tds), unit: "mg/l" },
            { symbol: "Hardness", value: fmt(hardnessCaCO3), unit: "mg/l CaCO₃" },
            { symbol: "Alkalinity", value: fmt(alkCaCO3), unit: "mg/l CaCO₃" },
            { symbol: "Ionic Strength", value: fmt(ionicStr), unit: "mol/L" },
            { symbol: "LSI", value: fmt(lsi), unit: "-" },
            { symbol: "Balance Error", value: fmt(balanceErr), unit: "%" },
            ...cationKeys.map(k => ({ symbol: cationSymbols[k] || k, value: fmt(ions[k as keyof typeof ions]), unit: "mg/l" })),
            ...anionKeys.map(k => ({ symbol: anionSymbols[k] || k, value: fmt(ions[k as keyof typeof ions]), unit: "mg/l" })),
            ...neutralKeys.map(k => ({ symbol: neutralSymbols[k] || k, value: fmt(ions[k as keyof typeof ions]), unit: "mg/l" })),
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ─── RO Pretreatment Additive Dosing ──────────────────────────────

function CoagulantDosing() {
  const [Q, setQ] = usePersistentState("coagulantDosing.Q", 100);
  const [D, setD] = usePersistentState("coagulantDosing.D", 5);
  const [C, setC] = usePersistentState("coagulantDosing.C", 40);
  const [rho, setRho] = usePersistentState("coagulantDosing.rho", 1300);
  const lH = rho > 0 ? (Q * D * 100) / (C * rho) : 0;
  
  const resetToDefaults = () => {
    setQ(100);
    setD(5);
    setC(40);
    setRho(1300);
  };
  
  return (
    <div className="converter-card">
      <SectionHeader title="Coagulant / Flocculant Dosing" icon={FlaskRound} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M0" value={Q} onChange={setQ} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="d" value={D} onChange={setD} unit="g/t" symbolTip={"Coagulant dose per metric ton of feed water.\nTypical chemicals:\nFeCl\u2083 (Ferric chloride): 5-30 g/t,\nAlum (Al\u2082(SO\u2084)\u2083): 5-25 g/t,\nPolymer flocculant: 0.5-3 g/t"} unitTip="Grams per metric ton of feed water" />
        <InputRow symbol="C" value={C} onChange={setC} unit="%" symbolTip="Chemical concentration (% w/w)" unitTip="Percent weight per weight" />
        <InputRow symbol="ρ" value={rho} onChange={setRho} unit="g/L" symbolTip="Chemical solution density" unitTip="Grams per liter" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="D" value={lH} unit="L/h" symbolTip="Coagulant chemical dosing rate" unitTip="Liters per hour" />
        </div>
        <ExportButtons 
          title="Coagulant Dosing" 
          data={[
            { symbol: "M0", value: fmt(Q), unit: "t/h" },
            { symbol: "d", value: fmt(D), unit: "g/t" },
            { symbol: "C", value: fmt(C), unit: "%" },
            { symbol: "ρ", value: fmt(rho), unit: "g/L" },
            { symbol: "D", value: fmt(lH), unit: "L/h" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

function BiocideDosing() {
  const [Q, setQ] = usePersistentState("biocideDosing.Q", 100);
  const [D, setD] = usePersistentState("biocideDosing.D", 3);
  const [C, setC] = usePersistentState("biocideDosing.C", 12);
  const [rho, setRho] = usePersistentState("biocideDosing.rho", 1200);
  const lH = rho > 0 ? (Q * D * 100) / (C * rho) : 0;
  
  const resetToDefaults = () => {
    setQ(100);
    setD(3);
    setC(12);
    setRho(1200);
  };
  
  return (
    <div className="converter-card">
      <SectionHeader title="Disinfection / Biocide Dosing" icon={FlaskRound} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M0" value={Q} onChange={setQ} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="d" value={D} onChange={setD} unit="g/t" symbolTip={"Biocide dose as active per metric ton of feed water.\nTypical chemicals:\nNaOCl (Sodium hypochlorite): 1-5 g/t as Cl\u2082,\nChloramine: 1-3 g/t,\nDNBPA (biocide): 10-50 g/t intermittent"} unitTip="Grams per metric ton of feed water" />
        <InputRow symbol="C" value={C} onChange={setC} unit="%" symbolTip="Chemical concentration (NaOCl ~12% active Cl)" unitTip="Percent weight per weight" />
        <InputRow symbol="ρ" value={rho} onChange={setRho} unit="g/L" symbolTip="Chemical solution density" unitTip="Grams per liter" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="D" value={lH} unit="L/h" symbolTip="Biocide chemical dosing rate" unitTip="Liters per hour" />
        </div>
        <ExportButtons 
          title="Biocide Dosing" 
          data={[
            { symbol: "M0", value: fmt(Q), unit: "t/h" },
            { symbol: "d", value: fmt(D), unit: "g/t" },
            { symbol: "C", value: fmt(C), unit: "%" },
            { symbol: "ρ", value: fmt(rho), unit: "g/L" },
            { symbol: "D", value: fmt(lH), unit: "L/h" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

function DechlorinationDosing() {
  const [Q, setQ] = usePersistentState("dechlorinationDosing.Q", 100);
  const [D, setD] = usePersistentState("dechlorinationDosing.D", 3);
  const [C, setC] = usePersistentState("dechlorinationDosing.C", 38);
  const [rho, setRho] = usePersistentState("dechlorinationDosing.rho", 1300);
  const lH = rho > 0 ? (Q * D * 100) / (C * rho) : 0;
  
  const resetToDefaults = () => {
    setQ(100);
    setD(3);
    setC(38);
    setRho(1300);
  };
  
  return (
    <div className="converter-card">
      <SectionHeader title="Dechlorination Dosing" icon={FlaskRound} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M0" value={Q} onChange={setQ} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="d" value={D} onChange={setD} unit="g/t" symbolTip={"SBS/SMBS dose per metric ton of feed water.\nTypical chemicals:\nSMBS (Na\u2082S\u2082O\u2085): 1.8-3\u00D7 residual Cl\u2082,\nSBS (NaHSO\u2083): similar ratio,\nActivated carbon: alternative for dechlorination"} unitTip="Grams per metric ton of feed water" />
        <InputRow symbol="C" value={C} onChange={setC} unit="%" symbolTip="SMBS concentration (sodium metabisulfite ~38%)" unitTip="Percent weight per weight" />
        <InputRow symbol="ρ" value={rho} onChange={setRho} unit="g/L" symbolTip="Chemical solution density" unitTip="Grams per liter" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="D" value={lH} unit="L/h" symbolTip="Dechlorination chemical dosing rate" unitTip="Liters per hour" />
        </div>
        <ExportButtons 
          title="Dechlorination Dosing" 
          data={[
            { symbol: "M0", value: fmt(Q), unit: "t/h" },
            { symbol: "d", value: fmt(D), unit: "g/t" },
            { symbol: "C", value: fmt(C), unit: "%" },
            { symbol: "ρ", value: fmt(rho), unit: "g/L" },
            { symbol: "D", value: fmt(lH), unit: "L/h" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

function AntiscalantDosing() {
  const [Q, setQ] = usePersistentState("antiscalantDosing.Q", 100);
  const [D, setD] = usePersistentState("antiscalantDosing.D", 3);
  const [C, setC] = usePersistentState("antiscalantDosing.C", 100);
  const [rho, setRho] = usePersistentState("antiscalantDosing.rho", 1100);
  const lH = rho > 0 ? (Q * D * 100) / (C * rho) : 0;
  
  const resetToDefaults = () => {
    setQ(100);
    setD(3);
    setC(100);
    setRho(1100);
  };
  
  return (
    <div className="converter-card">
      <SectionHeader title="Antiscalant Dosing" icon={FlaskRound} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M0" value={Q} onChange={setQ} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="d" value={D} onChange={setD} unit="g/t" symbolTip={"Antiscalant dose per metric ton of feed water.\nTypical chemicals:\nPhosphonate-based: 2-5 g/t,\nPolymer-based (polycarboxylic acid): 2-5 g/t,\nPhosphoric acid (for pH adjust): 20-50 g/t"} unitTip="Grams per metric ton of feed water" />
        <InputRow symbol="C" value={C} onChange={setC} unit="%" symbolTip="Product concentration (typically neat/100%)" unitTip="Percent weight per weight" />
        <InputRow symbol="ρ" value={rho} onChange={setRho} unit="g/L" symbolTip="Chemical solution density" unitTip="Grams per liter" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="D" value={lH} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
        </div>
        <ExportButtons 
          title="Antiscalant Dosing" 
          data={[
            { symbol: "M0", value: fmt(Q), unit: "t/h" },
            { symbol: "d", value: fmt(D), unit: "g/t" },
            { symbol: "C", value: fmt(C), unit: "%" },
            { symbol: "ρ", value: fmt(rho), unit: "g/L" },
            { symbol: "D", value: fmt(lH), unit: "L/h" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

function NFPretreatment() {
  const [Q, setQ] = usePersistentState("nfPretreatment.Q", 100);
  const [D, setD] = usePersistentState("nfPretreatment.D", 3);
  const [C, setC] = usePersistentState("nfPretreatment.C", 37);
  const [rho, setRho] = usePersistentState("nfPretreatment.rho", 1200);
  const lH = rho > 0 ? (Q * D * 100) / (C * rho) : 0;
  
  const resetToDefaults = () => {
    setQ(100);
    setD(3);
    setC(37);
    setRho(1200);
  };
  
  return (
    <div className="converter-card">
      <SectionHeader title="Chemical dosing rate" icon={FlaskRound} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M0" value={Q} onChange={setQ} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="d" value={D} onChange={setD} unit="g/t" symbolTip={"Chemical dose per metric ton of feed water.\nTypical chemicals:\nHCl (Hydrochloric acid): 10-50 g/t for pH adjustment,\nH\u2082SO\u2084 (Sulfuric acid): 10-50 g/t for pH adjustment,\nAntiscalant: 2-5 g/t,\nNaOCl: 1-5 g/t for biofouling control"} unitTip="Grams per metric ton of feed water" />
        <InputRow symbol="C" value={C} onChange={setC} unit="%" symbolTip={"Chemical concentration\n(HCl ~37%,\nH\u2082SO\u2084 ~98%,\nAntiscalant ~100%)"} unitTip="Percent weight per weight" />
        <InputRow symbol="ρ" value={rho} onChange={setRho} unit="g/L" symbolTip="Chemical solution density" unitTip="Grams per liter" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="D" value={lH} unit="L/h" symbolTip="Chemical dosing rate" unitTip="Liters per hour" />
        </div>
        <ExportButtons 
          title="Chemical Dosing Rate" 
          data={[
            { symbol: "M0", value: fmt(Q), unit: "t/h" },
            { symbol: "d", value: fmt(D), unit: "g/t" },
            { symbol: "C", value: fmt(C), unit: "%" },
            { symbol: "ρ", value: fmt(rho), unit: "g/L" },
            { symbol: "D", value: fmt(lH), unit: "L/h" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  THERMAL VARIABLES
// ═══════════════════════════════════════════════════════════════════

// ─── Heat Converters ──────────────────────────────────────────────
function HeatKWH() {
  const [v, set] = useState(1);
  return (
    <div className="converter-card">
      <SectionHeader title="Heat Converter [kWh]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Q" value={v} onChange={set} unit="kWh" symbolTip="Heat energy" unitTip="Kilowatt hour" />
        <OutputRow symbol="Q" value={3.6 * v} unit="MJ" symbolTip="Heat energy" unitTip="Megajoule" />
        <OutputRow symbol="Q" value={3.41232 * v} unit="kBTU" symbolTip="Heat energy" unitTip="Kilo British thermal unit" />
        <OutputRow symbol="Q" value={860.01 * v} unit="kcal" symbolTip="Heat energy" unitTip="Kilocalorie" />
      </div>
    </div>
  );
}

function HeatMJ() {
  const [v, set] = useState(1);
  return (
    <div className="converter-card">
      <SectionHeader title="Heat Converter [MJ]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Q" value={v} onChange={set} unit="MJ" symbolTip="Heat energy" unitTip="Megajoule" />
        <OutputRow symbol="Q" value={0.9479 * v} unit="kBTU" symbolTip="Heat energy" unitTip="Kilo British thermal unit" />
        <OutputRow symbol="Q" value={238.892 * v} unit="kcal" symbolTip="Heat energy" unitTip="Kilocalorie" />
        <OutputRow symbol="Q" value={v / 3.6} unit="kWh" symbolTip="Heat energy" unitTip="Kilowatt hour" />
      </div>
    </div>
  );
}

function HeatKBTU() {
  const [v, set] = useState(1);
  return (
    <div className="converter-card">
      <SectionHeader title="Heat Converter [kBTU]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Q" value={v} onChange={set} unit="kBTU" symbolTip="Heat energy" unitTip="Kilo British thermal unit" />
        <OutputRow symbol="Q" value={252.031 * v} unit="kcal" symbolTip="Heat energy" unitTip="Kilocalorie" />
        <OutputRow symbol="Q" value={0.2931 * v} unit="kWh" symbolTip="Heat energy" unitTip="Kilowatt hour" />
        <OutputRow symbol="Q" value={1.055 * v} unit="MJ" symbolTip="Heat energy" unitTip="Megajoule" />
      </div>
    </div>
  );
}

function HeatKcal() {
  const [v, set] = useState(1000);
  return (
    <div className="converter-card">
      <SectionHeader title="Heat Converter [kcal]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Q" value={v} onChange={set} unit="kcal" symbolTip="Heat energy" unitTip="Kilocalorie" />
        <OutputRow symbol="Q" value={v / 860.01} unit="kWh" symbolTip="Heat energy" unitTip="Kilowatt hour" />
        <OutputRow symbol="Q" value={(v * 3.6) / 860.01} unit="MJ" symbolTip="Heat energy" unitTip="Megajoule" />
        <OutputRow symbol="Q" value={(v * 3.41232) / 860.01} unit="kBTU" symbolTip="Heat energy" unitTip="Kilo British thermal unit" />
      </div>
    </div>
  );
}

// ─── Enthalpy & Thermal Calcs ─────────────────────────────────────
function SpecificEnthalpy() {
  const [T, setT] = useState(50);
  return (
    <div className="converter-card">
      <SectionHeader title="Specific Enthalpy of Liquid Water" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={T} onChange={setT} unit="°C" symbolTip="Water temperature" unitTip="Celsius" />
        <OutputRow symbol="h" value={4.18 * T - 0.034} unit="MJ/t" symbolTip="Specific enthalpy" unitTip="Megajoule per metric ton" />
      </div>
    </div>
  );
}

function LatentHeat() {
  const [T, setT] = useState(50);
  const lam = 2501.7 - 2.18 * T - 77e-7 * Math.pow(T, 3);
  return (
    <div className="converter-card">
      <SectionHeader title="Latent Heat of Evaporation" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={T} onChange={setT} unit="°C" symbolTip="Water temperature" unitTip="Celsius" />
        <OutputRow symbol="λ" value={lam} unit="MJ/t" symbolTip="Latent heat of evaporation" unitTip="Megajoule per metric ton" />
      </div>
    </div>
  );
}

function SaturatedSteamEnthalpy() {
  const [T, setT] = useState(50);
  const hs = 2501.7 - 1.8 * T - 77e-7 * Math.pow(T, 3);
  return (
    <div className="converter-card">
      <SectionHeader title="Specific Enthalpy of Saturation Vapor" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Tv" value={T} onChange={setT} unit="°C" symbolTip="Vapor temperature" unitTip="Celsius" />
        <OutputRow symbol="hv" value={hs} unit="MJ/t" symbolTip="Specific enthalpy of saturated steam" unitTip="Megajoule per metric ton" />
      </div>
    </div>
  );
}

function SalineWaterEnthalpy() {
  const [T, setT] = useState(50);
  const [S, setS] = useState(70);
  const hs =
    4.18 * T -
    0.034 +
    0.01 * (1.1 - 0.54 * T + 56e-5 * Math.pow(T, 2)) * S -
    1e-4 * (4 - 0.016 * T + 18e-5 * Math.pow(T, 2)) * Math.pow(S, 2);
  return (
    <div className="converter-card">
      <SectionHeader title="Specific Enthalpy of Saline Water" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Tb" value={T} onChange={setT} unit="°C" symbolTip="Saline water temperature" unitTip="Celsius" />
        <InputRow symbol="Sb" value={S} onChange={setS} unit="g/l" symbolTip="Water salinity" unitTip="Grams per liter" />
        <OutputRow symbol="hb" value={hs} unit="MJ/t" symbolTip="Specific enthalpy of saline water" unitTip="Megajoule per metric ton" />
      </div>
    </div>
  );
}

function BoilingPointElevation() {
  const [T, setT] = useState(50);
  const [S, setS] = useState(70);
  const BPE = (0.0083 + 19e-6 * T + 4e-7 * Math.pow(T, 2)) * S;
  return (
    <div className="converter-card">
      <SectionHeader title="Boiling Point Elevation" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Tv" value={T} onChange={setT} unit="°C" symbolTip="Saturated vapor temperature" unitTip="Celsius" />
        <InputRow symbol="S" value={S} onChange={setS} unit="g/l" symbolTip="Water salinity" unitTip="Grams per liter" />
        <OutputRow symbol="β" value={BPE} unit="°C" symbolTip="Boiling point elevation" unitTip="Celsius" />
      </div>
    </div>
  );
}

function NEATempDiff() {
  const [dT, setDT] = useState(3);
  const [T, setT] = useState(50);
  const NEA = dT * Math.pow(0.98, T);
  return (
    <div className="converter-card">
      <SectionHeader title="Non-Equilibrium Temperature Diff." icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="ΔT" value={dT} onChange={setDT} unit="°C" symbolTip="Brine temperature drop per stage" unitTip="Celsius" />
        <InputRow symbol="Tv" value={T} onChange={setT} unit="°C" symbolTip="Saturated vapor temperature" unitTip="Celsius" />
        <OutputRow symbol="α" value={NEA} unit="°C" symbolTip="Non-equilibrium allowance" unitTip="Celsius" />
      </div>
    </div>
  );
}

function DemisterDepression() {
  const [T, setT] = useState(50);
  const dT = 1.89 * Math.exp(-0.037 * T);
  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Depression (Demister)" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Tv" value={T} onChange={setT} unit="°C" symbolTip="Saturated vapor temperature" unitTip="Celsius" />
        <OutputRow symbol="θ" value={dT} unit="°C" symbolTip="Temperature depression in demister and tube bundle" unitTip="Celsius" />
      </div>
    </div>
  );
}

function CondensingGain() {
  const [Tv, setTv] = useState(50);
  const cg = 1 * Math.exp(-0.00015 * Tv);
  return (
    <div className="converter-card">
      <SectionHeader title="Condensing Gain" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Tv" value={Tv} onChange={setTv} unit="°C" symbolTip="Saturated vapor temperature" unitTip="Celsius" />
        <OutputRow symbol="cg" value={cg} unit="-" symbolTip="Condensing gain" unitTip="Dimensionless" />
      </div>
    </div>
  );
}

// ─── Thermal Conductivity ─────────────────────────────────────────
function ThermalCondW() {
  const [v, set] = useState(12000);
  return (
    <div className="converter-card">
      <SectionHeader title="Thermal Conductivity [W/m.°C]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="k" value={v} onChange={set} unit="W/m.°C" symbolTip="Thermal conductivity" unitTip="Watt per meter per degree Celsius" />
        <OutputRow symbol="k" value={(3600 * v) / 1e6} unit="MJ/m.h.°C" symbolTip="Thermal conductivity" unitTip="Megajoule per meter per hour per degree Celsius" />
      </div>
    </div>
  );
}

function ThermalCondMJ() {
  const [v, set] = useState(7.2);
  return (
    <div className="converter-card">
      <SectionHeader title="Thermal Conductivity [MJ/m.h.°C]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="k" value={v} onChange={set} unit="MJ/m.h.°C" symbolTip="Thermal conductivity" unitTip="Megajoule per meter per hour per degree Celsius" />
        <OutputRow symbol="k" value={(1e6 * v) / 3600} unit="W/m.°C" symbolTip="Thermal conductivity" unitTip="Watt per meter per degree Celsius" />
      </div>
    </div>
  );
}

function HeatTransferCoeffW() {
  const [v, set] = useState(7000);
  return (
    <div className="converter-card">
      <SectionHeader title="Convective Heat Transfer Coeff. [W/m².°C]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="h" value={v} onChange={set} unit="W/m².°C" symbolTip="Heat transfer coefficient" unitTip="Watt per square meter per degree Celsius" />
        <OutputRow symbol="h" value={(3600 * v) / 1e6} unit="MJ/m².h.°C" symbolTip="Heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
      </div>
    </div>
  );
}

function HeatTransferCoeffMJ() {
  const [v, set] = useState(25.2);
  return (
    <div className="converter-card">
      <SectionHeader title="Convective Heat Transfer Coeff. [MJ/m².h.°C]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="h" value={v} onChange={set} unit="MJ/m².h.°C" symbolTip="Heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
        <OutputRow symbol="h" value={(1e6 * v) / 3600} unit="W/m².°C" symbolTip="Heat transfer coefficient" unitTip="Watt per square meter per degree Celsius" />
      </div>
    </div>
  );
}

function FoulingResistanceW() {
  const [v, set] = useState(0.001);
  return (
    <div className="converter-card">
      <SectionHeader title="Fouling Resistance [m².°C/W]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="FF" value={v} onChange={set} unit="m².°C/W" symbolTip="Fouling resistance" unitTip="Square meter degree Celsius per watt" />
        <OutputRow symbol="FF" value={(1e6 * v) / 3600} unit="m².h.°C/MJ" symbolTip="Fouling resistance" unitTip="Square meter hour degree Celsius per megajoule" />
      </div>
    </div>
  );
}

function FoulingResistanceMJ() {
  const [v, set] = useState(0.2778);
  return (
    <div className="converter-card">
      <SectionHeader title="Fouling Resistance [m².h.°C/MJ]" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="FF" value={v} onChange={set} unit="m².h.°C/MJ" symbolTip="Fouling resistance" unitTip="Square meter hour degree Celsius per megajoule" />
        <OutputRow symbol="FF" value={(3600 * v) / 1e6} unit="m².°C/W" symbolTip="Fouling resistance" unitTip="Square meter degree Celsius per watt" />
      </div>
    </div>
  );
}

// ─── Correlations ─────────────────────────────────────────────────
function CondenserCorrelation() {
  const [Td, setTd] = useState(70);
  const Uc = 5.76 + 0.00576 * Td + 576e-6 * Math.pow(Td, 2);
  return (
    <div className="converter-card">
      <SectionHeader title="Condenser Correlation" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Td" value={Td} onChange={setTd} unit="°C" symbolTip="Distillate temperature" unitTip="Celsius" />
        <OutputRow symbol="Uc" value={Uc} unit="MJ/m².h.°C" symbolTip="Condenser heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
      </div>
    </div>
  );
}

function EvaporatorCorrelation() {
  const [Tb, setTb] = useState(70);
  const Ue = 7.02 + 0.054 * Tb - 828e-6 * Math.pow(Tb, 2) + 864e-8 * Math.pow(Tb, 3);
  return (
    <div className="converter-card">
      <SectionHeader title="Evaporator Correlation" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Tb" value={Tb} onChange={setTb} unit="°C" symbolTip="Brine temperature" unitTip="Celsius" />
        <OutputRow symbol="Ue" value={Ue} unit="MJ/m².h.°C" symbolTip="Evaporator heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
      </div>
    </div>
  );
}

function WaterLiquidHeatExchanger() {
  const [Th1, setTh1] = useState(70);
  const [Tc2, setTc2] = useState(25);
  const Tmean = 0.5 * (Th1 + Tc2);
  const Ux = 5.76 + 0.00576 * Tmean + 576e-6 * Math.pow(Tmean, 2);
  return (
    <div className="converter-card">
      <SectionHeader title="Heat Exchanger Correlation" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Th1" value={Th1} onChange={setTh1} unit="°C" symbolTip="Hot side inlet temperature" unitTip="Celsius" />
        <InputRow symbol="Tc2" value={Tc2} onChange={setTc2} unit="°C" symbolTip="Cold side inlet temperature" unitTip="Celsius" />
        <OutputRow symbol="Ux" value={Ux} unit="MJ/m².h.°C" symbolTip="Heat exchanger heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
      </div>
    </div>
  );
}

function CounterflowHeatExchangerEffectiveness() {
  const [NTU, setNTU] = useState(2.0);
  const [Cr, setCr] = useState(0.8);
  const effectiveness = Cr === 1 
    ? NTU / (1 + NTU)
    : (1 - Math.exp(-NTU * (1 - Cr))) / (1 - Cr * Math.exp(-NTU * (1 - Cr)));
  return (
    <div className="converter-card">
      <SectionHeader title="Counterflow Heat Exchanger Effectiveness" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="NTU" value={NTU} onChange={setNTU} unit="-" symbolTip="Number of Transfer Units" unitTip="Dimensionless" />
        <InputRow symbol="Cr" value={Cr} onChange={setCr} unit="-" symbolTip="Heat capacity rate ratio (Cmin/Cmax)" unitTip="Dimensionless" />
        <OutputRow symbol="ε" value={effectiveness} unit="-" symbolTip="Heat exchanger effectiveness" unitTip="Dimensionless" />
      </div>
    </div>
  );
}

// ─── Correction Factor K (By Testing) ─────────────────────────────
function CorrectionFactorTest() {
  const [Th1, setTh1] = useState(70);
  const [Th2, setTh2] = useState(35);
  const [Tc1, setTc1] = useState(65);
  const [Tc2, setTc2] = useState(32);
  const [Q, setQ] = useState(700);
  const [A, setA] = useState(25);
  const [Ur, setUr] = useState(8.9856);

  const resetToDefaults = () => {
    setTh1(70);
    setTh2(35);
    setTc1(65);
    setTc2(32);
    setQ(700);
    setA(25);
    setUr(8.9856);
  };

  const dT1 = Th1 - Tc1;
  const dT2 = Th2 - Tc2;
  const lmtd = Math.abs(dT1 - dT2) < 0.001 ? dT1 : (dT1 - dT2) / Math.log(dT1 / dT2);
  const Ut = A > 0 && lmtd > 0 ? Q / (A * lmtd) : NaN;
  const K = Ur > 0 ? Ut / Ur : NaN;

  return (
    <div className="converter-card">
      <SectionHeader title="Heat Transfer Correction Factor K (By Testing)" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Th1" value={Th1} onChange={setTh1} unit="°C" symbolTip="Hot side inlet temperature" unitTip="Celsius" />
        <InputRow symbol="Th2" value={Th2} onChange={setTh2} unit="°C" symbolTip="Hot side outlet temperature" unitTip="Celsius" />
        <InputRow symbol="Tc1" value={Tc1} onChange={setTc1} unit="°C" symbolTip="Cold side inlet temperature" unitTip="Celsius" />
        <InputRow symbol="Tc2" value={Tc2} onChange={setTc2} unit="°C" symbolTip="Cold side outlet temperature" unitTip="Celsius" />
        <InputRow symbol="Q" value={Q} onChange={setQ} unit="MJ/h" symbolTip="Heat duty" unitTip="Megajoule per hour" />
        <InputRow symbol="A" value={A} onChange={setA} unit="m²" symbolTip="Heat transfer area" unitTip="Square meters" />
        <InputRow symbol="Ucorr" value={Ur} onChange={setUr} unit="MJ/m².h.°C" symbolTip="Correlated overall heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="LMTD" value={lmtd} unit="°C" symbolTip="Log mean temperature difference" unitTip="Celsius" />
          <OutputRow symbol="U" value={Ut} unit="MJ/m².h.°C" symbolTip="Tested overall heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
          <OutputRow symbol="K" value={K} unit="#" symbolTip="Heat transfer correction factor by testing" unitTip="Dimensionless" />
        </div>
        <ExportButtons 
          title="Heat Transfer Correction Factor K (By Testing)" 
          data={[
            { symbol: "Th1", value: fmt(Th1), unit: "°C" },
            { symbol: "Th2", value: fmt(Th2), unit: "°C" },
            { symbol: "Tc1", value: fmt(Tc1), unit: "°C" },
            { symbol: "Tc2", value: fmt(Tc2), unit: "°C" },
            { symbol: "Q", value: fmt(Q), unit: "MJ/h" },
            { symbol: "A", value: fmt(A), unit: "m²" },
            { symbol: "Ucorr", value: fmt(Ur), unit: "MJ/m².h.°C" },
            { symbol: "LMTD", value: fmt(lmtd), unit: "°C" },
            { symbol: "U", value: fmt(Ut), unit: "MJ/m².h.°C" },
            { symbol: "K", value: fmt(K), unit: "#" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ─── Correction Factor K (By Theory) ──────────────────────────────
function CorrectionFactorTheory() {
  const [hi, setHi] = useState(44);
  const [FFi, setFFi] = useState(0.01);
  const [delta, setDelta] = useState(0.001);
  const [k, setK] = useState(0.432);
  const [sigma, setSigma] = useState(1.087);
  const [FFo, setFFo] = useState(0.01);
  const [ho, setHo] = useState(12);
  const [Ur, setUr] = useState(8.9856);

  const resetToDefaults = () => {
    setHi(44);
    setFFi(0.01);
    setDelta(0.001);
    setK(0.432);
    setSigma(1.087);
    setFFo(0.01);
    setHo(12);
    setUr(8.9856);
  };

  const resistance =
    (hi > 0 ? 1 / hi : 0) + FFi + (k > 0 ? delta / k : 0) + sigma * FFo + (ho > 0 ? sigma / ho : 0);
  const Uth = resistance > 0 ? 1 / resistance : NaN;
  const K = Ur > 0 ? Uth / Ur : NaN;

  return (
    <div className="converter-card">
      <SectionHeader title="Heat Transfer Correction Factor K (By Theory)" icon={Flame} />
      <div className="p-4 space-y-1">
        <InputRow symbol="ho" value={ho} onChange={setHo} unit="MJ/m².h.°C" symbolTip={"Outside convective heat transfer coefficient ho,\nFor condensation h≈ 44 MJ/m².h.°C,\nFor pool evaporation h≈ 12 MJ/m².h.°C,\nFor film falling evaporation h≈ 33 MJ/m².h.°C,\nFor water velocity 1m/s h≈ 7 MJ/m².h.°C,\nFor water velocity 2m/s h≈ 12 MJ/m².h.°C,\nFor water velocity 3m/s h≈ 20 MJ/m².h.°C"} unitTip="Megajoule per square meter per hour per degree Celsius" />
        <InputRow symbol="FFo" value={FFo} onChange={setFFo} unit="m².h.°C/MJ" symbolTip={"Outside fouling resistances FFo,\nabout 0.08 ~ 0.2"} unitTip="Square meter hour degree Celsius per megajoule" />
        <InputRow symbol="δ" value={delta} onChange={setDelta} unit="m" symbolTip={"Wall thickness δ,\nabout 0.001 ~ 0.002 m"} unitTip="Meter" />
        <InputRow symbol="k" value={k} onChange={setK} unit="MJ/m.h.°C" symbolTip={"Wall thermal conductivity k,\nAluminum-brass: k≈ 0.432,\nCu-Ni 90/10: k≈ 0.18,\nCu-Ni 70/30: k≈ 0.108,\nStainless steel: k≈ 0.055,\nTitanium: k≈ 0.055 MJ/m.h.°C"} unitTip="Megajoule per meter per hour per degree Celsius" />
        <InputRow symbol="σ" value={sigma} onChange={setSigma} unit="#" symbolTip="Outer to inner tube radius ratio σ = Do/Di" unitTip="Dimensionless" />
        <InputRow symbol="FFi" value={FFi} onChange={setFFi} unit="m².h.°C/MJ" symbolTip={"Inside fouling resistances FFi,\nabout 0.08 ~ 0.2"} unitTip="Square meter hour degree Celsius per megajoule" />
        <InputRow symbol="hi" value={hi} onChange={setHi} unit="MJ/m².h.°C" symbolTip={"Inside convective heat transfer coefficient hi,\nFor condensation h≈ 44 MJ/m².h.°C,\nFor pool evaporation h≈ 12 MJ/m².h.°C,\nFor film falling evaporation h≈ 33 MJ/m².h.°C,\nFor water velocity 1m/s h≈ 7 MJ/m².h.°C,\nFor water velocity 2m/s h≈ 12 MJ/m².h.°C,\nFor water velocity 3m/s h≈ 20 MJ/m².h.°C"} unitTip="Megajoule per square meter per hour per degree Celsius" />
        <InputRow symbol="Ucorr" value={Ur} onChange={setUr} unit="MJ/m².h.°C" symbolTip="Overall correlated heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="U" value={Uth} unit="MJ/m².h.°C" symbolTip="Theoretical overall heat transfer coefficient" unitTip="Megajoule per square meter per hour per degree Celsius" />
          <OutputRow symbol="K" value={K} unit="#" symbolTip="Heat transfer correction factor by theory" unitTip="Dimensionless" />
        </div>
        <ExportButtons 
          title="Heat Transfer Correction Factor K (By Theory)" 
          data={[
            { symbol: "ho", value: fmt(ho), unit: "MJ/m².h.°C" },
            { symbol: "FFo", value: fmt(FFo), unit: "m².h.°C/MJ" },
            { symbol: "δ", value: fmt(delta), unit: "m" },
            { symbol: "k", value: fmt(k), unit: "MJ/m.h.°C" },
            { symbol: "σ", value: fmt(sigma), unit: "#" },
            { symbol: "FFi", value: fmt(FFi), unit: "m².h.°C/MJ" },
            { symbol: "hi", value: fmt(hi), unit: "MJ/m².h.°C" },
            { symbol: "Ucorr", value: fmt(Ur), unit: "MJ/m².h.°C" },
            { symbol: "U", value: fmt(Uth), unit: "MJ/m².h.°C" },
            { symbol: "K", value: fmt(K), unit: "#" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  WATER COST CALCULATORS
// ═══════════════════════════════════════════════════════════════════

// ─── RO Water Cost ────────────────────────────────────────────────
// ─── SWRO Water Cost ──────────────────────────────────────────────
function SWROWaterCost() {
  // Plant Configuration
  const [Md, setMd] = usePersistentState("swro.Md", 420); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("swro.M0", 933); // Raw feed water (t/h)
  const [Nn, setNn] = usePersistentState("swro.Nn", 1); // Number of trains

  // Membrane System (simplified)
  const [NPV, setNPV] = usePersistentState("swro.NPV", 50); // Total pressure vessels
  const [Nmem1, setNmem1] = usePersistentState("swro.Nmem1", 300); // Total membrane elements in first pass
  const [Nmem2, setNmem2] = usePersistentState("swro.Nmem2", 0); // Total membrane elements in second pass (0 if single pass)
  const [Cmem1, setCmem1] = usePersistentState("swro.Cmem1", 350); // Membrane element cost first pass ($/element)
  const [Cmem2, setCmem2] = usePersistentState("swro.Cmem2", 350); // Membrane element cost second pass ($/element)
  const [Cvessel, setCvessel] = usePersistentState("swro.Cvessel", 1500); // Pressure vessel cost ($/vessel)

  // Pump Specifications and Cost Factors
  const [Mfa, setMfa] = usePersistentState("swro.Mfa", 500); // First pass feed pump flow (t/h)
  const [Mfc, setMfc] = usePersistentState("swro.Mfc", 0); // Second pass feed pump flow (t/h) - 0 if single pass
  const [Pfa, setPfa] = usePersistentState("swro.Pfa", 55); // First pass pressure (bar)
  const [Mb, setMb] = usePersistentState("swro.Mb", 200); // Booster pump flow (t/h)
  const [Pfb, setPfb] = usePersistentState("swro.Pfb", 10); // Booster pump pressure (bar)
  const [Pfc, setPfc] = usePersistentState("swro.Pfc", 0); // Second pass pressure (bar) - 0 if single pass
  const [Pf0, setPf0] = usePersistentState("swro.Pf0", 3); // Intake pump pressure (bar)

  // Pump Cost Factors ($/(bar·t/h))
  const [Cpfa, setCpfa] = usePersistentState("swro.Cpfa", 15); // First pass HP pump cost factor
  const [Cpfb, setCpfb] = usePersistentState("swro.Cpfb", 12); // Booster pump cost factor
  const [Cpfc, setCpfc] = usePersistentState("swro.Cpfc", 15); // Second pass HP pump cost factor
  const [Cp0, setCp0] = usePersistentState("swro.Cp0", 8); // Intake pump cost factor

  // Pretreatment
  const [Cwt, setCwt] = usePersistentState("swro.Cwt", 150); // Water treatment cost factor ($/(t/h))

  // Chemical Dosing (L/h)
  const [Danti, setDanti] = usePersistentState("swro.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("swro.Dacid", 1.5); // Acid chemical dosing rate (L/h)

  // Operations
  const [SEC, setSEC] = usePersistentState("swro.SEC", 4.5); // Specific electricity consumption for main process (MJ/t)
    const [ELC, setELC] = usePersistentState("swro.ELC", 0.5); // Other electricity consumption (MJ/t)
  const [Celc, setCelc] = usePersistentState("swro.Celc", 0.022); // Electricity price ($/MJ)
  const [Rmem, setRmem] = usePersistentState("swro.Rmem", 15); // Membrane replacement rate (%/year)
  const [Canti, setCanti] = usePersistentState("swro.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("swro.Cacid", 0.3); // Acid cost ($/L)
  const [Cwash, setCwash] = usePersistentState("swro.Cwash", 30); // Washing chemical cost ($/element/event)
  const [Clabor, setClabor] = usePersistentState("swro.Clabor", 0.05); // Labor cost ($/t)
  const [Cmaint, setCmaint] = usePersistentState("swro.Cmaint", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("swro.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cfilter, setCfilter] = usePersistentState("swro.Cfilter", 0.007); // Cartridge filter replacement cost ($/t)
  const [Cinst, setCinst] = usePersistentState("swro.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("swro.Ceng", 8); // Engineering cost (% of equipment)
  const [Cintake, setCintake] = usePersistentState("swro.Cintake", 50); // Intake structure cost ($/(t/h))

  // Economic Parameters
  const [Y, setY] = usePersistentState("swro.Y", 25); // Plant life (yr)
  const [r, setr] = usePersistentState("swro.r", 0.06); // Discount rate
  const [LF, setLF] = usePersistentState("swro.LF", 0.90); // Load factor
  const [W, setW] = usePersistentState("swro.W", 4); // Washing events per year

  // Reset function
  const resetToDefaults = () => {
    setMd(420);
    setM0(933);
    setNn(1);
    setNPV(50);
    setNmem1(300);
    setNmem2(0);
    setCmem1(350);
    setCmem2(350);
    setCvessel(1500);
    setMfa(500);
    setMfc(0);
    setPfa(55);
    setMb(200);
    setPfb(10);
    setPfc(0);
    setPf0(3);
    setCpfa(15);
    setCpfb(12);
    setCpfc(15);
    setCp0(8);
    setCwt(150);
    setDanti(2.5);
    setDacid(1.5);
    setSEC(4.5);
    setELC(0.5);
    setCelc(0.022);
    setRmem(15);
    setCanti(2.5);
    setCacid(0.3);
    setCwash(30);
    setClabor(0.05);
    setCmaint(2);
    setCover(10);
    setCfilter(0.007);
    setCinst(15);
    setCeng(8);
    setCintake(50);
    setY(25);
    setr(0.06);
    setLF(0.90);
    setW(4);
  };

  // === CALCULATIONS ===
  
  // Total membrane elements
  const Nmem = Nmem1 + Nmem2;

  // CAPEX Calculations
  const CAPEX_mem = Nmem1 * Cmem1 + Nmem2 * Cmem2;
  const CAPEX_vessel = NPV * Cvessel;
  const CAPEX_membrane_system = CAPEX_mem + CAPEX_vessel;

  // Pump CAPEX = cost factor × (pressure × flow)^0.8 (size effect)
  const CAPEX_pump_fa = Cpfa * Math.pow(Pfa * Mfa, 0.8); // First pass HP pump
  const CAPEX_pump_fb = Cpfb * Math.pow(Pfb * Mb, 0.8); // Booster pump
  const CAPEX_pump_fc = Cpfc * Math.pow(Pfc * Mfc, 0.8); // Second pass HP pump (0 if Pfc=0)
  const CAPEX_pump_0 = Cp0 * Math.pow(Pf0 * M0, 0.8); // Intake pump
  const CAPEX_pumps = CAPEX_pump_fa + CAPEX_pump_fb + CAPEX_pump_fc + CAPEX_pump_0;

  // Pretreatment CAPEX
  const CAPEX_treat = M0 * Cwt;

  // Infrastructure CAPEX
  const CAPEX_intake_struct = M0 * Cintake;
  // Civil cost considers Nn, M0, Md
  const CAPEX_civil = 0.05 * (M0 + Md) * Nn * 1000; // $ per (t/h) scaled by trains
  const CAPEX_instrument = 0.10 * (CAPEX_membrane_system + CAPEX_pumps);
  const CAPEX_equipment = CAPEX_membrane_system + CAPEX_pumps + CAPEX_treat + CAPEX_intake_struct;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equipment;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equipment;
  const CAPEX_total = CAPEX_equipment + CAPEX_civil + CAPEX_instrument + CAPEX_inst + CAPEX_eng;
  const CAPEX_specific = CAPEX_total / Md;

  // OPEX Calculations
  const Cenergy = SEC * Celc;
  const annualProduction = Md * 8760 * LF;
  const Cmembrane = (Nmem1 * (Rmem / 100) * Cmem1 + Nmem2 * (Rmem / 100) * Cmem2) / annualProduction;
  
  // Chemical dosing costs: D (L/h) * C ($/L) = $/h, then divide by Md (t/h) = $/t
  const Cantiscalant = (Danti * Canti) / Md; // $/t
  const Cacid_dose = (Dacid * Cacid) / Md; // $/t
  const Cwashing = (Nmem * Cwash * W) / annualProduction;
  
  const OPEX_ex = (SEC * Celc) / 1000; // Main process energy cost ($/t)
  const OPEX_elc = (ELC * Celc) / 1000; // Other electricity cost ($/t)
  const Cmaint_annual = (Cmaint / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_ex + OPEX_elc + Cmembrane + Cantiscalant + Cacid_dose + Cwashing + Clabor + Cmaint_annual + Cfilter;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;

  // Final Cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const annualCAPEX = CAPEX_total * CRF; // Annualized capital cost ($/yr)
  const Ucap = annualCAPEX / annualProduction; // $/t
  const UPC = OPEX_total_with_overhead + Ucap;

  return (
    <div className="converter-card">
      <SectionHeader title="RO Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        {/* Simulator Inputs */}
        <div className="font-semibold text-xs text-muted-foreground mb-2">Simulator Inputs</div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          {/* CAPEX Inputs */}
          <InputRow symbol="Nn" value={Nn} onChange={setNn} unit="#" symbolTip="Number of trains in first and second pass" unitTip="Dimensionless" />
          <InputRow symbol="NPV" value={NPV} onChange={setNPV} unit="#" symbolTip="Total pressure vessels" unitTip="Dimensionless" />
          <InputRow symbol="Nmem1" value={Nmem1} onChange={setNmem1} unit="#" symbolTip="Total membrane elements in first pass" unitTip="Dimensionless" />
          <InputRow symbol="Nmem2" value={Nmem2} onChange={setNmem2} unit="#" symbolTip="Total membrane elements in second pass (0 if single pass)" unitTip="Dimensionless" />
          <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
          <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
          <InputRow symbol="Mb" value={Mb} onChange={setMb} unit="t/h" symbolTip="Brine water" unitTip="Metric tons per hour" />
          <InputRow symbol="Mfa" value={Mfa} onChange={setMfa} unit="t/h" symbolTip="First pass feed water" unitTip="Metric tons per hour" />
          <InputRow symbol="Mfc" value={Mfc} onChange={setMfc} unit="t/h" symbolTip="Second pass feed water; Mfc=k*Mp" unitTip="Metric tons per hour" />
          <InputRow symbol="Pfa" value={Pfa} onChange={setPfa} unit="bar" symbolTip="First pass pressure" unitTip="Bar" />
          <InputRow symbol="ΔPfb" value={Pfb} onChange={setPfb} unit="bar" symbolTip="Booster pump increment pressure; ΔPfb=BP·Pfb" unitTip="Bar" />
          <InputRow symbol="Pfc" value={Pfc} onChange={setPfc} unit="bar" symbolTip="Second pass pressure (0 if single pass)" unitTip="Bar" />
          <InputRow symbol="Pf0" value={Pf0} onChange={setPf0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
          {/* OPEX Inputs */}
          <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific electricity consumption for main process" unitTip="Megajoules per metric ton" />
          <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Other electricity consumption" unitTip="Megajoules per metric ton" />
          <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
          <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
          <InputRow symbol="W" value={W} onChange={setW} unit="#/yr" symbolTip="Washing events per year" unitTip="Events per year" />
          {/* Economic Parameters */}
          <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Plant life span" unitTip="Years" />
          <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Annual load factor (availability)" unitTip="Dimensionless" />
          <InputRow symbol="r" value={r} onChange={setr} unit="-" symbolTip="Discount rate (interest rate)" unitTip="Dimensionless" />
        </div>
        
        {/* Cost Factors */}
        <div className="font-semibold text-xs text-muted-foreground mb-2">Cost Factors</div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          {/* CAPEX Factors */}
          <InputRow symbol="Cmem1" value={Cmem1} onChange={setCmem1} unit="$/elem" symbolTip="Membrane element cost factor first pass" unitTip="Dollars per element" />
          <InputRow symbol="Cmem2" value={Cmem2} onChange={setCmem2} unit="$/elem" symbolTip="Membrane element cost factor second pass" unitTip="Dollars per element" />
          <InputRow symbol="Cvessel" value={Cvessel} onChange={setCvessel} unit="$/vessel" symbolTip="Pressure vessel cost factor" unitTip="Dollars per vessel" />
          <InputRow symbol="Cpfa" value={Cpfa} onChange={setCpfa} unit="$/(bar·t/h)" symbolTip="First pass HP pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cpfb" value={Cpfb} onChange={setCpfb} unit="$/(bar·t/h)" symbolTip="Booster pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cpfc" value={Cpfc} onChange={setCpfc} unit="$/(bar·t/h)" symbolTip="Second pass HP pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
          <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
          {/* OPEX Factors */}
          <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
          <InputRow symbol="Rmem" value={Rmem} onChange={setRmem} unit="%/yr" symbolTip="Membrane replacement rate" unitTip="Percent per year" />
          <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
          <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
          <InputRow symbol="Cwash" value={Cwash} onChange={setCwash} unit="$/element/event" symbolTip="Washing chemical cost per element per event (alkaline/acid wash, typical range $10-50/elem/event)" unitTip="Dollars per element per event" />
          <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
          <InputRow symbol="Cfilter" value={Cfilter} onChange={setCfilter} unit="$/t" symbolTip="Cartridge filter replacement cost factor" unitTip="Dollars per metric ton" />
          <InputRow symbol="Cmaint" value={Cmaint} onChange={setCmaint} unit="%/yr" symbolTip="Maintenance cost rate" unitTip="Percent of CAPEX per year" />
          <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
        </div>
        
        {/* Output CAPEXs */}
        <div className="font-semibold text-xs text-muted-foreground mb-2">Output CAPEXs</div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="CAPEX_mem" value={CAPEX_mem} unit="$" symbolTip="Membrane cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_vessel" value={CAPEX_vessel} unit="$" symbolTip="Pressure vessel cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_pumps" value={CAPEX_pumps} unit="$" symbolTip="Total pump cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_treat" value={CAPEX_treat} unit="$" symbolTip="Pretreatment and post-treatment system cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_intake" value={CAPEX_intake_struct} unit="$" symbolTip="Intake/outfall cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_civil" value={CAPEX_civil} unit="$" symbolTip="Civil works cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_instr" value={CAPEX_instrument} unit="$" symbolTip="Instrumentation cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPEX_spec" value={CAPEX_specific} unit="$/(t/h)" symbolTip="Specific CAPEX" unitTip="Dollars per t/h" />
          <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost" unitTip="Dollars per metric ton" />
        </div>
        
        {/* Output OPEXs and UPC */}
        <div className="font-semibold text-xs text-muted-foreground mb-2">Output OPEXs and UPC</div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="OPEX_ex" value={OPEX_ex} unit="$/t" symbolTip="Main process energy cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Other electricity cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_mem" value={Cmembrane} unit="$/t" symbolTip="Membrane replacement cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid dosing cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_wash" value={Cwashing} unit="$/t" symbolTip="Washing chemicals cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_filter" value={Cfilter} unit="$/t" symbolTip="Cartridge filter replacement cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_maint" value={Cmaint_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX with overhead" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost" unitTip="Dollars per metric ton" />
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="SWRO Water Cost" 
          data={[
            { symbol: "Nn", value: fmt(Nn), unit: "#" },
            { symbol: "Md", value: fmt(Md), unit: "t/h" },
            { symbol: "M0", value: fmt(M0), unit: "t/h" },
            { symbol: "NPV", value: fmt(NPV), unit: "#" },
            { symbol: "Nmem1", value: fmt(Nmem1), unit: "#" },
            { symbol: "Nmem2", value: fmt(Nmem2), unit: "#" },
            { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
            { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
            { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
            { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
            { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
            { symbol: "CAPEX_spec", value: fmt(CAPEX_specific), unit: "$/(t/h)" },
            { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ─── MSF Water Cost ───────────────────────────────────────────────
function MSFWaterCost() {
  // Group 1: Simulator Inputs
  const [Nst1, setNst1] = usePersistentState("msf.Nst1", 10); // Number of stages in first section
  const [Nst2, setNst2] = usePersistentState("msf.Nst2", 6); // Number of stages in second section
  const [Nst3, setNst3] = usePersistentState("msf.Nst3", 4); // Number of stages in third section
  const [Aa, setAa] = usePersistentState("msf.Aa", 2000); // Area of brine heater (m²)
  const [Ab, setAb] = usePersistentState("msf.Ab", 1500); // Area of each stage in the first section (m²)
  const [Ac, setAc] = usePersistentState("msf.Ac", 1000); // Area of each stage in the second section (m²)
  const [Ad, setAd] = usePersistentState("msf.Ad", 500); // Area of each stage in the third section (m²)
  const [Md, setMd] = usePersistentState("msf.Md", 2100); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("msf.M0", 2300); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("msf.Mf", 4000); // Feed water flow (t/h)
  const [Mr, setMr] = usePersistentState("msf.Mr", 3500); // Recirculating brine flow (t/h)
  const [P0, setP0] = usePersistentState("msf.P0", 2); // Intake pump pressure (bar)
  const [Pr, setPr] = usePersistentState("msf.Pr", 3); // Recirculation pump pressure (bar)
  const [Pd, setPd] = usePersistentState("msf.Pd", 2.5); // Discharge pump pressure (bar)
  const [Ptvc, setPtvc] = usePersistentState("msf.Ptvc", 0); // TVC compressor power (kW), set to 0 for standard MSF
  const [Mss, setMss] = usePersistentState("msf.Mss", 0); // Motive steam flow (t/h), set to 0 for standard MSF
  const [VC, setVC] = usePersistentState("msf.VC", 0); // Vapor compressor capacity (m³/s), set to 0 for standard MSF
  const [SEC, setSEC] = usePersistentState("msf.SEC", 120); // Specific steam exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("msf.ELC", 3.5); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("msf.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("msf.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  const [Y, setY] = usePersistentState("msf.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("msf.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("msf.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Cstg, setCstg] = usePersistentState("msf.Cstg", 8000); // Stage cost factor ($/(t/h))
  const [Caa, setCaa] = usePersistentState("msf.Caa", 150); // Heat transfer area cost section A ($/m²)
    const [Cab, setCab] = usePersistentState("msf.Cab", 140); // Heat transfer area cost section B ($/m²)
    const [Cac, setCac] = usePersistentState("msf.Cac", 130); // Heat transfer area cost section C ($/m²)
    const [Cad, setCad] = usePersistentState("msf.Cad", 120); // Heat transfer area cost section D ($/m²)
  const [Cp0, setCp0] = usePersistentState("msf.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpr, setCpr] = usePersistentState("msf.Cpr", 12); // Recirculation pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("msf.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("msf.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("msf.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Cex, setCex] = usePersistentState("msf.Cex", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("msf.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("msf.Cvc", 0); // VC cost factor ($/(m³/s)), set to 0 for standard MSF

  const [Canti, setCanti] = usePersistentState("msf.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("msf.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("msf.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("msf.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("msf.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinst, setCinst] = usePersistentState("msf.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("msf.Ceng", 8); // Engineering cost (% of equipment)

  // Reset function
  const resetToDefaults = () => {
    setNst1(10);
    setNst2(6);
    setNst3(4);
    setAa(2000);
    setAb(1500);
    setAc(1000);
    setAd(500);
    setMd(2100);
    setM0(2300);
    setMf(4000);
    setMr(3500);
    setP0(2);
    setPr(3);
    setPd(2.5);
    setPtvc(0);
    setMss(0);
    setVC(0);
    setSEC(120);
    setELC(3.5);
    setDanti(2.5);
    setDacid(1.0);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCstg(8000);
    setCaa(150);
    setCab(140);
    setCac(130);
    setCad(120);
    setCp0(8);
    setCpr(12);
    setCpd(10);
    setCwt(100);
    setCintake(50);
    setCex(0.02);
    setCelc(0.022);
    setCvc(0);
    setCanti(2.5);
    setCacid(0.3);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
    setCinst(15);
    setCeng(8);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  const Nst = Nst1 + Nst2 + Nst3;
  
  // CAPEX Calculations
  // Stage costs
  const CAPEX_stage = Nst * Md * Cstg;
  // Heat transfer area costs
  const CAPEX_heater = Aa * Caa + Nst1 * Ab * Cab + Nst2 * Ac * Cac + Nst3 * Ad * Cad;
  // Pump CAPEX with size effect (0.8 exponent)
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8);
  const CAPEX_pump_r = Cpr * Math.pow(Pr * Mr, 0.8);
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8);
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_r + CAPEX_pump_d;
  // Water treatment CAPEX
  const CAPEX_treat = M0 * Cwt;
  // Intake structure CAPEX
  const CAPEX_intake = M0 * Cintake;
  // VC CAPEX (for TVC mode)
  const CAPEX_vc = VC * Cvc;
  // Equipment total
  const CAPEX_equip = CAPEX_heater + CAPEX_stage + CAPEX_Pump + CAPEX_treat + CAPEX_intake + CAPEX_vc;
  // Installation and engineering
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  // Total CAPEX
  const CAPEX_total = CAPEX_equip + CAPEX_inst + CAPEX_eng;
  
  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_ex = SEC * Cex; // Steam cost ($/t)
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cclean = 0.01; // Cleaning cost ($/t) - placeholder
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_ex + OPEX_elc + Cantiscalant + Cacid_dose + Cclean + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;
  
  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  return (
    <div className="converter-card">
      <SectionHeader title="MSF Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        {/* Simulator Inputs */}
        <div className="font-semibold text-xs text-muted-foreground mb-2">Simulator Inputs</div>
        {/* CAPEX Inputs */}
        <InputRow symbol="Nst1" value={Nst1} onChange={setNst1} unit="#" symbolTip="Number of stages in first section" unitTip="Dimensionless" />
        <InputRow symbol="Nst2" value={Nst2} onChange={setNst2} unit="#" symbolTip="Number of stages in second section" unitTip="Dimensionless" />
        <InputRow symbol="Nst3" value={Nst3} onChange={setNst3} unit="#" symbolTip="Number of stages in third section" unitTip="Dimensionless" />
        <InputRow symbol="Aa" value={Aa} onChange={setAa} unit="m²" symbolTip="Area of brine heater" unitTip="Square meters" />
        <InputRow symbol="Ab" value={Ab} onChange={setAb} unit="m²" symbolTip="Area of each stage in the first section" unitTip="Square meters" />
        <InputRow symbol="Ac" value={Ac} onChange={setAc} unit="m²" symbolTip="Area of each stage in the second section" unitTip="Square meters" />
        <InputRow symbol="Ad" value={Ad} onChange={setAd} unit="m²" symbolTip="Area of each stage in the third section" unitTip="Square meters" />
        <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
        <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="Mf" value={Mf} onChange={setMf} unit="t/h" symbolTip="Feed water flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Mr" value={Mr} onChange={setMr} unit="t/h" symbolTip="Recirculating brine flow" unitTip="Metric tons per hour" />
        <InputRow symbol="P0" value={P0} onChange={setP0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
        <InputRow symbol="Pr" value={Pr} onChange={setPr} unit="bar" symbolTip="Recirculation pump pressure" unitTip="Bar" />
        <InputRow symbol="Pd" value={Pd} onChange={setPd} unit="bar" symbolTip="Discharge pump pressure" unitTip="Bar" />
        <InputRow symbol="VC" value={VC} onChange={setVC} unit="m³/s" symbolTip="Vapor compressor capacity" unitTip="Cubic meters per second" />
        {/* OPEX Inputs */}
        <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific steam exergy" unitTip="Megajoules per metric ton" />
        <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Electricity consumption" unitTip="Megajoules per metric ton" />
        <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
        <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
        {/* Economic Parameters */}
        <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Life span" unitTip="Years" />
        <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Load factor" unitTip="Dimensionless" />
        <InputRow symbol="r" value={r} onChange={setR} unit="-" symbolTip="Discount rate" unitTip="Dimensionless" />

        {/* Cost Factors */}
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="font-semibold text-xs text-muted-foreground mb-2">Cost Factors</div>
          {/* CAPEX Factors */}
          <InputRow symbol="Caa" value={Caa} onChange={setCaa} unit="$/m²" symbolTip="Heat transfer area cost section A" unitTip="Dollars per square meter" />
          <InputRow symbol="Cab" value={Cab} onChange={setCab} unit="$/m²" symbolTip="Heat transfer area cost section B" unitTip="Dollars per square meter" />
          <InputRow symbol="Cac" value={Cac} onChange={setCac} unit="$/m²" symbolTip="Heat transfer area cost section C" unitTip="Dollars per square meter" />
          <InputRow symbol="Cad" value={Cad} onChange={setCad} unit="$/m²" symbolTip="Heat transfer area cost section D" unitTip="Dollars per square meter" />
          <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cpr" value={Cpr} onChange={setCpr} unit="$/(bar·t/h)" symbolTip="Recirculation pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cpd" value={Cpd} onChange={setCpd} unit="$/(bar·t/h)" symbolTip="Discharge pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cvc" value={Cvc} onChange={setCvc} unit="$/(m³/s)" symbolTip="VC cost factor" unitTip="Dollars per m³/s" />
          <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
          <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
          {/* OPEX Factors */}
          <InputRow symbol="Cex" value={Cex} onChange={setCex} unit="$/MJ" symbolTip="Steam exergy cost" unitTip="Dollars per megajoule" />
          <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
          <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
          <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
          <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
          <InputRow symbol="Cmain" value={Cmain} onChange={setCmain} unit="%/yr" symbolTip="Annual maintenance cost as percentage of total CAPEX" unitTip="Percent of CAPEX per year" />
          <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
        </div>

        {/* Output CAPEXs */}
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="font-semibold text-xs text-muted-foreground mb-2">Output CAPEXs</div>
          <OutputRow symbol="CAPX_heater" value={CAPEX_heater} unit="$" symbolTip="Heat transfer area CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_stage" value={CAPEX_stage} unit="$" symbolTip="Stage CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_Pump" value={CAPEX_Pump} unit="$" symbolTip="Pump CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_treat" value={CAPEX_treat} unit="$" symbolTip="Water treatment CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_intake" value={CAPEX_intake} unit="$" symbolTip="Intake structure CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_vc" value={CAPEX_vc} unit="$" symbolTip="Vapor compressor CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
          <OutputRow symbol="CAPX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
          <OutputRow symbol="CAPX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_spec" value={CAPX_spec} unit="$/(t/h)" symbolTip="Specific CAPEX per unit capacity" unitTip="Dollars per t/h" />
          <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost per ton" unitTip="Dollars per metric ton" />
        </div>

        {/* Output OPEXs and UPC */}
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="font-semibold text-xs text-muted-foreground mb-2">Output OPEXs and UPC</div>
          <OutputRow symbol="OPEX_ex" value={OPEX_ex} unit="$/t" symbolTip="Steam cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Electricity cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant dosing cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid dosing cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_clean" value={Cclean} unit="$/t" symbolTip="Cleaning cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_maint" value={Cmain_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX with overhead" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost (UPC)" unitTip="Dollars per metric ton" />
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="MSF Water Cost" 
          data={[
            { symbol: "Md", value: fmt(Md), unit: "t/h" },
            { symbol: "M0", value: fmt(M0), unit: "t/h" },
            { symbol: "Nst1", value: fmt(Nst1), unit: "#" },
            { symbol: "Nst2", value: fmt(Nst2), unit: "#" },
            { symbol: "Nst3", value: fmt(Nst3), unit: "#" },
            { symbol: "Aa", value: fmt(Aa), unit: "m²" },
            { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
            { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
            { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
            { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
            { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
            { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ─── MVC Water Cost ──────────────────────────────────────────────
function MVCWaterCost() {
  // Group 1: Simulator Inputs
  const [Md, setMd] = usePersistentState("mvc.Md", 1000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("mvc.M0", 1100); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("mvc.Mf", 2000); // Feed water flow (t/h)
  const [Mr, setMr] = usePersistentState("mvc.Mr", 1800); // Recirculating brine flow (t/h)
  const [Mb, setMb] = usePersistentState("mvc.Mb", 900); // Brine blowdown flow (t/h)
  const [P0, setP0] = usePersistentState("mvc.P0", 2); // Intake pump pressure (bar)
  const [Pr, setPr] = usePersistentState("mvc.Pr", 3); // Recirculation pump pressure (bar)
  const [Pd, setPd] = usePersistentState("mvc.Pd", 2.5); // Discharge pump pressure (bar)
  const [Pvc, setPvc] = usePersistentState("mvc.Pvc", 1500); // Vapor compressor power (kW)
  const [VC, setVC] = usePersistentState("mvc.VC", 50); // Vapor compressor capacity (m³/s)
  const [ELC, setELC] = usePersistentState("mvc.ELC", 15); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("mvc.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("mvc.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  const [Y, setY] = usePersistentState("mvc.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("mvc.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("mvc.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Cstg, setCstg] = usePersistentState("mvc.Cstg", 8500); // Stage cost factor ($/(t/h))
  const [Cvc, setCvc] = usePersistentState("mvc.Cvc", 100000); // VC cost factor ($/(m³/s))
  const [Cp0, setCp0] = usePersistentState("mvc.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpr, setCpr] = usePersistentState("mvc.Cpr", 12); // Recirculation pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("mvc.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("mvc.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("mvc.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Celc, setCelc] = usePersistentState("mvc.Celc", 0.022); // Electricity price ($/MJ)
  const [Canti, setCanti] = usePersistentState("mvc.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("mvc.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("mvc.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("mvc.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("mvc.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinst, setCinst] = usePersistentState("mvc.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("mvc.Ceng", 8); // Engineering cost (% of equipment)

  // Reset function
  const resetToDefaults = () => {
    setMd(1000);
    setM0(1100);
    setMf(2000);
    setMr(1800);
    setMb(900);
    setP0(2);
    setPr(3);
    setPd(2.5);
    setPvc(1500);
    setVC(50);
    setELC(15);
    setDanti(2.5);
    setDacid(1.0);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCstg(8500);
    setCvc(100000);
    setCp0(8);
    setCpr(12);
    setCpd(10);
    setCwt(100);
    setCintake(50);
    setCelc(0.022);
    setCanti(2.5);
    setCacid(0.3);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
    setCinst(15);
    setCeng(8);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  
  // CAPEX Calculations
  // Stage costs
  const CAPEX_stage = Md * Cstg;
  // VC CAPEX
  const CAPEX_vc = VC * Cvc;
  // Pump CAPEX with size effect (0.8 exponent)
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8);
  const CAPEX_pump_r = Cpr * Math.pow(Pr * Mr, 0.8);
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8);
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_r + CAPEX_pump_d;
  // Water treatment CAPEX
  const CAPEX_treat = M0 * Cwt;
  // Intake structure CAPEX
  const CAPEX_intake = M0 * Cintake;
  // Equipment total
  const CAPEX_equip = CAPEX_stage + CAPEX_vc + CAPEX_Pump + CAPEX_treat + CAPEX_intake;
  // Installation and engineering
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  // Total CAPEX
  const CAPEX_total = CAPEX_equip + CAPEX_inst + CAPEX_eng;
  
  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cclean = 0.01; // Cleaning cost ($/t) - placeholder
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_elc + Cantiscalant + Cacid_dose + Cclean + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;
  
  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  return (
    <div className="converter-card">
      <SectionHeader title="MVC Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        {/* Simulator Inputs */}
        <div className="font-semibold text-xs text-muted-foreground mb-2">Simulator Inputs</div>
        {/* CAPEX Inputs */}
        <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
        <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
        <InputRow symbol="Mf" value={Mf} onChange={setMf} unit="t/h" symbolTip="Feed water flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Mr" value={Mr} onChange={setMr} unit="t/h" symbolTip="Recirculating brine flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Mb" value={Mb} onChange={setMb} unit="t/h" symbolTip="Brine blowdown flow" unitTip="Metric tons per hour" />
        <InputRow symbol="P0" value={P0} onChange={setP0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
        <InputRow symbol="Pr" value={Pr} onChange={setPr} unit="bar" symbolTip="Recirculation pump pressure" unitTip="Bar" />
        <InputRow symbol="Pd" value={Pd} onChange={setPd} unit="bar" symbolTip="Discharge pump pressure" unitTip="Bar" />
        <InputRow symbol="Pvc" value={Pvc} onChange={setPvc} unit="kW" symbolTip="Vapor compressor power" unitTip="Kilowatts" />
        <InputRow symbol="VC" value={VC} onChange={setVC} unit="m³/s" symbolTip="Vapor compressor capacity" unitTip="Cubic meters per second" />
        {/* OPEX Inputs */}
        <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Electricity consumption" unitTip="Megajoules per metric ton" />
        <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
        <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
        {/* Economic Parameters */}
        <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Life span" unitTip="Years" />
        <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Load factor" unitTip="Dimensionless" />
        <InputRow symbol="r" value={r} onChange={setR} unit="-" symbolTip="Discount rate" unitTip="Dimensionless" />

        {/* Cost Factors */}
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="font-semibold text-xs text-muted-foreground mb-2">Cost Factors</div>
          {/* CAPEX Factors */}
          <InputRow symbol="Cstg" value={Cstg} onChange={setCstg} unit="$/(t/h)" symbolTip="Stage cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cvc" value={Cvc} onChange={setCvc} unit="$/(m³/s)" symbolTip="VC cost factor" unitTip="Dollars per m³/s" />
          <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cpr" value={Cpr} onChange={setCpr} unit="$/(bar·t/h)" symbolTip="Recirculation pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cpd" value={Cpd} onChange={setCpd} unit="$/(bar·t/h)" symbolTip="Discharge pump cost factor" unitTip="Dollars per bar per t/h" />
          <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
          <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
          <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
          {/* OPEX Factors */}
          <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
          <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
          <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
          <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
          <InputRow symbol="Cmain" value={Cmain} onChange={setCmain} unit="%/yr" symbolTip="Annual maintenance cost as percentage of total CAPEX" unitTip="Percent of CAPEX per year" />
          <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
        </div>

        {/* Output CAPEXs */}
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="font-semibold text-xs text-muted-foreground mb-2">Output CAPEXs</div>
          <OutputRow symbol="CAPX_stage" value={CAPEX_stage} unit="$" symbolTip="Stage CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_vc" value={CAPEX_vc} unit="$" symbolTip="Vapor compressor CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_Pump" value={CAPEX_Pump} unit="$" symbolTip="Pump CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_treat" value={CAPEX_treat} unit="$" symbolTip="Water treatment CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_intake" value={CAPEX_intake} unit="$" symbolTip="Intake structure CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
          <OutputRow symbol="CAPX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
          <OutputRow symbol="CAPX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
          <OutputRow symbol="CAPX_spec" value={CAPX_spec} unit="$/(t/h)" symbolTip="Specific CAPEX per unit capacity" unitTip="Dollars per t/h" />
          <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost per ton" unitTip="Dollars per metric ton" />
        </div>

        {/* Output OPEXs and UPC */}
        <div className="border-t border-border/50 pt-2 mt-2">
          <div className="font-semibold text-xs text-muted-foreground mb-2">Output OPEXs and UPC</div>
          <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Electricity cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant dosing cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid dosing cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_clean" value={Cclean} unit="$/t" symbolTip="Cleaning cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_maint" value={Cmain_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX with overhead" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost (UPC)" unitTip="Dollars per metric ton" />
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="MVC Water Cost" 
          data={[
            { symbol: "Md", value: fmt(Md), unit: "t/h" },
            { symbol: "M0", value: fmt(M0), unit: "t/h" },
            { symbol: "Pvc", value: fmt(Pvc), unit: "kW" },
            { symbol: "VC", value: fmt(VC), unit: "m³/s" },
            { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
            { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
            { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
            { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
            { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}


// ─── MED Water Cost ───────────────────────────────────────────────
function MEDWaterCost() {
  const [plantCapacity, setPlantCapacity] = useState(20000);
  const [intakeWater, setIntakeWater] = useState(25000);
  const [numEffects, setNumEffects] = useState(8);
  const [heatTransferArea, setHeatTransferArea] = useState(15000);
  const [condenserArea, setCondenserArea] = useState(3000);
  const [steamFlow, setSteamFlow] = useState(40);
  const [steamPressure, setSteamPressure] = useState(3);
  const [steamPrice, setSteamPrice] = useState(0.02);
  const [pumpPower, setPumpPower] = useState(800);
  const [electricityPrice, setElectricityPrice] = useState(0.022);
  const [chemicalCost, setChemicalCost] = useState(0.04);
  const [otherCosts, setOtherCosts] = useState(0.12);
  const [plantLife, setPlantLife] = useState(25);
  const [discountRate, setDiscountRate] = useState(0.06);
  const [loadFactor, setLoadFactor] = useState(0.90);
  const [capex, setCapex] = useState(1300);

  const gainRatio = plantCapacity / steamFlow;
  const steamCost = (steamFlow * 2260 * steamPrice) / (plantCapacity * 1000);
  const pumpPowerMJ = pumpPower * 3.6;
    const electricityCost = (pumpPowerMJ * electricityPrice) / plantCapacity;
  const opexCost = steamCost + electricityCost + chemicalCost + otherCosts;
  const annualProduction = plantCapacity * 8760 * loadFactor;
  const crf = (discountRate * Math.pow(1 + discountRate, plantLife)) / (Math.pow(1 + discountRate, plantLife) - 1);
  const capitalCost = (capex * plantCapacity * crf) / annualProduction;
  const totalCost = opexCost + capitalCost;
  const unitProductionCost = totalCost;

  return (
    <div className="converter-card">
      <SectionHeader title="MED Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Md" value={plantCapacity} onChange={setPlantCapacity} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
        <InputRow symbol="M0" value={intakeWater} onChange={setIntakeWater} unit="t/h" symbolTip="Intake seawater flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Nef" value={numEffects} onChange={setNumEffects} unit="#" symbolTip="Number of MED effects" unitTip="Dimensionless" />
        <InputRow symbol="sA" value={heatTransferArea} onChange={setHeatTransferArea} unit="m²/t" symbolTip="Specific heat transfer area" unitTip="Square meters per ton per hour" />
        <InputRow symbol="Mss" value={steamFlow} onChange={setSteamFlow} unit="t/h" symbolTip="Motive steam flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Ps" value={steamPressure} onChange={setSteamPressure} unit="bar" symbolTip="Heating steam pressure" unitTip="Bar" />
        <InputRow symbol="Cs" value={steamPrice} onChange={setSteamPrice} unit="$/MJ" symbolTip="Steam cost per MJ exergy" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Ppump" value={pumpPower} onChange={setPumpPower} unit="kW" symbolTip="Total pumping power" unitTip="Kilowatts" />
        <InputRow symbol="Ce" value={electricityPrice} onChange={setElectricityPrice} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Cchem" value={chemicalCost} onChange={setChemicalCost} unit="$/t" symbolTip="Chemical treatment cost" unitTip="Dollars per metric ton" />
        <InputRow symbol="Co" value={otherCosts} onChange={setOtherCosts} unit="$/t" symbolTip="Other costs (labor, maintenance)" unitTip="Dollars per metric ton" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <InputRow symbol="L" value={plantLife} onChange={setPlantLife} unit="yr" symbolTip="Plant life span" unitTip="Years" />
          <InputRow symbol="r" value={discountRate} onChange={setDiscountRate} unit="-" symbolTip="Discount rate (interest rate)" unitTip="Dimensionless" />
          <InputRow symbol="LF" value={loadFactor} onChange={setLoadFactor} unit="-" symbolTip="Annual load factor (availability)" unitTip="Dimensionless" />
          <InputRow symbol="CAPEX" value={capex} onChange={setCapex} unit="$/(t/h)" symbolTip="Capital expenditure per unit capacity" unitTip="Dollars per metric ton per hour" />
        </div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="GR" value={gainRatio} unit="-" symbolTip="Gain output ratio (GOR)" unitTip="Dimensionless" />
          <OutputRow symbol="Csteam" value={steamCost} unit="$/t" symbolTip="Steam cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Celec" value={electricityCost} unit="$/t" symbolTip="Electricity cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="CRF" value={crf} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Capex" value={capitalCost} unit="$/t" symbolTip="Annualized capital cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Ctotal" value={totalCost} unit="$/t" symbolTip="Total water production cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={unitProductionCost} unit="$/t" symbolTip="Unit Production Cost (mean factor for comparison)" unitTip="Dollars per metric ton" />
        </div>
      </div>
    </div>
  );
}

// ─── MED-Ab (Absorption Heat Pump) Water Cost ─────────────────────
function MEDAbWaterCost() {
  const [plantCapacity, setPlantCapacity] = useState(20000);
  const [intakeWater, setIntakeWater] = useState(25000);
  const [numEffects, setNumEffects] = useState(8);
  const [heatTransferArea, setHeatTransferArea] = useState(15000);
  const [condenserArea, setCondenserArea] = useState(3000);
  const [steamFlow, setSteamFlow] = useState(35);
  const [steamPressure, setSteamPressure] = useState(3);
  const [steamPrice, setSteamPrice] = useState(0.02);
  const [pumpPower, setPumpPower] = useState(800);
  const [electricityPrice, setElectricityPrice] = useState(0.022);
  const [chemicalCost, setChemicalCost] = useState(0.04);
  const [otherCosts, setOtherCosts] = useState(0.12);
  const [plantLife, setPlantLife] = useState(25);
  const [discountRate, setDiscountRate] = useState(0.06);
  const [loadFactor, setLoadFactor] = useState(0.90);
  const [capex, setCapex] = useState(1500);
  const [cop, setCop] = useState(0.70);

  const gainRatio = plantCapacity / steamFlow * cop;
  const steamCost = (steamFlow * 2260 * steamPrice) / (plantCapacity * 1000);
  const pumpPowerMJ = pumpPower * 3.6;
    const electricityCost = (pumpPowerMJ * electricityPrice) / plantCapacity;
  const opexCost = steamCost + electricityCost + chemicalCost + otherCosts;
  const annualProduction = plantCapacity * 8760 * loadFactor;
  const crf = (discountRate * Math.pow(1 + discountRate, plantLife)) / (Math.pow(1 + discountRate, plantLife) - 1);
  const capitalCost = (capex * plantCapacity * crf) / annualProduction;
  const totalCost = opexCost + capitalCost;
  const unitProductionCost = totalCost;

  return (
    <div className="converter-card">
      <SectionHeader title="MED-Ab Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Md" value={plantCapacity} onChange={setPlantCapacity} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
        <InputRow symbol="M0" value={intakeWater} onChange={setIntakeWater} unit="t/h" symbolTip="Intake seawater flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Nef" value={numEffects} onChange={setNumEffects} unit="#" symbolTip="Number of MED effects" unitTip="Dimensionless" />
        <InputRow symbol="sA" value={heatTransferArea} onChange={setHeatTransferArea} unit="m²/t" symbolTip="Specific heat transfer area" unitTip="Square meters per ton per hour" />
        <InputRow symbol="Mss" value={steamFlow} onChange={setSteamFlow} unit="t/h" symbolTip="Motive steam flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Pss" value={steamPressure} onChange={setSteamPressure} unit="bar" symbolTip="Motive steam pressure" unitTip="Bar" />
        <InputRow symbol="COP" value={cop} onChange={setCop} unit="-" symbolTip="Absorption heat pump COP" unitTip="Dimensionless" />
        <InputRow symbol="Cs" value={steamPrice} onChange={setSteamPrice} unit="$/MJ" symbolTip="Steam cost per MJ exergy" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Ppump" value={pumpPower} onChange={setPumpPower} unit="kW" symbolTip="Total pumping power" unitTip="Kilowatts" />
        <InputRow symbol="Ce" value={electricityPrice} onChange={setElectricityPrice} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Cchem" value={chemicalCost} onChange={setChemicalCost} unit="$/t" symbolTip="Chemical treatment cost" unitTip="Dollars per metric ton" />
        <InputRow symbol="Co" value={otherCosts} onChange={setOtherCosts} unit="$/t" symbolTip="Other costs (labor, maintenance)" unitTip="Dollars per metric ton" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <InputRow symbol="L" value={plantLife} onChange={setPlantLife} unit="yr" symbolTip="Plant life span" unitTip="Years" />
          <InputRow symbol="r" value={discountRate} onChange={setDiscountRate} unit="-" symbolTip="Discount rate (interest rate)" unitTip="Dimensionless" />
          <InputRow symbol="LF" value={loadFactor} onChange={setLoadFactor} unit="-" symbolTip="Annual load factor (availability)" unitTip="Dimensionless" />
          <InputRow symbol="CAPEX" value={capex} onChange={setCapex} unit="$/(t/h)" symbolTip="Capital expenditure per unit capacity" unitTip="Dollars per metric ton per hour" />
        </div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="GR" value={gainRatio} unit="-" symbolTip="Gain output ratio (GOR)" unitTip="Dimensionless" />
          <OutputRow symbol="Csteam" value={steamCost} unit="$/t" symbolTip="Steam cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Celec" value={electricityCost} unit="$/t" symbolTip="Electricity cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="CRF" value={crf} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Capex" value={capitalCost} unit="$/t" symbolTip="Annualized capital cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Ctotal" value={totalCost} unit="$/t" symbolTip="Total water production cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={unitProductionCost} unit="$/t" symbolTip="Unit Production Cost (mean factor for comparison)" unitTip="Dollars per metric ton" />
        </div>
      </div>
    </div>
  );
}



// ─── MSH Water Cost ─────────────────────────────────────────────
function MSHWaterCost() {
  const [plantCapacity, setPlantCapacity] = useState(50000);
  const [intakeWater, setIntakeWater] = useState(55000);
  const [numMSFStages, setNumMSFStages] = useState(12);
  const [numMEDEffects, setNumMEDEffects] = useState(6);
  const [heatTransferArea, setHeatTransferArea] = useState(20000);
  const [steamFlow, setSteamFlow] = useState(100);
  const [steamPrice, setSteamPrice] = useState(0.02);
  const [recircPower, setRecircPower] = useState(1500);
  const [electricityPrice, setElectricityPrice] = useState(0.022);
  const [chemicalCost, setChemicalCost] = useState(0.05);
  const [otherCosts, setOtherCosts] = useState(0.12);
  const [plantLife, setPlantLife] = useState(25);
  const [discountRate, setDiscountRate] = useState(0.06);
  const [loadFactor, setLoadFactor] = useState(0.90);
  const [capex, setCapex] = useState(1400);

  const gainRatio = plantCapacity / steamFlow;
  const steamCost = (steamFlow * 2260 * steamPrice) / (plantCapacity * 1000);
  const recircPowerMJ = recircPower * 3.6;
    const electricityCost = (recircPowerMJ * electricityPrice) / plantCapacity;
  const opexCost = steamCost + electricityCost + chemicalCost + otherCosts;
  const annualProduction = plantCapacity * 8760 * loadFactor;
  const crf = (discountRate * Math.pow(1 + discountRate, plantLife)) / (Math.pow(1 + discountRate, plantLife) - 1);
  const capitalCost = (capex * plantCapacity * crf) / annualProduction;
  const totalCost = opexCost + capitalCost;
  const unitProductionCost = totalCost;

  return (
    <div className="converter-card">
      <SectionHeader title="MSH Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Md" value={plantCapacity} onChange={setPlantCapacity} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
        <InputRow symbol="M0" value={intakeWater} onChange={setIntakeWater} unit="t/h" symbolTip="Intake seawater flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Nmsf" value={numMSFStages} onChange={setNumMSFStages} unit="#" symbolTip="Number of MSF stages" unitTip="Dimensionless" />
        <InputRow symbol="Nmed" value={numMEDEffects} onChange={setNumMEDEffects} unit="#" symbolTip="Number of MED effects" unitTip="Dimensionless" />
        <InputRow symbol="sA" value={heatTransferArea} onChange={setHeatTransferArea} unit="m²/t" symbolTip="Specific heat transfer area" unitTip="Square meters per ton per hour" />
        <InputRow symbol="Ms" value={steamFlow} onChange={setSteamFlow} unit="t/h" symbolTip="Heating steam flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Cs" value={steamPrice} onChange={setSteamPrice} unit="$/MJ" symbolTip="Steam cost per MJ exergy" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Prec" value={recircPower} onChange={setRecircPower} unit="kW" symbolTip="Recirculation pumping power" unitTip="Kilowatts" />
        <InputRow symbol="Ce" value={electricityPrice} onChange={setElectricityPrice} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Cchem" value={chemicalCost} onChange={setChemicalCost} unit="$/t" symbolTip="Chemical treatment cost" unitTip="Dollars per metric ton" />
        <InputRow symbol="Co" value={otherCosts} onChange={setOtherCosts} unit="$/t" symbolTip="Other costs (labor, maintenance)" unitTip="Dollars per metric ton" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <InputRow symbol="L" value={plantLife} onChange={setPlantLife} unit="yr" symbolTip="Plant life span" unitTip="Years" />
          <InputRow symbol="r" value={discountRate} onChange={setDiscountRate} unit="-" symbolTip="Discount rate (interest rate)" unitTip="Dimensionless" />
          <InputRow symbol="LF" value={loadFactor} onChange={setLoadFactor} unit="-" symbolTip="Annual load factor (availability)" unitTip="Dimensionless" />
          <InputRow symbol="CAPEX" value={capex} onChange={setCapex} unit="$/(t/h)" symbolTip="Capital expenditure per unit capacity" unitTip="Dollars per metric ton per hour" />
        </div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="GR" value={gainRatio} unit="-" symbolTip="Gain output ratio (GOR)" unitTip="Dimensionless" />
          <OutputRow symbol="Csteam" value={steamCost} unit="$/t" symbolTip="Steam cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Celec" value={electricityCost} unit="$/t" symbolTip="Electricity cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="CRF" value={crf} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Capex" value={capitalCost} unit="$/t" symbolTip="Annualized capital cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Ctotal" value={totalCost} unit="$/t" symbolTip="Total water production cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={unitProductionCost} unit="$/t" symbolTip="Unit Production Cost (mean factor for comparison)" unitTip="Dollars per metric ton" />
        </div>
      </div>
    </div>
  );
}

// ─── MSH-Ab (Absorption Heat Pump) Water Cost ─────────────────────
function MSHAbWaterCost() {
  const [plantCapacity, setPlantCapacity] = useState(50000);
  const [intakeWater, setIntakeWater] = useState(55000);
  const [numMSFStages, setNumMSFStages] = useState(12);
  const [numMEDEffects, setNumMEDEffects] = useState(6);
  const [heatTransferArea, setHeatTransferArea] = useState(20000);
  const [steamFlow, setSteamFlow] = useState(90);
  const [steamPrice, setSteamPrice] = useState(0.02);
  const [recircPower, setRecircPower] = useState(1500);
  const [electricityPrice, setElectricityPrice] = useState(0.022);
  const [chemicalCost, setChemicalCost] = useState(0.05);
  const [otherCosts, setOtherCosts] = useState(0.12);
  const [plantLife, setPlantLife] = useState(25);
  const [discountRate, setDiscountRate] = useState(0.06);
  const [loadFactor, setLoadFactor] = useState(0.90);
  const [capex, setCapex] = useState(1600);
  const [cop, setCop] = useState(0.68);

  const gainRatio = plantCapacity / steamFlow * cop;
  const steamCost = (steamFlow * 2260 * steamPrice) / (plantCapacity * 1000);
  const recircPowerMJ = recircPower * 3.6;
    const electricityCost = (recircPowerMJ * electricityPrice) / plantCapacity;
  const opexCost = steamCost + electricityCost + chemicalCost + otherCosts;
  const annualProduction = plantCapacity * 8760 * loadFactor;
  const crf = (discountRate * Math.pow(1 + discountRate, plantLife)) / (Math.pow(1 + discountRate, plantLife) - 1);
  const capitalCost = (capex * plantCapacity * crf) / annualProduction;
  const totalCost = opexCost + capitalCost;
  const unitProductionCost = totalCost;

  return (
    <div className="converter-card">
      <SectionHeader title="MSH-Ab Water Cost" icon={DollarSign} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Md" value={plantCapacity} onChange={setPlantCapacity} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
        <InputRow symbol="M0" value={intakeWater} onChange={setIntakeWater} unit="t/h" symbolTip="Intake seawater flow" unitTip="Metric tons per hour" />
        <InputRow symbol="Nmsf" value={numMSFStages} onChange={setNumMSFStages} unit="#" symbolTip="Number of MSF stages" unitTip="Dimensionless" />
        <InputRow symbol="Nmed" value={numMEDEffects} onChange={setNumMEDEffects} unit="#" symbolTip="Number of MED effects" unitTip="Dimensionless" />
        <InputRow symbol="sA" value={heatTransferArea} onChange={setHeatTransferArea} unit="m²/t" symbolTip="Specific heat transfer area" unitTip="Square meters per ton per hour" />
        <InputRow symbol="Mss" value={steamFlow} onChange={setSteamFlow} unit="t/h" symbolTip="Motive steam flow" unitTip="Metric tons per hour" />
        <InputRow symbol="COP" value={cop} onChange={setCop} unit="-" symbolTip="Absorption heat pump COP" unitTip="Dimensionless" />
        <InputRow symbol="Cs" value={steamPrice} onChange={setSteamPrice} unit="$/MJ" symbolTip="Steam cost per MJ exergy" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Prec" value={recircPower} onChange={setRecircPower} unit="kW" symbolTip="Recirculation pumping power" unitTip="Kilowatts" />
        <InputRow symbol="Ce" value={electricityPrice} onChange={setElectricityPrice} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule exergy" />
        <InputRow symbol="Cchem" value={chemicalCost} onChange={setChemicalCost} unit="$/t" symbolTip="Chemical treatment cost" unitTip="Dollars per metric ton" />
        <InputRow symbol="Co" value={otherCosts} onChange={setOtherCosts} unit="$/t" symbolTip="Other costs (labor, maintenance)" unitTip="Dollars per metric ton" />
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <InputRow symbol="L" value={plantLife} onChange={setPlantLife} unit="yr" symbolTip="Plant life span" unitTip="Years" />
          <InputRow symbol="r" value={discountRate} onChange={setDiscountRate} unit="-" symbolTip="Discount rate (interest rate)" unitTip="Dimensionless" />
          <InputRow symbol="LF" value={loadFactor} onChange={setLoadFactor} unit="-" symbolTip="Annual load factor (availability)" unitTip="Dimensionless" />
          <InputRow symbol="CAPEX" value={capex} onChange={setCapex} unit="$/(t/h)" symbolTip="Capital expenditure per unit capacity" unitTip="Dollars per metric ton per hour" />
        </div>
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="GR" value={gainRatio} unit="-" symbolTip="Gain output ratio (GOR)" unitTip="Dimensionless" />
          <OutputRow symbol="Csteam" value={steamCost} unit="$/t" symbolTip="Steam cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Celec" value={electricityCost} unit="$/t" symbolTip="Electricity cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="CRF" value={crf} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
          <OutputRow symbol="Capex" value={capitalCost} unit="$/t" symbolTip="Annualized capital cost per t" unitTip="Dollars per metric ton" />
          <OutputRow symbol="Ctotal" value={totalCost} unit="$/t" symbolTip="Total water production cost" unitTip="Dollars per metric ton" />
          <OutputRow symbol="UPC" value={unitProductionCost} unit="$/t" symbolTip="Unit Production Cost (mean factor for comparison)" unitTip="Dollars per metric ton" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function BDSCalculator() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'chemistry' | 'cost'>('general');

  useEffect(() => {
    const saved = localStorage.getItem("bds-dark-mode");
    if (saved !== null) {
      setDark(saved === "true");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("bds-dark-mode", String(dark));
  }, [dark]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold tracking-tight">BDS Calculator</h1>
                <p className="text-primary-foreground/80 text-xs mt-1">Balance Desalination Simulator</p>
              </div>
            </div>
            <button
              className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-4xl mx-auto py-4 px-3">
        {/* Tab Navigation - Fixed at top */}
        <div className="mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2">
          <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-xl border border-border/50">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'general'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <Calculator className="w-4 h-4" />
              BDS Converter
            </button>
            <button
              onClick={() => setActiveTab('chemistry')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'chemistry'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <FlaskRound className="w-4 h-4" />
              Water Chemistry
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'cost'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Water Cost
            </button>
          </div>
        </div>

        {/* ─── General Tab Content ─────────────────────────────── */}
        {activeTab === 'general' && (
          <>
            {/* Tip */}
            <div className="mb-4 p-2.5 bg-secondary/50 rounded-lg border border-border/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Hover over any symbol or unit to see its full description. Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
              </p>
            </div>
            {/* BDS Converter */}
            <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            BDS Converter
          </h2>

          {/* Temperature */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <TempC /><TempK /><TempF /><TempR />
          </div>

          {/* Volume */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <VolM3 /><VolFt3 /><VolIG /><VolGl />
          </div>

          {/* Water Flow */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <FlowMIGD /><FlowM3Day /><FlowTH /><FlowKGS />
          </div>

          {/* Pressure */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <PressBar /><PressKPa /><PressMPa /><PressPsi />
          </div>

          {/* Heat Converters */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <HeatKWH /><HeatMJ /><HeatKBTU /><HeatKcal />
          </div>

          {/* Electrical Conductivity & Salinity */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <ECConverter /><SalinityConverter />
          </div>
        </section>

        {/* ─── RO Variables ────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            RO Variables
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <OsmoticPressure /><SaltRejection />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <WaterRecovery /><BrineSalinity />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <WaterFluxGFD /><WaterFluxLMH />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <WaterPermLMH /><WaterPermMS />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <SaltPermGMH /><SaltPermMS />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <ROElementPbGiven />
            <ROElementPbCorrelated />
          </div>
        </section>
          </>
        )}

        {/* ─── Water Chemistry Tab Content ─────────────────────── */}
        {activeTab === 'chemistry' && (
          <>
            {/* Tip */}
            <div className="mb-4 p-2.5 bg-secondary/50 rounded-lg border border-border/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Hover over any symbol or unit to see its full description. Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
              </p>
            </div>
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <FlaskRound className="w-5 h-5 text-primary" />
                Water Chemistry
              </h2>

              <div className="mb-5">
                <WaterAnalysis />
              </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <PHConverter />
              <NFPretreatment />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <CoagulantDosing />
              <BiocideDosing />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <DechlorinationDosing />
              <AntiscalantDosing />
            </div>
            
          </section>
          </>
        )}

        {/* ─── General Tab Content (continued) ─────────────────── */}
        {activeTab === 'general' && (
          <>
            {/* Thermal Variables */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            Thermal Variables
          </h2>

          {/* Enthalpy & Thermal */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <SpecificEnthalpy /><LatentHeat />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <SaturatedSteamEnthalpy /><SalineWaterEnthalpy />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <NEATempDiff /><BoilingPointElevation />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <DemisterDepression /><CondensingGain />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <ThermalCondW /><ThermalCondMJ />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <HeatTransferCoeffW /><HeatTransferCoeffMJ />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <FoulingResistanceW /><FoulingResistanceMJ />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <CondenserCorrelation /><EvaporatorCorrelation />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <WaterLiquidHeatExchanger /><CounterflowHeatExchangerEffectiveness />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <CorrectionFactorTest />
            <CorrectionFactorTheory />
          </div>
        </section>
          </>
        )}

        {/* ─── Water Cost Tab Content ──────────────────────────── */}
        {activeTab === 'cost' && (
          <>
            {/* Tip */}
            <div className="mb-4 p-2.5 bg-secondary/50 rounded-lg border border-border/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Hover over any symbol or unit to see its full description. Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
              </p>
            </div>
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Water Cost
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <SWROWaterCost />
                <MSFWaterCost />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <MEDWaterCost />
                <MEDAbWaterCost />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <MSHWaterCost />
                <MSHAbWaterCost />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <MVCWaterCost />
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>
          BDS Calculator &copy; {new Date().getFullYear()} | Balance Desalination Simulator, email: ahmed.qtn@gmail.com
        </p>
      </footer>
    </div>
  );
}
