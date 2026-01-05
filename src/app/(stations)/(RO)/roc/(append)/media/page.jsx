"use client";
import StationHeader from "@/components/stationheader";

export default function MediaPage() {

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* الهيدر */}
      <StationHeader title="Media & Tutorials" isPopup/>

      {/* محتوى الصفحة المؤقت */}
      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
          This will be the Media page of ROC
        </h2>
      </main>
    </div>
  );
}
