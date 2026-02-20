"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_7 = {
  "g/l": "gram per liter",
  "%": "precent",
  Sf: "Feed water salinity [g/l]",
  SR: "Precent slat rejection [%]",
  Sd: "Product water salinity [g/l]",
};

export default function SaltRejection() {
  const [g18, setG18] = useState("");
  const [g19, setG19] = useState("");
  const [g21, setG21] = useState("");
  const [g22, setG22] = useState("");
  const [g24, setG24] = useState("");
  const [g25, setG25] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);
  const fmt = (v, s) => {
    if (v === "" || v === "-") return;
    const n = Number(v);
    if (!isNaN(n)) s(n.toFixed(4));
  };

  const SR =
    g18 && g19
      ? ((100 * (Number(g18) - Number(g19))) / (Number(g18) || 1)).toFixed(2)
      : "-";

  const Sd_from_SR =
    g21 && g22 ? (((100 - Number(g21)) * Number(g22)) / 100).toFixed(2) : "-";

  const Sf_from_SR =
    g24 && g25
      ? ((100 * Number(g24)) / (100 - Number(g25) || 1)).toFixed(2)
      : "-";

  return (
    <Section title="Salt Rejection">
      <Input label="Sf" unit="g/l" value={g18} set={setG18} allow={allow} fmt={fmt} autoFocus />
      <Input label="Sd" unit="g/l" value={g19} set={setG19} allow={allow} fmt={fmt} />
      <View label="SR" unit="%" value={SR} />

      <div className="border-t border-dashed my-4"></div>

      <Input label="SR" unit="%" value={g21} set={setG21} allow={allow} fmt={fmt} />
      <Input label="Sf" unit="g/l" value={g22} set={setG22} allow={allow} fmt={fmt} />
      <View label="Sd" unit="g/l" value={Sd_from_SR} />

      <div className="border-t border-dashed my-4"></div>

      <Input label="Sd" unit="g/l" value={g24} set={setG24} allow={allow} fmt={fmt} />
      <Input label="SR" unit="%" value={g25} set={setG25} allow={allow} fmt={fmt} />
      <View label="Sf" unit="g/l" value={Sf_from_SR} />
    </Section>
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
