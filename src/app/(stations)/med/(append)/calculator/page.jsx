"use client";
import StationHeader from "@/components/stationheader";

export default function CalculatorPage() {

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* الهيدر */}
      <StationHeader title="Calculator" isPopup/>

      {/* محتوى الصفحة المؤقت */}
      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
          This will be the Calculator page of MED
        </h2>
      </main>
    </div>
  );
}