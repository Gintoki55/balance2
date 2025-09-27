"use client";
import React, { useState, useEffect } from "react";
import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";
import { useNStore } from "../store/NStore";
import { useJStore } from "../store/jStore";

const CombinedTables = ({ stationName, stationData }) => {

   ///// N ////////
    const N = useNStore((s) => s.n[stationName] ?? 1); 
    const setN = useNStore((s) => s.setN);
    const resetN = useNStore((s) => s.resetN);

     useEffect(() => {
      if (stationData) {
        resetN(stationName);
      }
     }, [stationData, stationName, resetN]);


  ///// J ////////
    const J = useJStore((s) => s.j[stationName] ?? 1); 
    const setJ = useJStore((s) => s.setJ);
    const resetJ = useJStore((s) => s.resetJ);

     useEffect(() => {
      if (stationData) {
        resetJ(stationName);
      }
     }, [stationData, stationName, resetJ]);


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
              ///N///
              NValue={N}
              onNChange={(newN) => setN(stationName, newN)}
              ////J///
              JValue={J}
              onJChange={(newJ) => setJ(stationName, newJ)}
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
