"use client";
import React from "react";

const SecondTableRows = ({ JbValue, JcValue }) => {
  const headersSecond = [
    "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
    "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance"
  ];

  const defaultRow = [
    "0", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  // 🔹 الصف الأول (j = 0 أحمر)
  const firstRow = [[
    "0",
    ...defaultRow.slice(1),
  ]];

  // 🔹 جدول Jb يبدأ من 1
  const tableDataSecondJb = Array.from({ length: JbValue }, (_, i) => [
    String(i + 1), // يبدأ من 1
    ...defaultRow.slice(1),
  ]);

  // 🔹 جدول Jc يكمل بعد Jb
  const tableDataSecondJc = Array.from({ length: JcValue }, (_, i) => [
    String(JbValue + 1 + i), // يكمل العد بعد Jb
    ...defaultRow.slice(1),
  ]);

  const renderTableRows = (rows, isJb = false, isJc = false) =>
    rows.map((row, rowIndex) => {
      const isFirst = isJb === false && isJc === false && rowIndex === 0; // الصف 0
      const isLastJb = isJb && rowIndex === rows.length - 1; // آخر Jb
      const isLastJc = isJc && rowIndex === rows.length - 1; // آخر Jc

      const rowClass =
        isFirst || isLastJb || isLastJc ? "text-amber-800" : "";

      return (
        <tr key={rowIndex} className={rowClass}>
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
    });

  return (
    <>
      {/* Header مشترك */}
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

      {/* أول صف j=0 (أحمر) */}
      {renderTableRows(firstRow)}

      {/* Jb (آخر سطر أحمر) */}
      {renderTableRows(tableDataSecondJb, true)}

      {/* Jc (آخر سطر أحمر) */}
      {renderTableRows(tableDataSecondJc, false, true)}
    </>
  );
};

export default SecondTableRows;
