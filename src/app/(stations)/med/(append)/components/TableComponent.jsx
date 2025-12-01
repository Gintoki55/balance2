"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
import {AnimatedNumber } from "../../(data)/tableData";


// ✅ الحقول القابلة للتعديل حسب السيناريو
const editableFieldsByScenario = {
  Design: ["Ka", "Kb", "Kc","ER", "cg","δb","δc","Ts","Td","T0","S0","Sh","Md"],
  Demand: ["Ka", "Kb", "Kc","ER", "Aa","Ab","Ac","cg","Td","T0","S0","Sh","Md"],
  Energy:["Ka", "Kb", "Kc","ER", "Aa","Ab","Ac","cg","Td","T0","S0","Sh","Ms"],
  Rating: ["Ka", "Kb", "Kc","ER", "Aa","Ab","Ac","cg","Td","T0","S0","M0","Mf"],
};

export const isEditable = (stationNameValue, key) =>
  (editableFieldsByScenario[stationNameValue] || []).includes(key);


// ⭕ مكوّن رسم قيمة الخلية
const CellContent = ({ cell, editable, onValueChange }) => {
  // 🔸 Dropdown لـ Ja
  if (cell.key === "Ja") {
    return (
      <div className="relative w-full text-center">
        <select
          value={cell.value ?? 2}
          onChange={(e) => onValueChange(cell.key, Number(e.target.value))}
          className="inline-block w-auto px-2 py-1 pr-8 outline-none cursor-pointer appearance-none text-green-600"
        >
          {Array.from({ length: 29 }, (_, i) => (
            <option key={i + 2} value={i + 2}>
              {i + 2}
            </option>
          ))}
        </select>
        <MdKeyboardArrowDown className="absolute lg:right-8 right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    );
  }

  // 🔹 Editable input
  if (editable) {
    const handleBlur = (val) => {
      const n = Number(val);
      onValueChange(cell.key, val === "" || val === "-" || isNaN(n) ? "NAN" : n);
    };

    return (
      <input
        type="text"
        inputMode="decimal"
        value={cell.value ?? ""}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          if (/^-?\d*\.?\d*$/.test(e.target.value)) onValueChange(cell.key, e.target.value);
        }}
        onBlur={(e) => handleBlur(e.target.value)}
        className="block w-full px-2 py-1 text-center font-semibold rounded-md text-green-600 focus:bg-green-100 outline-none"
      />
    );
  }

  // 🔹 غير editable
  return (
    <div className="font-semibold text-gray-700 py-1 text-center">
      <AnimatedNumber value={cell.value} />
    </div>
  );
};

// ⭕ مكوّن مفتاح الخلية + Tooltip
const CellKey = ({ cell }) => (
  <td className="px-2 py-0 font-semibold bg-gray-100 text-center text-md min-w-[6ch]">
    {cell.info ? (
      <Tooltip text={cell.info}>
        <span>{cell.key}</span>
      </Tooltip>
    ) : (
      <span>{cell.key}</span>
    )}
  </td>
);

// ⭕ مكوّن MED Selector
const MedSelector = ({ cell, stationName, onValueChange }) => (
  <td
    colSpan={2}
    className="px-4 py-1 font-bold text-gray-800 bg-gray-200 text-center lg:text-lg text-sm"
  >
    <div className="relative w-full">
      <select
        value={stationName?.value || "Design"}
        onChange={(e) => onValueChange(cell.key, e.target.value)}
        className="w-full px-3 py-1 rounded-md bg-gray-200 border border-gray-200 text-gray-800 font-semibold appearance-none outline-none"
      >
        {["Design", "Demand", "Energy", "Rating"].map((o) => (
          <option key={o} value={o}>
            MED {o}
          </option>
        ))}
      </select>
      <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
    </div>
  </td>
);

// ✅ الجدول المختصر
const TableComponent = ({ stationData, onValueChange }) => {
  const maxRows = stationData?.length
    ? Math.max(...stationData.map((col) => col.length))
    : 0;

  const stationName = stationData.flat().find((c) => c.key === "MED");

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {
            const cell = col[rowIndex];
            if (!cell) return null;

            // عنوان المحطة MED
            if (cell.key?.startsWith("MED")) {
              return (
                <MedSelector
                  key={colIndex}
                  cell={cell}
                  stationName={stationName}
                  onValueChange={onValueChange}
                />
              );
            }

            const editable = isEditable(stationName?.value, cell.key);

            return (
              <React.Fragment key={colIndex}>
                <CellKey cell={cell} />
                <td className="px-2 py-0 text-center text-sm min-w-[7ch] max-w-[12ch]">
                  <CellContent
                    cell={cell}
                    editable={editable}
                    onValueChange={onValueChange}
                  />
                </td>
              </React.Fragment>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default TableComponent;
