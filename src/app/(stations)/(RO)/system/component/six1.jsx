"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_W = {
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "m/s.bar": "Meter per second per bar",
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

  const formatScientific = (num, decimals = 2) => {
    if (num === null || num === "-" || isNaN(num)) return "-";
    return Number(num).toExponential(decimals).replace("e", "E");
  };

  const nLmhBar = wLmhBar === "" || wLmhBar === "-" ? null : Number(wLmhBar);
  const nMsBar = wMsBar === "" || wMsBar === "-" ? null : Number(wMsBar);

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Water Permeability (W)</h2>


        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          <Section>
            <RowInput
              label="W"
              unit="l/m².h.bar"
              value={wLmhBar}
              onChange={(e) => allowNumber(e.target.value, setWLmhBar)}
              onBlur={() => formatOnBlur(wLmhBar, setWLmhBar)}
            />
            <RowView
              label="W"
              value={nLmhBar === null ? "-" : nLmhBar / (3600 * 1000)}
              unit="m/s.bar"
              formatter={formatScientific}
            />
          </Section>

          <Section>
            <RowInput
              label="W"
              unit="m/s.bar"
              value={wMsBar}
              onChange={(e) => allowNumber(e.target.value, setWMsBar)}
              onBlur={() => formatOnBlur(wMsBar, setWMsBar)}
            />
            <RowView
              label="W"
              value={nMsBar === null ? "-" : nMsBar * (3600 * 1000)}
              unit="l/m².h.bar"
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
        <Tooltip text={infoMap_W[unit]}>
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
        <Tooltip text={infoMap_W[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}