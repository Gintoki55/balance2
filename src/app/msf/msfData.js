const msfBaseRows = [
  [
    { key: "MSF Design", value: "", editable: false, info: "NULL" },
    { key: "Jb", value: "1", editable: false, info: "Number of upper stages, Jb" },
    { key: "Ka", value: "1.00", editable: false, info: "Heat transfer correction factor for brine heater" },
    { key: "Kb", value: "1.00", editable: false, info: "Heat transfer correction factor for upper stages" },
    { key: "Kc", value: "1.00", editable: false, info: "Heat transfer correction factor for lower stages" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "Jc", value: "1", editable: false, info: "Number of lower stages, Jc" },
    { key: "Aa", value: "45638.61", editable: false, info: "Brine heater area, Aa: m2" },
    { key: "Ab", value: "77593.10", editable: false, info: "Each upper stage area, Ab: m2" },
    { key: "Ac", value: "101495.02", editable: false, info: "Each lower stage area, Ac: m2" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "cg", value: "0.99", editable: false, info: "Condensation gain" },
    { key: "δa", value: "5.00", editable: false, info: "Brine heater approach temperature" },
    { key: "δb", value: "2.00", editable: false, info: "Upper stages approach temperature" },
    { key: "δc", value: "2.00", editable: false, info: "Lower stages approach temperature" },
  ],
  [
    { key: "Ts", value: "120.00", editable: false, info: "Heating steam temperature, Ts: ⁰C" },
    { key: "Th", value: "115.00", editable: false, info: "Top brine temperature, Th: ⁰C" },
    { key: "T0", value: "30.00", editable: false, info: "Raw water temperature T0: ⁰C" },
    { key: "Tm", value: "32.19", editable: false, info: "Mixed raw water temperature, Tm: ⁰C" },
    { key: "WR", value: "11.01", editable: false, info: "Water recovery, WR;%" },
  ],
  [
    { key: "M0", value: "90796.57", editable: false, info: "Raw water, M0; t/h" },
    { key: "Mm", value: "9079.66", editable: false, info: "Brine water for mixing, Mm; t/h" },
    { key: "m", value: "0.10", editable: false, info: "Mixing ratio for raw water, m" },
    { key: "S0", value: "40.00", editable: false, info: "Raw water salinity, S0; g/l" },
    { key: "Sm", value: "40.46", editable: false, info: "Mixed raw water salinity, Sm; g/l" },
  ],
  [
    { key: "Md", value: "9999.00", editable: false, info: "Fresh water production, Md; t/h" },
    { key: "Ms", value: "3979.57", editable: false, info: "Heating steam, Ms; t/h" },
    { key: "GOR", value: "2.51", editable: false, info: "Gain output ratio, GOR =Md/Ms" },
    { key: "SEC", value: "207.24", editable: false, info: "Specific exergy consumption, SEC; MJ/t" },
    { key: "sA", value: "40.39", editable: false, info: "Specific heat transfer area, sA; m2/(t/h)" },
  ],
];





// دالة لتحديد editable حسب النوع
const makeEditableByType = (rows, type) => {
  const clone = JSON.parse(JSON.stringify(rows));

  // الحقول التي يجب تفعيلها لكل نوع
  const editableFieldsByType = {
    Design: ["Ka", "Kb", "Kc","ER","cg","δa","δb","δc","Ts","Td","T0","S0","Sh","Md"],
    Demand: ["Ka", "Kb", "Kc","ER","Aa","Ab","Ac","cg","Td","T0","S0","Sh","Md"],
    Energy:["Ka", "Kb", "Kc","ER","Aa","Ab","Ac","cg","Td","T0","S0","Sh","Ms"],
    Rating: ["Ka", "Kb", "Kc","ER","Aa","Ab","Ac","cg","Td","T0","S0","Sh","M0","Mm"],
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
  Design: makeEditableByType(msfBaseRows, "Design"),
  Demand: makeEditableByType(msfBaseRows, "Demand"),
  Energy: makeEditableByType(msfBaseRows, "Energy"),
  Rating: makeEditableByType(msfBaseRows, "Rating"),
};
