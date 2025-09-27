const ROAbaseColumns = [
  [
    { key: "ROA Design", value: "", editable: false, info: "NULL" },
    { key: "N", value: "1", editable: false, info: "Trains in the plant, Na # About Na = 1 ∼ Md/500" },
    { key: "A", value: "1.00", editable: false, info: "Element active area, A; m2" },
    { key: "FF", value: "1.00", editable: false, info: "Fouling factor, FF" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "J", value: "1", editable: false, info: "Number of membrane elements in pressure vessel, J recommended range: 1 ~ 9" },
    { key: "PV", value: "45638.61", editable: false, info: "Pressure vessels in stage, PVa" },
    { key: "T0", value: "77593.10", editable: false, info: "Raw water Temperature, T0; ⁰C Recommended range: 10 ~ 50" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "l", value: "0.99", editable: false, info: "Return ratio, l; (Mr/M0) Recommended range: 0 ~ 1" },
    { key: "w", value: "5.00", editable: false, info: "Water permability, w; l/m2.h.bar" },
    { key: "x", value: "2.00", editable: false, info: "Salt permability, x; g/m2.h.(g/l)" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "Pf", value: "120.00", editable: false, info: "Feed water pressure, Pf; bar" },
    { key: "Pp", value: "115.00", editable: false, info: "Permeate water pressure, Pp; bar Normally Pp=0" },
    { key: "SR", value: "30.00", editable: false, info: "Salt rejection, SR; % SR=100*(1-Sd/S0)" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "M0", value: "90796.57", editable: false, info: "Raw water, M0; t/h" },
    { key: "S0", value: "40.00", editable: false, info: "Raw water salinity, S0; g/l Recommended range: 1 ~ 50" },
    { key: "Sd", value: "40.00", editable: false, info: "Product water salinity, Sd; g/l Recommended range: 0.100 ~ 0.500" },
  ],
  [
    { key: "Md", value: "9999.00", editable: false, info: "Fresh water production, Md; t/h Recommended range: 1 ~ 9999" },
    { key: "WR", value: "3979.57", editable: false, info: "Water recovery, WR; % where WR=100*Md/M0"},
    { key: "SEC", value: "207.24", editable: false, info: "Specific exergy consumption, SEC; MJ/t 1 kWh = 3.6 MJ" },
    { key: "sA", value: "40.39", editable: false, info: "Specific area, sA; m2/(t/h)" },
  ],
];





// دالة لتحديد editable حسب النوع
const makeEditableByType = (rows, type) => {
  const clone = JSON.parse(JSON.stringify(rows));

  // الحقول التي يجب تفعيلها لكل نوع
  const editableFieldsByType = {
    Design: ["N", "A", "FF","J","T0","l","w","x","Pp","S0","Sd","Md","WR"],
    Demand: ["A", "FF", "PV","T0","l","w","x","Pp","S0","Sd","Md"],
    Energy: ["A", "FF", "PV","T0","l","w","x","Pf","Pp","S0","Sd"],
    Rating: ["N", "A", "FF","J","PV","T0","l","w","x","Pf","Pp","M0","S0"],
  };

  const editableKeys = editableFieldsByType[type] || [];

  clone.forEach(row => {
    row.forEach(cell => {
      if (editableKeys.includes(cell.key)) {
        cell.editable = true;
      }
    });
  });

  return clone;
};

// تصدير البيانات حسب النوع
export const StationValueData = {
  Design: makeEditableByType(ROAbaseColumns, "Design"),
  Demand: makeEditableByType(ROAbaseColumns, "Demand"),
  Energy: makeEditableByType(ROAbaseColumns, "Energy"),
  Rating: makeEditableByType(ROAbaseColumns, "Rating"),
};
