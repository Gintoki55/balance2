"use client";
import React from "react";

const SecondTableRows = ({ jValue }) => {
  const headersSecond = [
    "j", "Pbj", "Δπj", "Balance", "∆Pj", "mj",
    "Mdj", "Mbj", "Sbj", "ΔSj", "Sj", "Sdj"
  ];

  const defaultRow = [
    "0", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  // ✅ صف ثابت j=0 (أحمر)
  const firstRow = [["0", ...defaultRow.slice(1)]];

  // ✅ باقي الصفوف تبدأ من 1
  const tableDataSecondJ = Array.from({ length: jValue }, (_, i) => [
    String(i + 1),
    ...defaultRow.slice(1),
  ]);

  return (
    <>
      {/* Header */}
      <tr>
        {headersSecond.map((header, idx) => (
          <td
            key={idx}
            className="px-2 sm:px-4 py-0 font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
            {header}
          </td>
        ))}
      </tr>

      {/* ✅ j=0 أحمر */}
      <tr className="bg-red-700 text-white">
        {firstRow[0].map((cell, cellIndex) => (
          <td
            key={cellIndex}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>

      {/* ✅ باقي الصفوف */}
      {tableDataSecondJ.map((row, rowIndex) => {
        const isLast = rowIndex === tableDataSecondJ.length - 1 && jValue > 1;
        return (
          <tr
            key={rowIndex}
            className={isLast ? "bg-red-700 text-white" : ""}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
              >
                {cell}
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
};

export default SecondTableRows;
