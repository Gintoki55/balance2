"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
"j": "Element number in the pressure vessel",
"Pbj" : "Brine pressure Pbj [bar],which is constrained: Pbj < max",
"Δπj": "Transmembrane osmotic pressure Δπj [bar]",
"Balance": "Pressure balance across the membrane",
"∆Pj": "Net driving pressure ∆Pj [bar]",
"mj": "Permeate flux mj [l/m².h],which is constrained: lmh < max",
"Mdj": "Accumulating permeate Mdj [t/h]",
"Mbj": "Leaving brine Mbj [t/h],which is constrained: min < Mbj < max",
"Sbj": "Bulk brine salinity Sbj [g/l],which is constrained: Sbj <99",
"ΔSj": "Salinity gradient acros the membrane ΔSj [g/l]",
"Sj": "Salinity at the permeate envelope Sj [g/l]",
'Sdj': "Salinity at the product tube Sdj [g/l]",
};


const ROASecondTable= ({ JValues }) => {
  const headersSecond = [
    "j", "Pbj", "Δπj", "Balance", "∆Pj", "mj",
    "Mdj", "Mbj", "Sbj", "ΔSj", "Sj", "Sdj"
  ];

  const defaultRow = [
    "", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  // ✅ أول صف j = 0
  const firstRow = [["0", ...defaultRow.slice(1)]];

  // ✅ صفوف التسلسل 1 → jValue
  const middleRows = Array.from({ length: JValues }, (_, i) => [
    String(i + 1),
    ...defaultRow.slice(1),
  ]);

  // ✅ آخر صف j = ""
  const lastRow = [["", ...defaultRow.slice(1)]];

  return (
    <>
      {/* Header */}
      <tr>
        {headersSecond.map((header, idx) => (
          <td
            key={idx}
            className="px-2 sm:px-4 py-0 font-semibold bg-gray-100 text-center 
                       text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
           <div className="flex items-center justify-center gap-1">
            
              {infoMap[header] && (
                <Tooltip text={infoMap[header]}>
                   <span>{header}</span>
                </Tooltip>
              )}
            </div>
          </td>
        ))}
      </tr>

      {/* 🔴 أول صف (j=0) */}
      <tr className="text-amber-800 font-semibold">
        {firstRow[0].map((cell, cellIndex) => (
          <td
            key={cellIndex}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base 
                       min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>

      {/* ⚫ صفوف التسلسل */}
      {middleRows.map((row, rowIndex) => (
        <tr key={rowIndex} className="text-gray-800">
          {row.map((cell, cellIndex) => (
            <td
              key={cellIndex}
              className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base 
                         min-w-[90px] sm:min-w-[120px]"
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}

      {/* 🔴 آخر صف (j="") */}
      <tr className="text-amber-800 font-semibold">
        {lastRow[0].map((cell, cellIndex) => (
          <td
            key={cellIndex}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base 
                       min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>
    </>
  );
};

export default ROASecondTable;
