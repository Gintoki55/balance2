"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_X = {
  "g/m².h.(g/l)": "Gram per square meter per hour per salinity gradient",
  "m/s": "Meter per second",
};

export default function SaltPermeability() {
  const [xGmh, setXGmh] = useState("");
  const [xMs, setXMs] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatScientific = (num, decimals = 2) => {
    if (num === null || num === "-" || isNaN(num)) return "-";
    return Number(num).toExponential(decimals).replace("e", "E");
  };

  const nGmh = xGmh === "" || xGmh === "-" ? null : Number(xGmh);
  const nMs = xMs === "" || xMs === "-" ? null : Number(xMs);

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Salt Permeability (X)</h2>

      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
        <Section>
          <RowInput
            label="X"
            unit="g/m².h.(g/l)"
            value={xGmh}
            onChange={(e) => allowNumber(e.target.value, setXGmh)}
            onBlur={() => formatOnBlur(xGmh, setXGmh)}
          />
          <RowView
            label="X"
            value={nGmh === null ? "-" : nGmh / (3600 * 1000)}
            unit="m/s"
            formatter={formatScientific}
          />

        </Section>
        <Section>
          <RowInput
            label="X"
            unit="m/s"
            value={xMs}
            onChange={(e) => allowNumber(e.target.value, setXMs)}
            onBlur={() => formatOnBlur(xMs, setXMs)}
          />
          <RowView
            label="X"
            value={nMs === null ? "-" : nMs * (3600 * 1000)}
            unit="g/m².h.(g/l)"
            formatter={formatScientific}
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

function RowInput({ label, unit, value, onChange, onBlur }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 rounded-l bg-green-50">
      <span className="font-semibold text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        className="w-full text-center border border-gray-300 rounded p-1"
      />
      <div className="flex justify-end" dir="ltr">
        <Tooltip text={infoMap_X[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}

function RowView({ label, value, unit, formatter }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-l bg-gray-50">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-l font-bold text-center">{formatter(value)}</span>
      <div className="flex justify-end" dir="ltr">
        <Tooltip text={infoMap_X[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}