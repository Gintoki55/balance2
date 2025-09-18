"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/med.json";
import TopOptions from "@/components/TopOptions";
import DataTable from "@/components/stationValues";
import { StationValueData } from "@/data/infoData";
import TableComponent from "@/components/TableComponent";

export default function MEDPage() {
  const medButtons = [
    { href: "/medpage/media", label: "Media", icon: Play },
    { href: "/medpage/helper", label: "Helper", icon: Bot },
    { href: "/medpage/calculator", label: "Calculator", icon: Calculator },
  ];

  const [rowsCount, setRowsCount] = useState(1);

  return (
    <div className="bg-white min-h-screen">

      {/* الهيدر مع زر الرجوع */}
      <StationHeader title="MED Simulator" buttons={medButtons} />

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
           <Lottie animationData={animationData} loop={true} />
        </div>

      </div>
        <TopOptions station="MED"  />
        <div className="flex flex-col gap-2 justify-center items-center 
                transform 
                sm:scale-75 
                md:scale-85 
                lg:scale-90 
                xl:scale-95 
                2xl:scale-100 
                px-4">
  <DataTable
    stationName="MED Design"
    stationData={StationValueData}
    onJaChange={setRowsCount}
  />
  <TableComponent rowsCount={rowsCount} />
</div>

    </div>
  );
}
