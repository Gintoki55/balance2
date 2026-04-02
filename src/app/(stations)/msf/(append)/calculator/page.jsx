"use client";

import { useState } from "react";
import { Droplets, Info, Calculator, FlaskRound, DollarSign } from "lucide-react";
import StationHeader from "@/components/stationheader";

import One from "./component/one";
import Two from "./component/two";
import Three from "./component/three";
import Four from "./component/four";
import WaterPermeability from "./component/WaterPermeability";
import SaltPermeability from "./component/SaltPermeability";
import WaterFlux from "./component/WaterFlux";
import SalinityCalculations from "./component/SalinityCalculations";
import WaterRecovery from "./component/WaterRecovery";
import SaltRejectionOsmotic from "./component/SaltRejectionOsmotic";
import Ten from "./component/ten3";
import HeatConvertor from "./component/HeatConverter";
import SpecificEnthalpy from "./component/SpecificEnthalpy";
import Temperature from "./component/Temperature";
import Thermal from "./component/Thermal";
import Heat from "./component/Heat";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-gray-900">
      <StationHeader title="RO Calculator" isPopup />

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 to-teal-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Droplets className="w-10 h-10" />
          <div>
            <h2 className="text-2xl font-bold">BDS Calculator</h2>
            <p className="text-white/80">
              Balance Desalination Simulator
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <main className="container max-w-7xl mx-auto py-4 px-3">
        

        {/* ===== Tabs Navigation ===== */}
        <div className="mb-6 sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm py-2">
          <div className="flex gap-2 p-1.5 bg-gray-800/60 rounded-xl border border-gray-700">

          

            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "general"
                  ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Calculator className="w-4 h-4" />
              BDS Convertor
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("chemistry")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "chemistry"
                  ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <FlaskRound className="w-4 h-4" />
              Water Analysis
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cost")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "cost"
                  ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Water Cost
            </button>

          </div>
        </div>

         {/* ===== Tip ===== */}
      <div className="max-w-4xl mx-auto">
        <div className="m-3 p-3 bg-gray-800 border border-gray-500 shadow-sm flex items-start gap-3 rounded-xl">
          <Info className="w-5 h-5 text-sky-600 shrink-0" />
          <p className="text-base text-gray-400">
            <strong>Tip:</strong> Hover over any symbol or unit to see its full description.
            Yellow fields are inputs, blue fields are outputs.
          </p>
        </div>
      </div>

       <div className="space-y-12 font-mono">

        {/* ===== Tab 1 ===== */}
        <div className={activeTab === "general" ? "block" : "hidden"}>
          <Section><One /></Section>
          <Section><Two /></Section>
          <Section><Three /></Section>
          <Section><Four /></Section>
          <Section><HeatConvertor/></Section>
          <Section><SalinityCalculations /></Section>
          <Section><WaterRecovery /></Section>
          <Section><WaterFlux /></Section>
          <Section><WaterPermeability /></Section>
          <Section><SaltPermeability /></Section>
           <Section><Ten /></Section>
           <Section><SpecificEnthalpy/></Section>
           <Section><Temperature/></Section>
           <Section><Thermal/></Section>
           <Section><Heat/></Section>
        </div>

        {/* ===== Tab 2 ===== */}
        <div className={activeTab === "chemistry" ? "block" : "hidden"}>
          {/* <Section><SalinityCalculations /></Section>
          <Section><SaltRejectionOsmotic /></Section>
          <Section><WaterRecovery /></Section>
          <Section><WaterFlux /></Section> */}
        </div>

        {/* ===== Tab 3 ===== */}
        <div className={activeTab === "cost" ? "block" : "hidden"}>
          {/* <Section><WaterPermeability /></Section>
          <Section><SaltPermeability /></Section>
          <Section><Ten /></Section> */}
        </div>

      </div>
      </main>
    </div>
  );
}


function Section({ children }) {
  return <div className="space-y-6">{children}</div>;
}