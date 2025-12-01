"use client";
import { useSelector } from "react-redux";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../../public/animation/msf.json";
import TopOptions from "./(append)/components/topOptions";
import CombinedTables from "./(append)/components/CombinedTables";


export default function MSFpage() {
  const { selectedFile } = useSelector((state) => state.msf);
  const isDisabled = !selectedFile || selectedFile === "select";
  const msfButtons = [
    { href: "/msf/media", label: "Media", icon: Play },
    { href: "/msf/helper", label: "Helper", icon: Bot },
    { href: "/msf/calculator", label: "Calculator", icon: Calculator },  
  ];

  return (
    <div className="bg-white min-h-full">
      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="MSF Simulator" buttons={msfButtons} />

      {/* المحتوى الرئيسي */}
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop />
      </div>

      <TopOptions station="MSF" />

      {/* الجدولين مع تمكين scroll أفقي */}
       {!isDisabled && (
              <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
                <CombinedTables/>
              </div>
      )}
    </div>
  );
}
