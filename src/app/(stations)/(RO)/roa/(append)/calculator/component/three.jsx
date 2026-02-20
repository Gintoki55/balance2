// Water flow convertor  M
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_3 = {
  MIGD: "Million Imperial Gallon per day (Liquid water flow)",
  "m³/day": "Cubic meter per day (liquid water flow)",
  "t/h": "Metric ton per hour (as m³/h for liquid water)",
  "kg/s": "Kilogram per second (as l/s for liquid water )",
};

export default function Three() {
  const [c25, setC25] = useState("");
  const [c29, setC29] = useState("");
  const [c33, setC33] = useState("");
  const [c37, setC37] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const n25 = c25 === "" || c25 === "-" ? null : Number(c25);
  const n29 = c29 === "" || c29 === "-" ? null : Number(c29);
  const n33 = c33 === "" || c33 === "-" ? null : Number(c33);
  const n37 = c37 === "" || c37 === "-" ? null : Number(c37);

return (
  <div className="max-w-7xl w-full space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Water flow convertor M
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-300 shadow-lg">

      {/* ===== Left Column ===== */}
      <div className="space-y-6 pl-6 pt-6 pr-1 pb-6">

        {/* MIGD */}
        <Section title="MIGD input">
          <RowInput
            label="M"
            unit="MIGD"
            value={c25}
            onChange={(e) => allowNumber(e.target.value, setC25)}
            onBlur={() => formatOnBlur(c25, setC25)}
            autoFocus
          />
          <RowView label="M" value={n25 === null ? "-" : ((n25 * 1_000_000) / 220).toFixed(4)} unit="m³/day" />
          <RowView label="M" value={n25 === null ? "-" : ((n25 * 1_000_000) / (220 * 24)).toFixed(4)} unit="t/h" />
          <RowView label="M" value={n25 === null ? "-" : ((n25 * 4_545_454) / 86400).toFixed(4)} unit="kg/s" />
        </Section>

        {/* t/h */}
        <Section title="t/h input">
          <RowInput
            label="M"
            unit="t/h"
            value={c33}
            onChange={(e) => allowNumber(e.target.value, setC33)}
            onBlur={() => formatOnBlur(c33, setC33)}
          />
          <RowView label="M" value={n33 === null ? "-" : ((n33 * 1000) / 3600).toFixed(4)} unit="kg/s" />
          <RowView label="M" value={n33 === null ? "-" : ((n33 * 24 * 220) / 1_000_000).toFixed(4)} unit="MIGD" />
          <RowView label="M" value={n33 === null ? "-" : (n33 * 24).toFixed(4)} unit="m³/day" />
        </Section>

      </div>

      {/* ===== Right Column ===== */}
      <div className="space-y-6 pr-6 pt-6 pl-1 pb-6">

        {/* m³/day */}
        <Section title="m³/day input">
          <RowInput
            label="M"
            unit="m³/day"
            value={c29}
            onChange={(e) => allowNumber(e.target.value, setC29)}
            onBlur={() => formatOnBlur(c29, setC29)}
          />
          <RowView label="M" value={n29 === null ? "-" : ((n29 + 0.0001) / 24).toFixed(4)} unit="t/h" />
          <RowView label="M" value={n29 === null ? "-" : ((n29 * 1000) / 86400).toFixed(4)} unit="kg/s" />
          <RowView label="M" value={n29 === null ? "-" : ((n29 * 220) / 1_000_000).toFixed(4)} unit="MIGD" />
        </Section>

        {/* kg/s */}
        <Section title="kg/s input">
          <RowInput
            label="M"
            unit="kg/s"
            value={c37}
            onChange={(e) => allowNumber(e.target.value, setC37)}
            onBlur={() => formatOnBlur(c37, setC37)}
          />
          <RowView label="M" value={n37 === null ? "-" : ((n37 * 86400) / 4_545_454).toFixed(4)} unit="MIGD" />
          <RowView label="M" value={n37 === null ? "-" : ((n37 * 86400) / 1000).toFixed(4)} unit="m³/day" />
          <RowView label="M" value={n37 === null ? "-" : ((n37 * 3600) / 1000).toFixed(4)} unit="t/h" />
        </Section>

      </div>

    </div>
  </div>
);

}

/* ===== Helpers (نفس رقم 5) ===== */

function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0 border-gray-300">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-2 rounded-l bg-green-50">
      <div className="font-semibold text-gray-700 text-left">{label}</div>

      <div className="flex justify-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={(e) => e.target.select()}
          dir="ltr"
          inputMode="decimal"
          autoFocus={autoFocus}
          className="w-full max-w-[180px] text-center border border-gray-300 rounded p-1"
        />
      </div>

      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_3[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-l bg-gray-50">
      <div className="font-semibold text-gray-700 text-left">{label}</div>

      <div className="text-l font-bold text-center">{value}</div>

      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_3[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
