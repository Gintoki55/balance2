"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import Image from "next/image";
import { ArrowLeft, Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/msf.json";

import { runData, stageData1,stageData2, scenarioData,MSFFile } from "@/data/allData";
export default function MsfPage() {
    const [msfFile, setMsfFile] = useState("");
    const [stage1, setStage1] = useState("");
    const [stage2, setStage2] = useState("");
    const [scenario, setScenario] = useState("");
    const [runs, setRuns] = useState("");

    const msfButtons = [
    { href: "/msfpage/media", label: "Media", icon: Play },
    { href: "/msfpage/helper", label: "Helper", icon: Bot },
    { href: "/msfpage/calculator", label: "Calculator", icon: Calculator },
  ];
  
    const isDisabled = !msfFile; // تعطيل باقي الحقول إذا لم يتم اختيار MED File
  return (
    <div className="bg-[#F9FAFB] min-h-screen bg-hexagons text-black">
      
      {/* الهيدر الجديد */}
      <StationHeader title="MSF Simulator" buttons={msfButtons}/>

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}

          
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                  
                  {/* MSF File */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-semibold text-gray-700 mb-2">MSF File</label>
                    <select
                      value={msfFile}
                      onChange={(e) => setMsfFile(e.target.value)}
                      className="px-3 py-2 border border-[#429988] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#429988] bg-white text-black"
                    >
                       <option value="">--Select a File--</option>
                       {MSFFile.map((MSF, index) => (
                          <option key={index} value={MSF}>
                            {MSF}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Stages */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-semibold text-gray-700 mb-2">Stages</label>
                    <div className="flex gap-2">
                      <select
                        value={stage1}
                        onChange={(e) => setStage1(e.target.value)}
                        disabled={isDisabled}
                        className="px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {stageData1.map((stage1, index) => (
                          <option key={index} value={stage1}>
                            {stage1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={stage2}
                        onChange={(e) => setStage2(e.target.value)}
                        disabled={isDisabled}
                        className="px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {stageData2.map((stage2, index) => (
                          <option key={index} value={stage2}>
                            {stage2}
                          </option>
                        ))}
                      </select>
                    </div>
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
