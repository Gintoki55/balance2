"use client";
import React from "react";
import { useState } from "react";
import StationHeader from "@/components/stationheader";
import DataTable from "@/components/stationValues";
import { StationValueData } from "@/data/infoData";
export default function Dashboard() {
   const [rowsCount, setRowsCount] = useState(1);
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* الهيدر */}
      <StationHeader title="Dashboard"/>

      {/* محتوى الصفحة المؤقت */}
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col gap-6 justify-center items-center 
                        transform 
                        sm:scale-75 
                        md:scale-85 
                        lg:scale-90 
                        xl:scale-95 
                        2xl:scale-100 
                        px-4">
                    <DataTable stationName="MED Design" stationData={StationValueData} onJaChange={setRowsCount}/>
                    <DataTable stationName="MSF Design" stationData={StationValueData} onJaChange={setRowsCount}/>
                    <DataTable stationName="ROA Design" stationData={StationValueData} onJaChange={setRowsCount}/>
                    <DataTable stationName="MSF Design" stationData={StationValueData} onJaChange={setRowsCount}/>
                    <DataTable stationName="MED Design" stationData={StationValueData} onJaChange={setRowsCount}/>
                  </div>
      </main>
    </div>
  );
}


