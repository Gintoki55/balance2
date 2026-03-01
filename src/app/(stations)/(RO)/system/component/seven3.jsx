"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_SR = {
  "°C": "Celcius",
  "g/l": "gram per liter",
  "%": "precent",
  bar: "bar",

  Sf: "Feed water salinity [g/l]",
  Sd: "Product water salinity [g/l]",
  SR: "Precent salt rejection [%]",
  π: "Osmotic pressure [bar]",
  T: "Water temperature",
  S: "Salinity",
};

export default function SaltRejectionOsmotic() {

  /* ===== Section 1 ===== */
  const [section1_SR, setSection1_SR] = useState("");
  const [section1_Sf, setSection1_Sf] = useState("");

  /* ===== Section 2 ===== */
  const [section2_Sd, setSection2_Sd] = useState("");
  const [section2_SR, setSection2_SR] = useState("");

  /* ===== Section 3 ===== */
  const [section3_Sf, setSection3_Sf] = useState("");
  const [section3_Sd, setSection3_Sd] = useState("");

  /* ===== Osmotic Pressure ===== */
  const [temperature, setTemperature] = useState("");
  const [salinity, setSalinity] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatNumber = (num, digits = 6) => {
    if (num === "" || num === "-" || num === null) return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ===== Calculations (نفسها بالضبط) ===== */

  const SR_from_Sf_Sd =
    section3_Sf && section3_Sd
      ? formatNumber(
          (100 * (Number(section3_Sf) - Number(section3_Sd))) /
            (Number(section3_Sf) || 1),
          4
        )
      : "-";

  const PI =
    temperature && salinity
      ? formatNumber(
          0.00255 * (273 + Number(temperature)) * Number(salinity),
          4
        )
      : "-";

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Salt Rejections & Osmotic Pressure
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Section 1 */}
        <Section>
          <RowInput
            label="SR"
            unit="%"
            value={section1_SR}
            set={setSection1_SR}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowInput
            label="Sf"
            unit="g/l"
            value={section1_Sf}
            set={setSection1_Sf}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowView
            label="Sd"
            unit="g/l"
            value={
              section1_SR && section1_Sf
                ? formatNumber(
                    ((100 - Number(section1_SR)) *
                      Number(section1_Sf)) /
                      100,
                    6
                  )
                : "-"
            }
          />
        </Section>

       

        {/* Section 3 */}
        <Section>
          <RowInput
            label="Sf"
            unit="g/l"
            value={section3_Sf}
            set={setSection3_Sf}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowInput
            label="Sd"
            unit="g/l"
            value={section3_Sd}
            set={setSection3_Sd}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowView
            label="SR"
            unit="%"
            value={SR_from_Sf_Sd}
          />
        </Section>

         {/* Section 2 */}
        <Section>
          <RowInput
            label="Sd"
            unit="g/l"
            value={section2_Sd}
            set={setSection2_Sd}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowInput
            label="SR"
            unit="%"
            value={section2_SR}
            set={setSection2_SR}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowView
            label="Sf"
            unit="g/l"
            value={
              section2_Sd && section2_SR
                ? formatNumber(
                    (100 * Number(section2_Sd)) /
                      (100 - Number(section2_SR) || 1),
                    6
                  )
                : "-"
            }
          />
        </Section>

        {/* Osmotic Pressure */}
        <Section>
          <RowInput
            label="T"
            unit="°C"
            value={temperature}
            set={setTemperature}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowInput
            label="S"
            unit="g/l"
            value={salinity}
            set={setSalinity}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />
          <RowView label="π" unit="bar" value={PI} />
        </Section>

      </div>
    </div>
  );
}

function Section({ children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4">
      {children}
    </div>
  );
}
/* ===== UI ===== */

function RowInput({ label, unit, value, set, allow, formatOnBlur }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-green-50">
      <Tooltip text={infoMap_SR[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
        onClick={(e) => e.target.select()}
        className="w-full text-center border border-gray-300 rounded p-1"
      />

      <Tooltip text={infoMap_SR[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">
          {unit}
        </span>
      </Tooltip>
    </div>
  );
}

function RowView({ label, unit, value }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-50">
      <Tooltip text={infoMap_SR[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <span className="font-bold text-center">{value}</span>

      <Tooltip text={infoMap_SR[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">
          {unit}
        </span>
      </Tooltip>
    </div>
  );
}