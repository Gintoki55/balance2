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
interface ExportSection {
  title: string;
  rows: { symbol: string; value: string; unit: string }[];
}

function exportToPDF(title: string, sections: ExportSection[]) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  let y = 30;
  
  sections.forEach((section) => {
    // Section header
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(section.title, 14, y);
    y += 8;
    
    // Column headers
    doc.setFontSize(10);
    doc.text("Symbol", 14, y);
    doc.text("Value", 70, y);
    doc.text("Unit", 110, y);
    y += 6;
    
    // Data rows
    doc.setFont("helvetica", "normal");
    section.rows.forEach((row) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(row.symbol, 14, y);
      doc.text(row.value, 70, y);
      doc.text(row.unit, 110, y);
      y += 5;
    });
    
    y += 5; // Space between sections
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

// Export data to Excel
function exportToExcel(title: string, sections: ExportSection[]) {
  const workbook = XLSX.utils.book_new();
  
  sections.forEach((section, index) => {
    // Add section title as first row
    const dataWithHeader = [
      { Symbol: section.title, Value: "", Unit: "" },
      { Symbol: "Symbol", Value: "Value", Unit: "Unit" },
      ...section.rows.map(row => ({ Symbol: row.symbol, Value: row.value, Unit: row.unit }))
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(dataWithHeader);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, section.title.substring(0, 31) || `Sheet${index + 1}`);
  });
  
  XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}.xlsx`);
}

// Export buttons component with reset
function ExportButtons({ 
  title, 
  data,
  sections, 
  onReset 
}: { 
  title: string; 
  data?: { symbol: string; value: string; unit: string }[];
  sections?: ExportSection[];
  onReset?: () => void;
}) {
  // Convert flat data to sections format if needed
  const exportSections: ExportSection[] = sections || (data ? [{ title: "Data", rows: data }] : []);
  
  return (
    <div className="flex gap-2 mt-3 pt-2 border-t border-border/50">
      <button
        onClick={() => exportToPDF(title, exportSections)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
      >
        <FileText className="w-3 h-3" />
        PDF
      </button>
      <button
        onClick={() => exportToExcel(title, exportSections)}
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

// ─── RO Module Parameters ─────────────────────────────
function ROElementPbGiven() {
  // Custom modules stored in localStorage
  const [customModules, setCustomModules] = usePersistentState<Record<string, { A: number; Pf: number; Pb: number; Md: number; WR: number; Sf: number; Tf: number; SR: number }>>("roElementPb.customModules", {});

  const allModules = customModules;

  const [Module, setModule] = usePersistentState("roElementPb.Module", "");
  const [A, setA] = usePersistentState("roElementPb.A", 40.9);
  const [Pf, setPf] = usePersistentState("roElementPb.Pf", 55);
  const [Pb, setPb] = usePersistentState("roElementPb.Pb", 54.192);
  const [Md, setMd] = usePersistentState("roElementPb.Md", 1.2146);
  const [WR, setWR] = usePersistentState("roElementPb.WR", 8);
  const [Sf, setSf] = usePersistentState("roElementPb.Sf", 32);
  const [Tf, setTf] = usePersistentState("roElementPb.Tf", 25);
  const [SR, setSR] = usePersistentState("roElementPb.SR", 99.7);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingModule, setEditingModule] = useState("");
  const [newModuleName, setNewModuleName] = useState("");

  // Effect to update parameters when Module changes
  useEffect(() => {
    const preset = allModules[Module];
    if (preset) {
      setA(preset.A);
      setPf(preset.Pf);
      setPb(preset.Pb);
      setMd(preset.Md);
      setWR(preset.WR);
      setSf(preset.Sf);
      setTf(preset.Tf);
      setSR(preset.SR);
    }
  }, [Module]);

  // Add new module
  const handleAddModule = () => {
    if (newModuleName.trim() && !allModules[newModuleName.trim()]) {
      const newModuleData = { A, Pf, Pb, Md, WR, Sf, Tf, SR };
      setCustomModules({ ...customModules, [newModuleName.trim()]: newModuleData });
      setModule(newModuleName.trim());
      setNewModuleName("");
    }
  };

  // Start editing a module
  const startEditModule = (modName: string) => {
    setEditingModule(modName);
    setEditMode(true);
    const preset = allModules[modName];
    if (preset) {
      setA(preset.A);
      setPf(preset.Pf);
      setPb(preset.Pb);
      setMd(preset.Md);
      setWR(preset.WR);
      setSf(preset.Sf);
      setTf(preset.Tf);
      setSR(preset.SR);
    }
  };

  // Save edited module (only for custom modules)
  const saveEditedModule = () => {
    if (editingModule && customModules[editingModule]) {
      const updatedData = { A, Pf, Pb, Md, WR, Sf, Tf, SR };
      setCustomModules({ ...customModules, [editingModule]: updatedData });
    }
    setEditMode(false);
    setEditingModule("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditMode(false);
    setEditingModule("");
    // Restore to selected module values
    const preset = allModules[Module];
    if (preset) {
      setA(preset.A);
      setPf(preset.Pf);
      setPb(preset.Pb);
      setMd(preset.Md);
      setWR(preset.WR);
      setSf(preset.Sf);
      setTf(preset.Tf);
      setSR(preset.SR);
    }
  };

  // Delete a custom module
  const deleteModule = (modName: string) => {
    const updated = { ...customModules };
    delete updated[modName];
    setCustomModules(updated);
    if (Module === modName) {
      setModule("");
    }
    // Exit edit mode after deletion
    setEditMode(false);
    setEditingModule("");
  };

  const resetToDefaults = () => {
    setModule("");
    setA(40.9);
    setPf(55);
    setPb(54.192);
    setMd(1.2146);
    setWR(8);
    setSf(32);
    setTf(25);
    setSR(99.7);
    setEditMode(false);
    setEditingModule("");
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
  const Pb_corr = Pf - 0.0085 * Math.pow(Mf - 0.5 * Md, 1.7); // Correlated brine pressure
  const PCF = (Pf - Pb) / (Pf - Pb_corr);

  return (
    <div className="converter-card">
      <SectionHeader title="RO Module Parameters" icon={FlaskConical} />
      <div className="p-4">
        {/* Two-column layout: Inputs left, Outputs right */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Module controls + Inputs */}
          <div className="space-y-1">
            {/* Module management controls */}
            <div className="space-y-1 pb-2 border-b border-border/50">
              {/* Open Module */}
              <div className="flex items-center gap-2 py-1">
                <span className="font-mono text-sm w-24 text-right shrink-0" title="Select a stored membrane module">Open Module</span>
                <select
                  value={Module}
                  onChange={(e) => setModule(e.target.value)}
                  className="flex-1 h-8 px-2 text-sm bg-primary/5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">-- select --</option>
                  {Object.keys(allModules).sort().map((mod) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground w-8">-</span>
              </div>
              {/* Add Module */}
              <div className="flex items-center gap-2 py-1">
                <span className="font-mono text-sm w-24 text-right shrink-0" title="Save current values as a new module">Add Module</span>
                <input
                  type="text"
                  placeholder="New module name..."
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
                  className="flex-1 h-8 px-2 text-sm bg-amber-50/80 dark:bg-amber-900/20 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={handleAddModule}
                  disabled={!newModuleName.trim() || !!allModules[newModuleName.trim()]}
                  className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
              {/* Edit Module */}
              <div className="flex items-center gap-2 py-1">
                <span className="font-mono text-sm w-24 text-right shrink-0" title="Edit or delete a stored module">Edit Module</span>
                <select
                  value={editingModule}
                  onChange={(e) => e.target.value && startEditModule(e.target.value)}
                  className="flex-1 h-8 px-2 text-sm bg-primary/5 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">-- select --</option>
                  {Object.keys(customModules).sort().map((mod) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground w-8">-</span>
              </div>
              {/* Edit mode banner */}
              {editMode && editingModule && (
                <div className="flex items-center gap-2 py-1 px-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-md">
                  <span className="text-xs text-amber-700 dark:text-amber-400 flex-1">Editing "{editingModule}" — change values below, then Accept or Cancel</span>
                  <button onClick={saveEditedModule} className="h-7 px-3 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition-colors">Accept</button>
                  <button onClick={cancelEdit} className="h-7 px-3 text-xs rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
                  <button
                    onClick={() => deleteModule(editingModule)}
                    className="h-7 px-2 text-xs rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    title="Delete this module"
                  >
                    × Delete
                  </button>
                </div>
              )}
            </div>
            {/* Inputs */}
            <div className="pt-2 space-y-1">
              <InputRow symbol="A" value={A} onChange={setA} unit="M²" symbolTip="Membrane area" unitTip="Square meters" />
              <InputRow symbol="Pf" value={Pf} onChange={setPf} unit="bar" symbolTip="Feed pressure" unitTip="Bar" />
              <InputRow symbol="Pb" value={Pb} onChange={setPb} unit="bar" symbolTip="Brine pressure as given by test" unitTip="Bar" />
              <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product flow rate" unitTip="Tonnes per hour" />
              <InputRow symbol="WR" value={WR} onChange={setWR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
              <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
              <InputRow symbol="Tf" value={Tf} onChange={setTf} unit="°C" symbolTip="Feed temperature" unitTip="Celsius" />
              <InputRow symbol="SR" value={SR} onChange={setSR} unit="%" symbolTip="Average salt rejection, e.g. for 99.8% (99.6% minimum) average is 99.7%" unitTip="Percent" />
            </div>
          </div>
          {/* Right: Outputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
            <OutputRow symbol="Mf" value={Mf} unit="t/h" symbolTip="Feed flow rate" unitTip="Tonnes per hour" />
            <OutputRow symbol="Pb" value={Pb_corr} unit="bar" symbolTip="Brine pressure as estimated by correlation" unitTip="Bar" />
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
        </div>
        <ExportButtons 
          title="RO Module Parameters" 
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "Module", value: Module, unit: "-" },
                { symbol: "A", value: fmt(A), unit: "M²" },
                { symbol: "Pf", value: fmt(Pf), unit: "bar" },
                { symbol: "Pb", value: fmt(Pb), unit: "bar" },
                { symbol: "Md", value: fmt(Md), unit: "t/h" },
                { symbol: "WR", value: fmt(WR), unit: "%" },
                { symbol: "Sf", value: fmt(Sf), unit: "g/l" },
                { symbol: "Tf", value: fmt(Tf), unit: "°C" },
                { symbol: "SR", value: fmt(SR), unit: "%" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
                { symbol: "Pb (corr)", value: fmt(Pb_corr), unit: "bar" },
                { symbol: "Sd", value: fmt(Sd), unit: "g/l" },
                { symbol: "Sb", value: fmt(Sb), unit: "g/l" },
                { symbol: "ΔS", value: fmt(dS), unit: "g/l" },
                { symbol: "Δπ", value: fmt(dPi), unit: "bar" },
                { symbol: "ΔP", value: fmt(dP), unit: "bar" },
                { symbol: "TCF", value: fmt(TCF), unit: "#" },
                { symbol: "w", value: fmt(w), unit: "l/m².h.bar" },
                { symbol: "x", value: fmt(x), unit: "g/m².h.(g/l)" },
                { symbol: "PCF", value: fmt(PCF), unit: "#" },
              ]
            }
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
  // Cations - Arabian Sea typical values at 40 g/L salinity
  Na: 12300, K: 450, Ca: 460, Mg: 1470, Ba: 0, Sr: 9, Fe: 0,
  Li: 0, NH4: 0, Mn: 0, Al: 0, Zn: 0, Cu: 0, Pb: 0, Ni: 0, Cr: 0,
  // Anions
  Cl: 22200, SO4: 3100, HCO3: 160, CO3: 0, NO3: 0, F: 1.5,
  NO2: 0, PO4: 0, Br: 77, I: 0, HS: 0, OH: 0,
  // Neutral
  SiO2: 1, B: 5.0, CO2: 0,
};

// Water source presets (mg/l concentrations at reference salinity)
const waterSourcePresets = {
  openSea: {
    refSalinity: 40, // g/L - Arabian Sea typical salinity
    ions: {
      Na: 12300, K: 450, Ca: 460, Mg: 1470, Ba: 0, Sr: 9, Fe: 0,
      Li: 0, NH4: 0, Mn: 0, Al: 0, Zn: 0, Cu: 0, Pb: 0, Ni: 0, Cr: 0,
      Cl: 22200, SO4: 3100, HCO3: 160, CO3: 0, NO3: 0, F: 1.5,
      NO2: 0, PO4: 0, Br: 77, I: 0, HS: 0, OH: 0,
      SiO2: 1, B: 5.0, CO2: 0,
    },
    pH: 8.1, T: 30,
    // Pretreatment test typical values for Arabian Sea open water
    turbidity: 2, sdi: 2, tss: 5, cod: 5, bod: 2, totalBacteria: 500, coliform: 5,
  },
  beachWell: {
    refSalinity: 35, // g/L - Arabian Sea beach well typical salinity
    ions: {
      Na: 10800, K: 400, Ca: 420, Mg: 1300, Ba: 0.1, Sr: 8, Fe: 0.05,
      Li: 0, NH4: 0.5, Mn: 0.02, Al: 0, Zn: 0.01, Cu: 0.01, Pb: 0, Ni: 0, Cr: 0,
      Cl: 19500, SO4: 2800, HCO3: 180, CO3: 0, NO3: 2, F: 1.3,
      NO2: 0.1, PO4: 0.1, Br: 68, I: 0.05, HS: 0, OH: 0,
      SiO2: 5, B: 4.5, CO2: 10,
    },
    pH: 7.8, T: 28,
    // Pretreatment test typical values for beach well (filtered by sand)
    turbidity: 1, sdi: 1.5, tss: 2, cod: 8, bod: 3, totalBacteria: 200, coliform: 2,
  },
  brackishWater: {
    refSalinity: 5, // g/L - Arabian Sea brackish water typical salinity
    ions: {
      Na: 1550, K: 55, Ca: 180, Mg: 160, Ba: 0.5, Sr: 2, Fe: 0.2,
      Li: 0, NH4: 0.2, Mn: 0.05, Al: 0, Zn: 0.02, Cu: 0.01, Pb: 0, Ni: 0, Cr: 0,
      Cl: 2800, SO4: 600, HCO3: 350, CO3: 0, NO3: 5, F: 1.0,
      NO2: 0.05, PO4: 0.2, Br: 10, I: 0.02, HS: 0, OH: 0,
      SiO2: 15, B: 1.0, CO2: 20,
    },
    pH: 7.5, T: 27,
    // Pretreatment test typical values for brackish water (higher organic content)
    turbidity: 8, sdi: 4, tss: 15, cod: 20, bod: 8, totalBacteria: 2000, coliform: 20,
  },
};

function WaterAnalysis() {
  const [ions, setIons] = usePersistentState("waterAnalysis.ions", defaultIons);
  const [pH, setPH] = usePersistentState("waterAnalysis.pH", 8.1);
  const [balanceMode, setBalanceMode] = usePersistentState<"none" | "adjustNa" | "adjustCl">("waterAnalysis.balanceMode", "none");
  const [waterSource, setWaterSource] = usePersistentState<"openSea" | "beachWell" | "brackishWater" | "custom">("waterAnalysis.waterSource", "openSea");
  const [S0, setS0] = usePersistentState("waterAnalysis.S0", 40); // Salinity in g/L - Arabian Sea typical
  
  // Set T default based on water source
  const getDefaultT = () => waterSource !== "custom" ? waterSourcePresets[waterSource].T : 25;
  const [T, setT] = usePersistentState("waterAnalysis.T", getDefaultT());

  // Pretreatment test inputs - defaults based on water source
  const getDefaultPretreatment = () => waterSource !== "custom" ? waterSourcePresets[waterSource] : waterSourcePresets.openSea;
  const [turbidity, setTurbidity] = usePersistentState("waterAnalysis.turbidity", getDefaultPretreatment().turbidity); // NTU
  const [sdi, setSdi] = usePersistentState("waterAnalysis.sdi", getDefaultPretreatment().sdi); // Silt Density Index
  const [tss, setTss] = usePersistentState("waterAnalysis.tss", getDefaultPretreatment().tss); // Total Suspended Solids (mg/l)
  const [cod, setCod] = usePersistentState("waterAnalysis.cod", getDefaultPretreatment().cod); // Chemical Oxygen Demand (mg/l)
  const [bod, setBod] = usePersistentState("waterAnalysis.bod", getDefaultPretreatment().bod); // Biological Oxygen Demand (mg/l)
  const [totalBacteria, setTotalBacteria] = usePersistentState("waterAnalysis.totalBacteria", getDefaultPretreatment().totalBacteria); // CFU/ml
  const [coliform, setColiform] = usePersistentState("waterAnalysis.coliform", getDefaultPretreatment().coliform); // MPN/100ml

  const setIon = (key: string, val: number) => setIons(prev => ({ ...prev, [key]: val }));

  // Apply water source preset based on S0 salinity
  const applyWaterSourcePreset = (source: "openSea" | "beachWell" | "brackishWater", salinity: number) => {
    const preset = waterSourcePresets[source];
    if (!preset) return;
    
    const scaleFactor = salinity / preset.refSalinity;
    const scaledIons = { ...preset.ions };
    
    // Scale all ion concentrations proportionally to salinity change
    (Object.keys(scaledIons) as Array<keyof typeof scaledIons>).forEach(key => {
      scaledIons[key] = scaledIons[key] * scaleFactor;
    });
    
    setIons(scaledIons);
    setPH(preset.pH);
    setT(preset.T);
    setS0(salinity);
    
    // Set pretreatment test typical values
    setTurbidity(preset.turbidity);
    setSdi(preset.sdi);
    setTss(preset.tss);
    setCod(preset.cod);
    setBod(preset.bod);
    setTotalBacteria(preset.totalBacteria);
    setColiform(preset.coliform);
  };

  // Reset to default values
  const resetToDefaults = () => {
    setIons(defaultIons);
    setPH(8.1);
    setBalanceMode("none");
    setWaterSource("openSea");
    setS0(40);
    setT(waterSourcePresets.openSea.T);
    // Reset pretreatment test values to Open Sea defaults
    setTurbidity(waterSourcePresets.openSea.turbidity);
    setSdi(waterSourcePresets.openSea.sdi);
    setTss(waterSourcePresets.openSea.tss);
    setCod(waterSourcePresets.openSea.cod);
    setBod(waterSourcePresets.openSea.bod);
    setTotalBacteria(waterSourcePresets.openSea.totalBacteria);
    setColiform(waterSourcePresets.openSea.coliform);
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
    Na: "Sodium ion, major cation in seawater and brackish water",
    K: "Potassium ion, essential nutrient found in most water sources",
    Ca: "Calcium ion, primary contributor to water hardness",
    Mg: "Magnesium ion, secondary contributor to water hardness",
    Ba: "Barium ion, causes scaling (BaSO\u2084) in RO systems",
    Sr: "Strontium ion, causes scaling (SrSO\u2084) in RO concentrate",
    Fe: "Iron ion, causes fouling and staining in water systems",
    Li: "Lithium ion, found in geothermal and brine waters",
    NH4: "Ammonium ion, indicator of organic contamination or wastewater",
    Mn: "Manganese ion, common in groundwater, causes staining",
    Al: "Aluminum ion, found in acidic waters and after coagulation",
    Zn: "Zinc ion, from corrosion of galvanized pipes or industrial discharge",
    Cu: "Copper ion, from pipe corrosion or industrial sources",
    Pb: "Lead ion, from old pipes and solder, toxic heavy metal",
    Ni: "Nickel ion, from industrial discharge or stainless steel corrosion",
    Cr: "Chromium ion, from industrial discharge, regulated contaminant",
    Cl: "Chloride ion, major anion in seawater and brackish water",
    SO4: "Sulfate ion, causes scaling (CaSO\u2084) in RO systems",
    HCO3: "Bicarbonate ion, primary component of alkalinity",
    CO3: "Carbonate ion, present at high pH, contributes to alkalinity and scaling",
    NO3: "Nitrate ion, from agricultural runoff and wastewater",
    F: "Fluoride ion, naturally occurring, regulated in drinking water",
    NO2: "Nitrite ion, intermediate in nitrogen cycle, indicator of contamination",
    PO4: "Phosphate ion, from detergents, agriculture, and wastewater",
    Br: "Bromide ion, found in seawater, forms disinfection byproducts",
    I: "Iodide ion, found in brine and some groundwater sources",
    HS: "Hydrogen sulfide ion, causes odor and corrosion, from anaerobic conditions",
    OH: "Hydroxide ion, present at high pH, contributes to alkalinity",
    SiO2: "Silica, causes colloidal fouling and scaling in RO membranes",
    B: "Boron, difficult to reject by RO membranes, regulated in irrigation water",
    CO2: "Dissolved carbon dioxide, affects pH and carbonate equilibrium",
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
            value={fmt(ions[key as keyof typeof ions])}
            onChange={e => setIon(key, parseFloat(e.target.value) || 0)}
            step={0.0001}
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
          value={fmt(ions[key as keyof typeof ions])}
          onChange={e => setIon(key, parseFloat(e.target.value) || 0)}
          step={0.0001}
        />
      </td>
      <td><span className="wa-output-cell block text-muted-foreground">—</span></td>
    </tr>
  );

  return (
    <div className="converter-card">
      <SectionHeader title="Water Analysis" icon={FlaskRound} />
      <div className="p-4 space-y-4">
        {/* Water Source and S0 row */}
        <div className="flex items-center gap-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Water Source:</span>
            <select 
              className="wa-input-cell text-[10px] px-2 py-1"
              value={waterSource}
              onChange={e => {
                const newSource = e.target.value as "openSea" | "beachWell" | "brackishWater" | "custom";
                setWaterSource(newSource);
                if (newSource !== "custom") {
                  // Apply preset with the reference salinity for this water source
                  applyWaterSourcePreset(newSource, waterSourcePresets[newSource].refSalinity);
                }
              }}
            >
              <option value="openSea">Open Sea</option>
              <option value="beachWell">Beach Well</option>
              <option value="brackishWater">Brackish Water</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">S₀</span>
            <input 
              type="number" 
              className="wa-input-cell w-20 px-0.5 text-[10px]" 
              value={fmt(S0)} 
              step={0.0001}
              onChange={e => setS0(parseFloat(e.target.value) || 0)} 
            />
            <span className="text-[10px]">g/L</span>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">pH</span>
              <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={fmt(pH)}
                onChange={e => setPH(parseFloat(e.target.value) || 0)} step={0.0001} />
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">T</span>
              <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={fmt(T)}
                onChange={e => setT(parseFloat(e.target.value) || 0)} step={0.0001} />
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
                <tr>
                  <th>ion</th>
                  <th>mg/l</th>
                  <th><Tooltip content="meq/l = ion concentration (mg/l) × ion charge / molecular or atomic weight">meq/l</Tooltip></th>
                </tr>
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
                <tr>
                  <th>ion</th>
                  <th>mg/l</th>
                  <th><Tooltip content="meq/l = ion concentration (mg/l) × ion charge / molecular or atomic weight">meq/l</Tooltip></th>
                </tr>
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
                <tr>
                  <th>species</th>
                  <th>mg/l</th>
                  <th><Tooltip content="meq/l = ion concentration (mg/l) × ion charge / molecular or atomic weight">meq/l</Tooltip></th>
                </tr>
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

        {/* Raw Water Test */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Raw Water Test</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div className="flex justify-between items-center">
              <Tooltip content={"Turbidity - Measures water cloudiness caused by suspended particles,\nUnit: NTU (Nephelometric Turbidity Units),\nTypical: <1 NTU for RO, <5 NTU for media filtration,\nHigh turbidity requires coagulation/flocculation"}>Turbidity</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={turbidity}
                  onChange={e => setTurbidity(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">NTU</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content={"SDI - Silt Density Index, measures fouling potential of suspended solids,\nUnit: Dimensionless (typically 0-6),\nTypical: <3 for RO membranes, <5 for NF,\nHigh SDI indicates need for MF/UF pretreatment"}>SDI</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={sdi}
                  onChange={e => setSdi(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">-</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content={"TSS - Total Suspended Solids, measures particulate matter,\nUnit: mg/l (milligrams per liter),\nTypical: <10 mg/l for RO, <50 mg/l for media filtration,\nIndicates need for sedimentation/filtration"}>TSS</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={tss}
                  onChange={e => setTss(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">mg/l</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content={"COD - Chemical Oxygen Demand, measures organic pollutants,\nUnit: mg/l O₂ equivalent,\nTypical: <10 mg/l for pristine, <30 mg/l for treated wastewater,\nHigh COD indicates need for biological treatment"}>COD</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={cod}
                  onChange={e => setCod(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">mg/l</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content={"BOD - Biochemical Oxygen Demand, measures biodegradable organics,\nUnit: mg/l O₂ equivalent,\nTypical: <5 mg/l for pristine, <20 mg/l for municipal wastewater,\nIndicates biological treatment requirement"}>BOD</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={bod}
                  onChange={e => setBod(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">mg/l</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content={"Total Bacteria - Count of all viable bacteria,\nUnit: CFU/ml (Colony Forming Units per milliliter),\nTypical: <100 CFU/ml for drinking water, <1000 for cooling,\nHigh counts require disinfection (chlorination/UV)"}>Total Bacteria</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={totalBacteria}
                  onChange={e => setTotalBacteria(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">CFU/ml</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content={"Coliform - Indicator of fecal contamination,\nUnit: MPN/100ml (Most Probable Number per 100ml),\nTypical: 0 for drinking water, <10 for recreational,\nPresence indicates need for disinfection"}>Coliform</Tooltip>
              <div className="flex items-center gap-1">
                <input type="number" className="wa-input-cell w-20 px-0.5 text-[10px]" value={coliform}
                  onChange={e => setColiform(parseFloat(e.target.value) || 0)} />
                <span className="text-[10px]">MPN/100ml</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pretreatment Selection */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Pretreatment Selection</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span>Recommended PT</span>
              <span className="font-mono font-semibold">{
                sdi > 5 || turbidity > 10 || tss > 50 ? 'MF/UF' : 
                sdi > 3 || turbidity > 5 || tss > 20 || cod > 30 || bod > 15 || totalBacteria > 10000 ? 'NF' : 
                'Media'
              }</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Disinfection Required</span>
              <span className="font-mono font-semibold">{totalBacteria > 1000 || coliform > 10 ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Biological Treatment</span>
              <span className="font-mono font-semibold">{cod > 50 || bod > 25 ? 'Required' : bod > 10 ? 'Recommended' : 'Not Required'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Coagulation Required</span>
              <span className="font-mono font-semibold">{turbidity > 5 || tss > 10 ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="Water Analysis" 
          sections={[
            {
              title: "Physical & Chemical",
              rows: [
                { symbol: "pH", value: fmt(pH), unit: "-" },
                { symbol: "T", value: fmt(T), unit: "°C" },
                { symbol: "TDS", value: fmt(tds), unit: "mg/l" },
                { symbol: "Hardness", value: fmt(hardnessCaCO3), unit: "mg/l CaCO₃" },
                { symbol: "Alkalinity", value: fmt(alkCaCO3), unit: "mg/l CaCO₃" },
                { symbol: "Ionic Strength", value: fmt(ionicStr), unit: "mol/L" },
                { symbol: "LSI", value: fmt(lsi), unit: "-" },
                { symbol: "Balance Error", value: fmt(balanceErr), unit: "%" },
              ]
            },
            {
              title: "Pretreatment Tests",
              rows: [
                { symbol: "Turbidity", value: fmt(turbidity), unit: "NTU" },
                { symbol: "SDI", value: fmt(sdi), unit: "-" },
                { symbol: "TSS", value: fmt(tss), unit: "mg/l" },
                { symbol: "COD", value: fmt(cod), unit: "mg/l" },
                { symbol: "BOD", value: fmt(bod), unit: "mg/l" },
                { symbol: "Total Bacteria", value: fmt(totalBacteria), unit: "CFU/ml" },
                { symbol: "Coliform", value: fmt(coliform), unit: "MPN/100ml" },
              ]
            },
            {
              title: "Cations (mg/l)",
              rows: cationKeys.map(k => ({ symbol: cationSymbols[k] || k, value: fmt(ions[k as keyof typeof ions]), unit: "mg/l" }))
            },
            {
              title: "Anions & Neutral (mg/l)",
              rows: [
                ...anionKeys.map(k => ({ symbol: anionSymbols[k] || k, value: fmt(ions[k as keyof typeof ions]), unit: "mg/l" })),
                ...neutralKeys.map(k => ({ symbol: neutralSymbols[k] || k, value: fmt(ions[k as keyof typeof ions]), unit: "mg/l" })),
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "M0", value: fmt(Q), unit: "t/h" },
                { symbol: "d", value: fmt(D), unit: "g/t" },
                { symbol: "C", value: fmt(C), unit: "%" },
                { symbol: "ρ", value: fmt(rho), unit: "g/L" },
              ]
            },
            {
              title: "Output",
              rows: [
                { symbol: "D", value: fmt(lH), unit: "L/h" },
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "M0", value: fmt(Q), unit: "t/h" },
                { symbol: "d", value: fmt(D), unit: "g/t" },
                { symbol: "C", value: fmt(C), unit: "%" },
                { symbol: "ρ", value: fmt(rho), unit: "g/L" },
              ]
            },
            {
              title: "Output",
              rows: [
                { symbol: "D", value: fmt(lH), unit: "L/h" },
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "M0", value: fmt(Q), unit: "t/h" },
                { symbol: "d", value: fmt(D), unit: "g/t" },
                { symbol: "C", value: fmt(C), unit: "%" },
                { symbol: "ρ", value: fmt(rho), unit: "g/L" },
              ]
            },
            {
              title: "Output",
              rows: [
                { symbol: "D", value: fmt(lH), unit: "L/h" },
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "M0", value: fmt(Q), unit: "t/h" },
                { symbol: "d", value: fmt(D), unit: "g/t" },
                { symbol: "C", value: fmt(C), unit: "%" },
                { symbol: "ρ", value: fmt(rho), unit: "g/L" },
              ]
            },
            {
              title: "Output",
              rows: [
                { symbol: "D", value: fmt(lH), unit: "L/h" },
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "M0", value: fmt(Q), unit: "t/h" },
                { symbol: "d", value: fmt(D), unit: "g/t" },
                { symbol: "C", value: fmt(C), unit: "%" },
                { symbol: "ρ", value: fmt(rho), unit: "g/L" },
              ]
            },
            {
              title: "Output",
              rows: [
                { symbol: "D", value: fmt(lH), unit: "L/h" },
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "Th1", value: fmt(Th1), unit: "°C" },
                { symbol: "Th2", value: fmt(Th2), unit: "°C" },
                { symbol: "Tc1", value: fmt(Tc1), unit: "°C" },
                { symbol: "Tc2", value: fmt(Tc2), unit: "°C" },
                { symbol: "Q", value: fmt(Q), unit: "MJ/h" },
                { symbol: "A", value: fmt(A), unit: "m²" },
                { symbol: "Ucorr", value: fmt(Ur), unit: "MJ/m².h.°C" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "LMTD", value: fmt(lmtd), unit: "°C" },
                { symbol: "U", value: fmt(Ut), unit: "MJ/m².h.°C" },
                { symbol: "K", value: fmt(K), unit: "#" },
              ]
            }
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
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "ho", value: fmt(ho), unit: "MJ/m².h.°C" },
                { symbol: "FFo", value: fmt(FFo), unit: "m².h.°C/MJ" },
                { symbol: "δ", value: fmt(delta), unit: "m" },
                { symbol: "k", value: fmt(k), unit: "MJ/m.h.°C" },
                { symbol: "σ", value: fmt(sigma), unit: "#" },
                { symbol: "FFi", value: fmt(FFi), unit: "m².h.°C/MJ" },
                { symbol: "hi", value: fmt(hi), unit: "MJ/m².h.°C" },
                { symbol: "Ucorr", value: fmt(Ur), unit: "MJ/m².h.°C" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "U", value: fmt(Uth), unit: "MJ/m².h.°C" },
                { symbol: "K", value: fmt(K), unit: "#" },
              ]
            }
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
function ROWaterCost() {
  // Plant Configuration
  const [Md, setMd] = usePersistentState("ro.Md", 1000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("ro.M0", 2000); // Raw feed water (t/h)
  const [Na, setNa] = usePersistentState("ro.Na", 2); // Number of trains in first pass
  const [Nc, setNc] = usePersistentState("ro.Nc", 1); // Number of trains in second pass

  // Membrane System
  const [PV1, setPV1] = usePersistentState("ro.PV1", 110); // Pressure vessels in first stage
  const [PV2, setPV2] = usePersistentState("ro.PV2", 77); // Pressure vessels in second stage
  const [PV3, setPV3] = usePersistentState("ro.PV3", 72); // Pressure vessels in third stage
  const [PV4, setPV4] = usePersistentState("ro.PV4", 31); // Pressure vessels in fourth stage
  const [Mem1, setMem1] = usePersistentState("ro.Mem1", 7); // Elements per vessel in first stage
  const [Mem2, setMem2] = usePersistentState("ro.Mem2", 7); // Elements per vessel in second stage
  const [Mem3, setMem3] = usePersistentState("ro.Mem3", 7); // Elements per vessel in third stage
  const [Mem4, setMem4] = usePersistentState("ro.Mem4", 7); // Elements per vessel in fourth stage
  const [Cnn, setCnn] = usePersistentState("ro.Cnn", 50000); // Cost factor per train ($/train)
  const [Cpv, setCpv] = usePersistentState("ro.Cpv", 800); // Pressure vessel cost ($/vessel)
  const [Cmem1, setCmem1] = usePersistentState("ro.Cmem1", 600); // Membrane element cost first pass ($/element)
  const [Cmem2, setCmem2] = usePersistentState("ro.Cmem2", 500); // Membrane element cost second pass ($/element)

  // Pump Specifications and Cost Factors
  const [Mfa, setMfa] = usePersistentState("ro.Mfa", 2000); // First pass feed pump flow (t/h)
  const [Mfc, setMfc] = usePersistentState("ro.Mfc", 720); // Second pass feed pump flow (t/h) - 0 if single pass
  const [Pfa, setPfa] = usePersistentState("ro.Pfa", 48.5); // First pass pressure (bar)
  const [Mb, setMb] = usePersistentState("ro.Mb", 1000); // Booster pump flow (t/h)
  const [Pfb, setPfb] = usePersistentState("ro.Pfb", 18); // Booster pump pressure (bar)
  const [Pfc, setPfc] = usePersistentState("ro.Pfc", 10.5); // Second pass pressure (bar) - 0 if single pass
  const [Pf0, setPf0] = usePersistentState("ro.Pf0", 5); // Intake pump pressure (bar)

  // Pump Cost Factors ($/(bar·t/h))
  const [Cpfa, setCpfa] = usePersistentState("ro.Cpfa", 250); // First pass HP pump cost factor
  const [Cpfb, setCpfb] = usePersistentState("ro.Cpfb", 25); // Booster pump cost factor
  const [Cpfc, setCpfc] = usePersistentState("ro.Cpfc", 25); // Second pass HP pump cost factor
  const [Cp0, setCp0] = usePersistentState("ro.Cp0", 80); // Intake pump cost factor

  // Pretreatment
  const [Cwt, setCwt] = usePersistentState("ro.Cwt", 800); // Water treatment cost factor ($/(t/h))

  // Chemical Dosing (L/h)
  const [Danti, setDanti] = usePersistentState("ro.Danti", 2); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("ro.Dacid", 2); // Acid chemical dosing rate (L/h)

  // Operations
  const [SEC, setSEC] = usePersistentState("ro.SEC", 12.7); // Specific electricity consumption for main process (MJ/t)
    const [ELC, setELC] = usePersistentState("ro.ELC", 0.7); // Other electricity consumption (MJ/t)
  const [Celc, setCelc] = usePersistentState("ro.Celc", 0.022); // Electricity price ($/MJ)
  const [Rmem, setRmem] = usePersistentState("ro.Rmem", 15); // Membrane replacement rate (%/year)
  const [Canti, setCanti] = usePersistentState("ro.Canti", 2); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("ro.Cacid", 2); // Acid cost ($/L)
  const [Cwash, setCwash] = usePersistentState("ro.Cwash", 25); // Washing chemical cost ($/element/event)
  const [Clabor, setClabor] = usePersistentState("ro.Clabor", 0.05); // Labor cost ($/t)
  const [Cmaint, setCmaint] = usePersistentState("ro.Cmaint", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("ro.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cfilter, setCfilter] = usePersistentState("ro.Cfilter", 0.005); // Cartridge filter replacement cost ($/t)
  const [Cinstr, setCinstr] = usePersistentState("ro.Cinstr", 8); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("ro.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("ro.Ceng", 8); // Engineering cost (% of equipment)
  const [Cintake, setCintake] = usePersistentState("ro.Cintake", 400); // Intake structure cost ($/(t/h))
  const [Ccivil, setCcivil] = usePersistentState("ro.Ccivil", 5); // Civil works cost (% of ((Na+Nc)*(M0+Md)*1000))

  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("ro.pV", 7.5); // Feed water pH
  const [T0, setT0] = usePersistentState("ro.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("ro.S0", 40); // Feed water salinity (g/L)
  const [Sd, setSd] = usePersistentState("ro.Sd", 0.200); // Product water salinity (g/L)

  // Economic Parameters
  const [Y, setY] = usePersistentState("ro.Y", 25); // Plant life (yr)
  const [r, setr] = usePersistentState("ro.r", 0.06); // Discount rate
  const [LF, setLF] = usePersistentState("ro.LF", 0.90); // Load factor
  const [W, setW] = usePersistentState("ro.W", 4); // Washing events per year

  // Reset function
  const resetToDefaults = () => {
    setMd(1000);
    setM0(2000);
    setNa(2);
    setNc(1);
    setPV1(110);
    setPV2(77);
    setPV3(72);
    setPV4(31);
    setMem1(7);
    setMem2(7);
    setMem3(7);
    setMem4(7);
    setCnn(50000);
    setCpv(800);
    setCmem1(600);
    setCmem2(500);
    setMfa(2000);
    setMfc(720);
    setPfa(48.5);
    setMb(1000);
    setPfb(18);
    setPfc(10.5);
    setPf0(5);
    setCpfa(250);
    setCpfb(25);
    setCpfc(25);
    setCp0(80);
    setCwt(800);
    setDanti(2);
    setDacid(2);
    setSEC(12.7);
    setELC(0.7);
    setCelc(0.022);
    setRmem(15);
    setCanti(2);
    setCacid(2);
    setCwash(25);
    setClabor(0.05);
    setCmaint(2);
    setCover(10);
    setCfilter(0.005);
    setCinstr(8);
    setCinst(15);
    setCeng(8);
    setCintake(400);
    setCcivil(5);
    setpV(7.5);
    setT0(30);
    setS0(40);
    setSd(0.200);
    setY(25);
    setr(0.06);
    setLF(0.90);
    setW(4);
  };

  // === CALCULATIONS ===
  
  // Total pressure vessels
  const NPV_total = Na * (PV1 + PV2) + Nc * (PV3 + PV4);
  
  // Total membrane elements by stage
  const Nmem1_total = Na * (PV1 * Mem1 + PV2 * Mem2); // First pass elements
  const Nmem2_total = Nc * (PV3 * Mem3 + PV4 * Mem4); // Second pass elements
  const Nmem = Nmem1_total + Nmem2_total;

  // CAPEX Calculations
  const CAPEX_mem = Na * (PV1 * Mem1 + PV2 * Mem2) * Cmem1 + Nc * (PV3 * Mem3 + PV4 * Mem4) * Cmem2;
  const CAPEX_pv = (Na * (PV1 + PV2) + Nc * (PV3 + PV4)) * Cpv;
  const CAPEX_membrane_system = CAPEX_mem + CAPEX_pv;

  // Pump CAPEX = cost factor × (pressure × flow)^0.8 (size effect)
  const CAPEX_pump_fa = Cpfa * Math.pow(Pfa * Mfa, 0.8); // First pass HP pump
  const CAPEX_pump_fb = Cpfb * Math.pow(Pfb * Mb, 0.8); // Booster pump
  const CAPEX_pump_fc = Cpfc * Math.pow(Pfc * Mfc, 0.8); // Second pass HP pump (0 if Pfc=0)
  const CAPEX_pump_0 = Cp0 * Math.pow(Pf0 * M0, 0.8); // Intake pump
  const CAPEX_pumps = CAPEX_pump_fa + CAPEX_pump_fb + CAPEX_pump_fc + CAPEX_pump_0;

  // Pretreatment CAPEX
  const CAPEX_wt = M0 * Cwt;

  // Infrastructure CAPEX
  const CAPEX_intake_struct = M0 * Cintake;
  const CAPEX_instrument = (Cinstr / 100) * (CAPEX_membrane_system + CAPEX_pumps);
  const CAPEX_equipment = CAPEX_membrane_system + CAPEX_pumps + CAPEX_wt + CAPEX_intake_struct;
  const CAPEX_equip = CAPEX_equipment; // Alias for consistency with other tables
  // Civil cost as % of equipment (consistent with other tables)
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equipment;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equipment;
  const CAPEX_nn = (Na + Nc) * Cnn; // Multi-train branching cost based on total number of trains
  const CAPEX_total = CAPEX_equipment + CAPEX_civil + CAPEX_instrument + CAPEX_inst + CAPEX_eng + CAPEX_nn;
  const CAPEX_specific = CAPEX_total / Md;

  // OPEX Calculations
  const Cenergy = SEC * Celc;
  const annualProduction = Md * 8760 * LF;
  const Cmembrane = (Nmem1_total * (Rmem / 100) * Cmem1 + Nmem2_total * (Rmem / 100) * Cmem2) / annualProduction;
  
  // Chemical dosing costs: D (L/h) * C ($/L) = $/h, then divide by Md (t/h) = $/t
  const Cantiscalant = (Danti * Canti) / Md; // $/t
  const Cacid_dose = (Dacid * Cacid) / Md; // $/t
  const Cwashing = (Nmem * Cwash * W) / annualProduction;
  
  const OPEX_sec = SEC * Celc; // Specific energy consumption cost ($/t)
  const OPEX_elc = ELC * Celc; // Other electricity cost ($/t)
  const Cmaint_annual = (Cmaint / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_sec + OPEX_elc + Cmembrane + Cantiscalant + Cacid_dose + Cwashing + Clabor + Cmaint_annual + Cfilter;
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
      <div className="p-4">
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Column 1 - Inputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Inputs</div>
            <InputRow symbol="Na" value={Na} onChange={setNa} unit="#" symbolTip="Number of trains in first pass" unitTip="Dimensionless" />
            <InputRow symbol="Nc" value={Nc} onChange={setNc} unit="#" symbolTip="Number of trains in second pass" unitTip="Dimensionless" />
            <InputRow symbol="PV1" value={PV1} onChange={setPV1} unit="#" symbolTip="Number of pressure vessels in first stage" unitTip="Dimensionless" />
            <InputRow symbol="PV2" value={PV2} onChange={setPV2} unit="#" symbolTip="Number of pressure vessels in second stage" unitTip="Dimensionless" />
            <InputRow symbol="PV3" value={PV3} onChange={setPV3} unit="#" symbolTip="Number of pressure vessels in third stage" unitTip="Dimensionless" />
            <InputRow symbol="PV4" value={PV4} onChange={setPV4} unit="#" symbolTip="Number of pressure vessels in fourth stage" unitTip="Dimensionless" />
            <InputRow symbol="Mem1" value={Mem1} onChange={setMem1} unit="#" symbolTip="Number of elements in each pressure vessel of first stage" unitTip="Dimensionless" />
            <InputRow symbol="Mem2" value={Mem2} onChange={setMem2} unit="#" symbolTip="Number of elements in each pressure vessel of second stage" unitTip="Dimensionless" />
            <InputRow symbol="Mem3" value={Mem3} onChange={setMem3} unit="#" symbolTip="Number of elements in each pressure vessel of third stage" unitTip="Dimensionless" />
            <InputRow symbol="Mem4" value={Mem4} onChange={setMem4} unit="#" symbolTip="Number of elements in each pressure vessel of fourth stage" unitTip="Dimensionless" />
            <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
            <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
            <InputRow symbol="Mb" value={Mb} onChange={setMb} unit="t/h" symbolTip="Brine water" unitTip="Metric tons per hour" />
            <InputRow symbol="Mfa" value={Mfa} onChange={setMfa} unit="t/h" symbolTip="First pass feed water" unitTip="Metric tons per hour" />
            <InputRow symbol="Mfc" value={Mfc} onChange={setMfc} unit="t/h" symbolTip="Second pass feed water; Mfc=k*Mp" unitTip="Metric tons per hour" />
            <InputRow symbol="Pfa" value={Pfa} onChange={setPfa} unit="bar" symbolTip="First pass pressure" unitTip="Bar" />
            <InputRow symbol="ΔPfb" value={Pfb} onChange={setPfb} unit="bar" symbolTip="Booster pump increment pressure; ΔPfb=BP·Pfb" unitTip="Bar" />
            <InputRow symbol="Pfc" value={Pfc} onChange={setPfc} unit="bar" symbolTip="Second pass pressure (0 if single pass)" unitTip="Bar" />
            <InputRow symbol="Pf0" value={Pf0} onChange={setPf0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
            <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific electricity consumption for main process" unitTip="Megajoules per metric ton" />
            <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Other electricity consumption" unitTip="Megajoules per metric ton" />
            <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="pV" value={pV} onChange={setpV} unit="-" symbolTip="Feed water pH" unitTip="Dimensionless" />
            <InputRow symbol="T0" value={T0} onChange={setT0} unit="°C" symbolTip="Feed water temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/L" symbolTip="Feed water salinity" unitTip="Grams per liter" />
            <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/L" symbolTip="Product water salinity" unitTip="Grams per liter" />
          </div>

          {/* Column 2 - Factors */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Factors</div>
            <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Plant life span" unitTip="Years" />
            <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Annual load factor (availability)" unitTip="Dimensionless" />
            <InputRow symbol="r" value={r} onChange={setr} unit="-" symbolTip="Discount rate (interest rate)" unitTip="Dimensionless" />
            <InputRow symbol="Cnn" value={Cnn} onChange={setCnn} unit="$/train" symbolTip="Cost factor per train" unitTip="Dollars per train" />
            <InputRow symbol="Cpv" value={Cpv} onChange={setCpv} unit="$/vessel" symbolTip="Pressure vessel cost factor" unitTip="Dollars per vessel" />
            <InputRow symbol="Cmem1" value={Cmem1} onChange={setCmem1} unit="$/elem" symbolTip="Membrane element cost factor first pass" unitTip="Dollars per element" />
            <InputRow symbol="Cmem2" value={Cmem2} onChange={setCmem2} unit="$/elem" symbolTip="Membrane element cost factor second pass" unitTip="Dollars per element" />
            <InputRow symbol="Cpfa" value={Cpfa} onChange={setCpfa} unit="$/(bar·t/h)" symbolTip="First pass HP pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpfb" value={Cpfb} onChange={setCpfb} unit="$/(bar·t/h)" symbolTip="Booster pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpfc" value={Cpfc} onChange={setCpfc} unit="$/(bar·t/h)" symbolTip="Second pass HP pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Ccivil" value={Ccivil} onChange={setCcivil} unit="%" symbolTip="Civil works cost % of CAPEX_equip" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinstr" value={Cinstr} onChange={setCinstr} unit="%" symbolTip="Instrumentation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
            <InputRow symbol="Rmem" value={Rmem} onChange={setRmem} unit="%/yr" symbolTip="Membrane replacement rate" unitTip="Percent per year" />
            <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Cwash" value={Cwash} onChange={setCwash} unit="$/elem/ev" symbolTip="Washing chemical cost per element per event" unitTip="Dollars per element per event" />
            <InputRow symbol="W" value={W} onChange={setW} unit="#/yr" symbolTip="Washing events per year" unitTip="Events per year" />
            <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
            <InputRow symbol="Cfilter" value={Cfilter} onChange={setCfilter} unit="$/t" symbolTip="Cartridge filter replacement cost factor" unitTip="Dollars per metric ton" />
            <InputRow symbol="Cmaint" value={Cmaint} onChange={setCmaint} unit="%/yr" symbolTip="Maintenance cost rate" unitTip="Percent of CAPEX per year" />
            <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
          </div>

          {/* Column 3 - Outputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
            <OutputRow symbol="CAPEX_pv" value={CAPEX_pv} unit="$" symbolTip="Pressure vessel cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_mem" value={CAPEX_mem} unit="$" symbolTip="Membrane cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_pumps" value={CAPEX_pumps} unit="$" symbolTip="Total pump cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_wt" value={CAPEX_wt} unit="$" symbolTip="Pretreatment and post-treatment system cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_intake" value={CAPEX_intake_struct} unit="$" symbolTip="Intake/outfall cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_civil" value={CAPEX_civil} unit="$" symbolTip="Civil works cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_instr" value={CAPEX_instrument} unit="$" symbolTip="Instrumentation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_nn" value={CAPEX_nn} unit="$" symbolTip="Multi-train branching cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_spec" value={CAPEX_specific} unit="$/(t/h)" symbolTip="Specific CAPEX" unitTip="Dollars per t/h" />
            <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
            <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost" unitTip="Dollars per metric ton" />

            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
              <OutputRow symbol="OPEX_sec" value={OPEX_sec} unit="$/t" symbolTip="Specific exergy consumption cost" unitTip="Dollars per metric ton" />
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
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="RO Water Cost"
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "Na", value: fmt(Na), unit: "#" },
                { symbol: "Nc", value: fmt(Nc), unit: "#" },
                { symbol: "Md", value: fmt(Md), unit: "t/h" },
                { symbol: "M0", value: fmt(M0), unit: "t/h" },
                { symbol: "PV1", value: fmt(PV1), unit: "#" },
                { symbol: "PV2", value: fmt(PV2), unit: "#" },
                { symbol: "PV3", value: fmt(PV3), unit: "#" },
                { symbol: "PV4", value: fmt(PV4), unit: "#" },
                { symbol: "Mem1", value: fmt(Mem1), unit: "#" },
                { symbol: "Mem2", value: fmt(Mem2), unit: "#" },
                { symbol: "Mem3", value: fmt(Mem3), unit: "#" },
                { symbol: "Mem4", value: fmt(Mem4), unit: "#" },
                { symbol: "Mfa", value: fmt(Mfa), unit: "t/h" },
                { symbol: "Mfc", value: fmt(Mfc), unit: "t/h" },
                { symbol: "Pfa", value: fmt(Pfa), unit: "bar" },
                { symbol: "Mb", value: fmt(Mb), unit: "t/h" },
                { symbol: "Pfb", value: fmt(Pfb), unit: "bar" },
                { symbol: "Pfc", value: fmt(Pfc), unit: "bar" },
                { symbol: "Pf0", value: fmt(Pf0), unit: "bar" },
                { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
                { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
                { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
                { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
                { symbol: "pV", value: fmt(pV), unit: "-" },
                { symbol: "T0", value: fmt(T0), unit: "°C" },
                { symbol: "S0", value: fmt(S0), unit: "g/L" },
                { symbol: "Sd", value: fmt(Sd), unit: "g/L" },
              ]
            },
            {
              title: "Factors",
              rows: [
                { symbol: "Y", value: fmt(Y), unit: "yr" },
                { symbol: "LF", value: fmt(LF), unit: "-" },
                { symbol: "r", value: fmt(r), unit: "-" },
                { symbol: "Cnn", value: fmt(Cnn), unit: "$/train" },
                { symbol: "Cmem1", value: fmt(Cmem1), unit: "$/element" },
                { symbol: "Cmem2", value: fmt(Cmem2), unit: "$/element" },
                { symbol: "Cpv", value: fmt(Cpv), unit: "$/vessel" },
                { symbol: "Cpfa", value: fmt(Cpfa), unit: "$/(bar·t/h)" },
                { symbol: "Cpfb", value: fmt(Cpfb), unit: "$/(bar·t/h)" },
                { symbol: "Cpfc", value: fmt(Cpfc), unit: "$/(bar·t/h)" },
                { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
                { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
                { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },
                { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
                { symbol: "Cinstr", value: fmt(Cinstr), unit: "%" },
                { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
                { symbol: "Ceng", value: fmt(Ceng), unit: "%" },
                { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
                { symbol: "Rmem", value: fmt(Rmem), unit: "%/yr" },
                { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
                { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
                { symbol: "Cwash", value: fmt(Cwash), unit: "$/element/event" },
                { symbol: "W", value: fmt(W), unit: "#/yr" },
                { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "Cfilter", value: fmt(Cfilter), unit: "$/t" },
                { symbol: "Cmaint", value: fmt(Cmaint), unit: "%/yr" },
                { symbol: "Cover", value: fmt(Cover), unit: "%" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "CAPEX_mem", value: fmt(CAPEX_mem), unit: "$" },
                { symbol: "CAPEX_pv", value: fmt(CAPEX_pv), unit: "$" },
                { symbol: "CAPEX_pumps", value: fmt(CAPEX_pumps), unit: "$" },
                { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
                { symbol: "CAPEX_intake", value: fmt(CAPEX_intake_struct), unit: "$" },
                { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
                { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
                { symbol: "CAPEX_instr", value: fmt(CAPEX_instrument), unit: "$" },
                { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
                { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },
                { symbol: "CAPEX_nn", value: fmt(CAPEX_nn), unit: "$" },
                { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
                { symbol: "CAPEX_spec", value: fmt(CAPEX_specific), unit: "$/(t/h)" },
                { symbol: "CRF", value: fmt(CRF), unit: "-" },
                { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },
                { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
                { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
                { symbol: "OPEX_mem", value: fmt(Cmembrane), unit: "$/t" },
                { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
                { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },
                { symbol: "OPEX_wash", value: fmt(Cwashing), unit: "$/t" },
                { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "OPEX_filter", value: fmt(Cfilter), unit: "$/t" },
                { symbol: "OPEX_maint", value: fmt(Cmaint_annual), unit: "$/t" },
                { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
                { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },
                { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
              ]
            }
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
  const [AZ, setAZ] = usePersistentState("msf.AZ", 0); // Absorber capacity (m³/s), set to 0 for standard MSF
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
  const [Csec, setCsec] = usePersistentState("msf.Csec", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("msf.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("msf.Cvc", 0); // VC cost factor ($/(m³/s)), set to 0 for standard MSF
  const [Caz, setCaz] = usePersistentState("msf.Caz", 0); // Absorber capacity factor ($/(m³/s)), set to 0 for standard MSF

  const [Canti, setCanti] = usePersistentState("msf.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("msf.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("msf.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("msf.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("msf.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinstr, setCinstr] = usePersistentState("msf.Cinstr", 10); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("msf.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("msf.Ceng", 8); // Engineering cost (% of equipment)
  const [Ccivil, setCcivil] = usePersistentState("msf.Ccivil", 5); // Civil works cost (% of CAPEX_equip)

  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("msf.pV", 7.5); // Feed water pH
  const [Th, setTh] = usePersistentState("msf.Th", 115); // Brine heater temperature (°C)
  const [Tb, setTb] = usePersistentState("msf.Tb", 40); // Brine blowdown temperature (°C)
  const [T0, setT0] = usePersistentState("msf.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("msf.S0", 40); // Feed water salinity (g/L)

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
    setAZ(0);
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
    setCsec(0.02);
    setCelc(0.022);
    setCvc(0);
    setCaz(0);
    setCanti(2.5);
    setCacid(0.3);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
    setCinstr(10);
    setCinst(15);
    setCeng(8);
    setCcivil(5);
    setpV(7.5);
    setTh(115);
    setTb(40);
    setT0(30);
    setS0(40);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  const Nst = Nst1 + Nst2 + Nst3;
  
  // CAPEX Calculations
  // Heat transfer area costs (all areas combined)
  const CAPEX_area = Aa * Caa + Nst1 * Ab * Cab + Nst2 * Ac * Cac + Nst3 * Ad * Cad;
  // Pump CAPEX with size effect (0.8 exponent)
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8);
  const CAPEX_pump_r = Cpr * Math.pow(Pr * Mr, 0.8);
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8);
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_r + CAPEX_pump_d;
  // Water treatment CAPEX
  const CAPEX_wt = M0 * Cwt;
  // Intake structure CAPEX
  const CAPEX_intake = M0 * Cintake;
  // VC CAPEX (for TVC mode)
  const CAPEX_vc = VC * Cvc;
  // Absorber CAPEX
  const CAPEX_az = AZ * Caz;
  // Equipment total (before civil)
  const CAPEX_equip = CAPEX_area + CAPEX_Pump + CAPEX_wt + CAPEX_intake + CAPEX_vc + CAPEX_az;
  // Civil works CAPEX
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  // Instrumentation, installation and engineering
  const CAPEX_instr = (Cinstr / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  // Total CAPEX
  const CAPEX_total = CAPEX_equip + CAPEX_civil + CAPEX_instr + CAPEX_inst + CAPEX_eng;
  
  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_sec = SEC * Csec; // Steam cost ($/t)
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_sec + OPEX_elc + Cantiscalant + Cacid_dose + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;
  
  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  return (
    <div className="converter-card">
      <SectionHeader title="MSF Water Cost" icon={DollarSign} />
      <div className="p-4">
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Column 1 - Inputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Inputs</div>
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
            <InputRow symbol="AZ" value={AZ} onChange={setAZ} unit="m³/s" symbolTip="Absorber capacity" unitTip="Cubic meters per second" />
            <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific steam exergy" unitTip="Megajoules per metric ton" />
            <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Electricity consumption" unitTip="Megajoules per metric ton" />
            <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="pV" value={pV} onChange={setpV} unit="-" symbolTip="Feed water pH" unitTip="Dimensionless" />
            <InputRow symbol="Th" value={Th} onChange={setTh} unit="°C" symbolTip="Brine heater temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="Tb" value={Tb} onChange={setTb} unit="°C" symbolTip="Brine blowdown temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="T0" value={T0} onChange={setT0} unit="°C" symbolTip="Feed water temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/L" symbolTip="Feed water salinity" unitTip="Grams per liter" />
          </div>

          {/* Column 2 - Factors */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Factors</div>
            <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Life span" unitTip="Years" />
            <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Load factor" unitTip="Dimensionless" />
            <InputRow symbol="r" value={r} onChange={setR} unit="-" symbolTip="Discount rate" unitTip="Dimensionless" />
            <InputRow symbol="Caa" value={Caa} onChange={setCaa} unit="$/m²" symbolTip="Heat transfer area cost section A" unitTip="Dollars per square meter" />
            <InputRow symbol="Cab" value={Cab} onChange={setCab} unit="$/m²" symbolTip="Heat transfer area cost section B" unitTip="Dollars per square meter" />
            <InputRow symbol="Cac" value={Cac} onChange={setCac} unit="$/m²" symbolTip="Heat transfer area cost section C" unitTip="Dollars per square meter" />
            <InputRow symbol="Cad" value={Cad} onChange={setCad} unit="$/m²" symbolTip="Heat transfer area cost section D" unitTip="Dollars per square meter" />
            <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpr" value={Cpr} onChange={setCpr} unit="$/(bar·t/h)" symbolTip="Recirculation pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpd" value={Cpd} onChange={setCpd} unit="$/(bar·t/h)" symbolTip="Discharge pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cvc" value={Cvc} onChange={setCvc} unit="$/(m³/s)" symbolTip="Vapor compressor capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Caz" value={Caz} onChange={setCaz} unit="$/(m³/s)" symbolTip="Absorber capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Ccivil" value={Ccivil} onChange={setCcivil} unit="%" symbolTip="Civil works cost % of CAPEX_equip" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinstr" value={Cinstr} onChange={setCinstr} unit="%" symbolTip="Instrumentation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Csec" value={Csec} onChange={setCsec} unit="$/MJ" symbolTip="Steam exergy cost" unitTip="Dollars per megajoule" />
            <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
            <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
            <InputRow symbol="Cmain" value={Cmain} onChange={setCmain} unit="%/yr" symbolTip="Annual maintenance cost as percentage of total CAPEX" unitTip="Percent of CAPEX per year" />
            <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
          </div>

          {/* Column 3 - Outputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
            <OutputRow symbol="CAPEX_area" value={CAPEX_area} unit="$" symbolTip="Cost of heat transfer areas" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_Pump" value={CAPEX_Pump} unit="$" symbolTip="Pump CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_wt" value={CAPEX_wt} unit="$" symbolTip="Water treatment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_intake" value={CAPEX_intake} unit="$" symbolTip="Intake structure CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_vc" value={CAPEX_vc} unit="$" symbolTip="Vapor compressor CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_az" value={CAPEX_az} unit="$" symbolTip="Absorber CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_civil" value={CAPEX_civil} unit="$" symbolTip="Civil works CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_instr" value={CAPEX_instr} unit="$" symbolTip="Instrumentation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_spec" value={CAPX_spec} unit="$/(t/h)" symbolTip="Specific CAPEX per unit capacity" unitTip="Dollars per t/h" />
            <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
            <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost per ton" unitTip="Dollars per metric ton" />

            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
              <OutputRow symbol="OPEX_sec" value={OPEX_sec} unit="$/t" symbolTip="Specific exergy consumption cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Electricity cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant dosing cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid dosing cost" unitTip="Dollars per metric ton" />

              <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_maint" value={Cmain_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX with overhead" unitTip="Dollars per metric ton" />
              <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost (UPC)" unitTip="Dollars per metric ton" />
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="MSF Water Cost" 
          sections={[
            {
              title: "Simulator Inputs",
              rows: [
                { symbol: "Nst1", value: fmt(Nst1), unit: "#" },
                { symbol: "Nst2", value: fmt(Nst2), unit: "#" },
                { symbol: "Nst3", value: fmt(Nst3), unit: "#" },
                { symbol: "Aa", value: fmt(Aa), unit: "m²" },
                { symbol: "Ab", value: fmt(Ab), unit: "m²" },
                { symbol: "Ac", value: fmt(Ac), unit: "m²" },
                { symbol: "Ad", value: fmt(Ad), unit: "m²" },
                { symbol: "Md", value: fmt(Md), unit: "t/h" },
                { symbol: "M0", value: fmt(M0), unit: "t/h" },
                { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
                { symbol: "Mr", value: fmt(Mr), unit: "t/h" },
                { symbol: "P0", value: fmt(P0), unit: "bar" },
                { symbol: "Pr", value: fmt(Pr), unit: "bar" },
                { symbol: "Pd", value: fmt(Pd), unit: "bar" },
                { symbol: "VC", value: fmt(VC), unit: "m³/s" },
                { symbol: "AZ", value: fmt(AZ), unit: "m³/s" },
                { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
                { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
                { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
                { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
                { symbol: "pV", value: fmt(pV), unit: "-" },
                { symbol: "Th", value: fmt(Th), unit: "°C" },
                { symbol: "Tb", value: fmt(Tb), unit: "°C" },
                { symbol: "T0", value: fmt(T0), unit: "°C" },
                { symbol: "S0", value: fmt(S0), unit: "g/L" },
              ]
            },
            {
              title: "Factors",
              rows: [
                { symbol: "Y", value: fmt(Y), unit: "yr" },
                { symbol: "LF", value: fmt(LF), unit: "-" },
                { symbol: "r", value: fmt(r), unit: "-" },
                { symbol: "Cstg", value: fmt(Cstg), unit: "$/(t/h)" },
                { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
                { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },
                { symbol: "Cac", value: fmt(Cac), unit: "$/m²" },
                { symbol: "Cad", value: fmt(Cad), unit: "$/m²" },
                { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
                { symbol: "Cpr", value: fmt(Cpr), unit: "$/(bar·t/h)" },
                { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },
                { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },
                { symbol: "Caz", value: fmt(Caz), unit: "$/(m³/s)" },
                { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
                { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },
                { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
                { symbol: "Cinstr", value: fmt(Cinstr), unit: "%" },
                { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
                { symbol: "Ceng", value: fmt(Ceng), unit: "%" },
                { symbol: "Csec", value: fmt(Csec), unit: "$/MJ" },
                { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
                { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
                { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
                { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "Cmain", value: fmt(Cmain), unit: "%/yr" },
                { symbol: "Cover", value: fmt(Cover), unit: "%" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "CAPEX_area", value: fmt(CAPEX_area), unit: "$" },
                { symbol: "CAPEX_Pump", value: fmt(CAPEX_Pump), unit: "$" },
                { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
                { symbol: "CAPEX_intake", value: fmt(CAPEX_intake), unit: "$" },
                { symbol: "CAPEX_vc", value: fmt(CAPEX_vc), unit: "$" },
                { symbol: "CAPEX_az", value: fmt(CAPEX_az), unit: "$" },
                { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
                { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
                { symbol: "CAPEX_instr", value: fmt(CAPEX_instr), unit: "$" },
                { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
                { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },
                { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
                { symbol: "CAPX_spec", value: fmt(CAPX_spec), unit: "$/(t/h)" },
                { symbol: "CRF", value: fmt(CRF), unit: "-" },
                { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },
                { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
                { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
                { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
                { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },

                { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "OPEX_maint", value: fmt(Cmain_annual), unit: "$/t" },
                { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
                { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },
                { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
              ]
            }
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
  const [Nef, setNef] = usePersistentState("mvc.Nef", 5); // Number of effects
  const [Aa, setAa] = usePersistentState("mvc.Aa", 28320); // Area of each effect (m²)
  const [Ab, setAb] = usePersistentState("mvc.Ab", 21627); // Heat exchanger area (m²)
  const [Md, setMd] = usePersistentState("mvc.Md", 1000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("mvc.M0", 2700); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("mvc.Mf", 3238); // Feed water flow (t/h)
  const [Mb, setMb] = usePersistentState("mvc.Mb", 1688); // Brine blowdown flow (t/h)
  const [P0, setP0] = usePersistentState("mvc.P0", 5); // Intake pump pressure (bar)
  const [Pf, setPf] = usePersistentState("mvc.Pf", 3); // Feed water pump pressure (bar)
  const [Pb, setPb] = usePersistentState("mvc.Pb", 3); // Brine discharge pump pressure (bar)
  const [Pd, setPd] = usePersistentState("mvc.Pd", 3); // Product pump pressure (bar)
  const [VC, setVC] = usePersistentState("mvc.VC", 383); // Vapor compressor capacity (m³/s)
  const [Pvc, setPvc] = usePersistentState("mvc.Pvc", 1500); // Vapor compressor power (kW)
  const [SEC, setSEC] = usePersistentState("mvc.SEC", 30); // Specific compression exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("mvc.ELC", 0.7); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("mvc.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("mvc.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("mvc.pV", 7.5); // Feed water pH
  const [Ts, setTs] = usePersistentState("mvc.Ts", 80); // Steam temperature (°C)
  const [Te, setTe] = usePersistentState("mvc.Te", 65); // Effect temperature (°C)
  const [T0, setT0] = usePersistentState("mvc.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("mvc.S0", 40); // Feed water salinity (g/L)
  const [Y, setY] = usePersistentState("mvc.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("mvc.LF", 0.9); // Load factor
  const [r, setR] = usePersistentState("mvc.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  // CAPEX Cost Factors
  const [Cef, setCef] = usePersistentState("mvc.Cef", 5000); // Effect installation cost factor ($/effect)
  const [Caa, setCaa] = usePersistentState("mvc.Caa", 300); // Effect area cost factor ($/m²)
  const [Cab, setCab] = usePersistentState("mvc.Cab", 200); // Heat exchanger area cost factor ($/m²)
  const [Cvc, setCvc] = usePersistentState("mvc.Cvc", 500); // VC cost factor ($/(m³/s))
  const [Cp0, setCp0] = usePersistentState("mvc.Cp0", 5); // Intake pump cost factor ($/(bar·t/h))
  const [Cpf, setCpf] = usePersistentState("mvc.Cpf", 9); // Feed pump cost factor ($/(bar·t/h))
  const [Cpb, setCpb] = usePersistentState("mvc.Cpb", 3); // Brine discharge pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("mvc.Cpd", 3); // Product pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("mvc.Cwt", 30); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("mvc.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Ccivil, setCcivil] = usePersistentState("mvc.Ccivil", 15); // Civil works cost (% of CAPEX_equip)
  const [Cinstr, setCinstr] = usePersistentState("mvc.Cinstr", 8); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("mvc.Cinst", 0.5); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("mvc.Ceng", 0.05); // Engineering cost (% of equipment)
  // OPEX Cost Factors
  const [Csec, setCsec] = usePersistentState("mvc.Csec", 0.022); // Specific compression exergy cost ($/MJ)
  const [Celc, setCelc] = usePersistentState("mvc.Celc", 0.022); // Electricity price ($/MJ)
  const [Canti, setCanti] = usePersistentState("mvc.Canti", 2); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("mvc.Cacid", 10); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("mvc.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("mvc.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("mvc.Cover", 10); // Overhead cost (% of OPEX-total)

  // Reset function
  const resetToDefaults = () => {
    setNef(5);
    setAa(28320);
    setAb(21627);
    setMd(1000);
    setM0(2700);
    setMf(3238);
    setMb(1688);
    setP0(5);
    setPf(3);
    setPb(3);
    setPd(3);
    setVC(383);
    setPvc(1500);
    setSEC(30);
    setELC(0.7);
    setDanti(2.5);
    setDacid(1.0);
    setpV(7.5);
    setTs(80);
    setTe(65);
    setT0(30);
    setS0(40);
    setY(25);
    setLF(0.9);
    setR(0.06);
    setCef(5000);
    setCaa(300);
    setCab(200);
    setCvc(500);
    setCp0(5);
    setCpf(9);
    setCpb(3);
    setCpd(3);
    setCwt(30);
    setCintake(50);
    setCcivil(15);
    setCinstr(8);
    setCinst(0.5);
    setCeng(0.05);
    setCsec(0.022);
    setCelc(0.022);
    setCanti(2);
    setCacid(10);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  
  // CAPEX Calculations
  // Effect installation cost
  const CAPEX_ef = Nef * Cef;
  // Area costs
  const CAPEX_area = Nef * Aa * Caa + Ab * Cab;
  // VC CAPEX
  const CAPEX_vc = VC * Cvc;
  // Pump CAPEX with size effect (0.8 exponent)
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8);
  const CAPEX_pump_f = Cpf * Math.pow(Pf * Mf, 0.8);
  const CAPEX_pump_b = Cpb * Math.pow(Pb * Mb, 0.8);
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Md, 0.8);
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_f + CAPEX_pump_b + CAPEX_pump_d;
  // Water treatment CAPEX
  const CAPEX_wt = M0 * Cwt;
  // Intake structure CAPEX
  const CAPEX_intake = M0 * Cintake;
  // Equipment total
  const CAPEX_equip = CAPEX_area + CAPEX_vc + CAPEX_Pump + CAPEX_wt + CAPEX_intake;
  // Civil works CAPEX
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  // Instrumentation, Installation and engineering
  const CAPEX_instr = (Cinstr / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  // Total CAPEX
  const CAPEX_total = CAPEX_equip + CAPEX_civil + CAPEX_instr + CAPEX_inst + CAPEX_eng;
  
  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_sec = SEC * Csec; // Compression exergy cost ($/t)
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_sec + OPEX_elc + Cantiscalant + Cacid_dose + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;
  
  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  return (
    <div className="converter-card">
      <SectionHeader title="MVC Water Cost" icon={DollarSign} />
      <div className="p-4">
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Column 1 - Inputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Inputs</div>
            {/* CAPEX-related Inputs */}
            <InputRow symbol="Nef" value={Nef} onChange={setNef} unit="#" symbolTip="Number of effects" unitTip="Dimensionless" />
            <InputRow symbol="Aa" value={Aa} onChange={setAa} unit="m²" symbolTip="Area of each effect" unitTip="Square meters" />
            <InputRow symbol="Ab" value={Ab} onChange={setAb} unit="m²" symbolTip="Heat exchanger area" unitTip="Square meters" />
            <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
            <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
            <InputRow symbol="Mf" value={Mf} onChange={setMf} unit="t/h" symbolTip="Feed water flow" unitTip="Metric tons per hour" />
            <InputRow symbol="Mb" value={Mb} onChange={setMb} unit="t/h" symbolTip="Brine blowdown flow" unitTip="Metric tons per hour" />
            <InputRow symbol="P0" value={P0} onChange={setP0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
            <InputRow symbol="Pf" value={Pf} onChange={setPf} unit="bar" symbolTip="Feed water pump pressure" unitTip="Bar" />
            <InputRow symbol="Pb" value={Pb} onChange={setPb} unit="bar" symbolTip="Brine discharge pump pressure" unitTip="Bar" />
            <InputRow symbol="Pd" value={Pd} onChange={setPd} unit="bar" symbolTip="Product pump pressure" unitTip="Bar" />
            <InputRow symbol="VC" value={VC} onChange={setVC} unit="m³/s" symbolTip="Vapor compressor capacity" unitTip="Cubic meters per second" />
            <InputRow symbol="Pvc" value={Pvc} onChange={setPvc} unit="kW" symbolTip="Vapor compressor power" unitTip="Kilowatts" />
            {/* OPEX-related Inputs */}
            <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific compression exergy" unitTip="Megajoules per metric ton" />
            <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Electricity consumption" unitTip="Megajoules per metric ton" />
            <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
            {/* Feed Water Parameters */}
            <InputRow symbol="pV" value={pV} onChange={setpV} unit="-" symbolTip="Feed water pH" unitTip="Dimensionless" />
            <InputRow symbol="Ts" value={Ts} onChange={setTs} unit="°C" symbolTip="Steam temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="Te" value={Te} onChange={setTe} unit="°C" symbolTip="Entrained vapor temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="T0" value={T0} onChange={setT0} unit="°C" symbolTip="Feed water temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/L" symbolTip="Feed water salinity" unitTip="Grams per liter" />
          </div>

          {/* Column 2 - Factors */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Factors</div>
            <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Life span" unitTip="Years" />
            <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Load factor" unitTip="Dimensionless" />
            <InputRow symbol="r" value={r} onChange={setR} unit="-" symbolTip="Discount rate" unitTip="Dimensionless" />
            {/* CAPEX Cost Factors */}
            <InputRow symbol="Cef" value={Cef} onChange={setCef} unit="$/effect" symbolTip="Effect installation cost factor" unitTip="Dollars per effect" />
            <InputRow symbol="Caa" value={Caa} onChange={setCaa} unit="$/m²" symbolTip="Effect area cost factor" unitTip="Dollars per square meter" />
            <InputRow symbol="Cab" value={Cab} onChange={setCab} unit="$/m²" symbolTip="Heat exchanger area cost factor" unitTip="Dollars per square meter" />
            <InputRow symbol="Cvc" value={Cvc} onChange={setCvc} unit="$/(m³/s)" symbolTip="Vapor compressor capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpf" value={Cpf} onChange={setCpf} unit="$/(bar·t/h)" symbolTip="Feed pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpb" value={Cpb} onChange={setCpb} unit="$/(bar·t/h)" symbolTip="Brine discharge pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpd" value={Cpd} onChange={setCpd} unit="$/(bar·t/h)" symbolTip="Product pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Ccivil" value={Ccivil} onChange={setCcivil} unit="%" symbolTip="Civil works cost % of CAPEX_equip" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinstr" value={Cinstr} onChange={setCinstr} unit="%" symbolTip="Instrumentation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
            {/* OPEX Cost Factors */}
            <InputRow symbol="Csec" value={Csec} onChange={setCsec} unit="$/MJ" symbolTip="Specific compression exergy cost" unitTip="Dollars per megajoule" />
            <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
            <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
            <InputRow symbol="Cmain" value={Cmain} onChange={setCmain} unit="%/yr" symbolTip="Annual maintenance cost as percentage of total CAPEX" unitTip="Percent of CAPEX per year" />
            <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
          </div>

          {/* Column 3 - Outputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
            <OutputRow symbol="CAPEX_ef" value={CAPEX_ef} unit="$" symbolTip="Effect CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_area" value={CAPEX_area} unit="$" symbolTip="Total heat transfer area CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_vc" value={CAPEX_vc} unit="$" symbolTip="Vapor compressor CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_Pump" value={CAPEX_Pump} unit="$" symbolTip="Pump CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_wt" value={CAPEX_wt} unit="$" symbolTip="Water treatment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_intake" value={CAPEX_intake} unit="$" symbolTip="Intake structure CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_civil" value={CAPEX_civil} unit="$" symbolTip="Civil works CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_instr" value={CAPEX_instr} unit="$" symbolTip="Instrumentation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPX_spec" value={CAPX_spec} unit="$/(t/h)" symbolTip="Specific CAPEX per unit capacity" unitTip="Dollars per t/h" />
            <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
            <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost per ton" unitTip="Dollars per metric ton" />

            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
              <OutputRow symbol="OPEX_sec" value={OPEX_sec} unit="$/t" symbolTip="Specific exergy consumption cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Electricity cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant dosing cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid dosing cost" unitTip="Dollars per metric ton" />

              <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_maint" value={Cmain_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX with overhead" unitTip="Dollars per metric ton" />
              <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost (UPC)" unitTip="Dollars per metric ton" />
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="MVC Water Cost" 
          sections={[
            {
              title: "Inputs",
              rows: [
                // CAPEX-related Inputs
                { symbol: "Nef", value: fmt(Nef), unit: "#" },
                { symbol: "Aa", value: fmt(Aa), unit: "m²" },
                { symbol: "Ab", value: fmt(Ab), unit: "m²" },
                { symbol: "Md", value: fmt(Md), unit: "t/h" },
                { symbol: "M0", value: fmt(M0), unit: "t/h" },
                { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
                { symbol: "Mb", value: fmt(Mb), unit: "t/h" },
                { symbol: "P0", value: fmt(P0), unit: "bar" },
                { symbol: "Pf", value: fmt(Pf), unit: "bar" },
                { symbol: "Pb", value: fmt(Pb), unit: "bar" },
                { symbol: "Pd", value: fmt(Pd), unit: "bar" },
                { symbol: "VC", value: fmt(VC), unit: "m³/s" },
                { symbol: "Pvc", value: fmt(Pvc), unit: "kW" },
                // OPEX-related Inputs
                { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
                { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
                { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
                { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
                // Feed Water Parameters
                { symbol: "pV", value: fmt(pV), unit: "-" },
                { symbol: "Ts", value: fmt(Ts), unit: "°C" },
                { symbol: "Te", value: fmt(Te), unit: "°C" },
                { symbol: "T0", value: fmt(T0), unit: "°C" },
                { symbol: "S0", value: fmt(S0), unit: "g/L" },
              ]
            },
            {
              title: "Factors",
              rows: [
                { symbol: "Y", value: fmt(Y), unit: "yr" },
                { symbol: "LF", value: fmt(LF), unit: "-" },
                { symbol: "r", value: fmt(r), unit: "-" },
                { symbol: "Cef", value: fmt(Cef), unit: "$/effect" },
                { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
                { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },
                { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },
                { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
                { symbol: "Cpf", value: fmt(Cpf), unit: "$/(bar·t/h)" },
                { symbol: "Cpb", value: fmt(Cpb), unit: "$/(bar·t/h)" },
                { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },
                { symbol: "Cwt", value: fmt(Cwt), unit: "$/t/h)" },
                { symbol: "Cintake", value: fmt(Cintake), unit: "$/t/h)" },
                { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
                { symbol: "Cinstr", value: fmt(Cinstr), unit: "%" },
                { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
                { symbol: "Ceng", value: fmt(Ceng), unit: "%" },
                { symbol: "Csec", value: fmt(Csec), unit: "$/MJ" },
                { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
                { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
                { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
                { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "Cmain", value: fmt(Cmain), unit: "%/yr" },
                { symbol: "Cover", value: fmt(Cover), unit: "%" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "CAPEX_ef", value: fmt(CAPEX_ef), unit: "$" },
                { symbol: "CAPEX_area", value: fmt(CAPEX_area), unit: "$" },
                { symbol: "CAPEX_vc", value: fmt(CAPEX_vc), unit: "$" },
                { symbol: "CAPEX_Pump", value: fmt(CAPEX_Pump), unit: "$" },
                { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
                { symbol: "CAPEX_intake", value: fmt(CAPEX_intake), unit: "$" },
                { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
                { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
                { symbol: "CAPEX_instr", value: fmt(CAPEX_instr), unit: "$" },
                { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
                { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },
                { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
                { symbol: "CAPX_spec", value: fmt(CAPX_spec), unit: "$/(t/h)" },
                { symbol: "CRF", value: fmt(CRF), unit: "-" },
                { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },
                { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
                { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
                { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
                { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },

                { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "OPEX_maint", value: fmt(Cmain_annual), unit: "$/t" },
                { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
                { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },
                { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
              ]
            }
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}


// ─── MED Water Cost ───────────────────────────────────────────────
function MEDWaterCost() {
  // Group 1: Simulator Inputs
  const [Md, setMd] = usePersistentState("med.Md", 20000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("med.M0", 25000); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("med.Mf", 4000); // Feed water flow (t/h)
  const [Nef1, setNef1] = usePersistentState("med.Nef1", 4); // Number of MED effects in first section
  const [Nef2, setNef2] = usePersistentState("med.Nef2", 4); // Number of MED effects in second section
  const [Aa, setAa] = usePersistentState("med.Aa", 1500); // Area of each effect in first section (m²)
  const [Ab, setAb] = usePersistentState("med.Ab", 1000); // Area of each effect in second section (m²)
  const [Ac, setAc] = usePersistentState("med.Ac", 500); // Area of condenser (m²)
  const [Ad, setAd] = usePersistentState("med.Ad", 800); // Area of preheater (m²)
  const [Ae, setAe] = usePersistentState("med.Ae", 1200); // Area of absorber (m²)
  const [P0, setP0] = usePersistentState("med.P0", 2); // Intake pump pressure (bar)
  const [Pd, setPd] = usePersistentState("med.Pd", 2.5); // Discharge pump pressure (bar)
  const [VC, setVC] = usePersistentState("med.VC", 0); // Vapor compressor capacity (m³/s), set to 0 for standard MED
  const [AZ, setAZ] = usePersistentState("med.AZ", 0); // Absorber capacity (m³/s)
  const [SEC, setSEC] = usePersistentState("med.SEC", 120); // Specific steam exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("med.ELC", 3.5); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("med.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("med.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  const [Y, setY] = usePersistentState("med.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("med.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("med.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Caa, setCaa] = usePersistentState("med.Caa", 150); // Brine heater area cost ($/m²)
  const [Cab, setCab] = usePersistentState("med.Cab", 140); // Effect area cost first section ($/m²)
  const [Cac, setCac] = usePersistentState("med.Cac", 130); // Effect area cost second section ($/m²)
  const [Cad, setCad] = usePersistentState("med.Cad", 120); // Condenser area cost ($/m²)
  const [Cp0, setCp0] = usePersistentState("med.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("med.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("med.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("med.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Csec, setCsec] = usePersistentState("med.Csec", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("med.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("med.Cvc", 0); // VC cost factor ($/(m³/s))
  const [Caz, setCaz] = usePersistentState("med.Caz", 100); // Absorber cost factor ($/(m³/s))
  const [Cae, setCae] = usePersistentState("med.Cae", 130); // Absorber area cost ($/m²)
  const [Canti, setCanti] = usePersistentState("med.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("med.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("med.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("med.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("med.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinstr, setCinstr] = usePersistentState("med.Cinstr", 10); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("med.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("med.Ceng", 8); // Engineering cost (% of equipment)
  const [Ccivil, setCcivil] = usePersistentState("med.Ccivil", 5); // Civil works cost (% of CAPEX_equip)

  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("med.pV", 7.5); // Feed water pH
  const [Ts, setTs] = usePersistentState("med.Ts", 80); // Steam temperature (°C)
  const [Td, setTd] = usePersistentState("med.Td", 40); // Distillate temperature (°C)
  const [T0, setT0] = usePersistentState("med.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("med.S0", 40); // Feed water salinity (g/L)

  // Reset function
  const resetToDefaults = () => {
    setMd(20000);
    setM0(25000);
    setMf(4000);
    setNef1(4);
    setNef2(4);
    setAa(1500);
    setAb(1000);
    setAc(500);
    setAd(800);
    setAe(1200);
    setP0(2);
    setPd(2.5);
    setVC(0);
    setAZ(0);
    setSEC(120);
    setELC(3.5);
    setDanti(2.5);
    setDacid(1.0);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCaa(150);
    setCab(140);
    setCac(130);
    setCad(120);
    setCp0(8);
    setCpd(10);
    setCwt(100);
    setCintake(50);
    setCsec(0.02);
    setCelc(0.022);
    setCvc(0);
    setCaz(100);
    setCae(130);
    setCanti(2.5);
    setCacid(0.3);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
    setCinstr(10);
    setCinst(15);
    setCeng(8);
    setCcivil(5);
    setpV(7.5);
    setTs(80);
    setTd(40);
    setT0(30);
    setS0(40);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  const Nef = Nef1 + Nef2; // Total number of effects

  // CAPEX Calculations
  const CAPEX_area = Nef1 * Aa * Caa + Nef2 * Ab * Cab + Ac * Cac + Ad * Cad + Ae * Cae;
  const CAPEX_az = AZ * Caz;
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8); // Intake pump
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8); // Discharge pump
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_d;
  const CAPEX_wt = M0 * Cwt;
  const CAPEX_intake = M0 * Cintake;
  const CAPEX_vc = VC * Cvc;
  const CAPEX_equip = CAPEX_area + CAPEX_az + CAPEX_Pump + CAPEX_wt + CAPEX_intake + CAPEX_vc;
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  const CAPEX_instr = (Cinstr / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  const CAPEX_total = CAPEX_equip + CAPEX_civil + CAPEX_instr + CAPEX_inst + CAPEX_eng;

  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_sec = SEC * Csec; // Steam cost ($/t)
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_sec + OPEX_elc + Cantiscalant + Cacid_dose + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;

  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  return (
    <div className="converter-card">
      <SectionHeader title="MED Water Cost" icon={DollarSign} />
      <div className="p-4">
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Column 1 - Inputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Inputs</div>
            <InputRow symbol="Nef1" value={Nef1} onChange={setNef1} unit="#" symbolTip="Number of MED effects in first section" unitTip="Dimensionless" />
            <InputRow symbol="Nef2" value={Nef2} onChange={setNef2} unit="#" symbolTip="Number of MED effects in second section" unitTip="Dimensionless" />
            <InputRow symbol="Aa" value={Aa} onChange={setAa} unit="m²" symbolTip="Area of each effect in first section" unitTip="Square meters" />
            <InputRow symbol="Ab" value={Ab} onChange={setAb} unit="m²" symbolTip="Area of each effect in second section" unitTip="Square meters" />
            <InputRow symbol="Ac" value={Ac} onChange={setAc} unit="m²" symbolTip="Area of condenser" unitTip="Square meters" />
            <InputRow symbol="Ad" value={Ad} onChange={setAd} unit="m²" symbolTip="Area of preheater" unitTip="Square meters" />
            <InputRow symbol="Ae" value={Ae} onChange={setAe} unit="m²" symbolTip="Area of absorber" unitTip="Square meters" />
            <InputRow symbol="P0" value={P0} onChange={setP0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
            <InputRow symbol="Pd" value={Pd} onChange={setPd} unit="bar" symbolTip="Discharge pump pressure" unitTip="Bar" />
            <InputRow symbol="VC" value={VC} onChange={setVC} unit="m³/s" symbolTip="Vapor compressor capacity" unitTip="Cubic meters per second" />
            <InputRow symbol="AZ" value={AZ} onChange={setAZ} unit="m³/s" symbolTip="Absorber capacity" unitTip="Cubic meters per second" />
            <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
            <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
            <InputRow symbol="Mf" value={Mf} onChange={setMf} unit="t/h" symbolTip="Feed water flow" unitTip="Metric tons per hour" />
            <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific steam exergy" unitTip="Megajoules per metric ton" />
            <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Electricity consumption" unitTip="Megajoules per metric ton" />
            <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid chemical dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="pV" value={pV} onChange={setpV} unit="-" symbolTip="Feed water pH" unitTip="Dimensionless" />
            <InputRow symbol="Ts" value={Ts} onChange={setTs} unit="°C" symbolTip="Steam temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="Td" value={Td} onChange={setTd} unit="°C" symbolTip="Distillate temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="T0" value={T0} onChange={setT0} unit="°C" symbolTip="Feed water temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/L" symbolTip="Feed water salinity" unitTip="Grams per liter" />
          </div>

          {/* Column 2 - Factors */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Factors</div>
            <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Life span" unitTip="Years" />
            <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Load factor" unitTip="Dimensionless" />
            <InputRow symbol="r" value={r} onChange={setR} unit="-" symbolTip="Discount rate" unitTip="Dimensionless" />
            {/* CAPEX Cost Factors */}
            <InputRow symbol="Caa" value={Caa} onChange={setCaa} unit="$/m²" symbolTip="Effect area cost first section" unitTip="Dollars per square meter" />
            <InputRow symbol="Cab" value={Cab} onChange={setCab} unit="$/m²" symbolTip="Effect area cost second section" unitTip="Dollars per square meter" />
            <InputRow symbol="Cac" value={Cac} onChange={setCac} unit="$/m²" symbolTip="Condenser area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cad" value={Cad} onChange={setCad} unit="$/m²" symbolTip="Preheater area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cae" value={Cae} onChange={setCae} unit="$/m²" symbolTip="Absorber area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpd" value={Cpd} onChange={setCpd} unit="$/(bar·t/h)" symbolTip="Discharge pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cvc" value={Cvc} onChange={setCvc} unit="$/(m³/s)" symbolTip="Vapor compressor capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Caz" value={Caz} onChange={setCaz} unit="$/(m³/s)" symbolTip="Absorber capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water pretreatment and posttreatment cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Ccivil" value={Ccivil} onChange={setCcivil} unit="%" symbolTip="Civil works cost % of CAPEX_equip" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinstr" value={Cinstr} onChange={setCinstr} unit="%" symbolTip="Instrumentation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
            {/* OPEX Cost Factors */}
            <InputRow symbol="Csec" value={Csec} onChange={setCsec} unit="$/MJ" symbolTip="Steam exergy cost" unitTip="Dollars per megajoule" />
            <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
            <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
            <InputRow symbol="Cmain" value={Cmain} onChange={setCmain} unit="%/yr" symbolTip="Annual maintenance cost as percentage of total CAPEX" unitTip="Percent of CAPEX per year" />
            <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
          </div>

          {/* Column 3 - Outputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
            <OutputRow symbol="CAPEX_area" value={CAPEX_area} unit="$" symbolTip="Total heat transfer area CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_Pump" value={CAPEX_Pump} unit="$" symbolTip="Pump CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_wt" value={CAPEX_wt} unit="$" symbolTip="Water treatment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_intake" value={CAPEX_intake} unit="$" symbolTip="Intake structure CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_vc" value={CAPEX_vc} unit="$" symbolTip="Vapor compressor CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_az" value={CAPEX_az} unit="$" symbolTip="Absorber CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_civil" value={CAPEX_civil} unit="$" symbolTip="Civil works CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_instr" value={CAPEX_instr} unit="$" symbolTip="Instrumentation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPX_spec" value={CAPX_spec} unit="$/(t/h)" symbolTip="Specific CAPEX per unit capacity" unitTip="Dollars per t/h" />
            <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
            <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost per ton" unitTip="Dollars per metric ton" />

            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
              <OutputRow symbol="OPEX_sec" value={OPEX_sec} unit="$/t" symbolTip="Specific exergy consumption cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Electricity cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant dosing cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid dosing cost" unitTip="Dollars per metric ton" />

              <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_maint" value={Cmain_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX with overhead" unitTip="Dollars per metric ton" />
              <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost (UPC)" unitTip="Dollars per metric ton" />
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="MED Water Cost" 
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "Nef1", value: fmt(Nef1), unit: "#" },
                { symbol: "Nef2", value: fmt(Nef2), unit: "#" },
                { symbol: "Aa", value: fmt(Aa), unit: "m²" },
                { symbol: "Ab", value: fmt(Ab), unit: "m²" },
                { symbol: "Ac", value: fmt(Ac), unit: "m²" },
                { symbol: "Ad", value: fmt(Ad), unit: "m²" },
                { symbol: "Ae", value: fmt(Ae), unit: "m²" },
                { symbol: "P0", value: fmt(P0), unit: "bar" },
                { symbol: "Pd", value: fmt(Pd), unit: "bar" },
                { symbol: "VC", value: fmt(VC), unit: "m³/s" },
                { symbol: "AZ", value: fmt(AZ), unit: "m³/s" },
                { symbol: "Md", value: fmt(Md), unit: "t/h" },
                { symbol: "M0", value: fmt(M0), unit: "t/h" },
                { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
                { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
                { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
                { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
                { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
                { symbol: "pV", value: fmt(pV), unit: "-" },
                { symbol: "Ts", value: fmt(Ts), unit: "°C" },
                { symbol: "Td", value: fmt(Td), unit: "°C" },
                { symbol: "T0", value: fmt(T0), unit: "°C" },
                { symbol: "S0", value: fmt(S0), unit: "g/L" },
                { symbol: "Y", value: fmt(Y), unit: "yr" },
                { symbol: "LF", value: fmt(LF), unit: "-" },
                { symbol: "r", value: fmt(r), unit: "-" },
              ]
            },
            {
              title: "Factors",
              rows: [
                { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
                { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },
                { symbol: "Cac", value: fmt(Cac), unit: "$/m²" },
                { symbol: "Cad", value: fmt(Cad), unit: "$/m²" },
                { symbol: "Cae", value: fmt(Cae), unit: "$/m²" },
                { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
                { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },
                { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },
                { symbol: "Caz", value: fmt(Caz), unit: "$/(m³/s)" },
                { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
                { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },
                { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
                { symbol: "Cinstr", value: fmt(Cinstr), unit: "%" },
                { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
                { symbol: "Ceng", value: fmt(Ceng), unit: "%" },
                { symbol: "Csec", value: fmt(Csec), unit: "$/MJ" },
                { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
                { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
                { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
                { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "Cmain", value: fmt(Cmain), unit: "%/yr" },
                { symbol: "Cover", value: fmt(Cover), unit: "%" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "CAPEX_area", value: fmt(CAPEX_area), unit: "$" },
                { symbol: "CAPEX_Pump", value: fmt(CAPEX_Pump), unit: "$" },
                { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
                { symbol: "CAPEX_intake", value: fmt(CAPEX_intake), unit: "$" },
                { symbol: "CAPEX_vc", value: fmt(CAPEX_vc), unit: "$" },
                { symbol: "CAPEX_az", value: fmt(CAPEX_az), unit: "$" },
                { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
                { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
                { symbol: "CAPEX_instr", value: fmt(CAPEX_instr), unit: "$" },
                { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
                { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },
                { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
                { symbol: "CAPX_spec", value: fmt(CAPX_spec), unit: "$/(t/h)" },
                { symbol: "CRF", value: fmt(CRF), unit: "-" },
                { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },
                { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
                { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
                { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
                { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },

                { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "OPEX_maint", value: fmt(Cmain_annual), unit: "$/t" },
                { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
                { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },
                { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
              ]
            }
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}

// ─── MSH Water Cost ─────────────────────────────────────────────
function MSHWaterCost() {
  // Group 1: Simulator Inputs
  const [Md, setMd] = usePersistentState("msh.Md", 50000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("msh.M0", 55000); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("msh.Mf", 60000); // Feed water flow (t/h)
  const [Nst, setNst] = usePersistentState("msh.Nst", 12); // Number of MSF stages
  const [Nef1, setNef1] = usePersistentState("msh.Nef1", 6); // Number of upper MED effects
  const [Nef2, setNef2] = usePersistentState("msh.Nef2", 6); // Number of lower MED effects
  const [Aa, setAa] = usePersistentState("msh.Aa", 2000); // Brine heater area (m²)
  const [Ab, setAb] = usePersistentState("msh.Ab", 1500); // Each MSF stage area (m²)
  const [Ac, setAc] = usePersistentState("msh.Ac", 1200); // Each upper MED effect area (m²)
  const [Ad, setAd] = usePersistentState("msh.Ad", 1200); // Each lower MED effect area (m²)
  const [Ae, setAe] = usePersistentState("msh.Ae", 1000); // Each preheater area (m²)
  const [Af, setAf] = usePersistentState("msh.Af", 800); // Absorber heat transfer area (m²)
  const [P0, setP0] = usePersistentState("msh.P0", 2); // Intake pump pressure (bar)
  const [Pd, setPd] = usePersistentState("msh.Pd", 2.5); // Discharge pump pressure (bar)
  const [VC, setVC] = usePersistentState("msh.VC", 0); // Vapor compressor capacity (m³/s)
  const [AZ, setAZ] = usePersistentState("msh.AZ", 0); // Absorber capacity (m³/s)
  const [SEC, setSEC] = usePersistentState("msh.SEC", 120); // Specific steam exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("msh.ELC", 5); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("msh.Danti", 3); // Antiscalant dosing (L/h)
  const [Dacid, setDacid] = usePersistentState("msh.Dacid", 1.5); // Acid dosing (L/h)
  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("msh.pV", 7.5); // Feed water pH
  const [Th, setTh] = usePersistentState("msh.Th", 115); // Brine heater temperature (°C)
  const [Td, setTd] = usePersistentState("msh.Td", 40); // Distillate temperature (°C)
  const [T0, setT0] = usePersistentState("msh.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("msh.S0", 40); // Feed water salinity (g/L)
  const [Y, setY] = usePersistentState("msh.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("msh.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("msh.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Caa, setCaa] = usePersistentState("msh.Caa", 150); // Brine heater area cost ($/m²)
  const [Cab, setCab] = usePersistentState("msh.Cab", 140); // MSF stage area cost ($/m²)
  const [Cac, setCac] = usePersistentState("msh.Cac", 130); // Upper MED effect area cost ($/m²)
  const [Cad, setCad] = usePersistentState("msh.Cad", 130); // Lower MED effect area cost ($/m²)
  const [Cae, setCae] = usePersistentState("msh.Cae", 120); // Preheater area cost ($/m²)
  const [Caf, setCaf] = usePersistentState("msh.Caf", 100); // Absorber area cost ($/m²)
  const [Cp0, setCp0] = usePersistentState("msh.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("msh.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("msh.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("msh.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Csec, setCsec] = usePersistentState("msh.Csec", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("msh.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("msh.Cvc", 0); // VC cost factor ($/(m³/s))
  const [Caz, setCaz] = usePersistentState("msh.Caz", 0); // Absorber capacity factor ($/(m³/s))
  const [Canti, setCanti] = usePersistentState("msh.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("msh.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("msh.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("msh.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("msh.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinst, setCinst] = usePersistentState("msh.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("msh.Ceng", 8); // Engineering cost (% of equipment)
  const [Ccivil, setCcivil] = usePersistentState("msh.Ccivil", 5); // Civil works cost (% of CAPEX_equip)

  // Reset function
  const resetToDefaults = () => {
    setMd(50000);
    setM0(55000);
    setMf(60000);
    setNst(12);
    setNef1(6);
    setNef2(6);
    setAa(2000);
    setAb(1500);
    setAc(1200);
    setAd(1200);
    setAe(1000);
    setAf(800);
    setP0(2);
    setPd(2.5);
    setVC(0);
    setAZ(0);
    setSEC(120);
    setELC(5);
    setDanti(3);
    setDacid(1.5);
    setpV(7.5);
    setTh(115);
    setTd(40);
    setT0(30);
    setS0(40);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCaa(150);
    setCab(140);
    setCac(130);
    setCad(130);
    setCae(120);
    setCaf(100);
    setCp0(8);
    setCpd(10);
    setCwt(100);
    setCintake(50);
    setCsec(0.02);
    setCelc(0.022);
    setCvc(0);
    setCaz(0);
    setCanti(2.5);
    setCacid(0.3);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
    setCinst(15);
    setCeng(8);
    setCcivil(5);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;

  // CAPEX Calculations
  const CAPEX_area = Aa * Caa + Nst * Ab * Cab + Nef1 * Ac * Cac + Nef2 * Ad * Cad + (Nef2 + 1) * Ae * Cae + Af * Caf;
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8); // Intake pump
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8); // Discharge pump
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_d;
  const CAPEX_wt = M0 * Cwt;
  const CAPEX_intake = M0 * Cintake;
  const CAPEX_vc = VC * Cvc;
  const CAPEX_az = AZ * Caz;
  const CAPEX_equip = CAPEX_area + CAPEX_Pump + CAPEX_wt + CAPEX_intake + CAPEX_vc + CAPEX_az;
  const CAPEX_civil = 0.05 * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  const CAPEX_total = CAPEX_equip + CAPEX_civil + CAPEX_inst + CAPEX_eng;

  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_sec = SEC * Csec; // Steam cost ($/t)
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_sec + OPEX_elc + Cantiscalant + Cacid_dose + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;

  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  return (
    <div className="converter-card">
      <SectionHeader title="MSH Water Cost" icon={DollarSign} />
      <div className="p-4">
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Column 1 - Inputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Inputs</div>
            <InputRow symbol="Nst" value={Nst} onChange={setNst} unit="#" symbolTip="Number of MSF stages" unitTip="Dimensionless" />
            <InputRow symbol="Nef1" value={Nef1} onChange={setNef1} unit="#" symbolTip="Number of upper MED effects" unitTip="Dimensionless" />
            <InputRow symbol="Nef2" value={Nef2} onChange={setNef2} unit="#" symbolTip="Number of lower MED effects" unitTip="Dimensionless" />
            <InputRow symbol="Aa" value={Aa} onChange={setAa} unit="m²" symbolTip="Brine heater area" unitTip="Square meters" />
            <InputRow symbol="Ab" value={Ab} onChange={setAb} unit="m²" symbolTip="Each MSF stage area" unitTip="Square meters" />
            <InputRow symbol="Ac" value={Ac} onChange={setAc} unit="m²" symbolTip="Each upper MED effect area" unitTip="Square meters" />
            <InputRow symbol="Ad" value={Ad} onChange={setAd} unit="m²" symbolTip="Each lower MED effect area" unitTip="Square meters" />
            <InputRow symbol="Ae" value={Ae} onChange={setAe} unit="m²" symbolTip="Each preheater area" unitTip="Square meters" />
            <InputRow symbol="Af" value={Af} onChange={setAf} unit="m²" symbolTip="Absorber heat transfer area" unitTip="Square meters" />
            <InputRow symbol="P0" value={P0} onChange={setP0} unit="bar" symbolTip="Intake pump pressure" unitTip="Bar" />
            <InputRow symbol="Pd" value={Pd} onChange={setPd} unit="bar" symbolTip="Discharge pump pressure" unitTip="Bar" />
            <InputRow symbol="VC" value={VC} onChange={setVC} unit="m³/s" symbolTip="Vapor compressor capacity" unitTip="Cubic meters per second" />
            <InputRow symbol="AZ" value={AZ} onChange={setAZ} unit="m³/s" symbolTip="Absorber capacity" unitTip="Cubic meters per second" />
            <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" symbolTip="Product water capacity" unitTip="Metric tons per hour" />
            <InputRow symbol="M0" value={M0} onChange={setM0} unit="t/h" symbolTip="Raw feed water" unitTip="Metric tons per hour" />
            <InputRow symbol="Mf" value={Mf} onChange={setMf} unit="t/h" symbolTip="Feed water flow" unitTip="Metric tons per hour" />
            <InputRow symbol="SEC" value={SEC} onChange={setSEC} unit="MJ/t" symbolTip="Specific steam exergy" unitTip="Megajoules per metric ton" />
            <InputRow symbol="ELC" value={ELC} onChange={setELC} unit="MJ/t" symbolTip="Electricity consumption" unitTip="Megajoules per metric ton" />
            <InputRow symbol="Danti" value={Danti} onChange={setDanti} unit="L/h" symbolTip="Antiscalant dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="Dacid" value={Dacid} onChange={setDacid} unit="L/h" symbolTip="Acid dosing rate" unitTip="Liters per hour" />
            <InputRow symbol="pV" value={pV} onChange={setpV} unit="-" symbolTip="Feed water pH" unitTip="Dimensionless" />
            <InputRow symbol="Th" value={Th} onChange={setTh} unit="°C" symbolTip="Brine heater temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="Td" value={Td} onChange={setTd} unit="°C" symbolTip="Distillate temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="T0" value={T0} onChange={setT0} unit="°C" symbolTip="Feed water temperature" unitTip="Degrees Celsius" />
            <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/L" symbolTip="Feed water salinity" unitTip="Grams per liter" />
          </div>

          {/* Column 2 - Factors */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Factors</div>
            <InputRow symbol="Y" value={Y} onChange={setY} unit="yr" symbolTip="Life span" unitTip="Years" />
            <InputRow symbol="LF" value={LF} onChange={setLF} unit="-" symbolTip="Load factor" unitTip="Dimensionless" />
            <InputRow symbol="r" value={r} onChange={setR} unit="-" symbolTip="Discount rate" unitTip="Dimensionless" />
            {/* CAPEX Cost Factors */}
            <InputRow symbol="Caa" value={Caa} onChange={setCaa} unit="$/m²" symbolTip="Brine heater area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cab" value={Cab} onChange={setCab} unit="$/m²" symbolTip="MSF stage area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cac" value={Cac} onChange={setCac} unit="$/m²" symbolTip="Upper MED effect area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cad" value={Cad} onChange={setCad} unit="$/m²" symbolTip="Lower MED effect area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cae" value={Cae} onChange={setCae} unit="$/m²" symbolTip="Preheater area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Caf" value={Caf} onChange={setCaf} unit="$/m²" symbolTip="Absorber area cost" unitTip="Dollars per square meter" />
            <InputRow symbol="Cp0" value={Cp0} onChange={setCp0} unit="$/(bar·t/h)" symbolTip="Intake pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cpd" value={Cpd} onChange={setCpd} unit="$/(bar·t/h)" symbolTip="Discharge pump cost factor" unitTip="Dollars per bar per t/h" />
            <InputRow symbol="Cvc" value={Cvc} onChange={setCvc} unit="$/(m³/s)" symbolTip="Vapor compressor capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Caz" value={Caz} onChange={setCaz} unit="$/(m³/s)" symbolTip="Absorber capacity factor" unitTip="Dollars per m³/s" />
            <InputRow symbol="Cwt" value={Cwt} onChange={setCwt} unit="$/(t/h)" symbolTip="Water treatment cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Cintake" value={Cintake} onChange={setCintake} unit="$/(t/h)" symbolTip="Intake structure cost factor" unitTip="Dollars per t/h" />
            <InputRow symbol="Cinst" value={Cinst} onChange={setCinst} unit="%" symbolTip="Installation cost % of equipment" unitTip="Percent of equipment cost" />
            <InputRow symbol="Ceng" value={Ceng} onChange={setCeng} unit="%" symbolTip="Engineering cost % of equipment" unitTip="Percent of equipment cost" />
            {/* OPEX Cost Factors */}
            <InputRow symbol="Csec" value={Csec} onChange={setCsec} unit="$/MJ" symbolTip="Steam exergy cost" unitTip="Dollars per megajoule" />
            <InputRow symbol="Celc" value={Celc} onChange={setCelc} unit="$/MJ" symbolTip="Electricity price" unitTip="Dollars per megajoule" />
            <InputRow symbol="Canti" value={Canti} onChange={setCanti} unit="$/L" symbolTip="Antiscalant cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Cacid" value={Cacid} onChange={setCacid} unit="$/L" symbolTip="Acid cost factor" unitTip="Dollars per liter" />
            <InputRow symbol="Clabor" value={Clabor} onChange={setClabor} unit="$/t" symbolTip="Labor cost factor" unitTip="Dollars per metric ton" />
            <InputRow symbol="Cmain" value={Cmain} onChange={setCmain} unit="%/yr" symbolTip="Annual maintenance cost as percentage of total CAPEX" unitTip="Percent of CAPEX per year" />
            <InputRow symbol="Cover" value={Cover} onChange={setCover} unit="%" symbolTip="Overhead cost % of OPEX-total" unitTip="Percent of OPEX total" />
          </div>

          {/* Column 3 - Outputs */}
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
            <OutputRow symbol="CAPEX_area" value={CAPEX_area} unit="$" symbolTip="Total heat transfer area CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_Pump" value={CAPEX_Pump} unit="$" symbolTip="Pump CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_wt" value={CAPEX_wt} unit="$" symbolTip="Water treatment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_intake" value={CAPEX_intake} unit="$" symbolTip="Intake structure CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_vc" value={CAPEX_vc} unit="$" symbolTip="Vapor compressor CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_az" value={CAPEX_az} unit="$" symbolTip="Absorber CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_equip" value={CAPEX_equip} unit="$" symbolTip="Total equipment CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_civil" value={CAPEX_civil} unit="$" symbolTip="Civil works CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_inst" value={CAPEX_inst} unit="$" symbolTip="Installation cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_eng" value={CAPEX_eng} unit="$" symbolTip="Engineering cost" unitTip="Dollars" />
            <OutputRow symbol="CAPEX_total" value={CAPEX_total} unit="$" symbolTip="Total CAPEX" unitTip="Dollars" />
            <OutputRow symbol="CAPX_spec" value={CAPX_spec} unit="$/(t/h)" symbolTip="Specific CAPEX" unitTip="Dollars per t/h" />
            <OutputRow symbol="CRF" value={CRF} unit="-" symbolTip="Capital recovery factor" unitTip="Dimensionless" />
            <OutputRow symbol="Ucap" value={Ucap} unit="$/t" symbolTip="Annualized capital cost" unitTip="Dollars per metric ton" />

            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="font-semibold text-xs text-muted-foreground mb-2">Outputs</div>
              <OutputRow symbol="OPEX_sec" value={OPEX_sec} unit="$/t" symbolTip="Specific exergy consumption cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_elc" value={OPEX_elc} unit="$/t" symbolTip="Electricity cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_anti" value={Cantiscalant} unit="$/t" symbolTip="Antiscalant cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_acid" value={Cacid_dose} unit="$/t" symbolTip="Acid cost" unitTip="Dollars per metric ton" />

              <OutputRow symbol="OPEX_labor" value={Clabor} unit="$/t" symbolTip="Labor cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_maint" value={Cmain_annual} unit="$/t" symbolTip="Maintenance cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_over" value={Cover_annual} unit="$/t" symbolTip="Overhead cost" unitTip="Dollars per metric ton" />
              <OutputRow symbol="OPEX_total" value={OPEX_total_with_overhead} unit="$/t" symbolTip="Total OPEX" unitTip="Dollars per metric ton" />
              <OutputRow symbol="UPC" value={UPC} unit="$/t" symbolTip="Unit Production Cost" unitTip="Dollars per metric ton" />
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          title="MSH Water Cost" 
          sections={[
            {
              title: "Inputs",
              rows: [
                { symbol: "Nst", value: fmt(Nst), unit: "#" },
                { symbol: "Nef1", value: fmt(Nef1), unit: "#" },
                { symbol: "Nef2", value: fmt(Nef2), unit: "#" },
                { symbol: "Aa", value: fmt(Aa), unit: "m²" },
                { symbol: "Ab", value: fmt(Ab), unit: "m²" },
                { symbol: "Ac", value: fmt(Ac), unit: "m²" },
                { symbol: "Ad", value: fmt(Ad), unit: "m²" },
                { symbol: "Ae", value: fmt(Ae), unit: "m²" },
                { symbol: "Af", value: fmt(Af), unit: "m²" },
                { symbol: "P0", value: fmt(P0), unit: "bar" },
                { symbol: "Pd", value: fmt(Pd), unit: "bar" },
                { symbol: "VC", value: fmt(VC), unit: "m³/s" },
                { symbol: "AZ", value: fmt(AZ), unit: "m³/s" },
                { symbol: "Md", value: fmt(Md), unit: "t/h" },
                { symbol: "M0", value: fmt(M0), unit: "t/h" },
                { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
                { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
                { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
                { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
                { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
                { symbol: "pV", value: fmt(pV), unit: "-" },
                { symbol: "Th", value: fmt(Th), unit: "°C" },
                { symbol: "Td", value: fmt(Td), unit: "°C" },
                { symbol: "T0", value: fmt(T0), unit: "°C" },
                { symbol: "S0", value: fmt(S0), unit: "g/L" },
                { symbol: "Y", value: fmt(Y), unit: "yr" },
                { symbol: "LF", value: fmt(LF), unit: "-" },
                { symbol: "r", value: fmt(r), unit: "-" },
              ]
            },
            {
              title: "Factors",
              rows: [
                { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
                { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },
                { symbol: "Cac", value: fmt(Cac), unit: "$/m²" },
                { symbol: "Cad", value: fmt(Cad), unit: "$/m²" },
                { symbol: "Cae", value: fmt(Cae), unit: "$/m²" },
                { symbol: "Caf", value: fmt(Caf), unit: "$/m²" },
                { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
                { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },
                { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },
                { symbol: "Caz", value: fmt(Caz), unit: "$/(m³/s)" },
                { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
                { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },
                { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
                { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
                { symbol: "Ceng", value: fmt(Ceng), unit: "%" },
                { symbol: "Csec", value: fmt(Csec), unit: "$/MJ" },
                { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
                { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
                { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
                { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "Cmain", value: fmt(Cmain), unit: "%/yr" },
                { symbol: "Cover", value: fmt(Cover), unit: "%" },
              ]
            },
            {
              title: "Outputs",
              rows: [
                { symbol: "CAPEX_area", value: fmt(CAPEX_area), unit: "$" },
                { symbol: "CAPEX_Pump", value: fmt(CAPEX_Pump), unit: "$" },
                { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
                { symbol: "CAPEX_intake", value: fmt(CAPEX_intake), unit: "$" },
                { symbol: "CAPEX_vc", value: fmt(CAPEX_vc), unit: "$" },
                { symbol: "CAPEX_az", value: fmt(CAPEX_az), unit: "$" },
                { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
                { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
                { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
                { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },
                { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
                { symbol: "CAPX_spec", value: fmt(CAPX_spec), unit: "$/(t/h)" },
                { symbol: "CRF", value: fmt(CRF), unit: "-" },
                { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },
                { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
                { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
                { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
                { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },

                { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
                { symbol: "OPEX_maint", value: fmt(Cmain_annual), unit: "$/t" },
                { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
                { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },
                { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
              ]
            }
          ]}
          onReset={resetToDefaults}
        />
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function BDSCalculator() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'romodules' | 'chemistry' | 'cost'>('general');

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
        <div className="container max-w-7xl mx-auto">
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
      <main className="container max-w-7xl mx-auto py-4 px-6">
        {/* Tab Navigation - Fixed at top */}
        <div className="mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2">
          <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl border border-border/50">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'general'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <Calculator className="w-4 h-4" />
              BDS Converter
            </button>
            <button
              onClick={() => setActiveTab('romodules')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'romodules'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              RO Modules
            </button>
            <button
              onClick={() => setActiveTab('chemistry')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'chemistry'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <FlaskRound className="w-4 h-4" />
              Water Analysis
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
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
        </section>
          </>
        )}

        {/* ─── RO Modules Tab Content ─────────────────────────── */}
        {activeTab === 'romodules' && (
          <>
            {/* Tip */}
            <div className="mb-4 p-2.5 bg-secondary/50 rounded-lg border border-border/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Hover over any symbol or unit to see its full description. Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
              </p>
            </div>
            <section className="mb-8">
              <div className="mb-5">
                <ROElementPbGiven />
              </div>
            </section>
          </>
        )}

        {/* ─── Water Analysis Tab Content ─────────────────────── */}
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
                Water Analysis
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
              <div className="mb-5">
                <ROWaterCost />
              </div>
              <div className="mb-5">
                <MSFWaterCost />
              </div>
              <div className="mb-5">
                <MEDWaterCost />
              </div>
              <div className="mb-5">
                <MSHWaterCost />
              </div>
              <div className="mb-5">
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
