// Pressure convertor  P
"use client";
import Tooltip from "@/components/Tooltip";
import { Gauge } from "lucide-react";
import { useState } from "react";

const infoMap_4 = {
  bar: "bar",
  kPa: "KiloPascal",
  MPa: "megaPascal",
  psi: "Pounds per square inch",
};

export function Four() {
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
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray700">
      Pressure Converter P
    </h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* bar */}
        <Section title="Pressure Converter [bar]">
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
        <Section title="Pressure Converter [kPa]">
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
        <Section title="Pressure Converter [MPa]">
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
        <Section title="Pressure Converter [psi]">
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
        <Tooltip text={infoMap_4[unit]}>
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
        <Tooltip text={infoMap_4[unit]}>
         <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}