// "use client";
import StationHeader from "@/components/stationheader";
import React from "react";

export default function Dashboard() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* الهيدر */}
      <StationHeader title="Dashboard"/>

      {/* محتوى الصفحة المؤقت */}
      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
          This will be the Dashboard
        </h2>
      </main>
    </div>
  );
}


