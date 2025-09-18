import React, { useState, useEffect } from "react";

const headers = [
  "j", "Pvj", "ΔTj", "Tbj", "Tvj", "Tdj",
  "Tcj", "Mbj", "mj", "Mdj", "Sbj", "Balance",
];

const defaultRow = [
  "1", "1.0000", "0.50", "1.00", "1.00",
  "1.00", "50.00", "1.00", "1.00", "1.00", "40.00", "1.0000",
];

const DataTable = ({ rowsCount }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640); // أقل من sm
    handleResize(); // التحقق عند التحميل
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tableData = Array.from({ length: rowsCount }, (_, i) => {
    return [String(i + 1), ...defaultRow.slice(1)];
  });

  // دالة لتقليص القيم إلى 4 أرقام إذا الشاشة صغيرة
  const formatCell = (value) => {
    if (!isSmallScreen) return value;
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toFixed(4); // 4 digits
  };

  return (
    <div className="w-full overflow-x-auto px-2">
      <div className="inline-block origin-top transform min-w-max mx-auto lg:mx-0">
        {/* Header */}
        <div className="flex bg-gray-100 font-semibold text-center">
          {headers.map((head, idx) => (
            <div
              key={idx}
              className="px-2 sm:px-4 py-1 sm:py-2 min-w-[90px] sm:min-w-[116px] text-[10px] sm:text-sm md:text-base"
            >
              {head}
            </div>
          ))}
        </div>

        {/* Rows */}
        {tableData.map((row, rowIndex) => (
          <div key={rowIndex} className="flex text-center">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="px-2 sm:px-4 py-1 sm:py-2 min-w-[90px] sm:min-w-[116px] text-[10px] sm:text-sm md:text-base"
              >
                {formatCell(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
