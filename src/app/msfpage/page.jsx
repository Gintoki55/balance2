"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import Image from "next/image";
import { ArrowLeft, Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/msf.json";

import { runData, stageData1,stageData2, scenarioData,MSFFile } from "@/data/allData";
import TopOptions from "@/components/TopOptions";
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

          
         <TopOptions station="MSF" />
        </div>
      </div>
  );
}
