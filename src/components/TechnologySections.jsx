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
          className={`py-8 sm:py-12 lg:py-16 text-black flex flex-col lg:flex-row gap-8 ${
            idx % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* النص */}
          <div className="flex flex-col justify-center px-6 lg:px-12 w-full lg:w-1/2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {section.title}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              {section.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {section.badges.map((badge, index) => {
                // 🔍 البحث عن info من البيانات
                const info =
                  stationLinksData[section.key]?.find(
                    (item) => item.title.toLowerCase() === badge.toLowerCase()
                  )?.info || "No description available";

                return (
                  <Tooltip key={index} text={info}>
                    <Link href={index === 0 ? section.link : section.paidLink}>
                      <button
                        className="text-gray-900 border 
                                   px-2 py-1 text-md 
                                   sm:px-3 sm:py-1.5 sm:text-base 
                                   lg:px-4 lg:py-2 bg-gray-200
                                   rounded-md hover:border-[#528a87] hover:text-[#528a87] 
                                   active:bg-[#528a87] active:text-white transition cursor-pointer"
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
          <div
            className={`relative w-full lg:w-1/2 flex items-center ${
              idx === 1
                ? "justify-start lg:justify-start px-6 lg:px-12"
                : "justify-center"
            }`}
          >
            <img
              className="w-full max-w-[500px] h-auto object-contain rounded-xl shadow-md"
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
