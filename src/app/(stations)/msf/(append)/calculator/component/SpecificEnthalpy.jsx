// Pressure convertor  P
"use client";
import Tooltip from "@/components/Tooltip";
import { Gauge } from "lucide-react";
import { useState } from "react";

const infoMap_4 = {
  "°C": "Celsius",
  "MJ/t": "Megajoule per metric ton",
  h: "Specific enthalpy",
  T: "Water temperature",
  λ: "Latent heat of evaporation",
  Tv: "Vapor temperature",
  hv: "Specific enthalpy of saturated steam",
  hb: "Specific enthalpy of saline water",
  Sb: "Water salinity",
  Tb: "Saline water temperature",
  "g/l": "Grams per liter",
};

export default function SpecificEnthalpy() {
const [Celsius1, setCelsius1] = useState("");
const [Celsius2, setCelsius2] = useState("");
const [Celsius3, setCelsius3] = useState("");
const [Celsius4, setCelsius4] = useState("");
const [GL, setGL] = useState("");
  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

const C1umber =
  Celsius1 === "" || Celsius1 === "-" ? null : Number(Celsius1);

const C2umber =
  Celsius2 === "" || Celsius2 === "-" ? null : Number(Celsius2);

const C3umber =
  Celsius3 === "" || Celsius3 === "-" ? null : Number(Celsius3);

const C4umber =
  Celsius4 === "" || Celsius4 === "-" ? null : Number(Celsius4);

const GLNumber =
  GL === "" || GL === "-" ? null : Number(GL);


    const hs =
    4.18 * C4umber -
    0.034 +
    0.01 * (1.1 - 0.54 * C4umber + 56e-5 * Math.pow(C4umber, 2)) * GLNumber -
    1e-4 * (4 - 0.016 * C4umber + 18e-5 * Math.pow(C4umber, 2)) * Math.pow(GLNumber, 2);


return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <h2 className="text-xl font-bold text-gray700">
     Thermal Variables
    </h2>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Celsius1 */}
        <Section title="Specific Enthalpy of Liquid Water">
          <RowInput
            label="T"
            unit="°C"
            value={Celsius1}
            onChange={(e) => allowNumber(e.target.value, setCelsius1)}
            onBlur={() => formatOnBlur(Celsius1, setCelsius1)}
            autoFocus
          />
          <RowView label="h" value={C1umber === null ? "-" : ( 4.18 * C1umber - 0.034 ).toFixed(4)} unit="MJ/t" />
        </Section>

        {/* Celsius2 */}
        <Section title="Latent Heat of Evaporation">
          <RowInput
            label="T"
            unit="°C"
            value={Celsius2}
            onChange={(e) => allowNumber(e.target.value, setCelsius2)}
            onBlur={() => formatOnBlur(Celsius2, setCelsius2)}
          />
          <RowView label="λ" value={C2umber === null ? "-" : (2501.7 - 2.18 * C2umber - 77e-7 * Math.pow(C2umber, 3) ).toFixed(4)} unit="MJ/t" />
        </Section>

        {/* Celsius3 */}
        <Section title="Specific Enthalpy of Saturation Vapor">
          <RowInput
            label="Tv"
            unit="°C"
            value={Celsius3}
            onChange={(e) => allowNumber(e.target.value, setCelsius3)}
            onBlur={() => formatOnBlur(Celsius3, setCelsius3)}
          />
          <RowView label="hv" value={C3umber === null ? "-" : ( 2501.7 - 1.8 * C3umber - 77e-7 * Math.pow(C3umber, 3)).toFixed(4)} unit="MJ/t" />
        </Section>

        

        {/* Celsius4 */}
        <Section title="Specific Enthalpy of Saline Water">
          <RowInput
            label="Tb"
            unit="°C"
            value={Celsius4}
            onChange={(e) => allowNumber(e.target.value, setCelsius4)}
            onBlur={() => formatOnBlur(Celsius4, setCelsius4)}
          />
          <RowInput
            label="Sb"
            unit="g/l"
            value={GL}
            onChange={(e) => allowNumber(e.target.value, setGL)}
            onBlur={() => formatOnBlur(GL, setGL)}
          />
          <RowView label="Hb" value={C1umber === null ? "-" : hs.toFixed(4)} unit="MJ/t" />
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