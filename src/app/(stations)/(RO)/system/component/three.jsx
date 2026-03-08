// Water flow convertor  M
"use client";


import Tooltip from "@/components/Tooltip";
import { Droplets } from "lucide-react";
import { useState } from "react";

const INFO = {
  MIGD: "Million Imperial Gallon per day (Liquid water flow)",
  "m³/day": "Cubic meter per day (liquid water flow)",
  "t/h": "Metric ton per hour (as m³/h for liquid water)",
  "kg/s": "Kilogram per second (as l/s for liquid water )",
};

export default function Three() {
const [migd, setMigd] = useState("");
const [cubicMeterPerDay, setCubicMeterPerDay] = useState("");
const [tonPerHour, setTonPerHour] = useState("");
const [kgPerSecond, setKgPerSecond] = useState("");
  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

const migdNumber =
  migd === "" || migd === "-" ? null : Number(migd);

const cubicMeterPerDayNumber =
  cubicMeterPerDay === "" || cubicMeterPerDay === "-" ? null : Number(cubicMeterPerDay);

const tonPerHourNumber =
  tonPerHour === "" || tonPerHour === "-" ? null : Number(tonPerHour);

const kgPerSecondNumber =
  kgPerSecond === "" || kgPerSecond === "-" ? null : Number(kgPerSecond);

return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray-300">
      Water flow convertor M
    </h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MIGD */}
        <Section title="Water Flow Converter [MIGD]">
          <RowInput
            label="M"
            unit="MIGD"
            value={migd}
            onChange={(e) => allowNumber(e.target.value, setMigd)}
            onBlur={() => formatOnBlur(migd, setMigd)}
            autoFocus
          />
          <RowView label="M" value={migdNumber === null ? "-" : ((migdNumber * 1_000_000) / 220).toFixed(4)} unit="m³/day" />
          <RowView label="M" value={migdNumber === null ? "-" : ((migdNumber * 1_000_000) / (220 * 24)).toFixed(4)} unit="t/h" />
          <RowView label="M" value={migdNumber === null ? "-" : ((migdNumber * 4_545_454) / 86400).toFixed(4)} unit="kg/s" />
        </Section>

                {/* m³/day */}
        <Section title="Water Flow Converter [m³/day]">
          <RowInput
            label="M"
            unit="m³/day"
            value={cubicMeterPerDay}
            onChange={(e) => allowNumber(e.target.value, setCubicMeterPerDay)}
            onBlur={() => formatOnBlur(cubicMeterPerDay, setCubicMeterPerDay)}
          />
          <RowView label="M" value={cubicMeterPerDayNumber === null ? "-" : ((cubicMeterPerDayNumber + 0.0001) / 24).toFixed(4)} unit="t/h" />
          <RowView label="M" value={cubicMeterPerDayNumber === null ? "-" : ((cubicMeterPerDayNumber * 1000) / 86400).toFixed(4)} unit="kg/s" />
          <RowView label="M" value={cubicMeterPerDayNumber === null ? "-" : ((cubicMeterPerDayNumber * 220) / 1_000_000).toFixed(4)} unit="MIGD" />
        </Section>

        {/* t/h */}
        <Section title="Water Flow Converter [t/h]">
          <RowInput
            label="M"
            unit="t/h"
            value={tonPerHour}
            onChange={(e) => allowNumber(e.target.value, setTonPerHour)}
            onBlur={() => formatOnBlur(tonPerHour, setTonPerHour)}
          />
          <RowView label="M" value={tonPerHourNumber === null ? "-" : ((tonPerHourNumber * 1000) / 3600).toFixed(4)} unit="kg/s" />
          <RowView label="M" value={tonPerHourNumber === null ? "-" : ((tonPerHourNumber * 24 * 220) / 1_000_000).toFixed(4)} unit="MIGD" />
          <RowView label="M" value={tonPerHourNumber === null ? "-" : (tonPerHourNumber * 24).toFixed(4)} unit="m³/day" />
        </Section>


        {/* kg/s */}
        <Section title="Water Flow Converter [kg/s]">
          <RowInput
            label="M"
            unit="kg/s"
            value={kgPerSecond}
            onChange={(e) => allowNumber(e.target.value, setKgPerSecond)}
            onBlur={() => formatOnBlur(kgPerSecond, setKgPerSecond)}
          />
          <RowView label="M" value={kgPerSecondNumber === null ? "-" : ((kgPerSecondNumber * 86400) / 4_545_454).toFixed(4)} unit="MIGD" />
          <RowView label="M" value={kgPerSecondNumber === null ? "-" : ((kgPerSecondNumber * 86400) / 1000).toFixed(4)} unit="m³/day" />
          <RowView label="M" value={kgPerSecondNumber === null ? "-" : ((kgPerSecondNumber * 3600) / 1000).toFixed(4)} unit="t/h" />
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