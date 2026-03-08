"use client";

import { Droplets,Info } from "lucide-react";
import StationHeader from "@/components/stationheader";

import One from "../../../system/component/one";
import Two from "../../../system/component/two";
import Three from "../../../system/component/three";
import Four from "../../../system/component/four";
import WaterPermeability from "../../../system/component/WaterPermeability";
import SaltPermeability from "../../../system/component/SaltPermeability";
import WaterFlux from "../../../system/component/WaterFlux";
import SalinityCalculations from "../../../system/component/SalinityCalculations";
import WaterRecovery from "../../../system/component/WaterRecovery";
import SaltRejectionOsmotic from "../../../system/component/SaltRejectionOsmotic";
import Ten from "../../../system/component/ten3";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* ===== Header ===== */}
      <StationHeader title="RO Calculator" isPopup />

      {/* ===== Title + Description Section ===== */}
      <div className="bg-gradient-to-r from-sky-700 to-teal-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Droplets className="w-10 h-10" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              RO Calculator
            </h2>
            <p className="text-white/80 mt-1">
              Reverse Osmosis Desalination Engineering Calculator
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
       <div className="m-3 p-3 bg-gray-800 border border-gray-500 shadow-sm flex items-start gap-3 rounded-xl">
          <Info className="w-5 h-5 text-sky-600 shrink-0" />
          <p className="text-base text-gray-400">
            <strong>Tip:</strong> Hover over any symbol or unit to see its full description. 
            Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
          </p>
        </div>
      </div>

      {/* ===== Calculators ===== */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 font-[ui-monospace,SFMono-Regular,SF_Mono,Menlo,Monaco,Consolas]">
        <Section><One /></Section>
        <Section><Two /></Section>
        <Section><Three /></Section>
        <Section><Four /></Section>
        <Section><SalinityCalculations /></Section>
        <Section><SaltRejectionOsmotic /></Section>
        <Section><WaterRecovery /></Section>
        <Section><WaterFlux /></Section>
        <Section><WaterPermeability /></Section>
        <Section><SaltPermeability /></Section> 
        <Section><Ten /></Section>
      </div>
    </div>
  );
}

function Section({ children }) {
  return <div className="space-y-6">{children}</div>;
}