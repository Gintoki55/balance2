"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap = {
  A: "Element active area [m²]",
  Pf: "Feed water pressure [bar]",
  Pb: "Brine pressure [bar]",
  Md: "Fresh water production [t/h]",
  WR: "Present water recovery [%]",
  Sf: "Feed water salinity [g/l]",
  Tf: "Feed water temperature [°C]",
  SR: "Present salt rejection [%]",
  Mf: "Feed water flow [t/h]",
  Sd: "Product water salinity [g/l]",
  Sb: "Brine water salinity [g/l]",
  ΔS: "Salinity difference [g/l]",
  Δπ: "Osmotic pressure difference [bar]",
  "∆P": "Net driving pressure [bar]",
  TCF: "Temperature correction factor",
  w: "Water permeability",
  x: "Salt permeability",
  PCF: "Pressure drop correction factor",
  "M²": "square meter",
  bar: "bar",
  "t/h": "metric ton/hour",
  "%": "percent",
  "°C": "celsius",
  "g/l": "gram per liter",
  "#": "non dimensional",
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "g/m².h.(g/l)": "Gram per square meter per hour per salinity gradient",
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
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold">
        when pressure drop is given
      </h2>

      <div className="space-y-4">

        {/* Inputs */}
        <div className="space-y-2">
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
          <RowView label="Mf" value={fmt(Mf, 3)} unit="t/h" />
          <RowView label="Sd" value={fmt(Sd, 3)} unit="g/l" />
          <RowView label="Sb" value={fmt(Sb, 3)} unit="g/l" />
          <RowView label="ΔS" value={fmt(dS, 3)} unit="g/l" />
          <RowView label="Δπ" value={fmt(dPi, 3)} unit="bar" />
          <RowView label="∆P" value={fmt(dP, 3)} unit="bar" />
          <RowView label="TCF" value={fmt(TCF, 2)} unit="#" />
          <RowView label="w" value={fmt(w, 4)} unit="l/m².h.bar" />
          <RowView label="x" value={fmt(x, 4)} unit="g/m².h.(g/l)" />
          <RowView label="PCF" value={fmt(PCF, 4)} unit="#" />
        </div>

      </div>
    </div>
  );
}

/* ===== UI ===== */

function RowInput({ label, unit, value, set, allow }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-green-50 rounded-l">
      <Tooltip text={infoMap[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>
      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onClick={(e) => e.target.select()}
        className="w-full text-center border border-gray-300 rounded p-1"
      />
      <Tooltip text={infoMap[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">{unit}</span>
      </Tooltip>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-50 rounded-l">
      <Tooltip text={infoMap[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>
      <span className="text-center font-bold">{value}</span>
      <Tooltip text={infoMap[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">{unit}</span>
      </Tooltip>
    </div>
  );
}