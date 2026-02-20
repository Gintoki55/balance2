"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_7 = {
  "g/l": "gram per liter",
  "%": "precent",
  S0: "Raw water salinity [g/l]",
  Sb: "Brine water salinity [g/l]",
  Sd: "Product water salinity [g/l]",
  WR: "Precent water recovery [%]",
};

export default function WaterRecovery() {
  const [g13, setG13] = useState("");
  const [g14, setG14] = useState("");
  const [g15, setG15] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);
  const fmt = (v, s) => {
    if (v === "" || v === "-") return;
    const n = Number(v);
    if (!isNaN(n)) s(n.toFixed(4));
  };

  const WR =
    g13 && g14 && g15
      ? (
          (100 * (Number(g14) - Number(g13))) /
          (Number(g14) - Number(g15) || 1)
        ).toFixed(4)
      : "-";

  return (
    <Section title="Water Recovery">
      <Input label="S0" unit="g/l" value={g13} set={setG13} allow={allow} fmt={fmt} autoFocus />
      <Input label="Sb" unit="g/l" value={g14} set={setG14} allow={allow} fmt={fmt} />
      <Input label="Sd" unit="g/l" value={g15} set={setG15} allow={allow} fmt={fmt} />
      <View label="WR" unit="%" value={WR} />
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
