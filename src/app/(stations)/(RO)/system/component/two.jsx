// Volume convertor  V
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_2 = {
  "m³": "Meter cube",
  "IG (UK)": "Imperial gallon",
  "gl (US)": "Gallon",
  "ft³": "Cubic foot",
};

export default function Two() {
  const [c14, setC14] = useState("");
  const [c17, setC17] = useState("");
  const [c20, setC20] = useState("");
  const [c24, setC24] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const n14 = c14 === "" || c14 === "-" ? null : Number(c14);
  const n17 = c17 === "" || c17 === "-" ? null : Number(c17);
  const n20 = c20 === "" || c20 === "-" ? null : Number(c20);
  const n24 = c24 === "" || c24 === "-" ? null : Number(c24);

return (
  <div className="max-w-7xl w-full space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Volume Converter V</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-300 shadow-lg gap-4">

      {/* ===== Left Column ===== */}
      <div className="space-y-6 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4 ">

        {/* m³ input */}
        <Section>
          <RowInput
            label="V"
            unit="m³"
            value={c14}
            onChange={(e) => allowNumber(e.target.value, setC14)}
            onBlur={() => formatOnBlur(c14, setC14)}
            autoFocus
          />
          <RowView label="V" value={n14 === null ? "-" : (n14 * 35.3147).toFixed(4)} unit="ft³" />
          <RowView label="V" value={n14 === null ? "-" : (n14 * 220).toFixed(4)} unit="IG (UK)" />
          <RowView label="V" value={n14 === null ? "-" : (n14 * 264.2).toFixed(4)} unit="gl (US)" />
        </Section>

        {/* IG (UK) input */}
        <Section>
          <RowInput
            label="V"
            unit="IG (UK)"
            value={c17}
            onChange={(e) => allowNumber(e.target.value, setC17)}
            onBlur={() => formatOnBlur(c17, setC17)}
          />
          <RowView label="V" value={n17 === null ? "-" : (n17 * 264.2 / 220).toFixed(4)} unit="gl (US)" />
          <RowView label="V" value={n17 === null ? "-" : (n17 / 220).toFixed(4)} unit="m³" />
          <RowView label="V" value={n17 === null ? "-" : (n17 * 35.3147/220).toFixed(4)} unit="ft³" />
        </Section>

      </div>

      {/* ===== Right Column ===== */}
      <div className="space-y-6 rounded-l md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4">

        {/* ft³ input */}
        <Section>
          <RowInput
            label="V"
            unit="ft³"
            value={c24}
            onChange={(e) => allowNumber(e.target.value, setC24)}
            onBlur={() => formatOnBlur(c24, setC24)}
          />
          <RowView label="V" value={n24 === null ? "-" : (n24 *220/35.3147).toFixed(4)} unit="IG (UK)" />
          <RowView label="V" value={n24 === null ? "-" : (n24 *264.2/35.3147).toFixed(4)} unit="gl (US)" />
          <RowView label="V" value={n24 === null ? "-" : (n24 /35.3147).toFixed(4)} unit="m³" />
        </Section>

        {/* gl (US) input */}
        <Section >
          <RowInput
            label="V"
            unit="gl (US)"
            value={c20}
            onChange={(e) => allowNumber(e.target.value, setC20)}
            onBlur={() => formatOnBlur(c20, setC20)}
          />
          <RowView label="V" value={n20 === null ? "-" : (n20 / 264.2).toFixed(4)} unit="m³" />
          <RowView label="V" value={n20 === null ? "-" : (n20 * 35.3147/264.2).toFixed(4)} unit="ft³" />
          <RowView label="V" value={n20 === null ? "-" : (n20 * 220 / 264.2).toFixed(4)} unit="IG (UK)" />
        </Section>

      </div>

    </div>
  </div>
);

}

/* ===== Helpers (نفس جدول 5) ===== */

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
          <Tooltip text={infoMap_2[unit]}>
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
          <Tooltip text={infoMap_2[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
