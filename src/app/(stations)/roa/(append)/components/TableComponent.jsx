"use client";

import React from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
import {AnimatedNumber } from "../../(data)/tableData";


const editableFieldsByScenario = {
  Design: ["N", "A", "FF", "J", "T0", "l", "w", "x", "Pp", "S0", "Sd", "Md", "WR"],
  Demand: ["A", "FF", "PV", "T0", "l", "w", "x", "Pp", "S0", "Sd", "Md"],
  Energy: ["A", "FF", "PV", "T0", "l", "w", "x", "Pf", "Pp", "S0", "Sd"],
  Rating: ["N", "A", "FF", "J", "PV", "T0", "l", "w", "x", "Pf", "Pp", "M0", "S0"],
};

const isEditable = (scenario, key) =>
  (editableFieldsByScenario[scenario] || []).includes(key);

// =============================
// 🔹 مكوّن اختيار السيناريو ROA
// =============================

const ScenarioSelector = ({ cell, scenario, onValueChange }) => (
  <td colSpan={2} className="px-4 py-1 font-bold bg-gray-200 text-center lg:text-lg text-sm">
    <div className="relative w-full">
      <select
        value={scenario || "Design"}
        onChange={(e) => onValueChange(cell.key, e.target.value)}
        className="w-full px-3 py-1 rounded-md bg-gray-200 border border-gray-200 text-gray-800 font-semibold appearance-none outline-none"
      >
        {["Design","Demand","Energy","Rating"].map((o) => (
          <option key={o} value={o}>
            ROA {o}
          </option>
        ))}
      </select>

      <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" />
    </div>
  </td>
);


// =====================================
// 🔹 محتوى الخلية (Dropdown / Editable / Static)
// =====================================
const CellContent = ({ cell, editable, onValueChange }) => {

  // 🔸 قوائم ثابتة لـ N و J
  if (["N","J"].includes(cell.key)) {
    const max = cell.key === "J" ? 9 : 20;

    return (
      <div className="relative w-full text-center">
        <select
          value={cell.value ?? 1}
          onChange={(e) => onValueChange(cell.key, Number(e.target.value))}
          className={`inline-block w-auto px-2 py-1 pr-8 outline-none appearance-none cursor-pointer ${
            cell.key === "J" ? "text-green-600" : "text-blue-600"
          }`}
        >
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <MdKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>
    );
  }

  // 🔸 Editable Input
  if (editable) {
    const handleBlur = (v) => {
      const n = Number(v);
      onValueChange(cell.key, v === "" || v === "-" || isNaN(n) ? "NAN" : n);
    };

    return (
      <input
        type="text"
        inputMode="decimal"
        value={cell.value ?? ""}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          if (/^-?\d*\.?\d*$/.test(e.target.value)) {
            onValueChange(cell.key, e.target.value);
          }
        }}
        onBlur={(e) => handleBlur(e.target.value)}
        className="block w-full px-2 py-1 text-center font-semibold rounded-md text-green-600 focus:bg-green-100 outline-none"
      />
    );
  }

  // 🔸 غير قابل للتعديل (scientific)
  return (
    <div className="font-semibold text-gray-700 py-1 text-center">
      <AnimatedNumber value={cell.value} />
    </div>
  );
};


// =============================
// 🔹 خلية الـ Key مع Tooltip
// =============================
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


// =============================
// 🔥 الجدول الرئيسي بالكامل
// =============================
const TableComponent = ({ stationData, onValueChange }) => {

  // عدد صفوف الجدول
  const maxRows = Math.max(...stationData.map((col) => col.length));

  // قراءة سيناريو ROA الحالي
  const scenarioCell = stationData.flat().find((c) => c.key === "ROA");
  const scenario = scenarioCell?.value;

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {

            const cell = col[rowIndex];
            if (!cell) return null;

            // عنوان سيناريو ROA
            if (cell.key?.startsWith("ROA")) {
              return (
                <ScenarioSelector
                  key={colIndex}
                  cell={cell}
                  scenario={scenario}
                  onValueChange={onValueChange}
                />
              );
            }

            const editable = isEditable(scenario, cell.key);

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
