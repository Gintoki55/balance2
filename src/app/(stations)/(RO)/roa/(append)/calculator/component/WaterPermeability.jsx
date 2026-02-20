"use client";

import { useState } from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "m/s.bar": "Meter per second per bar",
};

export default function WaterPermeability() {
  const [lval, setLval] = useState("");
  const [msval, setMsval] = useState("");

  /* ===== Allow Only Numbers ===== */
  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  /* ===== Normal Format (for input blur or result) ===== */
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(String(num));
  };

  /* ===== Scientific Format ===== */
  const formatScientific = (num, decimals = 2) => {
    if (num === null || isNaN(num)) return "-";
    return num.toExponential(decimals).replace("e", "E");
  };

  const nL = lval === "" || lval === "-" ? null : Number(lval);
  const nMS = msval === "" || msval === "-" ? null : Number(msval);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold">Water Permeability (W)</h2>

      {/* ===== Section 1 ===== */}
      {/* Input → Normal | Result → Scientific */}
      <Section>
        <RowInput
          label="W"
          unit="l/m².h.bar"
          value={lval}
          onChange={(e) => allowNumber(e.target.value, setLval)}
          onBlur={() => formatOnBlur(lval, setLval)}
        />

        <RowView
          label="W"
          value={
            nL === null
              ? "-"
              : formatScientific(nL / (3600 * 1000))
          }
          unit="m/s.bar"
        />
      </Section>

      {/* ===== Section 2 ===== */}
      {/* Input → Scientific | Result → Normal */}
      <Section>
        <RowInput
          label="W"
          unit="m/s.bar"
          value={msval}
          onChange={(e) => allowNumber(e.target.value, setMsval)}
          onBlur={() =>
            msval !== "" &&
            setMsval(formatScientific(Number(msval)))
          }
        />

        <RowView
          label="W"
          value={
            nMS === null
              ? "-"
              : String((nMS + 0.00000000024) * (3600 * 1000))
          }
          unit="l/m².h.bar"
        />
      </Section>
    </div>
  );
}

/* ===== Helpers ===== */

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function RowInput({ label, unit, value, onChange, onBlur }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-xl bg-green-50">
      <span className="font-semibold">{label}</span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="text-center border rounded p-1"
        dir="ltr"
        inputMode="decimal"
      />

      <div className="flex justify-end">
        <Tooltip text={infoMap[unit]}>
          <span className="cursor-help">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}

function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-3 items-center p-3 rounded-xl bg-gray-50">
      <span className="font-semibold">{label}</span>

      <span className="text-center font-bold tracking-wide">
        {value}
      </span>

      <div className="flex justify-end">
        <Tooltip text={infoMap[unit]}>
          <span className="cursor-help">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}
