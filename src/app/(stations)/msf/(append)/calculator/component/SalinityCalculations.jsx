"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import { FlaskConical } from "lucide-react";
const INFO = {
  "°C": "Celcius",
  "µs/cm": "microsiemens per centimeter",
  ppm: "part per million",
  "g/l": "gram per liter",
  "%": "precent",

  T: "Saline water temperatuer T",
  EC: "Electrical conducitvity EC",
  S: "Salinity (Total desolved solid TDS)",
};

export default function SalinityCalculations() {
  const [temperature, setTemperature] = useState("");
  const [conductivity, setConductivity] = useState("");
  const [salinityPPM, setSalinityPPM] = useState("");


  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatNumber = (num, digits = 6) => {
    if (num === "-" || num === "" || num === null || num === undefined)
      return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ===== Salinity From T & EC ===== */
  const calculatedPPM = (() => {
    if (!temperature || !conductivity) return "-";

    const T = Number(temperature);
    const EC = Number(conductivity);
    if (isNaN(T) || isNaN(EC)) return "-";

    const ecAdj = EC * (1 + 0.022 * (25 - T))

    const result = ecAdj * (
    0.5 + 
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 100) / (ecAdj - 100.0001)) +
    0.1 * (0.5 + 0.5 * Math.abs(ecAdj - 1000) / (ecAdj - 1000.0001)) +
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 40000) / (ecAdj - 40000.0001)) +
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 60000) / (ecAdj - 60000.0001))
  )

    return formatNumber(result, 4);
  })();


  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">
      <div className="flex items-center gap-2">
         <FlaskConical className="w-5 h-5 text-sky-700" />
        <span className="text-xl font-semibold text-gray-300 tracking-wide">
          RO Specific Calculators
        </span>
      </div>
      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Electrical Conductivity Converter">
                <RowInput
                    label="T"
                    unit="°C"
                    value={temperature}
                    set={setTemperature}
                    allow={allow}
                    formatOnBlur={formatOnBlur}
                />

                <RowInput
                    label="EC"
                    unit="µs/cm"
                    value={conductivity}
                    set={setConductivity}
                    allow={allow}
                    formatOnBlur={formatOnBlur}
                />

                <RowView label="S" unit="ppm" value={calculatedPPM} />
                </Section> 


            <Section title="Salinity Convertor">
                <RowInput
                    label="S"
                    unit="ppm"
                    value={salinityPPM}
                    set={setSalinityPPM}
                    allow={allow}
                    formatOnBlur={formatOnBlur}
                />

                <RowView
                    label="S"
                    unit="g/l"
                    value={
                    salinityPPM
                        ? formatNumber(Number(salinityPPM) / 1000, 4)
                        : "-"
                    }
                />

                <RowView
                    label="S"
                    unit="%"
                    value={
                    salinityPPM
                        ? formatNumber(Number(salinityPPM) / 10000, 4)
                        : "-"
                    }
                />
                </Section> 
      </div>
    </div>
  );
}

/* ===== Card Section ===== */

function Section({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-500 text-white px-4 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
         <FlaskConical className="w-4 h-4" />
        <span className="text-base">
          {title}
        </span>
      </div>

      {/* Body */}
      <div className="p-2">
        {children}
      </div>

    </div>
  );
}
function RowInput({ label, unit, value, set, allow, formatOnBlur }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">

      <Tooltip text={INFO[label]}>
      <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
      </Tooltip>

      <input
        type="text"
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        className="w-full font-mono text-center bg-gray-50 rounded-lg py-2
                   outline-none border border-gray-200
                   transition-all duration-300 ease-in-out
                   focus:ring-2 focus:ring-teal-400
                   focus:ring-offset-1 focus:ring-offset-gray-100
                   focus:shadow-[0_0_12px_rgba(52,211,153,0.7)]
                   placeholder-gray-400"
        placeholder="Enter value"
      />

      <div className="text-right" dir="ltr">
        <Tooltip text={INFO[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}
function RowView({label, unit, value }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

      <Tooltip text={INFO[label]}>
      <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
      </Tooltip>

      <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={INFO[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}