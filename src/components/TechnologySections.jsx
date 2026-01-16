"use client";
import * as React from "react";
import Link from "next/link";

// ✅ استيراد البيانات
import { sections, stationLinksData } from "../data/stationData";
import Tooltip from "@/components/Tooltip"; // 👈 استدعاء الكمبوننت

export default function TechnologySections() {
  return (
    <div className="bg-hexagons">
      {sections.map((section, idx) => (
        <section
          key={idx}
          className={`py-8 sm:py-12 lg:py-16 2xl:py-20 text-black flex flex-col lg:flex-row gap-8 ${
            idx % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* النص */}
          <div className="flex flex-col justify-center px-6 lg:px-12 2xl:px-20 w-full lg:w-1/2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4">
              <span className="text-[rgb(44,92,83)]">
                {section.title.split(" - ")[0]}
              </span>
              {" - "}
              {section.title.split(" - ")[1]}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-6 text-base sm:text-lg lg:text-xl 2xl:text-2xl">
              {section.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {section.badges.map((badge, index) => {
                // 🔍 البحث عن info من البيانات
                const info =
                  stationLinksData[section.key]?.find(
                    (item) => item.title.toLowerCase() === badge.toLowerCase()
                  )?.info || "No description available";

                  const item =
                    stationLinksData[section.key]?.find(
                      (i) => i.title.toLowerCase() === badge.toLowerCase()
                    );

                  const link = item?.link || section.paidLink;

                return (
                  <Tooltip key={index} text={info}>
                    <Link href={link}>
                      <button
                        className="text-gray-900 
                        border-2 border-gray-300
                        bg-gray-100 hover:bg-gray-200
                        px-2 py-1.5 text-sm
                        sm:px-3 sm:py-2 sm:text-sm
                        md:px-4 md:py-2 md:text-base
                        lg:px-5 lg:py-2.5 lg:text-lg
                        xl:px-6 xl:py-3 xl:text-lg
                        2xl:px-7 2xl:py-3.5 2xl:text-xl
                        rounded-lg 
                        hover:border-[#528a87] hover:text-[#528a87] hover:shadow-md
                        active:bg-[#528a87] active:text-white active:scale-95
                        transition-all duration-200 ease-in-out
                        cursor-pointer
                        font-medium
                        transform hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-[#528a87] focus:ring-opacity-50"
                      >
                        {badge.toUpperCase()}
                      </button>
                    </Link>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* الصورة */}
          <div className="relative w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-8 2xl:px-12">
            <img
              className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl h-auto object-cover shadow-md"
              src={section.image}
              alt={section.title}
              loading="lazy"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
