// Temperature convertor  T
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_1 = {
  "°C": "Celsius",
  K: "Kelvin",
  "°F": "Fahrenheit",
};

export default function One() {
  const [c3, setC3] = useState("");
  const [c6, setC6] = useState("");
  const [c9, setC9] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const n3 = c3 === "" || c3 === "-" ? null : Number(c3);
  const n6 = c6 === "" || c6 === "-" ? null : Number(c6);
  const n9 = c9 === "" || c9 === "-" ? null : Number(c9);

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Temperature Converter T</h2>

      {/* ===== Celsius ===== */}
      <Section title="°C input">
        <RowInput
          label="T"
          unit="°C"
          value={c3}
          onChange={(e) => allowNumber(e.target.value, setC3)}
          onBlur={() => formatOnBlur(c3, setC3)}
          autoFocus
        />
        <RowView
          label="T"
          value={n3 === null ? "-" : (n3 + 273.15).toFixed(4)}
          unit="K"
        />
        <RowView
          label="T"
          value={n3 === null ? "-" : (32 + 1.8 * n3).toFixed(4)}
          unit="°F"
        />
      </Section>

      {/* ===== Kelvin ===== */}
      <Section title="K input">
        <RowInput
          label="T"
          unit="K"
          value={c6}
          onChange={(e) => allowNumber(e.target.value, setC6)}
          onBlur={() => formatOnBlur(c6, setC6)}
        />
        <RowView
          label="T"
          value={n6 === null ? "-" : (1.8 * n6 - 459.67).toFixed(4)}
          unit="°F"
        />
        <RowView
          label="T"
          value={n6 === null ? "-" : (n6 - 273.15).toFixed(4)}
          unit="°C"
        />
      </Section>

      {/* ===== Fahrenheit ===== */}
      <Section title="°F input">
        <RowInput
          label="T"
          unit="°F"
          value={c9}
          onChange={(e) => allowNumber(e.target.value, setC9)}
          onBlur={() => formatOnBlur(c9, setC9)}
        />
        <RowView
          label="T"
          value={n9 === null ? "-" : (((n9 - 32) * 5) / 9).toFixed(4)}
          unit="°C"
        />
        <RowView
          label="T"
          value={n9 === null ? "-" : (((n9 + 459.67) * 5) / 9).toFixed(4)}
          unit="K"
        />
      </Section>
    </div>
  );
}

/* ===== Helpers (مثل جدول 5) ===== */

function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-xl bg-green-50">
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
          <Tooltip text={infoMap_1[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-xl bg-gray-50">
      <div className="font-semibold text-gray-700 text-left">{label}</div>

      <div className="text-l font-bold text-center">{value}</div>

      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_1[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
