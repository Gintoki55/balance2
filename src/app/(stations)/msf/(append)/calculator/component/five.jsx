// Heat convertor Q
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_5 = {
  kWh: "Kilowatt hour",
  MJ: "megaJoule",
  kBTU: "kilo British thermal unit",
};

export default function Five() {
  const [c61, setC61] = useState("");
  const [c64, setC64] = useState("");
  const [c67, setC67] = useState("");


  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };


  const n61 = c61 === "" || c61 === "-" ? null : Number(c61);
  const n64 = c64 === "" || c64 === "-" ? null : Number(c64);
  const n67 = c67 === "" || c67 === "-" ? null : Number(c67);

  return (
    <div className="max-w-7xl w-full p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Heat Converter Q</h2>

      {/* ===== kWh ===== */}
      <Section title="kWh input">
        <RowInput
          label="Q"
          unit="kWh"
          value={c61}
          onChange={(e) => allowNumber(e.target.value, setC61)}
          onBlur={() => formatOnBlur(c61, setC61)}
          autoFocus
        />
        <RowView
          label="Q"
          value={n61 === null ? "-" : (n61 * 3.6).toFixed(4)}
          unit="MJ"
        />
        <RowView
          label="Q"
          value={n61 === null ? "-" : (n61 * 3.4123).toFixed(4)}
          unit="kBTU"
        />
      </Section>

      {/* ===== MJ ===== */}
      <Section title="MJ input">
        <RowInput
          label="Q"
          unit="MJ"
          value={c64}
          onChange={(e) => allowNumber(e.target.value, setC64)}
          onBlur={() => formatOnBlur(c64, setC64)}
        />
        <RowView
          label="Q"
          value={n64 === null ? "-" : ((n64 * 3.4123) / 3.6).toFixed(4)}
          unit="kBTU"
        />
        <RowView
          label="Q"
          value={n64 === null ? "-" : (n64 / 3.6).toFixed(4)}
          unit="kWh"
        />
      </Section>

      {/* ===== kBTU ===== */}
      <Section title="kBTU input">
        <RowInput
          label="Q"
          unit="kBTU"
          value={c67}
          onChange={(e) => allowNumber(e.target.value, setC67)}
          onBlur={() => formatOnBlur(c67, setC67)}
        />
        <RowView
          label="Q"
          value={n67 === null ? "-" : (n67 / 3.4123).toFixed(4)}
          unit="kWh"
        />
        <RowView
          label="Q"
          value={n67 === null ? "-" : ((n67 * 3.6) / 3.4123).toFixed(4)}
          unit="MJ"
        />
      </Section>
    </div>
  );
}

/* ===== Helpers ===== */
function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function RowInput({ label, unit, value, onChange,onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-xl bg-green-50 ">
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
          <Tooltip text={infoMap_5[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center p-3 rounded-xl bg-gray-50 ">
      <div className="font-semibold text-gray-700 text-left">{label}</div>
      <div className="text-l font-bold text-center">{value}</div>
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_5[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
