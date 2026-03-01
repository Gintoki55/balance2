"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_M = {
  gfd: "Gallon per square foot per day",
  lmh: "liter per square meter per hour",
};

export default function WaterFlux() {
  const [mGfd, setMGfd] = useState("");
  const [mLmh, setMLmh] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatFixed4 = (num) => {
    if (num === null || num === "-" || isNaN(num)) return "-";
    return Number(num).toFixed(4);
  };

  const nGfd = mGfd === "" || mGfd === "-" ? null : Number(mGfd);
  const nLmh = mLmh === "" || mLmh === "-" ? null : Number(mLmh);

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Water Flux (M)</h2>

      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
        <Section>
          <RowInput
            label="M"
            unit="gfd"
            value={mGfd}
            onChange={(e) => allowNumber(e.target.value, setMGfd)}
            onBlur={() => formatOnBlur(mGfd, setMGfd)}
          />
          <RowView
            label="M"
            value={nGfd === null ? "-" : (nGfd * 3.785 * 10.76) / 24}
            unit="lmh"
            formatter={formatFixed4}
          />
        </Section>

        <Section>
          <RowInput
            label="M"
            unit="lmh"
            value={mLmh}
            onChange={(e) => allowNumber(e.target.value, setMLmh)}
            onBlur={() => formatOnBlur(mLmh, setMLmh)}
          />
          <RowView
            label="M"
            value={nLmh === null ? "-" : (nLmh * 24) / (3.785 * 10.76)}
            unit="gfd"
            formatter={formatFixed4}
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
        <Tooltip text={infoMap_M[unit]}>
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
        <Tooltip text={infoMap_M[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}