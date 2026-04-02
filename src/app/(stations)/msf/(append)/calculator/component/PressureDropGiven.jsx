"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const INFO = {
  A: "Membrane element active area",
  Pf: "Feed water pressure",
  Pb: "Brine water pressure",
  Md: "Product water flow",
  WR: "Percent water recovery",
  Sf: "Feed water salinity",
  Tf: "Feed water temperature",
  SR: "Salt rejection",
  Mf: "Feed flow per element",
  Sd: "Product water salinity",
  Sb: "Brine water salinity",
  ΔS: "Mean membrane wall salinity",
  Δπ: "Mean osmotic pressure",
  "∆P": "Net driving pressure",
  TCF: "Temperature correction factor",
  w: "Water permeability coefficient",
  x: "Salt permeability coefficient",
  PCF: "Pressure correction factor",
  "M²": "square meter",
  bar: "bar",
  "t/h": "metric ton per hour",
  "%": "percent",
  "°C": "celsius",
  "g/l": "gram per liter",
  "#": "dimensionless",
  "l/m².h.bar": "liter per square meter per hour per bar",
  "g/m².h.(g/l)": "gram per square meter per hour per (gram per liter)",
};

export default function PressureDropGiven() {

  const [A, setA] = useState("");
  const [Pf, setPf] = useState("");
  const [Pb, setPb] = useState("");
  const [Md, setMd] = useState("");
  const [WR, setWR] = useState("");
  const [Sf, setSf] = useState("");
  const [Tf, setTf] = useState("");
  const [SR, setSR] = useState("");

  const num = (v) => (v === "" || v === "-" ? NaN : Number(v));
  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);
  const fmt = (v, d = 4) =>
    isNaN(v) || !isFinite(v) ? "-" : Number(v).toFixed(d);

  /* ===== Calculations ===== */

  const Mf = (100 * num(Md)) / num(WR);
  const Sd = num(Sf) * (1 - num(SR) / 100);
  const Sb = (Mf * num(Sf) - num(Md) * Sd) / (Mf - num(Md));

  const dS =
    (0.5 * (num(Sf) + Sb) - Sd) *
    Math.exp(0.7 * (num(Md) / Mf));

  const dPi = 0.00255 * 298 * dS;
  const dP = 0.5 * (num(Pf) + num(Pb)) - dPi;

  const TCF =
    0.33 + 0.0247 * num(Tf) + 0.00000336 * Math.pow(num(Tf), 3);

  const w = (num(Md) * 1000) / (num(A) * dP * TCF);
  const x = (num(Md) * Sd * 1000) / (num(A) * dS * TCF);

  const PCF =
    (num(Pf) - num(Pb)) /
    (0.0085 * Math.pow(Mf - 0.5 * num(Md), 1.7));

  return (
    <div className="max-w-4xl w-full mx-auto space-y-3">
      <div className="">

        {/* Inputs */}
        <div className="space-y-1">
          <RowInput label="A" unit="M²" value={A} set={setA} allow={allow} />
          <RowInput label="Pf" unit="bar" value={Pf} set={setPf} allow={allow} />
          <RowInput label="Pb" unit="bar" value={Pb} set={setPb} allow={allow} />
          <RowInput label="Md" unit="t/h" value={Md} set={setMd} allow={allow} />
          <RowInput label="WR" unit="%" value={WR} set={setWR} allow={allow} />
          <RowInput label="Sf" unit="g/l" value={Sf} set={setSf} allow={allow} />
          <RowInput label="Tf" unit="°C" value={Tf} set={setTf} allow={allow} />
          <RowInput label="SR" unit="%" value={SR} set={setSR} allow={allow} />
        </div>

        {/* Results */}
        <div className="space-y-1">
          <RowView label="Mf" value={fmt(Mf, 4)} unit="t/h" />
          <RowView label="Sd" value={fmt(Sd, 4)} unit="g/l" />
          <RowView label="Sb" value={fmt(Sb, 4)} unit="g/l" />
          <RowView label="ΔS" value={fmt(dS, 4)} unit="g/l" />
          <RowView label="Δπ" value={fmt(dPi, 4)} unit="bar" />
          <RowView label="∆P" value={fmt(dP, 4)} unit="bar" />
          <RowView label="TCF" value={fmt(TCF, 4)} unit="#" />
          <RowView label="w" value={fmt(w, 4)} unit="l/m².h.bar" />
          <RowView label="x" value={fmt(x, 4)} unit="g/m².h.(g/l)" />
          <RowView label="PCF" value={fmt(PCF, 4)} unit="#" />
        </div>

      </div>
    </div>
  );
}

function RowInput({label, unit, value, set, allow}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

      <Tooltip text={INFO[label]}>
        <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
      </Tooltip>

      <input
        type="text"
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        className="w-full font-mono text-center bg-gray-50 rounded-lg py-2
                   outline-none border border-gray-200
                   transition-all duration-300 ease-in-out
                   focus:ring-2 focus:ring-teal-400
                   focus:ring-offset-1 focus:ring-offset-gray-100
                   focus:shadow-[0_0_12px_rgba(52,211,153,0.7)]
                   placeholder-gray-400"
        placeholder="Enter value"
      />

      <div className="text-right" dir="ltr">
        <Tooltip text={INFO[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}

function RowView({label, unit, value }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">
       <Tooltip text={INFO[label]}>
        <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
      </Tooltip>

       <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200 ">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={INFO[unit]}>
         <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}