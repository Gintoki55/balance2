"use client";
import React from "react";
import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";
import { useJaStore } from "../store/jaStore";

const CombinedTables = ({ stationName, stationData, fileName }) => {
  const jaValue = useJaStore((s) => s.data[fileName]?.[stationName]?.ja ?? 2);
  const setJa = useJaStore((s) => s.setJa);

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-[1000px] scale-95">
        <table className="table-fixed border border-gray-300 rounded-lg shadow-md text-base w-full">
          <tbody>
            {/* الجدول الأول */}
            <TableComponent
              stationName={stationName}
              stationData={stationData}
              jaValue={jaValue}
              onJaChange={(newJa) => setJa(fileName, stationName, newJa)}
            />

            {/* خط فاصل داخلي */}
            <tr>
              <td
                colSpan={stationData[0]?.length * 2.5 || 12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              />
            </tr>

            {/* الجدول الثاني */}
            <SecondTable
              jaValue={jaValue} // مرر نفس القيمة من الـ store
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTables;
