// RO water and salt permeation
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_6 = {
  gfd: "Gallon per square foot per day",
  lmh: "liter per square meter per hour",

  "l/m².h.bar": "Liter per square meter per hour per bar",
  "m/s.bar": "Meter per second per bar",

  "m/s": "Meter per second",
  "g/m².h.(g/l)": "Gram per square meter per hour per salinty gradient",
};

export default function Six() {
  /* ================= Water Flux (M) ================= */
  const [c73, setC73] = useState("");
  const [c75, setC75] = useState("");

  /* ================= Water Permeability (W) ================= */
  const [c78, setC78] = useState("");
  const [c80, setC80] = useState("");

  /* ================= Salt Permeability (X) ================= */
  const [c83, setC83] = useState("");
  const [c85, setC85] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const n73 = c73 === "" || c73 === "-" ? null : Number(c73);
  const n75 = c75 === "" || c75 === "-" ? null : Number(c75);
  const n78 = c78 === "" || c78 === "-" ? null : Number(c78);
  const n80 = c80 === "" || c80 === "-" ? null : Number(c80);
  const n83 = c83 === "" || c83 === "-" ? null : Number(c83);
  const n85 = c85 === "" || c85 === "-" ? null : Number(c85);

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        RO water and salt permeation
      </h2>

      {/* ===== Water Flux (M) ===== */}
      <Section title="Water flux convertor (M)">
        <RowInput
          label="M"
          unit="gfd"
          value={c73}
          onChange={(e) => allowNumber(e.target.value, setC73)}
          onBlur={() => formatOnBlur(c73, setC73)}
          autoFocus
        />
        <RowView
          label="M"
          value={n73 === null ? "-" : ((n73 * 3.785 * 10.76) / 24).toFixed(4)}
          unit="lmh"
        />
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <RowInput
          label="M"
          unit="lmh"
          value={c75}
          onChange={(e) => allowNumber(e.target.value, setC75)}
          onBlur={() => formatOnBlur(c75, setC75)}
        />
        <RowView
          label="M"
          value={n75 === null ? "-" : ((n75 * 24) / (3.785 * 10.76)).toFixed(4)}
          unit="gfd"
        />
      </Section>

      {/* ===== Water Permeability (W) ===== */}
      <Section title="Water Permeability (W)">
        <RowInput
          label="W"
          unit="l/m².h.bar"
          value={c78}
          onChange={(e) => allowNumber(e.target.value, setC78)}
          onBlur={() => formatOnBlur(c78, setC78)}
        />
        <RowView
          label="W"
          value={n78 === null ? "-" : (n78 / (3600 * 1000)).toFixed(6)}
          unit="m/s.bar"
        />
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <RowInput
          label="W"
          unit="m/s.bar"
          value={c80}
          onChange={(e) => allowNumber(e.target.value, setC80)}
          onBlur={() => formatOnBlur(c80, setC80)}
        />
        <RowView
          label="W"
          value={n80 === null ? "-" : (n80 * (3600 * 1000)).toFixed(4)}
          unit="l/m².h.bar"
        />
      </Section>

      {/* ===== Salt Permeability (X) ===== */}
      <Section title="Salt Permeability (X)">
        <RowInput
          label="X"
          unit="g/m².h.(g/l)"
          value={c83}
          onChange={(e) => allowNumber(e.target.value, setC83)}
          onBlur={() => formatOnBlur(c83, setC83)}
        />
        <RowView
          label="X"
          value={n83 === null ? "-" : (n83 / (3600 * 1000)).toFixed(6)}
          unit="m/s"
        />
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <RowInput
          label="X"
          unit="m/s"
          value={c85}
          onChange={(e) => allowNumber(e.target.value, setC85)}
          onBlur={() => formatOnBlur(c85, setC85)}
        />
        <RowView
          label="X"
          value={n85 === null ? "-" : (n85 * (3600 * 1000)).toFixed(4)}
          unit="g/m².h.(g/l)"
        />
      </Section>
    </div>
  );
}

/* ===== Helpers ===== */
function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function RowInput({ label, unit, value, onChange,onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-xl bg-green-50">
      <span className="font-semibold text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        autoFocus={autoFocus}
        className="w-full text-center border border-gray-300 rounded p-1"
      />
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_6[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-xl bg-gray-50">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-l font-bold text-center">{value}</span>
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_6[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
