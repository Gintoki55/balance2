"use client";
import React from "react";
import { useNStore } from "../store/NStore";
import { useJStore } from "../store/jStore";

const SecondTableRows = ({ stationName }) => {
  const headersSecond = [
    "j", "Pbj", "Δπj", "Balance", "∆Pj", "mj",
    "Mdj", "Mbj","Sbj", "ΔSj","Sj","Sdj"
  ];

  const defaultRow = [
    "1", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  // N
  const N = useNStore((s) => s.n[stationName] ?? 1);
  const tableDataSecondN = Array.from({ length: N }, (_, i) => [
    String(i + 1),
    ...defaultRow.slice(1),
  ]);

  // J
  const J = useJStore((s) => s.j[stationName] ?? 1);
  const tableDataSecondJ = Array.from({ length: J }, (_, i) => [
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
      {/* Header + صفوف N */}
      {renderHeader()}
      {renderTableRows(tableDataSecondN)}

      {/* فاصل بين الجدولين */}
      <tr>
        <td
          colSpan={headersSecond.length}
          className="border-t border-gray-400 bg-gray-200 py-1"
        />
      </tr>

      {/* Header + صفوف J */}
      {renderHeader()}
      {renderTableRows(tableDataSecondJ)}
    </>
  );
};

export default SecondTableRows;
