"use client";

import React from "react";
import Tooltip from "@/components/Tooltip";

const stationStyles = {
  ROA: "bg-blue-200 text-blue-800",
  MSF: "bg-orange-400 text-amber-900",
  MED: "bg-orange-200 text-amber-800",
};

// 🔹 خلية الـ Key مع Tooltip
const CellKey = ({ cell }) => (
  <td className="px-2 py-0 font-semibold bg-gray-100 text-md min-w-[6ch] text-center">
    {cell.info ? (
      <Tooltip text={cell.info}>
        <span>{cell.key}</span>
      </Tooltip>
    ) : (
      <span>{cell.key}</span>
    )}
  </td>
);

// 🔹 خلية الـ Value (بدون أنيميشن)
const CellValue = ({ value }) => (
  <td className="px-2 py-0 text-center text-sm min-w-[7ch] max-w-[12ch]">
    <div className="font-semibold text-gray-700 py-1">
      {value ?? "-"}
    </div>
  </td>
);

// 🔥 جدول Dashboard (عرض فقط)
const TableDashboard = ({ stationData}) => {
  if (!stationData?.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No data available
      </div>
    );
  }

  const maxRows = Math.max(...stationData.map((col) => col.length));
  const stationName = stationData[0][0]?.value;

  return (
    <div>
      <table className="table-fixed border border-gray-300 border-collapse w-full text-center shadow-sm rounded-md">

        <colgroup>
          {Array.from({ length: 12 }).map((_, i) => (
            <col key={i} className="w-[90px]" />
          ))}
        </colgroup>

        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {stationData.map((col, colIndex) => {
                const cell = col[rowIndex];
                if (!cell) return null;

                // عنوان رئيسي (ROA MED مثلاً)
                const prefix = Object.keys(stationStyles)
                  .find((type) => cell.key?.startsWith(type));

                if (prefix) {
                  return (
                    <td
                      key={colIndex}
                      colSpan={2}
                      className={`px-4 py-1 border font-bold text-center lg:text-lg text-sm ${stationStyles[prefix]}`}
                    >
                      {prefix} {stationName}
                    </td>
                  );
                }

                return (
                  <React.Fragment key={colIndex}>
                    <CellKey cell={cell} />
                    <CellValue value={cell.value} />
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default TableDashboard;
