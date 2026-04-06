"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import { Droplets } from "lucide-react";
const INFO = {
  "g/l": "gram per liter",
  "%": "percent",

  "S0": "Feed salinity",
  "Sb": "Brine salinity",
  "Sd": "Product salinity",
  "WR": "Water recovery",
};
export default function WaterRecovery() {

  /* ===== Card 1 (Calculate Sb) ===== */
  const [waterRecoveryInput, setWaterRecoveryInput] = useState("");
  const [rawSalinityInput, setRawSalinityInput] = useState("");
  const [productSalinityInput, setProductSalinityInput] = useState("");

  /* ===== Card 2 (Calculate WR) ===== */
  const [rawSalinityCalc, setRawSalinityCalc] = useState("");
  const [brineSalinityCalc, setBrineSalinityCalc] = useState("");
  const [productSalinityCalc, setProductSalinityCalc] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatNumber = (num, digits = 4) => {
    if (num === "-" || num === "" || num === null || num === undefined)
      return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ===== Calculate WR from S0, Sb, Sd ===== */
  const WR =
    formatNumber(
            (100 * (Number(brineSalinityCalc) - Number(rawSalinityCalc))) /
              (Number(brineSalinityCalc) - Number(productSalinityCalc) || 1),
            4
          )

const Sb =
  formatNumber(
          (100 * Number(rawSalinityInput) -
            Number(waterRecoveryInput) * Number(productSalinityInput)) /
          (100 - Number(waterRecoveryInput))
        )

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== Card 1 ===== */}
        <Section title="Water Recovery">
          <RowInput
            label="S0"
            unit="g/l"
            value={rawSalinityCalc}
            set={setRawSalinityCalc}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="Sb"
            unit="g/l"
            value={brineSalinityCalc}
            set={setBrineSalinityCalc}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="Sd"
            unit="g/l"
            value={productSalinityCalc}
            set={setProductSalinityCalc}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowView label="WR" unit="%" value={WR} />
        </Section>

          {/* ===== Card 2 ===== */}

         <Section title="Brine Salinity">
          <RowInput
            label="WR"
            unit="%"
            value={waterRecoveryInput}
            set={setWaterRecoveryInput}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="S0"
            unit="g/l"
            value={rawSalinityInput}
            set={setRawSalinityInput}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="Sd"
            unit="g/l"
            value={productSalinityInput}
            set={setProductSalinityInput}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowView
            label="Sb"
            unit="g/l"
            value={Sb}
          />
        </Section>

      </div>
    </div>
  );
}

/* ===== Card Section ===== */

function Section({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden  font-[ui-monospace,SFMono-Regular,SF_Mono,Menlo,Monaco,Consolas]">

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-500 text-white px-4 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
         <Droplets className="w-4 h-4" />
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
function RowInput({ label, unit, value, set, allow, formatOnBlur }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">

      <Tooltip text={INFO[label]}>
      <div className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{label}</div>
      </Tooltip>

      <input
        type="text"
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
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

       <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200">
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