"use client";
import React from "react";
import { useJaStore } from "../store/jaStore";

const SecondTable = ({stationName }) => {
  const headersSecond = [
    "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
    "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance"
  ];

  const defaultRow = [
    "1", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];
  const ja = useJaStore((s) => s.ja[stationName] ?? 1);
  const rowsCount = ja;

  const tableDataSecond = Array.from({ length: rowsCount }, (_, i) => {
    return [String(i + 1), ...defaultRow.slice(1)];
  });
  
  return (
    <>
      {/* عناوين الأعمدة */}
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

      {/* البيانات */}
      {tableDataSecond.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td
              key={cellIndex}
              className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default SecondTable;
