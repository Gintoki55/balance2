"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../../public/animation/med.json";
import TopOptions from "./(append)/components/topOptions";
import { StationValueData } from "./(data)/medData";
import CombinedTables from "./(append)/components/CombinedTables";

export default function MEDPage() {
  const buttons = [
    { href: "/med/media", label: "Media", icon: Play },
    { href: "/med/helper", label: "Helper", icon: Bot },
    { href: "/med/calculator", label: "Calculator", icon: Calculator },
  ];

  const [selectedFile, setSelectedFile] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [stationData, setStationData] = useState([]);

  useEffect(() => {
    // نسخ البيانات لتجنب تعديل الأصل
    setStationData(JSON.parse(JSON.stringify(StationValueData)));
  }, []);

  return (
    <div className="bg-white min-h-full">
      <StationHeader title="MED Simulator" buttons={buttons} />

      <div className="flex justify-center">
        <Lottie animationData={animationData} loop />
      </div>

      <TopOptions
        station="MED"
        onOptionsChange={({ file, scenario, disabled }) => {
          setSelectedFile(file);
          setSelectedScenario(scenario);
          setIsDisabled(disabled);
        }}
      />

      {selectedScenario && !isDisabled && selectedScenario !== "select" && (
        <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
          <CombinedTables
            stationName={selectedScenario}
            fileName={selectedFile}
            stationData={stationData[selectedScenario]}
          />
        </div>
      )}
    </div>
  );
}
