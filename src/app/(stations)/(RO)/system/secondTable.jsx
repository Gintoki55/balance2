"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";


const infoMap = {
  "j": "Element number in the pressure vessel",
  "Pbj" : "Brine pressure Pbj [bar],which is constrained: Pbj < max",
  "Δπj": "Transmembrane osmotic pressure Δπj [bar]",
  "Balance": "Pressure balance across the membrane",
  "∆Pj": "Net driving pressure ∆Pj [bar]",
  "mj": "Permeate flux mj [l/m².h],which is constrained: lmh < max",
  "Mdj": "Accumulating permeate Mdj [t/h]",
  "Mbj": "Leaving brine Mbj [t/h],which is constrained: min < Mbj < max",
  "Sbj": "Bulk brine salinity Sbj [g/l],which is constrained: Sbj <99",
  "ΔSj": "Salinity gradient acros the membrane ΔSj [g/l]",
  "Sj": "Salinity at the permeate envelope Sj [g/l]",
  'Sdj': "Salinity at the product tube Sdj [g/l]",
};

const ROSecondTable = ({ JValues }) => {
  const headersSecond = [
    "j", "Pbj", "Δπj", "Balance", "∆Pj", "mj",
    "Mdj", "Mbj", "Sbj", "ΔSj", "Sj", "Sdj"
  ];

  const defaultRow = [
    "", "1.0000", "0.50", "1.00", "1.00",
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
