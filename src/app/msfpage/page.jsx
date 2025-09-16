"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import { Play, Bot, Calculator } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/msf.json";
import TableComponent from "@/components/TableComponent";

import TopOptions from "@/components/TopOptions";
import { StationValueData } from "@/data/infoData";
import DataTable from "@/components/stationValues";
export default function MsfPage() {
    const [rowsCount, setRowsCount] = useState(1);

    const msfButtons = [
    { href: "/msfpage/media", label: "Media", icon: Play },
    { href: "/msfpage/helper", label: "Helper", icon: Bot },
    { href: "/msfpage/calculator", label: "Calculator", icon: Calculator },
  ];
  
  return (
    <div className="bg-white min-h-screen">
      
      {/* الهيدر الجديد */}
      <StationHeader title="MSF Simulator" buttons={msfButtons}/>

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}

          
         <TopOptions station="MSF" />
         <DataTable stationName="MSF Design" stationData={StationValueData} onJaChange={setRowsCount}/>
          <TableComponent rowsCount={rowsCount}/>
        </div>
      </div>
  );
}
