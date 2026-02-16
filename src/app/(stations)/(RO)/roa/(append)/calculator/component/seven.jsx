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
  /* ================= EC → Salinity ================= */
  const [g4, setG4] = useState("");
  const [g5, setG5] = useState("");

  /* ================= Salinity Convertor ================= */
  const [g8, setG8] = useState("");

  /* ================= Water Recovery ================= */
  const [g13, setG13] = useState("");
  const [g14, setG14] = useState("");
  const [g15, setG15] = useState("");

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
  const fmt = (v, s) => {
    if (v === "" || v === "-") return;
    const n = Number(v);
    if (!isNaN(n)) s(n.toFixed(4));
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
    g13 && g14 && g15
      ? (
          (100 * (Number(g14) - Number(g13))) /
          (Number(g14) - Number(g15) || 1)
        ).toFixed(4)
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
    <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Salinity Calculations
      </h2>

      <Section title="Electrical conductivity convertor">
        <Input
          label="T"
          unit="°C"
          value={g4}
          set={setG4}
          allow={allow}
          fmt={fmt}
          autoFocus
        />
        <Input
          label="EC"
          unit="µs/cm"
          value={g5}
          set={setG5}
          allow={allow}
          fmt={fmt}
        />
        <View label="S" unit="ppm" value={ppm} />
      </Section>

      <Section title="Salinity Convertor">
        <Input
          label="S"
          unit="ppm"
          value={g8}
          set={setG8}
          allow={allow}
          fmt={fmt}
        />
        <View label="S" unit="mg/l" value={g8 || "-"} />
        <View
          label="S"
          unit="g/l"
          value={g8 ? (Number(g8) / 1000).toFixed(4) : "-"}
        />
        <View
          label="S"
          unit="%"
          value={g8 ? (Number(g8) / 10000).toFixed(4) : "-"}
        />
      </Section>

      <Section title="Water Recovery">
        <Input
          label="S0"
          unit="g/l"
          value={g13}
          set={setG13}
          allow={allow}
          fmt={fmt}
        />
        <Input
          label="Sb"
          unit="g/l"
          value={g14}
          set={setG14}
          allow={allow}
          fmt={fmt}
        />
        <Input
          label="Sd"
          unit="g/l"
          value={g15}
          set={setG15}
          allow={allow}
          fmt={fmt}
        />
        <View label="WR" unit="%" value={WR} />
      </Section>

      <Section title="Salt Rejection SR">
        <Input
          label="Sf"
          unit="g/l"
          value={g18}
          set={setG18}
          allow={allow}
          fmt={fmt}
        />
        <Input
          label="Sd"
          unit="g/l"
          value={g19}
          set={setG19}
          allow={allow}
          fmt={fmt}
        />
        <View label="SR" unit="%" value={SR} />
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <Input
          label="SR"
          unit="%"
          value={g21}
          set={setG21}
          allow={allow}
          fmt={fmt}
        />
        <Input
          label="Sf"
          unit="g/l"
          value={g22}
          set={setG22}
          allow={allow}
          fmt={fmt}
        />
        <View label="Sd" unit="g/l" value={Sd_from_SR} />
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <Input
          label="Sd"
          unit="g/l"
          value={g24}
          set={setG24}
          allow={allow}
          fmt={fmt}
        />
        <Input
          label="SR"
          unit="%"
          value={g25}
          set={setG25}
          allow={allow}
          fmt={fmt}
        />
        <View label="Sf" unit="g/l" value={Sf_from_SR} />
      </Section>

      <Section title="Osmotic pressure of saline water">
        <Input
          label="T"
          unit="°C"
          value={g28}
          set={setG28}
          allow={allow}
          fmt={fmt}
        />
        <Input
          label="S"
          unit="g/l"
          value={g29}
          set={setG29}
          allow={allow}
          fmt={fmt}
        />
        <View label="π" unit="bar" value={PI} />
      </Section>
    </div>
  );
}

/* ===== UI ===== */

function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, unit, value, set, allow, fmt, autoFocus }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-green-50 rounded-xl">
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
        onBlur={() => fmt(value, set)}
        onClick={(e) => e.target.select()}
        autoFocus={autoFocus}
        className="border rounded p-1 text-center"
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

function View({ label, unit, value }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-50 rounded-xl">
      <div className="flex justify-start" dir="ltr">
        <div className="inline-flex">
          <Tooltip text={infoMap_7[label]}>
            <span className="cursor-help text-gray-600">{label}</span>
          </Tooltip>
        </div>
      </div>
      <span className="font-bold text-center">{value}</span>
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
