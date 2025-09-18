"use client";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import Lottie from "lottie-react";
import animationData from "../../../public/animation/roa.json";
import {Play, Bot, Calculator } from "lucide-react";
import TopOptions from "@/components/TopOptions";
import { StationValueData } from "@/data/infoData";
import DataTable from "@/components/stationValues";
import TableComponent from "@/components/TableComponent";
export default function RoPage() {
    const [rowsCount, setRowsCount] = useState(1);
       const roaButtons = [
          { href: "/roapage/media", label: "Media", icon: Play },
          { href: "/roapage/helper", label: "Helper", icon: Bot },
          { href: "/roapage/calculator", label: "Calculator", icon: Calculator },
        ];
  return (
    <div className="bg-white min-h-screen">
      
      {/* الهيدر الجديد */}
      <StationHeader title="ROA Simulator" buttons={roaButtons}/>

      {/* المحتوى الرئيسي */}
      <div className="">

        {/* صورة المحاكاة */}
        <div className="flex justify-center">
         <Lottie animationData={animationData} loop={true} />
        </div>

        {/* الخيارات تحت الصورة */}
              {/* الخيارات تحت الصورة */}
            <TopOptions station="ROA"/>
          <div className="flex flex-col gap-2 justify-center items-center 
                transform 
                sm:scale-75 
                md:scale-85 
                lg:scale-90 
                xl:scale-95 
                2xl:scale-100 
                px-4">
            <DataTable stationName="ROA Design" stationData={StationValueData} onJaChange={setRowsCount}/>
            <TableComponent rowsCount={rowsCount}/>
          </div>
      </div>
    </div>
  );
}
