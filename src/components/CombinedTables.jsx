"use client";
import React, { useState, useEffect } from "react";
import TableComponent from "./TableComponent";

const CombinedTables = ({ stationName, stationData, onJaChange, secondTableRows }) => {
  const [StationValue, setStationValue] = useState([]);

useEffect(() => {
  if (stationData) {
    setStationValue((prev) => {
      const clone = JSON.parse(JSON.stringify(stationData));

      // نحافظ على قيمة Ja السابقة إذا كانت موجودة
      clone.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell.key === "Ja") {
            const prevJa =
              prev[rowIndex]?.find((c) => c.key === "Ja")?.value;
            if (prevJa !== undefined) {
              cell.value = prevJa;
            } else if (cell.value === undefined || cell.value === 5) {
              cell.value = 1;
            }
          }
        });
      });

      return clone;
    });
  }
}, [stationData]);


  const headersSecond = [
    "j","Pvj","ΔTj","Tbj","Tvj","Tdj",
    "Tcj","Mbj","mj","Mdj","Sbj","Balance"
  ];

  const defaultRow = [
    "1","1.0000","0.50","1.00","1.00",
    "1.00","50.00","1.00","1.00","1.00","40.00","1.0000"
  ];

  const tableDataSecond = Array.from({ length: secondTableRows }, (_, i) => {
    return [String(i + 1), ...defaultRow.slice(1)];
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-[1000px] scale-95">
        <table className="table-fixed border border-gray-300 rounded-lg shadow-md text-base w-full">
          <tbody>
            {/* الجدول الأول */}
            <TableComponent
              stationName={stationName}
              stationData={StationValue}
              onJaChange={(val) => onJaChange(val)}
            />

            {/* خط فاصل داخلي */}
            <tr>
              <td colSpan={StationValue[0]?.length * 2 || 12} className="border-t border-gray-400 bg-gray-200 py-1"></td>
            </tr>

            {/* الجدول الثاني */}
            <tr>
              {headersSecond.map((header, idx) => (
                <td
                  key={idx}
                  className="px-2 sm:px-4 py-0  font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
                >
                  {header}
                </td>
              ))}
            </tr>

            {tableDataSecond.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-2 sm:px-4 py-0  text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTables;
