import { useDispatch,useSelector } from "react-redux";
import { updateCellValue } from "../../../../../store/rofSlice";
import TableComponent from "./TableComponent";
import { useEffect } from "react";
import { fetchFileData } from "@/app/store/rofSlice";
import ROSecondTable from "../../../system/secondTable";
import { rofRules } from "./scenario";

export default function CombinedTables() {
   const dispatch = useDispatch();
    const stationData = useSelector(state => state.rof.stationData);
    const activeIndex = useSelector(state => state.rof.activeIndex);
    const selectedFile = useSelector((state) => state.rof);
    const handleValueChange = (cellKey, value, index) => {
      dispatch(updateCellValue({ cellKey, value, index }));
    };

       // 🔍 استخراج قيمة J من stationData
      const jaCell = stationData?.flat()?.find((cell) => cell.key === "Ja");
      const jbCell = stationData?.flat()?.find((cell) => cell.key === "Jb");
      const jcCell = stationData?.flat()?.find((cell) => cell.key === "Jc");
      const jdCell = stationData?.flat()?.find((cell) => cell.key === "Jd");
      
      const jaValue = Array.isArray(jaCell?.value) ? jaCell.value[0] : jaCell?.value ?? 1;
      const jbValue = Array.isArray(jbCell?.value) ? jbCell.value[0] : jbCell?.value ?? 1;
      const jcValue = Array.isArray(jcCell?.value) ? jcCell.value[0] : jcCell?.value ?? 1;
      const jdValue = Array.isArray(jdCell?.value) ? jdCell.value[0] : jdCell?.value ?? 1;

      const JValues = [jaValue,jbValue, jcValue,jdValue]
      console.log("here is the data ROF: ", JValues)


      useEffect(() => {
        if (!stationData || stationData.length === 0) {
          dispatch(fetchFileData("New Plant"));
        }
      }, []);

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
              stationData={stationData}
              onValueChange={handleValueChange}
              activeIndex={activeIndex}
              selectedFile={selectedFile}
              scenarioKey="ROF"
              rules={rofRules}
            />

            <tr>
              <td
                colSpan={12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              ></td>
            </tr>
            <ROSecondTable JValues={JValues} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
