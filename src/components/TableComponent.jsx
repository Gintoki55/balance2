import React from "react";

const TableComponent = () => {
  // بيانات الجدول (ممكن تجيبها من API أو ملف خارجي)
  const tableData = [
    { j: 0, Pvj: 0.4780, ΔTj: 2.00, Tbj: 0.00, Tvj: 0.00, Tdj: 80.00, Tcj: 0.00, Mbj: 0.00, mj: 104.56, Mdj: 0.00, Sbj: 65.00, Balance: 1.0000 },
    { j: 1, Pvj: 0.4147, ΔTj: 2.12, Tbj: 77.88, Tvj: 76.64, Tdj: 76.53, Tcj: 74.53, Mbj: 164.54, mj: 101.81, Mdj: 101.81, Sbj: 65.00, Balance: 1.0000 },
    { j: 2, Pvj: 0.3587, ΔTj: 2.10, Tbj: 74.43, Tvj: 73.19, Tdj: 73.07, Tcj: 70.97, Mbj: 332.55, mj: 98.37, Mdj: 200.17, Sbj: 64.32, Balance: 1.0000 },
    // 🔽 تكمل باقي الصفوف بنفس الشكل ...
    { j: 12, Pvj: 0.0744, ΔTj: 1.54, Tbj: 41.67, Tvj: 40.42, Tdj: 40.00, Tcj: 38.00, Mbj: 2198.37, mj: 67.94, Mdj: 1000.00, Sbj: 58.38, Balance: 1.0000 },
  ];

  const headers = ["j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj", "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance"];

  return (
    <div className="flex justify-center items-center p-4 bg-white">
      <div className="overflow-x-auto w-full">
        <table className="table-auto border border-gray-300 rounded-lg shadow-md w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((head, index) => (
                <th key={index} className="px-3 py-2 border text-center font-semibold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t text-center">
                {headers.map((col, colIndex) => (
                  <td key={colIndex} className="px-3 py-2 border">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
