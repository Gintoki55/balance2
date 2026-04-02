"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";
import { Gauge } from "lucide-react";
import { FlaskConical } from "lucide-react";
const INFO = {
  "°C": "Celcius",
  "g/l": "gram per liter",
  "%": "precent",
  bar: "bar",

  Sf: "Feed water salinity [g/l]",
  Sd: "Product water salinity [g/l]",
  SR: "Precent salt rejection [%]",
  π: "Osmotic pressure [bar]",
  T: "Water temperature",
  S: "Salinity",
};

export default function SaltRejectionOsmotic() {

  /* ===== Section 1 ===== */
  const [section1_SR, setSection1_SR] = useState("");
  const [section1_Sf, setSection1_Sf] = useState("");

  /* ===== Section 2 ===== */
  const [section2_Sd, setSection2_Sd] = useState("");
  const [section2_SR, setSection2_SR] = useState("");

  /* ===== Section 3 ===== */
  const [section3_Sf, setSection3_Sf] = useState("");
  const [section3_Sd, setSection3_Sd] = useState("");

  /* ===== Osmotic Pressure ===== */
  const [temperature, setTemperature] = useState("");
  const [salinity, setSalinity] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatNumber = (num, digits = 6) => {
    if (num === "" || num === "-" || num === null) return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ===== Calculations (نفسها بالضبط) ===== */

  const SR_from_Sf_Sd =
    section3_Sf && section3_Sd
      ? formatNumber(
          (100 * (Number(section3_Sf) - Number(section3_Sd))) /
            (Number(section3_Sf) || 1),
          4
        )
      : "-";

  const PI =
    temperature && salinity
      ? formatNumber(
          0.00255 * (273 + Number(temperature)) * Number(salinity),
          4
        )
      : "-";

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Osmotic Pressure */}
        <Section title="Osmotic Pressure">
          <RowInput
            label="T"
            unit="°C"
            value={temperature}
            set={setTemperature}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowInput
            label="S"
            unit="g/l"
            value={salinity}
            set={setSalinity}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowView label="π" unit="bar" value={PI} />
        </Section>

                {/* Section 3 */}
        <Section title="Salt Rejection">
          <RowInput
            label="Sf"
            unit="g/l"
            value={section3_Sf}
            set={setSection3_Sf}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowInput
            label="Sd"
            unit="g/l"
            value={section3_Sd}
            set={setSection3_Sd}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowView
            label="SR"
            unit="%"
            value={SR_from_Sf_Sd}
          />
        </Section>

      </div>
    </div>
  );
}

/* ===== Card Section ===== */

function Section({ children, title }) {

    let Icon = null;

  if (title === "Osmotic Pressure") {
    Icon = Gauge;
  } else if (title === "Salt Rejection") {
    Icon = FlaskConical;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden font-[ui-monospace,SFMono-Regular,SF_Mono,Menlo,Monaco,Consolas]">

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-500 text-white px-4 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
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