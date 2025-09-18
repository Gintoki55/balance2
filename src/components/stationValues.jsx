"use client";
import React, { useState, useEffect } from "react";
import Tooltip from "@/components/Tooltip";

const DataTable = ({ stationName, stationData, onJaChange }) => {
  const [StationValue, setStationValue] = useState([]);
  const [isMediumOrSmaller, setIsMediumOrSmaller] = useState(false);

  useEffect(() => {
    if (stationData) setStationValue(stationData);
  }, [stationData]);

  useEffect(() => {
    const handleResize = () =>
      setIsMediumOrSmaller(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (rowIndex, cellIndex, newValue) => {
    const updatedRows = [...StationValue];
    updatedRows[rowIndex][cellIndex].value = newValue;
    setStationValue(updatedRows);

    if (updatedRows[rowIndex][cellIndex].key === "Ja" && onJaChange) {
      onJaChange(Number(newValue));
    }
  };

  // تحويل أي أرقام عربية إلى إنجليزية
  const toEnglishDigits = (str) => {
    return String(str).replace(/[٠-٩]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0x0660)
    );
  };

  const formatValue = (value) => {
    if (!isMediumOrSmaller) return toEnglishDigits(value);
    const num = Number(toEnglishDigits(value));
    if (isNaN(num)) return toEnglishDigits(value);
    return toEnglishDigits(num.toFixed(4));
  };

  return (
    <div className="w-full flex justify-center overflow-x-auto px-2">
      <div className="inline-block origin-top transform min-w-[320px]">
        <table className="table-fixed border border-gray-300 rounded-lg shadow-md text-xs sm:text-sm md:text-base w-full">
          <tbody>
            {StationValue.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) =>
                  cell.key === "MED Design" ? (
                    <td
                      key={cellIndex}
                      colSpan={2}
                      className="px-2 sm:px-4 py-2 sm:py-3 font-bold text-gray-800 bg-gray-200 text-center text-[clamp(10px,2vw,16px)]"
                    >
                      {stationName}
                    </td>
                  ) : (
                    <React.Fragment key={cellIndex}>
                      <td className="px-1 sm:px-2 py-1 sm:py-2 font-semibold bg-gray-100 text-center text-[clamp(8px,1.5vw,14px)] min-w-[5ch] sm:min-w-[6ch] md:min-w-[7ch]">
                        {cell.key}
                      </td>
                      <td className="px-1 sm:px-2 py-1 sm:py-2 text-center text-[clamp(8px,1.5vw,14px)] min-w-[5ch] sm:min-w-[6ch] md:min-w-[7ch] max-w-[10ch]">
                        <Tooltip text={cell.info}>
                          {cell.key === "Ja" ? (
                            <select
                              value={cell.value}
                              onChange={(e) =>
                                handleChange(rowIndex, cellIndex, e.target.value)
                              }
                              className={`block w-full px-2 py-1 sm:px-2 sm:py-2 outline-none rounded-md text-[clamp(8px,1.5vw,14px)] text-left ${
                                isMediumOrSmaller ? "appearance-none" : "appearance-auto"
                              }`}
                            >
                              {Array.from({ length: 30 }, (_, i) => i + 1).map(
                                (num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                )
                              )}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={formatValue(cell.value)}
                              onChange={(e) =>
                                handleChange(
                                  rowIndex,
                                  cellIndex,
                                  toEnglishDigits(e.target.value)
                                )
                              }
                              disabled={!cell.editable}
                              inputMode="decimal"
                              className={`block w-full px-1 sm:px-2 py-1 sm:py-2 text-center outline-none rounded-md text-[clamp(8px,1.5vw,14px)]
                                ${cell.editable ? "text-green-600 focus:bg-green-100" : "text-gray-500 cursor-not-allowed"}
                              `}
                              style={{
                                MozAppearance: "textfield", // Firefox
                                WebkitAppearance: "none",   // Chrome, Safari, Edge
                                margin: 0
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
