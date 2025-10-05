"use client";
import React from "react";

const SecondTable = ({ jaValue }) => {
  const headersSecond = [
    "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
    "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance"
  ];

  const defaultRow = [
    "0", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  // ✅ صف ثابت j=0 (أحمر)
  const firstRow = [["0", ...defaultRow.slice(1)]];

  // ✅ باقي الصفوف تبدأ من 1
  const tableDataSecond = Array.from({ length: jaValue }, (_, i) => [
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
      <tr className="text-amber-900">
        {firstRow[0].map((cell, cellIndex) => (
          <td
            key={cellIndex}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>

      {/* ✅ باقي الصفوف (1 → jaValue) */}
      {tableDataSecond.map((row, rowIndex) => {
        const isLast = rowIndex === tableDataSecond.length - 1 && jaValue > 1;
        return (
          <tr
            key={rowIndex}
            className={isLast ? "text-amber-900" : ""}
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

export default SecondTable;
