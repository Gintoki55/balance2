// Pressure convertor  P
"use client";
import Tooltip from "@/components/Tooltip";
import { Gauge } from "lucide-react";
import { useState } from "react";

const infoMap_4 = {
  kWh: "Kilowatt hour",
  MJ: "Megajoule",
  kBTU: "Kilo British thermal unit",
  kcal: "Kilocalorie",
};

export default function HeatConvertor() {
const [kWh, setkWh] = useState("");
const [MJ, setMJ] = useState("");
const [kBTU, setkBTU] = useState("");
const [kcal, setkcal] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

const kWhNumber =
  kWh === "" || kWh === "-" ? null : Number(kWh);

const MJNumber =
  MJ === "" || MJ === "-" ? null : Number(MJ);

const kBTUNumber =
  kBTU === "" || kBTU === "-" ? null : Number(kBTU);

const kcalNumber =
  kcal === "" || kcal === "-" ? null : Number(kcal);

return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray700">
      Heat Converter
    </h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* kWh */}
        <Section title="Heat Converter [kWh]">
          <RowInput
            label="Q"
            unit="kWh"
            value={kWh}
            onChange={(e) => allowNumber(e.target.value, setkWh)}
            onBlur={() => formatOnBlur(kWh, setkWh)}
            autoFocus
          />
          <RowView label="Q" value={kWhNumber === null ? "-" : (3.6 * kWhNumber).toFixed(4)} unit="MJ" />
          <RowView label="Q" value={kWhNumber === null ? "-" : (3.41232 * kWhNumber).toFixed(4)} unit="kBTU" />
          <RowView label="Q" value={kWhNumber === null ? "-" : (860.01 * kWhNumber).toFixed(4)} unit="kcal" />
        </Section>

        {/* MJ */}
        <Section title="Heat Converter [MJ]">
          <RowInput
            label="Q"
            unit="MJ"
            value={MJ}
            onChange={(e) => allowNumber(e.target.value, setMJ)}
            onBlur={() => formatOnBlur(MJ, setMJ)}
          />
          <RowView label="Q" value={MJNumber === null ? "-" : (0.9479 * MJNumber).toFixed(4)} unit="kBTU" />
          <RowView label="Q" value={MJNumber === null ? "-" : (238.892 * MJNumber).toFixed(4)} unit="kcal" />
          <RowView label="Q" value={MJNumber === null ? "-" : (MJNumber / 3.6).toFixed(4)} unit="kWh" />
        </Section>

        {/* kBTU */}
        <Section title="Heat Converter [kBTU]">
          <RowInput
            label="Q"
            unit="kBTU"
            value={kBTU}
            onChange={(e) => allowNumber(e.target.value, setkBTU)}
            onBlur={() => formatOnBlur(kBTU, setkBTU)}
          />
          <RowView label="Q" value={kBTUNumber === null ? "-" : (252.031 * kBTUNumber).toFixed(4)} unit="kcal" />
          <RowView label="Q" value={kBTUNumber === null ? "-" : (0.2931 * kBTUNumber).toFixed(4)} unit="kWh" />
          <RowView label="Q" value={kBTUNumber === null ? "-" : (1.055 * kBTUNumber).toFixed(4)} unit="MJ" />
        </Section>

        {/* kcal */}
        <Section title="Heat Converter [kcal]">
          <RowInput
            label="Q"
            unit="kcal"
            value={kcal}
            onChange={(e) => allowNumber(e.target.value, setkcal)}
            onBlur={() => formatOnBlur(kcal, setkcal)}
          />
          <RowView label="Q" value={kcalNumber === null ? "-" : (kcalNumber / 860.01).toFixed(4)} unit="kWh" />
          <RowView label="Q" value={kcalNumber === null ? "-" : ((kcalNumber * 3.6) / 860.01).toFixed(4)} unit="MJ" />
          <RowView label="Q" value={kcalNumber === null ? "-" : ((kcalNumber * 3.41232) / 860.01).toFixed(4)} unit="kBTU" />
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