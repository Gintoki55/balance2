"use client";
import StationHeader from "@/components/stationheader";
import Image from "next/image";
import { Play } from "lucide-react";

export default function RoPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen bg-hexagons">
      
      {/* الهيدر الجديد */}
      <StationHeader title="RO Simulator" />

      {/* المحتوى الرئيسي */}
      <div className="p-4 sm:p-6">

        {/* صورة المحاكاة */}
        <div className="flex justify-center mt-6">
          <Image
            src="/images/roa.png"
            alt="RO Simulation"
            width={1200}
            height={400}
            className="rounded-xl shadow-lg border border-gray-200"
          />
        </div>

        {/* الخيارات تحت الصورة */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          
          {/* MSF File */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">MSF File</label>
            <select className="px-3 py-2 border border-[#429988] rounded-md shadow-sm 
                               focus:outline-none focus:ring-2 focus:ring-[#429988] bg-white">
              <option>New Plant</option>
              <option>Existing Plant</option>
            </select>
          </div>

          {/* Stages */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">Stages</label>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-400 rounded-md shadow-sm 
                                 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <select className="px-3 py-2 border border-gray-400 rounded-md shadow-sm 
                                 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
          </div>

          {/* Scenario */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">Scenario</label>
            <select className="px-3 py-2 border border-blue-500 rounded-md shadow-sm 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Design</option>
              <option>Optimization</option>
              <option>Simulation</option>
            </select>
          </div>

          {/* Runs */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-700 mb-2">Runs</label>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-400 rounded-md shadow-sm 
                                 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white">
                <option>1</option>
                <option>55</option>
                <option>999</option>
              </select>
              <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white 
                                 rounded-md shadow hover:bg-blue-700 active:scale-95 transition">
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
