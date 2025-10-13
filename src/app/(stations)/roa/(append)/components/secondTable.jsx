"use client";
import React from "react";

const SecondTableRows = ({ jValue }) => {
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
  const middleRows = Array.from({ length: jValue }, (_, i) => [
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
            {header}
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

export default SecondTableRows;
