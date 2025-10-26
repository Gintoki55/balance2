"use client";
import React, { useEffect, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useAnimate } from "../../(data)/animationContext";
// ✅ مكون الأنيميشن للأرقام مع format
function AnimatedNumber({ value }) {
  const { animateTrigger } = useAnimate();

  if (value === null || value === undefined || value === "" || value === "-") {
    return <span>-</span>;
  }

  const numericValue = Number(value);
  const motionValue = useMotionValue(numericValue);
  const formatted = useTransform(motionValue, (latest) =>
    new Intl.NumberFormat().format(Math.round(latest))
  );

  useEffect(() => {
    if (!animateTrigger) {
      motionValue.set(numericValue);
      return;
    }
    const controls = animate(motionValue, numericValue, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [numericValue, animateTrigger]);

  return <motion.span>{formatted}</motion.span>;
}

// ✅ الحقول القابلة للتعديل حسب السيناريو
const editableFieldsByScenario = {
  Design: ["Jb","Ka", "Kb", "Kc","Jc","Aa","Ab","Ac","cg","Th","T0","m","S0","Md"],
  Demand: ["Ka", "Kb", "Kc","Aa","Ab","Ac","cg","Th","T0","m","S0","Md"],
  Energy:["Jb","Ka", "Kb", "Kc","Jc","Aa","Ab","Ac","cg","Th","T0","m","S0","Ms"],
  Rating: ["Jb","Ka", "Kb", "Kc","Jc","Aa","Ab","Ac","cg","Th","T0","M0","m","S0"],
};

const isEditable = (stationName, key) =>
  (editableFieldsByScenario[stationName] || []).includes(key);

const TableComponent = ({ stationName, stationData, onValueChange}) => {
  const { animateTrigger } = useAnimate();

  // 🔹 حساب أكبر عدد صفوف
  const maxRows = Math.max(...stationData.map((col) => col.length));

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {
            const cell = col[rowIndex];
            if (!cell) return null;

            // ✅ عنوان التصميم
            if (cell.key?.startsWith("MSF")) {
              return (
                <td
                  key={colIndex}
                  colSpan={2}
                  className="px-4 py-0 font-bold text-gray-800 bg-gray-200 text-center text-lg"
                >
                  MSF {stationName}
                </td>
              );
            }

            const editable = isEditable(stationName, cell.key);
            let content;

            // 🔸 Dropdown للقيم Jb و Jc
            if (cell.key === "Jb" || cell.key === "Jc") {
              content = (
                <div className="relative w-full">
                  <select
                    value={cell.value ?? 2}
                    onChange={(e) => onValueChange(cell.key, Number(e.target.value))}
                    className="block w-full px-2 py-1 pr-8 outline-none text-base appearance-none min-w-[5ch] cursor-pointer text-green-600"
                  >
                    {Array.from({ length: 30 }, (_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                  <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              );
            } 
            // 🔸 Editable input مع أنيميشن
            else if (editable) {
              content = (
                <div className="relative w-full">
                  {/* AnimatedNumber */}
                  <div
                    className={`absolute inset-0 text-center font-semibold py-1 text-green-600 transition-opacity duration-300 ${
                      animateTrigger ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <AnimatedNumber value={cell.value} />
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    value={cell.value}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^-?\d*\.?\d*$/.test(val)) {
                        onValueChange(cell.key, val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (e.target.value === "" || e.target.value === "-" || isNaN(val)) {
                        onValueChange(cell.key, "NAN");
                      } else {
                        onValueChange(cell.key, val);
                      }
                    }}
                    inputMode="decimal"
                    className={`block w-full px-2 py-1 text-center font-semibold outline-none rounded-md text-base text-green-600 focus:bg-green-100 transition-opacity duration-300 ${
                      animateTrigger ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  />
                </div>
              );
            } 
            // 🔸 غير Editable
            else {
              content = (
                <div className="font-semibold text-gray-700 py-1 text-center">
                  <AnimatedNumber value={cell.value} />
                </div>
              );
            }

            return (
              <React.Fragment key={colIndex}>
                {/* اسم المتغير */}
                <td className="px-2 py-1 font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[6ch]">
                  {cell.key || <span className="text-gray-400">-</span>}
                </td>

                {/* القيمة */}
                <td className="px-2 py-1 text-center text-sm sm:text-base min-w-[7ch] max-w-[12ch]">
                  {cell.info ? (
                    <Tooltip text={cell.info}>{content}</Tooltip>
                  ) : (
                    content
                  )}
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
