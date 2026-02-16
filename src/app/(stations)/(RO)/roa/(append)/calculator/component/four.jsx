// Pressure convertor  P
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_4 = {
  bar: "bar",
  kPa: "KiloPascal",
  MPa: "megaPascal",
  psi: "inches per square pound",
};

export default function Four() {
  const [c43, setC43] = useState("");
  const [c47, setC47] = useState("");
  const [c51, setC51] = useState("");
  const [c55, setC55] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const n43 = c43 === "" || c43 === "-" ? null : Number(c43);
  const n47 = c47 === "" || c47 === "-" ? null : Number(c47);
  const n51 = c51 === "" || c51 === "-" ? null : Number(c51);
  const n55 = c55 === "" || c55 === "-" ? null : Number(c55);

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Pressure Converter P
      </h2>

      {/* ===== bar ===== */}
      <Section title="bar input">
        <RowInput
          label="P"
          unit="bar"
          value={c43}
          onChange={(e) => allowNumber(e.target.value, setC43)}
          onBlur={() => formatOnBlur(c43, setC43)}
          autoFocus
        />
        <RowView label="P" value={n43 === null ? "-" : (n43 * 100).toFixed(4)} unit="kPa" />
        <RowView label="P" value={n43 === null ? "-" : (n43 / 10).toFixed(4)} unit="MPa" />
        <RowView label="P" value={n43 === null ? "-" : (n43 * 14.55).toFixed(4)} unit="psi" />
      </Section>

      {/* ===== kPa ===== */}
      <Section title="kPa input">
        <RowInput
          label="P"
          unit="kPa"
          value={c47}
          onChange={(e) => allowNumber(e.target.value, setC47)}
          onBlur={() => formatOnBlur(c47, setC47)}
        />
        <RowView label="P" value={n47 === null ? "-" : (n47 / 1000).toFixed(4)} unit="MPa" />
        <RowView label="P" value={n47 === null ? "-" : (n47 * 0.1455).toFixed(4)} unit="psi" />
        <RowView label="P" value={n47 === null ? "-" : (n47 / 100).toFixed(4)} unit="bar" />
      </Section>

      {/* ===== MPa ===== */}
      <Section title="MPa input">
        <RowInput
          label="P"
          unit="MPa"
          value={c51}
          onChange={(e) => allowNumber(e.target.value, setC51)}
          onBlur={() => formatOnBlur(c51, setC51)}
        />
        <RowView label="P" value={n51 === null ? "-" : (n51 * 145.5).toFixed(4)} unit="psi" />
        <RowView label="P" value={n51 === null ? "-" : (n51 * 10).toFixed(4)} unit="bar" />
        <RowView label="P" value={n51 === null ? "-" : (n51 * 1000).toFixed(4)} unit="kPa" />
      </Section>

      {/* ===== psi ===== */}
      <Section title="psi input">
        <RowInput
          label="P"
          unit="psi"
          value={c55}
          onChange={(e) => allowNumber(e.target.value, setC55)}
          onBlur={() => formatOnBlur(c55, setC55)}
        />
        <RowView label="P" value={n55 === null ? "-" : (n55 / 14.55).toFixed(4)} unit="bar" />
        <RowView label="P" value={n55 === null ? "-" : (n55 / 0.1455).toFixed(4)} unit="kPa" />
        <RowView label="P" value={n55 === null ? "-" : (n55 / 145.5).toFixed(4)} unit="MPa" />
      </Section>
    </div>
  );
}

/* ===== Helpers (نفس رقم 5) ===== */

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
          <Tooltip text={infoMap_4[unit]}>
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
          <Tooltip text={infoMap_4[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
