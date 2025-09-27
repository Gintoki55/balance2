"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/msf.json";
import TopOptions from "./components/topOptions";
import { StationValueData } from "./msfData";
import CombinedTables from "./components/CombinedTables";


export default function MSFpage() {
  const msfButtons = [
    { href: "/msf/media", label: "Media", icon: Play },
    { href: "/msf/helper", label: "Helper", icon: Bot },
    { href: "/msf/calculator", label: "Calculator", icon: Calculator },  
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
      <StationHeader title="MSF Simulator" buttons={msfButtons} />

      {/* المحتوى الرئيسي */}
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <TopOptions station="MSF" onOptionsChange={handleOptionsChange} />

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
