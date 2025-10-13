import TableComponent from "./TableComponent";
import SecondTable from "./secondTable";

export default function CombinedTables({ stationName, stationData, fileName, jValue, onJChange }) {
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
