import { useDispatch,useSelector } from "react-redux";
import { updateCellValue } from "../../../../store/roaSlice";
import TableComponent from "./TableComponent";
import ROASecondTable from "./secondTable";

export default function CombinedTables() {
   const dispatch = useDispatch();
    const stationData = useSelector(state => state.roa.stationData);
    const handleValueChange = (cellKey, value) => {
    dispatch(updateCellValue({ cellKey, value }));
  };

    // 🔍 استخراج قيمة J من stationData
  const jCell = stationData
    .flat() // لأن stationData مصفوفة من صفوف
    .find((cell) => cell.key === "J");

  const JValues = jCell ? jCell.value : 1;
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
