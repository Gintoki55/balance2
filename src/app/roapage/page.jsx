"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/roa.json";
import { ArrowLeft, Play, Bot, Calculator } from "lucide-react";
import { runData, scenarioDataRoa, elements, ROAFile } from "@/data/allData";
import TopOptions from "@/components/TopOptions";
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
      <StationHeader title="ROA Simulator" buttons={roaButtons}/>

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
         <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}
              {/* الخيارات تحت الصورة */}

          
        <TopOptions station="ROA"/>
      </div>
    </div>
  );
}
