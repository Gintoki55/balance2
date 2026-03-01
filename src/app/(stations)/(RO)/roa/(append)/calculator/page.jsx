"use client";

import StationHeader from "@/components/stationheader";

import One from "../../../system/component/one";
import Two from "../../../system/component/two";
import Three from "../../../system/component/three";
import Four from "../../../system/component/four";
import Six from "../../../system/component/six";
import Seven from "../../../system/component/seven";
import ROElementParameters from "../../../system/component/ten";
import WaterPermeability from "../../../system/component/six1";
import SaltPermeability from "../../../system/component/six2";
import WaterFlux from "../../../system/component/six3";
import SalinityCalculations from "../../../system/component/seven1";
import WaterRecovery from "../../../system/component/seven2";
import SaltRejectionOsmotic from "../../../system/component/seven3";
import Ten from "../../../system/component/ten3";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      <StationHeader title="RO Calculator" isPopup />

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
          <WaterPermeability/>
        </Section>

        <Section title="RO Water & Salt Permeation">
          <SaltPermeability/>
        </Section>

        <Section title="RO Water & Salt Permeation">
          <WaterFlux/>
        </Section>

        {/* ===== Calculator 7 ===== */}
        {/* <Section title="Salinity Calculations">
          <Seven />
        </Section> */}

         <Section title="Salinity Calculations">
          <SalinityCalculations />
        </Section>


         <Section title="Salinity Calculations">
          <WaterRecovery />
        </Section>


         <Section title="Salinity Calculations">
          <SaltRejectionOsmotic />
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
         <Ten/>
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
