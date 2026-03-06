"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import { Droplets } from "lucide-react";

const INFO = {
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

  const nGmh = xGmh === "" || xGmh === "-" ? null : Number(xGmh);
  const nMs = xMs === "" || xMs === "-" ? null : Number(xMs);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Salt Permeability [g/m².h.(g/l)]">
          <RowInput
            label="X"
            unit="g/m².h.(g/l)"
            value={xGmh}
            onChange={(e) => allowNumber(e.target.value, setXGmh)}
            onBlur={() => formatOnBlur(xGmh, setXGmh)}
          />
          <RowView
            label="X"
            value={
              nGmh === null
                ? "-"
                : (nGmh / (3600 * 1000)).toExponential(4).replace("e", "E")
            }
            unit="m/s"
          />
        </Section>

        <Section title="Salt Permeability [m/s]">
          <RowInput
            label="X"
            unit="m/s"
            value={xMs}
            onChange={(e) => allowNumber(e.target.value, setXMs)}
            onBlur={() => formatOnBlur(xMs, setXMs)}
          />
          <RowView
            label="X"
            value={
              nMs === null
                ? "-"
                : (nMs * (3600 * 1000)).toFixed(4)
            }
            unit="g/m².h.(g/l)"
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
         <Droplets className="w-4 h-4" />
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
function RowInput({ label, unit, value, onChange, onBlur  }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">

      <Tooltip text={INFO[label]}>
        <div className="font-semibold text-gray-600">{label}</div>
      </Tooltip>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
       <Tooltip text={INFO[unit]}>
        <div className="font-semibold text-gray-600">{label}</div>
      </Tooltip>

       <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200 ">
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