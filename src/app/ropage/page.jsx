"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import Image from "next/image";
import { Play } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/roa.json";
export default function RoPage() {
      const [roaFile, setRoaFile] = useState("");
      const [stage1, setStage1] = useState("");
      const [stage2, setStage2] = useState("");
      const [scenario, setScenario] = useState("");
      const [runs, setRuns] = useState("");
    
      const isDisabled = !roaFile; // تعطيل باقي الحقول إذا لم يتم اختيار roa File
  return (
    <div className="bg-[#F9FAFB] min-h-screen bg-hexagons">
      
      {/* الهيدر الجديد */}
      <StationHeader title="RO Simulator" />

      {/* المحتوى الرئيسي */}
      <div className="p-4 sm:p-6">

        {/* صورة المحاكاة */}
        <div className="flex justify-center mt-6">
         <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}
              {/* الخيارات تحت الصورة */}

          
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                  
                  {/* MED File */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-semibold text-gray-700 mb-2">ROA File</label>
                    <select
                      value={roaFile}
                      onChange={(e) => setRoaFile(e.target.value)}
                      className="px-3 py-2 border border-[#429988] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#429988] bg-white text-black"
                    >
                      <option value="">Select Project</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                      <option value="project3">Project 3</option>
                      <option value="project4">Project 4</option>
                      <option value="project5">Project 5</option>
                      <option value="project6">Project 6</option>
                      <option value="project7">Project 7</option>
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
                        <option value="">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                      <select
                        value={stage2}
                        onChange={(e) => setStage2(e.target.value)}
                        disabled={isDisabled}
                        className="px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
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
                      <option value="">Design</option>
                      <option value="Optimization">Optimization</option>
                      <option value="Simulation">Simulation</option>
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
                        <option value="">1</option>
                        <option value="55">55</option>
                        <option value="999">999</option>
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
