"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
"j": "Stage number j [#]",
"Pvj" : "Vapour saturation pressure in each stage Pvj [bar]",
"∆Tj": "Flashing temperature drop in each stage ∆Tj [°C]",
"Tbj": "Brine temperature in each stage Tbj [°C]",
"Tvj": "Vapour saturation temperature in each stage Tvj [°C]",
"Tdj": "Distillate saturation temperature in each stage Tdj [°C]",
"Tcj": "Cooling water temperature in each stage Tcj [°C]",
"Mbj": "Leaving brine from each stage Mbj [t/h]",
"mj": "Condensing fresh distillate in each stage mj [t/h]",
"Mdj": "Accumulating distillate in each stage Mdj [t/h]",
"Sbj": "Brine salinity in each stage Sbj [g/l]",
'Balance': "Heat balance in each stage,between the condensing vapor and the cooling water",
};


const MSFSecondTable = ({JValues }) => {

  const JbValue = Number(JValues?.[0] || 2);
  const JcValue = Number(JValues?.[1] || 2);
  const headersSecond = [
    "j", "Pvj", "∆Tj", "Tbj", "Tvj", "Tdj",
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
              <div className="flex items-center justify-center gap-1">

              {infoMap[header] && (
                <Tooltip text={infoMap[header]}>
                  <span>{header}</span>
                </Tooltip>
              )}
            </div>
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

export default MSFSecondTable;
