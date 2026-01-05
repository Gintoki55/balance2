"use client";
import { useSelector } from "react-redux";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import TopOptions from "./(append)/components/topOptions";
import CombinedTables from "./(append)/components/CombinedTables";
import Lottie from "lottie-react";
import animationData from "../../../../../public/animation/(RO)/roc.json";

export default function RoPage() {
  const { selectedFile } = useSelector((state) => state.roc);

  const isDisabled = !selectedFile || selectedFile === "select";

  const buttons = [
      { href: "/roc/media", label: "Media", icon: Play },
      { href: "/roc/helper", label: "Helper", icon: Bot },
      { href: "/roc/calculator", label: "Calculator", icon: Calculator },
    ];


  return (
    <div className="bg-white min-h-full">
      <StationHeader title="RO Simulator"buttons={buttons} />
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop />
      </div>

      <TopOptions  station="ROC"/>

      {!isDisabled && (
        <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
          <CombinedTables/>
        </div>
      )}
    </div>
  );
}
