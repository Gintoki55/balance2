"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/roa.json";
import TopOptions from "./components/topOptions";
import { StationValueData } from "./roData";
import CombinedTables from "./components/CombinedTables";


export default function RoPage() {
  const medButtons = [
    { href: "/ro/media", label: "Media", icon: Play },
    { href: "/ro/helper", label: "Helper", icon: Bot },
    { href: "/ro/calculator", label: "Calculator", icon: Calculator },  
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
      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="RO Simulator" buttons={medButtons} />

      {/* المحتوى الرئيسي */}
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <TopOptions station="ROA" 
        onOptionsChange={({ file, scenario, disabled }) => {
          setSelectedFile(file);
          setSelectedScenario(scenario);
          setIsDisabled(disabled);
        }}
      />

      {/* الجدولين مع تمكين scroll أفقي */}
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
