"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";
const TableComponent = ({ stationName, stationData, jaValue, onJaChange }) => {
  const toEnglishDigits = (str) =>
    String(str).replace(/[٠-٩]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0x0660)
    );

  const formatValue = (value) => (value ? toEnglishDigits(value) : "-");

  // أحسب أكبر عدد صفوف في الأعمدة
  const maxRows = Math.max(...stationData.map((col) => col.length));

  return (
    <>
      {Array.from({ length: maxRows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {stationData.map((col, colIndex) => {
            const cell = col[rowIndex];
            if (!cell) return null;

            // 🔹 عنوان التصميم
            if (cell.key === "MED Design") {
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

            const content =
              cell.key === "Ja" ? (
                <div className="relative w-full">
                  <select
                    value={jaValue ?? cell.value ?? 1}
                    onChange={(e) => onJaChange(Number(e.target.value))}
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
              ) : (
                <input
                  type="text"
                  value={formatValue(cell.value)}
                  onChange={() => {}}
                  disabled={!cell.editable}
                  inputMode="decimal"
                  className={`block w-full px-2 py-1 text-center outline-none rounded-md text-base ${
                    cell.editable
                      ? "text-green-600 focus:bg-green-100"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                />
              );

            return (
              <React.Fragment key={colIndex}>
                {/* اسم المتغير */}
                <td className="px-2 py-0 font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[7ch]">
                  {cell.key || "-"}
                </td>

                {/* القيمة */}
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
