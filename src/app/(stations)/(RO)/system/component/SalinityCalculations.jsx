"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_7 = {
  "°C": "Celcius",
  "µs/cm": "microsiemens per centimeter",
  ppm: "part per million",
  "mg/l": "milligram per liter",
  "g/l": "gram per liter",
  "%": "precent",
  bar: "bar",
  T: "Saline water temperatuer T",
  EC: "Electrical conducitvity EC",
  S: "Salinity (Total desolved solid TDS)",
  π: "Osmotic pressure [bar]",
};

export default function SalinityCalculations() {
  const [g4, setG4] = useState("");
  const [g5, setG5] = useState("");
  const [g8, setG8] = useState("");
  const [g28, setG28] = useState("");
  const [g29, setG29] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);
  const fmt = (v, s) => {
    if (v === "" || v === "-") return;
    const n = Number(v);
    if (!isNaN(n)) s(n.toFixed(4));
  };

  const ppm = (() => {
    if (g4 === "" || g5 === "") return "-";
    const T = Number(g4);
    const EC = Number(g5);
    if (isNaN(T) || isNaN(EC)) return "-";
    const A = EC * (1 + 0.022 * (T - 25));
    const result =
      A *
      (0.5 +
        0.05 * (0.5 + (0.5 * Math.abs(A - 100)) / (A - 100 + 1e-7)) +
        0.1 * (0.5 + (0.5 * Math.abs(A - 1000)) / (A - 1000 + 1e-7)) +
        0.05 * (0.5 + (0.5 * Math.abs(A - 40000)) / (A - 40000 + 1e-7)) +
        0.05 * (0.5 + (0.5 * Math.abs(A - 60000)) / (A - 60000 + 1e-7)));
    return result.toFixed(4);
  })();

  const PI =
    g28 && g29
      ? (0.00255 * (273 + Number(g28)) * Number(g29)).toFixed(2)
      : "-";

  return (
    <div className="space-y-8">
      <Section title="Electrical Conductivity Convertor">
        <Input label="T" unit="°C" value={g4} set={setG4} allow={allow} fmt={fmt} autoFocus />
        <Input label="EC" unit="µs/cm" value={g5} set={setG5} allow={allow} fmt={fmt} />
        <View label="S" unit="ppm" value={ppm} />
      </Section>

      <Section title="Salinity Convertor">
        <Input label="S" unit="ppm" value={g8} set={setG8} allow={allow} fmt={fmt} />
        <View label="S" unit="mg/l" value={g8 || "-"} />
        <View label="S" unit="g/l" value={g8 ? (Number(g8) / 1000).toFixed(4) : "-"} />
        <View label="S" unit="%" value={g8 ? (Number(g8) / 10000).toFixed(4) : "-"} />
      </Section>

      <Section title="Osmotic Pressure">
        <Input label="T" unit="°C" value={g28} set={setG28} allow={allow} fmt={fmt} />
        <Input label="S" unit="g/l" value={g29} set={setG29} allow={allow} fmt={fmt} />
        <View label="π" unit="bar" value={PI} />
      </Section>
    </div>
  );
}
function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, unit, value, set, allow, fmt, autoFocus }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-green-50 rounded-xl">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => fmt(value, set)}
        onClick={(e) => e.target.select()}
        autoFocus={autoFocus}
        className="border rounded p-1 text-center"
      />
      <span>{unit}</span>
    </div>
  );
}

function View({ label, unit, value }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-50 rounded-xl">
      <span>{label}</span>
      <span className="font-bold text-center">{value}</span>
      <span>{unit}</span>
    </div>
  );
}
