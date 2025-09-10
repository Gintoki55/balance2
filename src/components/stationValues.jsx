import React, { useState } from "react";
import Tooltip from "@/components/Tooltip";
import { StationValueData } from "@/data/infoData";

const DataTable = () => {
  const [StationValue, setStationValue] = useState(StationValueData);

  const handleChange = (rowIndex, cellIndex, newValue) => {
    const updatedRows = [...StationValue];
    updatedRows[rowIndex][cellIndex].value = newValue;
    setStationValue(updatedRows);
  };

  return (
    <div className="flex justify-center items-center p-4 bg-white">
      <div className="overflow-x-auto w-full">
        <table className="table-auto border border-gray-300 rounded-lg shadow-md w-full">
          <tbody>
            {/* الصف الأول: فقط المسمى و Ja */}
            <tr className="border">
              {StationValue[0].slice(0, 2).map((cell, cellIndex) => (
                <React.Fragment key={cellIndex}>
                  <td className="px-3 py-2 font-semibold bg-gray-100 whitespace-nowrap">
                    {cell.key}
                  </td>
                  <td className="px-3 py-2">
                    <Tooltip text={cell.info}>
                      {cell.key === "Ja" ? (
                        <select
                          value={cell.value}
                          onChange={(e) =>
                            handleChange(0, cellIndex, e.target.value)
                          }
                          disabled={!cell.editable}
                          className={`px-2 py-1 w-24 sm:w-28 md:w-36 bg-transparent outline-none ${
                            cell.editable
                              ? "text-green-600 focus:bg-green-100"
                              : "text-gray-500 cursor-not-allowed"
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
                          value={cell.value}
                          onChange={(e) =>
                            handleChange(0, cellIndex, e.target.value)
                          }
                          disabled={!cell.editable}
                          className={`px-2 py-1 w-24 sm:w-28 md:w-36 bg-transparent outline-none ${
                            cell.editable
                              ? "text-green-600 focus:bg-green-100"
                              : "text-gray-500 cursor-not-allowed"
                          }`}
                        />
                      )}
                    </Tooltip>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* الصفوف الأخرى */}
            {StationValue.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex + 1} className="border">
                {row.map((cell, cellIndex) => (
                  <React.Fragment key={cellIndex}>
                    <td className="px-3 py-2 font-semibold bg-gray-100 whitespace-nowrap">
                      {cell.key}
                    </td>
                    <td className="px-3 py-2">
                      <Tooltip text={cell.info}>
                        {cell.key === "Ja" ? (
                          <select
                            value={cell.value}
                            onChange={(e) =>
                              handleChange(rowIndex + 1, cellIndex, e.target.value)
                            }
                            disabled={!cell.editable}
                            className={`px-2 py-1 w-24 sm:w-28 md:w-36 bg-transparent outline-none ${
                              cell.editable
                                ? "text-green-600 focus:bg-green-100"
                                : "text-gray-500 cursor-not-allowed"
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
                            value={cell.value}
                            onChange={(e) =>
                              handleChange(rowIndex + 1, cellIndex, e.target.value)
                            }
                            disabled={!cell.editable}
                            className={`px-2 py-1 w-24 sm:w-28 md:w-36 bg-transparent outline-none ${
                              cell.editable
                                ? "text-green-600 focus:bg-green-100"
                                : "text-gray-500 cursor-not-allowed"
                            }`}
                          />
                        )}
                      </Tooltip>
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
