
"use client";
import Tooltip from "@/components/Tooltip";
import { Gauge } from "lucide-react";
import { useState } from "react";

const INFO = {
    "k":"Thermal conductivity",
    "h":"Heat transfer coefficient",
    "FF":"Fouling resistance",
    "Td":"Distillate temperature",
    "Tb":"Brine temperature",
    "Uc":"Condenser heat transfer coefficient",
    "Ue":"Evaporator heat transfer coefficient"
};

export default function Thermal() {

// Thermal Conductivity
const [k_w, setK_w] = useState("");     // W/m.°C
const [k_mj, setK_mj] = useState("");   // MJ/m.h.°C

// Heat Transfer Coefficient
const [h_w, setH_w] = useState("");     // W/m².°C
const [h_mj, setH_mj] = useState("");   // MJ/m².h.°C

// Fouling Factor
const [ff_w, setFf_w] = useState("");   // m².°C/W
const [ff_mj, setFf_mj] = useState(""); // m².h.°C/MJ

// Temperatures
const [td, setTd] = useState(""); // Distillate temperature
const [tb, setTb] = useState(""); // Brine temperature


return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray700">
      {/* Heat Converter */}
    </h2>
{/* ===== Grid Cards ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* ===== Table 1 ===== */}
  <Section title="Thermal Conductivity [W/m.°C]">
    <RowInput
      label="k"
      unit="W/m.°C"
      value={t1}
      onChange={(e) => allowNumber(e.target.value, setT1)}
      onBlur={() => formatOnBlur(t1, setT1)}
    />
    <RowView
      label="k"
      value={t1_num === null ? "-" :((3600 * t1_num) / 1e6).toFixed(4)}
      unit="MJ/m.h.°C"
    />
  </Section>

  {/* ===== Table 2 ===== */}
  <Section title="Thermal Conductivity [MJ/m.h.°C]">
    <RowInput
      label="k"
      unit="MJ/m.h.°C"
      value={t2}
      onChange={(e) => allowNumber(e.target.value, setT2)}
      onBlur={() => formatOnBlur(t2, setT2)}
    />
    <RowView
      label="k"
      value={t2_num === null ? "-" : ((1e6 * t2_num) / 3600).toFixed(4)}
      unit="W/m.°C"
    />
  </Section>

  {/* ===== Table 3 ===== */}
  <Section title="Convective Heat Transfer Coeff. [W/m².°C]">
    <RowInput
      label="h"
      unit="W/m².°C"
      value={t3}
      onChange={(e) => allowNumber(e.target.value, setT3)}
      onBlur={() => formatOnBlur(t3, setT3)}
    />
    <RowView
      label="h"
      value={t3_num === null ? "-" : ((3600 * t3_num) / 1e6).toFixed(4)}
      unit="MJ/m².h.°C"
    />
  </Section>

  {/* ===== Table 4 ===== */}
  <Section title="Convective Heat Transfer Coeff. [MJ/m².h.°C]">
    <RowInput
      label="h"
      unit="MJ/m².h.°C"
      value={t4}
      onChange={(e) => allowNumber(e.target.value, setT4)}
      onBlur={() => formatOnBlur(t4, setT4)}
    />
    <RowView
      label="h"
      value={t4_num === null ? "-" : ((1e6 * t4_num) / 3600).toFixed(4)}
      unit="W/m².°C"
    />
  </Section>


   {/* ===== Table 5 ===== */}
  <Section title="Fouling Resistance [m².°C/W]">
    <RowInput
      label="FF"
      unit="m².°C/W"
      value={t5}
      onChange={(e) => allowNumber(e.target.value, setT5)}
      onBlur={() => formatOnBlur(t5, setT5)}
    />
    <RowView
      label="FF"
      value={t5_num === null ? "-" : ((1e6 * t5_num) / 3600).toFixed(4)}
      unit="m².h.°C/MJ"
    />
  </Section>

  {/* ===== Table 6 ===== */}
  <Section title="Fouling Resistance [m².h.°C/MJ]">
    <RowInput
      label="FF"
      unit="m².h.°C/MJ"
      value={t6}
      onChange={(e) => allowNumber(e.target.value, setT6)}
      onBlur={() => formatOnBlur(t6, setT6)}
    />
    <RowView
      label="FF"
      value={t6_num === null ? "-" : ((3600 * t6_num) / 1e6).toFixed(4)}
      unit="m².°C/W"
    />
  </Section>


   {/* ===== Table 7 ===== */}
  <Section title="Condenser Correlation">
    <RowInput
      label="Td"
      unit="°C"
      value={t7}
      onChange={(e) => allowNumber(e.target.value, setT7)}
      onBlur={() => formatOnBlur(t7, setT7)}
    />
    <RowView
      label="Uc"
      value={t7_num === null ? "-" : (5.76 + 0.00576 * t7_num + 576e-6 * Math.pow(t7_num, 2)).toFixed(4)}
      unit="MJ/m².h.°C"
    />
  </Section>

  {/* ===== Table 8 ===== */}
  <Section title="Evaporator Correlation">
    <RowInput
      label="Tb"
      unit="C"
      value={t8}
      onChange={(e) => allowNumber(e.target.value, setT8)}
      onBlur={() => formatOnBlur(t8, setT8)}
    />
    <RowView
      label="Ue"
      value={t8_num === null ? "-" : (7.02 + 0.054 * t8_num - 828e-6 * Math.pow(t8_num, 2) + 864e-8 * Math.pow(t8_num, 3)).toFixed(4)}
      unit="MJ/m².h.°C"
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

        <Tooltip text={INFO[label]}>
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
        <Tooltip text={INFO[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}
function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

        <Tooltip text={INFO[label]}>
            <div className="font-semibold text-gray-600">{label}</div>
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