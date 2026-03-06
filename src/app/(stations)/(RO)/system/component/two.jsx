// Volume convertor  V
"use client";

import Tooltip from "@/components/Tooltip";
import { Beaker } from "lucide-react";
import { useState } from "react";
const INFO = {
  "m³": "Meter cube",
  "IG (UK)": "Imperial gallon",
  "gl (US)": "Gallon",
  "ft³": "Cubic foot",
};

export default function Two() {
const [cubicMeter, setCubicMeter] = useState("");
const [imperialGallon, setImperialGallon] = useState("");
const [usGallon, setUsGallon] = useState("");
const [cubicFoot, setCubicFoot] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };



const cubicMeterNumber =
  cubicMeter === "" || cubicMeter === "-" ? null : Number(cubicMeter);

const imperialGallonNumber =
  imperialGallon === "" || imperialGallon === "-" ? null : Number(imperialGallon);

const usGallonNumber =
  usGallon === "" || usGallon === "-" ? null : Number(usGallon);

const cubicFootNumber =
  cubicFoot === "" || cubicFoot === "-" ? null : Number(cubicFoot);

return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray-700">Volume Converter V</h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* m³ input */}
        <Section title="Volume Converter [M³]">
          <RowInput
            label="V"
            unit="m³"
            value={cubicMeter}
            onChange={(e) => allowNumber(e.target.value, setCubicMeter)}
            onBlur={() => formatOnBlur(cubicMeter, setCubicMeter)}
            autoFocus
          />
          <RowView label="V" value={cubicMeterNumber === null ? "-" : (cubicMeterNumber * 35.3147).toFixed(4)} unit="ft³" />
          <RowView label="V" value={cubicMeterNumber === null ? "-" : (cubicMeterNumber * 220).toFixed(4)} unit="IG (UK)" />
          <RowView label="V" value={cubicMeterNumber === null ? "-" : (cubicMeterNumber * 264.2).toFixed(4)} unit="gl (US)" />
        </Section>

        {/* ft³ input */}
        <Section title="Volume Converter [ft³]">
          <RowInput
            label="V"
            unit="ft³"
            value={cubicFoot}
            onChange={(e) => allowNumber(e.target.value, setCubicFoot)}
            onBlur={() => formatOnBlur(cubicFoot, setCubicFoot)}
          />
          <RowView label="V" value={cubicFootNumber === null ? "-" : (cubicFootNumber * 220 / 35.3147).toFixed(4)} unit="IG (UK)" />
          <RowView label="V" value={cubicFootNumber === null ? "-" : (cubicFootNumber * 264.2 / 35.3147).toFixed(4)} unit="gl (US)" />
          <RowView label="V" value={cubicFootNumber === null ? "-" : (cubicFootNumber / 35.3147).toFixed(4)} unit="m³" />
        </Section>

        {/* IG (UK) input */}
        <Section title="Volume Converter [IG]">
          <RowInput
            label="V"
            unit="IG (UK)"
            value={imperialGallon}
            onChange={(e) => allowNumber(e.target.value, setImperialGallon)}
            onBlur={() => formatOnBlur(imperialGallon, setImperialGallon)}
          />
          <RowView label="V" value={imperialGallonNumber === null ? "-" : (imperialGallonNumber * 264.2 / 220).toFixed(4)} unit="gl (US)" />
          <RowView label="V" value={imperialGallonNumber === null ? "-" : (imperialGallonNumber / 220).toFixed(4)} unit="m³" />
          <RowView label="V" value={imperialGallonNumber === null ? "-" : (imperialGallonNumber * 35.3147 / 220).toFixed(4)} unit="ft³" />
        </Section>

        {/* gl (US) input */}
        <Section title="Volume Converter [gl]">
          <RowInput
            label="V"
            unit="gl (US)"
            value={usGallon}
            onChange={(e) => allowNumber(e.target.value, setUsGallon)}
            onBlur={() => formatOnBlur(usGallon, setUsGallon)}
          />
          <RowView label="V" value={usGallonNumber === null ? "-" : (usGallonNumber  / 264.2).toFixed(4)} unit="m³" />
          <RowView label="V" value={usGallonNumber === null ? "-" : (usGallonNumber * 35.3147 / 264.2).toFixed(4)} unit="ft³" />
          <RowView label="V" value={usGallonNumber === null ? "-" : (usGallonNumber * 220 / 264.2).toFixed(4)} unit="IG (UK)" />
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
         <Beaker className="w-4 h-4" />
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

      <div className="font-semibold text-gray-600">{label}</div>

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

      <div className="font-semibold text-gray-600">{label}</div>

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