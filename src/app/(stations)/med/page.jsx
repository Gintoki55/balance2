"use client";
import { useSelector } from "react-redux";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../../public/animation/med.json";
import TopOptions from "./(append)/components/topOptions";
import CombinedTables from "./(append)/components/CombinedTables";

export default function MEDPage() {
  const { selectedFile} = useSelector((state) => state.med);
  const isDisabled = !selectedFile || selectedFile === "select";
  const buttons = [
    { href: "/med/media", label: "Media", icon: Play },
    { href: "/med/helper", label: "Helper", icon: Bot },
    { href: "/med/calculator", label: "Calculator", icon: Calculator },
  ];


  return (
    <div className="bg-white min-h-full">
      <StationHeader title="MED Simulator" buttons={buttons} />

      <div className="flex justify-center">
        <Lottie animationData={animationData} loop />
      </div>

      <TopOptions station="MED"/>

      {/* الجدولين مع تمكين scroll أفقي */}
       {!isDisabled && (
          <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
            <CombinedTables/>
           </div>
      )}
    </div>
  );
}
