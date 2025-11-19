"use client";
import React from "react";
import StationHeader from "@/components/stationheader";

export default function About() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* Header */}
      <StationHeader title="About us" />

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-700 text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide">
          About Us
          </p>
        </div>
      </main>
    </div>
  );
}
