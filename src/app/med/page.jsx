"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/med.json";
import TopOptions from "@/components/TopOptions";
import { StationValueData } from "./medData";
import CombinedTables from "./components/CombinedTables";


export default function MEDPage() {
  const medButtons = [
    { href: "/med/media", label: "Media", icon: Play },
    { href: "/med/helper", label: "Helper", icon: Bot },
    { href: "/med/calculator", label: "Calculator", icon: Calculator },  
  ];
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState("");

  // هنا نستقبل القيم من TopOptions
  const handleOptionsChange = ({ scenario, disabled }) => {
    setSelectedScenario(scenario);
    setIsDisabled(disabled);
  };

  const [stationData, setStationData] = useState([]);

  useEffect(() => {
    const clone = JSON.parse(JSON.stringify(StationValueData));
    setStationData(clone);
  }, []);


  return (
    <div className="bg-white min-h-full">
      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="MED Simulator" buttons={medButtons} />

      {/* المحتوى الرئيسي */}
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <TopOptions station="MED" onOptionsChange={handleOptionsChange} />

      {/* الجدولين مع تمكين scroll أفقي */}
       {!isDisabled && selectedScenario && selectedScenario !== "select" &&(
        <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
                <CombinedTables
                  stationName={selectedScenario}
                  stationData={stationData[selectedScenario]}
                />
              </div>
       )}
    </div>
  );
}
