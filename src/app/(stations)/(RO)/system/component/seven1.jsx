"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_Salinity = {
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

    const A = EC * (1 + 0.022 * (T - 25));

    const result =
      A *
      (0.5 +
        0.05 * (0.5 + (0.5 * Math.abs(A - 100)) / (A - 100.0001)) +
        0.1  * (0.5 + (0.5 * Math.abs(A - 1000)) / (A - 1000.0001)) +
        0.05 * (0.5 + (0.5 * Math.abs(A - 40000)) / (A - 40000.0001)) +
        0.05 * (0.5 + (0.5 * Math.abs(A - 60000)) / (A - 60000.0001)));

    return formatNumber(result, 4);
  })();

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Salinity Calculations
      </h2>

      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section>
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
                <Section>
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
                        ? formatNumber(Number(salinityPPM) / 1000, 6)
                        : "-"
                    }
                />

                <RowView
                    label="S"
                    unit="%"
                    value={
                    salinityPPM
                        ? formatNumber(Number(salinityPPM) / 10000, 6)
                        : "-"
                    }
                />
                </Section> 

      </div>
    </div>
  );
}

function Section({ children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4">
      {children}
    </div>
  );
}

/* ===== UI ===== */

function RowInput({ label, unit, value, set, allow, formatOnBlur }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-green-50">
      <Tooltip text={infoMap_Salinity[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
        onClick={(e) => e.target.select()}
        className="w-full text-center border border-gray-300 rounded p-1"
      />

      <Tooltip text={infoMap_Salinity[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">
          {unit}
        </span>
      </Tooltip>
    </div>
  );
}

function RowView({ label, unit, value }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-50">
      <Tooltip text={infoMap_Salinity[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <span className="font-bold text-center">{value}</span>

      <Tooltip text={infoMap_Salinity[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">
          {unit}
        </span>
      </Tooltip>
    </div>
  );
}