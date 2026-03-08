"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import { Droplets } from "lucide-react";

const INFO = {
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "m/s.bar": "Meter per second per bar",
  "w": "Water Permeability"
};

export default function WaterPermeability() {
  const [wLmhBar, setWLmhBar] = useState("");
  const [wMsBar, setWMsBar] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const nLmhBar = wLmhBar === "" || wLmhBar === "-" ? null : Number(wLmhBar);
  const nMsBar = wMsBar === "" || wMsBar === "-" ? null : Number(wMsBar);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Water Permeability [l/m².h.bar]">
          <RowInput
            label="w"
            unit="l/m².h.bar"
            value={wLmhBar}
            onChange={(e) => allowNumber(e.target.value, setWLmhBar)}
            onBlur={() => formatOnBlur(wLmhBar, setWLmhBar)}
          />

          <RowView
            label="w"
            value={
              nLmhBar === null
                ? "-"
                : (nLmhBar / (3600 * 1000)).toExponential(4).replace("e","E")
            }
            unit="m/s.bar"
          />
        </Section>

        <Section title="Water Permeability [m/s.bar]">
          <RowInput
            label="w"
            unit="m/s.bar"
            value={wMsBar}
            onChange={(e) => allowNumber(e.target.value, setWMsBar)}
            onBlur={() => formatOnBlur(wMsBar, setWMsBar)}
          />

          <RowView
            label="w"
            value={
              nMsBar === null
                ? "-"
                : (nMsBar * (3600 * 1000)).toFixed(4)
            }
            unit="l/m².h.bar"
          />
        </Section>

      </div>
    </div>
  );
}

/* ===== Card Section ===== */

function Section({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden ">

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
        <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
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
       <Tooltip text={INFO[label]}>
        <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
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