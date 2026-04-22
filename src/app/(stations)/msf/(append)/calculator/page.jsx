"use client";
/// update and check 11
import { useState } from "react";
import { Droplets, Info, Calculator, FlaskRound, DollarSign ,Thermometer, AirVent} from "lucide-react";
import StationHeader from "@/components/stationheader";

import {One, Two, Three, Four, Five, Six, Seven,Eight , Nine, Ten, Elven, Twelve, Ten_s} from "./component/converter";
import { Thirteen, Fourteen } from "./component/Exchanger";

import ROModulesContainer from "./component/ROComponent";
import WaterAnalysis from "./component/chemistry";
import { MEDWaterCost, MSFWaterCost, MSHWaterCost, MVCWaterCost, ROWaterCost } from "./component/cost";

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
<main className="container max-w-7xl mx-auto py-4 px-6">

  {/* ===== Tabs Navigation ===== */}
  <div className="sticky top-12 z-50 bg-gray-900/95 backdrop-blur-sm py-2">
    <div className="flex gap-1 p-1 bg-gray-800/60 rounded-xl border border-gray-700">

      {/* General */}
      <button
      type="button"
        onClick={() => setActiveTab("general")}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
          activeTab === "general"
            ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <Calculator className="w-4 h-4" />
        Converter
      </button>

      {/* Exchanger (NEW) */}
      <button
      type="button"
        onClick={() => setActiveTab("exchanger")}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
          activeTab === "exchanger"
            ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <AirVent className="w-4 h-4" />
        Exchanger
      </button>

      {/* RO Modules */}
      <button
      type="button"
        onClick={() => setActiveTab("ROModules")}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
          activeTab === "ROModules"
            ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <Droplets className="w-4 h-4" />
        RO Modules
      </button>

      {/* Chemistry */}
      <button
      type="button"
        onClick={() => setActiveTab("chemistry")}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
          activeTab === "chemistry"
            ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <FlaskRound className="w-4 h-4" />
        Analysis
      </button>

      {/* Cost */}
      <button
      type="button"
        onClick={() => setActiveTab("cost")}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
          activeTab === "cost"
            ? "bg-sky-600 text-white shadow-lg scale-[1.02]"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <DollarSign className="w-4 h-4" />
        Cost
      </button>

    </div>
  </div>

  <div className="space-y-10 font-mono">

    {/* ===== GENERAL ===== */}
    {activeTab === "general" && (
      <>
        <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex gap-2">
          <Info className="w-4 h-4 text-sky-500" />
          <p className="text-xs text-gray-400">
           <strong>Tip:</strong> Hover over any symbol or unit to see its full description. Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
          </p>
        </div>

        <Section><One /></Section>
        <Section><Two /></Section>
        <Section><Three /></Section>
        <Section><Four /></Section>
        <Section><Five /></Section>
        <Section><Six /></Section>
        <Section><Seven /></Section>
        <Section><Eight /></Section>
        <Section><Nine /></Section>
        <Section><Ten /></Section>
        <Section><Ten_s /></Section>
        <Section><Elven /></Section>
        <Section><Twelve /></Section>
      </>
    )}

    {/* ===== EXCHANGER (NEW - EMPTY) ===== */}
    {activeTab === "exchanger" && (
      <>
        <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex gap-2">
          <Info className="w-4 h-4 text-sky-500" />
          <p className="text-xs text-gray-400">
            <strong>Tip:</strong> Heat exchanger calculations and thermal property conversions.
          </p>
        </div>

        <Section><Thirteen /></Section>
        <Section><Fourteen /></Section>
      </>
    )}

    {/* ===== RO MODULES ===== */}
    {activeTab === "ROModules" && (
      <>
        <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex gap-2">
          <Info className="w-4 h-4 text-sky-500" />
          <p className="text-xs text-gray-400">
           <strong>Tip:</strong> RO Module Parameters - 12 independent module calculators.
          </p>
        </div>

        {/* <ROModules /> */}
        <ROModulesContainer />
      </>
    )}

    {/* ===== CHEMISTRY ===== */}
    {activeTab === "chemistry" && (
      <>
        <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex gap-2">
          <Info className="w-4 h-4 text-sky-500" />
          <p className="text-xs text-gray-400">
            Water analysis tools.
          </p>
        </div>

        <WaterAnalysis />
      </>
    )}

    {/* ===== COST ===== */}
    {activeTab === "cost" && (
      <>
        <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg flex gap-2">
          <Info className="w-4 h-4 text-sky-500" />
          <p className="text-xs text-gray-400">
            Water cost calculations.
          </p>
        </div>

        <ROWaterCost/>
        <MEDWaterCost/>
        <MSFWaterCost/>
        <MVCWaterCost/>
        <MSHWaterCost/>
      </>
    )}

  </div>
</main>
    </div>
  );
}

function Section({ children }) {
  return <div className="space-y-6">{children}</div>;
}