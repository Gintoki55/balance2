"use client";
import Tooltip from "@/components/Tooltip";
import { Beaker, Gauge, FlaskConical, Thermometer } from "lucide-react";
import { useState } from "react";
const INFO_7 = {
  "T":"Water temperature",
  "S":"Salinity",
  "π":"Osmotic pressure",
  "°C":"Celsius",
  "g/l":"Grams per liter",
  "bar":"Bar",
  "Sf":"Feed salinity",
  "Sd":"Product salinity",
  "SR":"Salt rejection",
  "%":"Percent",

};


const allowNumber = (value, setter) => {
  if (/^-?\d*\.?\d*$/.test(value)) setter(value);
};
  
const formatOnBlur = (value, setter) => {
  if (value === "" || value === "-") return;
  const n = Number(value);
  if (!isNaN(n)) setter(String(n));
};

// Osmotic Pressure Converter && Salt Rejection
export function Seven() {
  const [T, setT] = useState(30);
  const [S, setS] = useState(50);

  const pi = 0.00255 * (273 + T) * S;
  
  const [Sf, setSf] = useState(65);
  const [Sd, setSd] = useState(0.2);

  const SR = 100 * (Sf - Sd) / Sf;


  return (
    <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Osmotic Pressure Converter">
                <RowInput
                    label="T"
                    unit="°C"
                    value={T}
                    onChange={(e) => allowNumber(e.target.value, setT)}
                    onBlur={() => formatOnBlur(T, setT)}
                    autoFocus
                    info={INFO_7}
                />

                <RowInput
                    label="S"
                    unit="g/l"
                    value={S}
                    onChange={(e) => allowNumber(e.target.value, setS)}
                    onBlur={() => formatOnBlur(S, setS)}
                    autoFocus
                    info={INFO_7}
                />

                <RowView label="π" unit="bar" value={pi} info={INFO_7}/>
                </Section> 


            <Section title="Salt Rejection">
                <RowInput
                    label="Sf"
                    unit="g/l"
                    value={Sf}
                    onChange={(e) => allowNumber(e.target.value, setSf)}
                    onBlur={() => formatOnBlur(Sf, setSf)}
                    autoFocus
                    info={INFO_7}
                />

                <RowInput
                    label="Sd"
                    unit="g/l"
                    value={Sd}
                    onChange={(e) => allowNumber(e.target.value, setSd)}
                    onBlur={() => formatOnBlur(Sd, setSd)}
                    autoFocus
                    info={INFO_7}
                />

                <RowView
                    label="SR"
                    unit="%"
                    value={(SR / 10000).toFixed(4)}
                    info={INFO_7}
                />
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
function RowInput({ label, unit, value, onChange, onBlur, autoFocus,info }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">
      {info[label] ? (
        <Tooltip text={info[label]}>
         <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-5 cursor-help">{label}</div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600">{label}</div>
      )}

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
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-4">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}
function RowView({ label, value, unit , info}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-5 cursor-help">{label}</div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600">{label}</div>
      )}

      <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}