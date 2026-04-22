"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { SectionHeader, InputRow, OutputRow } from "@/components/ui";

export function ECConverter() {
  const [T, setT] = useState(30);
  const [EC, setEC] = useState(6000);
  const a = EC * (1 + 0.022 * (25 - T));
  const S =
    a *
    (0.5 +
      0.05 * (0.5 + (0.5 * Math.abs(a - 100)) / (a - 100.0001)) +
      0.1 * (0.5 + (0.5 * Math.abs(a - 1e3)) / (a - 1000.0001)) +
      0.05 * (0.5 + (0.5 * Math.abs(a - 4e4)) / (a - 40000.0001)) +
      0.05 * (0.5 + (0.5 * Math.abs(a - 6e4)) / (a - 60000.0001)));
  return (
    <div className="converter-card">
      <SectionHeader title="Electrical Conductivity Converter" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={T} onChange={setT} unit="°C" symbolTip="Water temperature" unitTip="Celsius" />
        <InputRow symbol="EC" value={EC} onChange={setEC} unit="µS/cm" symbolTip="Electrical conductivity" unitTip="MicroSiemens per centimeter" />
        <OutputRow symbol="S" value={S} unit="ppm" symbolTip="Salinity (TDS)" unitTip="Parts per million" />
      </div>
    </div>
  );
}

export function SalinityConverter() {
  const [v, set] = useState(35000);
  return (
    <div className="converter-card">
      <SectionHeader title="Salinity Convertor" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="S" value={v} onChange={set} unit="ppm" symbolTip="Salinity" unitTip="Parts per million" />
        <OutputRow symbol="S" value={v / 1000} unit="g/l" symbolTip="Salinity" unitTip="Grams per liter" />
        <OutputRow symbol="S" value={v / 10000} unit="%" symbolTip="Salinity" unitTip="Percent" />
      </div>
    </div>
  );
}

export function OsmoticPressure() {
  const [T, setT] = useState(30);
  const [S, setS] = useState(50);
  const pi = 0.00255 * (273 + T) * S;
  return (
    <div className="converter-card">
      <SectionHeader title="Osmotic Pressure" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={T} onChange={setT} unit="°C" symbolTip="Water temperature" unitTip="Celsius" />
        <InputRow symbol="S" value={S} onChange={setS} unit="g/l" symbolTip="Salinity" unitTip="Grams per liter" />
        <OutputRow symbol="π" value={pi} unit="bar" symbolTip="Osmotic pressure" unitTip="Bar" />
      </div>
    </div>
  );
}

export function SaltRejection() {
  const [Sf, setSf] = useState(65);
  const [Sd, setSd] = useState(0.2);
  const SR = 100 * (Sf - Sd) / Sf;
  return (
    <div className="converter-card">
      <SectionHeader title="Salt Rejection" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
        <OutputRow symbol="SR" value={SR} unit="%" symbolTip="Salt rejection" unitTip="Percent" />
      </div>
    </div>
  );
}

export function WaterRecovery() {
  const [S0, setS0] = useState(40);
  const [Sb, setSb] = useState(65);
  const [Sd, setSd] = useState(0.2);
  const WR = 100 * (Sb - S0) / (Sb - Sd);
  return (
    <div className="converter-card">
      <SectionHeader title="Water Recovery" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sb" value={Sb} onChange={setSb} unit="g/l" symbolTip="Brine salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
        <OutputRow symbol="WR" value={WR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
      </div>
    </div>
  );
}

export function BrineSalinity() {
  const [WR, setWR] = useState(38.58);
  const [S0, setS0] = useState(40);
  const [Sd, setSd] = useState(0.2);
  const Sb = (100 * S0 - WR * Sd) / (100 - WR);
  return (
    <div className="converter-card">
      <SectionHeader title="Brine Salinity" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="WR" value={WR} onChange={setWR} unit="%" symbolTip="Water recovery" unitTip="Percent" />
        <InputRow symbol="S0" value={S0} onChange={setS0} unit="g/l" symbolTip="Feed salinity" unitTip="Grams per liter" />
        <InputRow symbol="Sd" value={Sd} onChange={setSd} unit="g/l" symbolTip="Product salinity" unitTip="Grams per liter" />
        <OutputRow symbol="Sb" value={Sb} unit="g/l" symbolTip="Brine salinity" unitTip="Grams per liter" />
      </div>
    </div>
  );
}
