"use client";
/// update and check
import { useState } from "react";
import { Droplets, Info, Calculator, FlaskRound, DollarSign ,Thermometer} from "lucide-react";
import StationHeader from "@/components/stationheader";

import {One, Two, Three, Four, Five, Six, Seven,Eight , Nine, Ten, Elven, Twelve, Thirteen, Fourteen} from "./component/one";
import ROModules from "./component/ROmodules";
import ROWaterCost from "./component/ROWaterCost";
import MSFWaterCost from "./component/MSFWaterCost";
import MEDWaterCost from "./component/MEDWaterCost";
import MSHWaterCost from "./component/MSHWaterCost";
import MVCWaterCost from "./component/MVCWaterCost";
import WaterAnalysis from "./component/WaterAnalysis";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-gray-900">
      <StationHeader title="Calculator" isPopup />

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
              onClick={() => setActiveTab("ROModules")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "ROModules"
                  ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Droplets className="w-4 h-4" />
              RO Modules
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
          <Section><Five/></Section>
          <Section><Six /></Section> 
          <Section><Seven /></Section> 
          <Section><Eight /></Section>
          <Section><Nine /></Section>
          <Section><Ten /></Section>
          <Section><Elven /></Section>
          <Section><Twelve /></Section>
          <Section><Thirteen /></Section>
          <Section><Fourteen /></Section>
          {/* <Section><WaterPermeability /></Section>
          <Section><SaltPermeability /></Section>
           <Section><Ten /></Section>
           <Section><SpecificEnthalpy/></Section>
           <Section><Temperature/></Section>
           <Section><Thermal/></Section>
          <Section><Heat/></Section>  */}
        </div>

        {/* ===== Tab 2 ===== */}
        <div className={activeTab === "ROModules" ? "block" : "hidden"}>
          <ROModules />

        </div>
        {/* ===== Tab 3 ===== */}
        <div className={activeTab === "chemistry" ? "block" : "hidden"}>
          <WaterAnalysis/>
        </div>

        {/* ===== Tab 4 ===== */}
        <div className={activeTab === "cost" ? "block" : "hidden"}>
            <ROWaterCost/>
            <MSFWaterCost/>
            <MEDWaterCost/>
            <MSHWaterCost/>
            <MVCWaterCost/>


        </div>

      </div>
      </main>
    </div>
  );
}


function Section({ children }) {
  return <div className="space-y-6">{children}</div>;
}