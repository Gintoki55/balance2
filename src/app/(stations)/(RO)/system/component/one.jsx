"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_1 = {
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
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Temperature Converter T
      </h2>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Celsius */}
        <Section>
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
          <RowView label="T" value={celsiusNumber === null ? "-" : (7.5 + celsiusNumber * 21 / 40).toFixed(4)} unit="°R" />
        </Section>

        {/* Kelvin */}
        <Section>
          <RowInput
            label="T"
            unit="K"
            value={kelvin}
            onChange={(e) => allowNumber(e.target.value, setKelvin)}
            onBlur={() => formatOnBlur(kelvin, setKelvin)}
          />
          <RowView label="T" value={kelvinNumber === null ? "-" : (1.8 * kelvinNumber - 459.67).toFixed(4)} unit="°F" />
          <RowView label="T" value={kelvinNumber === null ? "-" : (7.5 +(kelvinNumber-273.15) * 21/40 ).toFixed(4)} unit="°R" />
          <RowView label="T" value={kelvinNumber === null ? "-" : (kelvinNumber - 273.15).toFixed(4)} unit="°C" />
        </Section>

        {/* Fahrenheit */}
        <Section >
          <RowInput
            label="T"
            unit="°F"
            value={fahrenheit}
            onChange={(e) => allowNumber(e.target.value, setFahrenheit)}
            onBlur={() => formatOnBlur(fahrenheit, setFahrenheit)}
          />
          <RowView label="T" value={fahrenheitNumber === null ? "-" : (7.5 + (fahrenheitNumber - 32) * 105/360 ).toFixed(4)} unit="°R" />
          <RowView label="T" value={fahrenheitNumber === null ? "-" : (((fahrenheitNumber - 32) * 5) / 9).toFixed(4)} unit="°C" />
          <RowView label="T" value={fahrenheitNumber === null ? "-" : (((fahrenheitNumber + 459.67) * 5) / 9).toFixed(4)} unit="K" />
        </Section>

        {/* Rankine */}
        <Section>
          <RowInput
            label="T"
            unit="°R"
            value={rankine}
            onChange={(e) => allowNumber(e.target.value, setRankine)}
            onBlur={() => formatOnBlur(rankine, setRankine)}
          />
          <RowView label="T" value={rankineNumber === null ? "-" : ((rankineNumber - 7.5) * 40 / 21 ).toFixed(4)} unit="°C" />
          <RowView label="T" value={rankineNumber === null ? "-" : (273.15 +(rankineNumber - 7.5 ) * 40 / 21 ).toFixed(4)} unit="K" />
          <RowView label="T" value={rankineNumber === null ? "-" : (32 + (rankineNumber - 7.5 ) * 360/105).toFixed(4)} unit="°F" />
        </Section>

      </div>
    </div>
  );
}

/* ===== Card Section ===== */

function Section({ children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4">
      {children}
    </div>
  );
}

function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-2 bg-green-50 rounded">
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
        <Tooltip text={infoMap_1[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 bg-gray-50 rounded">
      <div className="font-semibold text-gray-700 text-left">{label}</div>
      <div className="text-lg font-bold text-center">{value}</div>
      <div className="flex justify-end" dir="ltr">
        <Tooltip text={infoMap_1[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}