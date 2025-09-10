"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/med.json";

import { runData, effectsData, scenarioData, MEDFile } from "@/data/allData";
import StationValue from "@/components/stationValues";
import TopOptions from "@/components/TopOptions";
// import TableComponent from "@/components/TableComponent";

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
    <div className="bg-white min-h-screen">

      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="MED Simulator" buttons={medButtons} />

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
           <Lottie animationData={animationData} loop={true} />
        </div>

      </div>
      
      <TopOptions station="MED"  />
      <StationValue />
      {/* <TableComponent /> */}
    </div>
  );
}
