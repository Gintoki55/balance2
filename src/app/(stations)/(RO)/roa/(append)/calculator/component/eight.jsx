// RO element parameters (pressure drop is given)
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_8 = {
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

export default function Eight() {
  const [G33, setG33] = useState(""); // A
  const [G34, setG34] = useState(""); // Pf
  const [G35, setG35] = useState(""); // Pb
  const [G36, setG36] = useState(""); // Md
  const [G37, setG37] = useState(""); // WR
  const [G38, setG38] = useState(""); // Sf
  const [G39, setG39] = useState(""); // Tf
  const [G40, setG40] = useState(""); // SR

  const num = (v) => (v === "" || v === "-" ? NaN : Number(v));

  const allow = (v, s) => {
    if (/^-?\d*\.?\d*$/.test(v)) s(v);
  };

  // 🔹 الآن تقدر تتحكم بعدد المنازل
  const fmt = (v, digits = 4) =>
    isNaN(v) || !isFinite(v) ? "-" : Number(v).toFixed(digits);

  /* ===== Calculations ===== */

  const Mf = (100 * num(G36)) / num(G37);
  const Sd = num(G38) * (1 - num(G40) / 100);
  const Sb = (Mf * num(G38) - num(G36) * Sd) / (Mf - num(G36));
  const dS = (0.5 * (num(G38) + Sb) - Sd) * Math.exp(0.7 * (num(G36) / Mf));
  const dPi = 0.00255 * 298 * dS;
  const dP = 0.5 * (num(G34) + num(G35)) - dPi;
  const TCF = 0.33 + 0.0247 * num(G39) + 0.00000336 * Math.pow(num(G39), 3);
  const w = (num(G36) * 1000) / (num(G33) * dP * TCF);
  const x = (num(G36) * Sd * 1000) / (num(G33) * dS * TCF);
  const PCF =
    (num(G34) - num(G35)) / (0.0085 * Math.pow(Mf - 0.5 * num(G36), 1.7));

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold">
        RO element parameters (pressure drop is given)
      </h2>

      {/* ===== Inputs ===== */}
      <div className="space-y-2">
        <Input
          label="A"
          unit="M²"
          value={G33}
          set={setG33}
          allow={allow}
          autoFocus
        />
        <Input label="Pf" unit="bar" value={G34} set={setG34} allow={allow} />
        <Input label="Pb" unit="bar" value={G35} set={setG35} allow={allow} />
        <Input label="Md" unit="t/h" value={G36} set={setG36} allow={allow} />
        <Input label="WR" unit="%" value={G37} set={setG37} allow={allow} />
        <Input label="Sf" unit="g/l" value={G38} set={setG38} allow={allow} />
        <Input label="Tf" unit="°C" value={G39} set={setG39} allow={allow} />
        <Input label="SR" unit="%" value={G40} set={setG40} allow={allow} />
      </div>

      {/* ===== Results ===== */}
      <div className="space-y-2 pt-4 border-t">
        {/* غير الرقم الثاني هنا إذا تريد 2 منازل */}
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
          <Tooltip text={infoMap_8[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onClick={(e) => e.target.select()}
        autoFocus={autoFocus}
        className="border rounded p-1 text-center"
        inputMode="decimal"
      />
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_8[unit]}>
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
          <Tooltip text={infoMap_8[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <span className="text-center font-bold">{value}</span>
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_8[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
