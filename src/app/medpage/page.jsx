"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import { ArrowLeft, Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/med.json";

import { runData, effectsData, scenarioData, MEDFile } from "@/data/allData";

export default function MEDPage() {
  const [medFile, setMedFile] = useState("");
  const [effects, setEffects] = useState("");
  const [scenario, setScenario] = useState("");
  const [runs, setRuns] = useState("");

  const isDisabled = !medFile; // تعطيل باقي الحقول إذا لم يتم اختيار MED File
  // أزرار خاصة بهذه الصفحة فقط
  const medButtons = [
    { href: "/medpage/media", label: "Media", icon: Play },
    { href: "/medpage/helper", label: "Helper", icon: Bot },
    { href: "/medpage/calculator", label: "Calculator", icon: Calculator },
  ];

  return (
    <div className="bg-[#F9FAFB] min-h-screen bg-hexagons">

      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="MED Simulator" buttons={medButtons} />

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
           <Lottie animationData={animationData} loop={true} />
        </div>

        {/* المستطيل الأبيض الذي يحتوي الخيارات */}
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          
          {/* MED File */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">MED File</label>
            <select
              value={medFile}
              onChange={(e) => setMedFile(e.target.value)}
              className="px-3 py-2 border border-[#429988] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#429988] bg-white text-black"
            >
                <option value="">--Select a File--</option>
              {MEDFile.map((MED, index) => (
                
                  <option key={index} value={MED}>
                    {MED}
                  </option>
                ))}
            </select>
          </div>

          {/* Effects */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">Effects</label>
            <select
              value={effects}
              onChange={(e) => setEffects(e.target.value)}
              disabled={isDisabled}
              className="px-3 py-2 border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {effectsData.map((effect, index) => (
                  <option key={index} value={effects}>
                    {effect}
                  </option>
                ))}
            </select>
          </div>

          {/* Scenario */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">Scenario</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={isDisabled}
              className="px-3 py-2 border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scenarioData.map((scenario, index) => (
                  <option key={index} value={scenario}>
                    {scenario}
                  </option>
              ))}
            </select>
          </div>

          {/* Runs */}
          <div className="flex flex-col items-center">
      <label className="text-sm font-semibold text-gray-700 mb-2">Runs</label>
      <div className="flex items-center gap-2">
        <select
          value={runs}
          onChange={(e) => setRuns(e.target.value)}
          disabled={isDisabled}
          className="px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {runData.map((run, index) => (
            <option key={index} value={run}>
              {run}
            </option>
          ))}
        </select>
        <button
          disabled={isDisabled}
          className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
        </button>
      </div>
    </div>

        </div>
      </div>
    </div>
  );
}
