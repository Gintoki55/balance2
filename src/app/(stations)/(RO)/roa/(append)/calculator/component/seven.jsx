"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_7 = {
  "°C": "Celcius",
  "µs/cm": "microsiemens per centimeter",
  ppm: "part per million",
  "mg/l": "milligram per liter",
  "g/l": "gram per liter",
  "%": "precent",
  bar: "bar",

  T: "Saline water temperatuer T",
  EC: "Electrical conducitvity EC",
  S: "Salinity (Total desolved solid TDS)",

  S0: "Raw water salinity [g/l]",
  Sb: "Brine water salinity [g/l]",
  Sd: "Product water salinity [g/l]",
  WR: "Precent water recovery [%]",

  Sf: "Feed water salinity [g/l]",
  SR: "Precent slat rejection [%]",
  π: "Osmotic pressure [bar]",
};

export default function Seven() {
  /* ================= salinity calculations ================= */
  const [g4, setG4] = useState("");
  const [g5, setG5] = useState("");
  const [g6, setG6] = useState("");

  /* ================= Salinity Convertor ================= */
  const [g8, setG8] = useState("");

  /* ================= Water Recovery ================= */
  // Column 1
  const [wr1, setWr1] = useState("");
  const [wr2, setWr2] = useState("");
  const [wr3, setWr3] = useState("");

  // Column 2
  const [wr4, setWr4] = useState("");
  const [wr5, setWr5] = useState("");
  const [wr6, setWr6] = useState("");

  /* ================= Salt Rejection ================= */

  // Column 1 - Section 1
  const [sr1_a, setSr1_a] = useState(""); // SR %
  const [sr1_b, setSr1_b] = useState(""); // Sf g/l

  // Column 1 - Section 2
  const [sr2_a, setSr2_a] = useState(""); // Sd g/l
  const [sr2_b, setSr2_b] = useState(""); // SR %

  // Column 2 - Section 1
  const [sr3_a, setSr3_a] = useState(""); // Sf g/l
  const [sr3_b, setSr3_b] = useState(""); // Sd g/l

  /* ================= Salt Rejection ================= */
  const [g18, setG18] = useState("");
  const [g19, setG19] = useState("");

  const [g21, setG21] = useState("");
  const [g22, setG22] = useState("");

  const [g24, setG24] = useState("");
  const [g25, setG25] = useState("");

  /* ================= Osmotic Pressure ================= */
  const [g28, setG28] = useState("");
  const [g29, setG29] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  /* ===== Normal Format (no decimal limit) ===== */
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;

    const n = Number(value);

    if (!isNaN(n)) {
      // يحولها رقم نظيف بدون تحديد منازل
      setter(String(n));
    }
  };

  /* ===== Smart Scientific Format ===== */
  const formatScientific = (num, decimals = 3) => {
    if (num === null || num === "-" || isNaN(num)) return "-";

    const n = Number(num);

    // إذا زاد عن 9999 أو أقل من 0.001
    if (Math.abs(n) >= 10000 || (Math.abs(n) > 0 && Math.abs(n) < 0.001)) {
      return n.toExponential(decimals).replace("e", "E");
    }

    return n.toFixed(4);
  };

  /* ================= Calculations ================= */

  const ppm = (() => {
    if (g4 === "" || g5 === "") return "-";

    const T = Number(g4);
    const EC = Number(g5);
    if (isNaN(T) || isNaN(EC)) return "-";

    const A = EC * (1 + 0.022 * (T - 25));
    const result =
      A *
      (0.5 +
        0.05 * (0.5 + (0.5 * Math.abs(A - 100)) / (A - 100 + 0.0000001)) +
        0.1 * (0.5 + (0.5 * Math.abs(A - 1000)) / (A - 1000 + 0.0000001)) +
        0.05 * (0.5 + (0.5 * Math.abs(A - 40000)) / (A - 40000 + 0.0000001)) +
        0.05 * (0.5 + (0.5 * Math.abs(A - 60000)) / (A - 60000 + 0.0000001)));

    return result.toFixed(4);
  })();

  const WR =
    wr4 && wr5 && wr6
      ? (100 * (Number(wr5) - Number(wr4))) / (Number(wr5) - Number(wr6) || 1)
      : "-";

  const SR =
    g18 && g19
      ? ((100 * (Number(g18) - Number(g19))) / (Number(g18) || 1)).toFixed(2)
      : "-";

  const Sd_from_SR =
    g21 && g22 ? (((100 - Number(g21)) * Number(g22)) / 100).toFixed(2) : "-";

  const Sf_from_SR =
    g24 && g25
      ? ((100 * Number(g24)) / (100 - Number(g25) || 1)).toFixed(2)
      : "-";

  const PI =
    g28 && g29 ? (0.00255 * (273 + Number(g28)) * Number(g29)).toFixed(2) : "-";

  return (
    <div className="max-w-7xl w-full space-y-10">
      {/* ================= TABLE 1 ================= */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Salinity Calculations
        </h2>

        <div className="grid md:grid-cols-2 bg-white border border-gray-300 p-6 rounded-l shadow-lg">
          {/* Column 1 */}
          <div className="space-y-3 pl-6 pt-6 pr-1 pb-6">
            <Input
              label="T"
              unit="°C"
              value={g4}
              set={setG4}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="EC"
              unit="µs/cm"
              value={g5}
              set={setG5}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <View
              label="S"
              unit="ppm"
              value={ppm}
              formatScientific={formatScientific}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-3 pr-6 pt-6 pl-1 pb-6">
            <Input
              label="S"
              unit="ppm"
              value={g6}
              set={setG6}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <View
              label="S"
              unit="g/l"
              value={g6 === "" || g6 === "-" ? "-" : Number(g6) / 1000}
              formatScientific={formatScientific}
            />

            <View
              label="S"
              unit="%"
              value={g6 === "" || g6 === "-" ? "-" : Number(g6) / 10000}
              formatScientific={formatScientific}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE 2 ================= */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Water Recovery</h2>

        <div className="grid md:grid-cols-2 bg-white border border-gray-300 p-6 rounded-l shadow-lg">
          {/* Column 1 */}
          <div className="space-y-3 pl-6 pt-6 pr-1 pb-6">
            <Input
              label="WR"
              unit="%"
              value={wr1}
              set={setWr1}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="S0"
              unit="g/l"
              value={wr2}
              set={setWr2}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="Sd"
              unit="g/l"
              value={wr3}
              set={setWr3}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />

            <View
              label="Sb"
              unit="g/l"
              value={
                wr1 === "" || wr2 === "" || wr3 === ""
                  ? "-"
                  : (100 * Number(wr2) - Number(wr1) * Number(wr3)) /
                    (100 - Number(wr1) || 1)
              }
              formatScientific={formatScientific}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-3 pr-6 pt-6 pl-1 pb-6">
            <Input
              label="S0"
              unit="g/l"
              value={wr4}
              set={setWr4}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="Sb"
              unit="g/l"
              value={wr5}
              set={setWr5}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="Sd"
              unit="g/l"
              value={wr6}
              set={setWr6}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />

            <View
              label="WR"
              unit="%"
              value={WR}
              formatScientific={formatScientific}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE 3 ================= */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Salt Rejections & Osmotic Pressure
        </h2>

        <div className="grid md:grid-cols-2 bg-white border border-gray-300 p-6 rounded-l shadow-lg">
          {/* ================= Column 1 ================= */}
          <div className="space-y-3 pl-6 pt-6 pr-1 pb-6">
            {/* ===== Section 1 ===== */}
            <Input
              label="SR"
              unit="%"
              value={sr1_a}
              set={setSr1_a}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="Sf"
              unit="g/l"
              value={sr1_b}
              set={setSr1_b}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />

            <View
              label="Sd"
              unit="g/l"
              value={
                sr1_a === "" || sr1_b === ""
                  ? "-"
                  : ((100 - Number(sr1_a)) * Number(sr1_b)) / 100
              }
              formatScientific={formatScientific}
            />

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* ===== Section 2 ===== */}
            <Input
              label="Sd"
              unit="g/l"
              value={sr2_a}
              set={setSr2_a}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="SR"
              unit="%"
              value={sr2_b}
              set={setSr2_b}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />

            <View
              label="Sf"
              unit="g/l"
              value={
                sr2_a === "" || sr2_b === ""
                  ? "-"
                  : (100 * Number(sr2_a)) / (100 - Number(sr2_b) || 0)
              }
              formatScientific={formatScientific}
            />
          </div>

          {/* ================= Column 2 ================= */}
          
          <div className="space-y-3 pr-6 pt-6 pl-1 pb-6">
            {/* ===== Section 1 ===== */}
            <Input
              label="Sf"
              unit="g/l"
              value={sr3_a}
              set={setSr3_a}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="Sd"
              unit="g/l"
              value={sr3_b}
              set={setSr3_b}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
{/* =100*(F66-F67)/F66 */}
            <View
              label="SR"
              unit="%"
              value={
                sr3_b === "" || sr3_a === ""
                  ? "-"
                  : (100 * (Number(sr3_a) - Number(sr3_b))) /
                    (Number(sr3_a) || 0)
              }
              formatScientific={formatScientific}
            />

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* ===== Section 2 (Osmotic Pressure) ===== */}
            <Input
              label="T"
              unit="°C"
              value={g28}
              set={setG28}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />
            <Input
              label="S"
              unit="g/l"
              value={g29}
              set={setG29}
              allow={allow}
              formatOnBlur={formatOnBlur}
            />

            <View
              label="π"
              unit="bar"
              value={
                g28 === "" || g29 === ""
                  ? "-"
                  : 0.00255 * (273 + Number(g28)) * Number(g29)
              }
              formatScientific={formatScientific}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== UI ===== */

function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0 border-gray-300">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, unit, value, set, allow, formatOnBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-green-50 rounded-l">
      <div className="flex justify-start" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_7[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
        onClick={(e) => e.target.select()}
        autoFocus={autoFocus}
        className="w-full max-w-[180px] text-center border border-gray-300 rounded p-1"
      />
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_7[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function View({ label, unit, value, formatScientific }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-l bg-gray-50">
      <div className="flex justify-start" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_7[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <span className="font-bold text-center">{formatScientific(value)}</span>
      <div className="flex justify-end" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_7[unit]}>
            <span className="cursor-help text-gray-600">{unit}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
