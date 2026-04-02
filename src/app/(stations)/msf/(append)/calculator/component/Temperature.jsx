// Pressure convertor  P
"use client";
import Tooltip from "@/components/Tooltip";
import { Gauge } from "lucide-react";
import { useState } from "react";

const infoMap_4 = {
    "ΔT": "Brine temperature drop per stage",
    "Tv": "Saturated vapor temperature",
    "α": "Non-equilibrium allowance",
    "°C": "Celsius",
    "g/l": "Grams per liter",
    "S":"Water salinity",
    "β":"Boiling point elevation",
    "#":"Dimensionless",
    "0":"Temperature depression in demister and tube bundle"
};

export default function Temperature() {
// Table 1
const [t1_a, setT1_a] = useState(""); // ΔT
const [t1_b, setT1_b] = useState(""); // Tv

// Table 2
const [t2_a, setT2_a] = useState(""); // Tv
const [t2_b, setT2_b] = useState(""); // S

// Table 3
const [t3_a, setT3_a] = useState(""); // Tv

// Table 4
const [t4_a, setT4_a] = useState(""); // Tv

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };


  // Table 1
const t1_a_num = t1_a === "" || t1_a === "-" ? null : Number(t1_a);
const t1_b_num = t1_b === "" || t1_b === "-" ? null : Number(t1_b);

// Table 2
const t2_a_num = t2_a === "" || t2_a === "-" ? null : Number(t2_a);
const t2_b_num = t2_b === "" || t2_b === "-" ? null : Number(t2_b);

// Table 3
const t3_a_num = t3_a === "" || t3_a === "-" ? null : Number(t3_a);

// Table 4
const t4_a_num = t4_a === "" || t4_a === "-" ? null : Number(t4_a);




return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray700">
      {/* Heat Converter */}
    </h2>
{/* ===== Grid Cards ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* ===== Table 1 ===== */}
  <Section title="Non-Equilibrium Temperature Diff.">
    <RowInput
      label="ΔT"
      unit="°C"
      value={t1_a}
      onChange={(e) => allowNumber(e.target.value, setT1_a)}
      onBlur={() => formatOnBlur(t1_a, setT1_a)}
    />
    <RowInput
      label="Tv"
      unit="°C"
      value={t1_b}
      onChange={(e) => allowNumber(e.target.value, setT1_b)}
      onBlur={() => formatOnBlur(t1_b, setT1_b)}
    />
    <RowView
      label="α"
      value={t1_a_num === null ? "-" :(t1_a_num * Math.pow(0.98, t1_b_num)).toFixed(4)}
      unit="°C"
    />
  </Section>

  {/* ===== Table 2 ===== */}
  <Section title="Boiling Point Elevation">
    <RowInput
      label="Tv"
      unit="°C"
      value={t2_a}
      onChange={(e) => allowNumber(e.target.value, setT2_a)}
      onBlur={() => formatOnBlur(t2_a, setT2_a)}
    />
    <RowInput
      label="S"
      unit="g/l"
      value={t2_b}
      onChange={(e) => allowNumber(e.target.value, setT2_b)}
      onBlur={() => formatOnBlur(t2_b, setT2_b)}
    />
    <RowView
      label="β"
      value={t2_a_num === null ? "-" : ((0.0083 + 19e-6 * t2_a_num + 4e-7 * Math.pow(t2_a_num, 2)) * t2_b_num).toFixed(4)}
      unit="°C"
    />
  </Section>

  {/* ===== Table 3 ===== */}
  <Section title="Temperature Depression (Demister)">
    <RowInput
      label="Tv"
      unit="°C"
      value={t3_a}
      onChange={(e) => allowNumber(e.target.value, setT3_a)}
      onBlur={() => formatOnBlur(t3_a, setT3_a)}
    />
    <RowView
      label="0"
      value={t3_a_num === null ? "-" : (1.89 * Math.exp(-0.037 * t3_a_num)).toFixed(4)}
      unit="°C"
    />
  </Section>

  {/* ===== Table 4 ===== */}
  <Section title="Condensing Gain">
    <RowInput
      label="Tv"
      unit="°C"
      value={t4_a}
      onChange={(e) => allowNumber(e.target.value, setT4_a)}
      onBlur={() => formatOnBlur(t4_a, setT4_a)}
    />
    <RowView
      label="cg"
      value={t4_a_num === null ? "-" : (1 * Math.exp(-0.00015 * t4_a_num)).toFixed(4)}
      unit="#"
    />
  </Section>

</div>

  </div>
);

}


/* ===== Card Section ===== */

function Section({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-500 text-white px-4 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
         <Gauge className="w-4 h-4" />
        <span className="text-base">
          {title}
        </span>
      </div>

      {/* Body */}
      <div className="p-2">
        {children}
      </div>

    </div>
  );
}
function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">

        <Tooltip text={infoMap_4[label]}>
            <div className="font-semibold text-gray-600">{label}</div>
        </Tooltip>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        autoFocus={autoFocus}
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
        <Tooltip text={infoMap_4[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}
function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

        <Tooltip text={infoMap_4[label]}>
            <div className="font-semibold text-gray-600">{label}</div>
        </Tooltip>

       <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200 ">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={infoMap_4[unit]}>
         <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}