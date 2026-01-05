const ROBbaseColumns = [
  [
    { key: "ROB", value: "Design", editable: false, info: "NULL" },
    { key: "N", value: [1], editable: false, info: "Trains in the plant Na,About 1 ∼ Md/500" },
    { key: "Ja", value: [2], editable: false, info: "Elements in the pressure vessel J,about 1 ~ 9" },
    { key: "Jb", value: [2], editable: false, info: "Elements in the pressure vessel J,about 1 ~ 9" },
    { key: "T0", value: [10.0], editable: false, info: "Raw water Temperature T0 [⁰C],about 10 ~ 37" },
    // F
  ],
  [
    { key: "FF", value: [1000, 1000], editable: false, info: "Fouling factor FF" },
    { key: "A", value: [40900, 40900], editable: false, info: "Element active area A [m²]" },
    { key: "w", value: [1018, 1018], editable: false, info: "Water permability w [l/m².h.bar]" },
    { key: "x", value: [0.074, 0.074], editable: false, info: "Salt permability x [g/m².h.(g/l)]" },
    { key: "-", value: [0, 0], editable: false, info: "" },
    // F
  ],
  [
    { key: "Pf", value: [1000, 1000], editable: false, info: "Feed water pressure Pf [bar]" },
    { key: "Pp", value: [4000, 1000], editable: false, info: "Permeate water pressure Pp [bar],normally Pp = 0" },
    { key: "PV", value: [1000, 1000], editable: false, info: "Pressure vessels in the stage PV" },
    { key: "b", value:  [1000, 1000], editable: false, info: "Booster pressure ratio b,b ≈1.1 ~ 2.5 with booster pump,b ≈ 0.99 without booster pump" },
    { key: "-", value: [0, 0], editable: false, info: "" },
    // F
  ],
  [
    { key: "M0", value: [4000], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "S0", value: [4000], editable: false, info: "Raw water salinity S0 [g/l]" },
    { key: "Sd", value: [4000], editable: false, info: "Product water salinity Sd [g/l]" },
    { key: "l", value: [4000], editable: false, info: "Brine return ratio l, where Mr= l*M0 Recommended range: 0 ~ 1" },
    { key: "-", value: [0], editable: false, info: "" },
    // F
  ],
  [
    { key: "Md", value: [4000], editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "WR", value: [4000], editable: false, info: "Water recovery WR [%],100*Md/M0" },
    { key: "SEC", value: [4000], editable: false, info: "Specific exergy consumption SEC [MJ/t],where 1 [kWh] = 3.6 [MJ]" },
    { key: "sA", value: [4000], editable: false, info: "Specific active area sA [m2/(t/h)]" },
    { key: "SR", value: [4000], editable: false, info: "Overal salt rejection SR [%]" },
    // F
  ],
];

export const StationValueData = ROBbaseColumns;
