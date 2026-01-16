import { useDispatch,useSelector } from "react-redux";
import { updateCellValue } from "../../../../../store/roaSlice";
import TableComponent from "./TableComponent";
import ROASecondTable from "./secondTable";
import { useEffect } from "react";
import { fetchFileData } from "@/app/store/roaSlice";
export default function CombinedTables() {
   const dispatch = useDispatch();
    const stationData = useSelector(state => state.roa.stationData);
    const activeIndex = useSelector(state => state.roa.activeIndex);
     const selectedFile = useSelector((state) => state.roa.selectedFile);
    const handleValueChange = (cellKey, value, index) => {
      dispatch(updateCellValue({ cellKey, value, index }));
    };

const jCell = stationData?.flat()?.find((cell) => cell.key === "J");

const JValues = jCell
  ? Array.isArray(jCell.value)
    ? jCell.value
    : [jCell.value]
  : [1];
  console.log("here is the data 2: ", JValues)

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

            <ROASecondTable JValues={JValues} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
