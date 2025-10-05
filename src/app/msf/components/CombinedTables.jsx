"use client";
import React, { useEffect } from "react";
import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";
import { useStationStore } from "../store/jStore";

const CombinedTables = ({ stationName, stationData, fileName }) => {

  const jbValue = useStationStore((s) => s.data[fileName]?.[stationName]?.jb ?? 2);
  const setJb = useStationStore((s) => s.setJb);

  const jcValue = useStationStore((s) => s.data[fileName]?.[stationName]?.jc ?? 2);
  const setJc = useStationStore((s) => s.setJc);

  // ✅ عند تغيير المحطة، نعيد Jb و Jc ونحفظ آخر سيناريو


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
            {/* الجدول الأول */}
            <TableComponent
              stationName={stationName}
              stationData={stationData}
              JbValue={jbValue}
              onJbChange={(newJb) => setJb(fileName, stationName, newJb)}
              JcValue={jcValue}
              onJcChange={(newJc) => setJc(fileName, stationName, newJc)}
            />

            {/* فاصل */}
            <tr>
              <td colSpan={12} className="border-t border-gray-400 bg-gray-200 py-1"></td>
            </tr>

            {/* الجدول الثاني */}
            <SecondTable JbValue={jbValue} JcValue={jcValue}/>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTables;
