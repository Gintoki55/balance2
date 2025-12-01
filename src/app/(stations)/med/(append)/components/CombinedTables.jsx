import { useDispatch, useSelector} from "react-redux";
import { updateCellValue } from "@/app/store/medSlice";
import TableComponent from "./TableComponent";
import MEDSecondTable from "./secondTable";

const CombinedTables = () => {

    const dispatch = useDispatch();
    const stationData = useSelector(state => state.med.stationData);
    const handleValueChange = (cellKey, value) => {
      dispatch(updateCellValue({ cellKey, value }));
    };
    const jaCell = stationData.flat().find((cell) => cell.key === "Ja");
    const JValues = jaCell ? jaCell.value : 1;


  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-[1000px] scale-95">
        <table className="table-fixed border border-gray-300 rounded-lg shadow-md text-base w-full">
          <tbody>
            {/* الجدول الأول */}
            <TableComponent
              stationData={stationData}
              onValueChange={handleValueChange}
            />

            {/* خط فاصل داخلي */}
            <tr>
              <td
                colSpan={stationData[0]?.length * 2.5 || 12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              />
            </tr>

            {/* الجدول الثاني */}
            <MEDSecondTable
              JValues={JValues} // مرر نفس القيمة من الـ store
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTables;
