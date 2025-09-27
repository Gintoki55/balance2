"use client";
import React, { useState, useEffect } from "react";
import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";
import { useJbStore } from "../store/jbStore";
import { useJcStore } from "../store/jcStore";

const CombinedTables = ({ stationName, stationData }) => {

   ///// Jb ////////
    const Jb = useJbStore((s) => s.jb[stationName] ?? 1); 
    const setJb = useJbStore((s) => s.setJb);
    const resetJb = useJbStore((s) => s.resetJb);

     useEffect(() => {
      if (stationData) {
        resetJb(stationName);
      }
     }, [stationData, stationName, resetJb]);


  ///// JC ////////
    const Jc = useJcStore((s) => s.jc[stationName] ?? 1); 
    const setJc = useJcStore((s) => s.setJc);
    const resetJc = useJcStore((s) => s.resetJc);

     useEffect(() => {
      if (stationData) {
        resetJc(stationName);
      }
     }, [stationData, stationName, resetJc]);


  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-[1000px] scale-95">
        <table className="table-fixed border border-gray-300 rounded-lg shadow-md text-base w-full">
          <colgroup>
            {Array.from({ length: 12 }).map((_, i) => (
              <col key={i} className="w-[8.33%]" />
            ))}
          </colgroup>
          <tbody>
            <TableComponent
              stationName={stationName}
              stationData={stationData}
              ///Jb///
              JbValue={Jb}
              onJbChange={(newJb) => setJb(stationName, newJb)}
              ////Jc///
              JcValue={Jc}
              onJcChange={(newJc) => setJc(stationName, newJc)}
            />

            <tr>
              <td
                colSpan={12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              ></td>
            </tr>

            <SecondTable stationName={stationName} />
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default CombinedTables;
