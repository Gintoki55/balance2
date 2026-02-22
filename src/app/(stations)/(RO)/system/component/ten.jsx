"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

/* ================= INFO MAP (موحد) ================= */
const infoMap = {
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

  "M²": "square meter",
  bar: "bar",
  "t/h": "Mass flow [metric ton/hour]",
  "%": "Precent",
  "°C": "Celcius",
  "g/l": "gram per liter",
  "#": "non dimensional number",
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "g/m².h.(g/l)": "Gram per square meter per hour per salinty gradient",
};

export default function ROElementParameters() {
  /* ================= TABLE 1 STATE ================= */
  const [G33, setG33] = useState("");
  const [G34, setG34] = useState("");
  const [G35, setG35] = useState("");
  const [G36, setG36] = useState("");
  const [G37, setG37] = useState("");
  const [G38, setG38] = useState("");
  const [G39, setG39] = useState("");
  const [G40, setG40] = useState("");

  /* ================= TABLE 2 STATE ================= */
  const [G53, setG53] = useState("");
  const [G54, setG54] = useState("");
  const [G56, setG56] = useState("");
  const [G57, setG57] = useState("");
  const [G58, setG58] = useState("");
  const [G59, setG59] = useState("");
  const [G60, setG60] = useState("");

  const num = (v) => (v === "" || v === "-" ? NaN : Number(v));
  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);
  const fmt = (v, d = 4) =>
    isNaN(v) || !isFinite(v) ? "-" : Number(v).toFixed(d);

  /* ================= TABLE 1 CALC ================= */
  const Mf1 = 100* G36 / G37;
  const Sd1 = num(G38) * (1 - num(G40) / 100);
  const Sb1 = (Mf1 * num(G38) - num(G36) * Sd1) / (Mf1 - num(G36));
  const dS1 =
    (0.5 * (num(G38) + Sb1) - Sd1) *
    Math.exp(0.7 * (num(G36) / Mf1));
  const dPi1 = 0.00255 * 298 * dS1;
  const dP1 = 0.5 * (num(G34) + num(G35)) - dPi1;
  const TCF1 =
    0.33 + 0.0247 * num(G39) + 0.00000336 * Math.pow(num(G39), 3);
  const w1 = (num(G36) * 1000) / (num(G33) * dP1 * TCF1);
  const x1 = (num(G36) * Sd1 * 1000) / (num(G33) * dS1 * TCF1);
  const PCF1 =
    (num(G34) - num(G35)) /
    (0.0085 * Math.pow(Mf1 - 0.5 * num(G36), 1.7));

  /* ================= TABLE 2 CALC ================= */

  const Mf2 = 100 * G36 / G37;
  const Sd2 = num(G58) * (1 - num(G60) / 100);
  const Sb2 = (Mf2 * num(G58) - num(G56) * Sd2) / (Mf2 - num(G56));
  const dS2 =
    (0.5 * (num(G58) + Sb2) - Sd2) *
    Math.exp(0.7 * (num(G56) / Mf2));
  const dPi2 = 0.00255 * 298 * dS2;
  const Pb2 =
    num(G54) -
    0.0085 * Math.pow(Mf2 - 0.5 * num(G56), 1.7);
  const dP2 = 0.5 * (num(G54) + Pb2) - dPi2 ;
  const TCF2 =
    0.33 + 0.0247 * num(G59) + 0.00000336 * Math.pow(num(G59), 3);
  const w2 = (num(G56) * 1000) / (num(G53) * dP2 * TCF2);
  const x2 = (num(G56) * Sd2 * 1000) / (num(G53) * dS2 * TCF2);
  const PCF2 =
    (num(G54) - Pb2) /
    (0.0085 * Math.pow(Mf2 - 0.5 * num(G56), 1.7));

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold">
        RO element paramteres
      </h2> 

      <div className="grid md:grid-cols-2  bg-white border border-gray-300 rounded-l shadow-lg gap-4">
        {/* ================= TABLE 1 ================= */}
        <div className="space-y-3 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4">
          <h3 className="text-lg font-bold mb-4">
            when pressure drop is given
          </h3>

          <div className="space-y-2">
            <Input label="A" unit="M²" value={G33} set={setG33} allow={allow} />
            <Input label="Pf" unit="bar" value={G34} set={setG34} allow={allow} />
            <Input label="Pb" unit="bar" value={G35} set={setG35} allow={allow} />
            <Input label="Md" unit="t/h" value={G36} set={setG36} allow={allow} />
            <Input label="WR" unit="%" value={G37} set={setG37} allow={allow} />
            <Input label="Sf" unit="g/l" value={G38} set={setG38} allow={allow} />
            <Input label="Tf" unit="°C" value={G39} set={setG39} allow={allow} />
            <Input label="SR" unit="%" value={G40} set={setG40} allow={allow} />
          </div>

          <div className="space-y-1">
            <Result label="Mf" value={fmt(Mf1, 3)} unit="t/h" />
            <Result label="Sd" value={fmt(Sd1, 3)} unit="g/l" />
            <Result label="Sb" value={fmt(Sb1, 3)} unit="g/l" />
            <Result label="ΔS" value={fmt(dS1, 3)} unit="g/l" />
            <Result label="Δπ" value={fmt(dPi1, 3)} unit="bar" />
            <Result label="∆P" value={fmt(dP1, 3)} unit="bar" />
            <Result label="TCF" value={fmt(TCF1, 2)} unit="#" />
            <Result label="w" value={fmt(w1, 4)} unit="l/m².h.bar" />
            <Result label="x" value={fmt(x1, 4)} unit="g/m².h.(g/l)" />
            <Result label="PCF" value={fmt(PCF1, 4)} unit="#" />
          </div>
        </div>

        {/* ================= TABLE 2 ================= */}
        <div className="space-y-3 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4">
          <h3 className="text-lg font-bold mb-4">
            when pressure is coorelated
          </h3>

          <div className="space-y-2">
            <Input label="A" unit="M²" value={G53} set={setG53} allow={allow} />
            <Input label="Pf" unit="bar" value={G54} set={setG54} allow={allow} />
            <Result label="Pb" value={fmt(Pb2, 3)} unit="bar" />
            <Input label="Md" unit="t/h" value={G56} set={setG56} allow={allow} />
            <Input label="WR" unit="%" value={G57} set={setG57} allow={allow} />
            <Input label="Sf" unit="g/l" value={G58} set={setG58} allow={allow} />
            <Input label="Tf" unit="°C" value={G59} set={setG59} allow={allow} />
            <Input label="SR" unit="%" value={G60} set={setG60} allow={allow} />
          </div>

          <div className="space-y-1">
            <Result label="Mf" value={fmt(Mf2, 3)} unit="t/h" />
            <Result label="Sd" value={fmt(Sd2, 3)} unit="g/l" />
            <Result label="Sb" value={fmt(Sb2, 3)} unit="g/l" />
            <Result label="ΔS" value={fmt(dS2, 3)} unit="g/l" />
            <Result label="Δπ" value={fmt(dPi2, 3)} unit="bar" />
            <Result label="∆P" value={fmt(dP2, 3)} unit="bar" />
            <Result label="TCF" value={fmt(TCF2, 2)} unit="#" />
            <Result label="w" value={fmt(w2, 4)} unit="l/m².h.bar" />
            <Result label="x" value={fmt(x2, 4)} unit="g/m².h.(g/l)" />
            <Result label="PCF" value={fmt(PCF2, 4)} unit="#" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Input({ label, unit, value, set, allow }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-gray-50 rounded-l">
      <div className="flex justify-start" dir="ltr">
        <Tooltip text={infoMap[label]}>
          <span className="cursor-help text-gray-600">{label}</span>
        </Tooltip>
      </div>
      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onClick={(e) => e.target.select()}
        className="w-full max-w-[180px] text-center border border-gray-300 rounded p-1"
      />
      <div className="flex justify-end" dir="ltr">
        <Tooltip text={infoMap[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}

function Result({ label, value, unit }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-green-50 rounded-l">
      <div className="flex justify-start" dir="ltr">
        <Tooltip text={infoMap[label]}>
          <span className="cursor-help text-gray-600">{label}</span>
        </Tooltip>
      </div>
      <span className="text-center font-bold">{value}</span>
      <div className="flex justify-end" dir="ltr">
        <Tooltip text={infoMap[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}
