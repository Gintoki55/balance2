const ROAbaseColumns = [
  [
    { key: "ROA Design", value: "", editable: false, info: "NULL" },
    { key: "N", value: 1, editable: false, info: "Trains in the plant, Na # About Na = 1 ∼ Md/500" },
    { key: "A", value: 10.00, editable: false, info: "Element active area, A; m2" },
    { key: "FF", value: 10.00, editable: false, info: "Fouling factor, FF" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "J", value:1, editable: false, info: "Number of membrane elements in pressure vessel, J recommended range: 1 ~ 9" },
    { key: "PV", value: 10.00, editable: false, info: "Pressure vessels in stage, PVa" },
    { key: "T0", value: 10.00, editable: false, info: "Raw water Temperature, T0; ⁰C Recommended range: 10 ~ 50" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "l", value: 10.00, editable: false, info: "Return ratio, l; (Mr/M0) Recommended range: 0 ~ 1" },
    { key: "w", value: 10.00, editable: false, info: "Water permability, w; l/m2.h.bar" },
    { key: "x", value: 10.00, editable: false, info: "Salt permability, x; g/m2.h.(g/l)" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "Pf", value: 10000, editable: false, info: "Feed water pressure, Pf; bar" },
    { key: "Pp", value: 10000, editable: false, info: "Permeate water pressure, Pp; bar Normally Pp=0" },
    { key: "SR", value: 10000, editable: false, info: "Salt rejection, SR; % SR=100*(1-Sd/S0)" },
  ],
  [
    { key: "", value: "", editable: false, info: "" },
    { key: "M0", value: 10000, editable: false, info: "Raw water, M0; t/h" },
    { key: "S0", value: 4000, editable: false, info: "Raw water salinity, S0; g/l Recommended range: 1 ~ 50" },
    { key: "Sd", value: 4000, editable: false, info: "Product water salinity, Sd; g/l Recommended range: 0.100 ~ 0.500" },
  ],
  [
    { key: "Md", value: 1000, editable: false, info: "Fresh water production, Md; t/h Recommended range: 1 ~ 9999" },
    { key: "WR", value: 1000, editable: false, info: "Water recovery, WR; % where WR=100*Md/M0"},
    { key: "SEC", value: 1000, editable: false, info: "Specific exergy consumption, SEC; MJ/t 1 kWh = 3.6 MJ" },
    { key: "sA", value: 1000, editable: false, info: "Specific area, sA; m2/(t/h)" },
  ],
];





// تصدير البيانات حسب النوع
export const StationValueData = ROAbaseColumns;