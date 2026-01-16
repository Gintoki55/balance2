"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";

const infoMap = {
  j: "Level number",
  Pvj: "Vapour saturation pressure Pvj [bar]\n1 atm = 101.3 kPa\n1 bar = 100 kPa\n1 bar = 689.5 psia",
  ΔTj: "Flashing temperature drop [°C]",
  Tbj: "Flashing brine temperature [°C]",
  Tvj: "Vapour saturation temperature [°C]",
  Tdj: "Distillate saturation temperature [°C]",
  Tcj: "Cooling water temperature [°C]",
  Mbj: "Flashing brine flow rate [t/h]",
  mj: "Fresh distillate [t/h]",
  Mdj: "Accumulated distillate [t/h]",
  Sbj: "Brine salinity [kg/t]\n1 kg/t = 1 g/L = 1000 ppm",
  Balance: "Heat balance through the preheater surface",
};

const ROSecondTable = ({ JValues }) => {
  const headersSecond = [
    "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
    "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance"
  ];

  const defaultRow = [
    "0", "1.0000", "0.50", "1.00", "1.00",
    "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000"
  ];

  const firstRow = [[
    "0",
    ...defaultRow.slice(1),
  ]];

  let startIndex = 1;
  const tableSections = JValues.map((val) => {
    const section = Array.from({ length: val }, (_, idx) => [
      String(startIndex + idx),
      ...defaultRow.slice(1),
    ]);
    startIndex += val;
    return section;
  });

  const totalRow = [[
    "",
    ...defaultRow.slice(1),
  ]];

  const renderTableRows = (rows, highlightLast = false) =>
    rows.map((row, rowIndex) => {
      const isLast = highlightLast && rowIndex === rows.length - 1;
      const rowClass =
        isLast && rows.length > 1 ? "text-amber-800 font-semibold" : "";

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
      {/* ----------- العناوين + الأيقونة ----------- */}
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

      {/* الصف الأول j = 0 */}
      <tr className="text-amber-800 font-semibold">
        {firstRow[0].map((cell, idx) => (
          <td
            key={idx}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>

      {/* باقي الأقسام */}
      {tableSections.map((section, idx) => (
        <React.Fragment key={idx}>
          {renderTableRows(section, true)}
        </React.Fragment>
      ))}

      {/* صف المجموع */}
      <tr className="text-amber-800 font-semibold">
        {totalRow[0].map((cell, idx) => (
          <td
            key={idx}
            className="px-2 sm:px-4 py-0 text-center text-sm sm:text-base min-w-[90px] sm:min-w-[120px]"
          >
            {cell}
          </td>
        ))}
      </tr>
    </>
  );
};

export default ROSecondTable;
