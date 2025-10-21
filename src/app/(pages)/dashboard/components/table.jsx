"use client";
import React from "react";

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
      <div className="mb-2 font-bold text-lg text-blue-700">{name}</div>

      <table className="table-auto border border-gray-300 border-collapse w-full text-center">
        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {stationData.map((col, colIndex) => {
                const cell = col[rowIndex];
                if (!cell) return null;

                // 🔹 استثناء خلايا ROA
                if (cell.key && cell.key.startsWith("ROA")) {
                  return (
                    <td
                      key={colIndex}
                      colSpan={2}
                      className="px-4 py-0 border font-bold text-gray-800 bg-gray-200 text-center text-lg"
                    >
                      ROA {stationName}
                    </td>
              );
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
