// RO water and salt permeation
"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_6 = {
  gfd: "Gallon per square foot per day",
  lmh: "liter per square meter per hour",

  "l/m².h.bar": "Liter per square meter per hour per bar",
  "m/s.bar": "Meter per second per bar",

  "m/s": "Meter per second",
  "g/m².h.(g/l)": "Gram per square meter per hour per salinty gradient",
};

export default function Six() {

  /* ================= States ================= */
  const [c73, setC73] = useState("");
  const [c75, setC75] = useState("");
  const [c78, setC78] = useState("");
  const [c80, setC80] = useState("");
  const [c83, setC83] = useState("");
  const [c85, setC85] = useState("");

  /* ===== Allow Only Numbers ===== */
  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  /* ===== Clean Number On Blur ===== */
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  /* ===== Smart Scientific (W & X only) ===== */
// const formatScientific = (num, decimals = 2) => {
//   if (num === null || num === "-" || isNaN(num)) return "-";

//   const n = Number(num);
//   const abs = Math.abs(n);

//   if (abs >= 1000000000 || (abs > 0 && abs < 0.000001)) {
//     return n.toExponential(decimals).replace("e", "E");
//   }

//   // عرض نظيف بدون ذيول طويلة
//   return n.toFixed(8).replace(/\.?0+$/, "");
// };
const formatScientific = (num, decimals = 2) => {
  if (num === null || num === "-" || isNaN(num)) return "-";

  const n = Number(num);

  return n
    .toExponential(decimals)   // يحول إلى scientific
    .replace("e", "E")         // E كبيرة        // فاصلة أوروبية
};

  /* ===== Fixed 4 Decimals (M only) ===== */
  const formatFixed4 = (num) => {
    if (num === null || num === "-" || isNaN(num)) return "-";
    return Number(num).toFixed(4);
  };

  /* ===== Numeric Values ===== */
  const n73 = c73 === "" || c73 === "-" ? null : Number(c73);
  const n75 = c75 === "" || c75 === "-" ? null : Number(c75);
  const n78 = c78 === "" || c78 === "-" ? null : Number(c78);
  const n80 = c80 === "" || c80 === "-" ? null : Number(c80);
  const n83 = c83 === "" || c83 === "-" ? null : Number(c83);
  const n85 = c85 === "" || c85 === "-" ? null : Number(c85);

  return (
    <div className="max-w-7xl w-full space-y-10">

      {/* ================= Water Permeability (W) ================= */}
      <div>
        <h3 className="font-bold text-gray-700 mb-4">Water Permeability (W)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-300 shadow-lg gap-4">

          <div className="space-y-4 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4 ">
            <RowInput
              label="W"
              unit="l/m².h.bar"
              value={c78}
              onChange={(e) => allowNumber(e.target.value, setC78)}
              onBlur={() => formatOnBlur(c78, setC78)}
            />
            <RowView
              label="W"
              value={n78 === null ? "-" : (n78 / (3600 * 1000))}
              unit="m/s.bar"
              formatter={formatScientific}
            />
          </div>

          <div className="space-y-4 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4">
            <RowInput
              label="W"
              unit="m/s.bar"
              value={c80}
              onChange={(e) => allowNumber(e.target.value, setC80)}
              onBlur={() => formatOnBlur(c80, setC80)}
            />
            <RowView
              label="W"
              value={n80 === null ? "-" : (n80 * (3600 * 1000))}
              unit="l/m².h.bar"
              formatter={formatScientific}
            />
          </div>

        </div>
      </div>

      {/* ================= Salt Permeability (X) ================= */}
      <div>
        <h3 className="font-bold text-gray-700 mb-4">Salt Permeability (X)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-300  shadow-lg gap-4">

          <div className="space-y-4 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4 ">
            <RowInput
              label="X"
              unit="g/m².h.(g/l)"
              value={c83}
              onChange={(e) => allowNumber(e.target.value, setC83)}
              onBlur={() => formatOnBlur(c83, setC83)}
            />
            <RowView
              label="X"
              value={n83 === null ? "-" : (n83 / (3600 * 1000))}
              unit="m/s"
              formatter={formatScientific}
            />
          </div>

          <div className="space-y-4 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4 ">
            <RowInput
              label="X"
              unit="m/s"
              value={c85}
              onChange={(e) => allowNumber(e.target.value, setC85)}
              onBlur={() => formatOnBlur(c85, setC85)}
            />
            <RowView
              label="X"
              value={n85 === null ? "-" : (n85 * (3600 * 1000))}
              unit="g/m².h.(g/l)"
              formatter={formatScientific}
            />
          </div>

        </div>
      </div>

      {/* ================= Water Flux (M) ================= */}
      <div>
        <h3 className="font-bold text-gray-700 mb-4">
          Water flux convertor (M)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-300 shadow-lg gap-4">

          <div className="space-y-4 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4 ">
            <RowInput
              label="M"
              unit="gfd"
              value={c73}
              onChange={(e) => allowNumber(e.target.value, setC73)}
              onBlur={() => formatOnBlur(c73, setC73)}
              autoFocus
            />
            <RowView
              label="M"
              value={n73 === null ? "-" : ((n73 * 3.785 * 10.76) / 24)}
              unit="lmh"
              formatter={formatFixed4}
            />
          </div>

          <div className="space-y-4 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4 ">
            <RowInput
              label="M"
              unit="lmh"
              value={c75}
              onChange={(e) => allowNumber(e.target.value, setC75)}
              onBlur={() => formatOnBlur(c75, setC75)}
            />
            <RowView
              label="M"
              value={n75 === null ? "-" : ((n75 * 24) / (3.785 * 10.76))}
              unit="gfd"
              formatter={formatFixed4}
            />
          </div>

        </div>
      </div>

    </div>
  );
}

/* ===== Components ===== */

function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 rounded-l bg-green-50">
      <span className="font-semibold text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        autoFocus={autoFocus}
        className="w-full text-center border border-gray-300 rounded p-1"
      />
      <div className="flex justify-end" dir="ltr">
        <Tooltip text={infoMap_6[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}

function RowView({ label, value, unit, formatter }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-l bg-gray-50">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-l font-bold text-center break-all">
        {formatter(value)}
      </span>
      <div className="flex justify-end " dir="ltr">
        <Tooltip text={infoMap_6[unit]}>
          <span className="cursor-help text-gray-600">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}
