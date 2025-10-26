"use client";
import React, { useEffect, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useAnimate } from "../../(data)/animationContext";

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
  Design: ["Ka", "Kb", "Kc","ER", "cg","δb","δc","Ts","Td","T0","S0","Sh","Md"],
  Demand: ["Ka", "Kb", "Kc","ER", "Aa","Ab","Ac","cg","Td","T0","S0","Sh","Md"],
  Energy:["Ka", "Kb", "Kc","ER", "Aa","Ab","Ac","cg","Td","T0","S0","Sh","Ms"],
  Rating: ["Ka", "Kb", "Kc","ER", "Aa","Ab","Ac","cg","Td","T0","S0","M0","Mf"],
};
const isEditable = (stationName, key) =>
  (editableFieldsByScenario[stationName] || []).includes(key);


// ✅ الجدول الرئيسي
const TableComponent = ({ stationName, stationData, onValueChange}) => {

  const { animateTrigger } = useAnimate();
  const maxRows = stationData?.length
    ? Math.max(...stationData.map((col) => col.length))
    : 0;

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {
            const cell = col[rowIndex];
            if (!cell) return null;

            // ✅ عنوان المحطة
            if (cell.key?.startsWith("MED")) {
              return (
                <td
                  key={colIndex}
                  colSpan={2}
                  className="px-4 py-0 font-bold text-gray-800 bg-gray-200 text-center text-lg"
                >
                  MED {stationName}
                </td>
              );
            }

            const editable = isEditable(stationName, cell.key);
            let content;

            // 🔸 Dropdown للقيم Ja
            if (cell.key === "Ja") {
              content = (
                <div className="relative w-full">
                  <select
                    value={cell.value ?? 1}
                    onChange={(e) => onValueChange(cell.key, Number(e.target.value))}
                    className="block w-full px-2 py-1 pr-8 outline-none text-base appearance-none min-w-[5ch] cursor-pointer text-green-600"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
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
                  {cell.key || "-"}
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
