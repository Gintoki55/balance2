"use client";
import { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/roa.json";
import { Play, Bot, Calculator } from "lucide-react";
import TopOptions from "@/components/TopOptions";
import { StationValueData } from "@/data/infoData";
import CombinedTables from "@/components/CombinedTables";
export default function RoPage() {
  // بدل ما يكون رقم فقط، صار object نخزن فيه القيم لكل محطة
  const [rowsCount, setRowsCount] = useState({});
  const [stationData, setStationData] = useState([]);

  // نعمل نسخة مستقلة من البيانات أول ما تفتح الصفحة
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

  const roaButtons = [
    { href: "/roapage/media", label: "Media", icon: Play },
    { href: "/roapage/helper", label: "Helper", icon: Bot },
    { href: "/roapage/calculator", label: "Calculator", icon: Calculator },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* الهيدر الجديد */}
      <StationHeader title="ROA Simulator" buttons={roaButtons} />

      {/* المحتوى الرئيسي */}
      <div>
        {/* صورة المحاكاة */}
        <div className="flex justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}
        <TopOptions station="ROA" />

         <div className="flex flex-col gap-4 justify-center items-center w-full overflow-x-auto">
        <CombinedTables
          stationName="ROA Design"
          stationData={stationData}
          onJaChange={(value) => handleJaChange("ROA", value)}
          secondTableRows={rowsCount["ROA"] || 1}
        />
      </div>
      </div>
    </div>
  );
}
