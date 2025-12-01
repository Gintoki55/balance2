"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
  j: "Effect number j [#]",
  Pvj: "Vapour saturation pressure in each effect Pvj [bar]",
  ΔTj: "Driving temperature difference ∆Tj [°C], between condensing steam and evaporating brine in each effect",
  Tbj: "Brine temperature in each effect Tbj [°C]",
  Tvj: "Vapour saturation temperature in each effect Tvj [°C]",
  Tdj: "Distillate saturation temperature in each effect Tdj [°C]",
  Tcj: "Cooling water temperature in each preheater Tcj [°C]",
  Mbj: "Accumulating brine in each effect Mbj [t/h]",
  mj: "Condensing fresh distillate in each effect mj [t/h]",
  Mdj: "Accumulating distillate in each effect Mdj [t/h]",
  Sbj: "Brine salinity in each effect Sbj [g/l]",
  Balance: "Heat balance in each effect,between the latent and the transfered through evaporator",
};

const MEDSecondTable = ({ JValues }) => {
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
  const tableDataSecond = Array.from({ length: JValues }, (_, i) => [
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

      {/* ✅ j=0 أحمر */}
      <tr className="text-amber-800">
        {firstRow[0].map((cell, cellIndex) => (
          <td
            key={cellIndex}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>

      {/* ✅ باقي الصفوف (1 → JValues) */}
      {tableDataSecond.map((row, rowIndex) => {
        const isLast = rowIndex === tableDataSecond.length - 1 && JValues > 1;
        return (
          <tr
            key={rowIndex}
            className={isLast ? "text-amber-800" : ""}
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

export default MEDSecondTable;
