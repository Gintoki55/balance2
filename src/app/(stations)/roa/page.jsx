"use client";
import { useSelector, useDispatch } from "react-redux";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import TopOptions from "./(append)/components/topOptions";
import CombinedTables from "./(append)/components/CombinedTables";
import Lottie from "lottie-react";
import animationData from "../../../../public/animation/roa.json";

export default function RoPage() {
  const dispatch = useDispatch();
  const { selectedFile, selectedScenario, jValue, stationData } = useSelector((state) => state.station);

  const isDisabled = !selectedScenario || selectedScenario === "select";

  const buttons = [
      { href: "/roa/media", label: "Media", icon: Play },
      { href: "/roa/helper", label: "Helper", icon: Bot },
      { href: "/roa/calculator", label: "Calculator", icon: Calculator },
    ];

  return (
    <div className="bg-white min-h-full">
      <StationHeader title="RO Simulator"buttons={buttons} />
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop />
      </div>

      <TopOptions  station="ROA"/>

      {!isDisabled && (
        <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
          <CombinedTables
            stationName={selectedScenario}
            fileName={selectedFile}
            stationData={stationData[selectedScenario]}
            jValue={jValue}
            onJChange={(val) => dispatch({ type: "station/setJValue", payload: val })}
          />
        </div>
      )}
    </div>
  );
}
