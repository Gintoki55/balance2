// RO element parameters (pressure drop is correlated)
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_9 = {
  // label
  A: "Element active area [m²]",
  Pf: "Feed water pressure [bar]",
  Pb: "Brine pressure [bar]",
  Md: "Fresh water production [t/h]",
  WR: "Present water recovery [%]",
  Sf: "Feet water saliity [g/l]",
  Tf: "Feet water temperature [°C]",
  SR: "Present salt rejection [%]",
  Mf: "Feed water flow [t/h]",
  Sd: "Product water salinity [g/l]",
  Sb: "Brine water salinity [g/l]",
  ΔS: "Salinity difference across the memberane [g/l]",
  Δπ: "Osmotic pressure difference across the membrance [bar]",
  "∆P": "Net driving pressure [bar]",
  TCF: "Temperature correction factor TCF",
  w: "Water permeability [l/m².h.bar]",
  x: "Salt permeability [g/m².h.(g/l)]",
  PCF: "Pressure drop correction factor PCF",

  // unit
  "M²": "square meter",
  bar: "bar",
  "t/h": "Mass flow [metric ton/hour],as same as for liquid water flow [m³/h]",
  "%": "Precent",
  "°C": "Celcius",
  "g/l": "gram per liter",
  "#": "non dimensional number",
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "g/m².h.(g/l)": "Gram per square meter per hour per salinty gradient",
};

export default function Nine() {
  const [G53, setG53] = useState(""); // A
  const [G54, setG54] = useState(""); // Pf
  const [G56, setG56] = useState(""); // Md
  const [G57, setG57] = useState(""); // WR
  const [G58, setG58] = useState(""); // Sf
  const [G59, setG59] = useState(""); // Tf
  const [G60, setG60] = useState(""); // SR

  const num = (v) => (v === "" || v === "-" ? NaN : Number(v));

  const allow = (v, s) => {
    if (/^-?\d*\.?\d*$/.test(v)) s(v);
  };

  // 🔹 تحكم بعدد المنازل
  const fmt = (v, digits = 4) =>
    isNaN(v) || !isFinite(v) ? "-" : Number(v).toFixed(digits);

  /* ===== Calculations ===== */

  const Mf = (100 * num(G56)) / num(G57);
  const Sd = num(G58) * (1 - num(G60) / 100);
  const Sb = (Mf * num(G58) - num(G56) * Sd) / (Mf - num(G56));
  const dS = (0.5 * (num(G58) + Sb) - Sd) * Math.exp(0.7 * (num(G56) / Mf));
  const dPi = 0.00255 * 298 * dS;
  const Pb = num(G54) - 0.0085 * Math.pow(Mf - 0.5 * num(G56), 1.7);
  const dP = 0.5 * (num(G54) + Pb) - dPi;
  const TCF = 0.33 + 0.0247 * num(G59) + 0.00000336 * Math.pow(num(G59), 3);
  const w = (num(G56) * 1000) / (num(G53) * dP * TCF);
  const x = (num(G56) * Sd * 1000) / (num(G53) * dS * TCF);
  const PCF = (num(G54) - Pb) / (0.0085 * Math.pow(Mf - 0.5 * num(G56), 1.7));

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold">
        RO element parameters (pressure drop is correlated)
      </h2>

      {/* ===== Inputs ===== */}
      <div className="space-y-2">
        <Input
          label="A"
          unit="M²"
          value={G53}
          set={setG53}
          allow={allow}
          autoFocus
        />
        <Input label="Pf" unit="bar" value={G54} set={setG54} allow={allow} />
         <Result label="Pb" value={fmt(Pb, 3)} unit="bar" />
        <Input label="Md" unit="t/h" value={G56} set={setG56} allow={allow} />
        <Input label="WR" unit="%" value={G57} set={setG57} allow={allow} />
        <Input label="Sf" unit="g/l" value={G58} set={setG58} allow={allow} />
        <Input label="Tf" unit="°C" value={G59} set={setG59} allow={allow} />
        <Input label="SR" unit="%" value={G60} set={setG60} allow={allow} />
      </div>

      {/* ===== Results ===== */}
      <div className="space-y-2 pt-4 border-t">
        {/* <Result label="Pb" value={fmt(Pb, 3)} unit="bar" /> */}

        <Result label="Mf" value={fmt(Mf, 3)} unit="t/h" />

        <Result label="Sd" value={fmt(Sd, 3)} unit="g/l" />

        <Result label="Sb" value={fmt(Sb, 3)} unit="g/l" />

        <Result label="ΔS" value={fmt(dS, 3)} unit="g/l" />

        <Result label="Δπ" value={fmt(dPi, 3)} unit="bar" />

        <Result label="∆P" value={fmt(dP, 3)} unit="bar" />

        <Result label="TCF" value={fmt(TCF, 2)} unit="#" />

        <Result label="w" value={fmt(w, 4)} unit="l/m².h.bar" />

        <Result label="x" value={fmt(x, 4)} unit="g/m².h.(g/l)" />

        <Result label="PCF" value={fmt(PCF, 4)} unit="#" />
      </div>
    </div>
  );
}

/* ===== Components ===== */

function Input({ label, unit, value, set, allow, autoFocus }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-gray-50 rounded-lg">
      <div className="flex justify-start" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_9[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onClick={(e) => e.target.select()}
        className="border rounded p-1 text-center"
        inputMode="decimal"
        autoFocus={autoFocus}
      />
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_9[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function Result({ label, value, unit }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-green-50 rounded-lg">
      <div className="flex justify-start" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_9[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <span className="text-center font-bold">{value}</span>
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_9[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
