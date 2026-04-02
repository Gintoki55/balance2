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
  const [g4, setG4] = useState("");
  const [g5, setG5] = useState("");
  const [g6, setG6] = useState("");

  const [wr1, setWr1] = useState("");
  const [wr2, setWr2] = useState("");
  const [wr3, setWr3] = useState("");

  const [wr4, setWr4] = useState("");
  const [wr5, setWr5] = useState("");
  const [wr6, setWr6] = useState("");

  const [sr1_a, setSr1_a] = useState("");
  const [sr1_b, setSr1_b] = useState("");
  const [sr2_a, setSr2_a] = useState("");
  const [sr2_b, setSr2_b] = useState("");
  const [sr3_a, setSr3_a] = useState("");
  const [sr3_b, setSr3_b] = useState("");

  const [g28, setG28] = useState("");
  const [g29, setG29] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  /* ===== Prevent Scientific Notation ===== */
  const formatNumber = (num, digits = 6) => {
    if (num === "-" || num === "" || num === null || num === undefined)
      return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ================= Calculations ================= */

const ppm = (() => {
  if (!g4 || !g5) return "-";

  const T = Number(g4);
  const EC = Number(g5);
  if (isNaN(T) || isNaN(EC)) return "-";

  const A = EC * (1 + 0.022 * (T - 25));

  const result =
    A *
    (0.5 +
      0.05 * (0.5 + (0.5 * Math.abs(A - 100)) / (A - 100.0001)) +
      0.1  * (0.5 + (0.5 * Math.abs(A - 1000)) / (A - 1000.0001)) +
      0.05 * (0.5 + (0.5 * Math.abs(A - 40000)) / (A - 40000.0001)) +
      0.05 * (0.5 + (0.5 * Math.abs(A - 60000)) / (A - 60000.0001)));

  return formatNumber(result, 4);
})();

  const WR =
    wr4 && wr5 && wr6
      ? formatNumber(
          (100 * (Number(wr5) - Number(wr4))) /
            (Number(wr5) - Number(wr6) || 1),
          4,
        )
      : "-";

  const PI =
    g28 && g29
      ? formatNumber(0.00255 * (273 + Number(g28)) * Number(g29), 4)
      : "-";

  return (
    <div className="max-w-7xl w-full space-y-10">
      {/* ===== TABLE 1 ===== */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Salinity Calculations
        </h2>

        <div className="grid md:grid-cols-2 bg-white border border-gray-300 shadow-lg gap-4">
          <div className="space-y-3 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4">
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
            <View label="S" unit="ppm" value={ppm} />
          </div>

          <div className="space-y-3 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4">
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
              value={g6 ? formatNumber(Number(g6) / 1000, 6) : "-"}
            />
            <View
              label="S"
              unit="%"
              value={g6 ? formatNumber(Number(g6) / 10000, 6) : "-"}
            />
          </div>
        </div>
      </div>

      {/* ===== TABLE 2 ===== */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Water Recovery</h2>

        <div className="grid md:grid-cols-2 bg-white border border-gray-300 shadow-lg gap-4">
          <div className="space-y-3 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4">
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
                wr1 && wr2 && wr3
                  ? formatNumber(
                      (100 * wr2 - wr1 * wr3) / (100 - wr1 || 1)
                    )
                  : "-"
              }
            />
          </div>

          <div className="space-y-3 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4">
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
            <View label="WR" unit="%" value={WR} />
          </div>
        </div>
      </div>

      {/* ===== TABLE 3 ===== */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Salt Rejections & Osmotic Pressure
        </h2>

        <div className="grid md:grid-cols-2 bg-white border border-gray-300 rounded-l shadow-lg gap-4">

          {/* ================= Column 1 ================= */}
          <div className="space-y-3 md:pl-6 md:pt-6 md:pr-1 md:pb-6 max-md:p-4">

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
                  : formatNumber(
                      ((100 - Number(sr1_a)) *
                        Number(sr1_b)) /
                        100,
                      6
                    )
              }
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
                  : formatNumber(
                      (100 * Number(sr2_a)) /
                        (100 - Number(sr2_b) || 1),
                      6
                    )
              }
            />
          </div>

          {/* ================= Column 2 ================= */}
          <div className="space-y-3 md:pr-6 md:pt-6 md:pl-1 md:pb-6 max-md:p-4">

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
            <View
              label="SR"
              unit="%"
              value={
                sr3_b === "" || sr3_a === ""
                  ? "-"
                  : formatNumber(
                      (100 *
                        (Number(sr3_a) -
                          Number(sr3_b))) /
                        (Number(sr3_a) || 1),
                      4
                    )
              }
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
              value={PI}
            />
          </div>

        </div>
      </div>

    </div>
  );
}

/* ===== UI ===== */

function Input({ label, unit, value, set, allow, formatOnBlur }) {
  return (
    <div className="grid grid-cols-3 items-center p-2 bg-green-50">
      <Tooltip text={infoMap_7[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
        onClick={(e) => e.target.select()}
        className="w-full text-center border border-gray-300 rounded p-1"
      />

      <Tooltip text={infoMap_7[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end ">{unit}</span>
      </Tooltip>
    </div>
  );
}

function View({ label, unit, value }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-50">
      <Tooltip text={infoMap_7[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <span className="font-bold text-center">{value}</span>

      <Tooltip text={infoMap_7[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">{unit}</span>
      </Tooltip>
    </div>
  );
}
