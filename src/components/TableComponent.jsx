import React from "react";

const headers = [
  "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
  "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance",
];

const defaultRow = [
  "1", "1.0000", "0.50", "1.00", "1.00",
  "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000",
];

// هنا نحدد الأطوال (px) لكل عمود بالترتيب
const colWidths = [
  "min-w-[100px]", // j
  "min-w-[130px]", // Pvj
  "min-w-[100px]",  // ΔTj
  "min-w-[130px]", // Tbj
  "min-w-[100px]",  // Tvj
  "min-w-[130px]", // Tdj
  "min-w-[100px]", // Tcj
  "min-w-[130px]", // Mbj
  "min-w-[100px]",  // mj
  "min-w-[130px]", // Mdj
  "min-w-[100px]", // Sbj
  "min-w-[130px]", // Balance
];

const DataTable = ({ rowsCount }) => {
  const tableData = Array.from({ length: rowsCount }, (_, i) => {
    return [String(i + 1), ...defaultRow.slice(1)];
  });

  return (
    <div className="w-full overflow-hidden flex justify-center">
      {/* الحاوية الخارجية اللي نطبق عليها التصغير */}
      <div
       className="
          origin-top transform inline-block
          2xl:scale-100   /* ≥1536px */
          xl:scale-100    /* ≥1280px */
          lg:scale-80     /* ≥1024px */
          md:scale-60     /* ≥768px */
          sm:scale-50     /* ≥640px */
          max-sm:scale-40 /* <640px */
        "
      >
        {/* الجدول */}
        <div className="min-w-max">
          {/* Header */}
          <div className="flex bg-gray-100 font-semibold text-center">
            {headers.map((head, idx) => (
              <div
                key={idx}
                className={`px-2 py-2 border-gray-300  ${colWidths[idx]}`}
              >
                {head}
              </div>
            ))}
          </div>

          {/* Rows */}
          {tableData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex border-gray-300 text-center"
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`px-2 py-2 border-gray-200 ${colWidths[cellIndex]}`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
