"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/msf.json";
import CombinedTables from "@/components/CombinedTables";
import TopOptions from "@/components/TopOptions";
import { StationValueData } from "@/data/infoData";

export default function MsfPage() {
  const [rowsCount, setRowsCount] = useState({});
  const [stationData, setStationData] = useState([]);

  // نعمل نسخة مستقلة من البيانات الخاصة بـ MSF
  useEffect(() => {
    const clone = JSON.parse(JSON.stringify(StationValueData));
    setStationData(clone);
  }, []);

  const handleJaChange = (stationName, value) => {
    setRowsCount((prev) => ({
      ...prev,
      [stationName]: value, // نخزن قيمة Ja لهذه المحطة فقط
    }));
  };

  const msfButtons = [
    { href: "/msfpage/media", label: "Media", icon: Play },
    { href: "/msfpage/helper", label: "Helper", icon: Bot },
    { href: "/msfpage/calculator", label: "Calculator", icon: Calculator },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* الهيدر الجديد */}
      <StationHeader title="MSF Simulator" buttons={msfButtons} />

      {/* المحتوى الرئيسي */}
      <div>
        {/* صورة المحاكاة */}
        <div className="flex justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}
        <TopOptions station="MSF" />

      {/* الجدولين مع تمكين scroll أفقي */}
      <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
        <CombinedTables
          stationName="MSF Design"
          stationData={stationData}
          onJaChange={(value) => handleJaChange("MSF", value)}
          secondTableRows={rowsCount["MSF"] || 1}
        />
      </div>
      </div>
    </div>
  );
}
