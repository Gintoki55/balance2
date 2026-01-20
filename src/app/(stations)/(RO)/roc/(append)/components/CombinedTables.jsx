import { useDispatch,useSelector } from "react-redux";
import { updateCellValue } from "../../../../../store/rocSlice";
import TableComponent from "./TableComponent";
import { useEffect } from "react";
import { fetchFileData } from "@/app/store/rocSlice";
import ROSecondTable from "../../../system/secondTable";
  export default function CombinedTables() {
      const dispatch = useDispatch();
      const stationData = useSelector(state => state.roc.stationData);
      const activeIndex = useSelector(state => state.roc.activeIndex);
      const selectedFile = useSelector((state) => state.roc.selectedFile);

      const handleValueChange = (cellKey, value, index) => {
        dispatch(updateCellValue({ cellKey, value, index }));
      };

       // 🔍 استخراج قيمة J من stationData
      const jaCell = stationData?.flat()?.find((cell) => cell.key === "Ja");
      const jcCell = stationData?.flat()?.find((cell) => cell.key === "Jc");
        
      const jaValue = Array.isArray(jaCell?.value) ? jaCell.value[0] : jaCell?.value ?? 1;
      const jcValue = Array.isArray(jcCell?.value) ? jcCell.value[0] : jcCell?.value ?? 1;

      const JValues = [jaValue,jcValue]
      console.log("here is the data: ", JValues)


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
