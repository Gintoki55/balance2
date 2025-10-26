"use client";
import React from "react";
import { Eye } from "lucide-react";
// 🔹 تعريف أنماط المحطات
const stationStyles = {
  ROA: "bg-blue-200 text-blue-800",
  MSF: "bg-green-200 text-green-800",
  MED: "bg-orange-200 text-orange-800",
};

const TableDashboard = ({ stationData, name }) => {
  if (!stationData || stationData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No data available for this dashboard
      </div>
    );
  }

  const maxRows = stationData?.length
    ? Math.max(...stationData.map((col) => col.length))
    : 0;

  const stationName = stationData[0][0].value

  return (
    <div className="mb-6">
      
      {/* 🔹 العنوان من الـ Dashboard نفسه */}
      <div className="mb-3 flex items-center justify-between">
        <div className="font-bold text-lg text-blue-700">{name}</div>

        {/* 🔹 الزر الجديد */}
        <button
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer hover:underline"
        >
          See in Station
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <table className="table-auto border border-gray-300 border-collapse w-full text-center">
        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {stationData.map((col, colIndex) => {
                const cell = col[rowIndex];
                if (!cell) return null;

                if (cell.key) {
                  // 🔹 نحصل على اسم المحطة من أول 3 أحرف (مثلاً ROA أو MSF أو MED)
                  const prefix = Object.keys(stationStyles).find((name) =>
                    cell.key.startsWith(name)
                  );

                // 🔹 استثناء خلايا ROA
                if (prefix) {
                    return (
                      <td
                        key={colIndex}
                        colSpan={2}
                        className={`px-4 py-0 border font-bold text-center text-lg ${stationStyles[prefix]}`}
                      >
                        {prefix} {stationName}
                      </td>
                    );
                  }
                }

                return (
                  <React.Fragment key={colIndex}>
                    <td className="border px-2 py-1 font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[6ch]">
                      {cell.key || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="border px-2 py-1 text-center text-sm sm:text-base min-w-[7ch] max-w-[12ch]">
                      {cell.value ?? "-"}
                    </td>
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
