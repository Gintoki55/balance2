// Volume convertor  V
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_2 = {
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
  <div className="max-w-7xl w-full space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Volume Converter V</h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* m³ input */}
        <Section>
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
        <Section>
          <RowInput
            label="V"
            unit="ft³"
            value={cubicFoot}
            onChange={(e) => allowNumber(e.target.value, setCubicFoot)}
            onBlur={() => formatOnBlur(cubicFoot, setCubicFoot)}
          />
          <RowView label="V" value={cubicFootNumber === null ? "-" : (cubicFootNumber *6.2288).toFixed(4)} unit="IG (UK)" />
          <RowView label="V" value={cubicFootNumber === null ? "-" : (cubicFootNumber * 7.4805).toFixed(4)} unit="gl (US)" />
          <RowView label="V" value={cubicFootNumber === null ? "-" : (cubicFootNumber * 0.0283).toFixed(4)} unit="m³" />
        </Section>

        {/* IG (UK) input */}
        <Section>
          <RowInput
            label="V"
            unit="IG (UK)"
            value={imperialGallon}
            onChange={(e) => allowNumber(e.target.value, setImperialGallon)}
            onBlur={() => formatOnBlur(imperialGallon, setImperialGallon)}
          />
          <RowView label="V" value={imperialGallonNumber === null ? "-" : (imperialGallonNumber * 264.2 / 220).toFixed(4)} unit="gl (US)" />
          <RowView label="V" value={imperialGallonNumber === null ? "-" : (imperialGallonNumber / 220).toFixed(4)} unit="m³" />
          <RowView label="V" value={imperialGallonNumber === null ? "-" : (imperialGallonNumber * 0.1605).toFixed(4)} unit="ft³" />
        </Section>

        {/* gl (US) input */}
        <Section >
          <RowInput
            label="V"
            unit="gl (US)"
            value={usGallon}
            onChange={(e) => allowNumber(e.target.value, setUsGallon)}
            onBlur={() => formatOnBlur(usGallon, setUsGallon)}
          />
          <RowView label="V" value={usGallonNumber === null ? "-" : (usGallonNumber / 264.2).toFixed(4)} unit="m³" />
          <RowView label="V" value={usGallonNumber === null ? "-" : (usGallonNumber * 0.13368).toFixed(4)} unit="ft³" />
          <RowView label="V" value={usGallonNumber === null ? "-" : (usGallonNumber * 220 / 264.2).toFixed(4)} unit="IG (UK)" />
        </Section>

      </div>

  </div>
);

}

/* ===== Helpers (نفس جدول 5) ===== */

function Section({children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4">
      {children}
    </div>
  );
}

function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-2 rounded-l bg-green-50">
      <div className="font-semibold text-gray-700 text-left">{label}</div>

      <div className="flex justify-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={(e) => e.target.select()}
          dir="ltr"
          inputMode="decimal"
          autoFocus={autoFocus}
          className="w-full max-w-[180px] text-center border border-gray-300 rounded p-1"
        />
      </div>

      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_2[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-l bg-gray-50">
      <div className="font-semibold text-gray-700 text-left">{label}</div>

      <div className="text-l font-bold text-center">{value}</div>

      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_2[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
