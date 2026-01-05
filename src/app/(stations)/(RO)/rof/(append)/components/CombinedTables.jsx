import { useDispatch,useSelector } from "react-redux";
import { updateCellValue } from "../../../../../store/rofSlice";
import TableComponent from "./TableComponent";
import ROFSecondTable from "./secondTable";

export default function CombinedTables() {
   const dispatch = useDispatch();
    const stationData = useSelector(state => state.rof.stationData);
    const activeIndex = useSelector(state => state.rof.activeIndex);
    const handleValueChange = (cellKey, value, index) => {
      dispatch(updateCellValue({ cellKey, value, index }));
    };

       // 🔍 استخراج قيمة J من stationData
      const jaCell = stationData.flat().find((cell) => cell.key === "Ja");
      const jbCell = stationData.flat().find((cell) => cell.key === "Jb");
      const jcCell = stationData.flat().find((cell) => cell.key === "Jc");
      const jdCell = stationData.flat().find((cell) => cell.key === "Jd");
      

      const jaValue = jaCell?.value?.[0] ?? 2;
      const jbValue = jbCell?.value?.[0] ?? 2;
      const jcValue = jcCell?.value?.[0] ?? 2;
      const jdValue = jdCell?.value?.[0] ?? 2;

      const JValues = [jaValue,jbValue, jcValue,jdValue]
      console.log("here is the data: ", JValues)

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
            />

            <tr>
              <td
                colSpan={12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              ></td>
            </tr>
            <ROFSecondTable JValues={JValues} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
