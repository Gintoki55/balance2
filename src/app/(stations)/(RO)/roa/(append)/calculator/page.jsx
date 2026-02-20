"use client";

import StationHeader from "@/components/stationheader";

import One from "./component/one";
import Two from "./component/two";
import Three from "./component/three";
import Four from "./component/four";
import Five from "./component/five";
import Six from "./component/six";
import Seven from "./component/seven";
import Eight from "./component/eight";
import Nine from "./component/nine";
import ROElementParameters from "./component/ten";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      <StationHeader title="Engineering Calculators" isPopup />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* ===== Calculator 1 ===== */}
        <Section title="Temperature Converter">
          <One />
        </Section>

        {/* ===== Calculator 2 ===== */}
        <Section title="Volume Converter">
          <Two />
        </Section>

        {/* ===== Calculator 3 ===== */}
        <Section title="Water Flow Converter">
          <Three />
        </Section>

        {/* ===== Calculator 4 ===== */}
        <Section title="Pressure Converter">
          <Four />
        </Section>

        {/* ===== Calculator 5 ===== */}
        {/* <Section title="Heat Converter">
          <Five />
        </Section> */}

        {/* ===== Calculator 6 ===== */}
        <Section title="RO Water & Salt Permeation">
          <Six />
        </Section>

        {/* ===== Calculator 7 ===== */}
        <Section title="Salinity Calculations">
          <Seven />
        </Section>

        {/* ===== Calculator 8 ===== */}
        {/* <Section title="RO Element Parameters">
          <Eight />
        </Section> */}

        {/* ===== Calculator 9 ===== */}
        {/* <Section title="RO Parameters (ΔP)">
          <Nine />
        </Section> */}

        <Section title="RO element parameters">
          <ROElementParameters/>
        </Section>

      </div>
    </div>
  );
}

/* ===== Wrapper Section ===== */
function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <div className="">
        {children}
      </div>
    </div>
  );
}
