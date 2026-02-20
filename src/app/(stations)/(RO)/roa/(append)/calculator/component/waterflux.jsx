"use client";

import { useState } from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
  gfd: "Gallon per square foot per day",
  lmh: "Liter per square meter per hour",
};

export default function WaterFlux() {
  const [gfd, setGfd] = useState("");
  const [lmh, setLmh] = useState("");

  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const num = Number(value);
    if (!isNaN(num)) setter(num.toFixed(4));
  };

  const nGfd = gfd === "" || gfd === "-" ? null : Number(gfd);
  const nLmh = lmh === "" || lmh === "-" ? null : Number(lmh);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold">Water Flux (M)</h2>

      <Section>
        <RowInput
          label="M"
          unit="gfd"
          value={gfd}
          onChange={(e) => allowNumber(e.target.value, setGfd)}
          onBlur={() => formatOnBlur(gfd, setGfd)}
        />
        <RowView
          label="M"
          value={nGfd === null ? "-" : ((nGfd * 3.785 * 10.76) / 24).toFixed(4)}
          unit="lmh"
        />
      </Section>

      <Section>
        <RowInput
          label="M"
          unit="lmh"
          value={lmh}
          onChange={(e) => allowNumber(e.target.value, setLmh)}
          onBlur={() => formatOnBlur(lmh, setLmh)}
        />
        <RowView
          label="M"
          value={nLmh === null ? "-" : ((nLmh * 24) / (3.785 * 10.76)).toFixed(4)}
          unit="gfd"
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
