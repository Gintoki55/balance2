// Water flow convertor  M
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_3 = {
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
  <div className="max-w-7xl w-full space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Water flow convertor M
    </h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MIGD */}
        <Section>
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
        <Section >
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
        <Section >
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
        <Section >
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

/* ===== Helpers (نفس رقم 5) ===== */

function Section({ children }) {
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
          <Tooltip text={infoMap_3[unit]}>
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
          <Tooltip text={infoMap_3[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
