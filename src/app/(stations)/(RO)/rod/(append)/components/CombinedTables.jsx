import { useDispatch,useSelector } from "react-redux";
import { updateCellValue } from "../../../../../store/rodSlice";
import TableComponent from "./TableComponent";
import RODSecondTable from "./secondTable";
import { useEffect } from "react";
import { fetchFileData } from "@/app/store/rodSlice";

export default function CombinedTables() {
   const dispatch = useDispatch();
    const stationData = useSelector(state => state.rod.stationData);
    const activeIndex = useSelector(state => state.rod.activeIndex);
    const selectedFile = useSelector((state) => state.rod.selectedFile);

    const handleValueChange = (cellKey, value, index) => {
      dispatch(updateCellValue({ cellKey, value, index }));
    };

       // 🔍 استخراج قيمة J من stationData
      const jaCell = stationData?.flat()?.find((cell) => cell.key === "Ja");
      const jcCell = stationData?.flat()?.find((cell) => cell.key === "Jc");
      const jdCell = stationData?.flat()?.find((cell) => cell.key === "Jd");
      
      const jaValue = Array.isArray(jaCell?.value) ? jaCell.value[0] : jaCell?.value ?? 2;
      const jcValue = Array.isArray(jcCell?.value) ? jcCell.value[0] : jcCell?.value ?? 2;
      const jdValue = Array.isArray(jdCell?.value) ? jdCell.value[0] : jdCell?.value ?? 2;

      const JValues = [jaValue,jcValue, jdValue]
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
            <RODSecondTable JValues={JValues} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
