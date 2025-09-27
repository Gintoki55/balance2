"use client";
import React from "react";
import { useJbStore } from "../store/jbStore";
import { useJcStore } from "../store/jcStore";

const SecondTableRows = ({ stationName }) => {
  const headersSecond = [
    "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
    "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance"
  ];

  const defaultRow = [
    "1", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  // Jb
  const Jb = useJbStore((s) => s.jb[stationName] ?? 1);
  const tableDataSecondJb = Array.from({ length: Jb }, (_, i) => [
    String(i + 1),
    ...defaultRow.slice(1),
  ]);

  // Jc
  const Jc = useJcStore((s) => s.jc[stationName] ?? 1);
  const tableDataSecondJc = Array.from({ length: Jc }, (_, i) => [
    String(i + 1),
    ...defaultRow.slice(1),
  ]);

  const renderTableRows = (tableData) =>
    tableData.map((row, rowIndex) => (
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
    ));

  const renderHeader = () => (
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
  );

  return (
    <>
      {/* Header + صفوف Jb */}
      {renderHeader()}
      {renderTableRows(tableDataSecondJb)}

      {/* فاصل بين الجدولين */}
      <tr>
        <td
          colSpan={headersSecond.length}
          className="border-t border-gray-400 bg-gray-200 py-1"
        />
      </tr>

      {/* Header + صفوف Jc */}
      {renderHeader()}
      {renderTableRows(tableDataSecondJc)}
    </>
  );
};

export default SecondTableRows;
