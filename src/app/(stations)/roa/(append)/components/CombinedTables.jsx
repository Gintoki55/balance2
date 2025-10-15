import { useDispatch ,useSelector} from "react-redux";
import { updateCellValue } from "../../(data)/store/stationSlice";
import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";

export default function CombinedTables({ stationName, jValue, onJChange }) {
   const dispatch = useDispatch();
    const stationData = useSelector(state => state.station.stationData);
    const handleValueChange = (cellKey, value) => {
    dispatch(updateCellValue({ cellKey, value }));
  };
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
              onValueChange={handleValueChange}
              jValue={jValue}
              onJChange={onJChange}
            />

            <tr>
              <td
                colSpan={12}
                className="border-t border-gray-400 bg-gray-200 py-1"
              ></td>
            </tr>

            <SecondTable jValue={jValue} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
