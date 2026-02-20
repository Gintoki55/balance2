"use client";

import { useState } from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
  "g/m².h.(g/l)": "Gram per square meter per hour per salinity gradient",
  "m/s": "Meter per second",
};

export default function SaltPermeability() {
  const [gval, setGval] = useState("");
  const [msval, setMsval] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const nG = gval === "" || gval === "-" ? null : Number(gval);
  const nMS = msval === "" || msval === "-" ? null : Number(msval);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold">Salt Permeability (X)</h2>

      <Section>
        <RowInput
          label="X"
          unit="g/m².h.(g/l)"
          value={gval}
          onChange={(e) => allowNumber(e.target.value, setGval)}
          onBlur={() => formatOnBlur(gval, setGval)}
        />
        <RowView
          label="X"
          value={nG === null ? "-" : (nG / (3600 * 1000)).toFixed(6)}
          unit="m/s"
        />
      </Section>

      <Section>
        <RowInput
          label="X"
          unit="m/s"
          value={msval}
          onChange={(e) => allowNumber(e.target.value, setMsval)}
          onBlur={() => formatOnBlur(msval, setMsval)}
        />
        <RowView
          label="X"
          value={nMS === null ? "-" : (nMS * (3600 * 1000)).toFixed(4)}
          unit="g/m².h.(g/l)"
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
      <span className="text-center font-bold">{value}</span>
      <div className="flex justify-end">
        <Tooltip text={infoMap[unit]}>
          <span className="cursor-help">{unit}</span>
        </Tooltip>
      </div>
    </div>
  );
}
