const ROAbaseColumns = [
  [
    { key: "ROA", value: "Design", editable: false, info: "NULL" },
    { key: "N", value: 1, editable: false, info: "Trains in the plant Na,About 1 ∼ Md/500" },
    { key: "A", value: 1.00, editable: false, info: "Element active area A [m²]" },
    { key: "FF", value: 1.00, editable: false, info: "Fouling factor FF" },
  ],
  [
    { key: "", value: "-", editable: false, info: "" },
    { key: "J", value:1, editable: false, info: "Elements in the pressure vessel J,about 1 ~ 9" },
    { key: "PV", value: 10.00, editable: false, info: "Pressure vessels in the stage PV" },
    { key: "T0", value: 10.00, editable: false, info: "Raw water Temperature T0 [⁰C],about 10 ~ 37" },
  ],
  [
    { key: "", value: "-", editable: false, info: "" },
    { key: "l", value: 10.00, editable: false, info: "Brine return ratio l, Mr/M0 Recommended range: 0 ~ 1" },
    { key: "w", value: 10.00, editable: false, info: "Water permability w [l/m².h.bar]" },
    { key: "x", value: 10.00, editable: false, info: "Salt permability x [g/m².h.(g/l)]" },
  ],
  [
    { key: "", value: "-", editable: false, info: "" },
    { key: "Pf", value: 10000, editable: false, info: "Feed water pressure Pf [bar]" },
    { key: "Pp", value: 10000, editable: false, info: "Permeate water pressure Pp [bar],normally Pp = 0" },
    { key: "SR", value: 10000, editable: false, info: "Overal salt rejection SR [%]" },
  ],
  [
    { key: "", value: "-", editable: false, info: "" },
    { key: "M0", value: 4000, editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "S0", value: 4000, editable: false, info: "Raw water salinity S0 [g/l],about 1 ~ 50" },
    { key: "Sd", value: 4000, editable: false, info: "Product water salinity Sd [g/l],about 0.100 ~ 0.500" },
  ],
  [
    { key: "Md", value: 1000, editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "WR", value: 1000, editable: false, info: "Water recovery WR [%],where WR =100*Md/M0"},
    { key: "SEC", value: 1000, editable: false, info: "Specific exergy consumption SEC [MJ/t],where 1 [kWh] = 3.6 [MJ]" },
    { key: "sA", value: 1000, editable: false, info: "Specific active area sA [m²/(t/h)]" },
  ],
];

// تصدير البيانات حسب النوع
export const StationValueData = ROAbaseColumns;