import { useDispatch, useSelector} from "react-redux";
import { updateCellValue } from "@/app/store/msfSlice";
import TableComponent from "./TableComponent";
import MSFSecondTable from "./secondTable";


const CombinedTables = () => {
    const dispatch = useDispatch();
    const stationData = useSelector(state => state.msf.stationData);
    const handleValueChange = (cellKey, value) => {
      dispatch(updateCellValue({ cellKey, value }));
    };


       // 🔍 استخراج قيمة J من stationData
  const jbCell = stationData.flat().find((cell) => cell.key === "Jb");
  const jcCell = stationData.flat().find((cell) => cell.key === "Jc");

  const jbValue = jbCell ? jbCell.value : 2;
  const jcValue = jcCell ? jcCell.value : 2;

  const JValues = [jbValue,jcValue]

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
              stationData={stationData}
              onValueChange={handleValueChange}
            />

            {/* فاصل */}
            <tr>
              <td colSpan={12} className="border-t border-gray-400 bg-gray-200 py-1"></td>
            </tr>

            {/* الجدول الثاني */}
            <MSFSecondTable JValues={JValues}/>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTables;
