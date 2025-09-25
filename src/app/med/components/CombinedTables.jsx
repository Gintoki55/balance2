"use client";
import React, { useState, useEffect } from "react";
import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";
import { useJaStore } from "../store/jaStore";

const CombinedTables = ({ stationName, stationData }) => {
    const ja = useJaStore((s) => s.ja[stationName] ?? 1); 
    const setJa = useJaStore((s) => s.setJa);
    const resetJa = useJaStore((s) => s.resetJa);

     useEffect(() => {
      if (stationData) {
        resetJa(stationName);
      }
     }, [stationData, stationName, resetJa]);


  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-[1000px] scale-95">
        <table className="table-fixed border border-gray-300 rounded-lg shadow-md text-base w-full">
          <tbody>
            {/* الجدول الأول */}
            <TableComponent
              stationName={stationName}
              stationData={stationData}
              jaValue={ja}
              onJaChange={(newJa) => setJa(stationName, newJa)}
            />

            {/* خط فاصل داخلي */}
            <tr>
              <td
                colSpan={stationData[0]?.length * 2 || 12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              ></td>
            </tr>

            {/* الجدول الثاني (كمبوننت منفصل) */}
             <SecondTable stationName={stationName}/>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTables;
