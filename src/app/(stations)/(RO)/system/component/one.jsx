// Temperature convertor  T
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_1 = {
  "°C": "Celsius",
  K: "Kelvin",
  "°F": "Fahrenheit",
  "°R": "Rankine",
};

export default function One() {
  const [c3, setC3] = useState("");
  const [c6, setC6] = useState("");
  const [c9, setC9] = useState("");
  const [c12, setC12] = useState("");

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
  const n12 = c12 === "" || c12 === "-" ? null : Number(c12);

  return (
  <div className="max-w-7xl w-full space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Temperature Converter T
    </h2>

    {/* تقسيم عمودين */}
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-300 shadow-lg gap-4">

      {/* ===== Left Column ===== */}
      <div className="space-y-6 rounded-l md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4">

        {/* Celsius */}
        <Section>
          <RowInput
            label="T"
            unit="°C"
            value={c3}
            onChange={(e) => allowNumber(e.target.value, setC3)}
            onBlur={() => formatOnBlur(c3, setC3)}
            autoFocus
          />
          <RowView label="T" value={n3 === null ? "-" : (n3 + 273.15).toFixed(4)} unit="K" />
          <RowView label="T" value={n3 === null ? "-" : (32 + 1.8 * n3).toFixed(4)} unit="°F" />
          <RowView label="T" value={n3 === null ? "-" : ((273.15+n3)*9/5).toFixed(4)} unit="°R" />
        </Section>

        {/* Fahrenheit */}
        <Section >
          <RowInput
            label="T"
            unit="°F"
            value={c9}
            onChange={(e) => allowNumber(e.target.value, setC9)}
            onBlur={() => formatOnBlur(c9, setC9)}
          />
          <RowView label="T" value={n9 === null ? "-" : (n9+459.67).toFixed(4)} unit="°R" />
          <RowView label="T" value={n9 === null ? "-" : (((n9 - 32) * 5) / 9).toFixed(4)} unit="°C" />
          <RowView label="T" value={n9 === null ? "-" : (((n9 + 459.67) * 5) / 9).toFixed(4)} unit="K" />
        </Section>

      </div>

      {/* ===== Right Column ===== */}
      <div className="space-y-6 rounded-l md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4 ">

        {/* Kelvin */}
        <Section >
          <RowInput
            label="T"
            unit="K"
            value={c6}
            onChange={(e) => allowNumber(e.target.value, setC6)}
            onBlur={() => formatOnBlur(c6, setC6)}
          />
          <RowView label="T" value={n6 === null ? "-" : (1.8*n6-459.67).toFixed(4)} unit="°F" />
          <RowView label="T" value={n6 === null ? "-" : (n6 *9/5).toFixed(4)} unit="°R" />
          <RowView label="T" value={n6 === null ? "-" : (n6 -273.15).toFixed(4)} unit="°C" />
        </Section>

        {/* Rankine */}
        <Section >
          <RowInput
            label="T"
            unit="°R"
            value={c12}
            onChange={(e) => allowNumber(e.target.value, setC12)}
            onBlur={() => formatOnBlur(c12, setC12)}
          />
          <RowView label="T" value={n12 === null ? "-" : (n12 *5/9-273.15).toFixed(4)} unit="°C" />
          <RowView label="T" value={n12 === null ? "-" : (n12 *5/9).toFixed(4)} unit="K" />
          <RowView label="T" value={n12 === null ? "-" : (n12 -459.67).toFixed(4)} unit="°F" />
        </Section>

      </div>

    </div>
  </div>
);

}

/* ===== Helpers (مثل جدول 5) ===== */

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
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-l bg-gray-50">
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
