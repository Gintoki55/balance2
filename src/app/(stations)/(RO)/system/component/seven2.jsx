"use client";

import Tooltip from "@/components/Tooltip";
import { useState } from "react";

const infoMap_WR = {
  "g/l": "gram per liter",
  "%": "percent",

  S0: "Raw water salinity [g/l]",
  Sb: "Brine water salinity [g/l]",
  Sd: "Product water salinity [g/l]",
  WR: "Percent water recovery [%]",
};

export default function WaterRecovery() {

  /* ===== Card 1 (Calculate Sb) ===== */
  const [waterRecoveryInput, setWaterRecoveryInput] = useState("");
  const [rawSalinityInput, setRawSalinityInput] = useState("");
  const [productSalinityInput, setProductSalinityInput] = useState("");

  /* ===== Card 2 (Calculate WR) ===== */
  const [rawSalinityCalc, setRawSalinityCalc] = useState("");
  const [brineSalinityCalc, setBrineSalinityCalc] = useState("");
  const [productSalinityCalc, setProductSalinityCalc] = useState("");

  const allow = (v, s) => /^-?\d*\.?\d*$/.test(v) && s(v);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatNumber = (num, digits = 6) => {
    if (num === "-" || num === "" || num === null || num === undefined)
      return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ===== Calculate WR from S0, Sb, Sd ===== */
  const WR =
    rawSalinityCalc && brineSalinityCalc && productSalinityCalc
      ? formatNumber(
          (100 * (Number(brineSalinityCalc) - Number(rawSalinityCalc))) /
            (Number(brineSalinityCalc) - Number(productSalinityCalc) || 1),
          4
        )
      : "-";

  return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Water Recovery
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== Card 1 ===== */}
        <Section>
          <RowInput
            label="WR"
            unit="%"
            value={waterRecoveryInput}
            set={setWaterRecoveryInput}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="S0"
            unit="g/l"
            value={rawSalinityInput}
            set={setRawSalinityInput}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="Sd"
            unit="g/l"
            value={productSalinityInput}
            set={setProductSalinityInput}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowView
            label="Sb"
            unit="g/l"
            value={
              waterRecoveryInput && rawSalinityInput && productSalinityInput
                ? formatNumber(
                    (100 * rawSalinityInput -
                      waterRecoveryInput * productSalinityInput) /
                      (100 - waterRecoveryInput || 1),
                    6
                  )
                : "-"
            }
          />
        </Section>

        {/* ===== Card 2 ===== */}
        <Section>
          <RowInput
            label="S0"
            unit="g/l"
            value={rawSalinityCalc}
            set={setRawSalinityCalc}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="Sb"
            unit="g/l"
            value={brineSalinityCalc}
            set={setBrineSalinityCalc}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowInput
            label="Sd"
            unit="g/l"
            value={productSalinityCalc}
            set={setProductSalinityCalc}
            allow={allow}
            formatOnBlur={formatOnBlur}
          />

          <RowView label="WR" unit="%" value={WR} />
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
      <Tooltip text={infoMap_WR[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <input
        value={value}
        onChange={(e) => allow(e.target.value, set)}
        onBlur={() => formatOnBlur(value, set)}
        onClick={(e) => e.target.select()}
        className="w-full text-center border border-gray-300 rounded p-1"
      />

      <Tooltip text={infoMap_WR[unit]}>
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
      <Tooltip text={infoMap_WR[label]}>
        <span className="cursor-help text-gray-600">{label}</span>
      </Tooltip>

      <span className="font-bold text-center">{value}</span>

      <Tooltip text={infoMap_WR[unit]}>
        <span className="cursor-help text-gray-600 flex justify-end">
          {unit}
        </span>
      </Tooltip>
    </div>
  );
}