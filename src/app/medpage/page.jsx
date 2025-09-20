"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/med.json";
import TopOptions from "@/components/TopOptions";
import { StationValueData } from "@/data/infoData";
import CombinedTables from "@/components/CombinedTables";

export default function MEDPage() {
  const medButtons = [
    { href: "/medpage/media", label: "Media", icon: Play },
    { href: "/medpage/helper", label: "Helper", icon: Bot },
    { href: "/medpage/calculator", label: "Calculator", icon: Calculator },
  ];

  const [rowsCount, setRowsCount] = useState({});
  const [stationData, setStationData] = useState([]);

  useEffect(() => {
    const clone = JSON.parse(JSON.stringify(StationValueData));
    setStationData(clone);
  }, []);

  const handleJaChange = (stationName, value) => {
    setRowsCount((prev) => ({
      ...prev,
      [stationName]: value,
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="MED Simulator" buttons={medButtons} />

      {/* المحتوى الرئيسي */}
      <div className="flex justify-center">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <TopOptions station="MED" />

      {/* الجدولين مع تمكين scroll أفقي */}
      <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
        <CombinedTables
          stationName="MED Design"
          stationData={stationData}
          onJaChange={(value) => handleJaChange("MED", value)}
          secondTableRows={rowsCount["MED"] || 1}
        />
      </div>
    </div>
  );
}
