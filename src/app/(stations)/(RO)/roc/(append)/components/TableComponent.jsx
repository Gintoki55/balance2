"use client";

import React from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
import {AnimatedNumber } from "../../(data)/tableData";


const editableFieldsByScenario = {
  Design: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x", "Pf", "Pp", "PV", "k", "l", "M0", "T0", "S0","Sp","Sd", "Md","WR"],
  Demand: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x","Pp", "PV", "l", "T0", "S0","Sp","Sd", "Md"],
  Energy: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x", "Pf", "Pp", "PV", "l", "T0", "S0","Sp","Sd"],
  Rating: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x", "Pf", "Pp", "PV", "k", "l", "M0", "T0", "S0"],
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
            ROC {o}
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
const CellContent = ({ cell, editable, activeIndex,onValueChange }) => {
  const value = cell.value?.[activeIndex];

  // 🔸 قوائم ثابتة لـ N و J
 if (["Ja", "Jc", "Na", "Nc"].includes(cell.key)) {
    const isN = ["Na", "Nc"].includes(cell.key);

    const min = isN ? 1 : 2;
    const max = isN ? 20 : 9;
     return (
       <div className="relative w-full text-center">
         <select
           value={value ?? 2}
           onChange={(e) => onValueChange(cell.key, Number(e.target.value))}
           className="inline-block w-auto px-2 py-1 pr-8 outline-none appearance-none cursor-pointer text-green-600"
         >
           {Array.from(
            { length: max - min + 1 },
            (_, i) => min + i
          ).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
         <MdKeyboardArrowDown className="absolute lg:right-8 right-4 top-1/2 -translate-y-1/2 text-gray-500" />
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
        value={value ?? ""}
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
      <AnimatedNumber value={value} />
    </div>
  );
};


// =============================
// 🔹 خلية الـ Key مع Tooltip
// =============================
const CellKey = ({ cell }) => {
    if (!cell.key) {
    return <></>;
  }
  return (
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
}


// =============================
// 🔥 الجدول الرئيسي بالكامل
// =============================
const TableComponent = ({ stationData, onValueChange ,activeIndex}) => {

  // عدد صفوف الجدول
  const maxRows = Math.max(...stationData.map((col) => col.length));

  // قراءة سيناريو ROA الحالي
  const scenarioCell = stationData.flat().find((c) => c.key === "ROC");
  const scenario = scenarioCell?.value;

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {

            const cell = col[rowIndex];
            if (!cell) return null;

            // عنوان سيناريو ROA
            if (cell.key?.startsWith("ROC")) {
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

                  {(Array.isArray(cell.value) ? cell.value : [cell.value]).map((_, activeIndex) => (
                    <td
                      key={activeIndex}
                      className="px-2 py-0 text-center text-sm min-w-[7ch] max-w-[12ch]"
                    >
                      <CellContent
                        cell={cell}
                        editable={editable}
                        // onValueChange={onValueChange}
                        activeIndex={activeIndex}
                        onValueChange={(key, value) =>
                          onValueChange(key, value, activeIndex)
                        }
                      />
                    </td>
                  ))}
                </React.Fragment>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default TableComponent;
