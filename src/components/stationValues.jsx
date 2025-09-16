"use client";
import React, { useState, useEffect } from "react";
import Tooltip from "@/components/Tooltip";

const DataTable = ({ stationName, stationData , onJaChange}) => {
  const [StationValue, setStationValue] = useState([]);


  useEffect(() => {
    if (stationData) setStationValue(stationData);
  }, [stationData]);

  const handleChange = (rowIndex, cellIndex, newValue) => {
    const updatedRows = [...StationValue];
    updatedRows[rowIndex][cellIndex].value = newValue;
    setStationValue(updatedRows);

    // ✅ إذا كان المفتاح Ja استدعي الـ onJaChange
    if (updatedRows[rowIndex][cellIndex].key === "Ja" && onJaChange) {
      onJaChange(Number(newValue)); // نحولها رقم
    }
  };

  return (
<div className="w-full flex justify-center">
  <div
    className="px-2
    origin-top transform
    2xl:scale-100   /* xxl */
    xl:scale-95      /* xl */
    lg:scale-90      /* lg */
    md:scale-80      /* md */
    sm:scale-70      /* sm */
    max-sm:scale-40
  "
  >
    <table className="table-auto border border-gray-300 rounded-lg shadow-md">
          <tbody>
            {StationValue.map((row, rowIndex) => (
              <tr key={rowIndex} >
                {row.map((cell, cellIndex) =>
                  // ✅ استبدل MED Design باسم المحطة من prop
                  cell.key === "MED Design" ? (
                    <td
                      key={cellIndex}
                      colSpan={2}
                      className="px-3 py-2 font-bold text-gray-800 bg-gray-200"
                    >
                      {stationName}
                    </td>
                  ) : (
                    <React.Fragment key={cellIndex}>
                      <td className="px-3 py-2 font-semibold bg-gray-100 whitespace-nowrap">
                        {cell.key}
                      </td>
                      <td className="p-0 text-center">
                        <Tooltip text={cell.info}>
                          {cell.key === "Ja" ? (
                            <select
                              value={cell.value}
                              onChange={(e) =>
                                handleChange(rowIndex, cellIndex, e.target.value)
                              }
                              className="w-full h-full max-sm:w-[100px]  px-2 py-2 outline-none  focus:ring-0 text-blue-500"
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
                              value={cell.value}
                              onChange={(e) =>
                                handleChange(rowIndex, cellIndex, e.target.value)
                              }
                              disabled={!cell.editable}
                              className={`block w-full h-full max-sm:w-[100px]  px-2 py-2 text-center outline-none focus:ring-0 ${
                                cell.editable
                                  ? "text-green-600 focus:bg-green-100"
                                  : "text-gray-500 cursor-not-allowed"
                              }`}
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
