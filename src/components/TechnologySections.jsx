"use client";
import * as React from 'react';
import Link from "next/link"; // 👈 استدعاء Link من Next.js

// Main Section
export default function TechnologySections() {
  const sections = [
    {
      title: "MED – Multi-Effect Distillation",
      description:"A thermal desalination method that uses multiple stages of evaporation, where each effect reuses the energy from the previous one — efficient for low heat source.",
      badges: ['MED', 'MED-AB', 'MED-VC', 'MEDB', 'MEDF', 'MEDM','MEDX', 'MEDX_AB', 'MVC'],
      image: "/images/bb1.png",
      link: "/medpage", // 👈 رابط مخصص لأول زر
      paidLink:"premium"
    },
    {
      title: "MSF - Multi-Stage Flash",
      description: "A high-temperature process where heated seawater rapidly flashes’ into steam across multiple low-pressure chambers — ideal for integration of power and water production.",
      badges: ['MSF', 'MSFR','MSFX','MSFX-AB','MSH', 'MSH-AB',],
      image: "/images/b3.png",
      link: "/msfpage", // 👈 رابط مخصص لأول زر
      paidLink:"premium"
    },
     {
      title: "RO - Reverse Osmosis",
      description:
        "A membrane-based technique that pushes seawater through semipermeable membranes to remove salt and impurities — compact for stand alone plants.",
      badges: ['ROA', 'ROB', 'ROC', 'ROD','ROE','ROF','ROG',],
      image: "/images/b2.png",
      link: "/ropage", // 👈 رابط مخصص لأول زر
      paidLink:"premium"
    },
  ];

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
                if (index === 0) {
                  return (
                    <Link key={index} href={section.link}>
                      <button 
                        className="text-gray-900 border 
                                   px-2 py-1 text-md 
                                   sm:px-3 sm:py-1.5 sm:text-base 
                                   lg:px-4 lg:py-2 bg-gray-200
                                   rounded-md hover:border-[#528a87] hover:text-[#528a87] active:bg-[#528a87] active:text-white transition cursor-pointer"
                      >
                        {badge}
                      </button>
                    </Link>
                  );
                }
                return (
                  <Link key={index} href={section.paidLink}>
                    <button 
                      className="text-gray-900 border 
                                 px-2 py-1 text-md 
                                 sm:px-3 sm:py-1.5 sm:text-base 
                                 lg:px-4 lg:py-2 bg-gray-200
                                 rounded-md hover:border-[#528a87] hover:text-[#528a87] active:bg-[#528a87] active:text-white transition cursor-pointer"
                    >
                      {badge}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* الصورة */}
          <div
            className={`relative w-full lg:w-1/2 flex items-center ${
              idx === 1
                ? 'justify-start lg:justify-start px-6 lg:px-12'
                : 'justify-center'
            }`}
          >
            <img 
              className="w-full max-w-[500px] h-auto object-contain rounded-xl shadow-md"
              src={section.image} 
              alt={section.title} 
              loading='lazy'
            />
          </div>
        </section>
      ))}
    </div>
  );
}