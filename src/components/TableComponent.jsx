"use client";
import React from "react";
import Tooltip from "@/components/Tooltip";
import { FaArrowsUpDown } from "react-icons/fa6"; // استدعاء الأيقونة
const TableComponent = ({ stationName, stationData, onJaChange }) => {
  const handleChange = (rowIndex, cellIndex, newValue) => {
    const updatedRows = [...stationData];
    updatedRows[rowIndex][cellIndex].value = newValue;

    if (updatedRows[rowIndex][cellIndex].key === "Ja" && onJaChange) {
      onJaChange(Number(newValue));
    }
  };

  const toEnglishDigits = (str) =>
    String(str).replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660));

  const formatValue = (value) => toEnglishDigits(value);

  return (
    <>
      {stationData.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) =>
            cell.key === "MED Design" ? (
              <td
                key={cellIndex}
                colSpan={2}
                className="px-4 py-0 font-bold text-gray-800 bg-gray-200 text-center text-lg"
              >
                MED {stationName}
              </td>
            ) : (
              <React.Fragment key={cellIndex}>
                <td className="px-2 py-0 font-semibold bg-gray-100 text-center text-sm sm:text-base min-w-[7ch]">
                  {cell.key}
                </td>
                <td className="px-2 py-0 text-center text-sm sm:text-base min-w-[7ch] max-w-[12ch]">
                  <Tooltip text={cell.info}>
                    {cell.key === "Ja" ? (
                      <div className="relative w-full">
                        <select
                          value={cell.value}
                          onChange={(e) =>
                            handleChange(rowIndex, cellIndex, e.target.value)
                          }
                          className="block w-full px-2 py-1 pr-8 outline-none text-base appearance-none min-w-[5ch] cursor-pointer"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(
                            (num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            )
                          )}
                        </select>

                        {/* أيقونة بدل السهم */}
                        <FaArrowsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formatValue(cell.value)}
                        onChange={(e) =>
                          handleChange(rowIndex, cellIndex, toEnglishDigits(e.target.value))
                        }
                        disabled={!cell.editable}
                        inputMode="decimal"
                        className={`block w-full px-2 py-1 text-center outline-none rounded-md text-base ${
                          cell.editable
                            ? "text-green-600 focus:bg-green-100"
                            : "text-gray-500 cursor-not-allowed"
                        } min-w-[5ch]`}
                        style={{
                          MozAppearance: "textfield",
                          WebkitAppearance: "none",
                          margin: 0,
                        }}
                      />
                    )}
                  </Tooltip>
                </td>
              </React.Fragment>
            )
          )}
        </tr>
      ))}
    </>
  );
};

export default TableComponent;
