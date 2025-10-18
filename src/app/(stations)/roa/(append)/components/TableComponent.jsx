import React, { useEffect } from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useAnimate } from "../../(data)/animationContext";

// ✅ مكون الأنيميشن للأرقام
function AnimatedNumber({ value }) {
  const { animateTrigger } = useAnimate();

  // ✅ لو القيمة فاضية أو "-"، لا تعرض شيء (تتركها مثل ما هي)
  if (value === null || value === undefined || value === "" || value === "-") {
    return <span>{value || "-"}</span>;
  }

  // ✅ لو القيمة غير رقمية (نص أو شيء ثاني)
  if (isNaN(Number(value))) {
    return <span className="text-red-600 font-semibold">ليس رقمًا</span>;
  }

  const numericValue = Number(value);
  const motionValue = useMotionValue(numericValue);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (!animateTrigger) {
      // أول تحميل بدون أنيميشن
      motionValue.set(numericValue);
      return;
    }

    // وقت الضغط على Run فقط
    const controls = animate(motionValue, numericValue, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [numericValue, animateTrigger]);

  return <motion.span>{rounded}</motion.span>;
}


// ✅ الحقول القابلة للتعديل حسب السيناريو
const editableFieldsByScenario = {
  Design: ["N", "A", "FF", "J", "T0", "l", "w", "x", "Pp", "S0", "Sd", "Md", "WR"],
  Demand: ["A", "FF", "PV", "T0", "l", "w", "x", "Pp", "S0", "Sd", "Md"],
  Energy: ["A", "FF", "PV", "T0", "l", "w", "x", "Pf", "Pp", "S0", "Sd"],
  Rating: ["N", "A", "FF", "J", "PV", "T0", "l", "w", "x", "Pf", "Pp", "M0", "S0"],
};

const isEditable = (stationName, key) => {
  const editableKeys = editableFieldsByScenario[stationName] || [];
  return editableKeys.includes(key);
};

// ✅ المكون الرئيسي للجدول
const TableComponent = ({ stationName, stationData, jValue, onJChange, onValueChange }) => {
  const maxRows = stationData?.length
    ? Math.max(...stationData.map((col) => col.length))
    : 0;

  const formatNumber = (num) =>
    typeof num === "number" ? new Intl.NumberFormat().format(num) : num;

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {
            const cell = col[rowIndex];
            if (!cell) return null;

            // 🔸 عنوان ROA
            if (cell.key && cell.key.startsWith("ROA")) {
              return (
                <td
                  key={colIndex}
                  colSpan={2}
                  className="px-4 py-0 font-bold text-gray-800 bg-gray-200 text-center text-lg"
                >
                  ROA {stationName}
                </td>
              );
            }

            let content;
            const editable = isEditable(stationName, cell.key);

            // 🔸 الحقل J
            if (cell.key === "J") {
              content = (
                <div className="relative w-full">
                  <select
                    value={jValue ?? cell.value ?? 1}
                    onChange={(e) => onJChange(Number(e.target.value))}
                    className="block w-full px-2 py-1 pr-8 outline-none text-base appearance-none min-w-[5ch] cursor-pointer text-green-600"
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              );
            }

            // 🔸 الحقل N
            else if (cell.key === "N") {
              content = (
                <div className="relative w-full">
                  <select
                    value={cell.value ?? 1}
                    onChange={(e) => onValueChange("N", Number(e.target.value))}
                    className="block w-full px-2 py-1 pr-8 outline-none text-base appearance-none min-w-[5ch] cursor-pointer text-blue-600"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              );
            }

            // 🔸 بقية الحقول
            else if (editable) {
              content = (
                <input
                  type="text"
                  value={formatNumber(cell.value)}
                  onChange={(e) => onValueChange(cell.key, Number(e.target.value))}
                  inputMode="decimal"
                  className="block w-full px-2 py-1 text-center outline-none rounded-md text-base text-green-600 focus:bg-green-100"
                />
              );
            } else {
              content = (
                <div className="font-semibold text-gray-700 py-1">
                  <AnimatedNumber value={cell.value} />
                </div>
              );
            }

            return (
              <React.Fragment key={colIndex}>
                <td className="px-2 py-0 font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[6ch]">
                  {cell.key || <span className="text-gray-400">-</span>}
                </td>
                <td className="px-2 py-0 text-center text-sm sm:text-base min-w-[7ch] max-w-[12ch]">
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
