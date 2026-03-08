"use client";

import Tooltip from "@/components/Tooltip";
import { Thermometer } from "lucide-react";
import { useState } from "react";

const INFO = {
  "°C": "Celsius",
  K: "Kelvin",
  "°F": "Fahrenheit",
  "°R": "Rankine",
};

export default function One() {
  const [celsius, setCelsius] = useState("");
  const [kelvin, setKelvin] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  const [rankine, setRankine] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const celsiusNumber =
    celsius === "" || celsius === "-" ? null : Number(celsius);
  const kelvinNumber =
    kelvin === "" || kelvin === "-" ? null : Number(kelvin);
  const fahrenheitNumber =
    fahrenheit === "" || fahrenheit === "-" ? null : Number(fahrenheit);
  const rankineNumber =
    rankine === "" || rankine === "-" ? null : Number(rankine);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">
      <h2 className="text-xl font-semibold text-gray-300 tracking-wide">
        Temperature Converter T
      </h2>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Celsius */}
        <Section title="Temperature Converter [°C]">
          <RowInput
            label="T"
            unit="°C"
            value={celsius}
            onChange={(e) => allowNumber(e.target.value, setCelsius)}
            onBlur={() => formatOnBlur(celsius, setCelsius)}
            autoFocus
          />
          <RowView label="T" value={celsiusNumber === null ? "-" : (celsiusNumber + 273.15).toFixed(4)} unit="K" />
          <RowView label="T" value={celsiusNumber === null ? "-" : (32 + 1.8 * celsiusNumber).toFixed(4)} unit="°F" />
          <RowView label="T" value={celsiusNumber === null ? "-" : ((celsiusNumber + 273.15) * 9 / 5).toFixed(4)} unit="°R" />
        </Section>

        {/* Kelvin */}
        <Section title="Temperature Converter [K]"> 
          <RowInput
            label="T"
            unit="K"
            value={kelvin}
            onChange={(e) => allowNumber(e.target.value, setKelvin)}
            onBlur={() => formatOnBlur(kelvin, setKelvin)}
          />
          <RowView label="T" value={kelvinNumber === null ? "-" : (1.8 * kelvinNumber - 459.67).toFixed(4)} unit="°F" />
          <RowView label="T" value={kelvinNumber === null ? "-" : (kelvinNumber * 9 / 5).toFixed(4)} unit="°R" />
          <RowView label="T" value={kelvinNumber === null ? "-" : (kelvinNumber - 273.15).toFixed(4)} unit="°C" />
        </Section>

        {/* Fahrenheit */}
        <Section title="Temperature Converter [°F]">
          <RowInput
            label="T"
            unit="°F"
            value={fahrenheit}
            onChange={(e) => allowNumber(e.target.value, setFahrenheit)}
            onBlur={() => formatOnBlur(fahrenheit, setFahrenheit)}
          />
          <RowView label="T" value={fahrenheitNumber === null ? "-" : (fahrenheitNumber + 459.67).toFixed(4)} unit="°R" />
          <RowView label="T" value={fahrenheitNumber === null ? "-" : (((fahrenheitNumber - 32) * 5) / 9).toFixed(4)} unit="°C" />
          <RowView label="T" value={fahrenheitNumber === null ? "-" : (((fahrenheitNumber + 459.67) * 5) / 9).toFixed(4)} unit="K" />
        </Section>

        {/* Rankine */}
        <Section title="Temperature Converter [°R]">
          <RowInput
            label="T"
            unit="°R"
            value={rankine}
            onChange={(e) => allowNumber(e.target.value, setRankine)}
            onBlur={() => formatOnBlur(rankine, setRankine)}
          />
          <RowView label="T" value={rankineNumber === null ? "-" : (rankineNumber * 5 / 9 - 273.15 ).toFixed(4)} unit="°C" />
          <RowView label="T" value={rankineNumber === null ? "-" : (rankineNumber * 5 / 9 ).toFixed(4)} unit="K" />
          <RowView label="T" value={rankineNumber === null ? "-" : (rankineNumber - 459.67).toFixed(4)} unit="°F" />
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
         <Thermometer className="w-4 h-4" />
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
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-4">{unit}</span>
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