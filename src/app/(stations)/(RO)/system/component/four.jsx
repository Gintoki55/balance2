// Pressure convertor  P
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_4 = {
  bar: "bar",
  kPa: "KiloPascal",
  MPa: "megaPascal",
  psi: "Pound  per square inch",
};

export default function Four() {
const [bar, setBar] = useState("");
const [kPa, setKPa] = useState("");
const [megaPascal, setMegaPascal] = useState("");
const [psi, setPsi] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

const barNumber =
  bar === "" || bar === "-" ? null : Number(bar);

const kPaNumber =
  kPa === "" || kPa === "-" ? null : Number(kPa);

const megaPascalNumber =
  megaPascal === "" || megaPascal === "-" ? null : Number(megaPascal);

const psiNumber =
  psi === "" || psi === "-" ? null : Number(psi);

return (
  <div className="max-w-7xl w-full space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Pressure Converter P
    </h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* bar */}
        <Section>
          <RowInput
            label="P"
            unit="bar"
            value={bar}
            onChange={(e) => allowNumber(e.target.value, setBar)}
            onBlur={() => formatOnBlur(bar, setBar)}
            autoFocus
          />
          <RowView label="P" value={barNumber === null ? "-" : (barNumber * 100).toFixed(4)} unit="kPa" />
          <RowView label="P" value={barNumber === null ? "-" : (barNumber / 10).toFixed(4)} unit="MPa" />
          <RowView label="P" value={barNumber === null ? "-" : (barNumber * 14.55).toFixed(4)} unit="psi" />
        </Section>

        {/* kPa */}
        <Section >
          <RowInput
            label="P"
            unit="kPa"
            value={kPa}
            onChange={(e) => allowNumber(e.target.value, setKPa)}
            onBlur={() => formatOnBlur(kPa, setKPa)}
          />
          <RowView label="P" value={kPaNumber === null ? "-" : (kPaNumber / 1000).toFixed(4)} unit="MPa" />
          <RowView label="P" value={kPaNumber === null ? "-" : (kPaNumber * 0.1455).toFixed(4)} unit="psi" />
          <RowView label="P" value={kPaNumber === null ? "-" : (kPaNumber / 100).toFixed(4)} unit="bar" />
        </Section>

        {/* MPa */}
        <Section >
          <RowInput
            label="P"
            unit="MPa"
            value={megaPascal}
            onChange={(e) => allowNumber(e.target.value, setMegaPascal)}
            onBlur={() => formatOnBlur(megaPascal, setMegaPascal)}
          />
          <RowView label="P" value={megaPascalNumber === null ? "-" : (megaPascalNumber * 145.5).toFixed(4)} unit="psi" />
          <RowView label="P" value={megaPascalNumber === null ? "-" : (megaPascalNumber * 10).toFixed(4)} unit="bar" />
          <RowView label="P" value={megaPascalNumber === null ? "-" : (megaPascalNumber * 1000).toFixed(4)} unit="kPa" />
        </Section>

        {/* psi */}
        <Section>
          <RowInput
            label="P"
            unit="psi"
            value={psi}
            onChange={(e) => allowNumber(e.target.value, setPsi)}
            onBlur={() => formatOnBlur(psi, setPsi)}
          />
          <RowView label="P" value={psiNumber === null ? "-" : (psiNumber / 14.55).toFixed(4)} unit="bar" />
          <RowView label="P" value={psiNumber === null ? "-" : (psiNumber / 0.1455).toFixed(4)} unit="kPa" />
          <RowView label="P" value={psiNumber === null ? "-" : (psiNumber / 145.5).toFixed(4)} unit="MPa" />
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
          <Tooltip text={infoMap_4[unit]}>
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
          <Tooltip text={infoMap_4[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
