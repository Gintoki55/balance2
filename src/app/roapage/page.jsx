"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/roa.json";
import { ArrowLeft, Play, Bot, Calculator } from "lucide-react";
import { runData, scenarioDataRoa, elements, ROAFile } from "@/data/allData";
export default function RoPage() {
      const [roaFile, setRoaFile] = useState("");
      const [element, setElement] = useState("");
      const [scenario, setScenario] = useState("");
      const [runs, setRuns] = useState("");
    
      const isDisabled = !roaFile; // تعطيل باقي الحقول إذا لم يتم اختيار roa File

       const roaButtons = [
          { href: "/roapage/media", label: "Media", icon: Play },
          { href: "/roapage/helper", label: "Helper", icon: Bot },
          { href: "/roapage/calculator", label: "Calculator", icon: Calculator },
        ];
  return (
    <div className="bg-[#F9FAFB] min-h-screen bg-hexagons">
      
      {/* الهيدر الجديد */}
      <StationHeader title="RO Simulator" buttons={roaButtons}/>

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
         <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}
              {/* الخيارات تحت الصورة */}

          
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                  
                  {/* ROA File */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-semibold text-gray-700 mb-2">ROA File</label>
                    <select
                      value={roaFile}
                      onChange={(e) => setRoaFile(e.target.value)}
                      className="px-3 py-2 border border-[#429988] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#429988] bg-white text-black"
                    >
                      <option value="">--Select a File--</option>
                      {ROAFile.map((ROA, index) => (
                          <option key={index} value={ROA}>
                            {ROA}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Elements */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-semibold text-gray-700 mb-2">Elements</label>
                    <select
                      value={element}
                      onChange={(e) => setElement(e.target.value)}
                      disabled={isDisabled}
                      className="px-3 py-2 border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-                      blue-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {elements.map((element, index) => (
                          <option key={index} value={element}>
                            {element}
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
                    {scenarioDataRoa.map((scenario, index) => (
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
