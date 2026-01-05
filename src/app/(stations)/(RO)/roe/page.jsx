"use client";
import { useSelector } from "react-redux";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import TopOptions from "./(append)/components/topOptions";
import CombinedTables from "./(append)/components/CombinedTables";
import Lottie from "lottie-react";
import animationData from "../../../../../public/animation/(RO)/roe.json";

export default function RoPage() {
  const { selectedFile } = useSelector((state) => state.roe);

  const isDisabled = !selectedFile || selectedFile === "select";

  const buttons = [
      { href: "/roe/media", label: "Media", icon: Play },
      { href: "/roe/helper", label: "Helper", icon: Bot },
      { href: "/roe/calculator", label: "Calculator", icon: Calculator },
    ];


  return (
    <div className="bg-white min-h-full">
      <StationHeader title="RO Simulator"buttons={buttons} />
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop />
      </div>

      <TopOptions  station="ROE"/>

      {!isDisabled && (
        <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
          <CombinedTables/>
        </div>
      )}
    </div>
  );
}
